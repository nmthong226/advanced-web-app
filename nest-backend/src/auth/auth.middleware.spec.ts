// src/auth/auth.middleware.ts

import { Injectable, NestMiddleware, UnauthorizedException, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import jwksClient, { SigningKey } from 'jwks-rsa';
import { ConfigService } from '@nestjs/config';
import { promisify } from 'util';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  private readonly logger = new Logger(AuthMiddleware.name);
  private readonly jwks: jwksClient.JwksClient;
  private readonly getSigningKeyAsync: (kid: string) => Promise<SigningKey>;

  constructor(private readonly configService: ConfigService) {
    const jwksUri = this.configService.get<string>('CLERK_JWKS_URI');
    if (!jwksUri) {
      throw new Error('CLERK_JWKS_URI is not defined in environment variables.');
    }

    this.jwks = jwksClient({
      jwksUri,
      cache: true,
      cacheMaxEntries: 5, // Default value
      cacheMaxAge: 10 * 60 * 1000, // 10 minutes
    });

    // Promisify getSigningKey
    this.getSigningKeyAsync = promisify(this.jwks.getSigningKey).bind(this.jwks);
  }

  async use(req: Request, res: Response, next: NextFunction) {
    this.logger.debug('AuthMiddleware invoked.');

    const tokenSameOrigin = req.cookies?.__session;
    const authHeader = req.headers.authorization;
    const tokenCrossOrigin = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : undefined;

    const token = tokenSameOrigin || tokenCrossOrigin;

    if (!token) {
      this.logger.warn('No session token found.');
      throw new UnauthorizedException('Not signed in.');
    }

    // Decode the token header to get the kid
    const decodedHeader = jwt.decode(token, { complete: true });
    if (!decodedHeader || typeof decodedHeader === 'string' || !decodedHeader.header.kid) {
      this.logger.warn('Invalid token format or missing kid.');
      throw new UnauthorizedException('Invalid token.');
    }

    const kid = decodedHeader.header.kid;

    let key: SigningKey;
    try {
      key = await this.getSigningKeyAsync(kid);
    } catch (err) {
      this.logger.error(`Error fetching signing key: ${err.message}`);
      throw new UnauthorizedException('Invalid token signature.');
    }

    const publicKey = key.getPublicKey();

    let decoded: jwt.JwtPayload;
    try {
      decoded = jwt.verify(token, publicKey, { algorithms: ['RS256'] }) as jwt.JwtPayload;
    } catch (err) {
      this.logger.warn(`Token verification failed: ${err.message}`);
      throw new UnauthorizedException('Token verification failed.');
    }

    // Validate claims
    const currentTime = Math.floor(Date.now() / 1000);

    if (decoded.exp && decoded.exp < currentTime) {
      this.logger.warn('Token has expired.');
      throw new UnauthorizedException('Token has expired.');
    }

    if (decoded.nbf && decoded.nbf > currentTime) {
      this.logger.warn('Token not yet valid.');
      throw new UnauthorizedException('Token not yet valid.');
    }

    const permittedOrigins = this.configService.get<string>('PERMITTED_ORIGINS')?.split(',').map(origin => origin.trim()) || [];
    if (decoded.azp && !permittedOrigins.includes(decoded.azp)) {
      this.logger.warn(`Invalid azp claim: ${decoded.azp}`);
      throw new UnauthorizedException('Invalid authorized party.');
    }

    // Attach user information to the request object
    req['user'] = {
      userId: decoded.sub,
      sessionId: decoded.sid,
      // Add other relevant claims as needed
    };

    this.logger.debug('Authentication successful.');
    next();
  }
}
