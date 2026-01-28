import { useState, useMemo, useCallback, useEffect } from 'react';
import { CuratedStack, Supplement, SupplementStack, UserProfile } from '../types/index';
import { curatedStacks } from '../data/curatedStacks';
import { premadeStacks } from '../data/stacks';
import { supplements, formGuidance } from '../data/supplements';
import { normalizeGoals, normalizeSystems } from '../utils/normalization';

// Types for the advanced browse engine
type SortOption = 'relevance' | 'evidence' | 'name' | 'popularity';
type ViewMode = 'grid' | 'list' | 'compact';

interface FilterState {
  types: Supplement['type'][];
  evidence: Supplement['evidence'][];
  goals: string[];
  systems: string[];
  timing: string[];
  safeFor: string[];
  hasFormGuidance: boolean;
  traditionalOnly: boolean;
  modernOnly: boolean;
}

interface AdvancedBrowseProps {
  userProfile: UserProfile;
  onSelectSupplement: (supplement: Supplement) => void;
  selectedSupplements: Supplement[];
  onSelectStack: (stack: CuratedStack) => void;
}

// All available systems extracted from supplements
const allSystems = Array.from(new Set(supplements.flatMap(s => normalizeSystems(s.systems)))).sort();

// Goal categories for better organization
const goalCategories = {
  'Energy & Vitality': ['energy'],
  'Brain & Focus': ['brain'],
  'Mood & Emotions': ['mood', 'stress'],
  'Sleep & Recovery': ['sleep'],
  'Hormones & Balance': ['hormones'],
  'Reproductive Health': ['fertility'],
  'Intimacy & Libido': ['libido'],
  'Immune Support': ['immunity'],
  'Digestion & Gut': ['digestion'],
  'Fitness & Muscle': ['fitness'],
  'Inflammation & Pain': ['inflammation'],
  'Heart & Cardio': ['heart'],
  'Skin & Beauty': ['beauty'],
  'Longevity & Aging': ['longevity'],
  'Metabolic & Blood Sugar': ['metabolic'],
  'Liver & Detox': ['detox']
};

// Type icons and colors
const typeConfig: Record<Supplement['type'], { icon: string; label: string; color: string; bg: string }> = {
  'vitamin': { icon: '💊', label: 'Vitamin', color: 'text-amber-700', bg: 'bg-amber-100' },
  'mineral': { icon: '⚗️', label: 'Mineral', color: 'text-blue-700', bg: 'bg-blue-100' },
  'herb': { icon: '🌿', label: 'Herb', color: 'text-green-700', bg: 'bg-green-100' },
  'tea': { icon: '🫖', label: 'Tea Herb', color: 'text-teal-700', bg: 'bg-teal-100' },
  'amino-acid': { icon: '🧬', label: 'Amino Acid', color: 'text-purple-700', bg: 'bg-purple-100' },
  'ayurvedic': { icon: '🕉️', label: 'Ayurvedic', color: 'text-orange-700', bg: 'bg-orange-100' },
  'mushroom': { icon: '🍄', label: 'Mushroom', color: 'text-rose-700', bg: 'bg-rose-100' },
  'probiotic': { icon: '🦠', label: 'Probiotic', color: 'text-cyan-700', bg: 'bg-cyan-100' },
  'fatty-acid': { icon: '🐟', label: 'Fatty Acid', color: 'text-indigo-700', bg: 'bg-indigo-100' },
  'protein': { icon: '💪', label: 'Protein', color: 'text-pink-700', bg: 'bg-pink-100' },
  'performance': { icon: '🏋️', label: 'Performance', color: 'text-red-700', bg: 'bg-red-100' },
  'enzyme': { icon: '🔬', label: 'Enzyme', color: 'text-lime-700', bg: 'bg-lime-100' },
  'antioxidant': { icon: '🛡️', label: 'Antioxidant', color: 'text-violet-700', bg: 'bg-violet-100' },
  'other': { icon: '✨', label: 'Supplement', color: 'text-gray-700', bg: 'bg-gray-100' },
};

const evidenceConfig: Record<Supplement['evidence'], { label: string; color: string; bg: string; score: number }> = {
  'strong': { label: 'Strong Evidence', color: 'text-emerald-700', bg: 'bg-emerald-100', score: 3 },
  'moderate': { label: 'Moderate Evidence', color: 'text-yellow-700', bg: 'bg-yellow-100', score: 2 },
  'limited': { label: 'Traditional/Limited', color: 'text-gray-600', bg: 'bg-gray-100', score: 1 },
};

// Popularity scores based on common usage and search volume
const popularityScores: Record<string, number> = {
  'vitamin-d3': 100, 'omega-3': 98, 'magnesium': 97, 'vitamin-b12': 90, 'vitamin-c': 89,
  'ashwagandha': 95, 'creatine': 94, 'probiotics': 88, 'zinc': 87, 'collagen': 86,
  'turmeric-curcumin': 85, 'lions-mane': 80, 'melatonin': 82, 'coq10': 75, 'rhodiola': 70,
  'l-theanine': 72, 'brahmi-bacopa': 65, 'nac': 60, 'glycine': 55, 'tongkat-ali': 68,
  'green-tea-matcha': 92, 'peppermint-tea': 78, 'chamomile-tea': 76, 'ginger-tea': 80, 'cinnamon-tea': 74, 'hibiscus-tea': 72,
  'greek-mountain-tea': 64, 'dittany-of-crete': 58, 'lemon-verbena': 66, 'olive-leaf': 70,
  'white-tea-silver-needle': 62, 'white-tea-white-peony': 61, 'green-tea-sencha': 84, 'yellow-tea-huang-ya': 54,
  'oolong-tea-tieguanyin': 68, 'black-tea-assam': 82, 'dark-tea-pu-erh-sheng': 66, 'smoked-tea-lapsang-souchong': 52,
  'english-breakfast-tea': 78, 'earl-grey-tea': 70, 'jasmine-green-tea': 60, 'decaf-tea': 65,
};

