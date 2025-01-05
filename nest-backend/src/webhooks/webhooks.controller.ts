import { Controller, Post, Req, Res, Headers, HttpStatus } from '@nestjs/common';
import { WebhooksService } from './webhooks.service';
import { Request, Response } from 'express';

@Controller('api/webhook')
export class WebhooksController {
  constructor(private readonly webhooksService: WebhooksService) {}

  @Post()
  async receiveWebhook(
    @Req() req: Request,
    @Res() res: Response,
    @Headers() headers: Record<string, string>,
  ) {
    try {
      await this.webhooksService.handleWebhook(req.body, headers);
      res.status(HttpStatus.OK).json({ success: true, message: 'Webhook processed' });
    } catch (err) {
      res.status(HttpStatus.BAD_REQUEST).json({ success: false, message: err.message });
    }
  }
}