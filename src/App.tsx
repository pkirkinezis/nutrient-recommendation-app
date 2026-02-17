import { Suspense, lazy, useMemo, useEffect, useRef, useState, useCallback } from 'react';
import { CuratedStack, Supplement, SupplementStack, UserProfile, Recommendation, InteractionWarning, TrackingData, DailyLog, LabResult, LocalSyncMeta, UserPreferences, ConsentCheckIn } from './types/index';
import { supplements, formGuidance, supplementComparisons, misinformationAlerts } from './data/supplements';
import { checkInteractions, generateTimingSchedule, useGoalAnalysis } from './utils/analyzer';
import { AdvancedBrowse } from './components/AdvancedBrowse';
import { SupplementDetailModal } from './components/SupplementDetailModal';
import { ApplicationOverviewTab } from './components/ApplicationOverviewTab';
import { curatedStacks } from './data/curatedStacks';
import { premadeStacks } from './data/stacks';
import { getPragmaticTierForSupplement, getPragmaticTierInfo } from './data/pragmaticTiers';
import { FoodLookup } from './components/FoodLookup';
import { TrackingChart } from './components/TrackingChart';
import { useAuth } from './context/AuthContext';
import { db } from './config/firebase';
import { buildLocalSyncMeta, fetchCloudSnapshot, mergeCloudIntoLocal, uploadLocalSnapshot, type CloudSnapshot } from './utils/cloudSync';
import { calculateMetabolicMetrics } from './utils/metabolism';
import { buildTrackingChartData, buildTrackingCsv } from './utils/trackingExports';
import { getTranslation, type Language } from './utils/i18n';
import { hasReproductiveRiskSignalInText, isReproductiveScopeQuery } from './constants/reproductiveScope';
import { IntimacyWellnessSection } from './components/IntimacyWellnessSection';
import { clearIntimacyLocalData, DEFAULT_USER_PREFERENCES, loadIntimacyConsentCheckIns, loadIntimacyPreferences, saveIntimacyConsentCheckIns, saveIntimacyPreferences } from './utils/intimacyStorage';

const EducationalGuide = lazy(() => import('./components/EducationalGuide'));

// LocalStorage keys
const STORAGE_KEYS = {
  profile: 'nutricompass_profile',
  selectedSupplements: 'nutricompass_selected',
  lastQuery: 'nutricompass_query',
  tracking: 'nutricompass_tracking',
  labs: 'nutricompass_labs',
  cloudSyncEnabled: 'nutricompass_cloud_sync_enabled',
  cloudSyncMeta: 'nutricompass_cloud_sync_meta'
};

