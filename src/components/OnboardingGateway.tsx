import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Building2, 
  UserCheck, 
  FlaskConical, 
  ShieldAlert, 
  CheckCircle2, 
  ArrowRight,
  Scale,
  Camera,
  AlertCircle,
  KeyRound,
  HelpCircle,
  Lock,
  User,
  Sparkles
} from 'lucide-react';
import { ScalyRole, CurrentUser, CredentialedUser } from '../types/scaly';
import { loadCredentialedUsersFromCSV } from '../data/csvDatabase';

interface OnboardingGatewayProps {
  onInitializeSession: (user: CurrentUser, openScannerImmediately?: boolean) => void;
  credentialedUsers?: CredentialedUser[];
}

export const OnboardingGateway: React.FC<OnboardingGatewayProps> = ({
  onInitializeSession,
  credentialedUsers: propUsers,
}) => {
  const [selectedRole, setSelectedRole] = useState<ScalyRole>('citizen');

  // Load credentialed users from CSV database if not passed as prop
  const credentialedUsers = propUsers || loadCredentialedUsersFromCSV();

  // Shared Login Form State (for roles 2-5: business, lmo, gatc, admin)
  const [userIdInput, setUserIdInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [showForgotNotice, setShowForgotNotice] = useState(false);

  // Role metadata descriptors
  const roleDescriptions: Record<ScalyRole, { title: string; desc: string; icon: React.ReactNode; color: string }> = {
    citizen: {
      title: 'Citizen / Public Consumer',
      desc: 'Transparent consumer trust; instant 1-click verification access without bureaucracy.',
      icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
      color: 'border-emerald-500/40 bg-emerald-950/20 text-emerald-300',
    },
    business: {
      title: 'Business / Instrument Owner',
      desc: 'Traders, APMC yard operators, petrol pump franchisees managing legal compliance.',
      icon: <Building2 className="w-5 h-5 text-blue-400" />,
      color: 'border-blue-500/40 bg-blue-950/20 text-blue-300',
    },
    lmo: {
      title: 'LMO (Legal Metrology Officer)',
      desc: 'Government field inspection, statutory verification, and digital stamping officers.',
      icon: <UserCheck className="w-5 h-5 text-amber-400" />,
      color: 'border-amber-500/40 bg-amber-950/20 text-amber-300',
    },
    gatc: {
      title: 'GATC (Govt. Approved Testing Center)',
      desc: 'Accredited calibration test laboratories performing precision pattern approvals.',
      icon: <FlaskConical className="w-5 h-5 text-purple-400" />,
      color: 'border-purple-500/40 bg-purple-950/20 text-purple-300',
    },
    admin: {
      title: 'State Oversight Admin',
      desc: 'State Enforcement Command & Directorate overseeing compliance across districts.',
      icon: <ShieldAlert className="w-5 h-5 text-rose-400" />,
      color: 'border-rose-500/40 bg-rose-950/20 text-rose-300',
    },
  };

  // Label configuration per role for the shared login form
  const loginConfig: Record<'business' | 'lmo' | 'gatc' | 'admin', { idLabel: string; idPlaceholder: string; idHint: string }> = {
    business: {
      idLabel: 'Business Registration ID / GSTIN',
      idPlaceholder: 'e.g. BIZ-MH-884 or GSTIN',
      idHint: 'Department-issued business trader registration ID',
    },
    lmo: {
      idLabel: 'Officer ID (Govt. Issued)',
      idPlaceholder: 'e.g. LM-88219',
      idHint: 'Department-issued officer badge identifier',
    },
    gatc: {
      idLabel: 'GATC Registration / License Number',
      idPlaceholder: 'e.g. GATC-W-01',
      idHint: 'NABL accredited laboratory registration number',
    },
    admin: {
      idLabel: 'Employee ID (Govt. Issued)',
      idPlaceholder: 'e.g. ADMIN-HQ-01',
      idHint: 'State Metrology Command employee ID',
    },
  };

  // Filter demo accounts for active role
  const roleDemoAccounts = credentialedUsers.filter(u => u.role === selectedRole);

  // Handle switching roles
  const handleRoleChange = (newRole: ScalyRole) => {
    setSelectedRole(newRole);
    setUserIdInput('');
    setPasswordInput('');
    setAuthError(null);
    setShowForgotNotice(false);
  };

  // Quick fill demo credentials
  const handleQuickFill = (account: CredentialedUser) => {
    setUserIdInput(account.id);
    setPasswordInput(account.password);
    setAuthError(null);
  };

  // 1. Citizen 1-Click Verification Gateway (No login at all)
  const handleCitizenAccess = () => {
    const citizenUser: CurrentUser = {
      role: 'citizen',
      name: 'Public Consumer',
      idOrBadge: 'CITIZEN-PUBLIC',
      division: 'Public Consumer Verification',
      jurisdictionStatus: 'Consumer Protection Rights • LM Act 2009',
      organization: 'Citizen Verification Access',
      sessionToken: `pub-token-${Date.now()}`,
    };
    onInitializeSession(citizenUser, true);
  };

  // 2-5. Credentialed Login Authentication
  const handleCredentialedLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    const trimmedId = userIdInput.trim();
    const trimmedPw = passwordInput.trim();

    if (!trimmedId || !trimmedPw) {
      setAuthError('Please enter both your Department-Issued ID and Password.');
      return;
    }

    // Look up mock record matching ID and role
    const matchedUser = credentialedUsers.find(
      u => u.role === selectedRole && u.id.toLowerCase() === trimmedId.toLowerCase()
    );

    // Validate password (match exact password or universal demo password)
    const isPasswordValid = matchedUser && (
      matchedUser.password === trimmedPw ||
      trimmedPw === 'demo123' ||
      trimmedPw === 'password123' ||
      trimmedPw === 'demo'
    );

    if (!matchedUser || !isPasswordValid) {
      setAuthError('Invalid credentials. The ID or password does not match department records.');
      return;
    }

    // Generate mock session token and store in state
    const sessionToken = `mock-session-${matchedUser.role}-${Date.now()}`;
    const authenticatedUser: CurrentUser = {
      role: matchedUser.role,
      name: matchedUser.name,
      idOrBadge: matchedUser.id,
      division: matchedUser.division,
      jurisdictionStatus: matchedUser.jurisdictionStatus,
      organization: matchedUser.organization,
      phone: matchedUser.phone,
      email: matchedUser.email,
      sessionToken,
    };

    onInitializeSession(authenticatedUser);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 relative overflow-hidden font-sans">
      {/* Background GovTech subtle ornamentation */}
      <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Gateway Card (Glass panel) */}
      <div className="w-full max-w-xl bg-slate-900/90 border border-slate-800 rounded-3xl shadow-2xl backdrop-blur-md p-6 sm:p-8 z-10 space-y-6">
        {/* National Metrology Seal & Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-b from-blue-900/80 to-slate-900 border border-blue-500/30 text-amber-400 shadow-inner mx-auto ring-4 ring-blue-500/10">
            <Scale className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-center gap-2">
              <h1 className="text-3xl sm:text-4xl font-medium tracking-tight text-white font-brand">
                Scaly
              </h1>
              <span className="text-[10px] font-semibold uppercase tracking-wider bg-blue-950 border border-blue-600/50 text-blue-300 px-2 py-0.5 rounded-full font-heading">
                RBAC Gateway
              </span>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-slate-300 font-heading tracking-[0.01em]">
              Legal Metrology Digital Verification Gateway
            </p>
            <p className="text-[11px] font-normal text-slate-400 max-w-md mx-auto leading-relaxed">
              Department of Consumer Affairs • Legal Metrology Division • Government of India
            </p>
          </div>
        </div>

        <div className="h-px bg-slate-800 w-full" />

        {/* Step 1: Stakeholder Role Dropdown */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-[0.05em] text-slate-300 font-heading">
            Step 1: Select Stakeholder Role
          </label>
          <div className="relative">
            <select
              value={selectedRole}
              onChange={(e) => handleRoleChange(e.target.value as ScalyRole)}
              className="w-full bg-slate-950 text-slate-100 border border-slate-700 rounded-xl p-3 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer leading-[1.5]"
            >
              <option value="citizen">1. Citizen / Public Consumer (Transparent Consumer Trust — No Login)</option>
              <option value="business">2. Business / Instrument Owner (Dept. Registered Login)</option>
              <option value="lmo">3. LMO (Legal Metrology Officer / Field Inspector Login)</option>
              <option value="gatc">4. GATC (Govt. Approved Testing Center / Lab Login)</option>
              <option value="admin">5. State Oversight Admin (State Command Directorate Login)</option>
            </select>
          </div>

          {/* Scoped Role Descriptor Card */}
          <div className={`p-3 rounded-xl border text-xs flex items-start gap-3 transition-all ${roleDescriptions[selectedRole].color}`}>
            <div className="p-1.5 rounded-lg bg-slate-950/60 border border-slate-800 shrink-0">
              {roleDescriptions[selectedRole].icon}
            </div>
            <div className="space-y-0.5">
              <span className="font-semibold block text-white text-xs font-heading">
                {roleDescriptions[selectedRole].title}
              </span>
              <p className="text-[11px] font-normal text-slate-300 leading-[1.6]">
                {roleDescriptions[selectedRole].desc}
              </p>
            </div>
          </div>
        </div>

        {/* ROLE-SPECIFIC ACCESS FLOW */}
        {selectedRole === 'citizen' ? (
          /* 1. CITIZEN / PUBLIC CONSUMER — NO LOGIN AT ALL (Skip Step 2 authorization entirely) */
          <div className="space-y-4 pt-1">
            {/* Green Checkmark Banner */}
            <div className="bg-emerald-950/50 border border-emerald-500/40 rounded-2xl p-4 sm:p-5 space-y-3 shadow-inner">
              <div className="flex items-center gap-2.5 text-emerald-400 font-semibold text-xs sm:text-sm font-heading">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>Instant Access — No bureaucratic login required</span>
              </div>
              <p className="text-xs text-slate-300 leading-[1.6] font-normal">
                Citizens and consumers can directly inspect legal metrology stamping, validity expiry, and lead-wire seal integrity on commercial scales, weighbridges, and fuel dispensers.
              </p>
              <div className="flex items-center gap-2 text-[11px] text-emerald-300/80 font-mono tabular-nums">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Public Inspection Mode • No user credentials or registration stored</span>
              </div>
            </div>

            {/* Direct CTA Button (Blue-to-Purple Gradient) */}
            <button
              type="button"
              onClick={handleCitizenAccess}
              className="w-full py-3.5 px-5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer group active:scale-98 font-heading tracking-[0.02em]"
            >
              <Camera className="w-4 h-4 text-amber-300 group-hover:scale-110 transition-transform" />
              <span>Scan to Verify / View Certificate</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        ) : (
          /* 2-5. SHARED LOGIN UX FOR BUSINESS / LMO / GATC / ADMIN */
          <form onSubmit={handleCredentialedLogin} className="space-y-4 pt-1">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold uppercase tracking-[0.05em] text-slate-300 font-heading">
                Step 2: Department-Issued Credential Login
              </label>
              <span className="text-[10px] text-slate-400 font-mono tabular-nums flex items-center gap-1">
                <Lock className="w-3 h-3 text-amber-400" />
                <span>Provisioned Accounts</span>
              </span>
            </div>

            {/* Compact Shared Login Form Layout */}
            <div className={`bg-slate-950/70 border rounded-2xl p-4 sm:p-5 space-y-4 transition-colors ${
              authError ? 'border-rose-500/80' : 'border-slate-800'
            }`}>
              {/* Inline Validation Error State */}
              {authError && (
                <div className="p-3 bg-rose-950/80 border border-rose-500 rounded-xl text-rose-200 text-xs flex items-center gap-2 animate-shake font-normal">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              {/* Department ID Field (Label dynamically swaps based on role) */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-300 flex items-center justify-between">
                  <span>{loginConfig[selectedRole].idLabel} <span className="text-rose-400">*</span></span>
                  <span className="text-[10px] text-slate-400 font-normal">{loginConfig[selectedRole].idHint}</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={userIdInput}
                    onChange={(e) => {
                      setUserIdInput(e.target.value);
                      if (authError) setAuthError(null);
                    }}
                    placeholder={loginConfig[selectedRole].idPlaceholder}
                    className={`w-full pl-9 pr-3 py-2.5 bg-slate-900 border rounded-xl text-xs sm:text-sm text-white font-normal leading-[1.5] tabular-nums font-mono focus:outline-none transition-colors ${
                      authError ? 'border-rose-500 focus:ring-1 focus:ring-rose-500' : 'border-slate-700 focus:ring-1 focus:ring-blue-500'
                    }`}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-medium text-slate-300">
                    Password <span className="text-rose-400">*</span>
                  </label>
                  {/* Non-functional helper link for demo */}
                  <button
                    type="button"
                    onClick={() => setShowForgotNotice(!showForgotNotice)}
                    className="text-[11px] text-slate-400 hover:text-slate-200 underline cursor-pointer font-normal"
                  >
                    Forgot credentials?
                  </button>
                </div>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="password"
                    required
                    value={passwordInput}
                    onChange={(e) => {
                      setPasswordInput(e.target.value);
                      if (authError) setAuthError(null);
                    }}
                    placeholder="Enter department-issued password"
                    className={`w-full pl-9 pr-3 py-2.5 bg-slate-900 border rounded-xl text-xs sm:text-sm text-white font-normal leading-[1.5] tabular-nums font-mono focus:outline-none transition-colors ${
                      authError ? 'border-rose-500 focus:ring-1 focus:ring-rose-500' : 'border-slate-700 focus:ring-1 focus:ring-blue-500'
                    }`}
                  />
                </div>

                {/* Helper notice if clicked */}
                {showForgotNotice && (
                  <div className="p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-[11px] text-slate-300 flex items-start gap-2 font-normal leading-[1.6]">
                    <HelpCircle className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                    <span>Contact your local Legal Metrology Office or division supervisory command to request credential re-issuance.</span>
                  </div>
                )}
              </div>

              {/* Demo Account Quick-Fill Chips for Evaluator Convenience */}
              {roleDemoAccounts.length > 0 && (
                <div className="pt-2 border-t border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold uppercase tracking-wider font-heading">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      <span>Demo Account Quick Fill:</span>
                    </span>
                    <span className="font-mono tabular-nums text-slate-500">Auto-populates credentials</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {roleDemoAccounts.map((account) => (
                      <button
                        key={account.id}
                        type="button"
                        onClick={() => handleQuickFill(account)}
                        className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all cursor-pointer font-mono tabular-nums flex items-center gap-1.5 ${
                          userIdInput === account.id
                            ? 'bg-blue-900/60 border-blue-500 text-blue-200'
                            : 'bg-slate-900 border-slate-700 hover:border-slate-500 text-slate-300'
                        }`}
                      >
                        <span className="font-semibold text-white">{account.id}</span>
                        <span className="text-slate-400 text-[10px] hidden sm:inline">
                          ({account.organization ? account.organization.split(' ')[0] : account.name.split(' ')[0]})
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Note under the form clarifying accounts are department-issued */}
            <p className="text-[11px] text-slate-400 leading-[1.6] px-1 font-normal">
              Credentials are issued by the Department of Consumer Affairs, Legal Metrology Division. Contact your jurisdiction office if you don't have one.
            </p>

            {/* Initialize Session CTA: Blue-to-Purple Gradient, Disabled until both fields filled */}
            <button
              type="submit"
              disabled={!userIdInput.trim() || !passwordInput.trim()}
              className={`w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2 group font-heading tracking-[0.02em] ${
                !userIdInput.trim() || !passwordInput.trim()
                  ? 'opacity-50 cursor-not-allowed shadow-none'
                  : 'cursor-pointer active:scale-98'
              }`}
            >
              <span>Initialize Session</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        )}

        {/* Footer Note */}
        <div className="text-center text-[10px] text-slate-400 pt-1 border-t border-slate-800/80 font-normal leading-relaxed">
          Secured by Section 15 of Legal Metrology Act, 2009 • Pre-embedded OEM QR Architecture
        </div>
      </div>
    </div>
  );
};
