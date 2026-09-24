import { 
  ScalyInstrument, 
  OfficerProfile, 
  BusinessProfile, 
  GATCProfile, 
  CitizenGrievance, 
  StampingRecord, 
  GATCEndorsement,
  ReVerificationApplication,
  CredentialedUser
} from '../types/scaly';

export const CREDENTIALED_USERS_CSV_RAW = `id,password,role,name,division,jurisdictionStatus,organization,phone,email,tradeLicense
BIZ-MH-884,apex@2026,business,Kunal Parekh,Mumbai Central Sub-Division,Licensed Commercial Trader • Valid Tax Registration,Apex Logistics & Warehousing Ltd.,+91 98203 11984,k.parekh@apexlogistics.in,TL-MH-MUM-449102
BIZ-DL-112,kisan@2026,business,Harpreet Singh,Delhi North Sub-Division,Licensed Commercial Trader • Mandi APMC Operator,Kisan Grain Mandi Traders,+91 98101 22849,h.singh@kisanmandi.in,TL-DL-AZP-882190
BIZ-KA-501,indianoil@2026,business,Naveen Kumar,Bengaluru South Division,Licensed Commercial Trader • Petroleum Retail Hub,Indian Oil Retail Hub,+91 94480 33412,n.kumar@ioretail.in,TL-KA-BLR-001924
LM-88219,lmo@88219,lmo,Rajesh Sharma,Mumbai Central Sub-Division,Active Commissioned Inspector,Directorate of Legal Metrology Govt of India,+91 98201 44102,r.sharma@lm.mh.gov.in,
LM-64112,lmo@64112,lmo,Ananya Rao,Bengaluru South Division,Active Commissioned Inspector,Directorate of Legal Metrology Govt of India,+91 94481 99203,a.rao@lm.ka.gov.in,
GATC-W-01,gatc@2026,gatc,Dr. Arvind Joshi,Mumbai / Western Zone,NABL Accredited Testing Facility • Valid Until 2028,National Metrology Test Lab,+91 98200 44211,a.joshi@nmtl.gov.in,
GATC-S-04,gatc@2026,gatc,Dr. Priya Sundaram,Bengaluru / Southern Zone,NABL Accredited Testing Facility • Valid Until 2027,Apex Calibration Services,+91 94488 12399,p.sundaram@apexcal.in,
ADMIN-HQ-01,admin@hq,admin,State Metrology Directorate,Apex State Enforcement Command,Statewide Oversight & Statutory Enforcement Authority,Department of Consumer Affairs • Legal Metrology Division,+91 11 2338 0001,director@lm.gov.in,`;

export const INSTRUMENTS_CSV_RAW = `id,type,makeModel,ownerId,ownerName,status,lastVerifiedDate,nextDueDate,lmoOfficerBadge,leadSealNumber,mpeToleranceGrams,patternApprovalRef
IND-MH-2024-WB-0921,Weighbridge (60 MT Pitless),Avery Weigh-Tronix E-1205,BIZ-MH-884,Apex Logistics & Warehousing,VALID,2026-02-10,2027-02-09,LM-88219,SEAL-MH-9941,100,IND-PA-2021-WB99
IND-DL-2023-CS-1104,Commercial Bench Scale (Class III),Essae DS-852,BIZ-DL-112,Kisan Grain Mandi Traders,EXPIRING_SOON,2025-10-15,2026-10-14,LM-33410,SEAL-DL-4122,2,IND-PA-2019-CS41
IND-KA-2023-FD-5520,Fuel Dispenser (Multi-Nozzle),Tokheim Quantium,BIZ-KA-501,Indian Oil Retail Hub,VALID,2026-05-18,2027-05-17,LM-64112,SEAL-KA-8819,15,IND-PA-2022-FD03
IND-MH-2022-GM-3001,Grain Moisture Meter,AgroTech Pro-10,BIZ-MH-884,Apex Logistics & Warehousing,SEAL_BROKEN,2024-11-04,2025-11-03,LM-88219,SEAL-MH-0012,0.5,IND-PA-2020-GM11
IND-WB-2024-PS-7719,Analytical Balance (Class II),Mettler Toledo ME-T,BIZ-WB-909,Bengal Pharma Testing,PENDING_GATC,2025-08-01,2026-08-01,LM-11029,SEAL-WB-7721,0.01,IND-PA-2023-PS88`;

export const OFFICERS_CSV_RAW = `badge,name,division,phone,email,jurisdictionStatus
LM-88219,Rajesh Sharma,Mumbai Central Sub-Division,+91 98201 44102,r.sharma@lm.mh.gov.in,Active Commissioned Inspector
LM-64112,Ananya Rao,Bengaluru South Division,+91 94481 99203,a.rao@lm.ka.gov.in,Active Commissioned Inspector
LM-33410,Vikramaditya Singh,Delhi North Division,+91 98112 55901,v.singh@lm.dl.gov.in,Active Commissioned Inspector
LM-11029,Sourav Ganguly,Kolkata Port Sub-Division,+91 98300 12093,s.ganguly@lm.wb.gov.in,Active Commissioned Inspector`;

