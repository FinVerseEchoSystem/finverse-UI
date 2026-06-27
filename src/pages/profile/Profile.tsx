import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { 
  User as UserIcon, 
  Phone, 
  MapPin, 
  Upload, 
  CheckCircle, 
  AlertCircle,
  Shield,
  Clock,
  Mail
} from 'lucide-react';

import { authService } from '../../services/authService';
import { useAuthStore } from '../../store/authStore';
import Input from '../../components/Input';
import Button from '../../components/Button';

// Validation Schema
const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(1, 'Phone number is required'),
  address: z.string().min(1, 'Address is required'),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export const Profile: React.FC = () => {
  const { user, updateUser } = useAuthStore();
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      phone: '',
      address: '',
    },
  });

  // Load user values on mount or user change
  useEffect(() => {
    if (user) {
      setValue('name', user.name);
      setValue('phone', user.phone || '');
      setValue('address', user.address || '');
      setAvatarPreview(user.avatarUrl);
    }
  }, [user, setValue]);

  // Profile Mutation
  const updateProfileMutation = useMutation({
    mutationFn: (data: ProfileFormValues & { avatarUrl: string | null }) => 
      authService.updateProfile({
        name: data.name,
        phone: data.phone,
        address: data.address,
        avatarUrl: data.avatarUrl,
      }),
    onSuccess: (res) => {
      if (res.success && res.data) {
        updateUser(res.data);
        setSuccessMessage('Your profile has been updated successfully.');
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setErrorMessage(res.message);
      }
    },
    onError: () => {
      setErrorMessage('Failed to connect to authentication node.');
    },
  });

  // Avatar Upload Local Handler
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setErrorMessage('File size must be smaller than 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (data: ProfileFormValues) => {
    setErrorMessage(null);
    setSuccessMessage(null);
    updateProfileMutation.mutate({
      ...data,
      avatarUrl: avatarPreview,
    });
  };

  const formatJoinedDate = (dateStr?: string) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!user) {
    return (
      <div className="text-center py-10 text-banking-slate-400">
        Authentication session required to load profile view.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column: User Summary Card */}
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-banking-slate-900/30 border border-banking-slate-800/80 rounded-2xl p-6 text-center shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-banking-indigo-500 to-banking-cyan-500" />
          
          {/* Avatar Area */}
          <div className="relative w-28 h-28 mx-auto mt-4 mb-6 group">
            <div className="w-full h-full rounded-full bg-banking-slate-900 border-2 border-banking-indigo-500/30 flex items-center justify-center overflow-hidden">
              {avatarPreview ? (
                <img src={avatarPreview} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <UserIcon className="w-10 h-10 text-banking-indigo-400" />
              )}
            </div>
            {/* Hover overlay for upload */}
            <label className="absolute inset-0 rounded-full bg-black/60 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity duration-200">
              <Upload className="w-5 h-5 mb-1" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Change</span>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleAvatarChange} 
                className="hidden" 
              />
            </label>
          </div>

          <h4 className="font-display font-bold text-lg text-white">{user.name}</h4>
          
          <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-banking-indigo-500/10 border border-banking-indigo-500/20 text-banking-indigo-400">
            <Shield className="w-3 h-3" /> {user.tier} Tier Account
          </div>

          <div className="mt-8 pt-6 border-t border-banking-slate-800/60 text-left text-xs space-y-3.5 text-banking-slate-400">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-banking-slate-500 shrink-0" />
              <span className="truncate">{user.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-banking-slate-500 shrink-0" />
              <span>Joined: {formatJoinedDate(user.createdAt)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Edit Profile Form */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-banking-slate-900/20 border border-banking-slate-800/80 rounded-2xl p-6 sm:p-8 shadow-xl">
          <div className="mb-6">
            <h4 className="font-display font-bold text-lg text-white">Security Profile Management</h4>
            <p className="text-banking-slate-400 text-xs mt-1">
              Update personal identity information registered to your financial account.
            </p>
          </div>

          {successMessage && (
            <div className="mb-6 flex items-center gap-3 p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/20 text-emerald-400 text-sm animate-[fadeIn_0.2s_ease-out]">
              <CheckCircle className="w-5 h-5 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {errorMessage && (
            <div className="mb-6 flex items-center gap-3 p-4 rounded-xl bg-red-950/30 border border-red-500/20 text-red-400 text-sm animate-[fadeIn_0.2s_ease-out]">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                {...register('name')}
                id="name"
                label="Full Registered Name"
                placeholder="Alex Mercer"
                error={errors.name?.message}
                disabled={updateProfileMutation.isPending}
                startIcon={<UserIcon className="w-4 h-4" />}
                fullWidth
              />

              <Input
                {...register('phone')}
                id="phone"
                label="Contact Phone Number"
                placeholder="+1 (555) 019-2834"
                error={errors.phone?.message}
                disabled={updateProfileMutation.isPending}
                startIcon={<Phone className="w-4 h-4" />}
                fullWidth
              />
            </div>

            <Input
              {...register('address')}
              id="address"
              label="Primary Residential Address"
              placeholder="128 Pine St, San Francisco, CA 94103"
              error={errors.address?.message}
              disabled={updateProfileMutation.isPending}
              startIcon={<MapPin className="w-4 h-4" />}
              fullWidth
            />

            <div className="flex justify-end pt-4 border-t border-banking-slate-800/80">
              <Button
                type="submit"
                isLoading={updateProfileMutation.isPending}
                className="px-6"
              >
                Save Profile Changes
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
