import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Laptop, 
  Smartphone, 
  Globe, 
  Trash2, 
  CheckCircle, 
  AlertTriangle,
  Loader2,
  ShieldCheck,
  MapPin,
  Calendar
} from 'lucide-react';

import { authService } from '../services/authService';
import { Session } from '../types/auth';
import Button from '../components/Button';

export const Sessions: React.FC = () => {
  const queryClient = useQueryClient();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Fetch active sessions
  const { data: response, isLoading, isError } = useQuery({
    queryKey: ['sessions'],
    queryFn: () => authService.getSessions(),
  });

  const sessions = response?.data || [];

  // Revoke session mutation with optimistic updates
  const revokeMutation = useMutation({
    mutationFn: (sessionId: string) => authService.revokeSession(sessionId),
    onMutate: async (revokedSessionId) => {
      setErrorMessage(null);
      
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['sessions'] });

      // Snapshot the previous sessions list
      const previousSessions = queryClient.getQueryData<{ data: Session[] }>(['sessions']);

      // Optimistically update cache by removing the session
      if (previousSessions) {
        queryClient.setQueryData(['sessions'], {
          ...previousSessions,
          data: previousSessions.data.filter((s) => s.id !== revokedSessionId),
        });
      }

      // Return context containing previous value for rollback
      return { previousSessions };
    },
    onError: (err, variables, context) => {
      // Rollback to previous state on error
      if (context?.previousSessions) {
        queryClient.setQueryData(['sessions'], context.previousSessions);
      }
      setErrorMessage('Failed to terminate session. Please try again.');
    },
    onSuccess: (res) => {
      if (res.success) {
        setSuccessMessage('Session terminated successfully.');
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setErrorMessage(res.message);
      }
    },
    onSettled: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
    },
  });

  const handleRevoke = (sessionId: string) => {
    if (confirm('Are you sure you want to terminate this session? This will force the device to log out.')) {
      revokeMutation.mutate(sessionId);
    }
  };

  const getDeviceIcon = (deviceStr: string) => {
    const lower = deviceStr.toLowerCase();
    if (lower.includes('iphone') || lower.includes('android') || lower.includes('phone') || lower.includes('ios')) {
      return <Smartphone className="w-5 h-5 text-banking-cyan-400" />;
    }
    return <Laptop className="w-5 h-5 text-banking-indigo-400" />;
  };

  const formatLastActive = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <Loader2 className="w-8 h-8 text-banking-indigo-500 animate-spin" />
        <p className="text-banking-slate-400 text-sm">Retrieving active system sessions...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3 text-red-400 bg-red-950/20 border border-red-500/20 rounded-2xl">
        <AlertTriangle className="w-8 h-8" />
        <p className="text-sm font-semibold">Failed to fetch session tokens.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h3 className="font-display font-bold text-xl text-white">Active Portal Sessions</h3>
        <p className="text-banking-slate-400 text-sm mt-1">
          Review and manage the devices authorized to access your financial portfolio.
        </p>
      </div>

      {/* Notifications */}
      {successMessage && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/20 text-emerald-400 text-sm animate-[fadeIn_0.2s_ease-out]">
          <CheckCircle className="w-5 h-5 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-red-950/30 border border-red-500/20 text-red-400 text-sm animate-[fadeIn_0.2s_ease-out]">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Table / Card List */}
      <div className="bg-banking-slate-900/20 border border-banking-slate-800/80 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-banking-slate-800/80 bg-banking-slate-900/30 text-xs uppercase font-extrabold tracking-wider text-banking-slate-400">
                <th className="py-4 px-6">Device</th>
                <th className="py-4 px-6">IP Address</th>
                <th className="py-4 px-6">Location</th>
                <th className="py-4 px-6">Last Active</th>
                <th className="py-4 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-banking-slate-800/40 text-sm text-banking-slate-200">
              {sessions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-banking-slate-500">
                    No active sessions found.
                  </td>
                </tr>
              ) : (
                sessions.map((session) => (
                  <tr 
                    key={session.id} 
                    className={`hover:bg-banking-slate-900/20 transition-all duration-150 ${
                      session.isCurrent ? 'bg-banking-indigo-500/5' : ''
                    }`}
                  >
                    {/* Device Cell */}
                    <td className="py-4.5 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-banking-slate-900 border border-banking-slate-800 flex items-center justify-center">
                          {getDeviceIcon(session.device)}
                        </div>
                        <div>
                          <span className="font-semibold text-white block">{session.device}</span>
                          {session.isCurrent && (
                            <span className="inline-flex items-center gap-1 mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide bg-banking-indigo-500/10 border border-banking-indigo-500/20 text-banking-indigo-400">
                              <ShieldCheck className="w-3 h-3" /> Current Session
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* IP Cell */}
                    <td className="py-4.5 px-6 font-mono text-xs text-banking-slate-400">
                      <div className="flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5 text-banking-slate-500" />
                        {session.ipAddress}
                      </div>
                    </td>

                    {/* Location Cell */}
                    <td className="py-4.5 px-6 text-banking-slate-300">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-banking-slate-500" />
                        {session.location}
                      </div>
                    </td>

                    {/* Last Active Cell */}
                    <td className="py-4.5 px-6 text-banking-slate-300">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-banking-slate-500" />
                        {session.isCurrent ? 'Now' : formatLastActive(session.lastActive)}
                      </div>
                    </td>

                    {/* Action Button Cell */}
                    <td className="py-4.5 px-6 text-right">
                      {session.isCurrent ? (
                        <span className="text-xs font-semibold text-banking-slate-500 px-3 py-1.5">
                          In Use
                        </span>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRevoke(session.id)}
                          isLoading={revokeMutation.isPending && revokeMutation.variables === session.id}
                          className="text-red-400 hover:bg-red-950/20 hover:text-red-300 !px-2.5"
                        >
                          <Trash2 className="w-4 h-4 mr-1.5" /> Terminate
                        </Button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Sessions;