export const BUSINESSES_CSV_RAW = `id,name,tradeLicense,district,state,contactPerson,phone,assignedOfficerBadge
BIZ-MH-884,Apex Logistics & Warehousing Ltd.,TL-MH-MUM-449102,Mumbai Central,Maharashtra,Kunal Parekh,+91 98203 11984,LM-88219
BIZ-DL-112,Kisan Grain Mandi Traders,TL-DL-AZP-882190,Delhi North,Delhi,Harpreet Singh,+91 98101 22849,LM-33410
BIZ-KA-501,Indian Oil Retail Hub,TL-KA-BLR-001924,Bengaluru South,Karnataka,Naveen Kumar,+91 94480 33412,LM-64112
BIZ-WB-909,Bengal Pharma Testing,TL-WB-KOL-771203,Kolkata Port,West Bengal,Dr. Debabrata Roy,+91 98310 99201,LM-11029`;

export const GATC_CSV_RAW = `id,name,accreditationNo,region,validUntil,leadScientist
GATC-W-01,National Metrology Test Lab,NABL-CC-2101,Mumbai / Western Zone,2028-12-31,Dr. Arvind Joshi
GATC-S-04,Apex Calibration Services,NABL-CC-3944,Bengaluru / Southern Zone,2027-06-30,Dr. Priya Sundaram
GATC-N-02,Bharat Precision Metrology Lab,NABL-CC-1188,Delhi / Northern Zone,2029-03-31,Dr. Sandeep Malik`;

export const GRIEVANCES_CSV_RAW = `id,instrumentId,timestamp,citizenName,citizenPhone,issueType,description,latitude,longitude,photoAttached,status
GRV-2026-901,IND-MH-2022-GM-3001,2026-08-15 14:30,Sunil Joshi,+91 98200 88123,tampered_seal,Lead seal wire appears cut and scale reads 4% high on grain delivery,18.9750,72.8258,true,INVESTIGATION_DISPATCHED
GRV-2026-902,IND-DL-2023-CS-1104,2026-09-02 11:15,Ravi Verma,+91 98110 33441,underweight,Vendor scale zeroed with +15g tare weight discrepancy on platform,28.7041,77.1025,false,PENDING_REVIEW`;

export const STAMPING_RECORDS_RAW = `id,instrumentId,timestamp,officerBadge,standardLoad,observedLoad,delta,mpeLimit,result,sealCheck,newSealNumber,notes
STP-2026-101,IND-MH-2024-WB-0921,2026-02-10 11:30,LM-88219,10000,10020,20,100,PASS,INTACT,SEAL-MH-9941,Corner loading within MPE. Lead wire seal locked.
STP-2025-884,IND-DL-2023-CS-1104,2025-10-15 15:45,LM-33410,20,20.001,0.001,2,PASS,INTACT,SEAL-DL-4122,Retail Class III verification complete.
STP-2026-402,IND-KA-2023-FD-5520,2026-05-18 10:20,LM-64112,5000,5008,8,15,PASS,INTACT,SEAL-KA-8819,5-litre brass measure check passed.`;

export const GATC_ENDORSEMENTS_RAW = `id,instrumentId,labId,testDate,zeroLoadDeviation,eccentricityDeviation,repeatabilityScore,verdict,certificateRef,notes
GTC-2025-104,IND-WB-2024-PS-7719,GATC-W-01,2025-08-01,0.001,0.002,0.0008,APPROVED,NABL-CERT-WB-9902,Analytical Class II precision meets IS 9281.`;

// Zero-dependency, robust CSV Parser
export function parseCSV(csvText: string): Record<string, string>[] {
  const lines = csvText.trim().split(/\r?\n/);
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map(h => h.trim());
  const results: Record<string, string>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Parse respecting comma separators
    const values: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let charIdx = 0; charIdx < line.length; charIdx++) {
      const char = line[charIdx];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim());

    const obj: Record<string, string> = {};
    headers.forEach((header, index) => {
      let val = values[index] !== undefined ? values[index] : '';
      if (val.startsWith('"') && val.endsWith('"')) {
        val = val.slice(1, -1);
      }
      obj[header] = val;
    });
    results.push(obj);
  }

  return results;
}

// Zero-dependency CSV Serializer
export function serializeCSV<T extends Record<string, any>>(headers: string[], rows: T[]): string {
  const headerLine = headers.join(',');
  const rowLines = rows.map(row => {
    return headers.map(header => {
      const val = row[header] !== undefined && row[header] !== null ? String(row[header]) : '';
      if (val.includes(',') || val.includes('"') || val.includes('\n')) {
        return `"${val.replace(/"/g, '""')}"`;
      }
      return val;
    }).join(',');
  });

  return [headerLine, ...rowLines].join('\n');
}

