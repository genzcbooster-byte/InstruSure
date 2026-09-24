import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Clock } from 'lucide-react';
import { CertificateStatus } from '../types/metrochain';

interface StatusBadgeProps {
  status: CertificateStatus;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  switch (status) {
    case 'valid':
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded px-2.5 py-0.5 ${
            size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-sm py-1 px-3' : 'text-xs'
          }`}
        >
          <CheckCircle2 className={size === 'lg' ? 'w-4 h-4 text-emerald-600' : 'w-3.5 h-3.5 text-emerald-600'} />
          <span>VALID & VERIFIED</span>
        </span>
      );
    case 'expiring':
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-semibold text-amber-900 bg-amber-50 border border-amber-300 rounded px-2.5 py-0.5 ${
            size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-sm py-1 px-3' : 'text-xs'
          }`}
        >
          <Clock className={size === 'lg' ? 'w-4 h-4 text-amber-600' : 'w-3.5 h-3.5 text-amber-600'} />
          <span>EXPIRING SOON</span>
        </span>
      );
    case 'expired':
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-semibold text-red-800 bg-red-50 border border-red-200 rounded px-2.5 py-0.5 ${
            size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-sm py-1 px-3' : 'text-xs'
          }`}
        >
          <XCircle className={size === 'lg' ? 'w-4 h-4 text-red-600' : 'w-3.5 h-3.5 text-red-600'} />
          <span>EXPIRED / NON-COMPLIANT</span>
        </span>
      );
    case 'revoked':
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-semibold text-slate-800 bg-slate-100 border border-slate-300 rounded px-2.5 py-0.5 ${
            size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-sm py-1 px-3' : 'text-xs'
          }`}
        >
          <AlertTriangle className={size === 'lg' ? 'w-4 h-4 text-slate-600' : 'w-3.5 h-3.5 text-slate-600'} />
          <span>REVOKED / SEALS BROKEN</span>
        </span>
      );
    default:
      return null;
  }
};
