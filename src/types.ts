export type ViewMode = 
  | 'home'
  | 'join-community'
  | 'registration'
  | 'donate'
  | 'admin-dashboard'
  | 'admin-users'
  | 'admin-doc-generator'
  | 'admin-application-review'
  | 'admin-applications'
  | 'admin-user-profile'
  | 'admin-donations'
  | 'admin-certificates'
  | 'admin-gallery'
  | 'admin-partners'
  | 'admin-legal'
  | 'admin-reports'
  | 'admin-audit'
  | 'admin-settings'
  | 'admin-help'
  | 'admin-cms'
  | 'user-dashboard'
  | 'user-certificates';

export type RoleType = 'didi' | 'maa' | 'teacher' | 'student' | 'coordinator';

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  role: string;
  location: string;
  registrationDate: string;
  status: 'Active' | 'Pending' | 'Inactive';
  avatar?: string;
  phone?: string;
  dob?: string;
  bloodGroup?: string;
  validUntil?: string;
  qualification?: string;
  organization?: string;
  department?: string;
  lastActive?: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  category: 'Education' | 'Health' | 'Environment' | 'Community';
  description: string;
  raised: number;
  goal: number;
  image: string;
  status: 'Active' | 'Completed';
}

export interface ActivityItem {
  id: string;
  title: string;
  time: string;
  type: 'volunteer' | 'donation' | 'project' | 'status';
  icon: string;
}

export interface ApplicationStatus {
  id: string;
  applicantName: string;
  role: string;
  submittedDate: string;
  status: 'Under Review' | 'Approved' | 'Action Required' | 'Rejected';
  stepCompleted: number;
  totalSteps: number;
  remarks?: string;
}

export interface RegistrationFormData {
  role: RoleType;
  fullName: string;
  fatherHusbandName?: string;
  dob: string;
  gender: string;
  phone: string;
  email: string;
  address: string;
  communicationAddress?: string;
  districtName?: string;
  blockName?: string;
  passportPhoto: string | null;
  qualification: string;
  computerExperience?: string;
  fieldOfStudy: string;
  institution: string;
  completionYear: string;
  skills: string[];
  languages: string[];
  experienceYears: string;
  organization: string;
  designation: string;
  responsibilities: string;
  volunteeringInterests: string[];
  availability: string;
  identityProofType: string;
  identityDocName: string | null;
  identityFrontDocName?: string | null;
  identityBackDocName?: string | null;
  addressProofType?: string;
  addressDocName?: string | null;
  accountDetails?: string;
  emergencyContact?: string;
  referenceName?: string;
  termsAccepted?: boolean;
}
