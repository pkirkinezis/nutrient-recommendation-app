export const ApplicationOverviewTab = () => {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-teal-50 p-6 shadow-sm dark:border-emerald-900/40 dark:from-emerald-900/20 dark:to-teal-900/20">
        <h2 className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">What This App Does</h2>
        <p className="mt-2 text-sm text-emerald-800 dark:text-emerald-200">
          NutriCompass helps people choose supplements more safely by combining goal-based recommendations, evidence levels, and interaction checks in one place.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <article className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">Goal analysis</p>
          <h3 className="mt-2 text-base font-semibold text-gray-900 dark:text-slate-100">Natural-language recommendations</h3>
          <p className="mt-2 text-sm text-gray-600 dark:text-slate-300">
            You type health goals in plain language and the app maps them to relevant supplements and body systems.
          </p>
        </article>
        <article className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">Safety-first logic</p>
          <h3 className="mt-2 text-base font-semibold text-gray-900 dark:text-slate-100">Evidence and interaction screening</h3>
          <p className="mt-2 text-sm text-gray-600 dark:text-slate-300">
            Recommendations are weighted by evidence strength and checked for cautions, drug interactions, and reproductive safety concerns.
          </p>
        </article>
        <article className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs font-semibold uppercase tracking-wide text-purple-600">Learning + tracking</p>
          <h3 className="mt-2 text-base font-semibold text-gray-900 dark:text-slate-100">Education and progress loops</h3>
          <p className="mt-2 text-sm text-gray-600 dark:text-slate-300">
            The app also includes guides, food lookup, pre-made stacks, daily logs, and optional lab tracking to help refine decisions over time.
          </p>
        </article>
      </div>

      <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100">App Goals</h3>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {[
            'Make supplement decisions clearer, safer, and more personalized.',
            'Reduce misinformation by showing evidence strength and practical tradeoffs.',
            'Bridge food-first nutrition, modern supplement science, and traditional knowledge.',
            'Help users build sustainable routines instead of random or excessive stacking.'
          ].map((goal) => (
            <div key={goal} className="rounded-xl border border-emerald-100 bg-emerald-50 p-3 text-sm text-emerald-800 dark:border-emerald-900/40 dark:bg-emerald-900/10 dark:text-emerald-200">
              {goal}
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100">How Someone Can Benefit</h3>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 dark:border-blue-900/40 dark:bg-blue-900/10">
            <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100">Faster shortlisting</h4>
            <p className="mt-1 text-sm text-blue-800 dark:text-blue-200">
              Instead of scanning dozens of options manually, users get a narrowed set aligned to their goals and profile.
            </p>
          </div>
          <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 dark:border-blue-900/40 dark:bg-blue-900/10">
            <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100">Safer choices</h4>
            <p className="mt-1 text-sm text-blue-800 dark:text-blue-200">
              Built-in caution flags and stack interaction checks help avoid risky combinations and poor-fit picks.
            </p>
          </div>
          <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 dark:border-blue-900/40 dark:bg-blue-900/10">
            <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100">Better understanding</h4>
            <p className="mt-1 text-sm text-blue-800 dark:text-blue-200">
              People can compare options, understand evidence levels, and learn why one supplement is preferred over another.
            </p>
          </div>
          <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 dark:border-blue-900/40 dark:bg-blue-900/10">
            <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100">Continuous improvement</h4>
            <p className="mt-1 text-sm text-blue-800 dark:text-blue-200">
              Tracking outcomes over time supports more informed adjustments instead of changing plans at random.
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-800 dark:border-amber-900/40 dark:bg-amber-900/10 dark:text-amber-200">
        Educational tool only. NutriCompass does not diagnose or treat disease, and it should not replace clinical care.
      </section>
    </div>
  );
};