const getNormalizedGoals = (supplement: Supplement) => normalizeGoals(supplement.goals);
const getNormalizedSystems = (supplement: Supplement) => normalizeSystems(supplement.systems);
const intimacySearchKeywords = [
  'libido',
  'fertility',
  'testosterone',
  'hormonal-balance',
  'reproductive',
  'women-health',
  'sexual-health',
  'hormones',
  'intimacy',
  'sexual'
];

const tokenizeSearchQuery = (query: string) => {
  const lowered = query.toLowerCase();
  const tokens = lowered.split(/[^a-z0-9]+/).filter(Boolean);
  const expandedTokens = new Set(tokens);
  const hasIntimacySignal = tokens.some(token => ['libido', 'fertility', 'reproductive', 'intimacy', 'sexual'].includes(token))
    || lowered.includes('sexual health')
    || lowered.includes('reproductive health');

  if (hasIntimacySignal) {
    intimacySearchKeywords.forEach(keyword => expandedTokens.add(keyword));
  }

  const expandedList = Array.from(expandedTokens);
  return {
    lowered,
    tokens: expandedList,
    normalizedGoals: normalizeGoals(expandedList),
    normalizedSystems: normalizeSystems(expandedList)
  };
};

export function AdvancedBrowse({ userProfile, onSelectSupplement, selectedSupplements, onSelectStack }: AdvancedBrowseProps) {
  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('relevance');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [browseMode, setBrowseMode] = useState<'supplements' | 'stacks'>('supplements');
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [expandedStack, setExpandedStack] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showPremadeStacks, setShowPremadeStacks] = useState(true);
  const [activeQuickFilter, setActiveQuickFilter] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    types: [],
    evidence: [],
    goals: [],
    systems: [],
    timing: [],
    safeFor: [],
    hasFormGuidance: false,
    traditionalOnly: false,
    modernOnly: false,
  });
  const normalizedFilterGoals = useMemo(() => normalizeGoals(filters.goals), [filters.goals]);

  // Quick filter presets - defined outside useMemo to avoid recreation
  const getQuickFilterIds = (filterId: string): string[] => {
    switch (filterId) {
      case 'beginners':
        return ['vitamin-d3', 'magnesium', 'omega-3', 'vitamin-b12', 'zinc'];
      case 'sleep':
        return supplements.filter(s => getNormalizedGoals(s).includes('sleep')).map(s => s.id);
      case 'energy':
        return supplements.filter(s => {
          const goals = getNormalizedGoals(s);
          return goals.includes('energy') || goals.includes('brain');
        }).map(s => s.id);
      case 'stress':
        return supplements.filter(s => getNormalizedGoals(s).includes('stress')).map(s => s.id);
      case 'ayurvedic':
        return supplements.filter(s => s.type === 'ayurvedic').map(s => s.id);
      case 'mushrooms':
        return supplements.filter(s => s.type === 'mushroom').map(s => s.id);
      case 'nootropics':
        return supplements.filter(s => getNormalizedGoals(s).includes('brain')).map(s => s.id);
      case 'athletes':
        return supplements.filter(s => getNormalizedGoals(s).includes('fitness')).map(s => s.id);
      case 'immunity':
        return supplements.filter(s => getNormalizedGoals(s).includes('immunity')).map(s => s.id);
      case 'longevity':
        return supplements.filter(s => getNormalizedGoals(s).includes('longevity')).map(s => s.id);
      case 'strong-evidence':
        return supplements.filter(s => s.evidence === 'strong').map(s => s.id);
      default:
        return [];
    }
  };

  const quickFilters = [
    { id: 'beginners', label: '🌱 Beginner Essentials' },
    { id: 'sleep', label: '😴 Sleep Stack' },
    { id: 'energy', label: '⚡ Energy & Focus' },
    { id: 'stress', label: '🧘 Stress & Calm' },
    { id: 'ayurvedic', label: '🕉️ Ayurvedic Herbs' },
    { id: 'mushrooms', label: '🍄 Medicinal Mushrooms' },
    { id: 'nootropics', label: '🧠 Nootropics' },
    { id: 'athletes', label: '🏋️ Athletic Performance' },
    { id: 'immunity', label: '🛡️ Immune Support' },
    { id: 'longevity', label: '⏳ Longevity' },
    { id: 'strong-evidence', label: '✅ Strong Evidence Only' },
  ];

  // Personalized recommendations based on profile
  const personalizedRecommendations = useMemo(() => {
    const recs: { id: string; reason: string }[] = [];
    
    // Support both old and new property names
    const diet = userProfile.diet || userProfile.dietType;
    const age = userProfile.age || userProfile.ageRange;
    
    if (diet === 'vegan') {
      recs.push({ id: 'vitamin-b12', reason: 'Essential for vegans' });
      recs.push({ id: 'omega-3', reason: 'Algae-based omega-3 for vegans' });
      recs.push({ id: 'iron', reason: 'Plant iron less bioavailable' });
      recs.push({ id: 'zinc', reason: 'Higher needs on plant-based diet' });
    }
    if (diet === 'vegetarian') {
      recs.push({ id: 'vitamin-b12', reason: 'Important for vegetarians' });
    }
    if (userProfile.sleepQuality === 'poor') {
      recs.push({ id: 'magnesium', reason: 'Glycinate form for sleep' });
      recs.push({ id: 'glycine', reason: 'Improves sleep quality' });
      recs.push({ id: 'l-theanine', reason: 'Promotes calm for sleep' });
    }
    if (userProfile.stressLevel === 'high' || userProfile.stressLevel === 'very-high') {
      recs.push({ id: 'ashwagandha', reason: 'Proven cortisol reducer' });
      recs.push({ id: 'rhodiola', reason: 'Anti-fatigue adaptogen' });
      recs.push({ id: 'l-theanine', reason: 'Calming without sedation' });
    }
    if (userProfile.trainingStyle === 'strength') {
      recs.push({ id: 'creatine', reason: 'Essential for strength' });
      recs.push({ id: 'vitamin-d3', reason: 'Supports testosterone' });
      recs.push({ id: 'zinc', reason: 'Recovery and hormones' });
    }
    if (userProfile.trainingStyle === 'endurance') {
      recs.push({ id: 'beetroot-extract', reason: 'Proven endurance booster' });
      recs.push({ id: 'l-citrulline', reason: 'Improves blood flow' });
      recs.push({ id: 'iron', reason: 'Oxygen transport (test first)' });
    }
    if (age === '60+' || age === '45-59' || age === 'over-60' || age === '45-60') {
      recs.push({ id: 'coq10', reason: 'Declines with age' });
      recs.push({ id: 'vitamin-d3', reason: 'Critical for bone health' });
      recs.push({ id: 'omega-3', reason: 'Brain and heart protection' });
    }
    if (userProfile.sex === 'female') {
      recs.push({ id: 'iron', reason: 'Higher needs (test first)' });
      recs.push({ id: 'shatavari', reason: 'Female hormonal support' });
    }
    if (userProfile.sex === 'male') {
      recs.push({ id: 'zinc', reason: 'Testosterone support' });
      recs.push({ id: 'tongkat-ali', reason: 'Male vitality' });
    }
    
    // Remove duplicates
    return recs.filter((rec, index, self) => 
      self.findIndex(r => r.id === rec.id) === index
    );
  }, [userProfile]);

  const supplementMap = useMemo(() => new Map(supplements.map(supplement => [supplement.id, supplement])), []);

  const targetGender = userProfile.sex === 'male' ? 'men' : userProfile.sex === 'female' ? 'women' : 'all';

  const visiblePremadeStacks = useMemo(
    () => premadeStacks.filter(stack => stack.targetGender === 'all' || stack.targetGender === targetGender),
    [targetGender]
  );

  const searchHasIntimacyKeyword = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return ['libido', 'fertility', 'reproductive', 'intimacy', 'sexual'].some(keyword => query.includes(keyword));
  }, [searchQuery]);

  const highlightIntimacyStacks = searchHasIntimacyKeyword || filters.goals.some(goal => ['libido', 'fertility', 'hormones'].includes(goal));

  const highlightedPremadeStacks = useMemo(() => {
    if (!highlightIntimacyStacks) return [];
    return visiblePremadeStacks.filter(stack => ['libido', 'fertility'].includes(stack.primaryGoal));
  }, [highlightIntimacyStacks, visiblePremadeStacks]);

  const orderedPremadeStacks = useMemo(() => {
    if (!highlightIntimacyStacks || highlightedPremadeStacks.length === 0) {
      return visiblePremadeStacks;
    }

    const highlightedIds = new Set(highlightedPremadeStacks.map(stack => stack.id));
    return [
      ...highlightedPremadeStacks,
      ...visiblePremadeStacks.filter(stack => !highlightedIds.has(stack.id))
    ];
  }, [highlightIntimacyStacks, highlightedPremadeStacks, visiblePremadeStacks]);

  const handleAddPremadeStack = useCallback((stack: SupplementStack) => {
    stack.ingredients.forEach(ingredient => {
      const supplement = supplementMap.get(ingredient.supplementId);
      if (supplement) {
        onSelectSupplement(supplement);
      }
    });
  }, [onSelectSupplement, supplementMap]);

  // Filter and sort supplements
  const filteredSupplements = useMemo(() => {
    let result = [...supplements];
    
    // Quick filter
    if (activeQuickFilter) {
      const allowedIds = getQuickFilterIds(activeQuickFilter);
      if (allowedIds.length > 0) {
        result = result.filter(s => allowedIds.includes(s.id));
      }
    }
    
    // Search query
    if (searchQuery.trim()) {
      const { lowered, tokens, normalizedGoals, normalizedSystems } = tokenizeSearchQuery(searchQuery);
      const matchesText = (text: string) => {
        const lowerText = text.toLowerCase();
        return lowerText.includes(lowered) || tokens.some(token => lowerText.includes(token));
      };

      result = result.filter(s => 
        matchesText(s.name) ||
        matchesText(s.description) ||
        s.benefits.some(b => matchesText(b)) ||
        s.goals.some(g => matchesText(g)) ||
        s.systems.some(system => matchesText(system)) ||
        normalizedGoals.some(goal => getNormalizedGoals(s).includes(goal)) ||
        normalizedSystems.some(system => getNormalizedSystems(s).includes(system)) ||
        (s.traditionalUse && matchesText(s.traditionalUse))
      );
    }
    
    // Type filter
    if (filters.types.length > 0) {
      result = result.filter(s => filters.types.includes(s.type));
    }
    
    // Evidence filter
    if (filters.evidence.length > 0) {
      result = result.filter(s => filters.evidence.includes(s.evidence));
    }
    
    // Goals filter
    if (normalizedFilterGoals.length > 0) {
      result = result.filter(s => 
        normalizedFilterGoals.some(goal => getNormalizedGoals(s).includes(goal))
      );
    }
    
    // Systems filter
    if (filters.systems.length > 0) {
      result = result.filter(s => 
        filters.systems.some(system => getNormalizedSystems(s).includes(system))
      );
    }
    
    // Form guidance filter
    if (filters.hasFormGuidance) {
      result = result.filter(s => formGuidance[s.id]);
    }
    
    // Traditional only
    if (filters.traditionalOnly) {
      result = result.filter(s => s.category === 'traditional' || s.type === 'ayurvedic');
    }
    
    // Modern only
    if (filters.modernOnly) {
      result = result.filter(s => s.category === 'modern');
    }
    
    // Safe for filters
    if (filters.safeFor.includes('pregnancy')) {
      result = result.filter(s => 
        !s.avoidIf?.some(a => a.toLowerCase().includes('pregnan'))
      );
    }
    
    // Sort
    switch (sortBy) {
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'evidence':
        result.sort((a, b) => evidenceConfig[b.evidence].score - evidenceConfig[a.evidence].score);
        break;
      case 'popularity':
        result.sort((a, b) => (popularityScores[b.id] || 0) - (popularityScores[a.id] || 0));
        break;
      case 'relevance':
      default:
        // Boost personalized recommendations and popular supplements
        result.sort((a, b) => {
          const aPersonalized = personalizedRecommendations.find(r => r.id === a.id) ? 50 : 0;
          const bPersonalized = personalizedRecommendations.find(r => r.id === b.id) ? 50 : 0;
          const aPopularity = popularityScores[a.id] || 0;
          const bPopularity = popularityScores[b.id] || 0;
          const aEvidence = evidenceConfig[a.evidence].score * 10;
          const bEvidence = evidenceConfig[b.evidence].score * 10;
          
          return (bPersonalized + bPopularity + bEvidence) - (aPersonalized + aPopularity + aEvidence);
        });
    }
    
    return result;
  }, [searchQuery, filters, sortBy, activeQuickFilter, personalizedRecommendations, normalizedFilterGoals]);

  // Similar supplements finder
  const findSimilarSupplements = useCallback((supplement: Supplement) => {
    return supplements
      .filter(s => s.id !== supplement.id)
      .map(s => {
        const sharedGoals = getNormalizedGoals(s).filter(g => getNormalizedGoals(supplement).includes(g)).length;
        const sharedSystems = getNormalizedSystems(s).filter(sys => getNormalizedSystems(supplement).includes(sys)).length;
        const sameType = s.type === supplement.type ? 2 : 0;
        return { supplement: s, score: sharedGoals * 2 + sharedSystems + sameType };
      })
      .filter(x => x.score > 2)
      .sort((a, b) => b.score - a.score)
      .slice(0, 4)
      .map(x => x.supplement);
  }, []);

  // Toggle filter
  const toggleFilter = (key: keyof FilterState, value: string) => {
    setFilters(prev => {
      const arr = prev[key] as string[];
      if (arr.includes(value)) {
        return { ...prev, [key]: arr.filter(v => v !== value) };
      } else {
        return { ...prev, [key]: [...arr, value] };
      }
    });
    setActiveQuickFilter(null);
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      types: [],
      evidence: [],
      goals: [],
      systems: [],
      timing: [],
      safeFor: [],
      hasFormGuidance: false,
      traditionalOnly: false,
      modernOnly: false,
    });
    setSearchQuery('');
    setActiveQuickFilter(null);
  };

  const activeFilterCount = 
    filters.types.length + 
    filters.evidence.length + 
    filters.goals.length + 
    filters.systems.length +
    (filters.hasFormGuidance ? 1 : 0) +
    (filters.traditionalOnly ? 1 : 0) +
    (filters.modernOnly ? 1 : 0);

  const hasActiveSearch = searchQuery.trim().length > 0;
  const hasActiveFilters = Boolean(activeQuickFilter) || activeFilterCount > 0;
  const shouldCollapsePremadeStacks = hasActiveSearch || hasActiveFilters;

  useEffect(() => {
    setShowPremadeStacks(!shouldCollapsePremadeStacks);
  }, [shouldCollapsePremadeStacks]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Browse Recommendations</h2>
          <p className="text-sm text-gray-500">Explore individual supplements or pre-made stacks.</p>
        </div>
        <div className="inline-flex rounded-xl border border-gray-200 bg-white p-1">
          <button
            type="button"
            onClick={() => setBrowseMode('supplements')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
              browseMode === 'supplements' ? 'bg-emerald-500 text-white' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Supplements
          </button>
          <button
            type="button"
            onClick={() => setBrowseMode('stacks')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
              browseMode === 'stacks' ? 'bg-emerald-500 text-white' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Stacks
          </button>
        </div>
      </div>
      {/* Personalized Recommendations Banner */}
      {browseMode === 'supplements' && personalizedRecommendations.length > 0 && !searchQuery && !activeQuickFilter && activeFilterCount === 0 && (
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-5 border border-emerald-200">
          <h3 className="font-bold text-emerald-800 mb-3 flex items-center gap-2">
            <span>✨</span> Personalized for You
          </h3>
          <div className="flex flex-wrap gap-2">
            {personalizedRecommendations.slice(0, 6).map(rec => {
              const supp = supplements.find(s => s.id === rec.id);
              if (!supp) return null;
              return (
                <button
                  key={rec.id}
                  onClick={() => setExpandedCard(rec.id)}
                  className="bg-white px-3 py-2 rounded-xl border border-emerald-200 hover:border-emerald-400 transition text-left"
                >
                  <div className="font-medium text-sm text-gray-900">{supp.name.split(' ')[0]}</div>
                  <div className="text-xs text-emerald-600">{rec.reason}</div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {browseMode === 'stacks' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-emerald-200 p-5 shadow-sm space-y-4">
            <div>
              <h3 className="font-bold text-emerald-800 flex items-center gap-2">
                <span>💞</span> Pre-made Intimacy & Reproductive Stacks
              </h3>
              <p className="text-sm text-emerald-700">Evidence-informed stacks built from the intimacy and fertility research.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {visiblePremadeStacks.map(stack => (
                <div key={stack.id} className="border border-emerald-100 rounded-2xl bg-emerald-50/40 overflow-hidden">
                  <div className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">💫</span>
                          <h4 className="font-semibold text-gray-900">{stack.name}</h4>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{stack.description}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setExpandedStack(expandedStack === stack.id ? null : stack.id)}
                        className="text-xs font-medium text-emerald-600 bg-white border border-emerald-200 px-2 py-1 rounded-full hover:bg-emerald-50"
                      >
                        {expandedStack === stack.id ? 'Hide' : 'Details'}
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {stack.ingredients.map(ingredient => {
                        const supplement = supplementMap.get(ingredient.supplementId);
                        return supplement ? (
                          <span key={ingredient.supplementId} className="text-xs bg-white border border-gray-200 text-gray-700 px-2 py-1 rounded-full">
                            {supplement.name}
                          </span>
                        ) : null;
                      })}
                    </div>
                    {expandedStack === stack.id && (
                      <div className="space-y-3">
                        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 space-y-2">
                          <p className="text-xs uppercase tracking-wide text-emerald-600 font-semibold">Synergy</p>
                          <p className="text-sm text-emerald-900">{stack.synergyDescription}</p>
                        </div>
                        <div className="space-y-2">
                          {stack.ingredients.map(ingredient => {
                            const supplement = supplementMap.get(ingredient.supplementId);
                            if (!supplement) return null;
                            return (
                              <div key={ingredient.supplementId} className="text-xs text-gray-600">
                                <span className="font-semibold text-gray-800">{supplement.name}:</span> {ingredient.dosage} — {ingredient.reason}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="border-t border-gray-100 p-3 flex items-center justify-between bg-white">
                    <span className="text-xs text-gray-500">Adds all supplements to your stack builder.</span>
                    <button
                      type="button"
                      onClick={() => handleAddPremadeStack(stack)}
                      className="text-xs font-semibold text-white bg-emerald-500 px-3 py-1.5 rounded-lg hover:bg-emerald-600 transition"
                    >
                      Add Stack
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  <span>✨</span> Featured Stacks
                </h3>
                <p className="text-sm text-gray-500">Curated combinations with synergy benefits highlighted.</p>
              </div>
              {selectedSupplements.length > 0 && (
                <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                  {selectedSupplements.length} in your stack
                </span>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {curatedStacks.map(stack => {
                const isExpanded = expandedStack === stack.id;
                const stackSupplements = stack.supplementIds
                  .map(id => supplementMap.get(id))
                  .filter((supplement): supplement is Supplement => Boolean(supplement));

                return (
                  <div key={stack.id} className="border border-gray-100 rounded-2xl bg-gray-50/40 overflow-hidden">
                    <div className="p-4 space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{stack.icon ?? '📦'}</span>
                            <h4 className="font-semibold text-gray-900">{stack.name}</h4>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{stack.description}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setExpandedStack(isExpanded ? null : stack.id)}
                          className="text-xs font-medium text-emerald-600 bg-white border border-emerald-200 px-2 py-1 rounded-full hover:bg-emerald-50"
                        >
                          {isExpanded ? 'Hide' : 'Details'}
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {stackSupplements.map(supplement => (
                          <span key={supplement.id} className="text-xs bg-white border border-gray-200 text-gray-700 px-2 py-1 rounded-full">
                            {supplement.name}
                          </span>
                        ))}
                      </div>

                      {isExpanded && (
                        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 space-y-2">
                          <p className="text-xs uppercase tracking-wide text-emerald-600 font-semibold">Synergy Benefit</p>
                          <p className="text-sm text-emerald-900">{stack.synergyDescription}</p>
                          {stack.bestFor && (
                            <p className="text-xs text-emerald-700">
                              Best for: {stack.bestFor.join(', ')}
                            </p>
                          )}
                        </div>
                      )}

                      <div className="flex flex-wrap items-center gap-2">
                        {stack.goals.map(goal => (
                          <span key={goal} className="text-xs text-emerald-700 bg-emerald-100 px-2 py-1 rounded-full capitalize">
                            {goal}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="border-t border-gray-100 p-3 flex items-center justify-between bg-white">
                      <span className="text-xs text-gray-500">Adds all supplements to your stack builder.</span>
                      <button
                        type="button"
                        onClick={() => onSelectStack(stack)}
                        className="text-xs font-semibold text-white bg-emerald-500 px-3 py-1.5 rounded-lg hover:bg-emerald-600 transition"
                      >
                        Add Stack
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {browseMode === 'supplements' && (
        <>
          <div className="bg-white rounded-2xl border border-emerald-200 p-5 shadow-sm space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-500">Pre-Made Stacks</p>
                <h3 className="font-bold text-emerald-800 flex items-center gap-2">
                  <span>🌿</span> Goal-Based Stack Starters
                </h3>
                <p className="text-sm text-emerald-700">Quickly add evidence-informed combinations tailored to major health goals.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowPremadeStacks(prev => !prev)}
                className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full hover:bg-emerald-100 transition"
              >
                {showPremadeStacks ? 'Hide Stacks' : 'View Stacks'}
              </button>
            </div>
            {showPremadeStacks ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {orderedPremadeStacks.map(stack => {
                  const isHighlighted = highlightIntimacyStacks && ['libido', 'fertility'].includes(stack.primaryGoal);

                  return (
                    <div
                      key={stack.id}
                      className={`border rounded-2xl overflow-hidden ${
                        isHighlighted
                          ? 'border-emerald-200 bg-emerald-50/40'
                          : 'border-gray-200 bg-white'
                      }`}
                    >
                      <div className="p-4 space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-2xl">{isHighlighted ? '💞' : '💫'}</span>
                              <h4 className="font-semibold text-gray-900">{stack.name}</h4>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{stack.description}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setExpandedStack(expandedStack === stack.id ? null : stack.id)}
                            className="text-xs font-medium text-emerald-600 bg-white border border-emerald-200 px-2 py-1 rounded-full hover:bg-emerald-50"
                          >
                            {expandedStack === stack.id ? 'Hide' : 'Details'}
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {stack.ingredients.map(ingredient => {
                            const supplement = supplementMap.get(ingredient.supplementId);
                            return supplement ? (
                              <span key={ingredient.supplementId} className="text-xs bg-white border border-gray-200 text-gray-700 px-2 py-1 rounded-full">
                                {supplement.name}
                              </span>
                            ) : null;
                          })}
                        </div>
                        {expandedStack === stack.id && (
                          <div className="space-y-3">
                            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 space-y-2">
                              <p className="text-xs uppercase tracking-wide text-emerald-600 font-semibold">Synergy</p>
                              <p className="text-sm text-emerald-900">{stack.synergyDescription}</p>
                            </div>
                            <div className="space-y-2">
                              {stack.ingredients.map(ingredient => {
                                const supplement = supplementMap.get(ingredient.supplementId);
                                if (!supplement) return null;
                                return (
                                  <div key={ingredient.supplementId} className="text-xs text-gray-600">
                                    <span className="font-semibold text-gray-800">{supplement.name}:</span> {ingredient.dosage} — {ingredient.reason}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="border-t border-gray-100 p-3 flex items-center justify-between bg-white">
                        <span className="text-xs text-gray-500">Adds all supplements to your stack builder.</span>
                        <button
                          type="button"
                          onClick={() => handleAddPremadeStack(stack)}
                          className="text-xs font-semibold text-white bg-emerald-500 px-3 py-1.5 rounded-lg hover:bg-emerald-600 transition"
                        >
                          Add Stack
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-wrap items-center gap-2 text-xs text-emerald-700">
                <span className="bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-full">
                  {shouldCollapsePremadeStacks ? 'Stacks minimized while filters are active.' : 'Stacks are hidden.'}
                </span>
                <span className="text-gray-500">
                  {shouldCollapsePremadeStacks ? 'Clear filters or use “View Stacks” to expand.' : 'Use “View Stacks” to expand.'}
                </span>
              </div>
            )}
          </div>

          {/* Quick Filters */}
          {!showFilters && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-gray-700">Quick Filters</h4>
                {(activeQuickFilter || activeFilterCount > 0) && (
                  <button onClick={clearFilters} className="text-xs text-emerald-600 hover:text-emerald-700">
                    Clear all
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {quickFilters.map(qf => (
                  <button
                    key={qf.id}
                    onClick={() => {
                      setActiveQuickFilter(activeQuickFilter === qf.id ? null : qf.id);
                      setFilters({ ...filters, types: [], evidence: [], goals: [], systems: [], timing: [], safeFor: [], hasFormGuidance: false, traditionalOnly: false, modernOnly: false });
                    }}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
                      activeQuickFilter === qf.id
                        ? 'bg-emerald-500 text-white'
                        : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {qf.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Search Bar */}
          <div className="relative">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setActiveQuickFilter(null); }}
              placeholder="Search supplements, benefits, or goals..."
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Advanced Filters Toggle */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900"
            >
          <svg className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
          Advanced Filters
          {activeFilterCount > 0 && (
            <span className="bg-emerald-500 text-white text-xs px-2 py-0.5 rounded-full">{activeFilterCount}</span>
          )}
        </button>

        <div className="flex items-center gap-3">
          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="relevance">Sort: Relevance</option>
            <option value="evidence">Sort: Evidence</option>
            <option value="popularity">Sort: Popularity</option>
            <option value="name">Sort: A-Z</option>
          </select>

          {/* View Mode */}
          <div className="flex bg-gray-100 rounded-lg p-0.5">
            {(['list', 'grid', 'compact'] as ViewMode[]).map(mode => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`p-1.5 rounded-md transition ${viewMode === mode ? 'bg-white shadow-sm' : ''}`}
              >
                {mode === 'list' && (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
                {mode === 'grid' && (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                )}
                {mode === 'compact' && (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
          </div>

          {/* Advanced Filters Panel */}
          {showFilters && (
            <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
          {/* Type filters */}
          <div>
            <h5 className="text-xs font-semibold text-gray-500 uppercase mb-2">Type</h5>
            <div className="flex flex-wrap gap-2">
              {Object.entries(typeConfig).map(([type, config]) => (
                <button
                  key={type}
                  onClick={() => toggleFilter('types', type)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition flex items-center gap-1.5 ${
                    filters.types.includes(type as Supplement['type'])
                      ? `${config.bg} ${config.color}`
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <span>{config.icon}</span>
                  {config.label}
                </button>
              ))}
            </div>
          </div>

          {/* Evidence filters */}
          <div>
            <h5 className="text-xs font-semibold text-gray-500 uppercase mb-2">Evidence Level</h5>
            <div className="flex flex-wrap gap-2">
              {Object.entries(evidenceConfig).map(([level, config]) => (
                <button
                  key={level}
                  onClick={() => toggleFilter('evidence', level)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
                    filters.evidence.includes(level as Supplement['evidence'])
                      ? `${config.bg} ${config.color}`
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {config.label}
                </button>
              ))}
            </div>
          </div>

          {/* Goal Category Filters */}
          <div>
            <h5 className="text-xs font-semibold text-gray-500 uppercase mb-2">Health Goals</h5>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {Object.entries(goalCategories).map(([category, goals]) => (
                <button
                  key={category}
                  onClick={() => {
                    const hasAny = goals.some(g => filters.goals.includes(g));
                    if (hasAny) {
                      setFilters(prev => ({ ...prev, goals: prev.goals.filter(g => !goals.includes(g)) }));
                    } else {
                      setFilters(prev => ({ ...prev, goals: [...prev.goals, ...goals.filter(g => !prev.goals.includes(g))] }));
                    }
                  }}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition text-left ${
                    goals.some(g => filters.goals.includes(g))
                      ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                      : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Body Systems */}
          <div>
            <h5 className="text-xs font-semibold text-gray-500 uppercase mb-2">Body Systems</h5>
            <div className="flex flex-wrap gap-2">
              {allSystems.map(system => (
                <button
                  key={system}
                  onClick={() => toggleFilter('systems', system)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition capitalize ${
                    filters.systems.includes(system)
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {system}
                </button>
              ))}
            </div>
          </div>

          {/* Special Filters */}
          <div>
            <h5 className="text-xs font-semibold text-gray-500 uppercase mb-2">Special</h5>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilters(prev => ({ ...prev, hasFormGuidance: !prev.hasFormGuidance }))}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
                  filters.hasFormGuidance ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                💊 Has Form Guidance
              </button>
              <button
                onClick={() => setFilters(prev => ({ ...prev, traditionalOnly: !prev.traditionalOnly, modernOnly: false }))}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
                  filters.traditionalOnly ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                🕉️ Traditional Only
              </button>
              <button
                onClick={() => setFilters(prev => ({ ...prev, modernOnly: !prev.modernOnly, traditionalOnly: false }))}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
                  filters.modernOnly ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                🔬 Modern Science Only
              </button>
            </div>
          </div>
            </div>
          )}

          {/* Results Count */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Individual Supplements</p>
                <h3 className="text-base font-semibold text-gray-900">Supplement Results</h3>
              </div>
              {selectedSupplements.length > 0 && (
                <span className="text-sm text-emerald-600 font-medium">{selectedSupplements.length} selected</span>
              )}
            </div>
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>Showing {filteredSupplements.length} of {supplements.length} supplements</span>
            </div>
          </div>

          {/* Results */}
          {filteredSupplements.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
              <div className="text-4xl mb-3">🔍</div>
              {highlightIntimacyStacks && highlightedPremadeStacks.length > 0 ? (
                <>
                  <p className="text-gray-600 font-medium">No individual supplements found.</p>
                  <p className="text-sm text-gray-500 mt-1">Showing pre-made stacks only.</p>
                </>
              ) : (
                <>
                  <p className="text-gray-600 font-medium">No supplements match your filters</p>
                  <p className="text-sm text-gray-500 mt-1">Try adjusting your search or filters</p>
                </>
              )}
              <button onClick={clearFilters} className="mt-4 text-emerald-600 font-medium hover:text-emerald-700">
                Clear all filters
              </button>
            </div>
          ) : viewMode === 'compact' ? (
            <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
              {filteredSupplements.map(supplement => (
                <CompactCard
                  key={supplement.id}
                  supplement={supplement}
                  isSelected={selectedSupplements.some(s => s.id === supplement.id)}
                  onSelect={() => onSelectSupplement(supplement)}
                  personalReason={personalizedRecommendations.find(r => r.id === supplement.id)?.reason}
                />
              ))}
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSupplements.map(supplement => (
                <GridCard
                  key={supplement.id}
                  supplement={supplement}
                  isExpanded={expandedCard === supplement.id}
                  onToggle={() => setExpandedCard(expandedCard === supplement.id ? null : supplement.id)}
                  isSelected={selectedSupplements.some(s => s.id === supplement.id)}
                  onSelect={() => onSelectSupplement(supplement)}
                  personalReason={personalizedRecommendations.find(r => r.id === supplement.id)?.reason}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredSupplements.map(supplement => (
                <ListCard
                  key={supplement.id}
                  supplement={supplement}
                  isExpanded={expandedCard === supplement.id}
                  onToggle={() => setExpandedCard(expandedCard === supplement.id ? null : supplement.id)}
                  isSelected={selectedSupplements.some(s => s.id === supplement.id)}
                  onSelect={() => onSelectSupplement(supplement)}
                  similarSupplements={expandedCard === supplement.id ? findSimilarSupplements(supplement) : []}
                  personalReason={personalizedRecommendations.find(r => r.id === supplement.id)?.reason}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

// Compact Card Component
function CompactCard({ supplement, isSelected, onSelect, personalReason }: {
  supplement: Supplement;
  isSelected: boolean;
  onSelect: () => void;
  personalReason?: string;
}) {
  const type = typeConfig[supplement.type];
  const evidence = evidenceConfig[supplement.evidence];

  return (
    <div className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition">
      <button
        onClick={onSelect}
        className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition ${
          isSelected ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-gray-300 hover:border-emerald-400'
        }`}
      >
        {isSelected && (
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>
      <span className="text-lg">{type.icon}</span>
      <div className="flex-1 min-w-0">
        <span className="font-medium text-gray-900 text-sm">{supplement.name}</span>
        {personalReason && (
          <span className="ml-2 text-xs text-emerald-600">✨ {personalReason}</span>
        )}
      </div>
      <span className={`text-xs px-2 py-0.5 rounded-full ${evidence.bg} ${evidence.color}`}>
        {supplement.evidence}
      </span>
    </div>
  );
}

// Grid Card Component
function GridCard({ supplement, isExpanded, onToggle, isSelected, onSelect, personalReason }: {
  supplement: Supplement;
  isExpanded: boolean;
  onToggle: () => void;
  isSelected: boolean;
  onSelect: () => void;
  personalReason?: string;
}) {
  const type = typeConfig[supplement.type];
  const evidence = evidenceConfig[supplement.evidence];

  return (
    <div className={`bg-white rounded-xl border transition ${isSelected ? 'border-emerald-400 ring-2 ring-emerald-100' : 'border-gray-200'}`}>
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <span className="text-2xl">{type.icon}</span>
          <button
            onClick={onSelect}
            className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition ${
              isSelected ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-gray-300 hover:border-emerald-400'
            }`}
          >
            {isSelected && (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>
        </div>
        <h3 className="font-semibold text-gray-900 text-sm mb-1">{supplement.name.split('(')[0].trim()}</h3>
        {personalReason && (
          <p className="text-xs text-emerald-600 mb-2">✨ {personalReason}</p>
        )}
        <div className="flex items-center gap-1.5 mb-2">
          <span className={`text-xs px-2 py-0.5 rounded-full ${type.bg} ${type.color}`}>
            {type.label}
          </span>
          <span className={`text-xs px-2 py-0.5 rounded-full ${evidence.bg} ${evidence.color}`}>
            {supplement.evidence}
          </span>
        </div>
        <p className="text-xs text-gray-600 line-clamp-2 mb-3">{supplement.description}</p>
        <div className="flex flex-wrap gap-1">
          {supplement.benefits.slice(0, 3).map((benefit, i) => (
            <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
              {benefit.length > 20 ? benefit.substring(0, 20) + '...' : benefit}
            </span>
          ))}
        </div>
      </div>
      <button
        onClick={onToggle}
        className="w-full py-2 border-t border-gray-100 text-xs font-medium text-emerald-600 hover:bg-emerald-50 transition"
      >
        {isExpanded ? 'Show Less' : 'View Details'}
      </button>
    </div>
  );
}

// List Card Component (most detailed)
function ListCard({ supplement, isExpanded, onToggle, isSelected, onSelect, similarSupplements, personalReason }: {
  supplement: Supplement;
  isExpanded: boolean;
  onToggle: () => void;
  isSelected: boolean;
  onSelect: () => void;
  similarSupplements: Supplement[];
  personalReason?: string;
}) {
  const type = typeConfig[supplement.type];
  const evidence = evidenceConfig[supplement.evidence];
  const hasFormGuide = formGuidance[supplement.id];

  return (
    <div className={`bg-white rounded-xl border overflow-hidden transition ${isSelected ? 'border-emerald-400 ring-2 ring-emerald-100' : 'border-gray-200'}`}>
      {/* Header */}
      <div className="p-4 cursor-pointer" onClick={onToggle}>
        <div className="flex items-start gap-3">
          <button
            onClick={(e) => { e.stopPropagation(); onSelect(); }}
            className={`flex-shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition ${
              isSelected ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-gray-300 hover:border-emerald-400'
            }`}
          >
            {isSelected && (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="text-lg">{type.icon}</span>
              <h3 className="font-semibold text-gray-900">{supplement.name}</h3>
            </div>
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${type.bg} ${type.color}`}>
                {type.label}
              </span>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${evidence.bg} ${evidence.color}`}>
                {evidence.label}
              </span>
              {hasFormGuide && (
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                  💊 Form Guide
                </span>
              )}
              {personalReason && (
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                  ✨ {personalReason}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600 line-clamp-2">{supplement.description}</p>
          </div>

          <button className={`flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
            <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Expanded Content */}
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

          {/* Form Guidance */}
          {hasFormGuide && (
            <div className="bg-purple-50 rounded-xl p-3">
              <h4 className="text-xs font-semibold text-purple-700 mb-2">💊 Form Intelligence</h4>
              <div className="space-y-1 mb-2">
                {hasFormGuide.forms.slice(0, 4).map((form, i) => (
                  <div key={i} className={`text-xs p-1.5 rounded ${form.avoid ? 'bg-red-100 text-red-700' : 'bg-white text-gray-700'}`}>
                    <span className="font-medium">{form.name}</span>
                    <span className="ml-1 text-gray-500">({form.bioavailability})</span>
                    {form.avoid && <span className="ml-1 text-red-600">⚠️</span>}
                    <p className="text-xs text-gray-500 mt-0.5">{form.bestFor}</p>
                  </div>
                ))}
              </div>
              <div className="text-xs space-y-1">
                <p><span className="text-green-600 font-medium">✓ Enhances:</span> {hasFormGuide.enhancers.join(', ')}</p>
                {hasFormGuide.blockers.length > 0 && (
                  <p><span className="text-red-600 font-medium">✗ Blocks:</span> {hasFormGuide.blockers.join(', ')}</p>
                )}
                <p className="text-purple-600 mt-1">{hasFormGuide.foodFirst.note}</p>
              </div>
            </div>
          )}

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

          {/* Evidence sources */}
          {supplement.evidenceSources && supplement.evidenceSources.length > 0 && (
            <div className="bg-white border border-slate-100 rounded-xl p-3">
              <h4 className="text-xs font-semibold text-slate-700 mb-2">🔗 Evidence Sources</h4>
              <ul className="space-y-1 text-xs text-slate-600">
                {supplement.evidenceSources.map((source, index) => (
                  <li key={`${source.title}-${index}`}>
                    <a className="text-emerald-700 hover:underline" href={source.url} target="_blank" rel="noreferrer">
                      {source.title}
                    </a>
                    {source.note && <span className="text-slate-400"> — {source.note}</span>}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Similar Supplements */}
          {similarSupplements.length > 0 && (
            <div className="border-t border-gray-100 pt-4">
              <h4 className="text-xs font-semibold text-gray-700 mb-2">🔗 Similar Supplements</h4>
              <div className="flex flex-wrap gap-2">
                {similarSupplements.map(sim => (
                  <div key={sim.id} className="bg-gray-50 px-3 py-2 rounded-lg">
                    <span className="text-sm font-medium text-gray-900">{sim.name.split(' ')[0]}</span>
                    <span className={`ml-2 text-xs px-1.5 py-0.5 rounded ${evidenceConfig[sim.evidence].bg} ${evidenceConfig[sim.evidence].color}`}>
                      {sim.evidence}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AdvancedBrowse;
