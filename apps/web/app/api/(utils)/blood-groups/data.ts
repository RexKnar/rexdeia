export const bloodGroups = [
  {
    bloodType: 'A+',
    compatibleDonors: ['A+', 'A-', 'O+', 'O-'],
    canDonateTo: ['A+', 'AB+'],
    notes:
      'Can receive red blood cells from A+ and O+ donors. Can donate to A+ and AB+ recipients.',
  },
  {
    bloodType: 'A-',
    compatibleDonors: ['A-', 'O-'],
    canDonateTo: ['A+', 'A-', 'AB+', 'AB-'],
    notes:
      'Can receive red blood cells from A- and O- donors. Can donate to any A or AB blood type.',
  },
  {
    bloodType: 'B+',
    compatibleDonors: ['B+', 'B-', 'O+', 'O-'],
    canDonateTo: ['B+', 'AB+'],
    notes:
      'Can receive red blood cells from B+ and O+ donors. Can donate to B+ and AB+ recipients.',
  },
  {
    bloodType: 'B-',
    compatibleDonors: ['B-', 'O-'],
    canDonateTo: ['B+', 'B-', 'AB+', 'AB-'],
    notes:
      'Can receive red blood cells from B- and O- donors. Can donate to any B or AB blood type.',
  },
  {
    bloodType: 'AB+',
    compatibleDonors: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    canDonateTo: ['AB+'],
    notes:
      'Universal recipient for red blood cells but can only donate to other AB+ individuals.',
  },
  {
    bloodType: 'AB-',
    compatibleDonors: ['A-', 'B-', 'AB-', 'O-'],
    canDonateTo: ['AB+', 'AB-'],
    notes:
      'Can receive red blood cells from any negative blood type. Can donate to AB+ and AB- recipients.',
  },
  {
    bloodType: 'O+',
    compatibleDonors: ['O+', 'O-'],
    canDonateTo: ['A+', 'B+', 'AB+', 'O+'],
    notes:
      'Can donate red blood cells to any positive blood type. Can receive from O+ and O- donors.',
  },
  {
    bloodType: 'O-',
    compatibleDonors: ['O-'],
    canDonateTo: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    notes: 'Universal donor for red blood cells but can only receive O- blood.',
  },
  {
    bloodType: 'A1+',
    compatibleDonors: [],
    canDonateTo: [],
    notes: '',
  },
  {
    bloodType: 'A1-',
    compatibleDonors: [],
    canDonateTo: [],
    notes: '',
  },
  {
    bloodType: 'A1B+',
    compatibleDonors: [],
    canDonateTo: [],
    notes: '',
  },
  {
    bloodType: 'A1B-',
    compatibleDonors: [],
    canDonateTo: [],
    notes: '',
  },
];
