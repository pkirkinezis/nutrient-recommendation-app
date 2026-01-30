import { SupplementStack } from '../types';

export const premadeStacks: SupplementStack[] = [
  {
    id: 'reproductive-foundation',
    name: 'Reproductive Health Foundation Stack',
    description: 'Foundational nutrient plus adaptogen support for libido, hormone balance, and fertility.',
    targetGender: 'all',
    primaryGoal: 'fertility',
    synergyDescription: 'Zinc, vitamin D, magnesium, and boron work together to optimize hormone production and free testosterone, while ashwagandha and shilajit combine to reduce stress and elevate vitality. Maca complements the stack with libido and mood support.',
    ingredients: [
      {
        supplementId: 'zinc',
        dosage: '15–30 mg daily',
        reason: 'Supports testosterone production, sperm health, and libido; take with meals to limit GI upset.'
      },
      {
        supplementId: 'vitamin-d3',
        dosage: '2,000 IU daily',
        reason: 'Supports reproductive hormone balance and sperm motility; take with a fatty meal for absorption.'
      },
      {
        supplementId: 'magnesium',
        dosage: '300–400 mg nightly (citrate or glycinate)',
        reason: 'Supports testosterone and sperm parameters while helping activate vitamin D.'
      },
      {
        supplementId: 'boron',
        dosage: '3–6 mg daily',
        reason: 'Supports free testosterone and helps convert vitamin D to its active form.'
      },
      {
        supplementId: 'ashwagandha',
        dosage: '300–600 mg extract, 1–2× daily',
        reason: 'Adaptogen that reduces cortisol while supporting testosterone and sexual function.'
      },
      {
        supplementId: 'shilajit',
        dosage: '150–250 mg daily',
        reason: 'Mineral-rich resin that boosts stamina and supports testosterone.'
      },
      {
        supplementId: 'maca',
        dosage: '1,500 mg once or twice daily',
        reason: 'Improves sexual desire and mood without directly altering testosterone.'
      }
    ]
  },
  {
    id: 'male-libido-fertility',
    name: 'Male Libido & Fertility Stack',
    description: 'Targeted male stack focused on testosterone, libido, sperm quality, and prostate support.',
    targetGender: 'men',
    primaryGoal: 'libido',
    synergyDescription: 'Ashwagandha and shilajit amplify stress resilience and vitality, while tongkat ali plus mucuna support testosterone and dopamine-driven libido. Zinc, vitamin D, and magnesium anchor hormone output and sperm metrics.',
    ingredients: [
      {
        supplementId: 'zinc',
        dosage: '15–30 mg daily',
        reason: 'Essential for testosterone and sperm production; take with food.'
      },
      {
        supplementId: 'vitamin-d3',
        dosage: '2,000 IU daily',
        reason: 'Supports testosterone and sperm motility; take with a fatty meal.'
      },
      {
        supplementId: 'magnesium',
        dosage: '300–400 mg nightly (citrate or glycinate)',
        reason: 'Supports testosterone and sperm motility while aiding vitamin D activation.'
      },
      {
        supplementId: 'boron',
        dosage: '3–6 mg daily',
        reason: 'Supports testosterone metabolism and mineral balance.'
      },
      {
        supplementId: 'ashwagandha',
        dosage: '300–600 mg extract, 1–2× daily',
        reason: 'Improves libido and sexual function while lowering stress.'
      },
      {
        supplementId: 'shilajit',
        dosage: '150–250 mg daily',
        reason: 'Boosts stamina and total/free testosterone in men.'
      },
      {
        supplementId: 'tongkat-ali',
        dosage: '100–200 mg daily',
        reason: 'Traditionally used to raise testosterone and improve libido.'
      },
      {
        supplementId: 'mucuna',
        dosage: '200–500 mg daily (standardized L-DOPA)',
        reason: 'L-DOPA source that supports dopamine, testosterone, and semen quality.'
      },
      {
        supplementId: 'maca',
        dosage: '1,500 mg once or twice daily',
        reason: 'Enhances sexual desire and energy over 8–12 weeks.'
      },
      {
        supplementId: 'saw-palmetto',
        dosage: '160 mg twice daily (320 mg total)',
        reason: 'Supports prostate health and preserves free testosterone by modulating DHT.'
      }
    ]
  },
  {
    id: 'female-hormone-fertility',
    name: 'Female Hormone & Fertility Stack',
    description: 'Women-focused stack supporting hormone balance, fertility, and reproductive vitality.',
    targetGender: 'women',
    primaryGoal: 'fertility',
    synergyDescription: 'Foundational micronutrients (folate/folic acid, iodine, vitamin D, omega-3, zinc, magnesium) support preconception health while shatavari and ashwagandha address stress and reproductive balance. Add iron only if ferritin is low.',
    ingredients: [
      {
        supplementId: 'folate',
        dosage: '400–800 mcg daily',
        reason: 'Core preconception nutrient (folic acid or methylfolate) that supports neural tube development and methylation.'
      },
      {
        supplementId: 'iodine',
        dosage: '150 mcg daily',
        reason: 'Supports thyroid hormone production and early fetal neurodevelopment.'
      },
      {
        supplementId: 'zinc',
        dosage: '15–30 mg daily',
        reason: 'Supports reproductive hormone balance and overall fertility.'
      },
      {
        supplementId: 'vitamin-d3',
        dosage: '2,000 IU daily',
        reason: 'Supports hormone balance and reproductive outcomes.'
      },
      {
        supplementId: 'omega-3',
        dosage: '500 mg EPA+DHA daily (≥200 mg DHA)',
        reason: 'Supports fetal brain development and may reduce preterm risk.'
      },
      {
        supplementId: 'magnesium',
        dosage: '300–400 mg nightly (citrate or glycinate)',
        reason: 'Supports hormone balance and vitamin D activation while aiding recovery.'
      },
      {
        supplementId: 'iron',
        dosage: '18 mg daily; 45–60 mg daily only if deficient',
        reason: 'Use higher doses when ferritin or hemoglobin is low; otherwise prioritize iron-rich foods.'
      },
      {
        supplementId: 'boron',
        dosage: '3–6 mg daily',
        reason: 'Supports estrogen metabolism and hormone balance.'
      },
      {
        supplementId: 'shatavari',
        dosage: '500 mg twice daily',
        reason: 'Traditional female tonic that supports fertility, menstrual balance, and libido.'
      },
      {
        supplementId: 'ashwagandha',
        dosage: '300–600 mg extract, 1–2× daily',
        reason: 'Adaptogen to reduce stress and support libido and energy (stop once pregnant).'
      },
      {
        supplementId: 'maca',
        dosage: '1,500 mg once or twice daily',
        reason: 'Supports mood, energy, and sexual desire (use preconception only).'
      }
    ]
  },
  {
    id: 'energy-vitality',
    name: 'Energy & Vitality Stack',
    description: 'Daily energy support for sustained stamina, mitochondrial output, and reduced fatigue.',
    targetGender: 'all',
    primaryGoal: 'energy',
    synergyDescription: 'CoQ10 and B-complex fuel cellular energy production, while rhodiola buffers fatigue and vitamin D supports overall vitality.',
    ingredients: [
      {
        supplementId: 'coq10',
        dosage: '100–200 mg daily with meals',
        reason: 'Supports mitochondrial energy and cardiovascular endurance.'
      },
      {
        supplementId: 'b-complex',
        dosage: '1 capsule daily with food',
        reason: 'Supports energy metabolism and stress resilience.'
      },
      {
        supplementId: 'rhodiola',
        dosage: '200–400 mg daily in the morning',
        reason: 'Adaptogen that improves energy and reduces fatigue.'
      },
      {
        supplementId: 'vitamin-d3',
        dosage: '2,000 IU daily with a fatty meal',
        reason: 'Supports energy levels and immune resilience.'
      }
    ]
  },
  {
    id: 'brain-focus',
    name: 'Brain & Focus Stack',
    description: 'Cognitive clarity stack for focus, memory, and mental stamina.',
    targetGender: 'all',
    primaryGoal: 'brain',
    synergyDescription: 'Lion’s mane supports neurogenesis, bacopa boosts memory, omega-3 nourishes brain tissue, and L-theanine smooths focus.',
    ingredients: [
      {
        supplementId: 'lions-mane',
        dosage: '500–1,000 mg daily',
        reason: 'Supports nerve growth factors and cognitive clarity.'
      },
      {
        supplementId: 'brahmi-bacopa',
        dosage: '300 mg daily',
        reason: 'Improves memory formation and focus over time.'
      },
      {
        supplementId: 'omega-3',
        dosage: '1–2 g combined EPA/DHA daily',
        reason: 'Supports brain structure and cognitive performance.'
      },
      {
        supplementId: 'l-theanine',
        dosage: '100–200 mg as needed',
        reason: 'Promotes calm focus without sedation.'
      }
    ]
  },
  {
    id: 'mood-stress',
    name: 'Mood & Stress Support Stack',
    description: 'Mood-balancing stack to support emotional resilience and calm.',
    targetGender: 'all',
    primaryGoal: 'mood',
    synergyDescription: 'Ashwagandha and rhodiola stabilize stress response, magnesium supports relaxation, and L-theanine improves calm focus.',
    ingredients: [
      {
        supplementId: 'ashwagandha',
        dosage: '300–600 mg extract, 1–2× daily',
        reason: 'Reduces cortisol and supports stress resilience.'
      },
      {
        supplementId: 'rhodiola',
        dosage: '200–400 mg daily in the morning',
        reason: 'Improves stress adaptation and energy.'
      },
      {
        supplementId: 'magnesium',
        dosage: '300–400 mg nightly (citrate or glycinate)',
        reason: 'Supports relaxation and mood stability.'
      },
      {
        supplementId: 'l-theanine',
        dosage: '100–200 mg as needed',
        reason: 'Calms the nervous system and smooths mood swings.'
      }
    ]
  },
  {
    id: 'sleep-recovery',
    name: 'Sleep & Recovery Stack',
    description: 'Nighttime support for deeper sleep quality and recovery.',
    targetGender: 'all',
    primaryGoal: 'sleep',
    synergyDescription: 'Magnesium and glycine promote relaxation, melatonin helps regulate sleep timing, and valerian supports deeper sleep cycles.',
    ingredients: [
      {
        supplementId: 'magnesium',
        dosage: '300–400 mg nightly (citrate or glycinate)',
        reason: 'Relaxes the nervous system for sleep onset.'
      },
      {
        supplementId: 'glycine',
        dosage: '3 g 30–60 minutes before bed',
        reason: 'Improves sleep quality and overnight recovery.'
      },
      {
        supplementId: 'melatonin',
        dosage: '0.5–3 mg 30 minutes before bed',
        reason: 'Supports circadian rhythm and sleep onset.'
      },
      {
        supplementId: 'valerian',
        dosage: '400–600 mg before bed',
        reason: 'Promotes relaxation and sleep depth.'
      }
    ]
  },
  {
    id: 'hormone-balance',
    name: 'Hormone Balance Stack',
    description: 'Foundational nutrients for steady hormone support and recovery.',
    targetGender: 'all',
    primaryGoal: 'hormones',
    synergyDescription: 'Vitamin D, magnesium, zinc, and boron support hormone synthesis and balance, while ashwagandha helps buffer stress impact.',
    ingredients: [
      {
        supplementId: 'vitamin-d3',
        dosage: '2,000 IU daily with a fatty meal',
        reason: 'Supports hormone balance and immune resilience.'
      },
      {
        supplementId: 'magnesium',
        dosage: '300–400 mg nightly',
        reason: 'Supports hormone signaling and recovery.'
      },
      {
        supplementId: 'zinc',
        dosage: '15–30 mg daily',
        reason: 'Supports hormone production and immune health.'
      },
      {
        supplementId: 'boron',
        dosage: '3–6 mg daily',
        reason: 'Supports free hormone availability.'
      },
      {
        supplementId: 'ashwagandha',
        dosage: '300–600 mg extract, 1–2× daily',
        reason: 'Buffers stress-driven hormone disruption.'
      }
    ]
  },
  {
    id: 'immunity-defense',
    name: 'Immune Defense Stack',
    description: 'Immune readiness stack for daily defense and resilience.',
    targetGender: 'all',
    primaryGoal: 'immunity',
    synergyDescription: 'Vitamin C and zinc support immune response, vitamin D primes defenses, and elderberry plus echinacea add botanical support.',
    ingredients: [
      {
        supplementId: 'vitamin-c',
        dosage: '500–1,000 mg daily',
        reason: 'Supports immune cell function and antioxidant protection.'
      },
      {
        supplementId: 'vitamin-d3',
        dosage: '2,000 IU daily',
        reason: 'Supports immune readiness and inflammation balance.'
      },
      {
        supplementId: 'zinc',
        dosage: '15–30 mg daily with food',
        reason: 'Supports immune signaling and recovery.'
      },
      {
        supplementId: 'elderberry',
        dosage: '500 mg daily',
        reason: 'Botanical support for immune resilience.'
      },
      {
        supplementId: 'echinacea',
        dosage: '300–500 mg daily',
        reason: 'Traditional immune support botanical.'
      }
    ]
  },
  {
    id: 'digestion-gut',
    name: 'Digestion & Gut Stack',
    description: 'Gut-friendly stack for digestion, comfort, and microbial balance.',
    targetGender: 'all',
    primaryGoal: 'digestion',
    synergyDescription: 'Probiotics balance the microbiome while ginger and peppermint soothe digestion, supported by turmeric’s anti-inflammatory profile.',
    ingredients: [
      {
        supplementId: 'probiotics',
        dosage: '10–20B CFU daily',
        reason: 'Supports gut microbiome balance and digestion.'
      },
      {
        supplementId: 'ginger',
        dosage: '500–1,000 mg daily',
        reason: 'Supports digestion and reduces nausea.'
      },
      {
        supplementId: 'peppermint-tea',
        dosage: '1–2 cups daily',
        reason: 'Soothes digestion and eases bloating.'
      },
      {
        supplementId: 'turmeric-curcumin',
        dosage: '500–1,000 mg daily with food',
        reason: 'Supports gut inflammation balance.'
      }
    ]
  },
  {
    id: 'fitness-performance',
    name: 'Fitness & Muscle Stack',
    description: 'Performance stack for strength, endurance, and workout recovery.',
    targetGender: 'all',
    primaryGoal: 'fitness',
    synergyDescription: 'Creatine powers strength, beta-alanine supports muscular endurance, L-citrulline boosts blood flow, and beetroot improves stamina.',
    ingredients: [
      {
        supplementId: 'creatine',
        dosage: '3–5 g daily',
        reason: 'Improves strength, power, and recovery.'
      },
      {
        supplementId: 'beta-alanine',
        dosage: '2–3 g daily',
        reason: 'Buffers muscle fatigue for higher training volume.'
      },
      {
        supplementId: 'l-citrulline',
        dosage: '3–6 g pre-workout',
        reason: 'Increases nitric oxide for better pumps and endurance.'
      },
      {
        supplementId: 'beetroot-extract',
        dosage: '1–2 g pre-workout',
        reason: 'Supports endurance and blood flow.'
      }
    ]
  },
  {
    id: 'inflammation-relief',
    name: 'Inflammation & Recovery Stack',
    description: 'Anti-inflammatory stack for joint comfort and recovery support.',
    targetGender: 'all',
    primaryGoal: 'inflammation',
    synergyDescription: 'Turmeric and boswellia reduce inflammatory pathways, omega-3 supports joint comfort, and resveratrol adds antioxidant protection.',
    ingredients: [
      {
        supplementId: 'turmeric-curcumin',
        dosage: '500–1,000 mg daily with food',
        reason: 'Supports inflammation balance and recovery.'
      },
      {
        supplementId: 'boswellia',
        dosage: '300–500 mg daily',
        reason: 'Supports joint comfort and inflammation modulation.'
      },
      {
        supplementId: 'omega-3',
        dosage: '1–2 g combined EPA/DHA daily',
        reason: 'Supports inflammation balance and cardiovascular health.'
      },
      {
        supplementId: 'resveratrol',
        dosage: '100–200 mg daily',
        reason: 'Provides antioxidant support for recovery.'
      }
    ]
  },
  {
    id: 'heart-cardio',
    name: 'Heart & Cardio Stack',
    description: 'Cardio-focused stack for circulation, heart health, and energy.',
    targetGender: 'all',
    primaryGoal: 'heart',
    synergyDescription: 'Omega-3 and CoQ10 support heart function, magnesium supports rhythm and recovery, and beetroot improves circulation.',
    ingredients: [
      {
        supplementId: 'omega-3',
        dosage: '1–2 g combined EPA/DHA daily',
        reason: 'Supports heart health and healthy triglycerides.'
      },
      {
        supplementId: 'coq10',
        dosage: '100–200 mg daily',
        reason: 'Supports cardiac energy production.'
      },
      {
        supplementId: 'magnesium',
        dosage: '300–400 mg nightly',
        reason: 'Supports healthy heart rhythm.'
      },
      {
        supplementId: 'beetroot-extract',
        dosage: '1–2 g daily',
        reason: 'Supports circulation and nitric oxide production.'
      }
    ]
  },
  {
    id: 'skin-beauty',
    name: 'Skin & Beauty Stack',
    description: 'Glow-support stack for skin hydration, elasticity, and hair health.',
    targetGender: 'all',
    primaryGoal: 'beauty',
    synergyDescription: 'Collagen and hyaluronic acid support skin structure, biotin supports hair and nails, and vitamin C boosts collagen synthesis.',
    ingredients: [
      {
        supplementId: 'collagen',
        dosage: '10 g daily',
        reason: 'Supports skin elasticity and connective tissue.'
      },
      {
        supplementId: 'hyaluronic-acid',
        dosage: '120–240 mg daily',
        reason: 'Supports skin hydration and joint comfort.'
      },
      {
        supplementId: 'biotin',
        dosage: '2,500–5,000 mcg daily',
        reason: 'Supports hair and nail strength.'
      },
      {
        supplementId: 'vitamin-c',
        dosage: '500 mg daily',
        reason: 'Supports collagen production and antioxidant protection.'
      }
    ]
  },
  {
    id: 'longevity-aging',
    name: 'Longevity & Healthy Aging Stack',
    description: 'Long-term wellness stack for cellular resilience and healthy aging.',
    targetGender: 'all',
    primaryGoal: 'longevity',
    synergyDescription: 'Resveratrol and green tea support cellular resilience, while CoQ10 and omega-3 promote cardiovascular and mitochondrial health.',
    ingredients: [
      {
        supplementId: 'resveratrol',
        dosage: '100–200 mg daily',
        reason: 'Supports cellular longevity and antioxidant defense.'
      },
      {
        supplementId: 'green-tea-matcha',
        dosage: '1–2 cups daily',
        reason: 'Provides polyphenols that support longevity.'
      },
      {
        supplementId: 'coq10',
        dosage: '100–200 mg daily',
        reason: 'Supports mitochondrial output and energy.'
      },
      {
        supplementId: 'omega-3',
        dosage: '1–2 g combined EPA/DHA daily',
        reason: 'Supports heart and brain health.'
      }
    ]
  },
  {
    id: 'metabolic-balance',
    name: 'Metabolic & Blood Sugar Stack',
    description: 'Blood sugar support stack for metabolic balance and energy stability.',
    targetGender: 'all',
    primaryGoal: 'metabolic',
    synergyDescription: 'Berberine and chromium support glucose metabolism, alpha-lipoic acid boosts antioxidant support, and magnesium supports insulin sensitivity.',
    ingredients: [
      {
        supplementId: 'berberine',
        dosage: '500 mg 2× daily with meals',
        reason: 'Supports healthy blood sugar and lipid balance.'
      },
      {
        supplementId: 'chromium',
        dosage: '200–400 mcg daily',
        reason: 'Supports healthy glucose metabolism.'
      },
      {
        supplementId: 'alpha-lipoic-acid',
        dosage: '300–600 mg daily',
        reason: 'Supports antioxidant defense and insulin sensitivity.'
      },
      {
        supplementId: 'magnesium',
        dosage: '300–400 mg nightly',
        reason: 'Supports insulin signaling and recovery.'
      }
    ]
  },
  {
    id: 'liver-detox',
    name: 'Liver & Detox Support Stack',
    description: 'Detox-focused stack for liver support and antioxidant balance.',
    targetGender: 'all',
    primaryGoal: 'detox',
    synergyDescription: 'Milk thistle and NAC support glutathione production while turmeric and green tea provide antioxidant protection.',
    ingredients: [
      {
        supplementId: 'milk-thistle',
        dosage: '150–300 mg daily',
        reason: 'Supports liver detoxification pathways.'
      },
      {
        supplementId: 'nac',
        dosage: '600–1,200 mg daily',
        reason: 'Supports glutathione production and detoxification.'
      },
      {
        supplementId: 'turmeric-curcumin',
        dosage: '500–1,000 mg daily with food',
        reason: 'Supports liver antioxidant defenses.'
      },
      {
        supplementId: 'green-tea-matcha',
        dosage: '1–2 cups daily',
        reason: 'Provides polyphenols for detox support.'
      }
    ]
  }
];
