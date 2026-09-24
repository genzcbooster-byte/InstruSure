export type ScalyRole = 'citizen' | 'business' | 'lmo' | 'gatc' | 'admin';

export interface CurrentUser {
  role: ScalyRole;
  name: string;
  idOrBadge: string;
  division: string;
  jurisdictionStatus: string;
  organization?: string;
  phone?: string;
  email?: string;
  sessionToken?: string;
}

export interface CredentialedUser {
  id: string;
  password: string;
  role: 'business' | 'lmo' | 'gatc' | 'admin';
  name: string;
  division: string;
  jurisdictionStatus: string;
  organization?: string;
  phone?: string;
  email?: string;
  tradeLicense?: string;
}

export type InstrumentStatus = 
  | 'VALID' 
  | 'EXPIRING_SOON' 
  | 'SEAL_BROKEN' 
  | 'PENDING_GATC' 
  | 'EXPIRED' 
  | 'REJECTED' 
  | 'GATC_APPROVED';

export interface DigitalCertificate {
  certificateNumber: string;
  instrumentId: string;
  instrumentType: string;
  makeModel: string;
  ownerName: string;
  ownerId?: string;
  verificationDate: string;
  nextDueDate: string;
  validityPeriod: string;
  officerName: string;
  officerBadge: string;
  jurisdiction: string;
  sealNumber: string;
  accuracyClass?: string;
  capacity?: string;
  mpeTolerance?: string;
  issuedAt: string;
  qrPayload: string;
}

export interface ScalyInstrument {
  id: string;
  type: string;
  makeModel: string;
  ownerId: string;
  ownerName: string;
  status: InstrumentStatus;
  lastVerifiedDate: string;
  nextDueDate: string;
  lmoOfficerBadge: string;
  leadSealNumber: string;
  mpeToleranceGrams: number;
  patternApprovalRef: string;
  accuracyClass?: string;
  capacity?: string;
  location?: string;
  serialNumber?: string;
  certificate?: DigitalCertificate;
}

export interface OfficerProfile {
  badge: string;
  name: string;
  division: string;
  phone: string;
  email: string;
  jurisdictionStatus: string;
}

export interface BusinessProfile {
  id: string;
  name: string;
  tradeLicense: string;
  district: string;
  state: string;
  contactPerson: string;
  phone: string;
  assignedOfficerBadge: string;
}

export interface GATCProfile {
  id: string;
  name: string;
  accreditationNo: string;
  region: string;
  validUntil: string;
  leadScientist: string;
}

export interface CitizenGrievance {
  id: string;
  instrumentId: string;
  timestamp: string;
  citizenName: string;
  citizenPhone?: string;
  issueType: 'underweight' | 'tampered_seal' | 'expired_verification' | 'refused_receipt' | 'faulty_display';
  description: string;
  latitude?: number;
  longitude?: number;
  photoAttached?: boolean;
  status: 'PENDING_REVIEW' | 'INVESTIGATION_DISPATCHED' | 'ACTION_TAKEN' | 'DISMISSED';
}

export interface StampingRecord {
  id: string;
  instrumentId: string;
  timestamp: string;
  officerBadge: string;
  standardLoad: number;
  observedLoad: number;
  delta: number;
  mpeLimit: number;
  result: 'PASS' | 'FAIL';
  sealCheck: 'INTACT' | 'DAMAGED_TAMPERED';
  newSealNumber?: string;
  notes: string;
}

export interface GATCEndorsement {
  id: string;
  instrumentId: string;
  labId: string;
  testDate: string;
  zeroLoadDeviation: number;
  eccentricityDeviation: number;
  repeatabilityScore: number;
  verdict: 'APPROVED' | 'REJECTED';
  certificateRef: string;
  notes: string;
}

export interface ReVerificationApplication {
  id: string;
  instrumentId: string;
  businessId: string;
  businessName: string;
  appliedDate: string;
  feeAmount: number;
  transactionRef: string;
  preferredInspectionDate: string;
  status: 'SUBMITTED' | 'LMO_DISPATCHED' | 'COMPLETED';
}
