// Mock data for Admin experience
export const branches = [
  {
    id: 'north',
    name: 'North Diagnostic Center',
    address: '22 North Road, Bangalore',
    avgTurnaround: 2.1,
    inTransit: 6,
    criticalAlerts: 2,
    integrity: 98,
    technicians: 4,
    capacity: 38,
    samplesInTransit: 12,
    coldChainBreaches: 1,
    anomaliesThisWeek: 5,
    branchEvents: [
      { day: 'Mon', anomalies: 1 },
      { day: 'Tue', anomalies: 0 },
      { day: 'Wed', anomalies: 1 },
      { day: 'Thu', anomalies: 2 },
      { day: 'Fri', anomalies: 1 },
      { day: 'Sat', anomalies: 0 },
      { day: 'Sun', anomalies: 0 }
    ]
  },
  {
    id: 'west',
    name: 'West End Lab',
    address: '11 West Avenue, Bangalore',
    avgTurnaround: 3.3,
    inTransit: 9,
    criticalAlerts: 3,
    integrity: 92,
    technicians: 5,
    capacity: 45,
    samplesInTransit: 18,
    coldChainBreaches: 4,
    anomaliesThisWeek: 8,
    branchEvents: [
      { day: 'Mon', anomalies: 2 },
      { day: 'Tue', anomalies: 1 },
      { day: 'Wed', anomalies: 1 },
      { day: 'Thu', anomalies: 2 },
      { day: 'Fri', anomalies: 1 },
      { day: 'Sat', anomalies: 1 },
      { day: 'Sun', anomalies: 0 }
    ]
  },
  {
    id: 'central',
    name: 'Central Clinical Lab',
    address: '8 Central Plaza, Bangalore',
    avgTurnaround: 1.8,
    inTransit: 4,
    criticalAlerts: 1,
    integrity: 99,
    technicians: 3,
    capacity: 32,
    samplesInTransit: 7,
    coldChainBreaches: 0,
    anomaliesThisWeek: 3,
    branchEvents: [
      { day: 'Mon', anomalies: 0 },
      { day: 'Tue', anomalies: 1 },
      { day: 'Wed', anomalies: 0 },
      { day: 'Thu', anomalies: 1 },
      { day: 'Fri', anomalies: 1 },
      { day: 'Sat', anomalies: 0 },
      { day: 'Sun', anomalies: 0 }
    ]
  },
  {
    id: 'east',
    name: 'East Side Diagnostics',
    address: '71 East Street, Bangalore',
    avgTurnaround: 2.7,
    inTransit: 8,
    criticalAlerts: 2,
    integrity: 96,
    technicians: 4,
    capacity: 40,
    samplesInTransit: 15,
    coldChainBreaches: 2,
    anomaliesThisWeek: 6,
    branchEvents: [
      { day: 'Mon', anomalies: 1 },
      { day: 'Tue', anomalies: 1 },
      { day: 'Wed', anomalies: 1 },
      { day: 'Thu', anomalies: 0 },
      { day: 'Fri', anomalies: 2 },
      { day: 'Sat', anomalies: 1 },
      { day: 'Sun', anomalies: 0 }
    ]
  }
];

export const technicians = [
  { id: 'tech-1', name: 'Ravi Kumar', branch: 'North Diagnostic Center', todayCollected: 9, onDuty: true, workload: 5, waiting: 2, shift: 'Morning', active: true },
  { id: 'tech-2', name: 'Meena Sharma', branch: 'West End Lab', todayCollected: 7, onDuty: true, workload: 6, waiting: 4, shift: 'Evening', active: true },
  { id: 'tech-3', name: 'Ajay Patel', branch: 'Central Clinical Lab', todayCollected: 11, onDuty: false, workload: 2, waiting: 1, shift: 'Night', active: true },
  { id: 'tech-4', name: 'Sneha Joshi', branch: 'East Side Diagnostics', todayCollected: 8, onDuty: true, workload: 4, waiting: 2, shift: 'Morning', active: true },
  { id: 'tech-5', name: 'Kiran B.', branch: 'West End Lab', todayCollected: 5, onDuty: false, workload: 1, waiting: 0, shift: 'Day', active: false }
];

