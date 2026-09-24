/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  CurrentUser, 
  ScalyInstrument, 
  CitizenGrievance, 
  StampingRecord, 
  GATCEndorsement, 
  ReVerificationApplication 
} from './types/scaly';
import { 
  loadInstrumentsFromCSV, 
  loadOfficersFromCSV, 
  loadBusinessesFromCSV, 
  loadGATCsFromCSV, 
  loadGrievancesFromCSV, 
  loadStampingRecordsFromCSV, 
  loadGATCEndorsementsFromCSV,
  loadCredentialedUsersFromCSV 
} from './data/csvDatabase';
import { OnboardingGateway } from './components/OnboardingGateway';
import { TopTaskbar } from './components/TopTaskbar';
import { ProfileDrawer } from './components/ProfileDrawer';
import { CameraScannerModal } from './components/CameraScannerModal';
import { CitizenView } from './components/views/CitizenView';
import { BusinessView } from './components/views/BusinessView';
import { LMOView } from './components/views/LMOView';
import { GATCView } from './components/views/GATCView';
import { AdminView } from './components/views/AdminView';

export default function App() {
  // 1. Mandatory First-Time Onboarding Gate: currentUser defaults to null
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

  // Synchronously parsed CSV Database in memory (Zero external dependencies)
  const [instruments, setInstruments] = useState<ScalyInstrument[]>(() => loadInstrumentsFromCSV());
  const [officers] = useState(() => loadOfficersFromCSV());
  const [businesses] = useState(() => loadBusinessesFromCSV());
  const [gatcs] = useState(() => loadGATCsFromCSV());
  const [credentialedUsers] = useState(() => loadCredentialedUsersFromCSV());
  const [grievances, setGrievances] = useState<CitizenGrievance[]>(() => loadGrievancesFromCSV());
  const [stampingRecords, setStampingRecords] = useState<StampingRecord[]>(() => loadStampingRecordsFromCSV());
  const [endorsements, setEndorsements] = useState<GATCEndorsement[]>(() => loadGATCEndorsementsFromCSV());
  const [applications, setApplications] = useState<ReVerificationApplication[]>([]);

  // Currently focused instrument (resolved via QR scan or selection)
  const [selectedInstrumentId, setSelectedInstrumentId] = useState<string>('IND-MH-2024-WB-0921');

  // Modals & Drawers state
  const [isProfileDrawerOpen, setIsProfileDrawerOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  // Active instrument object
  const currentInstrument = instruments.find(i => i.id === selectedInstrumentId) || instruments[0] || null;

  // Sign out / Switch Profile handler (clears session and returns cleanly to Onboarding Gate)
  const handleSignOut = () => {
    setCurrentUser(null);
    setIsProfileDrawerOpen(false);
  };

  // QR Scan resolution handler
  const handleSelectInstrument = (instId: string) => {
    setSelectedInstrumentId(instId);
  };

  // Citizen Grievance Submission
  const handleSubmitGrievance = (newGrievance: CitizenGrievance) => {
    setGrievances(prev => [newGrievance, ...prev]);
  };

  // Business Re-Verification Application Submission
  const handleSubmitApplication = (newApp: ReVerificationApplication) => {
    setApplications(prev => [newApp, ...prev]);
  };

  // LMO Field Inspection Commit
  const handleCommitInspection = (
    updatedInstrument: ScalyInstrument, 
    stampingRecord: StampingRecord
  ) => {
    setInstruments(prev => 
      prev.map(i => i.id === updatedInstrument.id ? updatedInstrument : i)
    );
    setStampingRecords(prev => [stampingRecord, ...prev]);
  };

  // GATC Laboratory Endorsement Commit
  const handleSubmitEndorsement = (
    updatedInstrument: ScalyInstrument, 
    endorsement: GATCEndorsement
  ) => {
    setInstruments(prev => 
      prev.map(i => i.id === updatedInstrument.id ? updatedInstrument : i)
    );
    setEndorsements(prev => [endorsement, ...prev]);
  };

  // Admin Grievance Resolution
  const handleResolveGrievance = (grievanceId: string) => {
    setGrievances(prev => 
      prev.map(g => g.id === grievanceId ? { ...g, status: 'ACTION_TAKEN' } : g)
    );
  };

  // 1. Mandatory Entry Gate: If currentUser is null, display Onboarding Gateway
  if (!currentUser) {
    return (
      <OnboardingGateway
        credentialedUsers={credentialedUsers}
        onInitializeSession={(user, openScannerImmediately) => {
          setCurrentUser(user);
          if (openScannerImmediately) {
            setIsScannerOpen(true);
          }
        }}
      />
    );
  }

  // 2. Authenticated Dashboard with Uncluttered Taskbar & Scoped View
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-800 antialiased selection:bg-blue-200">
      {/* Uncluttered Taskbar: Circular Emblem (Left), Brand + Division Pill (Center), [Scan QR] (Right) */}
      <TopTaskbar
        currentUser={currentUser}
        onOpenProfileDrawer={() => setIsProfileDrawerOpen(true)}
        onOpenScanner={() => setIsScannerOpen(true)}
      />

      {/* Main Content Area: Strictly Scoped by Role */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        {currentUser.role === 'citizen' && (
          <CitizenView
            currentInstrument={currentInstrument}
            officers={officers}
            onOpenScanner={() => setIsScannerOpen(true)}
            onSubmitGrievance={handleSubmitGrievance}
            onSelectInstrument={handleSelectInstrument}
            allInstruments={instruments}
          />
        )}

        {currentUser.role === 'business' && (
          <BusinessView
            currentUser={currentUser}
            instruments={instruments}
            currentInstrument={currentInstrument}
            officers={officers}
            onSelectInstrument={handleSelectInstrument}
            onOpenScanner={() => setIsScannerOpen(true)}
            onSubmitApplication={handleSubmitApplication}
          />
        )}

        {currentUser.role === 'lmo' && (
          <LMOView
            currentUser={currentUser}
            instruments={instruments}
            currentInstrument={currentInstrument}
            stampingRecords={stampingRecords}
            grievances={grievances}
            onSelectInstrument={handleSelectInstrument}
            onOpenScanner={() => setIsScannerOpen(true)}
            onCommitInspection={handleCommitInspection}
          />
        )}

        {currentUser.role === 'gatc' && (
          <GATCView
            currentUser={currentUser}
            instruments={instruments}
            currentInstrument={currentInstrument}
            endorsements={endorsements}
            onSelectInstrument={handleSelectInstrument}
            onOpenScanner={() => setIsScannerOpen(true)}
            onSubmitEndorsement={handleSubmitEndorsement}
          />
        )}

        {currentUser.role === 'admin' && (
          <AdminView
            currentUser={currentUser}
            instruments={instruments}
            grievances={grievances}
            officers={officers}
            onSelectInstrument={handleSelectInstrument}
            onOpenScanner={() => setIsScannerOpen(true)}
            onResolveGrievance={handleResolveGrievance}
          />
        )}
      </main>

      {/* Profile Slide-Over / Drawer (Opened from Top-Left Circular Emblem) */}
      <ProfileDrawer
        isOpen={isProfileDrawerOpen}
        onClose={() => setIsProfileDrawerOpen(false)}
        currentUser={currentUser}
        onSignOut={handleSignOut}
        onOpenScanner={() => {
          setIsProfileDrawerOpen(false);
          setIsScannerOpen(true);
        }}
      />

      {/* Real Hardware Camera QR Scanner with 5 Pre-Embedded Quick-Chips & Audio Synthesizer */}
      <CameraScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        instruments={instruments}
        onSelectInstrument={handleSelectInstrument}
      />
    </div>
  );
}
