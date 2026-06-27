import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { Mail, Lock, Eye, EyeOff, Sparkles, AlertCircle, User as UserIcon, Gem, Award, CheckCircle2 } from 'lucide-react';
import { useDispatch } from 'react-redux';

import { authService } from '../../services/authService';
import { useAuthStore } from '../../store/authStore';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { addNotification } from '../../store/slices/notificationsSlice';

// Password Strength Regex matching backend:
// - At least one uppercase letter
// - At least one lowercase letter
// - At least one digit
// - At least one special character from @$!%*?&
// - Length between 3 and 20
const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&]).{3,20}$/;

const registerSchema = z.object({
  fullname: z.string()
    .min(3, 'Full name must be at least 3 characters')
    .max(100, 'Full name must be under 100 characters'),
  email: z.string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z.string()
    .min(3, 'Password must be at least 3 characters')
    .max(20, 'Password must be under 20 characters')
    .regex(passwordRegex, 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)'),
  tier: z.enum(['Standard', 'Premium', 'Wealth']),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loginSuccess = useAuthStore((state) => state.loginSuccess);

  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullname: '',
      email: '',
      password: '',
      tier: 'Standard',
    },
  });

  const selectedTier = watch('tier');

  // Register Mutation using TanStack Query
  const registerMutation = useMutation({
    mutationFn: (data: RegisterFormValues) => 
      authService.register(data.fullname, data.email, data.password, data.tier),
    onSuccess: (res) => {
      if (res.success && res.data) {
        // Sync with global store
        loginSuccess(res.data.user);
        
        // Dispatch to Redux notifications slice for standard visual notification toast
        dispatch(
          addNotification({
            title: 'Account Created!',
            message: `Welcome to FinVerse, ${res.data.user.name}! Your ${res.data.user.tier} membership is now active.`,
            type: 'success',
          })
        );
        
        navigate('/dashboard');
      } else {
        setErrorMessage(res.message);
      }
    },
    onError: (error: any) => {
      setErrorMessage(error.message || 'An unexpected error occurred. Please try again.');
    },
  });

  const onSubmit = (data: RegisterFormValues) => {
    setErrorMessage(null);
    registerMutation.mutate(data);
  };

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const tiers = [
    {
      id: 'Standard' as const,
      title: 'Standard',
      price: '$0/mo',
      desc: 'Foundation Banking',
      icon: Award,
      colorClass: 'text-emerald-400 border-emerald-500/30',
      activeColorClass: 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-950/20',
      hoverColorClass: 'hover:border-emerald-500/50',
    },
    {
      id: 'Premium' as const,
      title: 'Premium',
      price: '$9.99/mo',
      desc: 'Priority Wealth tools',
      icon: Gem,
      colorClass: 'text-banking-cyan-400 border-banking-cyan-500/30',
      activeColorClass: 'border-banking-cyan-500 ring-2 ring-banking-cyan-500/20 bg-banking-cyan-950/20',
      hoverColorClass: 'hover:border-banking-cyan-500/50',
    },
    {
      id: 'Wealth' as const,
      title: 'Wealth',
      price: '$29.99/mo',
      desc: 'Advisory Panel',
      icon: Sparkles,
      colorClass: 'text-banking-indigo-400 border-banking-indigo-500/30',
      activeColorClass: 'border-banking-indigo-500 ring-2 ring-banking-indigo-500/20 bg-banking-indigo-950/20',
      hoverColorClass: 'hover:border-banking-indigo-500/50',
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Title Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-banking-indigo-500/10 border border-banking-indigo-500/20 text-banking-indigo-400 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" /> Create Your Profile
        </div>
        <h2 className="font-display font-bold text-2xl text-white">Join the FinVerse Ecosystem</h2>
        <p className="text-banking-slate-400 text-sm mt-2">Configure your credentials and establish a secure, interest-bearing node.</p>
      </div>

      {/* Global Error Banner */}
      {errorMessage && (
        <div className="mb-5 flex items-start gap-3 p-4 rounded-xl bg-red-950/30 border border-red-500/20 text-red-400 text-sm animate-[fadeIn_0.2s_ease-out]">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          {...register('fullname')}
          id="fullname"
          label="Full Name"
          type="text"
          placeholder="John Doe"
          error={errors.fullname?.message}
          disabled={registerMutation.isPending}
          startIcon={<UserIcon className="w-4 h-4" />}
          fullWidth
        />

        <Input
          {...register('email')}
          id="email"
          label="Email Address"
          type="email"
          placeholder="your.name@finverse.com"
          error={errors.email?.message}
          disabled={registerMutation.isPending}
          startIcon={<Mail className="w-4 h-4" />}
          fullWidth
        />

        <Input
          {...register('password')}
          id="password"
          label="Choose Password"
          type={showPassword ? 'text' : 'password'}
          placeholder="••••••••••••"
          error={errors.password?.message}
          disabled={registerMutation.isPending}
          startIcon={<Lock className="w-4 h-4" />}
          endIcon={
            <button
              type="button"
              onClick={handleTogglePassword}
              disabled={registerMutation.isPending}
              className="text-banking-slate-400 hover:text-banking-slate-200 focus:outline-none"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          }
          fullWidth
        />

        {/* Membership Tier Cards selection */}
        <div className="pt-2">
          <label className="block text-xs font-semibold text-banking-slate-400 uppercase tracking-wider mb-2">
            Select Membership Tier
          </label>
          <div className="grid grid-cols-3 gap-3">
            {tiers.map((t) => {
              const TierIcon = t.icon;
              const isSelected = selectedTier === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => !registerMutation.isPending && setValue('tier', t.id)}
                  className={`flex flex-col items-center justify-center p-3.5 border rounded-xl transition duration-200 focus:outline-none text-center ${
                    isSelected ? t.activeColorClass : `border-banking-slate-800 bg-transparent ${t.hoverColorClass}`
                  }`}
                >
                  <div className={`mb-1.5 ${t.colorClass}`}>
                    <TierIcon className="w-5.5 h-5.5" />
                  </div>
                  <span className="font-display font-bold text-xs text-white block">
                    {t.title}
                  </span>
                  <span className="text-[10px] font-semibold text-banking-slate-400 block mt-0.5">
                    {t.price}
                  </span>
                </button>
              );
            })}
          </div>
          {errors.tier?.message && (
            <p className="text-xs text-red-500 mt-1.5">{errors.tier.message}</p>
          )}
        </div>

        {/* Action Button */}
        <Button
          type="submit"
          isLoading={registerMutation.isPending}
          fullWidth
          className="mt-6"
        >
          Create Digital Account
        </Button>
      </form>

      {/* Redirect back to Login */}
      <div className="mt-6 text-center text-sm text-banking-slate-400">
        Already have an account?{' '}
        <button
          type="button"
          onClick={() => navigate('/login')}
          disabled={registerMutation.isPending}
          className="font-bold text-banking-indigo-400 hover:text-banking-indigo-300 focus:outline-none"
        >
          Login Instead
        </button>
      </div>
    </div>
  );
};

export default Register;
