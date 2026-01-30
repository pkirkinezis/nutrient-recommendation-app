export const stackSupplementMappings = {
  'fertility-female': {
    category: 'Reproductive Health',
    gender: 'female',
    primaryStack: [
      { id: 'vitex', priority: 1, reason: 'Ovulation & Progesterone' },
      { id: 'shatavari', priority: 1, reason: 'Hormonal Tonic' },
      { id: 'maca', priority: 2, reason: 'Vitality & Libido' }
    ],
    conditionalStack: [
      { id: 'inositol', condition: 'PCOS', reason: 'Ovulation Restoration' },
      { id: 'red-clover', condition: 'General', reason: 'Estrogen Support' }
    ],
    supportingStack: [
      { id: 'coq10', priority: 2, reason: 'Egg Quality (Mitochondria)' }
    ]
  },
  'fertility-male': {
    category: 'Reproductive Health',
    gender: 'male',
    primaryStack: [
      { id: 'tribulus', priority: 1, reason: 'Testosterone & Sperm Count' },
      { id: 'ashwagandha', priority: 1, reason: 'Sperm Quality & Stress' },
      { id: 'mucuna', priority: 1, reason: 'Sperm Motility' }
    ],
    supportingStack: [
      { id: 'zinc', priority: 2, reason: 'Sperm Production' },
      { id: 'coq10', priority: 2, reason: 'Sperm Motility' },
      { id: 'l-carnitine', priority: 2, reason: 'Sperm Energy' },
      { id: 'fenugreek', priority: 3, reason: 'Libido Support' }
    ]
  }
};
