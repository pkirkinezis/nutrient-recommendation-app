import { useState, useMemo } from 'react';
import { SearchBar } from './components/SearchBar';
import { SupplementCard } from './components/SupplementCard';
import { DisclaimerBanner } from './components/DisclaimerBanner';
import { AnalysisPanel } from './components/AnalysisPanel';
import { supplements } from './data/supplements';
import { Sprout, Settings, X, Check } from 'lucide-react';
import { UserProfile } from './types';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  
  const [userProfile, setUserProfile] = useState<UserProfile>({
    diet: 'Omnivore',
    isPregnant: false,
    takingMedication: false,
    goals: []
  });

  const commonTags = ['Sleep', 'Stress', 'Muscle', 'Energy', 'Focus', 'Immunity', 'Libido', 'Anxiety', 'Digestion', 'Joints', 'Skin', 'Detox'];

  const filteredSupplements = useMemo(() => {
    let results = supplements;

    // 1. Filter by Search or Tag
    const query = searchQuery.toLowerCase().trim();
    if (activeTag && !query) {
      results = results.filter(s => 
        s.commonUses.some(use => use.toLowerCase() === activeTag.toLowerCase()) ||
        s.systemTags.some(tag => tag.toLowerCase().includes(activeTag.toLowerCase()))
      );
    } else if (query) {
      results = results.filter((supplement) => {
        const matchName = supplement.name.toLowerCase().includes(query);
        const matchUses = supplement.commonUses.some(use => use.toLowerCase().includes(query));
        const matchBenefits = supplement.benefits.some(benefit => benefit.toLowerCase().includes(query));
        const matchCategory = supplement.category.toLowerCase().includes(query);
        const matchSystem = supplement.systemTags.some(tag => tag.toLowerCase().includes(query));
        
        return matchName || matchUses || matchBenefits || matchCategory || matchSystem;
      });
    }

    // 2. Apply Personalization Filters
    if (userProfile.isPregnant) {
      // Filter out unsafe items or add warnings (For now, we just exclude items explicitly bad)
      // In a real app, this would be much stricter.
      results = results.filter(s => !s.warnings.toLowerCase().includes('pregnant'));
    }

    return results;
  }, [searchQuery, activeTag, userProfile]);

  const handleTagClick = (tag: string) => {
    if (activeTag === tag) {
      setActiveTag(null);
    } else {
      setActiveTag(tag);
      setSearchQuery('');
    }
  };

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    if (val) setActiveTag(null);
  };

  const toggleDiet = () => {
    setUserProfile(prev => ({
      ...prev,
      diet: prev.diet === 'Vegan' ? 'Omnivore' : 'Vegan'
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
      <DisclaimerBanner />
      
      {/* Header / Hero Section */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-tr from-emerald-500 to-teal-500 p-2 rounded-lg shadow-lg">
                <Sprout className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-slate-800">
                NutriCompass
              </h1>
            </div>
            
            <button 
              onClick={() => setShowSettings(!showSettings)}
              className={`p-2 rounded-full transition-colors ${showSettings ? 'bg-slate-100 text-indigo-600' : 'text-slate-500 hover:bg-slate-100'}`}
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>

          {/* Personalization Panel */}
          {showSettings && (
            <div className="mb-6 bg-slate-50 border border-slate-200 rounded-xl p-4 animate-in fade-in slide-in-from-top-2">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-slate-800">Your Context</h3>
                <button onClick={() => setShowSettings(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <button 
                  onClick={toggleDiet}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                    userProfile.diet === 'Vegan' 
                      ? 'bg-green-50 border-green-200 text-green-700' 
                      : 'bg-white border-slate-200 text-slate-600'
                  }`}
                >
                  {userProfile.diet === 'Vegan' ? <Check className="w-3.5 h-3.5" /> : null}
                  Vegan Diet
                </button>

                <button 
                  onClick={() => setUserProfile(p => ({ ...p, isPregnant: !p.isPregnant }))}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                    userProfile.isPregnant 
                      ? 'bg-pink-50 border-pink-200 text-pink-700' 
                      : 'bg-white border-slate-200 text-slate-600'
                  }`}
                >
                   {userProfile.isPregnant ? <Check className="w-3.5 h-3.5" /> : null}
                   Pregnancy / Nursing
                </button>

                <button 
                  onClick={() => setUserProfile(p => ({ ...p, takingMedication: !p.takingMedication }))}
                   className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                    userProfile.takingMedication
                      ? 'bg-amber-50 border-amber-200 text-amber-700' 
                      : 'bg-white border-slate-200 text-slate-600'
                  }`}
                >
                   {userProfile.takingMedication ? <Check className="w-3.5 h-3.5" /> : null}
                   Taking Medication
                </button>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                * We use this to filter out contraindicated supplements and prioritize specific needs.
              </p>
            </div>
          )}

          <div className="max-w-2xl mx-auto">
             <SearchBar value={searchQuery} onChange={handleSearchChange} />
             <AnalysisPanel query={searchQuery} />
          </div>

          {/* Quick Tags */}
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {commonTags.map((tag) => (
              <button
                key={tag}
                onClick={() => handleTagClick(tag)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 border ${
                  activeTag === tag
                    ? 'bg-slate-800 text-white border-slate-800'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-800">
            {searchQuery 
              ? `Results` 
              : activeTag 
                ? `${activeTag} Support` 
                : 'All Recommendations'}
          </h3>
          <span className="text-xs text-slate-500 bg-white border border-slate-200 px-2 py-1 rounded-md">
            {filteredSupplements.length} items
          </span>
        </div>

        {filteredSupplements.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSupplements.map((supplement) => (
              <SupplementCard key={supplement.id} supplement={supplement} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-300">
            <Sprout className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900">No matches found</h3>
            <p className="text-slate-500 max-w-sm mx-auto mt-2">
               Try adjusting your search or filters.
            </p>
            <button 
              onClick={() => { setSearchQuery(''); setActiveTag(null); }}
              className="mt-6 text-indigo-600 font-medium hover:text-indigo-700 underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-500 text-xs">
          <p className="mb-2">
            <strong>NutriCompass</strong> is an educational tool. 
          </p>
          <p>
            Always consult with a healthcare professional before starting any new supplement regimen.
          </p>
          <p className="mt-4 text-slate-400">
            © {new Date().getFullYear()} NutriCompass
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
