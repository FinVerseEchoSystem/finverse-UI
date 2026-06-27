import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { Mail, ShieldAlert, KeyRound, AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react';

import { authService } from '../../services/authService';
import StepIndicator from '../../components/StepIndicator';
import Input from '../../components/Input';
import Button from '../../components/Button';

// Step 1 Schema: Request Reset
const requestSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
});
type RequestFormValues = z.infer<typeof requestSchema>;

// Step 2 Schema: OTP verification
const otpSchema = z.object({
  otp: z.string().length(6, 'Verification code must be exactly 6 digits').regex(/^\d+$/, 'Verification code must only contain numbers'),
});
type OtpFormValues = z.infer<typeof otpSchema>;

// Step 3 Schema: Password Reset
const resetPasswordSchema = z.object({
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});
type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [emailAddress, setEmailAddress] = useState('');
  const [otpToken, setOtpToken] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const stepsList = ['Request', 'Verify OTP', 'Reset'];

  // Form Hooks
  const { register: regRequest, handleSubmit: handleRequestSubmit, formState: { errors: requestErrors } } = useForm<RequestFormValues>({
    resolver: zodResolver(requestSchema),
  });

  const { register: regOtp, handleSubmit: handleOtpSubmit, formState: { errors: otpErrors } } = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
  });

  const { register: regReset, handleSubmit: handleResetSubmit, formState: { errors: resetErrors } } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  // Mutations
  const requestMutation = useMutation({
    mutationFn: (data: RequestFormValues) => authService.forgotPassword(data.email),
    onSuccess: (res, variables) => {
      if (res.success && res.data) {
        setEmailAddress(variables.email);
        setOtpToken(res.data.otpToken);
        setSuccessMessage(res.message);
        setCurrentStep(2);
      } else {
        setErrorMessage(res.message);
      }
    },
    onError: () => {
      setErrorMessage('Communication error. Failed to dispatch verification token.');
    },
  });

  const verifyOtpMutation = useMutation({
    mutationFn: (data: OtpFormValues) => authService.verifyOtp(data.otp, otpToken),
    onSuccess: (res) => {
      if (res.success && res.data) {
        setResetToken(res.data.resetToken);
        setSuccessMessage(res.message);
        setCurrentStep(3);
      } else {
        setErrorMessage(res.message);
      }
    },
    onError: () => {
      setErrorMessage('Failed to verify OTP code.');
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: (data: ResetPasswordFormValues) => authService.resetPassword(data.password, resetToken),
    onSuccess: (res) => {
      if (res.success) {
        setSuccessMessage(res.message);
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      } else {
        setErrorMessage(res.message);
      }
    },
    onError: () => {
      setErrorMessage('Failed to reset password.');
    },
  });

  // Submits
  const onRequestSubmit = (data: RequestFormValues) => {
    setErrorMessage(null);
    setSuccessMessage(null);
    requestMutation.mutate(data);
  };

  const onOtpSubmit = (data: OtpFormValues) => {
    setErrorMessage(null);
    setSuccessMessage(null);
    verifyOtpMutation.mutate(data);
  };

  const onResetSubmit = (data: ResetPasswordFormValues) => {
    setErrorMessage(null);
    setSuccessMessage(null);
    resetPasswordMutation.mutate(data);
  };

  return (
    <div className="flex flex-col">
      {/* Title */}
      <div className="text-center mb-8">
        <h2 className="font-display font-bold text-2xl text-white">Reset Security Credentials</h2>
        <p className="text-banking-slate-400 text-sm mt-2">
          {currentStep === 1 && 'Provide account email to initiate authorization recovery.'}
          {currentStep === 2 && `Enter the 6-digit code dispatched to ${emailAddress}.`}
          {currentStep === 3 && 'Configure your new core portal passwords.'}
        </p>
      </div>

      {/* Step Indicator */}
      <div className="px-4">
        <StepIndicator currentStep={currentStep} steps={stepsList} />
      </div>

      {/* Banners */}
      {errorMessage && (
        <div className="mt-8 mb-6 flex items-start gap-3 p-4 rounded-xl bg-red-950/30 border border-red-500/20 text-red-400 text-sm animate-[fadeIn_0.2s_ease-out]">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="mt-8 mb-6 flex items-start gap-3 p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/20 text-emerald-400 text-sm animate-[fadeIn_0.2s_ease-out]">
          <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Steps Render */}
      <div className={errorMessage || successMessage ? '' : 'mt-8'}>
        {currentStep === 1 && (
          <form onSubmit={handleRequestSubmit(onRequestSubmit)} className="space-y-6">
            <Input
              {...regRequest('email')}
              id="email"
              label="Account Email Address"
              type="email"
              placeholder="alex.mercer@finverse.com"
              error={requestErrors.email?.message}
              disabled={requestMutation.isPending}
              startIcon={<Mail className="w-4 h-4" />}
              fullWidth
            />
            <Button
              type="submit"
              isLoading={requestMutation.isPending}
              fullWidth
            >
              Dispatch Recovery Code
            </Button>
          </form>
        )}

        {currentStep === 2 && (
          <form onSubmit={handleOtpSubmit(onOtpSubmit)} className="space-y-6">
            <Input
              {...regOtp('otp')}
              id="otp"
              label="6-Digit Verification Code"
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="000000"
              error={otpErrors.otp?.message}
              disabled={verifyOtpMutation.isPending}
              startIcon={<ShieldAlert className="w-4 h-4" />}
              fullWidth
            />
            
            <p className="text-center text-xs text-banking-slate-400">
              💡 Hint: Enter <span className="font-extrabold text-banking-indigo-400">123456</span> to pass the verification screen.
            </p>

            <Button
              type="submit"
              isLoading={verifyOtpMutation.isPending}
              fullWidth
            >
              Verify Security Code
            </Button>
          </form>
        )}

        {currentStep === 3 && (
          <form onSubmit={handleResetSubmit(onResetSubmit)} className="space-y-6">
            <Input
              {...regReset('password')}
              id="password"
              label="New Portal Password"
              type="password"
              placeholder="••••••••"
              error={resetErrors.password?.message}
              disabled={resetPasswordMutation.isPending}
              startIcon={<KeyRound className="w-4 h-4" />}
              fullWidth
            />
            <Input
              {...regReset('confirmPassword')}
              id="confirmPassword"
              label="Confirm Portal Password"
              type="password"
              placeholder="••••••••"
              error={resetErrors.confirmPassword?.message}
              disabled={resetPasswordMutation.isPending}
              startIcon={<KeyRound className="w-4 h-4" />}
              fullWidth
            />
            <Button
              type="submit"
              isLoading={resetPasswordMutation.isPending}
              fullWidth
            >
              Update Security Password
            </Button>
          </form>
        )}
      </div>

      {/* Return to Login */}
      {currentStep === 1 && (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="flex items-center gap-1.5 text-xs font-semibold text-banking-slate-400 hover:text-white transition duration-150"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Authentication Page
          </button>
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;
