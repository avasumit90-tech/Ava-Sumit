// Utility for Mock Cloud Storage & Document Persistence

export interface UserDocument {
  id: string;
  userId: string; // User ID or App ID, e.g. 'AST-VOL-8820'
  userName: string;
  userEmail?: string;
  documentType: 'passportPhoto' | 'identityFront' | 'identityBack' | 'educationCert' | 'addressProof' | 'panCard' | 'other';
  documentTypeLabel: string;
  fileName: string;
  fileSize: string;
  fileType: string; // 'image/jpeg', 'application/pdf', etc.
  fileDataUrl: string; // Base64 or URL
  uploadDate: string;
  status: 'Verified' | 'Under Review' | 'Rejected';
  remarks?: string;
  category: 'Identity' | 'Education' | 'Address' | 'Tax/Financial' | 'Other';
  storageBucketUrl?: string;
}

const STORAGE_KEY = 'ava_foundation_user_cloud_documents_v1';

// Pre-seeded initial cloud documents for demo users
const INITIAL_DOCUMENTS: UserDocument[] = [
  // Sarah Student (Default User Dashboard)
  {
    id: 'DOC-SARAH-01',
    userId: 'AST-VOL-8820',
    userName: 'Sarah Student',
    userEmail: 'sarah.student@example.com',
    documentType: 'passportPhoto',
    documentTypeLabel: 'Passport Photo Headshot',
    fileName: 'sarah_profile_photo.jpg',
    fileSize: '1.2 MB',
    fileType: 'image/jpeg',
    fileDataUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
    uploadDate: '2024-01-15',
    status: 'Verified',
    category: 'Identity',
    storageBucketUrl: 'gs://ava-foundation-secure-vault/users/AST-VOL-8820/sarah_profile_photo.jpg'
  },
  {
    id: 'DOC-SARAH-02',
    userId: 'AST-VOL-8820',
    userName: 'Sarah Student',
    userEmail: 'sarah.student@example.com',
    documentType: 'identityFront',
    documentTypeLabel: 'Aadhaar Card (Front)',
    fileName: 'sarah_aadhar_front.pdf',
    fileSize: '2.4 MB',
    fileType: 'application/pdf',
    fileDataUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=600',
    uploadDate: '2024-01-15',
    status: 'Verified',
    category: 'Identity',
    remarks: 'Aadhaar UID authenticated against UIDAI Portal.',
    storageBucketUrl: 'gs://ava-foundation-secure-vault/users/AST-VOL-8820/sarah_aadhar_front.pdf'
  },
  {
    id: 'DOC-SARAH-03',
    userId: 'AST-VOL-8820',
    userName: 'Sarah Student',
    userEmail: 'sarah.student@example.com',
    documentType: 'educationCert',
    documentTypeLabel: 'Degree Marks Sheet',
    fileName: 'sarah_bachelor_marksheet.pdf',
    fileSize: '3.1 MB',
    fileType: 'application/pdf',
    fileDataUrl: 'https://images.unsplash.com/photo-1568667256549-094345857637?auto=format&fit=crop&q=80&w=600',
    uploadDate: '2024-02-10',
    status: 'Verified',
    category: 'Education',
    storageBucketUrl: 'gs://ava-foundation-secure-vault/users/AST-VOL-8820/sarah_bachelor_marksheet.pdf'
  },
  {
    id: 'DOC-SARAH-04',
    userId: 'AST-VOL-8820',
    userName: 'Sarah Student',
    userEmail: 'sarah.student@example.com',
    documentType: 'addressProof',
    documentTypeLabel: 'Electricity Utility Bill',
    fileName: 'sarah_utility_bill_2024.pdf',
    fileSize: '1.8 MB',
    fileType: 'application/pdf',
    fileDataUrl: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&q=80&w=600',
    uploadDate: '2024-01-16',
    status: 'Verified',
    category: 'Address',
    storageBucketUrl: 'gs://ava-foundation-secure-vault/users/AST-VOL-8820/sarah_utility_bill_2024.pdf'
  },

  // Anita Sharma (AST-DID-9012)
  {
    id: 'DOC-ANITA-01',
    userId: 'AST-DID-9012',
    userName: 'Anita Sharma',
    userEmail: 'anita.sharma@asthafoundation.org',
    documentType: 'identityFront',
    documentTypeLabel: 'Aadhaar Card (Front & Back)',
    fileName: 'anita_aadhar_card.pdf',
    fileSize: '2.1 MB',
    fileType: 'application/pdf',
    fileDataUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=600',
    uploadDate: '2021-01-14',
    status: 'Verified',
    category: 'Identity',
    storageBucketUrl: 'gs://ava-foundation-secure-vault/users/AST-DID-9012/anita_aadhar_card.pdf'
  },
  {
    id: 'DOC-ANITA-02',
    userId: 'AST-DID-9012',
    userName: 'Anita Sharma',
    userEmail: 'anita.sharma@asthafoundation.org',
    documentType: 'educationCert',
    documentTypeLabel: 'MSW Masters Degree Certificate',
    fileName: 'anita_msw_degree_tiss.pdf',
    fileSize: '4.5 MB',
    fileType: 'application/pdf',
    fileDataUrl: 'https://images.unsplash.com/photo-1568667256549-094345857637?auto=format&fit=crop&q=80&w=600',
    uploadDate: '2021-01-14',
    status: 'Verified',
    category: 'Education',
    storageBucketUrl: 'gs://ava-foundation-secure-vault/users/AST-DID-9012/anita_msw_degree_tiss.pdf'
  }
];

