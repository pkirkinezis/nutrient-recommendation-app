import React from 'react';
import { 
  Clock, 
  Utensils, 
  AlertTriangle, 
  Leaf, 
  Activity, 
  Calendar,
  Pill
} from 'lucide-react';
import { Supplement } from '../types';
import { EvidenceBadge } from './EvidenceBadge';

interface SupplementCardProps {
  supplement: Supplement;
}

export const SupplementCard: React.FC<SupplementCardProps> = ({ supplement }) => {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Vitamin': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Mineral': return 'bg-slate-50 text-slate-700 border-slate-200';
      case 'Herb': return 'bg-green-50 text-green-700 border-green-200';
      case 'Ayurveda': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'Amino Acid': return 'bg-purple-50 text-purple-700 border-purple-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="p-5 border-b border-gray-50">
        <div className="flex justify-between items-start mb-3">
          <div>
            <span className={`inline-block px-2 py-1 rounded-md text-xs font-semibold mb-2 ${getCategoryColor(supplement.category)}`}>
              {supplement.category}
            </span>
            <h3 className="text-xl font-bold text-gray-900 leading-tight">{supplement.name}</h3>
          </div>
          <EvidenceBadge level={supplement.evidenceLevel} />
        </div>
        <p className="text-gray-600 text-sm mb-3">{supplement.description}</p>
        
        {supplement.mechanism && (
          <div className="flex items-start gap-2 text-xs text-gray-500 bg-gray-50 p-2 rounded">
            <Activity className="w-3 h-3 mt-0.5 shrink-0" />
            <span><span className="font-semibold">Mechanism:</span> {supplement.mechanism}</span>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="p-5 space-y-4 flex-grow">
        
        {/* Benefits */}
        <div>
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Key Benefits</h4>
          <ul className="space-y-1">
            {supplement.benefits.slice(0, 3).map((benefit, idx) => (
              <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                {benefit}
              </li>
            ))}
          </ul>
        </div>

        {/* Usage Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-blue-50/50 p-2 rounded border border-blue-100">
            <div className="flex items-center gap-1.5 text-blue-800 text-xs font-semibold mb-1">
              <Clock className="w-3 h-3" /> Best Time
            </div>
            <p className="text-sm text-blue-900">{supplement.bestTime}</p>
          </div>
          <div className="bg-emerald-50/50 p-2 rounded border border-emerald-100">
            <div className="flex items-center gap-1.5 text-emerald-800 text-xs font-semibold mb-1">
              <Utensils className="w-3 h-3" /> With Food?
            </div>
            <p className="text-sm text-emerald-900">{supplement.withFood ? 'Yes, essential' : 'Not required'}</p>
          </div>
          <div className="bg-purple-50/50 p-2 rounded border border-purple-100">
            <div className="flex items-center gap-1.5 text-purple-800 text-xs font-semibold mb-1">
              <Pill className="w-3 h-3" /> Dosage
            </div>
            <p className="text-xs text-purple-900 leading-tight">{supplement.dosage}</p>
          </div>
           <div className="bg-amber-50/50 p-2 rounded border border-amber-100">
            <div className="flex items-center gap-1.5 text-amber-800 text-xs font-semibold mb-1">
              <Calendar className="w-3 h-3" /> Timeline
            </div>
            <p className="text-xs text-amber-900 leading-tight">{supplement.timeline}</p>
          </div>
        </div>

        {/* Food First */}
        {supplement.foodSources && supplement.foodSources.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-100">
             <div className="flex items-center gap-2 mb-2">
                <Leaf className="w-4 h-4 text-green-600" />
                <h4 className="text-sm font-bold text-gray-900">Food First Approach</h4>
             </div>
             <p className="text-xs text-gray-600 mb-2">
               Try getting this from: <span className="font-medium">{supplement.foodSources.join(', ')}</span>.
             </p>
             {supplement.foodSourceNote && (
               <p className="text-xs text-orange-600 italic bg-orange-50 p-1.5 rounded inline-block">
                 Note: {supplement.foodSourceNote}
               </p>
             )}
          </div>
        )}

        {/* Warnings */}
        {(supplement.warnings || (supplement.interactionWarnings && supplement.interactionWarnings.length > 0)) && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
              <div className="text-xs text-gray-600">
                {supplement.warnings && <p className="mb-1"><span className="font-semibold text-red-700">Warning:</span> {supplement.warnings}</p>}
                {supplement.interactionWarnings && supplement.interactionWarnings.length > 0 && (
                  <p><span className="font-semibold text-red-700">Interactions:</span> {supplement.interactionWarnings.join(', ')}</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* System Tags Footer */}
      <div className="bg-gray-50 px-5 py-3 border-t border-gray-100 flex flex-wrap gap-2">
        {supplement.systemTags.map(tag => (
          <span key={tag} className="text-[10px] uppercase tracking-wide text-gray-500 bg-white border border-gray-200 px-1.5 py-0.5 rounded">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};