// Synchronous loader for instruments from CSV
export function loadInstrumentsFromCSV(csvText: string = INSTRUMENTS_CSV_RAW): ScalyInstrument[] {
  const rawRows = parseCSV(csvText);
  return rawRows.map(row => {
    // Enrich with specifications based on type
    const isWb = row.type.toLowerCase().includes('weighbridge');
    const isFuel = row.type.toLowerCase().includes('fuel');
    const isBalance = row.type.toLowerCase().includes('balance');
    const isMoisture = row.type.toLowerCase().includes('moisture');

    const accuracyClass = isWb 
      ? 'Class III (Commercial Medium)' 
      : isBalance 
      ? 'Class II (Precision High)' 
      : isFuel 
      ? 'Class 0.5 (Liquid Flow)' 
      : isMoisture 
      ? 'Class B (Grain Agrotechnical)' 
      : 'Class III (Commercial Standard)';

    const capacity = isWb 
      ? '60,000 kg (60 MT)' 
      : isBalance 
      ? '220 g (d = 0.001 g)' 
      : isFuel 
      ? '50 L/min' 
      : isMoisture 
      ? '5% - 40% Moisture' 
      : '30 kg (e = 2 g)';

    const serialNumber = `SN-${row.id.split('-').slice(-2).join('-')}-OEM`;

    let certificate: ScalyInstrument['certificate'] = undefined;
    if (row.id === 'IND-MH-2024-WB-0921') {
      certificate = {
        certificateNumber: 'CERT-LM-2026-MH-99412',
        instrumentId: 'IND-MH-2024-WB-0921',
        instrumentType: 'Weighbridge (60 MT Pitless)',
        makeModel: 'Avery Weigh-Tronix E-1205',
        ownerName: 'Apex Logistics & Warehousing Ltd.',
        ownerId: 'BIZ-MH-884',
        verificationDate: '2026-02-10',
        nextDueDate: '2027-02-09',
        validityPeriod: '1 Year (Mandatory Statutory Re-Verification)',
        officerName: 'Rajesh Sharma',
        officerBadge: 'LM-88219',
        jurisdiction: 'Mumbai Central Sub-Division, Maharashtra',
        sealNumber: 'SEAL-MH-9941',
        accuracyClass,
        capacity,
        mpeTolerance: '±100 grams',
        issuedAt: '2026-02-10T11:45:00Z',
        qrPayload: 'IND-MH-2024-WB-0921',
      };
    } else if (row.id === 'IND-KA-2023-FD-5520') {
      certificate = {
        certificateNumber: 'CERT-LM-2026-KA-88190',
        instrumentId: 'IND-KA-2023-FD-5520',
        instrumentType: 'Fuel Dispenser (Multi-Nozzle)',
        makeModel: 'Tokheim Quantium',
        ownerName: 'Indian Oil Retail Hub',
        ownerId: 'BIZ-KA-501',
        verificationDate: '2026-05-18',
        nextDueDate: '2027-05-17',
        validityPeriod: '1 Year (Mandatory Statutory Re-Verification)',
        officerName: 'Ananya Rao',
        officerBadge: 'LM-64112',
        jurisdiction: 'Bengaluru South Division, Karnataka',
        sealNumber: 'SEAL-KA-8819',
        accuracyClass,
        capacity,
        mpeTolerance: '±15 grams',
        issuedAt: '2026-05-18T10:30:00Z',
        qrPayload: 'IND-KA-2023-FD-5520',
      };
    }

    return {
      id: row.id,
      type: row.type,
      makeModel: row.makeModel,
      ownerId: row.ownerId,
      ownerName: row.ownerName,
      status: row.status as ScalyInstrument['status'],
      lastVerifiedDate: row.lastVerifiedDate,
      nextDueDate: row.nextDueDate,
      lmoOfficerBadge: row.lmoOfficerBadge,
      leadSealNumber: row.leadSealNumber,
      mpeToleranceGrams: parseFloat(row.mpeToleranceGrams) || 0,
      patternApprovalRef: row.patternApprovalRef,
      accuracyClass,
      capacity,
      location: row.ownerId === 'BIZ-MH-884' 
        ? 'Mumbai Central Logistics Hub, Maharashtra' 
        : row.ownerId === 'BIZ-DL-112' 
        ? 'Azadpur APMC Mandi, Delhi' 
        : row.ownerId === 'BIZ-KA-501' 
        ? 'Outer Ring Road Terminal, Bengaluru' 
        : 'Salt Lake Sector V Lab, Kolkata',
      serialNumber,
      certificate,
    };
  });
}

