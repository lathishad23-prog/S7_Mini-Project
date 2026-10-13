// Mock data for Pathologist experience
export const pathologist = {
  id: 'path-1',
  name: 'Dr. Asha Patel',
  license: 'MD Pathology #P-084932',
  onDuty: true,
  hospital: 'Koramangala Diagnostic Center'
};

export const reviewQueue = [
  {
    id: 'r1',
    sampleId: 'LS-00210',
    patientName: 'Priya S.',
    age: 34,
    sex: 'F',
    testName: 'Lipid Panel',
    availableAt: '2026-08-01T09:30:00.000Z',
    status: 'routine',
    flags: [],
    collectedAt: '2026-08-01T07:10:00.000Z',
    doctor: 'Dr. Mehra',
    chainStatus: 'Complete',
    parameters: [
      { name: 'Cholesterol', value: 180, unit: 'mg/dL', low: 125, high: 200, flag: 'normal' },
      { name: 'HDL', value: 55, unit: 'mg/dL', low: 40, high: 60, flag: 'normal' },
      { name: 'LDL', value: 110, unit: 'mg/dL', low: 0, high: 130, flag: 'normal' }
    ]
  },
  {
    id: 'r2',
    sampleId: 'LS-00211',
    patientName: 'Rohan K.',
    age: 46,
    sex: 'M',
    testName: 'Complete Blood Count',
    availableAt: '2026-08-01T09:15:00.000Z',
    status: 'flagged',
    flags: ['Hemoglobin 11.2 g/dL below normal range'],
    collectedAt: '2026-08-01T06:45:00.000Z',
    doctor: 'Dr. Rahman',
    chainStatus: 'Complete',
    parameters: [
      { name: 'Hemoglobin', value: 11.2, unit: 'g/dL', low: 13.5, high: 17.5, flag: 'out-of-range' },
      { name: 'WBC', value: 6.5, unit: '10^3/µL', low: 4.0, high: 11.0, flag: 'normal' },
      { name: 'Platelets', value: 220, unit: '10^3/µL', low: 150, high: 450, flag: 'normal' }
    ]
  },
  {
    id: 'r3',
    sampleId: 'LS-00212',
    patientName: 'Nina P.',
    age: 29,
    sex: 'F',
    testName: 'Thyroid Panel',
    availableAt: '2026-08-01T08:50:00.000Z',
    status: 'routine',
    flags: [],
    collectedAt: '2026-08-01T05:40:00.000Z',
    doctor: 'Dr. Verma',
    chainStatus: 'Complete',
    parameters: [
      { name: 'TSH', value: 2.1, unit: 'µIU/mL', low: 0.5, high: 4.5, flag: 'normal' },
      { name: 'T4', value: 1.2, unit: 'ng/dL', low: 0.8, high: 1.8, flag: 'normal' }
    ]
  },
  {
    id: 'r4',
    sampleId: 'LS-00213',
    patientName: 'Amit S.',
    age: 52,
    sex: 'M',
    testName: 'BMP',
    availableAt: '2026-08-01T09:55:00.000Z',
    status: 'routine',
    flags: [],
    collectedAt: '2026-08-01T07:30:00.000Z',
    doctor: 'Dr. Balan',
    chainStatus: 'Complete',
    parameters: [
      { name: 'Sodium', value: 140, unit: 'mmol/L', low: 135, high: 145, flag: 'normal' },
      { name: 'Potassium', value: 4.2, unit: 'mmol/L', low: 3.5, high: 5.1, flag: 'normal' },
      { name: 'Glucose', value: 90, unit: 'mg/dL', low: 70, high: 99, flag: 'normal' }
    ]
  },
  {
    id: 'r5',
    sampleId: 'LS-00214',
    patientName: 'Sunita M.',
    age: 67,
    sex: 'F',
    testName: 'Electrolyte Panel',
    availableAt: '2026-08-01T09:05:00.000Z',
    status: 'critical',
    flags: ['Potassium 6.8 mmol/L exceeds critical threshold of 6.0 mmol/L'],
    collectedAt: '2026-08-01T06:15:00.000Z',
    doctor: 'Dr. Naik',
    chainStatus: 'Complete',
    parameters: [
      { name: 'Sodium', value: 138, unit: 'mmol/L', low: 135, high: 145, flag: 'normal' },
      { name: 'Potassium', value: 6.8, unit: 'mmol/L', low: 3.5, high: 5.1, flag: 'critical' },
      { name: 'Chloride', value: 101, unit: 'mmol/L', low: 98, high: 107, flag: 'normal' }
    ]
  }
];

export const signedReports = [
  {
    id: 's1',
    sampleId: 'LS-00205',
    patientName: 'Riya B.',
    testName: 'CBC',
    signedAt: '2026-07-31T17:05:00.000Z',
    outcome: 'routine',
    doctor: 'Dr. Nair'
  },
  {
    id: 's2',
    sampleId: 'LS-00206',
    patientName: 'Kiran D.',
    testName: 'Thyroid Panel',
    signedAt: '2026-07-31T18:20:00.000Z',
    outcome: 'escalated',
    doctor: 'Dr. Shah'
  },
  {
    id: 's3',
    sampleId: 'LS-00207',
    patientName: 'Meera J.',
    testName: 'Lipid Panel',
    signedAt: '2026-07-31T16:40:00.000Z',
    outcome: 'routine',
    doctor: 'Dr. Patel'
  }
];

export function delay(ms = 250) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