// Get all documents from storage or initial set
export function getAllDocuments(): UserDocument[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DOCUMENTS));
      return INITIAL_DOCUMENTS;
    }
    return JSON.parse(raw) as UserDocument[];
  } catch (err) {
    console.error('Error reading documents from storage:', err);
    return INITIAL_DOCUMENTS;
  }
}

// Get documents for a specific user ID or email
export function getDocumentsForUser(userIdOrEmail: string): UserDocument[] {
  const allDocs = getAllDocuments();
  if (!userIdOrEmail) return allDocs.filter(d => d.userId === 'AST-VOL-8820');

  const normalized = userIdOrEmail.toLowerCase().trim();
  return allDocs.filter(
    d => d.userId.toLowerCase().trim() === normalized ||
         (d.userEmail && d.userEmail.toLowerCase().trim() === normalized)
  );
}

// Save a new document to storage
export function saveUserDocument(doc: Omit<UserDocument, 'id' | 'uploadDate'> & { id?: string; uploadDate?: string }): UserDocument {
  const allDocs = getAllDocuments();
  const id = doc.id || `DOC-CLOUD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const uploadDate = doc.uploadDate || new Date().toISOString().split('T')[0];
  
  const bucketPath = `gs://ava-foundation-secure-vault/users/${doc.userId}/${doc.fileName.replace(/\s+/g, '_')}`;

  const newDoc: UserDocument = {
    ...doc,
    id,
    uploadDate,
    storageBucketUrl: doc.storageBucketUrl || bucketPath
  };

  const updatedDocs = [newDoc, ...allDocs];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedDocs));

  // Dispatch custom window event so reactive UI components update automatically
  window.dispatchEvent(new CustomEvent('ava_documents_updated', { detail: { userId: doc.userId } }));

  return newDoc;
}

// Batch save documents uploaded during registration form submission
export function saveRegistrationFormDataDocs(
  userId: string,
  userName: string,
  userEmail: string,
  formData: {
    passportPhoto?: string | null;
    identityFrontDocName?: string | null;
    identityBackDocName?: string | null;
    educationDocName?: string | null;
    addressDocName?: string | null;
    identityProofType?: string;
    addressProofType?: string;
  }
): UserDocument[] {
  const created: UserDocument[] = [];

  if (formData.passportPhoto) {
    created.push(saveUserDocument({
      userId,
      userName,
      userEmail,
      documentType: 'passportPhoto',
      documentTypeLabel: 'Passport Photo Headshot',
      fileName: `${userName.replace(/\s+/g, '_')}_passport_photo.png`,
      fileSize: '1.5 MB',
      fileType: 'image/png',
      fileDataUrl: formData.passportPhoto,
      status: 'Under Review',
      category: 'Identity'
    }));
  }

  if (formData.identityFrontDocName) {
    created.push(saveUserDocument({
      userId,
      userName,
      userEmail,
      documentType: 'identityFront',
      documentTypeLabel: `${formData.identityProofType || 'Identity Proof'} (Front)`,
      fileName: formData.identityFrontDocName,
      fileSize: '2.2 MB',
      fileType: formData.identityFrontDocName.endsWith('.pdf') ? 'application/pdf' : 'image/jpeg',
      fileDataUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=600',
      status: 'Under Review',
      category: 'Identity'
    }));
  }

  if (formData.identityBackDocName) {
    created.push(saveUserDocument({
      userId,
      userName,
      userEmail,
      documentType: 'identityBack',
      documentTypeLabel: `${formData.identityProofType || 'Identity Proof'} (Back)`,
      fileName: formData.identityBackDocName,
      fileSize: '2.1 MB',
      fileType: formData.identityBackDocName.endsWith('.pdf') ? 'application/pdf' : 'image/jpeg',
      fileDataUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=600',
      status: 'Under Review',
      category: 'Identity'
    }));
  }

  if (formData.educationDocName) {
    created.push(saveUserDocument({
      userId,
      userName,
      userEmail,
      documentType: 'educationCert',
      documentTypeLabel: 'Education Qualification Certificate',
      fileName: formData.educationDocName,
      fileSize: '3.4 MB',
      fileType: formData.educationDocName.endsWith('.pdf') ? 'application/pdf' : 'image/jpeg',
      fileDataUrl: 'https://images.unsplash.com/photo-1568667256549-094345857637?auto=format&fit=crop&q=80&w=600',
      status: 'Under Review',
      category: 'Education'
    }));
  }

  if (formData.addressDocName) {
    created.push(saveUserDocument({
      userId,
      userName,
      userEmail,
      documentType: 'addressProof',
      documentTypeLabel: `${formData.addressProofType || 'Address Proof'}`,
      fileName: formData.addressDocName,
      fileSize: '1.9 MB',
      fileType: formData.addressDocName.endsWith('.pdf') ? 'application/pdf' : 'image/jpeg',
      fileDataUrl: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&q=80&w=600',
      status: 'Under Review',
      category: 'Address'
    }));
  }

  return created;
}

// Update document verification status
export function updateDocumentStatus(
  docId: string,
  status: UserDocument['status'],
  remarks?: string
): void {
  const allDocs = getAllDocuments();
  const updated = allDocs.map(d => {
    if (d.id === docId) {
      return { ...d, status, remarks: remarks || d.remarks };
    }
    return d;
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent('ava_documents_updated', { detail: { docId } }));
}

// Delete a document from storage
export function deleteUserDocument(docId: string): void {
  const allDocs = getAllDocuments();
  const filtered = allDocs.filter(d => d.id !== docId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  window.dispatchEvent(new CustomEvent('ava_documents_updated', { detail: { docId } }));
}
