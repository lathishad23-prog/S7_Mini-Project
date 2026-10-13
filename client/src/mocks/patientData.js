// Mock patient data for the Patient dashboard demo
export const patients = [
  {
    id: 'p1',
    name: 'Asha Kumar',
    email: 'asha@example.com'
  },
  {
    id: 'p2',
    name: 'Liam Brooks',
    email: 'liam@example.com'
  }
];

export const tests = [
  { id: 't1', name: 'CBC' },
  { id: 't2', name: 'Lipid Panel' },
  { id: 't3', name: 'Thyroid Panel' }
];

export const samples = [
  // mid-transit
  {
    id: 'LS-00012',
    bookingId: 'b1',
    testId: 't1',
    testName: 'CBC',
    status: 'in_transit',
    patientId: 'p1',
    ledger: [
      { ts: Date.now() - 1000 * 60 * 60, text: 'Booked' },
      { ts: Date.now() - 1000 * 60 * 45, text: 'Collected by Technician Ravi' },
      { ts: Date.now() - 1000 * 60 * 20, text: 'Left for Central Lab' }
    ],
    readings: [
      { ts: Date.now() - 1000 * 60 * 30, temp: 4.0 },
      { ts: Date.now() - 1000 * 60 * 20, temp: 4.1 },
      { ts: Date.now() - 1000 * 60 * 10, temp: 4.3 }
    ],
    criticalFlag: false
  },
  // delivered with critical flag
  {
    id: 'LS-00007',
    bookingId: 'b2',
    testId: 't2',
    testName: 'Lipid Panel',
    status: 'delivered',
    patientId: 'p1',
    ledger: [
      { ts: Date.now() - 1000 * 60 * 60 * 24, text: 'Booked' },
      { ts: Date.now() - 1000 * 60 * 60 * 23, text: 'Collected' },
      { ts: Date.now() - 1000 * 60 * 22, text: 'Received at Central Lab' }
    ],
    readings: [],
    criticalFlag: true
  },
  // freshly booked
  {
    id: 'LS-00099',
    bookingId: 'b3',
    testId: 't3',
    testName: 'Thyroid Panel',
    status: 'booked',
    patientId: 'p2',
    ledger: [{ ts: Date.now() - 1000 * 60 * 5, text: 'Booked' }],
    readings: [],
    criticalFlag: false
  }
];

export const reports = [
  {
    id: 'r1',
    sampleId: 'LS-00007',
    testName: 'Lipid Panel',
    date: Date.now() - 1000 * 60 * 60 * 20,
    doctor: 'Dr. Patel',
    parameters: [
      { name: 'Cholesterol', value: 260, low: 120, high: 200 },
      { name: 'HDL', value: 40, low: 40, high: 60 },
      { name: 'LDL', value: 180, low: 0, high: 130 }
    ]
  }
];

// Export a helper to simulate API latency
export function delay(ms = 300) {
  return new Promise((res) => setTimeout(res, ms));
}
