import React, { useMemo } from 'react';
import { Brain, Zap, Shield, Activity } from 'lucide-react';
import { SystemTag } from '../types';

interface AnalysisPanelProps {
  query: string;
}

export const AnalysisPanel: React.FC<AnalysisPanelProps> = ({ query }) => {
  const detectedSystems = useMemo(() => {
    const q = query.toLowerCase();
    const systems = new Set<SystemTag>();

    if (q.match(/sleep|insomnia|stress|anxiety|focus|brain|memory|calm/)) systems.add('Nervous System');
    if (q.match(/immune|cold|flu|sick|virus|defend/)) systems.add('Immune System');
    if (q.match(/muscle|strength|joint|pain|recovery|workout|gym/)) systems.add('Musculoskeletal');
    if (q.match(/energy|fatigue|tired|metabolism|weight|burn/)) systems.add('Metabolism');
    if (q.match(/hormone|libido|menopause|pms|testosterone|period/)) systems.add('Endocrine (Hormones)');
    if (q.match(/digestion|gut|stomach|bloat|detox/)) systems.add('Digestive');
    if (q.match(/skin|hair|nail|aging|wrinkle/)) systems.add('Skin/Hair/Nails');
    
    return Array.from(systems);
  }, [query]);

  if (!query || detectedSystems.length === 0) return null;

  return (
    <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 mb-6">
      <div className="flex items-center gap-2 mb-3">
        <Activity className="w-5 h-5 text-indigo-600" />
        <h3 className="font-semibold text-indigo-900">Goal Analysis</h3>
      </div>
      <p className="text-sm text-indigo-800 mb-3">
        Based on "<strong>{query}</strong>", we are focusing on support for:
      </p>
      <div className="flex flex-wrap gap-2">
        {detectedSystems.map(system => (
          <span key={system} className="flex items-center gap-1.5 bg-white text-indigo-700 px-3 py-1.5 rounded-md text-sm font-medium shadow-sm border border-indigo-100">
            {system === 'Nervous System' && <Brain className="w-4 h-4" />}
            {system === 'Immune System' && <Shield className="w-4 h-4" />}
            {system === 'Metabolism' && <Zap className="w-4 h-4" />}
            {system === 'Musculoskeletal' && <Activity className="w-4 h-4" />}
            {system}
          </span>
        ))}
      </div>
    </div>
  );
};
