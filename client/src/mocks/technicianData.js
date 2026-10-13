// Mock data for Technician experience
export const technician = {
  id: 'tech-1',
  name: 'Ravi Kumar',
  branch: 'Koramangala Lab',
  todayStats: {
    collected: 9,
    delivered: 6,
    breaches: 1
  }
};

export const safeRange = { min: 2, max: 8 };

export const collections = [
  {
    id: 'c1',
    sampleId: 'LS-00123',
    patientName: 'Priya S.',
    fullPatient: 'Priya Singh',
    testName: 'COVID PCR',
    collectionType: 'Home',
    scheduledTime: '2026-08-01T10:30:00.000Z',
    address: '12 Green Street, Koramangala',
    status: 'pending',
    notes: 'Patient asked for morning visit.',
    technicianId: 'tech-1',
    ledger: [
      { ts: 1712026200000, event: 'booked', text: 'Sample booked for home collection', hash: '7a5e6ddd' }
    ]
  },
  {
    id: 'c2',
    sampleId: 'LS-00124',
    patientName: 'Anil R.',
    fullPatient: 'Anil Rao',
    testName: 'Complete Blood Count',
    collectionType: 'Walk-in',
    scheduledTime: '2026-08-01T12:00:00.000Z',
    address: 'Koramangala Health Center, Gate 3',
    status: 'pending',
    notes: 'High-priority walk-in sample.',
    technicianId: 'tech-1',
    ledger: [
      { ts: 1712030400000, event: 'booked', text: 'Sample booked for walk-in collection', hash: '123ac4b0' }
    ]
  },
  {
    id: 'c3',
    sampleId: 'LS-00125',
    patientName: 'Meera P.',
    fullPatient: 'Meera Patel',
    testName: 'Lipid Panel',
    collectionType: 'Home',
    scheduledTime: '2026-08-01T08:45:00.000Z',
    address: '45 Oak Avenue, Koramangala',
    status: 'collected',
    notes: 'Patient fasting confirmed.',
    technicianId: 'tech-1',
    ledger: [
      { ts: 1712022900000, event: 'booked', text: 'Sample booked for home collection', hash: '23df9ee7' },
      { ts: 1712024700000, event: 'collected', text: 'Collected by technician Ravi', hash: '84cd2921' }
    ]
  },
  {
    id: 'c4',
    sampleId: 'LS-00126',
    patientName: 'Ramesh K.',
    fullPatient: 'Ramesh Kumar',
    testName: 'Urine Analysis',
    collectionType: 'Home',
    scheduledTime: '2026-08-01T09:15:00.000Z',
    address: '3 Lake View Road, Koramangala',
    status: 'in_transit',
    notes: 'Carry with cold pack.',
    technicianId: 'tech-1',
    readings: [
      { ts: 1712025300000, temperature: 5.1, humidity: 65 },
      { ts: 1712026200000, temperature: 5.8, humidity: 63 }
    ],
    ledger: [
      { ts: 1712023500000, event: 'booked', text: 'Sample booked for home collection', hash: '9f0d97ca' },
      { ts: 1712026200000, event: 'collected', text: 'Collected by technician Ravi', hash: 'b7f34f91' },
      { ts: 1712028300000, event: 'in_transit', text: 'Handed off to transport', hash: 'c5a4b57c' }
    ]
  },
  {
    id: 'c5',
    sampleId: 'LS-00127',
    patientName: 'Geeta M.',
    fullPatient: 'Geeta Menon',
    testName: 'Blood Sugar',
    collectionType: 'Home',
    scheduledTime: '2026-08-01T07:30:00.000Z',
    address: '9 Maple Drive, Koramangala',
    status: 'in_transit',
    notes: 'Cold-chain breach flagged.',
    technicianId: 'tech-1',
    readings: [
      { ts: 1712022600000, temperature: 7.2, humidity: 60 },
      { ts: 1712023800000, temperature: 9.4, humidity: 58 }
    ],
    ledger: [
      { ts: 1712020200000, event: 'booked', text: 'Sample booked for home collection', hash: 'aed3f592' },
      { ts: 1712022000000, event: 'collected', text: 'Collected by technician Ravi', hash: '1de2f7b8' },
      { ts: 1712022600000, event: 'in_transit', text: 'Cold-chain sensor reading added', hash: '47e8bf3a' }
    ]
  },
  {
    id: 'c6',
    sampleId: 'LS-00128',
    patientName: 'Sunita D.',
    fullPatient: 'Sunita Desai',
    testName: 'Vitamin D',
    collectionType: 'Home',
    scheduledTime: '2026-07-31T16:00:00.000Z',
    address: '28 Pine Lane, Koramangala',
    status: 'delivered',
    notes: 'Delivered to lab at 17:10.',
    technicianId: 'tech-1',
    ledger: [
      { ts: 1711939200000, event: 'booked', text: 'Sample booked for home collection', hash: 'adc1b225' },
      { ts: 1711942800000, event: 'collected', text: 'Collected by technician Ravi', hash: '198df7c7' },
      { ts: 1711946400000, event: 'delivered', text: 'Delivered to core lab', hash: 'e6a9d2b3' }
    ]
  }
];

export function delay(ms = 250) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
