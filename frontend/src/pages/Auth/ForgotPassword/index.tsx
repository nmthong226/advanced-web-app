import React, { useState } from 'react';
import { useAuth, useSignIn } from '@clerk/clerk-react'; // Use Clerk React for authentication
import { useNavigate } from 'react-router-dom';
import forgotPasswordIllustration from '/forgot-password-illustration.jpg'; // Replace with your illustration
import logo from '/logo-1.png'; // Replace with your logo

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [code, setCode] = useState<string>('');
  const [successfulCreation, setSuccessfulCreation] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();
  const { isSignedIn } = useAuth();
  const { isLoaded, signIn, setActive } = useSignIn();

  if (!isLoaded) {
    return null; // Prevent rendering until Clerk is fully loaded
  }

  // Redirect to the home page if the user is already signed in
  if (isSignedIn) {
    navigate('/');
    return null;
  }

  const requestResetCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signIn?.create({
        strategy: 'reset_password_email_code',
        identifier: email,
      });
      setSuccessfulCreation(true);
    } catch (err: any) {
      setError(
        err?.errors?.[0]?.longMessage ||
          'Failed to send reset code. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const result = await signIn?.attemptFirstFactor({
        strategy: 'reset_password_email_code',
        code,
        password,
      });

      if (result?.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        navigate('/');
      }
    } catch (err: any) {
      setError(
        err?.errors?.[0]?.longMessage ||
          'Failed to reset password. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col justify-center items-center bg-indigo-50 w-full h-screen">
      {/* Header */}
      <div className="top-0 left-1/2 absolute flex flex-col items-center p-4 transform -translate-x-1/2">
        <div className="flex items-center">
          <img src={logo} alt="Logo" className="mr-2 w-6 h-6" />
          <h1 className="font-semibold text-lg">Focus Flow</h1>
        </div>
        <span className="font-normal text-sm text-gray-500 mt-1">
          Reset your password to continue
        </span>
      </div>
      {/* Main Container */}
      <div className="flex justify-between bg-white p-4 rounded-lg shadow-lg w-[800px] h-[500px]">
        {/* Illustration Section */}
        <div className="flex-1 flex flex-col justify-center items-center bg-gradient-to-b from-indigo-100 to-indigo-200 p-4 rounded-lg">
          <img
            src={forgotPasswordIllustration}
            alt="Forgot Password Illustration"
            className="w-3/4 max-h-72 object-contain"
          />
          <p className="text-center text-indigo-900 mt-4 text-sm font-medium">
            Enter your email to get a password reset code and set a new
            password.
          </p>
        </div>
        {/* Form Section */}
        <div className="flex-1 flex flex-col justify-center items-center">
          <h2 className="text-indigo-700 font-bold text-lg mb-4">
            {successfulCreation ? 'Reset Your Password' : 'Forgot Password?'}
          </h2>
          <form
            className="flex flex-col space-y-4 w-3/4"
            onSubmit={!successfulCreation ? requestResetCode : resetPassword}
          >
            {!successfulCreation && (
              <>
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="e.g., john@doe.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  required
                />
                <button
                  type="submit"
                  className="bg-indigo-700 text-white py-2 rounded-md hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  disabled={loading}
                >
                  {loading ? 'Sending...' : 'Send Reset Code'}
                </button>
                {error && <p className="text-red-500 text-sm">{error}</p>}
              </>
            )}

            {successfulCreation && (
              <>
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700"
                >
                  New Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  required
                />

                <label
                  htmlFor="code"
                  className="text-sm font-medium text-gray-700"
                >
                  Reset Code
                </label>
                <input
                  type="text"
                  id="code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  required
                />

                <button
                  type="submit"
                  className="bg-indigo-700 text-white py-2 rounded-md hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  disabled={loading}
                >
                  {loading ? 'Resetting...' : 'Reset Password'}
                </button>
                {error && <p className="text-red-500 text-sm">{error}</p>}
              </>
            )}
          </form>
        </div>
      </div>
      {/* Footer */}
      <div className="bottom-4 left-1/2 absolute flex flex-col items-center transform -translate-x-1/2">
        <p className="text-sm text-gray-500">
          &copy; 2024 Focus Flow. All rights reserved.
        </p>
        <p className="text-xs text-gray-400">
          Privacy Policy · Terms of Service
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
