import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  KnowledgeCategory,
  KnowledgeEvidenceStrengthTag,
  KnowledgeSafetyFlag,
  PragmaticTier,
  Supplement,
  UserProfile,
} from '../types';
import { supplements, formGuidance } from '../data/supplements';
import { normalizeGoals, normalizeSystems } from '../utils/normalization';
import { SupplementDetailModal } from './SupplementDetailModal';
import {
  getSupplementKnowledgeById,
  knowledgeDisclaimers,
} from '../data/supplementKnowledge';
import {
  getPragmaticTierForSupplement,
  getPragmaticTierInfo,
  getPragmaticTierScore,
  pragmaticTierConfig,
} from '../data/pragmaticTiers';
import { buildSupplementSafetyAssessment } from '../utils/analyzer';
import {
  searchSupplementsWithScores,
  suggestClosestSupplementTerm,
} from '../utils/supplementSearchEngine';
import { dedupeSupplementsByCanonical, getCanonicalSupplementKey } from '../utils/supplementCanonical';

type SortOption = 'relevance' | 'evidence' | 'pragmatic-tier' | 'name' | 'popularity';
type ViewMode = 'grid' | 'list' | 'compact';
type SafeForFilter =
  | 'pregnancy'
  | 'breastfeeding'
  | 'low-interaction'
  | 'stimulant-sensitive'
  | 'sedation-sensitive';

interface FilterState {
  types: Supplement['type'][];
  evidence: Supplement['evidence'][];
  pragmaticTiers: PragmaticTier[];
  goals: string[];
  systems: string[];
  knowledgeCategories: KnowledgeCategory[];
  evidenceTags: KnowledgeEvidenceStrengthTag[];
  safetyFlags: KnowledgeSafetyFlag[];
  timing: string[];
  safeFor: SafeForFilter[];
  hasFormGuidance: boolean;
  traditionalOnly: boolean;
  modernOnly: boolean;
}

interface FilteredSupplementResult {
  supplement: Supplement;
  searchScore: number;
  matchReasons: string[];
  safetyFlags: string[];
  cautionLevel?: 'high' | 'moderate' | 'low';
  safetyPenalty: number;
  excludedForSafety: boolean;
}

interface AdvancedBrowseProps {
  userProfile: UserProfile;
  onSelectSupplement: (supplement: Supplement) => void;
  selectedSupplements: Supplement[];
}

type SupplementKnowledge = NonNullable<ReturnType<typeof getSupplementKnowledgeById>>;

const browseSupplements = dedupeSupplementsByCanonical(supplements);

const allSystems = Array.from(new Set(browseSupplements.flatMap(s => normalizeSystems(s.systems)))).sort();
const knowledgeEntries = browseSupplements
  .map((supplement) => getSupplementKnowledgeById(supplement.id))
  .filter((entry): entry is NonNullable<ReturnType<typeof getSupplementKnowledgeById>> => Boolean(entry));
const allKnowledgeCategories: KnowledgeCategory[] = Array.from(
  new Set(knowledgeEntries.flatMap((entry) => entry.categories))
).sort((a, b) => a.localeCompare(b));
const allKnowledgeEvidenceTags: KnowledgeEvidenceStrengthTag[] = Array.from(
  new Set(knowledgeEntries.flatMap((entry) => entry.evidenceStrengthTags))
).sort((a, b) => a.localeCompare(b));
const allKnowledgeSafetyFlags: KnowledgeSafetyFlag[] = Array.from(
  new Set(knowledgeEntries.flatMap((entry) => entry.safetyFlags))
).sort((a, b) => a.localeCompare(b));

const goalCategories = {
  'Energy & Vitality': ['energy'],
  'Brain & Focus': ['brain'],
  'Mood & Emotions': ['mood', 'stress'],
  'Sleep & Recovery': ['sleep'],
  'Hormones & Balance': ['hormones'],
  'Reproductive Health': ['fertility'],
  'Sexual Function': ['sexual-health'],
  'Intimacy & Libido': ['libido'],
  'Immune Support': ['immunity'],
  'Digestion & Gut': ['digestion'],
  'Fitness & Muscle': ['fitness'],
  'Inflammation & Pain': ['inflammation'],
  'Heart & Cardio': ['heart'],
  'Skin & Beauty': ['beauty'],
  'Longevity & Aging': ['longevity'],
  'Metabolic & Blood Sugar': ['metabolic'],
  'Liver & Detox': ['detox'],
};

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

const knowledgeCategoryConfig: Record<KnowledgeCategory, { label: string; color: string; bg: string }> = {
  'vitamin': { label: 'Vitamin', color: 'text-amber-700', bg: 'bg-amber-100' },
  'mineral': { label: 'Mineral', color: 'text-sky-700', bg: 'bg-sky-100' },
  'herb': { label: 'Herb', color: 'text-green-700', bg: 'bg-green-100' },
  'tea': { label: 'Tea', color: 'text-teal-700', bg: 'bg-teal-100' },
  'adaptogen': { label: 'Adaptogen', color: 'text-lime-700', bg: 'bg-lime-100' },
  'amino-acid': { label: 'Amino Acid', color: 'text-violet-700', bg: 'bg-violet-100' },
  'fatty-acid': { label: 'Fatty Acid', color: 'text-indigo-700', bg: 'bg-indigo-100' },
  'probiotic': { label: 'Probiotic', color: 'text-cyan-700', bg: 'bg-cyan-100' },
  'mushroom': { label: 'Mushroom', color: 'text-rose-700', bg: 'bg-rose-100' },
  'enzyme': { label: 'Enzyme', color: 'text-teal-700', bg: 'bg-teal-100' },
  'performance': { label: 'Performance', color: 'text-red-700', bg: 'bg-red-100' },
  'antioxidant': { label: 'Antioxidant', color: 'text-fuchsia-700', bg: 'bg-fuchsia-100' },
  'other': { label: 'Other', color: 'text-gray-700', bg: 'bg-gray-100' },
};

const evidenceTagConfig: Record<KnowledgeEvidenceStrengthTag, { label: string; color: string; bg: string }> = {
  'well-supported': { label: 'Well Supported', color: 'text-emerald-700', bg: 'bg-emerald-100' },
  'mixed': { label: 'Mixed Data', color: 'text-yellow-700', bg: 'bg-yellow-100' },
  'emerging': { label: 'Emerging', color: 'text-blue-700', bg: 'bg-blue-100' },
  'traditional': { label: 'Traditional', color: 'text-orange-700', bg: 'bg-orange-100' },
};