// Helper functions for display
const getTypeColor = (type: Supplement['type']): string => {
  const colors: Record<Supplement['type'], string> = {
    'vitamin': 'bg-amber-100 text-amber-700',
    'mineral': 'bg-blue-100 text-blue-700',
    'herb': 'bg-green-100 text-green-700',
    'tea': 'bg-teal-100 text-teal-700',
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
    'tea': 'Tea Herb',
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
      description: 'Multiple human trials support this indication'
    },
    'moderate': { 
      color: 'bg-yellow-100 text-yellow-700', 
      label: 'Moderate Evidence',
      description: 'Human evidence exists, but findings are mixed or limited'
    },
    'limited': { 
      color: 'bg-gray-100 text-gray-600', 
      label: 'Traditional/Limited',
      description: 'Traditional context or early evidence only; benefit remains uncertain'
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

const getCautionInfo = (cautionLevel?: Recommendation['cautionLevel']): { label: string; className: string } | null => {
  if (!cautionLevel) return null;
  const info: Record<NonNullable<Recommendation['cautionLevel']>, { label: string; className: string }> = {
    high: { label: 'High caution', className: 'bg-red-100 text-red-700' },
    moderate: { label: 'Moderate caution', className: 'bg-amber-100 text-amber-700' },
    low: { label: 'Low caution', className: 'bg-yellow-100 text-yellow-700' }
  };
  return info[cautionLevel];
};

const getMatchStrengthLabel = (
  matchType: 'keyword' | 'direct' | 'semantic' | 'none',
  confidence: number
): 'Stronger' | 'Moderate' | 'Exploratory' => {
  if (matchType === 'direct') return confidence >= 0.8 ? 'Stronger' : 'Moderate';
  if (matchType === 'keyword') return confidence >= 0.72 ? 'Stronger' : 'Moderate';
  if (matchType === 'semantic') return 'Moderate';
  return 'Exploratory';
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

const hasReproductiveRiskSignal = (supplement: Supplement): boolean => {
  const text = [
    ...(supplement.avoidIf || []),
    ...(supplement.cautions || []),
    ...(supplement.drugInteractions || []),
    ...(supplement.goals || [])
  ].join(' ').toLowerCase();
  return hasReproductiveRiskSignalInText(text);
};

export function App() {
  const { user, status: authStatus, error: authError, isConfigured: firebaseConfigured, signInWithEmail, registerWithEmail, signInWithGoogle, signOutUser } = useAuth();

  // Load persisted state from localStorage
  const [query, setQuery] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.lastQuery) || '';
    } catch { return ''; }
  });
  const [analyzedQuery, setAnalyzedQuery] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.lastQuery) || '';
    } catch { return ''; }
  });
  const [hasAnalyzed, setHasAnalyzed] = useState(false);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [identifiedGoals, setIdentifiedGoals] = useState<string[]>([]);
  const [identifiedSystems, setIdentifiedSystems] = useState<string[]>([]);
  const [matchType, setMatchType] = useState<'keyword' | 'direct' | 'semantic' | 'none'>('none');
  const [matchConfidence, setMatchConfidence] = useState(0);
  const [directSupplementIds, setDirectSupplementIds] = useState<string[]>([]);
  const [relatedSupplementIds, setRelatedSupplementIds] = useState<string[]>([]);
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
  const [showProfile, setShowProfile] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.profile);
      return saved ? JSON.parse(saved) : {};
    } catch { return {}; }
  });
  const [activeTab, setActiveTab] = useState<'find' | 'stacks' | 'learn' | 'about'>('find');
  const [findMode, setFindMode] = useState<'recommend' | 'browse'>('recommend');
  const [learnMode, setLearnMode] = useState<'guide' | 'insights' | 'track' | 'intimacy'>('insights');
  const [intimacyPreferences, setIntimacyPreferences] = useState<UserPreferences>(() => loadIntimacyPreferences());
  const [intimacyConsentCheckIns, setIntimacyConsentCheckIns] = useState<ConsentCheckIn[]>(() => loadIntimacyConsentCheckIns());
  const [language, setLanguage] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('nutricompass_language') as Language | null;
      return saved ?? 'en';
    } catch {
      return 'en';
    }
  });
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem('nutricompass_theme') as 'light' | 'dark' | null;
      if (saved) return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } catch {
      return 'light';
    }
  });
  const [activeSupplement, setActiveSupplement] = useState<Supplement | null>(null);
  const [expandedStack, setExpandedStack] = useState<string | null>(null);
  const [tips, setTips] = useState<string[]>([]);
  const [trackingData, setTrackingData] = useState<TrackingData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.tracking);
      return saved ? JSON.parse(saved) : { logs: [], startDate: new Date().toISOString().split('T')[0], supplements: [] };
    } catch { return { logs: [], startDate: new Date().toISOString().split('T')[0], supplements: [] }; }
  });
  const [labResults, setLabResults] = useState<LabResult[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.labs);
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  const [labDraft, setLabDraft] = useState<LabResult>({
    id: '',
    name: '',
    value: 0,
    unit: '',
    range: '',
    note: '',
    date: new Date().toISOString().split('T')[0]
  });
  const handleFoodLookupSupplement = (supplementId: string): void => {
    const supplement = supplements.find((item) => item.id === supplementId);
    if (!supplement) return;
    setActiveSupplement(supplement);
    setActiveTab('find');
    setFindMode('browse');
  };
  const [syncEnabled, setSyncEnabled] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.cloudSyncEnabled) === 'true';
    } catch {
      return false;
    }
  });
  const [syncMeta, setSyncMeta] = useState<LocalSyncMeta>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.cloudSyncMeta);
      return saved ? buildLocalSyncMeta(JSON.parse(saved) as Partial<LocalSyncMeta>) : buildLocalSyncMeta();
    } catch {
      return buildLocalSyncMeta();
    }
  });
  const [cloudReady, setCloudReady] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [showUploadPrompt, setShowUploadPrompt] = useState(false);
  const [pendingCloudSync, setPendingCloudSync] = useState(false);
  const pendingSnapshot = useRef<Awaited<ReturnType<typeof fetchCloudSnapshot>> | null>(null);
  const profileInitialized = useRef(false);
  const selectedInitialized = useRef(false);
  const trackingInitialized = useRef(false);
  const trackingSettingsInitialized = useRef(false);
  const labsInitialized = useRef(false);
  const [trackingLog, setTrackingLog] = useState<DailyLog>({
    id: `log-${Date.now()}`,
    date: new Date().toISOString().split('T')[0],
    sleepQuality: 3,
    energyLevel: 3,
    mood: 3,
    focus: 3,
    recovery: 3,
    supplementsTaken: [],
    notes: '',
    updatedAt: Date.now()
  });
  const metabolicMetrics = useMemo(() => calculateMetabolicMetrics(userProfile), [userProfile]);
  const trackingSummary = useMemo(() => {
    if (trackingData.logs.length === 0) {
      return { averageScore: null, mostUsed: null, latestDate: null };
    }

    const averageScore =
      trackingData.logs.reduce((sum, log) =>
        sum + (log.sleepQuality + log.energyLevel + log.mood + log.focus + log.recovery) / 5, 0
      ) / trackingData.logs.length;

    const supplementCounts = new Map<string, number>();
    for (const log of trackingData.logs) {
      for (const supplement of log.supplementsTaken) {
        supplementCounts.set(supplement, (supplementCounts.get(supplement) || 0) + 1);
      }
    }
    const mostUsed = Array.from(supplementCounts.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] || null;

    return {
      averageScore,
      mostUsed,
      latestDate: trackingData.logs[0]?.date || null
    };
  }, [trackingData.logs]);
  const chartData = useMemo(() => buildTrackingChartData(trackingData.logs), [trackingData.logs]);
  const t = useCallback((key: Parameters<typeof getTranslation>[1]) => getTranslation(language, key), [language]);

  useEffect(() => {
    try {
      localStorage.setItem('nutricompass_language', language);
    } catch {
      // ignore persistence errors
    }
  }, [language]);

  useEffect(() => {
    try {
      localStorage.setItem('nutricompass_theme', theme);
    } catch {
      // ignore persistence errors
    }
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  useEffect(() => {
    try {
      saveIntimacyPreferences(intimacyPreferences);
    } catch {
      // ignore persistence errors
    }
  }, [intimacyPreferences]);

  useEffect(() => {
    try {
      saveIntimacyConsentCheckIns(intimacyConsentCheckIns);
    } catch {
      // ignore persistence errors
    }
  }, [intimacyConsentCheckIns]);

  const activeRecommendation = useMemo(() => {
    if (!activeSupplement) return undefined;
    return recommendations.find(rec => rec.supplement.id === activeSupplement.id);
  }, [activeSupplement, recommendations]);

  const normalizeLabUnit = (unit: string) => unit.trim().toLowerCase().replace(/\s+/g, '');

  const labInsights = useMemo(() => {
    return labResults.flatMap(result => {
      const name = result.name.toLowerCase();
      const normalizedUnit = normalizeLabUnit(result.unit);
      const insights: { id: string; title: string; message: string }[] = [];

      const normalizeVitaminD = () => {
        if (normalizedUnit === 'ng/ml') return result.value;
        if (normalizedUnit === 'nmol/l') return result.value / 2.5;
        return null;
      };

      const normalizeB12 = () => {
        if (normalizedUnit === 'pg/ml') return result.value;
        if (normalizedUnit === 'pmol/l') return result.value / 0.738;
        return null;
      };

      const normalizeFerritin = () => {
        if (normalizedUnit === 'ng/ml') return result.value;
        if (normalizedUnit === 'ug/l' || normalizedUnit === 'µg/l') return result.value;
        return null;
      };

      const normalizeMagnesium = () => {
        if (normalizedUnit === 'mg/dl') return result.value;
        if (normalizedUnit === 'mmol/l') return result.value * 2.43;
        return null;
      };

      if (name.includes('vitamin d') || name.includes('25-hydroxy')) {
        const value = normalizeVitaminD();
        if (value !== null && value < 30) {
          insights.push({
            id: result.id,
            title: 'Low Vitamin D',
            message: 'Consider vitamin D3 + K2 support and recheck in 8-12 weeks.'
          });
        }
      }
      if (name.includes('b12') || name.includes('cobalamin')) {
        const value = normalizeB12();
        if (value !== null && value < 300) {
          insights.push({
            id: result.id,
            title: 'Low B12',
            message: 'Consider methylcobalamin support, especially if plant-based.'
          });
        }
      }
      if (name.includes('ferritin')) {
        const value = normalizeFerritin();
        if (value !== null && value < 30) {
          insights.push({
            id: result.id,
            title: 'Low Ferritin',
            message: 'Discuss iron status with a clinician before supplementing.'
          });
        }
      }
      if (name.includes('magnesium')) {
        const value = normalizeMagnesium();
        if (value !== null && value < 1.7) {
          insights.push({
            id: result.id,
            title: 'Low Magnesium',
            message: 'Consider magnesium glycinate or malate for repletion.'
          });
        }
      }

      return insights;
    });
  }, [labResults]);

  // Persist user profile
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.profile, JSON.stringify(userProfile));
    } catch { /* ignore */ }
    if (!profileInitialized.current) {
      profileInitialized.current = true;
      return;
    }
    setSyncMeta(prev => ({ ...prev, profileUpdatedAt: Date.now() }));
  }, [userProfile]);

  // Persist selected supplements
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.selectedSupplements, JSON.stringify(selectedSupplements.map(s => s.id)));
    } catch { /* ignore */ }
    if (!selectedInitialized.current) {
      selectedInitialized.current = true;
      return;
    }
    setSyncMeta(prev => ({ ...prev, stackUpdatedAt: Date.now() }));
  }, [selectedSupplements]);

  // Persist last query
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.lastQuery, query);
    } catch { /* ignore */ }
  }, [query]);

  // Persist tracking data
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.tracking, JSON.stringify(trackingData));
    } catch { /* ignore */ }
    if (!trackingInitialized.current) {
      trackingInitialized.current = true;
      return;
    }
  }, [trackingData]);

  useEffect(() => {
    if (!trackingSettingsInitialized.current) {
      trackingSettingsInitialized.current = true;
      return;
    }
    setSyncMeta(prev => ({ ...prev, trackingUpdatedAt: Date.now() }));
  }, [trackingData.startDate, trackingData.supplements]);

  // Persist lab results
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.labs, JSON.stringify(labResults));
    } catch { /* ignore */ }
    if (!labsInitialized.current) {
      labsInitialized.current = true;
      return;
    }
    setSyncMeta(prev => ({ ...prev, labsUpdatedAt: Date.now() }));
  }, [labResults]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.cloudSyncEnabled, String(syncEnabled));
    } catch { /* ignore */ }
  }, [syncEnabled]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.cloudSyncMeta, JSON.stringify(syncMeta));
    } catch { /* ignore */ }
  }, [syncMeta]);

  useEffect(() => {
    if (!user) {
      setCloudReady(false);
    }
  }, [user]);

  useEffect(() => {
    if (user && authModalOpen) {
      setAuthModalOpen(false);
    }
  }, [user, authModalOpen]);

  useEffect(() => {
    if (!firebaseConfigured && syncEnabled) {
      setSyncEnabled(false);
    }
  }, [firebaseConfigured, syncEnabled]);

  const hasLocalData = useMemo(() => {
    return (
      Object.keys(userProfile).length > 0 ||
      selectedSupplements.length > 0 ||
      trackingData.logs.length > 0 ||
      labResults.length > 0
    );
  }, [userProfile, selectedSupplements, trackingData.logs, labResults]);

  const applyCloudSnapshot = useCallback((snapshot: CloudSnapshot): void => {
    const mergeResult = mergeCloudIntoLocal(
      {
        profile: userProfile,
        tracking: trackingData,
        selectedSupplementIds: selectedSupplements.map(s => s.id),
        labs: labResults,
        meta: syncMeta
      },
      snapshot
    );

    setUserProfile(mergeResult.profile);
    setTrackingData(mergeResult.tracking);
    setLabResults(mergeResult.labs);
    setSelectedSupplements(
      mergeResult.selectedSupplementIds
        .map(id => supplements.find(s => s.id === id))
        .filter((supplement): supplement is Supplement => Boolean(supplement))
    );
    setSyncMeta(mergeResult.meta);
    setCloudReady(true);
  }, [labResults, selectedSupplements, syncMeta, trackingData, userProfile]);

  useEffect(() => {
    const runInitialSync = async () => {
      if (!syncEnabled || !firebaseConfigured || !user || !db || cloudReady) return;
      if (pendingCloudSync) return;
      setPendingCloudSync(true);
      try {
        const snapshot = await fetchCloudSnapshot(db, user.uid);
        const initKey = `nutricompass_cloud_init_${user.uid}`;
        const initialized = localStorage.getItem(initKey) === 'true';

        if (!initialized && hasLocalData) {
          pendingSnapshot.current = snapshot;
          setShowUploadPrompt(true);
          return;
        }

        applyCloudSnapshot(snapshot);
        localStorage.setItem(initKey, 'true');
      } finally {
        setPendingCloudSync(false);
      }
    };

    void runInitialSync();
  }, [
    syncEnabled,
    firebaseConfigured,
    user,
    cloudReady,
    hasLocalData,
    userProfile,
    trackingData,
    selectedSupplements,
    labResults,
    syncMeta,
    pendingCloudSync,
    applyCloudSnapshot
  ]);

  useEffect(() => {
    if (!syncEnabled || !firebaseConfigured || !user || !db || !cloudReady) return;
    const activeDb = db;
    const timeout = window.setTimeout(() => {
      void uploadLocalSnapshot(activeDb, user.uid, {
        profile: userProfile,
        tracking: trackingData,
        selectedSupplementIds: selectedSupplements.map(s => s.id),
        labs: labResults
      });
    }, 600);
    return () => window.clearTimeout(timeout);
  }, [
    syncEnabled,
    firebaseConfigured,
    user,
    cloudReady,
    userProfile,
    trackingData,
    selectedSupplements,
    labResults
  ]);

  const goalAnalysis = useGoalAnalysis(query, supplements, userProfile, trackingData);
  const reproductiveSafetyComplete =
    (userProfile.pregnancyStatus ?? 'unknown') !== 'unknown' &&
    (userProfile.breastfeedingStatus ?? 'unknown') !== 'unknown' &&
    (userProfile.tryingToConceiveStatus ?? 'unknown') !== 'unknown';
  const normalizedQuery = query.toLowerCase();
  const queryReproductiveScope = isReproductiveScopeQuery(normalizedQuery);
  const analysisReproductiveScope = goalAnalysis.recommendations.some((rec) => hasReproductiveRiskSignal(rec.supplement));
  const selectedReproductiveScope = selectedSupplements.some(hasReproductiveRiskSignal);
  const shouldRequireReproductiveSafety = queryReproductiveScope || analysisReproductiveScope || selectedReproductiveScope;
  const reproductiveSafetyBlocked = shouldRequireReproductiveSafety && !reproductiveSafetyComplete;
  const medicationStatus = userProfile.medicationStatus ?? ((userProfile.medications?.length || 0) > 0 ? 'taking' : 'unknown');
  const medicationListRequired = medicationStatus === 'taking';
  const medicationListProvided = !medicationListRequired || (userProfile.medications?.length || 0) > 0;
  const medicationSafetyIncomplete = medicationStatus === 'unknown' || !medicationListProvided;
  const educationOnlyMode = medicationSafetyIncomplete;
  const safetyIntakeMessage = reproductiveSafetyBlocked
    ? 'This goal includes reproductive-risk considerations. Complete pregnancy, breastfeeding, and trying-to-conceive status first.'
    : null;
  const medicationSafetyMessage = medicationStatus === 'unknown'
    ? 'Medication status is unknown. Results are educational only until medication screening is completed.'
    : medicationListRequired && !medicationListProvided
      ? 'You marked that you take medications but the list is empty. Results are educational only until medications are listed.'
      : null;
  const matchStrength = getMatchStrengthLabel(matchType, matchConfidence);

  // Analyze the user's goal
  const handleAnalyze = () => {
    if (!query.trim()) return;
    if (reproductiveSafetyBlocked) {
      setShowProfile(true);
      return;
    }
    const result = goalAnalysis;
    // Convert to Recommendation type
    const recs: Recommendation[] = result.recommendations.map(r => ({
      supplement: r.supplement,
      relevanceScore: r.relevanceScore,
      reason: r.reason,
      priority: r.priority,
      safetyFlags: r.safetyFlags,
      cautionLevel: r.cautionLevel
    }));
    setRecommendations(recs);
    setIdentifiedGoals(result.identifiedGoals);
    setIdentifiedSystems(result.identifiedSystems);
    setTips(result.tips || []);
    setMatchType(result.matchType ?? (result.identifiedGoals.length || result.identifiedSystems.length ? 'keyword' : 'none'));
    setMatchConfidence(result.confidence ?? 0);
    setDirectSupplementIds(result.directSupplements ?? []);
    setRelatedSupplementIds(result.relatedSupplements ?? []);
    setAnalyzedQuery(query);
    setHasAnalyzed(true);
    setSelectedSupplements([]);
  };

  // Toggle supplement selection for stacking
  const toggleSupplementSelection = (supplement: Supplement) => {
    if (educationOnlyMode) return;
    const alreadySelected = selectedSupplements.some(s => s.id === supplement.id);
    if (alreadySelected) {
      setSelectedSupplements(prev => prev.filter(s => s.id !== supplement.id));
      return;
    }
    const requiresReproductiveSafety =
      !reproductiveSafetyComplete &&
      (hasReproductiveRiskSignal(supplement) || selectedSupplements.some(hasReproductiveRiskSignal));
    if (requiresReproductiveSafety) {
      setShowProfile(true);
      return;
    }
    setSelectedSupplements(prev => [...prev, supplement]);
  };

  const handleAddStack = (stack: CuratedStack) => {
    if (educationOnlyMode) return;
    const stackSupplements = stack.supplementIds
      .map(id => supplements.find(supplement => supplement.id === id))
      .filter((supplement): supplement is Supplement => Boolean(supplement));
    setSelectedSupplements(stackSupplements);
  };

  const handleAddPremadeStack = (stack: SupplementStack) => {
    if (educationOnlyMode) return;
    const stackSupplements = stack.ingredients
      .map(ingredient => supplements.find(supplement => supplement.id === ingredient.supplementId))
      .filter((supplement): supplement is Supplement => Boolean(supplement));
    setSelectedSupplements(stackSupplements);
  };

  // Get interaction warnings
  const interactionWarnings = useMemo(() => {
    return checkInteractions(selectedSupplements, userProfile);
  }, [selectedSupplements, userProfile]);

  useEffect(() => {
    if (!educationOnlyMode) return;
    if (selectedSupplements.length === 0) return;
    setSelectedSupplements([]);
  }, [educationOnlyMode, selectedSupplements.length]);

  const directSupplements = useMemo(() => {
    return directSupplementIds
      .map(id => supplements.find(s => s.id === id))
      .filter((supplement): supplement is Supplement => Boolean(supplement));
  }, [directSupplementIds]);

  const relatedSupplements = useMemo(() => {
    return relatedSupplementIds
      .map(id => supplements.find(s => s.id === id))
      .filter((supplement): supplement is Supplement => Boolean(supplement));
  }, [relatedSupplementIds]);

  // Get timing suggestions
  const timingSuggestions = useMemo(() => {
    return generateTimingSchedule(selectedSupplements);
  }, [selectedSupplements]);


  // Reset to start
  const handleReset = () => {
    setQuery('');
    setAnalyzedQuery('');
    setHasAnalyzed(false);
    setRecommendations([]);
    setIdentifiedGoals([]);
    setIdentifiedSystems([]);
    setMatchType('none');
    setMatchConfidence(0);
    setDirectSupplementIds([]);
    setRelatedSupplementIds([]);
    setSelectedSupplements([]);
    setActiveTab('find');
    setFindMode('recommend');
    setTips([]);
  };

  const handleToggleCloudSync = () => {
    if (!firebaseConfigured) return;
    const next = !syncEnabled;
    setSyncEnabled(next);
    if (next && !user) {
      setAuthModalOpen(true);
    }
  };

  const handleAuthSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!authEmail || !authPassword) return;
    if (authMode === 'login') {
      void signInWithEmail(authEmail, authPassword);
    } else {
      void registerWithEmail(authEmail, authPassword);
    }
  };

  const handleUploadPromptYes = async () => {
    if (!user || !db) return;
    await uploadLocalSnapshot(db, user.uid, {
      profile: userProfile,
      tracking: trackingData,
      selectedSupplementIds: selectedSupplements.map(s => s.id),
      labs: labResults
    });
    localStorage.setItem(`nutricompass_cloud_init_${user.uid}`, 'true');
    setShowUploadPrompt(false);
    pendingSnapshot.current = null;
    setCloudReady(true);
  };

  const handleUploadPromptNo = () => {
    if (pendingSnapshot.current) {
      applyCloudSnapshot(pendingSnapshot.current);
    }
    if (user) {
      localStorage.setItem(`nutricompass_cloud_init_${user.uid}`, 'true');
    }
    setShowUploadPrompt(false);
    pendingSnapshot.current = null;
  };

  const handleTrackingSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setTrackingData(prev => {
      const existingIndex = prev.logs.findIndex(log => log.date === trackingLog.date);
      const existingLog = existingIndex >= 0 ? prev.logs[existingIndex] : null;
      const updatedLog: DailyLog = {
        ...trackingLog,
        id: existingLog?.id ?? trackingLog.id ?? `log-${trackingLog.date}-${Date.now()}`,
        updatedAt: Date.now()
      };
      const updatedLogs = [...prev.logs];
      if (existingIndex >= 0) {
        updatedLogs[existingIndex] = updatedLog;
      } else {
        updatedLogs.unshift(updatedLog);
      }

      const mergedSupplements = Array.from(new Set([
        ...prev.supplements,
        ...trackingLog.supplementsTaken
      ]));

      return {
        ...prev,
        logs: updatedLogs.slice(0, 90),
        supplements: mergedSupplements
      };
    });
    setTrackingLog(prev => ({
      ...prev,
      notes: '',
      supplementsTaken: [],
      id: `log-${Date.now()}`,
      updatedAt: Date.now()
    }));
  };

  const handleTrackingExport = (): void => {
    if (trackingData.logs.length === 0) return;
    const csv = buildTrackingCsv(trackingData.logs);
    if (!csv) return;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'nutricompass-tracking.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleLabSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!labDraft.name.trim() || !labDraft.unit.trim() || !Number.isFinite(labDraft.value) || labDraft.value <= 0) return;
    const newResult: LabResult = {
      ...labDraft,
      id: `lab-${Date.now()}`
    };
    setLabResults(prev => [newResult, ...prev].slice(0, 50));
    setLabDraft({
      id: '',
      name: '',
      value: 0,
      unit: '',
      range: '',
      note: '',
      date: new Date().toISOString().split('T')[0]
    });
  };

  const handleAddIntimacyConsentCheckIn = (entry: ConsentCheckIn): void => {
    setIntimacyConsentCheckIns(prev => [entry, ...prev].slice(0, 200));
  };

  const handleDeleteIntimacyData = (): void => {
    clearIntimacyLocalData();
    setIntimacyPreferences(DEFAULT_USER_PREFERENCES);
    setIntimacyConsentCheckIns([]);
  };

  const parseListInput = (value: string): string[] => value
    .split(',')
    .map(item => item.trim())
    .filter(Boolean);

  const buildStackSummary = () => {
    if (selectedSupplements.length === 0) return 'No supplements selected.';
    const names = selectedSupplements.map(s => s.name).join(', ');
    return `My NutriCompass stack: ${names}.`;
  };

  const buildScheduleSummary = () => {
    const formatNames = (items: Supplement[]) => items.map(s => s.name.split(' ')[0]).join(', ') || '—';
    return [
      `Morning: ${formatNames(timingSuggestions.morning)}`,
      `Afternoon: ${formatNames(timingSuggestions.midday)}`,
      `Evening: ${formatNames([...timingSuggestions.evening, ...timingSuggestions.bedtime])}`
    ].join('\n');
  };

  const handleCopyText = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // ignore clipboard failures in restricted environments
    }
  };

  const stackBuilderSection = selectedSupplements.length > 0 && (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h3 className="font-bold text-gray-900 flex items-center gap-2">
          <span>📦</span> Your Stack ({selectedSupplements.length} selected)
        </h3>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => handleCopyText(buildStackSummary())}
            className="px-3 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition"
          >
            Copy Stack
          </button>
          <button
            type="button"
            onClick={() => handleCopyText(buildScheduleSummary())}
            className="px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 transition"
          >
            Copy Schedule
          </button>
        </div>
      </div>

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
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 dark:from-slate-900 dark:via-slate-950 dark:to-emerald-900 dark:text-slate-100">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-lg border-b border-gray-100 shadow-sm dark:bg-slate-900/90 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <button onClick={handleReset} className="flex items-center gap-2 hover:opacity-80 transition">
              <span className="text-2xl">🌿</span>
              <div>
                <h1 className="text-lg font-bold text-gray-900 dark:text-slate-100">{t('appTitle')}</h1>
                <p className="text-xs text-gray-500 hidden sm:block dark:text-slate-400">{t('appSubtitle')}</p>
              </div>
            </button>
            <div className="flex items-center gap-2">
              <div className="flex rounded-xl border border-gray-200 bg-white p-1 dark:border-slate-700 dark:bg-slate-800/90">
                <button
                  onClick={() => { setActiveTab('find'); setHasAnalyzed(false); }}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${activeTab === 'find' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-400/25 dark:text-emerald-100' : 'text-gray-600 hover:text-gray-900 dark:text-slate-300 dark:hover:text-white'}`}
                >
                  {t('tabFind')}
                </button>
                <button
                  onClick={() => { setActiveTab('stacks'); setHasAnalyzed(false); }}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${activeTab === 'stacks' ? 'bg-blue-100 text-blue-700 dark:bg-blue-400/25 dark:text-blue-100' : 'text-gray-600 hover:text-gray-900 dark:text-slate-300 dark:hover:text-white'}`}
                >
                  {t('tabStacks')}
                </button>
                <button
                  onClick={() => { setActiveTab('learn'); setHasAnalyzed(false); }}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${activeTab === 'learn' ? 'bg-purple-100 text-purple-700 dark:bg-purple-400/25 dark:text-purple-100' : 'text-gray-600 hover:text-gray-900 dark:text-slate-300 dark:hover:text-white'}`}
                >
                  {t('tabLearn')}
                </button>
                <button
                  onClick={() => { setActiveTab('about'); setHasAnalyzed(false); }}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${activeTab === 'about' ? 'bg-amber-100 text-amber-700 dark:bg-amber-400/25 dark:text-amber-100' : 'text-gray-600 hover:text-gray-900 dark:text-slate-300 dark:hover:text-white'}`}
                >
                  {t('tabAbout')}
                </button>
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-2 py-1 text-xs text-gray-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                <span className="hidden sm:inline">{t('languageLabel')}</span>
                <select
                  value={language}
                  onChange={(event) => setLanguage(event.target.value as Language)}
                  className="bg-transparent text-xs font-semibold text-gray-700 focus:outline-none dark:text-slate-100"
                  aria-label={t('languageLabel')}
                >
                  <option value="en">EN</option>
                  <option value="el">EL</option>
                </select>
              </div>
              <button
                type="button"
                onClick={() => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'))}
                className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 hover:border-gray-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              >
                {theme === 'dark' ? t('themeDark') : t('themeLight')}
              </button>
              <button
                onClick={() => setShowProfile(!showProfile)}
                className={`p-2 rounded-lg transition ${showProfile ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'}`}
                aria-label="Toggle profile details"
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
        {firebaseConfigured && (
          <div className="mb-6 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="font-bold text-gray-900">Cloud Sync</h3>
                <p className="text-sm text-gray-600">Optional cross-device sync with Firebase. Local mode stays fully offline.</p>
                <p className="text-xs text-gray-500 mt-1">
                  Status: {syncEnabled ? (user ? 'Connected' : 'Sign in required') : 'Local only'}
                </p>
              </div>
              <button
                type="button"
                onClick={handleToggleCloudSync}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${syncEnabled ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                Sync to cloud: {syncEnabled ? 'On' : 'Off'}
              </button>
            </div>
            {syncEnabled && (
              <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-3">
                {user ? (
                  <>
                    <p className="text-xs text-gray-500">Signed in as <span className="font-medium text-gray-700">{user.email || 'Firebase user'}</span></p>
                    <button
                      type="button"
                      onClick={() => void signOutUser()}
                      className="text-xs text-gray-500 hover:text-gray-700"
                    >
                      Sign out
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => setAuthModalOpen(true)}
                    className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Sign in to enable sync
                  </button>
                )}
                {authStatus === 'loading' && (
                  <span className="text-xs text-gray-400">Checking sign-in status…</span>
                )}
                {authError && (
                  <span className="text-xs text-red-600">{authError}</span>
                )}
              </div>
            )}
          </div>
        )}

        {/* Profile Panel */}
        {showProfile && (
          <div className="mb-6 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span>👤</span> Safety Intake & Profile
            </h3>
            <p className="mb-4 text-xs text-gray-600">
              Complete reproductive safety fields when your query or selected supplements involve pregnancy, breastfeeding, or trying to conceive.
            </p>
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
                <label className="block text-xs font-medium text-gray-600 mb-1">Weight (kg)</label>
                <input
                  type="number"
                  min="30"
                  max="200"
                  value={userProfile.weightKg ?? ''}
                  onChange={(e) => setUserProfile(p => ({ ...p, weightKg: e.target.value ? Number(e.target.value) : undefined }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="e.g., 70"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Height (cm)</label>
                <input
                  type="number"
                  min="120"
                  max="220"
                  value={userProfile.heightCm ?? ''}
                  onChange={(e) => setUserProfile(p => ({ ...p, heightCm: e.target.value ? Number(e.target.value) : undefined }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="e.g., 175"
                />
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
                <label className="block text-xs font-medium text-gray-600 mb-1">Activity Level</label>
                <select
                  value={userProfile.activityLevel || ''}
                  onChange={(e) => setUserProfile(p => ({ ...p, activityLevel: e.target.value as UserProfile['activityLevel'] }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="">Select...</option>
                  <option value="sedentary">Sedentary</option>
                  <option value="light">Lightly active</option>
                  <option value="moderate">Moderately active</option>
                  <option value="active">Very active</option>
                  <option value="athlete">Athlete</option>
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
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Pregnancy Status</label>
                <select
                  value={userProfile.pregnancyStatus || 'unknown'}
                  onChange={(e) => setUserProfile(p => ({ ...p, pregnancyStatus: e.target.value as UserProfile['pregnancyStatus'] }))}
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                    (userProfile.pregnancyStatus ?? 'unknown') === 'unknown' ? 'border-rose-300' : 'border-gray-200'
                  }`}
                >
                  <option value="unknown">Select...</option>
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                  <option value="not-applicable">Not applicable</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Breastfeeding Status</label>
                <select
                  value={userProfile.breastfeedingStatus || 'unknown'}
                  onChange={(e) => setUserProfile(p => ({ ...p, breastfeedingStatus: e.target.value as UserProfile['breastfeedingStatus'] }))}
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                    (userProfile.breastfeedingStatus ?? 'unknown') === 'unknown' ? 'border-rose-300' : 'border-gray-200'
                  }`}
                >
                  <option value="unknown">Select...</option>
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                  <option value="not-applicable">Not applicable</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Trying to Conceive</label>
                <select
                  value={userProfile.tryingToConceiveStatus || 'unknown'}
                  onChange={(e) => setUserProfile(p => ({ ...p, tryingToConceiveStatus: e.target.value as UserProfile['tryingToConceiveStatus'] }))}
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                    (userProfile.tryingToConceiveStatus ?? 'unknown') === 'unknown' ? 'border-rose-300' : 'border-gray-200'
                  }`}
                >
                  <option value="unknown">Select...</option>
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                  <option value="not-applicable">Not applicable</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Caffeine Intake</label>
                <select
                  value={userProfile.caffeineIntake || ''}
                  onChange={(e) => setUserProfile(p => ({ ...p, caffeineIntake: e.target.value as UserProfile['caffeineIntake'] }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="">Select...</option>
                  <option value="none">None</option>
                  <option value="low">Low</option>
                  <option value="moderate">Moderate</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Budget</label>
                <select
                  value={userProfile.budgetLevel || ''}
                  onChange={(e) => setUserProfile(p => ({ ...p, budgetLevel: e.target.value as UserProfile['budgetLevel'] }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="">Select...</option>
                  <option value="budget">Budget</option>
                  <option value="moderate">Moderate</option>
                  <option value="premium">Premium</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Form Preference</label>
                <select
                  value={userProfile.formPreference || ''}
                  onChange={(e) => setUserProfile(p => ({ ...p, formPreference: e.target.value as UserProfile['formPreference'] }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="">Select...</option>
                  <option value="capsules">Capsules</option>
                  <option value="tablets">Tablets</option>
                  <option value="powders">Powders</option>
                  <option value="liquids">Liquids</option>
                  <option value="gummies">Gummies</option>
                  <option value="any">Any</option>
                </select>
              </div>
              <div className="col-span-2 sm:col-span-3">
                <label className="block text-xs font-medium text-gray-600 mb-1">Current Supplements (comma separated)</label>
                <input
                  type="text"
                  value={(userProfile.currentSupplements || []).join(', ')}
                  onChange={(e) => setUserProfile(p => ({ ...p, currentSupplements: parseListInput(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="e.g., magnesium, omega-3"
                />
              </div>
              <div className="col-span-2 sm:col-span-3">
                <label className="block text-xs font-medium text-gray-600 mb-1">Health Conditions (comma separated)</label>
                <input
                  type="text"
                  value={(userProfile.healthConditions || []).join(', ')}
                  onChange={(e) => setUserProfile(p => ({ ...p, healthConditions: parseListInput(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="e.g., hypertension, thyroid issues"
                />
              </div>
              <div className="col-span-2 sm:col-span-3">
                <label className="block text-xs font-medium text-gray-600 mb-1">Medication Status</label>
                <select
                  value={medicationStatus}
                  onChange={(e) => {
                    const nextStatus = e.target.value as UserProfile['medicationStatus'];
                    setUserProfile((previous) => ({
                      ...previous,
                      medicationStatus: nextStatus,
                      medications: nextStatus === 'taking' ? previous.medications : []
                    }));
                  }}
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                    medicationStatus === 'unknown' ? 'border-amber-300' : 'border-gray-200'
                  }`}
                >
                  <option value="unknown">Select...</option>
                  <option value="none">No current medications</option>
                  <option value="taking">I currently take medications</option>
                </select>
              </div>
              <div className="col-span-2 sm:col-span-3">
                <label className="block text-xs font-medium text-gray-600 mb-1">Medications (comma separated)</label>
                <input
                  type="text"
                  value={(userProfile.medications || []).join(', ')}
                  onChange={(e) => setUserProfile(p => ({ ...p, medications: parseListInput(e.target.value) }))}
                  disabled={medicationStatus !== 'taking'}
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-100 disabled:text-gray-500 ${
                    medicationStatus === 'taking' && (userProfile.medications || []).length === 0
                      ? 'border-amber-300'
                      : 'border-gray-200'
                  }`}
                  placeholder={medicationStatus === 'taking' ? 'e.g., sertraline, metformin' : 'Set medication status to "I currently take medications"'}
                />
              </div>
            </div>
            {(metabolicMetrics.bmi || metabolicMetrics.bmr || metabolicMetrics.tdee) && (
              <div className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50 p-4">
                <h4 className="text-sm font-semibold text-emerald-800 mb-2">Metabolic Metrics</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-emerald-700">
                  <div>
                    <p className="text-xs uppercase text-emerald-500">BMI</p>
                    <p className="font-semibold">{metabolicMetrics.bmi ?? '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase text-emerald-500">BMR</p>
                    <p className="font-semibold">{metabolicMetrics.bmr ? `${metabolicMetrics.bmr} kcal` : '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase text-emerald-500">TDEE</p>
                    <p className="font-semibold">{metabolicMetrics.tdee ? `${metabolicMetrics.tdee} kcal` : '—'}</p>
                  </div>
                </div>
                <p className="text-xs text-emerald-600 mt-2">Add height and activity level for full metabolic estimates.</p>
              </div>
            )}
            <p className="text-xs text-gray-500 mt-3">This information is saved locally on your device and powers safety screening plus personalization.</p>
          </div>
        )}

        {safetyIntakeMessage && (
          <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-rose-800">Safety intake required</p>
                <p className="text-xs text-rose-700 mt-1">{safetyIntakeMessage}</p>
              </div>
              <button
                type="button"
                onClick={() => setShowProfile(true)}
                className="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-700"
              >
                Complete Now
              </button>
            </div>
          </div>
        )}

        {medicationSafetyMessage && (
          <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-4">
            <p className="text-sm font-semibold text-amber-800">Safety incomplete</p>
            <p className="text-xs text-amber-700 mt-1">{medicationSafetyMessage}</p>
          </div>
        )}

        {/* Primary tab layout with progressive disclosure */}
        {activeTab === 'find' ? (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100">Find Supplements</h2>
                <p className="text-sm text-gray-500 dark:text-slate-300">Switch between guided recommendations and full catalog browse.</p>
              </div>
              <div className="flex rounded-xl border border-gray-200 bg-white p-1 dark:border-slate-700 dark:bg-slate-800/90">
                <button
                  type="button"
                  onClick={() => setFindMode('recommend')}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
                    findMode === 'recommend' ? 'bg-emerald-500 text-white' : 'text-gray-600 hover:text-gray-900 dark:text-slate-300 dark:hover:text-white'
                  }`}
                >
                  Recommendations
                </button>
                <button
                  type="button"
                  onClick={() => setFindMode('browse')}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
                    findMode === 'browse' ? 'bg-emerald-500 text-white' : 'text-gray-600 hover:text-gray-900 dark:text-slate-300 dark:hover:text-white'
                  }`}
                >
                  Browse Catalog
                </button>
              </div>
            </div>

            {findMode === 'browse' && (
              <div className="space-y-6">
                {educationOnlyMode && (
                  <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                    Catalog browsing is available, but stack selection is disabled until medication safety intake is complete.
                  </div>
                )}
                <AdvancedBrowse
                  userProfile={userProfile}
                  onSelectSupplement={toggleSupplementSelection}
                  selectedSupplements={selectedSupplements}
                />
                {stackBuilderSection}
              </div>
            )}

            {findMode === 'recommend' && !hasAnalyzed && (
              /* Main Input View */
              <div className="space-y-8">
                {/* Hero */}
                <div className="text-center py-8">
                  <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-slate-100 mb-4">
                    What would you like to improve?
                  </h2>
                  <p className="text-gray-600 dark:text-slate-300 max-w-2xl mx-auto">
                    Describe your health goal in plain language. We&apos;ll recommend evidence-based supplements 
                    including vitamins, minerals, herbs, and Ayurvedic remedies.
                  </p>
                </div>

                {/* Input */}
                <div className="max-w-3xl mx-auto space-y-3">
                  <div className="relative">
                    <svg className="absolute left-5 top-5 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <textarea
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleAnalyze(); }}}
                      placeholder="Describe your goal, symptoms, or health priority..."
                      className="w-full pl-12 pr-4 sm:pr-44 py-4 bg-white border-2 border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-none h-28"
                    />
                    {query && (
                      <button
                        type="button"
                        onClick={() => setQuery('')}
                        className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 sm:right-36 sm:top-5"
                        aria-label="Clear search"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                    <button
                      onClick={handleAnalyze}
                      disabled={!query.trim() || reproductiveSafetyBlocked}
                      className="mt-3 w-full px-5 py-2.5 bg-emerald-500 text-white font-semibold rounded-xl hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-emerald-200 sm:absolute sm:bottom-4 sm:right-4 sm:mt-0 sm:w-auto"
                    >
                      Get Recommendations
                    </button>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-gray-500">
                    <span>Press Enter to search. Use Shift + Enter for a new line.</span>
                    {query && (
                      <button
                        type="button"
                        onClick={handleReset}
                        className="text-emerald-600 hover:text-emerald-700"
                      >
                        Reset
                      </button>
                    )}
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
            )}

            {findMode === 'recommend' && hasAnalyzed && (
              /* Results View */
              <div className="space-y-6">
                {/* Refine Search */}
                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                  <h3 className="text-lg font-bold text-gray-900">Refine your goal</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Adjust your search to update recommendations without starting over.
                  </p>
                  <div className="mt-4 flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAnalyze(); }}}
                        placeholder="Update your goal..."
                        className="w-full pl-12 pr-10 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                      />
                      {query && (
                        <button
                          type="button"
                          onClick={() => setQuery('')}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          aria-label="Clear search"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={handleAnalyze}
                      disabled={!query.trim() || reproductiveSafetyBlocked}
                      className="px-5 py-3 bg-emerald-500 text-white font-semibold rounded-xl hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      Update Recommendations
                    </button>
                  </div>
                </div>

                {/* Query Summary */}
                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Your goal:</p>
                      <p className="text-lg font-medium text-gray-900">&ldquo;{analyzedQuery}&rdquo;</p>
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
                      {(matchType && matchType !== 'none') && (
                        <div className="flex flex-wrap gap-2 mt-3 text-xs text-gray-600">
                          <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full font-medium capitalize">
                            Matched via: {matchType.replace('-', ' ')}
                          </span>
                          <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full font-medium">
                            Match strength: {matchStrength}
                          </span>
                        </div>
                      )}
                      {directSupplements.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {directSupplements.map(supplement => (
                            <span key={supplement.id} className="px-2.5 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
                              {supplement.name}
                            </span>
                          ))}
                        </div>
                      )}
                      {relatedSupplements.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {relatedSupplements.slice(0, 4).map(supplement => (
                            <span key={supplement.id} className="px-2.5 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">
                              Related: {supplement.name.split(' ')[0]}
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

                {labInsights.length > 0 && (
                  <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-5 border border-emerald-100">
                    <h3 className="font-bold text-emerald-800 mb-3 flex items-center gap-2">
                      <span>🧪</span> Lab Insights
                    </h3>
                    <ul className="space-y-2">
                      {labInsights.map((insight) => (
                        <li key={insight.id} className="text-sm text-emerald-700 flex items-start gap-2">
                          <span className="text-emerald-400">•</span>
                          <span className="font-semibold">{insight.title}:</span>
                          <span>{insight.message}</span>
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
                  {educationOnlyMode && (
                    <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                      Educational mode is active. Complete medication safety intake to enable stack building and interaction-aware stack actions.
                    </div>
                  )}
                  <p className="mb-3 text-xs text-gray-500">
                    Educational guidance only. This app does not diagnose or replace care from a licensed clinician.
                  </p>
                  
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
                            isSelected={selectedSupplements.some(s => s.id === rec.supplement.id)}
                            onSelect={() => toggleSupplementSelection(rec.supplement)}
                            showSelection={!educationOnlyMode}
                            recommendation={rec}
                            onViewDetails={() => setActiveSupplement(rec.supplement)}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Stack Builder */}
                {stackBuilderSection}

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
                      <span className="text-red-500">●</span>
                      <div>
                        <p className="font-medium text-slate-700">8+ weeks</p>
                        <p className="text-slate-500">Bone density, heart health, metabolic optimization</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : activeTab === 'stacks' ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Pre-Made Stacks</h2>
                <p className="text-sm text-gray-500">Curated combinations for common health goals.</p>
              </div>
              {selectedSupplements.length > 0 && (
                <span className="text-sm text-emerald-600 font-medium">{selectedSupplements.length} selected</span>
              )}
            </div>
            {educationOnlyMode && (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                Stack builder is disabled until medication safety intake is complete.
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {curatedStacks.map(stack => (
                <div key={stack.id} className="rounded-2xl border border-gray-200 bg-white p-5 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{stack.icon ?? '✨'}</span>
                        <h3 className="text-lg font-semibold text-gray-900">{stack.name}</h3>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{stack.description}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleAddStack(stack)}
                      disabled={educationOnlyMode}
                      className="rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Add Stack
                    </button>
                  </div>
                  <p className="text-xs text-gray-500">{stack.synergyDescription}</p>
                  <div className="flex flex-wrap gap-2">
                    {stack.bestFor?.map(goal => (
                      <span key={goal} className="rounded-full bg-emerald-50 px-3 py-1 text-xs text-emerald-700">
                        {goal}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {premadeStacks.map(stack => {
                const isExpanded = expandedStack === stack.id;
                return (
                  <div key={stack.id} className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
                    <div className="p-5 space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{stack.name}</h3>
                          <p className="text-sm text-gray-600 mt-1">{stack.description}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setExpandedStack(isExpanded ? null : stack.id)}
                          className="rounded-full border border-gray-200 px-3 py-1 text-xs font-semibold text-emerald-600 hover:border-emerald-300 hover:text-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        >
                          {isExpanded ? 'Hide Details' : 'View Stack Details'}
                        </button>
                      </div>
                      <p className="text-xs text-gray-500">{stack.synergyDescription}</p>
                      <button
                        type="button"
                        onClick={() => handleAddPremadeStack(stack)}
                        disabled={educationOnlyMode}
                        className="rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Add Stack to Builder
                      </button>
                    </div>
                    {isExpanded && (
                      <div className="border-t border-slate-100 bg-slate-50 px-5 py-4">
                        <div className="overflow-x-auto">
                          <table className="min-w-full text-left text-xs text-slate-600">
                            <thead className="text-[11px] uppercase tracking-wide text-slate-500">
                              <tr>
                                <th className="py-2">Supplement</th>
                                <th className="py-2">Dosage</th>
                                <th className="py-2">Timing</th>
                                <th className="py-2">Reason</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                              {stack.ingredients.map(ingredient => {
                                const supplement = supplements.find(item => item.id === ingredient.supplementId);
                                return (
                                  <tr key={ingredient.supplementId}>
                                    <td className="py-2 font-semibold text-slate-700">{supplement?.name ?? ingredient.supplementId}</td>
                                    <td className="py-2">{ingredient.dosage}</td>
                                    <td className="py-2">{supplement?.timing ?? '—'}</td>
                                    <td className="py-2">{ingredient.reason}</td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : activeTab === 'about' ? (
          <ApplicationOverviewTab />
        ) : (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Learn & Track</h2>
                <p className="text-sm text-gray-500">Deep dives, comparisons, and progress tracking.</p>
              </div>
              <div className="flex rounded-xl border border-gray-200 bg-white p-1">
                <button
                  type="button"
                  onClick={() => setLearnMode('guide')}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
                    learnMode === 'guide' ? 'bg-purple-500 text-white' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Guide
                </button>
                <button
                  type="button"
                  onClick={() => setLearnMode('insights')}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
                    learnMode === 'insights' ? 'bg-purple-500 text-white' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Insights
                </button>
                <button
                  type="button"
                  onClick={() => setLearnMode('track')}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
                    learnMode === 'track' ? 'bg-purple-500 text-white' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Track
                </button>
                <button
                  type="button"
                  onClick={() => setLearnMode('intimacy')}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
                    learnMode === 'intimacy' ? 'bg-purple-500 text-white' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Intimacy
                </button>
              </div>
            </div>
            {learnMode !== 'intimacy' && (
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-purple-100 bg-purple-50 px-4 py-3 text-sm text-purple-800">
                <span>Looking for USDA FoodData Central or Open Food Facts? Use the Insights tab to access Food Lookup.</span>
                <button
                  type="button"
                  onClick={() => setLearnMode('insights')}
                  className="rounded-full border border-purple-200 bg-white px-3 py-1 text-xs font-semibold text-purple-700 hover:border-purple-300 hover:text-purple-800"
                >
                  Go to Insights
                </button>
              </div>
            )}

            {learnMode === 'guide' ? (
              <Suspense fallback={<div className="rounded-2xl border border-gray-200 bg-white p-6 text-sm text-gray-500">Loading guide...</div>}>
                <EducationalGuide />
              </Suspense>
            ) : learnMode === 'track' ? (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Daily Check-In</h2>
                  <p className="text-sm text-gray-500 mb-4">Track outcomes to refine recommendations over time.</p>
                  <form className="space-y-4" onSubmit={handleTrackingSubmit}>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Date</label>
                        <input
                          type="date"
                          value={trackingLog.date}
                          onChange={(e) => setTrackingLog(prev => ({ ...prev, date: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        />
                      </div>
                      {[
                        { key: 'sleepQuality', label: 'Sleep' },
                        { key: 'energyLevel', label: 'Energy' },
                        { key: 'mood', label: 'Mood' },
                        { key: 'focus', label: 'Focus' },
                        { key: 'recovery', label: 'Recovery' }
                      ].map((item) => (
                        <div key={item.key}>
                          <label className="block text-xs font-medium text-gray-600 mb-1">{item.label}</label>
                          <select
                            value={trackingLog[item.key as keyof DailyLog]}
                            onChange={(e) => setTrackingLog(prev => ({ ...prev, [item.key]: Number(e.target.value) as 1 | 2 | 3 | 4 | 5 }))}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          >
                            {[1, 2, 3, 4, 5].map(value => (
                              <option key={value} value={value}>{value}</option>
                            ))}
                          </select>
                        </div>
                      ))}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Supplements Taken (comma separated)</label>
                      <input
                        type="text"
                        value={trackingLog.supplementsTaken.join(', ')}
                        onChange={(e) => setTrackingLog(prev => ({ ...prev, supplementsTaken: parseListInput(e.target.value) }))}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="e.g., magnesium, omega-3"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Notes (optional)</label>
                      <textarea
                        value={trackingLog.notes || ''}
                        onChange={(e) => setTrackingLog(prev => ({ ...prev, notes: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        rows={3}
                        placeholder="How did you feel today?"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition"
                    >
                      Save Daily Log
                    </button>
                  </form>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Lab Results (Optional)</h2>
                  <p className="text-sm text-gray-500 mb-4">Add biomarkers to personalize recommendations and dosing guidance.</p>
                  <form className="space-y-4" onSubmit={handleLabSubmit}>
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-medium text-gray-600 mb-1">Marker</label>
                        <input
                          type="text"
                          value={labDraft.name}
                          onChange={(e) => setLabDraft(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          placeholder="e.g., Vitamin D (25-OH)"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Value</label>
                        <input
                          type="number"
                          value={Number.isFinite(labDraft.value) ? labDraft.value : ''}
                          onChange={(e) => setLabDraft(prev => ({
                            ...prev,
                            value: e.target.value === '' ? Number.NaN : Number(e.target.value)
                          }))}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          placeholder="30"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Unit</label>
                        <input
                          type="text"
                          value={labDraft.unit}
                          onChange={(e) => setLabDraft(prev => ({ ...prev, unit: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          placeholder="ng/mL or nmol/L"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Reference Range (optional)</label>
                        <input
                          type="text"
                          value={labDraft.range || ''}
                          onChange={(e) => setLabDraft(prev => ({ ...prev, range: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          placeholder="30-100"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Date</label>
                        <input
                          type="date"
                          value={labDraft.date || ''}
                          onChange={(e) => setLabDraft(prev => ({ ...prev, date: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Note (optional)</label>
                        <input
                          type="text"
                          value={labDraft.note || ''}
                          onChange={(e) => setLabDraft(prev => ({ ...prev, note: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          placeholder="Fasting"
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition"
                    >
                      Save Lab Result
                    </button>
                  </form>

                  {labResults.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {labResults.slice(0, 6).map((result) => (
                        <div key={result.id} className="flex items-center justify-between rounded-lg border border-gray-100 p-3 text-sm">
                          <div>
                            <p className="font-semibold text-gray-800">{result.name}</p>
                            <p className="text-xs text-gray-500">
                              {result.value} {result.unit}{result.range ? ` (ref: ${result.range})` : ''} {result.date ? `• ${result.date}` : ''}
                            </p>
                            {result.note && <p className="text-xs text-gray-400 mt-1">{result.note}</p>}
                          </div>
                          <button
                            type="button"
                            onClick={() => setLabResults(prev => prev.filter(item => item.id !== result.id))}
                            className="text-xs text-gray-400 hover:text-red-500 transition"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Progress Snapshot</h3>
                      <p className="text-sm text-gray-500">Visualize your average daily score.</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleTrackingExport}
                      disabled={trackingData.logs.length === 0}
                      className="rounded-full border border-emerald-200 bg-white px-4 py-2 text-xs font-semibold text-emerald-700 hover:border-emerald-300 hover:text-emerald-800 disabled:cursor-not-allowed disabled:border-gray-200 disabled:text-gray-400"
                    >
                      Export CSV
                    </button>
                  </div>
                  <TrackingChart data={chartData} />
                </div>

                <div className="bg-gradient-to-r from-amber-50 to-emerald-50 rounded-2xl p-5 border border-amber-100">
                  <h3 className="font-bold text-gray-900 mb-2">Tracking Summary</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm text-gray-600">
                    <div>
                      <p className="text-xs uppercase text-gray-400">Logs</p>
                      <p className="text-lg font-semibold text-gray-900">{trackingData.logs.length}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase text-gray-400">Latest</p>
                      <p className="text-lg font-semibold text-gray-900">{trackingSummary.latestDate || '—'}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase text-gray-400">Avg Score</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {trackingSummary.averageScore !== null
                          ? trackingSummary.averageScore.toFixed(1)
                          : '—'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs uppercase text-gray-400">Most Used</p>
                      <p className="text-sm text-gray-700">
                        {trackingSummary.mostUsed || '—'}
                      </p>
                    </div>
                  </div>
                </div>

                {trackingData.logs.length > 0 && (
                  <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                    <h3 className="font-bold text-gray-900 mb-3">Recent Logs</h3>
                    <div className="space-y-3">
                      {trackingData.logs.slice(0, 5).map((log) => (
                        <div key={log.id ?? log.date} className="border border-gray-100 rounded-xl p-3">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-semibold text-gray-800">{log.date}</p>
                            <span className="text-xs text-gray-500">
                              Score {(log.sleepQuality + log.energyLevel + log.mood + log.focus + log.recovery) / 5}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {log.supplementsTaken.length > 0 ? `Supplements: ${log.supplementsTaken.join(', ')}` : 'No supplements logged.'}
                          </p>
                          {log.notes && <p className="text-xs text-gray-500 mt-1">Notes: {log.notes}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : learnMode === 'intimacy' ? (
              <IntimacyWellnessSection
                preferences={intimacyPreferences}
                onPreferencesChange={setIntimacyPreferences}
                consentCheckIns={intimacyConsentCheckIns}
                onAddConsentCheckIn={handleAddIntimacyConsentCheckIn}
                onDeleteAllData={handleDeleteIntimacyData}
              />
            ) : (
              <div className="space-y-8">
                <FoodLookup
                  supplements={supplements}
                  onSelectSupplement={handleFoodLookupSupplement}
                />
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
            )}
          </div>
        )}
      </main>

      {authModalOpen && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                {authMode === 'login' ? 'Sign in to sync' : 'Create an account'}
              </h3>
              <button
                type="button"
                onClick={() => setAuthModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
                aria-label="Close auth modal"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleAuthSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
                <input
                  type="email"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="you@example.com"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Password</label>
                <input
                  type="password"
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="••••••••"
                  required
                />
              </div>
              {authError && (
                <p className="text-xs text-red-600">{authError}</p>
              )}
              <button
                type="submit"
                className="w-full px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition"
              >
                {authMode === 'login' ? 'Sign in' : 'Create account'}
              </button>
            </form>
            <div className="mt-4">
              <button
                type="button"
                onClick={() => void signInWithGoogle()}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Continue with Google
              </button>
            </div>
            <div className="mt-4 text-center text-xs text-gray-500">
              {authMode === 'login' ? (
                <button
                  type="button"
                  onClick={() => setAuthMode('register')}
                  className="text-emerald-600 hover:text-emerald-700"
                >
                  Need an account? Register
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setAuthMode('login')}
                  className="text-emerald-600 hover:text-emerald-700"
                >
                  Already have an account? Sign in
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {showUploadPrompt && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Upload local data to cloud?</h3>
            <p className="text-sm text-gray-600 mb-4">
              We found existing local data. Would you like to upload it to your cloud account?
            </p>
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={handleUploadPromptNo}
                className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50"
              >
                No, use cloud data
              </button>
              <button
                type="button"
                onClick={() => void handleUploadPromptYes()}
                className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700"
              >
                Yes, upload local
              </button>
            </div>
          </div>
        </div>
      )}

      <SupplementDetailModal
        supplement={activeSupplement}
        isOpen={Boolean(activeSupplement)}
        onClose={() => setActiveSupplement(null)}
        weightKg={userProfile.weightKg}
        recommendation={activeRecommendation}
      />

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
  isSelected,
  onSelect,
  showSelection,
  recommendation,
  onViewDetails
}: {
  supplement: Supplement;
  isSelected: boolean;
  onSelect: () => void;
  showSelection: boolean;
  recommendation?: Recommendation;
  onViewDetails: () => void;
}) {
  const evidenceInfo = getEvidenceInfo(supplement.evidence);
  const pragmaticTier = getPragmaticTierForSupplement(supplement);
  const pragmaticTierInfo = getPragmaticTierInfo(pragmaticTier);
  const cautionInfo = recommendation ? getCautionInfo(recommendation.cautionLevel) : null;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-4">
      <div className="flex items-start gap-3">
        {showSelection && (
          <button
            onClick={(e) => { e.stopPropagation(); onSelect(); }}
            className={`flex-shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition ${
              isSelected 
                ? 'bg-emerald-500 border-emerald-500 text-white' 
                : 'border-gray-300 hover:border-emerald-400'
            }`}
            aria-label={isSelected ? 'Remove from stack' : 'Add to stack'}
          >
            {isSelected && (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>
        )}
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-gray-900">{supplement.name}</h3>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getTypeColor(supplement.type)}`}>
              {getTypeLabel(supplement.type)}
            </span>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${evidenceInfo.color}`}>
              {evidenceInfo.label}
            </span>
            {pragmaticTierInfo && (
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${pragmaticTierInfo.bg} ${pragmaticTierInfo.color}`}>
                Tier {pragmaticTierInfo.shortLabel}
              </span>
            )}
            {recommendation && (
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                recommendation.priority === 'essential' ? 'bg-emerald-500 text-white' :
                recommendation.priority === 'beneficial' ? 'bg-blue-500 text-white' :
                'bg-gray-200 text-gray-600'
              }`}>
                {recommendation.priority}
              </span>
            )}
            {cautionInfo && (
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${cautionInfo.className}`}>
                {cautionInfo.label}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600 line-clamp-2">{supplement.description}</p>
          {recommendation && (
            <div className="space-y-1">
              <p className="text-xs text-emerald-600 font-medium">{recommendation.reason}</p>
              {recommendation.safetyFlags && recommendation.safetyFlags.length > 0 && (
                <ul className="text-xs text-amber-700 space-y-0.5">
                  {recommendation.safetyFlags.map((flag, index) => (
                    <li key={index}>⚠️ {flag}</li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={onViewDetails}
          className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-full px-2 py-1"
        >
          View details
        </button>
      </div>
    </div>
  );
}
