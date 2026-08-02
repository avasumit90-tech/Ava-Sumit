// Utility for Persistent Donation Management and Payment Verification Storage

export interface DonationSubmission {
  id: string;
  donorName: string;
  email: string;
  amount: number;
  transactionId: string; // TXT ID / UTR Number
  screenshotUrl?: string; // Payment confirmation screenshot Base64 / URL
  paymentMethod: 'upi' | 'card' | 'netbanking';
  status: 'Pending (24 Hours)' | 'Approved' | 'Rejected';
  date: string; // Timestamp e.g. "2026-08-02 10:15"
  reg80gNumber: string;
  receiptNumber: string;
  donorPan?: string;
  donorPhone?: string;
  remarks?: string;
}

const STORAGE_KEY = 'ava_foundation_donations_db_v1';

const INITIAL_DONATIONS: DonationSubmission[] = [
  {
    id: 'DON-1004',
    donorName: 'Sunita Gupta',
    email: 'sunita.g@example.com',
    amount: 10000,
    transactionId: 'UPI-983427185204',
    screenshotUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=600',
    paymentMethod: 'upi',
    status: 'Pending (24 Hours)',
    date: '2026-08-02 04:30',
    reg80gNumber: 'AAATA5416F/80G/2026',
    receiptNumber: 'AVA/REC/2026/104',
    donorPan: 'ABCDE1234F',
    donorPhone: '+91 98765 11223',
    remarks: 'Awaiting admin verification of UPI transaction ID and bank credit.'
  },
  {
    id: 'DON-1003',
    donorName: 'Amit Patel',
    email: 'amit.patel@example.com',
    amount: 2500,
    transactionId: 'ICICI-883491029311',
    screenshotUrl: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&q=80&w=600',
    paymentMethod: 'upi',
    status: 'Approved',
    date: '2026-08-01 16:45',
    reg80gNumber: 'AAATA5416F/80G/2026',
    receiptNumber: 'AVA/REC/2026/103',
    donorPan: 'BGHKP9921M',
    donorPhone: '+91 98123 45678'
  },
  {
    id: 'DON-1002',
    donorName: 'Priya Verma',
    email: 'priya.v@example.com',
    amount: 12000,
    transactionId: 'TXN983427183',
    paymentMethod: 'card',
    status: 'Approved',
    date: '2026-07-29 11:05',
    reg80gNumber: 'AAATA5416F/80G/2026',
    receiptNumber: 'AVA/REC/2026/102',
    donorPan: 'CKLPM8812K'
  },
  {
    id: 'DON-1001',
    donorName: 'Rajesh Sharma',
    email: 'rajesh.sharma@example.com',
    amount: 5000,
    transactionId: 'TXN983427182',
    paymentMethod: 'netbanking',
    status: 'Approved',
    date: '2026-07-28 14:20',
    reg80gNumber: 'AAATA5416F/80G/2026',
    receiptNumber: 'AVA/REC/2026/101',
    donorPan: 'AAHTA5416F'
  }
];

export function getAllDonations(): DonationSubmission[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DONATIONS));
      return INITIAL_DONATIONS;
    }
    return JSON.parse(raw) as DonationSubmission[];
  } catch (err) {
    console.error('Error loading donations from storage:', err);
    return INITIAL_DONATIONS;
  }
}

export function saveDonationSubmission(submission: Omit<DonationSubmission, 'id' | 'date' | 'receiptNumber' | 'reg80gNumber' | 'status'> & { status?: DonationSubmission['status'] }): DonationSubmission {
  const allDonations = getAllDonations();
  const nextNum = 1000 + allDonations.length + 1;
  const id = `DON-${nextNum}`;
  const receiptNumber = `AVA/REC/2026/${nextNum}`;
  const reg80gNumber = 'AAATA5416F/80G/2026';
  
  const now = new Date();
  const dateStr = now.toISOString().replace('T', ' ').substring(0, 16);

  const newDonation: DonationSubmission = {
    ...submission,
    id,
    date: dateStr,
    receiptNumber,
    reg80gNumber,
    status: submission.status || 'Pending (24 Hours)'
  };

  const updated = [newDonation, ...allDonations];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

  // Dispatch custom event for real-time reactivity
  window.dispatchEvent(new CustomEvent('ava_donations_updated', { detail: newDonation }));

  return newDonation;
}

export function updateDonationStatus(
  id: string, 
  status: DonationSubmission['status'], 
  remarks?: string
): void {
  const all = getAllDonations();
  const updated = all.map(d => {
    if (d.id === id) {
      return { ...d, status, remarks: remarks || d.remarks };
    }
    return d;
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent('ava_donations_updated', { detail: { id, status } }));
}

export function deleteDonation(id: string): void {
  const all = getAllDonations();
  const filtered = all.filter(d => d.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  window.dispatchEvent(new CustomEvent('ava_donations_updated', { detail: { id } }));
}