const safetyFlagConfig: Record<KnowledgeSafetyFlag, { label: string; color: string; bg: string }> = {
  'pregnancy': { label: 'Pregnancy Caution', color: 'text-rose-700', bg: 'bg-rose-100' },
  'breastfeeding': { label: 'Breastfeeding Caution', color: 'text-pink-700', bg: 'bg-pink-100' },
  'drug-interaction': { label: 'Drug Interaction', color: 'text-red-700', bg: 'bg-red-100' },
  'bleeding-risk': { label: 'Bleeding Risk', color: 'text-red-700', bg: 'bg-red-100' },
  'blood-pressure': { label: 'Blood Pressure', color: 'text-orange-700', bg: 'bg-orange-100' },
  'blood-sugar': { label: 'Blood Sugar', color: 'text-amber-700', bg: 'bg-amber-100' },
  'sedation': { label: 'Sedation', color: 'text-indigo-700', bg: 'bg-indigo-100' },
  'stimulant': { label: 'Stimulant', color: 'text-fuchsia-700', bg: 'bg-fuchsia-100' },
  'thyroid': { label: 'Thyroid Caution', color: 'text-purple-700', bg: 'bg-purple-100' },
  'liver': { label: 'Liver Caution', color: 'text-orange-700', bg: 'bg-orange-100' },
  'kidney': { label: 'Kidney Caution', color: 'text-blue-700', bg: 'bg-blue-100' },
  'autoimmune': { label: 'Autoimmune Caution', color: 'text-violet-700', bg: 'bg-violet-100' },
  'general-caution': { label: 'General Caution', color: 'text-gray-700', bg: 'bg-gray-100' },
};

const safeForConfig: Record<SafeForFilter, { label: string; activeClass: string }> = {
  pregnancy: { label: 'Pregnancy-friendly', activeClass: 'bg-rose-100 text-rose-700' },
  breastfeeding: { label: 'Breastfeeding-friendly', activeClass: 'bg-pink-100 text-pink-700' },
  'low-interaction': { label: 'Lower major interaction risk', activeClass: 'bg-red-100 text-red-700' },
  'stimulant-sensitive': { label: 'No stimulants', activeClass: 'bg-fuchsia-100 text-fuchsia-700' },
  'sedation-sensitive': { label: 'No sedative effect', activeClass: 'bg-indigo-100 text-indigo-700' },
};

const pregnancyFriendlySupplementIds = new Set(['folate', 'iodine', 'iron', 'choline', 'omega-3', 'vitamin-d3', 'vitamin-b12']);
const breastfeedingLowerRiskSupplementIds = new Set(['omega-3', 'vitamin-d3', 'vitamin-b12', 'folate', 'magnesium', 'iodine', 'iron', 'choline']);

const strongInteractionSignalPattern =
  /warfarin|maoi|ssri|snri|anticoagul|blood thinner|antiplatelet|immunosuppress|digoxin|lithium|levodopa|carbidopa|contraindicat|do not combine|avoid with|major interaction/;

const hasSignificantInteractionRisk = (
  supplement: Supplement,
  knowledge?: SupplementKnowledge
): boolean => {
  const interactionText = [
    ...(supplement.drugInteractions || []),
    ...(supplement.cautions || []),
    ...(supplement.avoidIf || []),
    ...(knowledge?.safetyNotes || []),
  ]
    .join(' ')
    .toLowerCase();
  return strongInteractionSignalPattern.test(interactionText);
};

const allSupplementTypes = Object.keys(typeConfig) as Supplement['type'][];
const supplementTypeCounts = allSupplementTypes.reduce((counts, type) => {
  counts[type] = browseSupplements.filter((supplement) => supplement.type === type).length;
  return counts;
}, {} as Record<Supplement['type'], number>);
const visibleSupplementTypes = allSupplementTypes.filter((type) => supplementTypeCounts[type] > 0);

const popularityScores: Record<string, number> = {
  'vitamin-d3': 100, 'omega-3': 98, 'magnesium': 97, 'vitamin-b12': 90, 'vitamin-c': 89,
  'ashwagandha': 95, 'creatine': 94, 'probiotics': 88, 'zinc': 87, 'collagen': 86,
  'turmeric-curcumin': 85, 'lions-mane': 80, 'melatonin': 82, 'coq10': 75, 'rhodiola': 70,
  'l-theanine': 72, 'brahmi-bacopa': 65, 'nac': 60, 'glycine': 55, 'tongkat-ali': 68,
};

interface QuickFilter {
  id: string;
  label: string;
  goals: string[];
  types: Supplement['type'][];
  evidence: Supplement['evidence'][];
  pragmaticTiers: PragmaticTier[];
  ids?: string[];
}

const quickFilters: QuickFilter[] = [
  { id: 'beginners', label: '🌱 Beginner Essentials', goals: [], types: [], evidence: [], pragmaticTiers: [], ids: ['vitamin-d3', 'magnesium', 'omega-3', 'vitamin-b12', 'zinc'] },
  { id: 'sleep', label: '😴 Sleep Stack', goals: ['sleep'], types: [], evidence: [], pragmaticTiers: [] },
  { id: 'energy', label: '⚡ Energy & Focus', goals: ['energy', 'brain'], types: [], evidence: [], pragmaticTiers: [] },
  { id: 'stress', label: '🧘 Stress & Calm', goals: ['stress'], types: [], evidence: [], pragmaticTiers: [] },
  { id: 'immunity', label: '🛡️ Immune Support', goals: ['immunity'], types: [], evidence: [], pragmaticTiers: [] },
  { id: 'longevity', label: '⏳ Longevity', goals: ['longevity'], types: [], evidence: [], pragmaticTiers: [] },
  { id: 'strong-evidence', label: '✅ Strong Evidence', goals: [], types: [], evidence: ['strong'], pragmaticTiers: [] },
  { id: 'top-pragmatic', label: '🏆 Pragmatic Top Tier', goals: [], types: [], evidence: [], pragmaticTiers: ['S+', 'S'] },
];

