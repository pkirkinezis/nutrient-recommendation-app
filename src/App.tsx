import { useState, useMemo, useEffect } from 'react';
import { Supplement, UserProfile, Recommendation, InteractionWarning } from './types/index';
import { supplements, formGuidance, supplementComparisons, misinformationAlerts } from './data/supplements';
import { analyzeGoal, checkInteractions, generateTimingSchedule } from './utils/analyzer';
import { AdvancedBrowse } from './components/AdvancedBrowse';
import EducationalGuide from './components/EducationalGuide';

// LocalStorage keys
const STORAGE_KEYS = {
  profile: 'nutricompass_profile',
  selectedSupplements: 'nutricompass_selected',
  lastQuery: 'nutricompass_query',
};

// Helper functions for display
const getTypeColor = (type: Supplement['type']): string => {
  const colors: Record<Supplement['type'], string> = {
    'vitamin': 'bg-amber-100 text-amber-700',
    'mineral': 'bg-blue-100 text-blue-700',
    'herb': 'bg-green-100 text-green-700',
    'amino-acid': 'bg-purple-100 text-purple-700',
    'ayurvedic': 'bg-orange-100 text-orange-700',
    'mushroom': 'bg-rose-100 text-rose-700',
    'probiotic': 'bg-cyan-100 text-cyan-700',
    'fatty-acid': 'bg-indigo-100 text-indigo-700',
    'protein': 'bg-pink-100 text-pink-700',
    'performance': 'bg-red-100 text-red-700',
    'enzyme': 'bg-lime-100 text-lime-700',
    'antioxidant': 'bg-violet-100 text-violet-700',
    'other': 'bg-gray-100 text-gray-700',
  };
  return colors[type] || 'bg-gray-100 text-gray-700';
};

const getTypeLabel = (type: Supplement['type']): string => {
  const labels: Record<Supplement['type'], string> = {
    'vitamin': 'Vitamin',
    'mineral': 'Mineral',
    'herb': 'Herb',
    'amino-acid': 'Amino Acid',
    'ayurvedic': 'Ayurvedic',
    'mushroom': 'Mushroom',
    'probiotic': 'Probiotic',
    'fatty-acid': 'Fatty Acid',
    'protein': 'Protein',
    'performance': 'Performance',
    'enzyme': 'Enzyme',
    'antioxidant': 'Antioxidant',
    'other': 'Supplement',
  };
  return labels[type] || 'Supplement';
};

const getEvidenceInfo = (evidence: Supplement['evidence']): { color: string; label: string; description: string } => {
  const info = {
    'strong': { 
      color: 'bg-emerald-100 text-emerald-700', 
      label: 'Strong Evidence',
      description: 'Multiple human clinical trials support this'
    },
    'moderate': { 
      color: 'bg-yellow-100 text-yellow-700', 
      label: 'Moderate Evidence',
      description: 'Some clinical research supports this'
    },
    'limited': { 
      color: 'bg-gray-100 text-gray-600', 
      label: 'Traditional/Limited',
      description: 'Primarily traditional use or early research'
    },
  };
  return info[evidence];
};

const getPriorityColor = (priority: Recommendation['priority']): string => {
  const colors = {
    'essential': 'border-emerald-500 bg-emerald-50',
    'beneficial': 'border-blue-400 bg-blue-50',
    'optional': 'border-gray-200 bg-white',
  };
  return colors[priority];
};

// Example prompts for inspiration
const examplePrompts = [
  "I want better sleep and morning energy",
  "High stress, anxious, poor focus at work",
  "Support libido and recovery while training",
  "Vegan diet and feeling fatigued",
  "Joint pain and slow recovery after exercise",
  "Improve memory and mental clarity",
  "Boost immunity during cold season",
  "Better skin and hair health",
];

