export type InstrumentRole = 'citizen' | 'business' | 'lmo' | 'gatc' | 'admin';

export type CertificateStatus = 'valid' | 'expiring' | 'expired' | 'revoked';

export type InstrumentCategory = 
  | 'Weighbridge'
  | 'Fuel Dispenser'
  | 'Electronic Retail Scale'
  | 'Precision Balance'
  | 'Moisture Meter'
  | 'Automatic Packaging Scale'
  | 'Flow Meter';

export interface LifecycleEvent {
  id: string;
  timestamp: string;
  type: 
    | 'registration' 
    | 'model_approval' 
    | 'initial_verification' 
    | 're_verification' 
    | 'field_inspection' 
    | 'gatc_test' 
    | 'complaint_investigation' 
    | 'seal_renewal';
  title: string;
  performedBy: string;
  role: string;
  location: string;
  status: 'passed' | 'failed' | 'warning' | 'info';
  notes: string;
  certificateNo?: string;
  sealNumber?: string;
}

export interface Instrument {
  id: string; // e.g. IN-DL-WB-2024-8841
  qrCodePayload: string;
  type: InstrumentCategory;
  name: string;
  modelNumber: string;
  serialNumber: string;
  manufacturer: string;
  capacity: string;
  accuracyClass: 'Class I' | 'Class II' | 'Class III' | 'Class IV' | 'Standard';
  owner: {
    id: string;
    name: string;
    businessName: string;
    gstinOrReg: string;
    contactPhone: string;
    email: string;
    address: string;
    district: string;
    state: string;
  };
  location: {
    siteName: string;
    address: string;
    district: string;
    state: string;
    gpsCoordinates?: string;
  };
  status: CertificateStatus;
  certificateNo: string;
  lastVerifiedDate: string;
  nextDueDate: string;
  leadSealNumber: string;
  assignedLMO: string;
  assignedGATC?: string;
  specifications: Record<string, string>;
  history: LifecycleEvent[];
}

export interface ReVerificationApplication {
  id: string;
  instrumentId: string;
  instrumentType: InstrumentCategory;
  businessName: string;
  appliedDate: string;
  preferredDate: string;
  verificationType: 'periodic' | 'post_repair' | 'initial';
  status: 'submitted' | 'under_review' | 'lmo_assigned' | 'inspection_scheduled' | 'completed' | 'rejected';
  feePaid: number;
  transactionRef: string;
  lmoOfficer?: string;
  notes?: string;
}

export interface CitizenComplaint {
  id: string;
  instrumentId: string;
  instrumentType: InstrumentCategory;
  siteName: string;
  district: string;
  reportedDate: string;
  complaintType: 'underweight' | 'tampered_seal' | 'expired_verification' | 'refused_receipt' | 'faulty_display';
  description: string;
  citizenName?: string;
  citizenPhone?: string;
  citizenEmail?: string;
  status: 'pending' | 'assigned_to_lmo' | 'investigated' | 'action_taken' | 'dismissed';
  resolutionNotes?: string;
  lmoAssigned?: string;
}

export interface OfficerFindingForm {
  instrumentId: string;
  inspectionDate: string;
  officerName: string;
  officerBadge: string;
  result: 'pass' | 'fail' | 'notice';
  errorPercentage: number;
  sealIntact: boolean;
  newSealNumber?: string;
  remarks: string;
  nextDueMonths: number;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'warning' | 'info' | 'success' | 'alert';
  roleTarget: InstrumentRole[];
  read: boolean;
  linkInstrumentId?: string;
}
