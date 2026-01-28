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
    synergyDescription: 'Shatavari brings phytoestrogenic support for female reproductive health, while ashwagandha eases stress-related hormone disruption. Zinc, vitamin D, magnesium, and boron provide foundational reproductive nutrient support.',
    ingredients: [
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
        supplementId: 'magnesium',
        dosage: '300–400 mg nightly (citrate or glycinate)',
        reason: 'Supports hormone balance and vitamin D activation while aiding recovery.'
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
        reason: 'Adaptogen to reduce stress and support libido and energy.'
      },
      {
        supplementId: 'maca',
        dosage: '1,500 mg once or twice daily',
        reason: 'Supports mood, energy, and sexual desire.'
      }
    ]
  }
];