export function AdvancedBrowse({ userProfile, onSelectSupplement, selectedSupplements }: AdvancedBrowseProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('relevance');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [activeQuickFilter, setActiveQuickFilter] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [activeSupplement, setActiveSupplement] = useState<Supplement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const loadingTimeoutRef = useRef<number | null>(null);
  const listContainerRef = useRef<HTMLDivElement | null>(null);
  const [listScrollTop, setListScrollTop] = useState(0);
  const [listHeight, setListHeight] = useState(520);

  const [filters, setFilters] = useState<FilterState>({
    types: [],
    evidence: [],
    pragmaticTiers: [],
    goals: [],
    systems: [],
    knowledgeCategories: [],
    evidenceTags: [],
    safetyFlags: [],
    timing: [],
    safeFor: [],
    hasFormGuidance: false,
    traditionalOnly: false,
    modernOnly: false,
  });

  const triggerLoading = useCallback((): void => {
    if (loadingTimeoutRef.current !== null) {
      window.clearTimeout(loadingTimeoutRef.current);
    }
    setIsLoading(true);
    loadingTimeoutRef.current = window.setTimeout(() => setIsLoading(false), 280);
  }, []);

  useEffect(() => {
    return () => {
      if (loadingTimeoutRef.current !== null) {
        window.clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const container = listContainerRef.current;
    if (!container) return;
    const observer = new ResizeObserver(() => {
      setListHeight(container.clientHeight);
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  const normalizedFilterGoals = useMemo(() => normalizeGoals(filters.goals), [filters.goals]);

  const personalizedRecommendations = useMemo(() => {
    const recs: { id: string; reason: string }[] = [];
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

    return recs.filter((rec, index, self) => self.findIndex(r => r.id === rec.id) === index);
  }, [userProfile]);

  const selectedSupplementsByCanonical = useMemo(() => {
    const byCanonical = new Map<string, Supplement>();
    for (const selected of selectedSupplements) {
      const canonicalKey = getCanonicalSupplementKey(selected);
      if (!byCanonical.has(canonicalKey)) {
        byCanonical.set(canonicalKey, selected);
      }
    }
    return byCanonical;
  }, [selectedSupplements]);

  const handleSelectSupplement = useCallback((supplement: Supplement): void => {
    const canonicalKey = getCanonicalSupplementKey(supplement);
    const selectedEquivalent = selectedSupplementsByCanonical.get(canonicalKey);
    onSelectSupplement(selectedEquivalent ?? supplement);
  }, [onSelectSupplement, selectedSupplementsByCanonical]);

  const activeFilterCount = useMemo(() => {
    return (
      filters.types.length +
      filters.evidence.length +
      filters.pragmaticTiers.length +
      filters.goals.length +
      filters.systems.length +
      filters.knowledgeCategories.length +
      filters.evidenceTags.length +
      filters.safetyFlags.length +
      filters.safeFor.length +
      (filters.hasFormGuidance ? 1 : 0) +
      (filters.traditionalOnly ? 1 : 0) +
      (filters.modernOnly ? 1 : 0)
    );
  }, [filters]);

  const safetyAssessmentById = useMemo(() => {
    return new Map(
      browseSupplements.map((supplement) => [supplement.id, buildSupplementSafetyAssessment(supplement, userProfile)])
    );
  }, [userProfile]);

  const filteredResults = useMemo<FilteredSupplementResult[]>(() => {
    const getSafetyPenalty = (supplementId: string): number => {
      const assessment = safetyAssessmentById.get(supplementId);
      if (!assessment) return 0;
      const cautionPenalty = assessment.cautionLevel === 'high'
        ? 0.45
        : assessment.cautionLevel === 'moderate'
          ? 0.2
          : assessment.cautionLevel === 'low'
            ? 0.08
            : 0;
      const exclusionPenalty = assessment.exclude ? 1.1 : 0;
      return Math.min(1.6, assessment.scorePenalty + cautionPenalty + exclusionPenalty);
    };

    let result = [...browseSupplements];
    const scoredSearchResults = searchQuery.trim()
      ? searchSupplementsWithScores(searchQuery, browseSupplements, { gender: userProfile.sex })
      : [];
    const scoredSearchById = new Map(scoredSearchResults.map((entry) => [entry.supplement.id, entry]));

    if (activeQuickFilter) {
      const quick = quickFilters.find(filter => filter.id === activeQuickFilter);
      if (quick?.ids) {
        result = result.filter(s => quick.ids?.includes(s.id));
      }
      if (quick?.goals?.length) {
        result = result.filter(s => normalizeGoals(s.goals).some(goal => quick.goals.includes(goal)));
      }
      if (quick?.evidence?.length) {
        result = result.filter(s => quick.evidence.includes(s.evidence));
      }
      if (quick?.pragmaticTiers?.length) {
        result = result.filter((s) => {
          const tier = getPragmaticTierForSupplement(s);
          return Boolean(tier && quick.pragmaticTiers.includes(tier));
        });
      }
    }

    if (searchQuery.trim()) {
      result = result.filter((supplement) => scoredSearchById.has(supplement.id));
    }

    if (filters.types.length > 0) {
      result = result.filter(s => filters.types.includes(s.type));
    }

    if (filters.evidence.length > 0) {
      result = result.filter(s => filters.evidence.includes(s.evidence));
    }

    if (filters.pragmaticTiers.length > 0) {
      result = result.filter((s) => {
        const tier = getPragmaticTierForSupplement(s);
        return Boolean(tier && filters.pragmaticTiers.includes(tier));
      });
    }

    if (normalizedFilterGoals.length > 0) {
      result = result.filter(s => normalizedFilterGoals.some(goal => normalizeGoals(s.goals).includes(goal)));
    }

    if (filters.systems.length > 0) {
      result = result.filter(s => filters.systems.some(system => normalizeSystems(s.systems).includes(system)));
    }

    if (filters.knowledgeCategories.length > 0) {
      result = result.filter(s => {
        const knowledge = getSupplementKnowledgeById(s.id);
        if (!knowledge) return false;
        return filters.knowledgeCategories.some(category => knowledge.categories.includes(category));
      });
    }

    if (filters.evidenceTags.length > 0) {
      result = result.filter(s => {
        const knowledge = getSupplementKnowledgeById(s.id);
        if (!knowledge) return false;
        return filters.evidenceTags.some(tag => knowledge.evidenceStrengthTags.includes(tag));
      });
    }

    if (filters.safetyFlags.length > 0) {
      result = result.filter(s => {
        const knowledge = getSupplementKnowledgeById(s.id);
        if (!knowledge) return false;
        return filters.safetyFlags.some(flag => knowledge.safetyFlags.includes(flag));
      });
    }

    if (filters.hasFormGuidance) {
      result = result.filter(s => Boolean(formGuidance[s.id]));
    }

    if (filters.traditionalOnly) {
      result = result.filter(s => s.category === 'traditional' || s.type === 'ayurvedic');
    }

    if (filters.modernOnly) {
      result = result.filter(s => s.category === 'modern');
    }

    if (filters.safeFor.length > 0) {
      result = result.filter((s) => {
        const knowledge = getSupplementKnowledgeById(s.id);
        const avoidText = (s.avoidIf || []).join(' ').toLowerCase();
        const cautionText = [...(s.cautions || []), ...(s.drugInteractions || [])].join(' ').toLowerCase();
        const knowledgeFlags = new Set(knowledge?.safetyFlags || []);

        if (filters.safeFor.includes('pregnancy')) {
          const hasExplicitRisk = /pregnan|conceive|trying to conceive|ovulation/.test(avoidText) || knowledgeFlags.has('pregnancy');
          if (hasExplicitRisk) return false;
          if (!pregnancyFriendlySupplementIds.has(s.id)) return false;
        }

        if (filters.safeFor.includes('breastfeeding')) {
          const hasExplicitRisk = /breastfeed|lactation/.test(avoidText) || knowledgeFlags.has('breastfeeding');
          if (hasExplicitRisk) return false;
          if (!breastfeedingLowerRiskSupplementIds.has(s.id)) return false;
        }

        if (filters.safeFor.includes('low-interaction')) {
          const legacyRisk = hasSignificantInteractionRisk(s, knowledge || undefined);
          const safetyAssessment = safetyAssessmentById.get(s.id);
          const highCaution =
            safetyAssessment?.cautionLevel === 'high'
            || (safetyAssessment?.scorePenalty || 0) >= 0.5;
          if (legacyRisk || highCaution) return false;
        }

        if (filters.safeFor.includes('stimulant-sensitive')) {
          const legacyRisk = /stimul|caffeine|jitters|alert/.test(cautionText);
          if (legacyRisk || knowledgeFlags.has('stimulant')) return false;
        }

        if (filters.safeFor.includes('sedation-sensitive')) {
          const legacyRisk = /sedat|drows|sleepy|bedtime/.test(cautionText);
          if (legacyRisk || knowledgeFlags.has('sedation')) return false;
        }

        return true;
      });
    }

    switch (sortBy) {
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'evidence':
        result.sort((a, b) => evidenceConfig[b.evidence].score - evidenceConfig[a.evidence].score);
        break;
      case 'pragmatic-tier':
        result.sort((a, b) => {
          const aTier = getPragmaticTierForSupplement(a);
          const bTier = getPragmaticTierForSupplement(b);
          const scoreDelta = getPragmaticTierScore(bTier) - getPragmaticTierScore(aTier);
          if (scoreDelta !== 0) return scoreDelta;
          return evidenceConfig[b.evidence].score - evidenceConfig[a.evidence].score;
        });
        break;
      case 'popularity':
        result.sort((a, b) => (popularityScores[b.id] || 0) - (popularityScores[a.id] || 0));
        break;
      case 'relevance':
      default:
        result.sort((a, b) => {
          const aSearchScore = scoredSearchById.get(a.id)?.score || 0;
          const bSearchScore = scoredSearchById.get(b.id)?.score || 0;
          const aSafetyPenalty = getSafetyPenalty(a.id) * 30;
          const bSafetyPenalty = getSafetyPenalty(b.id) * 30;
          const aSearchRank = aSearchScore - aSafetyPenalty;
          const bSearchRank = bSearchScore - bSafetyPenalty;
          if (searchQuery.trim() && bSearchRank !== aSearchRank) {
            return bSearchRank - aSearchRank;
          }

          const aKnowledge = getSupplementKnowledgeById(a.id);
          const bKnowledge = getSupplementKnowledgeById(b.id);
          const queryGoalHints = normalizeGoals(searchQuery.toLowerCase().split(/[^a-z0-9-]+/).filter(Boolean));
          const aKnowledgeGoalMatches = queryGoalHints.filter(goal =>
            normalizeGoals(aKnowledge?.typicalUseCases || []).includes(goal)
          ).length * 4;
          const bKnowledgeGoalMatches = queryGoalHints.filter(goal =>
            normalizeGoals(bKnowledge?.typicalUseCases || []).includes(goal)
          ).length * 4;
          const aPersonalized = personalizedRecommendations.find(r => r.id === a.id) ? 24 : 0;
          const bPersonalized = personalizedRecommendations.find(r => r.id === b.id) ? 24 : 0;
          const aPopularity = popularityScores[a.id] || 0;
          const bPopularity = popularityScores[b.id] || 0;
          const aEvidence = evidenceConfig[a.evidence].score * 10;
          const bEvidence = evidenceConfig[b.evidence].score * 10;
          const aPragmaticTier = getPragmaticTierScore(getPragmaticTierForSupplement(a)) * 8;
          const bPragmaticTier = getPragmaticTierScore(getPragmaticTierForSupplement(b)) * 8;
          const aTotal =
            aSearchRank +
            aKnowledgeGoalMatches +
            aPersonalized +
            aPopularity +
            aEvidence +
            aPragmaticTier;
          const bTotal =
            bSearchRank +
            bKnowledgeGoalMatches +
            bPersonalized +
            bPopularity +
            bEvidence +
            bPragmaticTier;

          return bTotal - aTotal;
        });
    }

    return result.map((supplement) => {
      const scored = scoredSearchById.get(supplement.id);
      const safetyAssessment = safetyAssessmentById.get(supplement.id);
      return {
        supplement,
        searchScore: scored?.score || 0,
        matchReasons: scored?.reasons.map((reason) => reason.label).slice(0, 3) || [],
        safetyFlags: safetyAssessment?.flags || [],
        cautionLevel: safetyAssessment?.cautionLevel,
        safetyPenalty: getSafetyPenalty(supplement.id),
        excludedForSafety: Boolean(safetyAssessment?.exclude),
      };
    });
  }, [searchQuery, filters, sortBy, activeQuickFilter, personalizedRecommendations, normalizedFilterGoals, userProfile.sex, safetyAssessmentById]);

  const suggestedQuery = useMemo(() => {
    if (!searchQuery.trim()) return null;
    return suggestClosestSupplementTerm(searchQuery, browseSupplements);
  }, [searchQuery]);

  const isVirtualized = viewMode === 'list' && filteredResults.length > 100;
  // Simple windowing to avoid rendering 100+ cards at once.
  const itemHeight = 150;
  const overscan = 6;
  const startIndex = Math.max(0, Math.floor(listScrollTop / itemHeight) - overscan);
  const visibleCount = Math.ceil(listHeight / itemHeight) + overscan * 2;
  const endIndex = Math.min(filteredResults.length, startIndex + visibleCount);
  const visibleResults = isVirtualized ? filteredResults.slice(startIndex, endIndex) : filteredResults;
  const paddingTop = isVirtualized ? startIndex * itemHeight : 0;
  const paddingBottom = isVirtualized ? (filteredResults.length - endIndex) * itemHeight : 0;

  const handleQuickFilter = (filterId: string): void => {
    const next = activeQuickFilter === filterId ? null : filterId;
    triggerLoading();
    setActiveQuickFilter(next);
    setFilters(prev => ({
      ...prev,
      goals: [],
      types: [],
      evidence: [],
      pragmaticTiers: [],
      systems: [],
      knowledgeCategories: [],
      evidenceTags: [],
      safetyFlags: [],
      timing: [],
      safeFor: [],
      hasFormGuidance: false,
      traditionalOnly: false,
      modernOnly: false
    }));
  };

  const clearFilters = (): void => {
    triggerLoading();
    setFilters({
      types: [],
      evidence: [],
      pragmaticTiers: [],
      goals: [],
      systems: [],
      knowledgeCategories: [],
      evidenceTags: [],
      safetyFlags: [],
      timing: [],
      safeFor: [],
      hasFormGuidance: false,
      traditionalOnly: false,
      modernOnly: false,
    });
    setSearchQuery('');
    setActiveQuickFilter(null);
  };

  const toggleFilter = (key: keyof FilterState, value: string): void => {
    const currentValues = filters[key] as string[];
    const nextFilters = currentValues.includes(value)
      ? { ...filters, [key]: currentValues.filter(v => v !== value) }
      : { ...filters, [key]: [...currentValues, value] };
    triggerLoading();
    setFilters(nextFilters);
    setActiveQuickFilter(null);
  };

  const handleSearchChange = (value: string): void => {
    triggerLoading();
    setSearchQuery(value);
  };

  const handleClearSearch = (): void => {
    triggerLoading();
    setSearchQuery('');
  };

  const handleSortChange = (value: SortOption): void => {
    triggerLoading();
    setSortBy(value);
  };

  const handleViewModeChange = (mode: ViewMode): void => {
    triggerLoading();
    setViewMode(mode);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Browse Supplements</h2>
          <p className="text-sm text-gray-500">Use targeted filters to explore evidence-backed options.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowFilters(prev => !prev)}
            className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:border-emerald-300 hover:text-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'}
            {activeFilterCount > 0 && (
              <span className="rounded-full bg-emerald-500 px-2 py-0.5 text-xs font-semibold text-white">
                {activeFilterCount}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={clearFilters}
            className="rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            Clear All
          </button>
        </div>
      </div>

      <div className="relative">
        <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Search supplements, benefits, or goals..."
          className="w-full rounded-2xl border border-gray-200 bg-white py-3 pl-12 pr-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={handleClearSearch}
            aria-label="Clear search"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-full p-1"
          >
            ✕
          </button>
        )}
      </div>

      {personalizedRecommendations.length > 0 && !searchQuery && activeFilterCount === 0 && (
        <div className="rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50 p-5">
          <h3 className="text-sm font-semibold text-emerald-800 mb-3">Personalized starting points</h3>
          <div className="flex flex-wrap gap-2">
            {personalizedRecommendations.slice(0, 6).map(rec => {
              const supp = (() => {
                const directMatch = browseSupplements.find(s => s.id === rec.id);
                if (directMatch) return directMatch;
                const sourceMatch = supplements.find(s => s.id === rec.id);
                if (!sourceMatch) return undefined;
                const canonicalKey = getCanonicalSupplementKey(sourceMatch);
                return browseSupplements.find(s => getCanonicalSupplementKey(s) === canonicalKey);
              })();
              if (!supp) return null;
              return (
                <button
                  key={rec.id}
                  type="button"
                  onClick={() => setActiveSupplement(supp)}
                  className="rounded-xl border border-emerald-200 bg-white px-3 py-2 text-left hover:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <div className="text-sm font-medium text-gray-900">{supp.name.split(' ')[0]}</div>
                  <div className="text-xs text-emerald-600">{rec.reason}</div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {showFilters && (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 space-y-6">
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Quick picks</h4>
            <div className="flex flex-wrap gap-2">
              {quickFilters.map(filter => (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() => handleQuickFilter(filter.id)}
                  className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                    activeQuickFilter === filter.id
                      ? 'bg-emerald-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Health goals</h4>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(goalCategories).map(([category, goals]) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => {
                      const hasAny = goals.some(goal => filters.goals.includes(goal));
                      const nextGoals = hasAny
                        ? filters.goals.filter(goal => !goals.includes(goal))
                        : [...filters.goals, ...goals.filter(goal => !filters.goals.includes(goal))];
                      triggerLoading();
                      setFilters(prev => ({ ...prev, goals: nextGoals }));
                      setActiveQuickFilter(null);
                    }}
                    className={`rounded-xl border px-3 py-2 text-left text-xs font-medium transition ${
                      goals.some(goal => filters.goals.includes(goal))
                        ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                        : 'border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Supplement type</h4>
              <div className="flex flex-wrap gap-2">
                {visibleSupplementTypes.map((type) => {
                  const config = typeConfig[type];
                  const typeCount = supplementTypeCounts[type];
                  return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => toggleFilter('types', type)}
                    className={`rounded-full px-3 py-1.5 text-sm font-medium transition flex items-center gap-1.5 ${
                      filters.types.includes(type as Supplement['type'])
                        ? `${config.bg} ${config.color}`
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <span>{config.icon}</span>
                    <span>{config.label}</span>
                    <span className="rounded-full bg-white/80 px-1.5 py-0.5 text-[10px] font-semibold text-gray-500">
                      {typeCount}
                    </span>
                  </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Evidence level</h4>
              <div className="flex flex-wrap gap-2">
                {Object.entries(evidenceConfig).map(([level, config]) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => toggleFilter('evidence', level)}
                    className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                      filters.evidence.includes(level as Supplement['evidence'])
                        ? `${config.bg} ${config.color}`
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {config.label}
                  </button>
                ))}
              </div>
              <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mt-4 mb-2">Pragmatic tier</h4>
              <div className="flex flex-wrap gap-2">
                {(Object.keys(pragmaticTierConfig) as PragmaticTier[]).map((tier) => {
                  const config = pragmaticTierConfig[tier];
                  return (
                    <button
                      key={tier}
                      type="button"
                      onClick={() => toggleFilter('pragmaticTiers', tier)}
                      className={`rounded-full px-3 py-1.5 text-sm font-semibold transition ${
                        filters.pragmaticTiers.includes(tier)
                          ? `${config.bg} ${config.color}`
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                      title={config.description}
                    >
                      Tier {tier}
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Form intelligence</h4>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    triggerLoading();
                    setFilters(prev => ({ ...prev, hasFormGuidance: !prev.hasFormGuidance }));
                  }}
                  className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                    filters.hasFormGuidance ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  💊 Has Form Guidance
                </button>
                <button
                  type="button"
                  onClick={() => {
                    triggerLoading();
                    setFilters(prev => ({ ...prev, traditionalOnly: !prev.traditionalOnly, modernOnly: false }));
                  }}
                  className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                    filters.traditionalOnly ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  🕉️ Traditional Only
                </button>
                <button
                  type="button"
                  onClick={() => {
                    triggerLoading();
                    setFilters(prev => ({ ...prev, modernOnly: !prev.modernOnly, traditionalOnly: false }));
                  }}
                  className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                    filters.modernOnly ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  🔬 Modern Science Only
                </button>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowAdvancedFilters(prev => !prev)}
            className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-full px-2 py-1"
          >
            {showAdvancedFilters ? 'Hide advanced filters' : 'Show advanced filters'}
          </button>

          {showAdvancedFilters && (
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Body systems</h4>
                <div className="flex flex-wrap gap-2">
                  {allSystems.map(system => (
                    <button
                      key={system}
                      type="button"
                      onClick={() => toggleFilter('systems', system)}
                      className={`rounded-full px-3 py-1.5 text-sm font-medium capitalize transition ${
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
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Knowledge categories</h4>
                <div className="flex flex-wrap gap-2">
                  {allKnowledgeCategories.map(category => {
                    const config = knowledgeCategoryConfig[category];
                    return (
                      <button
                        key={category}
                        type="button"
                        onClick={() => toggleFilter('knowledgeCategories', category)}
                        className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                          filters.knowledgeCategories.includes(category)
                            ? `${config.bg} ${config.color}`
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {config.label}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Evidence profile tags</h4>
                <div className="flex flex-wrap gap-2">
                  {allKnowledgeEvidenceTags.map(tag => {
                    const config = evidenceTagConfig[tag];
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleFilter('evidenceTags', tag)}
                        className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                          filters.evidenceTags.includes(tag)
                            ? `${config.bg} ${config.color}`
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {config.label}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Safety warnings</h4>
                <div className="flex flex-wrap gap-2">
                  {(Object.keys(safeForConfig) as SafeForFilter[]).map((safeForKey) => (
                    <button
                      key={safeForKey}
                      type="button"
                      onClick={() => toggleFilter('safeFor', safeForKey)}
                      className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                        filters.safeFor.includes(safeForKey)
                          ? safeForConfig[safeForKey].activeClass
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {safeForConfig[safeForKey].label}
                    </button>
                  ))}
                  {allKnowledgeSafetyFlags.map(flag => {
                    const config = safetyFlagConfig[flag];
                    return (
                      <button
                        key={flag}
                        type="button"
                        onClick={() => toggleFilter('safetyFlags', flag)}
                        className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                          filters.safetyFlags.includes(flag)
                            ? `${config.bg} ${config.color}`
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {config.label}
                      </button>
                    );
                  })}
                </div>
              </div>
              <p className="text-xs text-gray-500">
                {knowledgeDisclaimers.medical}
              </p>
            </div>
          )}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Search results</p>
          <h3 className="text-lg font-semibold text-gray-900">
            {filteredResults.length} results found
          </h3>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value as SortOption)}
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="relevance">Sort: Relevance</option>
            <option value="evidence">Sort: Evidence</option>
            <option value="pragmatic-tier">Sort: Pragmatic Tier</option>
            <option value="popularity">Sort: Popularity</option>
            <option value="name">Sort: A-Z</option>
          </select>
          <div className="flex rounded-lg bg-gray-100 p-0.5">
            {(['grid', 'list', 'compact'] as ViewMode[]).map(mode => (
              <button
                key={mode}
                type="button"
                onClick={() => handleViewModeChange(mode)}
                className={`rounded-md px-2 py-1 text-xs font-medium transition ${
                  viewMode === mode ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
                }`}
              >
                {mode === 'grid' ? 'Grid' : mode === 'list' ? 'List' : 'Compact'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={`skeleton-${index}`} className="rounded-2xl border border-gray-200 bg-white p-4 animate-pulse">
              <div className="h-6 w-16 rounded-full bg-gray-200 mb-4" />
              <div className="h-4 w-3/4 rounded bg-gray-200 mb-2" />
              <div className="h-3 w-full rounded bg-gray-100 mb-4" />
              <div className="flex gap-2">
                <div className="h-5 w-16 rounded-full bg-gray-100" />
                <div className="h-5 w-20 rounded-full bg-gray-100" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredResults.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center">
          <div className="text-4xl mb-3">🔍</div>
          <p className="text-gray-600 font-medium">No supplements match your filters</p>
          <p className="text-sm text-gray-500 mt-1">Try adjusting your search or filters</p>
          {searchQuery.trim() && suggestedQuery && suggestedQuery.toLowerCase() !== searchQuery.trim().toLowerCase() && (
            <button
              type="button"
              onClick={() => handleSearchChange(suggestedQuery)}
              className="mt-3 inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 hover:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              Did you mean: {suggestedQuery}?
            </button>
          )}
          <button
            type="button"
            onClick={clearFilters}
            className="mt-4 text-emerald-600 font-medium hover:text-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-full px-3 py-1"
          >
            Clear all filters
          </button>
        </div>
      ) : viewMode === 'compact' ? (
        <div className="rounded-2xl border border-gray-200 bg-white divide-y divide-gray-100">
          {visibleResults.map(({ supplement, matchReasons, cautionLevel, safetyFlags, excludedForSafety }) => {
            const canonicalKey = getCanonicalSupplementKey(supplement);
            const isSelected = selectedSupplementsByCanonical.has(canonicalKey);
            const selectionDisabled = excludedForSafety && !isSelected;
            return (
              <CompactCard
                key={supplement.id}
                supplement={supplement}
                matchReasons={searchQuery.trim() ? matchReasons : []}
                cautionLevel={cautionLevel}
                safetyFlags={safetyFlags}
                excludedForSafety={excludedForSafety}
                selectionDisabled={selectionDisabled}
                isSelected={isSelected}
                onSelect={() => handleSelectSupplement(supplement)}
                onViewDetails={() => setActiveSupplement(supplement)}
                personalReason={personalizedRecommendations.find(r => r.id === supplement.id)?.reason}
              />
            );
          })}
        </div>
      ) : viewMode === 'list' ? (
        <div
          ref={listContainerRef}
          onScroll={(event) => setListScrollTop(event.currentTarget.scrollTop)}
          className={`space-y-3 ${isVirtualized ? 'max-h-[520px] overflow-y-auto pr-1' : ''}`}
        >
          <div style={{ paddingTop, paddingBottom }} className="space-y-3">
            {visibleResults.map(({ supplement, matchReasons, cautionLevel, safetyFlags, excludedForSafety }) => {
              const canonicalKey = getCanonicalSupplementKey(supplement);
              const isSelected = selectedSupplementsByCanonical.has(canonicalKey);
              const selectionDisabled = excludedForSafety && !isSelected;
              return (
                <ListCard
                  key={supplement.id}
                  supplement={supplement}
                  matchReasons={searchQuery.trim() ? matchReasons : []}
                  cautionLevel={cautionLevel}
                  safetyFlags={safetyFlags}
                  excludedForSafety={excludedForSafety}
                  selectionDisabled={selectionDisabled}
                  isSelected={isSelected}
                  onSelect={() => handleSelectSupplement(supplement)}
                  onViewDetails={() => setActiveSupplement(supplement)}
                  personalReason={personalizedRecommendations.find(r => r.id === supplement.id)?.reason}
                />
              );
            })}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {visibleResults.map(({ supplement, matchReasons, cautionLevel, safetyFlags, excludedForSafety }) => {
            const canonicalKey = getCanonicalSupplementKey(supplement);
            const isSelected = selectedSupplementsByCanonical.has(canonicalKey);
            const selectionDisabled = excludedForSafety && !isSelected;
            return (
              <GridCard
                key={supplement.id}
                supplement={supplement}
                matchReasons={searchQuery.trim() ? matchReasons : []}
                cautionLevel={cautionLevel}
                safetyFlags={safetyFlags}
                excludedForSafety={excludedForSafety}
                selectionDisabled={selectionDisabled}
                isSelected={isSelected}
                onSelect={() => handleSelectSupplement(supplement)}
                onViewDetails={() => setActiveSupplement(supplement)}
                personalReason={personalizedRecommendations.find(r => r.id === supplement.id)?.reason}
              />
            );
          })}
        </div>
      )}

      <SupplementDetailModal
        supplement={activeSupplement}
        isOpen={Boolean(activeSupplement)}
        onClose={() => setActiveSupplement(null)}
        weightKg={userProfile.weightKg}
      />
    </div>
  );
}

interface CardProps {
  supplement: Supplement;
  isSelected: boolean;
  selectionDisabled?: boolean;
  onSelect: () => void;
  onViewDetails: () => void;
  personalReason?: string;
  matchReasons?: string[];
  cautionLevel?: 'high' | 'moderate' | 'low';
  safetyFlags?: string[];
  excludedForSafety?: boolean;
}

const formatMatchReason = (reason: string): string =>
  reason.length > 26 ? `${reason.slice(0, 26)}...` : reason;

const safetyBadgeConfig: Record<'high' | 'moderate' | 'low', { label: string; className: string }> = {
  high: { label: 'High Caution', className: 'bg-red-100 text-red-700' },
  moderate: { label: 'Moderate Caution', className: 'bg-amber-100 text-amber-700' },
  low: { label: 'Low Caution', className: 'bg-yellow-100 text-yellow-700' },
};

const getSafetyBadge = (
  cautionLevel?: 'high' | 'moderate' | 'low',
  excludedForSafety?: boolean
): { label: string; className: string } | null => {
  if (!cautionLevel) return null;
  if (excludedForSafety) {
    return { label: 'Needs Intake', className: 'bg-rose-100 text-rose-700' };
  }
  return safetyBadgeConfig[cautionLevel];
};

function CompactCard({
  supplement,
  isSelected,
  selectionDisabled,
  onSelect,
  onViewDetails,
  personalReason,
  matchReasons,
  cautionLevel,
  safetyFlags,
  excludedForSafety
}: CardProps) {
  const type = typeConfig[supplement.type];
  const evidence = evidenceConfig[supplement.evidence];
  const pragmaticTier = getPragmaticTierForSupplement(supplement);
  const pragmaticTierInfo = getPragmaticTierInfo(pragmaticTier);
  const safetyBadge = getSafetyBadge(cautionLevel, excludedForSafety);

  return (
    <div className="flex items-center gap-3 px-4 py-3 transition hover:bg-gray-50">
      <button
        type="button"
        disabled={selectionDisabled}
        onClick={onSelect}
        title={selectionDisabled ? 'Complete intake profile to add this supplement.' : undefined}
        className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border-2 transition ${
          isSelected
            ? 'border-emerald-500 bg-emerald-500 text-white'
            : selectionDisabled
              ? 'cursor-not-allowed border-gray-200 bg-gray-100 text-gray-300'
              : 'border-gray-300 hover:border-emerald-400'
        }`}
      >
        {isSelected && (
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>
      <span className="text-lg">{type.icon}</span>
      <div className="min-w-0 flex-1">
        <span className="text-sm font-medium text-gray-900">{supplement.name}</span>
        {personalReason && (
          <span className="ml-2 text-xs text-emerald-600">* {personalReason}</span>
        )}
        {matchReasons && matchReasons.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-1">
            {matchReasons.slice(0, 2).map((reason) => (
              <span key={reason} className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">
                {formatMatchReason(reason)}
              </span>
            ))}
          </div>
        )}
      </div>
      <button
        type="button"
        onClick={onViewDetails}
        className="rounded-full px-2 py-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
      >
        Details
      </button>
      <span className={`rounded-full px-2 py-0.5 text-xs ${evidence.bg} ${evidence.color}`}>
        {supplement.evidence}
      </span>
      {pragmaticTierInfo && (
        <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${pragmaticTierInfo.bg} ${pragmaticTierInfo.color}`}>
          Tier {pragmaticTierInfo.shortLabel}
        </span>
      )}
      {safetyBadge && (
        <span
          title={safetyFlags && safetyFlags.length > 0 ? safetyFlags[0] : safetyBadge.label}
          className={`rounded-full px-2 py-0.5 text-xs ${safetyBadge.className}`}
        >
          {safetyBadge.label}
        </span>
      )}
    </div>
  );
}

function GridCard({
  supplement,
  isSelected,
  selectionDisabled,
  onSelect,
  onViewDetails,
  personalReason,
  matchReasons,
  cautionLevel,
  safetyFlags,
  excludedForSafety
}: CardProps) {
  const type = typeConfig[supplement.type];
  const evidence = evidenceConfig[supplement.evidence];
  const pragmaticTier = getPragmaticTierForSupplement(supplement);
  const pragmaticTierInfo = getPragmaticTierInfo(pragmaticTier);
  const safetyBadge = getSafetyBadge(cautionLevel, excludedForSafety);

  return (
    <div className={`rounded-2xl border bg-white transition ${isSelected ? 'border-emerald-400 ring-2 ring-emerald-100' : 'border-gray-200'}`}>
      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between">
          <span className="text-2xl">{type.icon}</span>
          <button
            type="button"
            disabled={selectionDisabled}
            onClick={onSelect}
            title={selectionDisabled ? 'Complete intake profile to add this supplement.' : undefined}
            className={`flex h-8 w-8 items-center justify-center rounded-lg border-2 transition ${
              isSelected
                ? 'border-emerald-500 bg-emerald-500 text-white'
                : selectionDisabled
                  ? 'cursor-not-allowed border-gray-200 bg-gray-100 text-gray-300'
                  : 'border-gray-300 hover:border-emerald-400'
            }`}
          >
            {isSelected && (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-900">{supplement.name.split('(')[0].trim()}</h3>
          {personalReason && (
            <p className="mt-1 text-xs text-emerald-600">* {personalReason}</p>
          )}
          {matchReasons && matchReasons.length > 0 && (
            <div className="mt-1 flex flex-wrap gap-1">
              {matchReasons.slice(0, 2).map((reason) => (
                <span key={reason} className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">
                  {formatMatchReason(reason)}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="flex flex-wrap gap-1.5">
          <span className={`rounded-full px-2 py-0.5 text-xs ${type.bg} ${type.color}`}>
            {type.label}
          </span>
          <span className={`rounded-full px-2 py-0.5 text-xs ${evidence.bg} ${evidence.color}`}>
            {evidence.label}
          </span>
          {pragmaticTierInfo && (
            <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${pragmaticTierInfo.bg} ${pragmaticTierInfo.color}`}>
              Tier {pragmaticTierInfo.shortLabel}
            </span>
          )}
          {safetyBadge && (
            <span
              title={safetyFlags && safetyFlags.length > 0 ? safetyFlags[0] : safetyBadge.label}
              className={`rounded-full px-2 py-0.5 text-xs ${safetyBadge.className}`}
            >
              {safetyBadge.label}
            </span>
          )}
        </div>
        <p className="line-clamp-3 text-xs text-gray-600">{supplement.description}</p>
        <div className="flex flex-wrap gap-1">
          {supplement.benefits.slice(0, 3).map((benefit) => (
            <span key={benefit} className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] text-gray-600">
              {benefit.length > 20 ? benefit.substring(0, 20) + '...' : benefit}
            </span>
          ))}
        </div>
      </div>
      <button
        type="button"
        onClick={onViewDetails}
        className="w-full border-t border-gray-100 py-2 text-xs font-semibold text-emerald-600 hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
      >
        View Details
      </button>
    </div>
  );
}

function ListCard({
  supplement,
  isSelected,
  selectionDisabled,
  onSelect,
  onViewDetails,
  personalReason,
  matchReasons,
  cautionLevel,
  safetyFlags,
  excludedForSafety
}: CardProps) {
  const type = typeConfig[supplement.type];
  const evidence = evidenceConfig[supplement.evidence];
  const pragmaticTier = getPragmaticTierForSupplement(supplement);
  const pragmaticTierInfo = getPragmaticTierInfo(pragmaticTier);
  const hasFormGuide = formGuidance[supplement.id];
  const safetyBadge = getSafetyBadge(cautionLevel, excludedForSafety);

  return (
    <div className={`rounded-2xl border bg-white p-4 transition ${isSelected ? 'border-emerald-400 ring-2 ring-emerald-100' : 'border-gray-200'}`}>
      <div className="flex items-start gap-4">
        <button
          type="button"
          disabled={selectionDisabled}
          onClick={onSelect}
          title={selectionDisabled ? 'Complete intake profile to add this supplement.' : undefined}
          className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border-2 transition ${
            isSelected
              ? 'border-emerald-500 bg-emerald-500 text-white'
              : selectionDisabled
                ? 'cursor-not-allowed border-gray-200 bg-gray-100 text-gray-300'
                : 'border-gray-300 hover:border-emerald-400'
          }`}
        >
          {isSelected && (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>

        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-lg">{type.icon}</span>
            <h3 className="font-semibold text-gray-900">{supplement.name}</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${type.bg} ${type.color}`}>
              {type.label}
            </span>
            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${evidence.bg} ${evidence.color}`}>
              {evidence.label}
            </span>
            {pragmaticTierInfo && (
              <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${pragmaticTierInfo.bg} ${pragmaticTierInfo.color}`}>
                Tier {pragmaticTierInfo.shortLabel}
              </span>
            )}
            {hasFormGuide && (
              <span className="rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-700">
                Form Guide
              </span>
            )}
            {safetyBadge && (
              <span
                title={safetyFlags && safetyFlags.length > 0 ? safetyFlags[0] : safetyBadge.label}
                className={`rounded-full px-2 py-0.5 text-xs font-medium ${safetyBadge.className}`}
              >
                {safetyBadge.label}
              </span>
            )}
            {personalReason && (
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                * {personalReason}
              </span>
            )}
            {matchReasons && matchReasons.slice(0, 2).map((reason) => (
              <span key={reason} className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
                {formatMatchReason(reason)}
              </span>
            ))}
          </div>
          <p className="line-clamp-2 text-sm text-gray-600">{supplement.description}</p>
        </div>

        <button
          type="button"
          onClick={onViewDetails}
          className="self-start rounded-full border border-gray-200 px-3 py-1 text-xs font-semibold text-emerald-600 hover:border-emerald-300 hover:text-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          View Details
        </button>
      </div>
    </div>
  );
}

export default AdvancedBrowse;