export function App() {
  // Load persisted state from localStorage
  const [query, setQuery] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.lastQuery) || '';
    } catch { return ''; }
  });
  const [hasAnalyzed, setHasAnalyzed] = useState(false);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [identifiedGoals, setIdentifiedGoals] = useState<string[]>([]);
  const [identifiedSystems, setIdentifiedSystems] = useState<string[]>([]);
  const [selectedSupplements, setSelectedSupplements] = useState<Supplement[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.selectedSupplements);
      if (saved) {
        const ids = JSON.parse(saved) as string[];
        return supplements.filter(s => ids.includes(s.id));
      }
    } catch { /* ignore */ }
    return [];
  });
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.profile);
      return saved ? JSON.parse(saved) : {};
    } catch { return {}; }
  });
  const [activeTab, setActiveTab] = useState<'recommend' | 'browse' | 'learn' | 'guide'>('recommend');
  const [tips, setTips] = useState<string[]>([]);

  // Persist user profile
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.profile, JSON.stringify(userProfile));
    } catch { /* ignore */ }
  }, [userProfile]);

  // Persist selected supplements
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.selectedSupplements, JSON.stringify(selectedSupplements.map(s => s.id)));
    } catch { /* ignore */ }
  }, [selectedSupplements]);

  // Persist last query
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.lastQuery, query);
    } catch { /* ignore */ }
  }, [query]);

  // Analyze the user's goal
  const handleAnalyze = () => {
    if (!query.trim()) return;
    
    const result = analyzeGoal(query, supplements, userProfile);
    // Convert to Recommendation type
    const recs: Recommendation[] = result.recommendations.map(r => ({
      supplement: r.supplement,
      relevanceScore: r.relevanceScore,
      reason: r.reason,
      priority: r.priority
    }));
    setRecommendations(recs);
    setIdentifiedGoals(result.identifiedGoals);
    setIdentifiedSystems(result.identifiedSystems);
    setTips(result.tips || []);
    setHasAnalyzed(true);
    setSelectedSupplements([]);
  };

  // Toggle supplement selection for stacking
  const toggleSupplementSelection = (supplement: Supplement) => {
    setSelectedSupplements(prev => {
      if (prev.find(s => s.id === supplement.id)) {
        return prev.filter(s => s.id !== supplement.id);
      }
      return [...prev, supplement];
    });
  };

  // Get interaction warnings
  const interactionWarnings = useMemo(() => {
    return checkInteractions(selectedSupplements);
  }, [selectedSupplements]);

  // Get timing suggestions
  const timingSuggestions = useMemo(() => {
    return generateTimingSchedule(selectedSupplements);
  }, [selectedSupplements]);

  // Reset to start
  const handleReset = () => {
    setQuery('');
    setHasAnalyzed(false);
    setRecommendations([]);
    setIdentifiedGoals([]);
    setIdentifiedSystems([]);
    setSelectedSupplements([]);
    setExpandedCard(null);
    setActiveTab('recommend');
    setTips([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-lg border-b border-gray-100 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <button onClick={handleReset} className="flex items-center gap-2 hover:opacity-80 transition">
              <span className="text-2xl">🌿</span>
              <div>
                <h1 className="text-lg font-bold text-gray-900">NutriCompass</h1>
                <p className="text-xs text-gray-500 hidden sm:block">Smart Supplement Guide</p>
              </div>
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={() => { setActiveTab('browse'); setHasAnalyzed(false); }}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${activeTab === 'browse' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                Browse
              </button>
              <button
                onClick={() => { setActiveTab('learn'); setHasAnalyzed(false); }}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${activeTab === 'learn' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                Learn
              </button>
              <button
                onClick={() => { setActiveTab('guide'); setHasAnalyzed(false); }}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${activeTab === 'guide' ? 'bg-teal-100 text-teal-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                📚 Guide
              </button>
              <button
                onClick={() => setShowProfile(!showProfile)}
                className={`p-2 rounded-lg transition ${showProfile ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Profile Panel */}
        {showProfile && (
          <div className="mb-6 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span>👤</span> Optional Profile (improves recommendations)
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Age Range</label>
                <select
                  value={userProfile.age || userProfile.ageRange || ''}
                  onChange={(e) => setUserProfile(p => ({ ...p, age: e.target.value as UserProfile['age'] }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="">Select...</option>
                  <option value="18-29">18-29</option>
                  <option value="30-44">30-44</option>
                  <option value="45-59">45-59</option>
                  <option value="60+">60+</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Diet Type</label>
                <select
                  value={userProfile.diet || userProfile.dietType || ''}
                  onChange={(e) => setUserProfile(p => ({ ...p, diet: e.target.value as UserProfile['diet'] }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="">Select...</option>
                  <option value="omnivore">Omnivore</option>
                  <option value="vegetarian">Vegetarian</option>
                  <option value="vegan">Vegan</option>
                  <option value="pescatarian">Pescatarian</option>
                  <option value="keto">Keto</option>
                  <option value="paleo">Paleo</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Training Style</label>
                <select
                  value={userProfile.trainingStyle || ''}
                  onChange={(e) => setUserProfile(p => ({ ...p, trainingStyle: e.target.value as UserProfile['trainingStyle'] }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="">Select...</option>
                  <option value="none">None</option>
                  <option value="light">Light</option>
                  <option value="moderate">Moderate</option>
                  <option value="endurance">Endurance</option>
                  <option value="strength">Strength</option>
                  <option value="mixed">Mixed</option>
                  <option value="yoga">Yoga/Movement</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Sleep Quality</label>
                <select
                  value={userProfile.sleepQuality || ''}
                  onChange={(e) => setUserProfile(p => ({ ...p, sleepQuality: e.target.value as UserProfile['sleepQuality'] }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="">Select...</option>
                  <option value="excellent">Excellent</option>
                  <option value="good">Good</option>
                  <option value="fair">Fair</option>
                  <option value="poor">Poor</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Stress Level</label>
                <select
                  value={userProfile.stressLevel || ''}
                  onChange={(e) => setUserProfile(p => ({ ...p, stressLevel: e.target.value as UserProfile['stressLevel'] }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="">Select...</option>
                  <option value="low">Low</option>
                  <option value="moderate">Moderate</option>
                  <option value="high">High</option>
                  <option value="very-high">Very High</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Sex</label>
                <select
                  value={userProfile.sex || ''}
                  onChange={(e) => setUserProfile(p => ({ ...p, sex: e.target.value as UserProfile['sex'] }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="">Select...</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3">This information is saved locally on your device and helps personalize recommendations.</p>
          </div>
        )}

        {/* Advanced Browse Mode */}
        {activeTab === 'browse' && !hasAnalyzed ? (
          <AdvancedBrowse
            userProfile={userProfile}
            onSelectSupplement={toggleSupplementSelection}
            selectedSupplements={selectedSupplements}
          />
        ) : activeTab === 'guide' && !hasAnalyzed ? (
          <EducationalGuide />
        ) : activeTab === 'learn' && !hasAnalyzed ? (
          <div className="space-y-8">
            {/* Comparisons Section */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Why This, Not That?</h2>
              <p className="text-gray-600 mb-6">Compare popular supplements to understand which is right for your needs.</p>
              
              <div className="space-y-4">
                {supplementComparisons.map(comp => (
                  <div key={comp.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                    <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 border-b border-gray-100">
                      <span className="text-xs font-medium text-purple-600 uppercase">{comp.goal}</span>
                      <h3 className="text-lg font-bold text-gray-900">{comp.title}</h3>
                    </div>
                    <div className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="bg-blue-50 rounded-xl p-4">
                          <h4 className="font-semibold text-blue-900 mb-2">{comp.optionA.name}</h4>
                          <p className="text-xs text-blue-600 mb-2">{comp.optionA.evidence} Evidence</p>
                          <div className="mb-2">
                            <p className="text-xs font-medium text-green-700">✓ Pros:</p>
                            <ul className="text-sm text-gray-700 space-y-0.5">
                              {comp.optionA.pros.slice(0, 3).map((pro, i) => <li key={i}>• {pro}</li>)}
                            </ul>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-red-700">✗ Cons:</p>
                            <ul className="text-sm text-gray-700 space-y-0.5">
                              {comp.optionA.cons.slice(0, 2).map((con, i) => <li key={i}>• {con}</li>)}
                            </ul>
                          </div>
                        </div>
                        <div className="bg-amber-50 rounded-xl p-4">
                          <h4 className="font-semibold text-amber-900 mb-2">{comp.optionB.name}</h4>
                          <p className="text-xs text-amber-600 mb-2">{comp.optionB.evidence} Evidence</p>
                          <div className="mb-2">
                            <p className="text-xs font-medium text-green-700">✓ Pros:</p>
                            <ul className="text-sm text-gray-700 space-y-0.5">
                              {comp.optionB.pros.slice(0, 3).map((pro, i) => <li key={i}>• {pro}</li>)}
                            </ul>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-red-700">✗ Cons:</p>
                            <ul className="text-sm text-gray-700 space-y-0.5">
                              {comp.optionB.cons.slice(0, 2).map((con, i) => <li key={i}>• {con}</li>)}
                            </ul>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-3">
                        <p className="text-sm font-medium text-gray-900 mb-1">🎯 Verdict:</p>
                        <p className="text-sm text-gray-700">{comp.verdict}</p>
                        {comp.canCombine && (
                          <p className="text-xs text-emerald-600 mt-1">✓ These can be safely combined</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Misinformation Alerts */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">⚠️ Misinformation Alerts</h2>
              <p className="text-gray-600 mb-6">Common supplement myths debunked. Don&apos;t fall for marketing hype.</p>
              
              <div className="space-y-4">
                {Object.entries(misinformationAlerts).map(([key, alert]) => (
                  <div key={key} className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl border border-red-100 p-5">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">🚨</span>
                      <div>
                        <h3 className="font-semibold text-red-800 mb-1">The Claim: &ldquo;{alert.claim}&rdquo;</h3>
                        <div className="mb-3">
                          <p className="text-sm font-medium text-gray-700">The Reality:</p>
                          <p className="text-sm text-gray-600">{alert.reality}</p>
                        </div>
                        <div className="bg-white/60 rounded-lg p-3">
                          <p className="text-sm font-medium text-emerald-700">✓ What Actually Works:</p>
                          <p className="text-sm text-gray-700">{alert.recommendation}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Form Intelligence Preview */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">💊 Form Intelligence</h2>
              <p className="text-gray-600 mb-6">Not all supplement forms are equal. Here&apos;s what to look for.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(formGuidance).slice(0, 4).map(([key, guide]) => (
                  <div key={key} className="bg-white rounded-xl border border-gray-100 p-4">
                    <h3 className="font-semibold text-gray-900 mb-3 capitalize">{key.replace(/-/g, ' ')}</h3>
                    <div className="space-y-2">
                      {guide.forms.slice(0, 3).map((form, i) => (
                        <div key={i} className={`text-sm p-2 rounded-lg ${form.avoid ? 'bg-red-50 text-red-700' : 'bg-gray-50 text-gray-700'}`}>
                          <span className="font-medium">{form.name}</span>
                          <span className="text-xs ml-2">({form.bioavailability})</span>
                          {form.avoid && <span className="text-xs ml-1">⚠️ Avoid</span>}
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 text-xs text-gray-500">
                      <span className="text-green-600">Enhancers: </span>{guide.enhancers.slice(0, 2).join(', ')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
) : !hasAnalyzed ? (
          /* Main Input View */
          <div className="space-y-8">
            {/* Hero */}
            <div className="text-center py-8">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                What would you like to improve?
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Describe your health goal in plain language. We&apos;ll recommend evidence-based supplements 
                including vitamins, minerals, herbs, and Ayurvedic remedies.
              </p>
            </div>

            {/* Input */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <textarea
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleAnalyze(); }}}
                  placeholder="Example: I want better sleep and more energy in the morning..."
                  className="w-full px-5 py-4 bg-white border-2 border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-none h-28"
                />
                <button
                  onClick={handleAnalyze}
                  disabled={!query.trim()}
                  className="absolute bottom-4 right-4 px-5 py-2.5 bg-emerald-500 text-white font-semibold rounded-xl hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-emerald-200"
                >
                  Get Recommendations
                </button>
              </div>
            </div>

            {/* Example Prompts */}
            <div className="max-w-2xl mx-auto">
              <p className="text-sm text-gray-500 mb-3 text-center">Try an example:</p>
              <div className="flex flex-wrap justify-center gap-2">
                {examplePrompts.slice(0, 4).map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => setQuery(prompt)}
                    className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-sm text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
              <div className="bg-white rounded-xl p-4 border border-gray-100">
                <div className="text-2xl mb-2">🔬</div>
                <h3 className="font-semibold text-gray-900 mb-1">Evidence-Based</h3>
                <p className="text-sm text-gray-600">Clear ratings showing what&apos;s backed by research vs traditional use</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-100">
                <div className="text-2xl mb-2">🕉️</div>
                <h3 className="font-semibold text-gray-900 mb-1">Ayurvedic Integration</h3>
                <p className="text-sm text-gray-600">Traditional herbs with modern scientific context</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-100">
                <div className="text-2xl mb-2">⚠️</div>
                <h3 className="font-semibold text-gray-900 mb-1">Safety First</h3>
                <p className="text-sm text-gray-600">Drug interactions, cautions, and who should avoid</p>
              </div>
            </div>

            {/* Philosophy */}
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-100">
              <h3 className="font-bold text-emerald-800 mb-3">Our Philosophy</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm text-emerald-700">
                <div className="flex items-center gap-2">
                  <span>🥗</span> Food before pills
                </div>
                <div className="flex items-center gap-2">
                  <span>📊</span> Evidence over hype
                </div>
                <div className="flex items-center gap-2">
                  <span>⚖️</span> Balance over excess
                </div>
                <div className="flex items-center gap-2">
                  <span>🛡️</span> Safety over extremes
                </div>
                <div className="flex items-center gap-2">
                  <span>😴</span> Recovery over stimulation
                </div>
                <div className="flex items-center gap-2">
                  <span>🧘</span> Lifestyle first
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Results View */
          <div className="space-y-6">
            {/* Query Summary */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Your goal:</p>
                  <p className="text-lg font-medium text-gray-900">&ldquo;{query}&rdquo;</p>
                  {identifiedGoals.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {identifiedGoals.map(goal => (
                        <span key={goal} className="px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium capitalize">
                          {goal.replace('-', ' ')}
                        </span>
                      ))}
                      {identifiedSystems.map(system => (
                        <span key={system} className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium capitalize">
                          {system} system
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  onClick={handleReset}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
                >
                  New Search
                </button>
              </div>
            </div>

            {/* Tips */}
            {tips.length > 0 && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-100">
                <h3 className="font-bold text-blue-800 mb-3 flex items-center gap-2">
                  <span>💡</span> Personalized Tips
                </h3>
                <ul className="space-y-2">
                  {tips.map((tip, i) => (
                    <li key={i} className="text-sm text-blue-700 flex items-start gap-2">
                      <span className="text-blue-400">•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Recommendations */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Recommended Supplements</h2>
                <span className="text-sm text-gray-500">{recommendations.length} suggestions</span>
              </div>
              
              {recommendations.length === 0 ? (
                <div className="bg-white rounded-2xl p-8 text-center border border-gray-100">
                  <div className="text-4xl mb-3">🤔</div>
                  <p className="text-gray-600">We couldn&apos;t identify specific supplement needs from your query.</p>
                  <p className="text-sm text-gray-500 mt-2">Try being more specific about your health goals.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recommendations.map((rec) => (
                    <div key={rec.supplement.id} className={`border-l-4 rounded-2xl ${getPriorityColor(rec.priority)}`}>
                      <SupplementCard
                        supplement={rec.supplement}
                        isExpanded={expandedCard === rec.supplement.id}
                        onToggle={() => setExpandedCard(expandedCard === rec.supplement.id ? null : rec.supplement.id)}
                        isSelected={selectedSupplements.some(s => s.id === rec.supplement.id)}
                        onSelect={() => toggleSupplementSelection(rec.supplement)}
                        showSelection={true}
                        recommendation={rec}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Stack Builder */}
            {selectedSupplements.length > 0 && (
              <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span>📦</span> Your Stack ({selectedSupplements.length} selected)
                </h3>
                
                {/* Interaction Warnings */}
                {interactionWarnings.length > 0 && (
                  <div className="mb-4 bg-amber-50 border border-amber-200 rounded-xl p-4">
                    <h4 className="font-semibold text-amber-800 mb-2 flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      Stack Warnings
                    </h4>
                    <ul className="space-y-2">
                      {interactionWarnings.map((warning: InteractionWarning, i: number) => (
                        <li key={i} className={`text-sm p-2 rounded-lg ${
                          warning.severity === 'high' ? 'bg-red-100 text-red-800' :
                          warning.severity === 'moderate' ? 'bg-amber-100 text-amber-800' :
                          'bg-yellow-50 text-yellow-800'
                        }`}>
                          <span className="font-medium">{warning.supplements.join(' + ')}: </span>
                          {warning.reason}
                          <p className="text-xs mt-1 opacity-80">{warning.recommendation}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Timing Suggestions */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-amber-50 rounded-xl p-3">
                    <h4 className="text-xs font-semibold text-amber-700 mb-2 flex items-center gap-1">
                      <span>🌅</span> Morning
                    </h4>
                    <div className="space-y-1">
                      {timingSuggestions.morning.map((s: Supplement) => (
                        <p key={s.id} className="text-xs text-amber-800">{s.name.split(' ')[0]}</p>
                      ))}
                      {timingSuggestions.morning.length === 0 && <p className="text-xs text-amber-600">-</p>}
                    </div>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-3">
                    <h4 className="text-xs font-semibold text-blue-700 mb-2 flex items-center gap-1">
                      <span>☀️</span> Afternoon
                    </h4>
                    <div className="space-y-1">
                      {timingSuggestions.midday.map((s: Supplement) => (
                        <p key={s.id} className="text-xs text-blue-800">{s.name.split(' ')[0]}</p>
                      ))}
                      {timingSuggestions.midday.length === 0 && <p className="text-xs text-blue-600">-</p>}
                    </div>
                  </div>
                  <div className="bg-indigo-50 rounded-xl p-3">
                    <h4 className="text-xs font-semibold text-indigo-700 mb-2 flex items-center gap-1">
                      <span>🌙</span> Evening
                    </h4>
                    <div className="space-y-1">
                      {[...timingSuggestions.evening, ...timingSuggestions.bedtime].map((s: Supplement) => (
                        <p key={s.id} className="text-xs text-indigo-800">{s.name.split(' ')[0]}</p>
                      ))}
                      {timingSuggestions.evening.length === 0 && timingSuggestions.bedtime.length === 0 && <p className="text-xs text-indigo-600">-</p>}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Expectations & Timeframes */}
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-5 border border-slate-200">
              <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                <span>⏱️</span> When to Expect Results
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="flex items-start gap-2">
                  <span className="text-emerald-500">●</span>
                  <div>
                    <p className="font-medium text-slate-700">Days to 2 weeks</p>
                    <p className="text-slate-500">Magnesium, L-Theanine, sleep aids, energy boosters</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-yellow-500">●</span>
                  <div>
                    <p className="font-medium text-slate-700">2-4 weeks</p>
                    <p className="text-slate-500">Adaptogens, stress support, basic vitamins</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-orange-500">●</span>
                  <div>
                    <p className="font-medium text-slate-700">4-8 weeks</p>
                    <p className="text-slate-500">Cognitive enhancers, hormonal support, mood support</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-red-400">●</span>
                  <div>
                    <p className="font-medium text-slate-700">2-3+ months</p>
                    <p className="text-slate-500">Skin/hair, joint repair, deep tissue changes</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
              <div className="flex gap-3">
                <svg className="w-6 h-6 text-amber-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h4 className="font-semibold text-amber-800 mb-1">Important Disclaimer</h4>
                  <p className="text-sm text-amber-700">
                    This app is for educational purposes only and does not diagnose, treat, or cure any disease. 
                    Always consult with a qualified healthcare professional before starting any supplement regimen, 
                    especially if you have medical conditions, take medications, or are pregnant/breastfeeding.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-gray-100 bg-white/50">
        <div className="max-w-4xl mx-auto px-4 py-6 text-center">
          <p className="text-sm text-gray-500 mb-1">🌿 NutriCompass - Smart, Safety-First Supplement Guide</p>
          <p className="text-xs text-gray-400">Combining evidence-based science with traditional wisdom</p>
        </div>
      </footer>
    </div>
  );
}

// Supplement Card Component
function SupplementCard({ 
  supplement, 
  isExpanded, 
  onToggle, 
  isSelected, 
  onSelect, 
  showSelection,
  recommendation 
}: { 
  supplement: Supplement; 
  isExpanded: boolean; 
  onToggle: () => void; 
  isSelected: boolean; 
  onSelect: () => void;
  showSelection: boolean;
  recommendation?: Recommendation;
}) {
  const evidenceInfo = getEvidenceInfo(supplement.evidence);

  return (
    <div className="bg-white rounded-xl overflow-hidden">
      <div className="p-4 cursor-pointer" onClick={onToggle}>
        <div className="flex items-start gap-3">
          {showSelection && (
            <button
              onClick={(e) => { e.stopPropagation(); onSelect(); }}
              className={`flex-shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition ${
                isSelected 
                  ? 'bg-emerald-500 border-emerald-500 text-white' 
                  : 'border-gray-300 hover:border-emerald-400'
              }`}
            >
              {isSelected && (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h3 className="font-semibold text-gray-900">{supplement.name}</h3>
            </div>
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getTypeColor(supplement.type)}`}>
                {getTypeLabel(supplement.type)}
              </span>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${evidenceInfo.color}`}>
                {evidenceInfo.label}
              </span>
              {recommendation && (
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  recommendation.priority === 'essential' ? 'bg-emerald-500 text-white' :
                  recommendation.priority === 'beneficial' ? 'bg-blue-500 text-white' :
                  'bg-gray-200 text-gray-600'
                }`}>
                  {recommendation.priority}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600 line-clamp-2">{supplement.description}</p>
            {recommendation && (
              <p className="text-xs text-emerald-600 mt-1 font-medium">{recommendation.reason}</p>
            )}
          </div>
          <button className={`flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
            <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="px-4 pb-4 space-y-4 border-t border-gray-100 pt-4">
          {/* Traditional Use */}
          {supplement.traditionalUse && (
            <div className="bg-orange-50 rounded-xl p-3">
              <h4 className="text-xs font-semibold text-orange-700 mb-1 flex items-center gap-1">
                <span>🕉️</span> Traditional Use
              </h4>
              <p className="text-sm text-orange-800">{supplement.traditionalUse}</p>
            </div>
          )}

          {/* Benefits */}
          <div>
            <h4 className="text-xs font-semibold text-gray-700 mb-2">Key Benefits</h4>
            <div className="flex flex-wrap gap-1.5">
              {supplement.benefits.map((benefit, i) => (
                <span key={i} className="text-xs bg-emerald-50 text-emerald-700 px-2 py-1 rounded-full">
                  {benefit}
                </span>
              ))}
            </div>
          </div>

          {/* Dosage & Timing */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-xl p-3">
              <h4 className="text-xs font-semibold text-gray-700 mb-1">💊 Dosage</h4>
              <p className="text-sm text-gray-600">{supplement.dosage}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <h4 className="text-xs font-semibold text-gray-700 mb-1">⏰ Timing</h4>
              <p className="text-sm text-gray-600">{supplement.timing}</p>
            </div>
          </div>

          {/* Timeframe */}
          <div className="bg-blue-50 rounded-xl p-3">
            <h4 className="text-xs font-semibold text-blue-700 mb-1">📅 When to Expect Results</h4>
            <p className="text-sm text-blue-800">{supplement.timeframe}</p>
          </div>

          {/* Food Sources */}
          {supplement.foodSources && supplement.foodSources.length > 0 && (
            <div className="bg-green-50 rounded-xl p-3">
              <h4 className="text-xs font-semibold text-green-700 mb-1">🥗 Food Sources</h4>
              <p className="text-sm text-green-800">{supplement.foodSources.join(', ')}</p>
            </div>
          )}

          {/* Synergies */}
          {supplement.synergies && supplement.synergies.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-gray-700 mb-2">✨ Works Well With</h4>
              <div className="flex flex-wrap gap-1.5">
                {supplement.synergies.map((syn, i) => (
                  <span key={i} className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded-full">
                    {syn}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Cautions */}
          {supplement.cautions && supplement.cautions.length > 0 && (
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-3">
              <h4 className="text-xs font-semibold text-amber-700 mb-1">⚠️ Cautions</h4>
              <ul className="text-sm text-amber-700 space-y-1">
                {supplement.cautions.map((caution, i) => (
                  <li key={i}>• {caution}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Drug Interactions */}
          {supplement.drugInteractions && supplement.drugInteractions.length > 0 && (
            <div className="bg-red-50 border border-red-100 rounded-xl p-3">
              <h4 className="text-xs font-semibold text-red-700 mb-1">💊 Drug Interactions</h4>
              <p className="text-sm text-red-700">{supplement.drugInteractions.join(', ')}</p>
            </div>
          )}

          {/* Avoid If */}
          {supplement.avoidIf && supplement.avoidIf.length > 0 && (
            <div className="bg-red-50 border border-red-100 rounded-xl p-3">
              <h4 className="text-xs font-semibold text-red-700 mb-1">🚫 Avoid If</h4>
              <ul className="text-sm text-red-700 space-y-1">
                {supplement.avoidIf.map((avoid, i) => (
                  <li key={i}>• {avoid}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Cycling */}
          {supplement.cycleTiming && (
            <div className="bg-slate-50 rounded-xl p-3">
              <h4 className="text-xs font-semibold text-slate-700 mb-1">🔄 Cycling</h4>
              <p className="text-sm text-slate-600">{supplement.cycleTiming}</p>
            </div>
          )}

          {/* Form Guidance */}
          {formGuidance[supplement.id] && (
            <div className="bg-purple-50 rounded-xl p-3">
              <h4 className="text-xs font-semibold text-purple-700 mb-2">💊 Form Intelligence</h4>
              <div className="space-y-1 mb-2">
                {formGuidance[supplement.id].forms.slice(0, 4).map((form, i) => (
                  <div key={i} className={`text-xs p-1.5 rounded ${form.avoid ? 'bg-red-100 text-red-700' : 'bg-white text-gray-700'}`}>
                    <span className="font-medium">{form.name}</span>
                    <span className="ml-1 text-gray-500">({form.bioavailability})</span>
                    {form.avoid && <span className="ml-1 text-red-600">⚠️</span>}
                  </div>
                ))}
              </div>
              <div className="text-xs space-y-1">
                <p><span className="text-green-600 font-medium">Enhances absorption:</span> {formGuidance[supplement.id].enhancers.join(', ')}</p>
                {formGuidance[supplement.id].blockers.length > 0 && (
                  <p><span className="text-red-600 font-medium">Blocks absorption:</span> {formGuidance[supplement.id].blockers.slice(0, 3).join(', ')}</p>
                )}
                <p className="text-purple-600 mt-1">{formGuidance[supplement.id].foodFirst.note}</p>
              </div>
            </div>
          )}

          {/* Evidence explanation */}
          <div className="bg-slate-50 rounded-xl p-3">
            <h4 className="text-xs font-semibold text-slate-700 mb-1">📊 Evidence Level: {evidenceInfo.label}</h4>
            <p className="text-sm text-slate-600">{evidenceInfo.description}</p>
          </div>
        </div>
      )}
    </div>
  );
}