export const pathologists = [
  { id: 'path-1', name: 'Dr. Asha Patel', branch: 'North Diagnostic Center', onDuty: true, signedToday: 14, avgSignTime: 1.8, pendingCritical: 2 },
  { id: 'path-2', name: 'Dr. Neeraj Mehta', branch: 'West End Lab', onDuty: true, signedToday: 10, avgSignTime: 2.5, pendingCritical: 1 },
  { id: 'path-3', name: 'Dr. Priya Rao', branch: 'Central Clinical Lab', onDuty: false, signedToday: 6, avgSignTime: 2.2, pendingCritical: 0 }
];

export const samples = [
  {
    id: 'sample-1',
    sampleId: 'LS-88213',
    patientName: 'P. S.',
    branch: 'North Diagnostic Center',
    status: 'In transit',
    integrity: 'Pass',
    flag: 'None',
    testName: 'COVID PCR',
    custodyBroken: false,
    delayed: false,
    critical: false,
    doctor: 'Dr. Anand',
    collectedAt: '2026-08-01T08:30:00.000Z',
    expectedTurnaroundHours: 24,
    ledger: [
      { ts: 1712030400000, text: 'Sample booked', hash: '31ab54c6' },
      { ts: 1712034000000, text: 'Collected by technician Ravi', hash: '55b1c8d0' },
      { ts: 1712037600000, text: 'Entered courier', hash: '8d67a2f4' }
    ]
  },
  {
    id: 'sample-2',
    sampleId: 'LS-88190',
    patientName: 'R. K.',
    branch: 'West End Lab',
    status: 'Awaiting sign-off',
    integrity: 'Pass',
    flag: 'Critical',
    testName: 'Cardiac Panel',
    custodyBroken: false,
    delayed: false,
    critical: true,
    doctor: 'Dr. Mehta',
    collectedAt: '2026-07-31T10:15:00.000Z',
    expectedTurnaroundHours: 18,
    ledger: [
      { ts: 1711942800000, text: 'Sample booked', hash: 'd2c8f3a1' },
      { ts: 1711946400000, text: 'Collected by technician Meena', hash: 'c9d6b4e3' },
      { ts: 1711950000000, text: 'Delivered to lab', hash: 'a7f4d9b2' }
    ]
  },
  {
    id: 'sample-3',
    sampleId: 'LS-88195',
    patientName: 'A. T.',
    branch: 'Central Clinical Lab',
    status: 'Delivered',
    integrity: 'Fail',
    flag: 'Broken custody chain',
    testName: 'Complete Blood Count',
    custodyBroken: true,
    delayed: false,
    critical: false,
    doctor: 'Dr. Rao',
    collectedAt: '2026-07-31T07:20:00.000Z',
    expectedTurnaroundHours: 24,
    ledger: [
      { ts: 1711939200000, text: 'Sample booked', hash: 'e8e7c0a3' },
      { ts: 1711942800000, text: 'Collected by technician Ajay', hash: '42c8d7b1' },
      { ts: 1711946400000, text: 'Delivered to lab', hash: 'fb12a6d7' }
    ]
  },
  {
    id: 'sample-4',
    sampleId: 'LS-88200',
    patientName: 'M. L.',
    branch: 'East Side Diagnostics',
    status: 'Delayed',
    integrity: 'Pass',
    flag: 'Delayed',
    testName: 'Metabolic Panel',
    custodyBroken: false,
    delayed: true,
    critical: false,
    doctor: 'Dr. Anand',
    collectedAt: '2026-07-30T11:45:00.000Z',
    expectedTurnaroundHours: 24,
    ledger: [
      { ts: 1711852200000, text: 'Sample booked', hash: 'b7c2d4f3' },
      { ts: 1711855800000, text: 'Collected by technician Sneha', hash: 'f0a8c7b1' },
      { ts: 1711859400000, text: 'In transit', hash: 'e1d5a4c8' }
    ]
  },
  {
    id: 'sample-5',
    sampleId: 'LS-88212',
    patientName: 'J. N.',
    branch: 'North Diagnostic Center',
    status: 'Signed',
    integrity: 'Pass',
    flag: 'None',
    testName: 'Thyroid Panel',
    custodyBroken: false,
    delayed: false,
    critical: false,
    doctor: 'Dr. Patel',
    collectedAt: '2026-07-31T09:00:00.000Z',
    expectedTurnaroundHours: 24,
    ledger: [
      { ts: 1711946400000, text: 'Sample booked', hash: '27c9d0b4' },
      { ts: 1711950000000, text: 'Collected by technician Ravi', hash: '3b7e9a12' },
      { ts: 1711953600000, text: 'Signed by pathologist', hash: 'd9f4a7c1' }
    ]
  }
];