// Synchronous loader for officers from CSV
export function loadOfficersFromCSV(csvText: string = OFFICERS_CSV_RAW): OfficerProfile[] {
  const rawRows = parseCSV(csvText);
  return rawRows.map(row => ({
    badge: row.badge,
    name: row.name,
    division: row.division,
    phone: row.phone,
    email: row.email,
    jurisdictionStatus: row.jurisdictionStatus,
  }));
}

// Synchronous loader for businesses from CSV
export function loadBusinessesFromCSV(csvText: string = BUSINESSES_CSV_RAW): BusinessProfile[] {
  const rawRows = parseCSV(csvText);
  return rawRows.map(row => ({
    id: row.id,
    name: row.name,
    tradeLicense: row.tradeLicense,
    district: row.district,
    state: row.state,
    contactPerson: row.contactPerson,
    phone: row.phone,
    assignedOfficerBadge: row.assignedOfficerBadge,
  }));
}

// Synchronous loader for GATC from CSV
export function loadGATCsFromCSV(csvText: string = GATC_CSV_RAW): GATCProfile[] {
  const rawRows = parseCSV(csvText);
  return rawRows.map(row => ({
    id: row.id,
    name: row.name,
    accreditationNo: row.accreditationNo,
    region: row.region,
    validUntil: row.validUntil,
    leadScientist: row.leadScientist,
  }));
}

// Synchronous loader for grievances from CSV
export function loadGrievancesFromCSV(csvText: string = GRIEVANCES_CSV_RAW): CitizenGrievance[] {
  const rawRows = parseCSV(csvText);
  return rawRows.map(row => ({
    id: row.id,
    instrumentId: row.instrumentId,
    timestamp: row.timestamp,
    citizenName: row.citizenName,
    citizenPhone: row.citizenPhone,
    issueType: row.issueType as CitizenGrievance['issueType'],
    description: row.description,
    latitude: row.latitude ? parseFloat(row.latitude) : undefined,
    longitude: row.longitude ? parseFloat(row.longitude) : undefined,
    photoAttached: row.photoAttached === 'true',
    status: row.status as CitizenGrievance['status'],
  }));
}

// Synchronous loader for stamping records from CSV
export function loadStampingRecordsFromCSV(csvText: string = STAMPING_RECORDS_RAW): StampingRecord[] {
  const rawRows = parseCSV(csvText);
  return rawRows.map(row => ({
    id: row.id,
    instrumentId: row.instrumentId,
    timestamp: row.timestamp,
    officerBadge: row.officerBadge,
    standardLoad: parseFloat(row.standardLoad) || 0,
    observedLoad: parseFloat(row.observedLoad) || 0,
    delta: parseFloat(row.delta) || 0,
    mpeLimit: parseFloat(row.mpeLimit) || 0,
    result: row.result as 'PASS' | 'FAIL',
    sealCheck: row.sealCheck as 'INTACT' | 'DAMAGED_TAMPERED',
    newSealNumber: row.newSealNumber,
    notes: row.notes,
  }));
}

// Synchronous loader for GATC endorsements from CSV
export function loadGATCEndorsementsFromCSV(csvText: string = GATC_ENDORSEMENTS_RAW): GATCEndorsement[] {
  const rawRows = parseCSV(csvText);
  return rawRows.map(row => ({
    id: row.id,
    instrumentId: row.instrumentId,
    labId: row.labId,
    testDate: row.testDate,
    zeroLoadDeviation: parseFloat(row.zeroLoadDeviation) || 0,
    eccentricityDeviation: parseFloat(row.eccentricityDeviation) || 0,
    repeatabilityScore: parseFloat(row.repeatabilityScore) || 0,
    verdict: row.verdict as 'APPROVED' | 'REJECTED',
    certificateRef: row.certificateRef,
    notes: row.notes,
  }));
}

// Synchronous loader for Credentialed Users from CSV
export function loadCredentialedUsersFromCSV(csvText: string = CREDENTIALED_USERS_CSV_RAW): CredentialedUser[] {
  const rawRows = parseCSV(csvText);
  return rawRows.map(row => ({
    id: row.id,
    password: row.password,
    role: row.role as CredentialedUser['role'],
    name: row.name,
    division: row.division,
    jurisdictionStatus: row.jurisdictionStatus,
    organization: row.organization || undefined,
    phone: row.phone || undefined,
    email: row.email || undefined,
    tradeLicense: row.tradeLicense || undefined,
  }));
}

// Audio Feedback Synthesizer using Web Audio API
export function playScanBeep(): void {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    
    // Quick dual-frequency high-tech GovTech verification chime (880Hz -> 1760Hz)
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.09);
    
    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.14);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.14);
  } catch (e) {
    // Non-blocking fallback
    console.debug('Web Audio API notification skipped:', e);
  }
}
