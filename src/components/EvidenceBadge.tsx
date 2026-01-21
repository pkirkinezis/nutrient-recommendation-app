import React from 'react';
import { ShieldCheck, ShieldAlert, ShieldQuestion, ScrollText } from 'lucide-react';
import { EvidenceLevel } from '../types';

interface EvidenceBadgeProps {
  level: EvidenceLevel;
}

export const EvidenceBadge: React.FC<EvidenceBadgeProps> = ({ level }) => {
  const getConfig = (level: EvidenceLevel) => {
    switch (level) {
      case 'Strong':
        return {
          color: 'bg-green-100 text-green-800 border-green-200',
          icon: <ShieldCheck className="w-4 h-4 mr-1" />,
          label: 'Strong Evidence'
        };
      case 'Moderate':
        return {
          color: 'bg-blue-100 text-blue-800 border-blue-200',
          icon: <ShieldAlert className="w-4 h-4 mr-1" />,
          label: 'Moderate Evidence'
        };
      case 'Limited':
        return {
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          icon: <ShieldQuestion className="w-4 h-4 mr-1" />,
          label: 'Limited Evidence'
        };
      case 'Traditional':
        return {
          color: 'bg-orange-100 text-orange-800 border-orange-200',
          icon: <ScrollText className="w-4 h-4 mr-1" />,
          label: 'Traditional Use'
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800',
          icon: null,
          label: level
        };
    }
  };

  const config = getConfig(level);

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.color}`}>
      {config.icon}
      {config.label}
    </span>
  );
};