export const activityFeed = [
  { id: 'event-1', text: 'Technician Ravi collected sample LS-88213', branch: 'North Diagnostic Center', ts: 1712037600000 },
  { id: 'event-2', text: 'Dr. Mehta signed & escalated LS-88190', branch: 'West End Lab', ts: 1711953600000 },
  { id: 'event-3', text: 'Cold-chain breach flagged at East Side Diagnostics', branch: 'East Side Diagnostics', ts: 1711859400000 },
  { id: 'event-4', text: 'Sample LS-88212 passed custody integrity checks', branch: 'North Diagnostic Center', ts: 1711950000000 },
  { id: 'event-5', text: 'New technician added to West End Lab shift', branch: 'West End Lab', ts: 1711863000000 },
  { id: 'event-6', text: 'Dr. Rao signed report LS-88195', branch: 'Central Clinical Lab', ts: 1711946400000 },
  { id: 'event-7', text: 'Branch audit started for North Diagnostic Center', branch: 'North Diagnostic Center', ts: 1711960800000 },
  { id: 'event-8', text: 'Critical escalation recorded for LS-88190', branch: 'West End Lab', ts: 1711957200000 },
  { id: 'event-9', text: 'Temperature threshold updated for COVID PCR', branch: 'Central Clinical Lab', ts: 1711971600000 },
  { id: 'event-10', text: 'Pathology sign-off queue reviewed for East Side Diagnostics', branch: 'East Side Diagnostics', ts: 1711975200000 }
];

export const escalationLogs = [
  { id: 'esc-1', timestamp: '2026-08-01T11:10:00.000Z', patientName: 'P. S.', parameter: 'Troponin', pathologist: 'Dr. Mehta', doctorNotified: 'Dr. Anand', deliveryConfirmed: true, branch: 'West End Lab' },
  { id: 'esc-2', timestamp: '2026-08-01T09:45:00.000Z', patientName: 'R. K.', parameter: 'D-Dimer', pathologist: 'Dr. Asha Patel', doctorNotified: 'Dr. Mehta', deliveryConfirmed: false, branch: 'North Diagnostic Center' },
  { id: 'esc-3', timestamp: '2026-07-31T17:25:00.000Z', patientName: 'A. T.', parameter: 'Glucose', pathologist: 'Dr. Priya Rao', doctorNotified: 'Dr. Rao', deliveryConfirmed: true, branch: 'Central Clinical Lab' },
  { id: 'esc-4', timestamp: '2026-08-01T08:05:00.000Z', patientName: 'M. L.', parameter: 'Potassium', pathologist: 'Dr. Mehta', doctorNotified: 'Dr. Anand', deliveryConfirmed: false, branch: 'East Side Diagnostics' }
];

export const referenceRanges = [
  { id: 'ref-1', testType: 'COVID PCR', normal: 'Negative', critical: 'Positive', note: 'AI flags any positive result as critical due to isolation protocol.' },
  { id: 'ref-2', testType: 'Cardiac Panel', normal: 'Troponin < 0.04 ng/mL', critical: 'Troponin > 0.40 ng/mL', note: 'Critical thresholds influence emergency escalation and doctor notification.' },
  { id: 'ref-3', testType: 'Metabolic Panel', normal: 'Potassium 3.5-5.1 mmol/L', critical: 'Potassium < 2.8 or > 6.2 mmol/L', note: 'Changes here affect all incoming metabolic sample flagging.' }
];

export const notificationSettings = {
  sms: true,
  whatsapp: false,
  voice: true
};

export const coldChainThresholds = [
  { id: 'ct-1', sampleType: 'COVID PCR', min: 2, max: 8 },
  { id: 'ct-2', sampleType: 'Blood Sugar', min: 4, max: 10 },
  { id: 'ct-3', sampleType: 'Metabolic Panel', min: 3, max: 9 }
];

export function delay(ms = 250) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
