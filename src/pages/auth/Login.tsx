import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { Mail, Lock, Eye, EyeOff, Sparkles, AlertCircle } from 'lucide-react';

import { authService } from '../../services/authService';
import { useAuthStore } from '../../store/authStore';
import Input from '../../components/Input';
import Button from '../../components/Button';

// Validation Schema
const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const loginSuccess = useAuthStore((state) => state.loginSuccess);

  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { register, handleSubmit, setValue, formState: { errors }, trigger } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Login Mutation using TanStack Query
  const loginMutation = useMutation({
    mutationFn: ({ email, password }: LoginFormValues) => authService.login(email, password),
    onSuccess: (res) => {
      if (res.success && res.data) {
        loginSuccess(res.data.user);
        navigate('/dashboard');
      } else {
        setErrorMessage(res.message);
      }
    },
    onError: () => {
      setErrorMessage('An unexpected validation error occurred. Please try again.');
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    setErrorMessage(null);
    loginMutation.mutate(data);
  };

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  // Quick fill tester credentials helper
  const handleQuickFill = async (type: 'standard' | 'premium' | 'wealth') => {
    setErrorMessage(null);
    if (type === 'standard') {
      setValue('email', 'alex.mercer@finverse.com');
      setValue('password', 'password123');
    } else if (type === 'premium') {
      setValue('email', 'premium.sterling@finverse.com');
      setValue('password', 'password123');
    } else {
      setValue('email', 'wealth.wayne@finverse.com');
      setValue('password', 'password123');
    }
    // Re-validate fields after filling
    await trigger(['email', 'password']);
  };

  return (
    <div className="flex flex-col">
      {/* Title Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-banking-indigo-500/10 border border-banking-indigo-500/20 text-banking-indigo-400 text-xs font-semibold mb-4">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" /> Unified Banking Sandbox
        </div>
        <h2 className="font-display font-bold text-2xl text-white">Access Your Ecosystem</h2>
        <p className="text-banking-slate-400 text-sm mt-2">Enter credentials to authenticate into the core network.</p>
      </div>

      {/* Global Error Banner */}
      {errorMessage && (
        <div className="mb-6 flex items-start gap-3 p-4 rounded-xl bg-red-950/30 border border-red-500/20 text-red-400 text-sm animate-[fadeIn_0.2s_ease-out]">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input
          {...register('email')}
          id="email"
          label="Email Address"
          type="email"
          placeholder="your.name@finverse.com"
          error={errors.email?.message}
          disabled={loginMutation.isPending}
          startIcon={<Mail className="w-4 h-4" />}
          fullWidth
        />

        <Input
          {...register('password')}
          id="password"
          label="Security Password"
          type={showPassword ? 'text' : 'password'}
          placeholder="••••••••••••"
          error={errors.password?.message}
          disabled={loginMutation.isPending}
          startIcon={<Lock className="w-4 h-4" />}
          endIcon={
            <button
              type="button"
              onClick={handleTogglePassword}
              disabled={loginMutation.isPending}
              className="text-banking-slate-400 hover:text-banking-slate-200 focus:outline-none"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          }
          fullWidth
        />

        {/* Forgot password link */}
        <div className="flex items-center justify-between text-xs">
          <label className="flex items-center gap-2 cursor-pointer select-none text-banking-slate-400 hover:text-banking-slate-200">
            <input
              type="checkbox"
              defaultChecked
              disabled={loginMutation.isPending}
              className="w-4 h-4 rounded bg-banking-slate-900 border-banking-slate-700 text-banking-indigo-600 focus:ring-banking-indigo-500 focus:ring-offset-banking-slate-950"
            />
            Keep me signed in
          </label>
          <button
            type="button"
            onClick={() => navigate('/forgot-password')}
            disabled={loginMutation.isPending}
            className="font-bold text-banking-indigo-400 hover:text-banking-indigo-300 focus:outline-none"
          >
            Forgot Password?
          </button>
        </div>

        {/* Action Button */}
        <Button
          type="submit"
          isLoading={loginMutation.isPending}
          fullWidth
          className="mt-6"
        >
          Sign In to Portal
        </Button>
      </form>

      {/* Sign Up Redirect Link */}
      <div className="mt-5 text-center text-sm text-banking-slate-400">
        Don't have an account?{' '}
        <button
          type="button"
          onClick={() => navigate('/register')}
          disabled={loginMutation.isPending}
          className="font-bold text-banking-indigo-400 hover:text-banking-indigo-300 focus:outline-none"
        >
          Sign Up Now
        </button>
      </div>

      {/* Demo Credentials Quick-Fill helper */}
      <div className="mt-8 pt-6 border-t border-banking-slate-800/80">
        <p className="text-center text-xs font-semibold text-banking-slate-400 mb-3.5">
          💡 Quick-Fill Tester Profiles (Password: password123)
        </p>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => handleQuickFill('standard')}
            disabled={loginMutation.isPending}
            className="px-2 py-2 text-xs font-semibold text-banking-slate-300 border border-banking-slate-800 hover:bg-banking-slate-800/40 rounded-xl transition duration-150"
          >
            Standard
          </button>
          <button
            type="button"
            onClick={() => handleQuickFill('premium')}
            disabled={loginMutation.isPending}
            className="px-2 py-2 text-xs font-semibold text-banking-cyan-400 border border-banking-slate-800 hover:bg-banking-slate-800/40 rounded-xl transition duration-150"
          >
            Premium
          </button>
          <button
            type="button"
            onClick={() => handleQuickFill('wealth')}
            disabled={loginMutation.isPending}
            className="px-2 py-2 text-xs font-semibold text-banking-indigo-400 border border-banking-slate-800 hover:bg-banking-slate-800/40 rounded-xl transition duration-150"
          >
            Wealth
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
