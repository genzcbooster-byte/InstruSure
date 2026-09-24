import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Camera, 
  CameraOff, 
  CheckCircle2, 
  AlertCircle, 
  Search, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Scale, 
  Fuel, 
  Wheat, 
  Activity, 
  History, 
  Clock, 
  RotateCcw, 
  Volume2,
  Lock,
  ExternalLink
} from 'lucide-react';
import { ScalyInstrument } from '../types/scaly';
import { playScanBeep } from '../data/csvDatabase';

interface RecentScanItem {
  id: string;
  scannedAt: string;
  timestamp: number;
}

const RECENT_SCANS_STORAGE_KEY = 'scaly_recent_scans_v1';

export type CameraPermissionFlowState = 
  | 'prompt'       // Showing in-app pre-prompt modal ("Camera Access Needed")
  | 'requesting'   // User clicked "Allow Camera", waiting for browser native prompt / device check
  | 'granted'      // Permission granted, viewfinder running
  | 'denied'       // User denied browser permission
  | 'no-camera'    // Device has no video input / webcam
  | 'not-now';     // User clicked "Not Now" in in-app pre-prompt

interface CameraScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  instruments: ScalyInstrument[];
  onSelectInstrument: (instrumentId: string) => void;
}

export const CameraScannerModal: React.FC<CameraScannerModalProps> = ({
  isOpen,
  onClose,
  instruments,
  onSelectInstrument,
}) => {
  const [manualInput, setManualInput] = useState('');
  const [permissionState, setPermissionState] = useState<CameraPermissionFlowState>('prompt');
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraErrorDetail, setCameraErrorDetail] = useState<string | null>(null);
  const [scanningStatus, setScanningStatus] = useState<'idle' | 'scanning' | 'success'>('idle');

  // Track if user already granted permission in this session so they aren't repeatedly prompted
  const sessionPermissionGrantedRef = useRef<boolean>(false);

  // Persistent Recent Scans state
  const [recentScans, setRecentScans] = useState<RecentScanItem[]>(() => {
    try {
      const saved = localStorage.getItem(RECENT_SCANS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.debug('Failed to read recent scans from localStorage', e);
    }
    return [
      { id: 'IND-MH-2024-WB-0921', scannedAt: '10m ago', timestamp: Date.now() - 1000 * 60 * 10 },
      { id: 'IND-DL-2023-CS-1104', scannedAt: '1h ago', timestamp: Date.now() - 1000 * 60 * 60 },
    ];
  });

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const html5QrCodeRef = useRef<any>(null);
  const isStoppingRef = useRef<boolean>(false);

  // Helper to persist a scanned ID
  const saveRecentScan = (id: string) => {
    setRecentScans(prev => {
      const filtered = prev.filter(item => item.id.toLowerCase() !== id.toLowerCase());
      const updated: RecentScanItem[] = [
        { id, scannedAt: 'Just now', timestamp: Date.now() },
        ...filtered,
      ].slice(0, 5);

      try {
        localStorage.setItem(RECENT_SCANS_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.debug('Failed to save recent scans to localStorage', e);
      }
      return updated;
    });
  };

  const clearRecentScans = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRecentScans([]);
    try {
      localStorage.removeItem(RECENT_SCANS_STORAGE_KEY);
    } catch (e) {
      console.debug('Failed to clear recent scans from localStorage', e);
    }
  };

  /**
   * Stop camera tracks cleanly.
   * Releases ALL video tracks so the browser camera indicator light turns off immediately.
   */
  const stopCamera = () => {
    if (isStoppingRef.current) return;
    isStoppingRef.current = true;

    // 1. Stop HTML5 QR Code instance
    if (html5QrCodeRef.current) {
      try {
        if (html5QrCodeRef.current.isScanning) {
          html5QrCodeRef.current.stop().then(() => {
            try {
              html5QrCodeRef.current.clear();
            } catch {}
          }).catch((err: any) => {
            console.debug('html5QrCode stop error', err);
          });
        } else {
          try {
            html5QrCodeRef.current.clear();
          } catch {}
        }
      } catch (e) {
        console.debug('Error stopping html5QrCode', e);
      }
      html5QrCodeRef.current = null;
    }

    // 2. Stop direct MediaStream tracks
    if (mediaStreamRef.current) {
      try {
        mediaStreamRef.current.getTracks().forEach((track) => {
          try {
            track.stop();
          } catch (e) {
            console.debug('Track stop error', e);
          }
        });
      } catch {}
      mediaStreamRef.current = null;
    }

    // 3. Clear video element source
    if (videoRef.current) {
      try {
        if (videoRef.current.srcObject) {
          const stream = videoRef.current.srcObject as MediaStream;
          stream.getTracks().forEach((t) => {
            try { t.stop(); } catch {}
          });
          videoRef.current.srcObject = null;
        }
      } catch {}
    }

    setCameraActive(false);
    isStoppingRef.current = false;
  };

  /**
   * Web Audio API Confirmation Beep Synthesizer
   * Plays an immediate, pleasant confirmation chime using OscillatorNode and GainNode
   * immediately when a QR code is successfully decoded.
   */
  const playWebAudioBeep = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) {
        playScanBeep();
        return;
      }

      const audioCtx = new AudioCtx();
      if (audioCtx.state === 'suspended') {
        audioCtx.resume().catch(() => {});
      }

      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      // Rising interval: A5 (880 Hz) leaping to E6 (1320 Hz)
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(1320, now + 0.045);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.3, now + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.16);

      setTimeout(() => {
        try {
          if (audioCtx.state !== 'closed') {
            audioCtx.close().catch(() => {});
          }
        } catch {}
      }, 250);
    } catch (e) {
      console.debug('Web Audio API playback fallback:', e);
      playScanBeep();
    }
  };

  /**
   * Start Live Camera Viewfinder (called only after permission is confirmed granted)
   */
  const startLiveViewfinder = async () => {
    setScanningStatus('scanning');
    setCameraErrorDetail(null);

    try {
      const { Html5Qrcode } = await import('html5-qrcode');
      const elementId = 'scaly-qr-reader';
      const readerElement = document.getElementById(elementId);

      if (readerElement) {
        const scanner = new Html5Qrcode(elementId);
        html5QrCodeRef.current = scanner;

        await scanner.start(
          { facingMode: 'environment' },
          {
            fps: 12,
            qrbox: { width: 250, height: 250 },
          },
          (decodedText) => {
            handleCodeDetected(decodedText);
          },
          () => {
            // Frame analysis error (normal while waiting for QR in frame)
          }
        );

        setCameraActive(true);
        return;
      }
    } catch (err: any) {
      console.debug('Html5Qrcode direct start error, falling back to getUserMedia:', err);
    }

    // Direct navigator.mediaDevices fallback if Html5Qrcode DOM initialization was interrupted
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: 'environment' } },
        });
        mediaStreamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          setCameraActive(true);
        }
      }
    } catch (fallbackErr: any) {
      console.debug('Direct stream fallback error:', fallbackErr);
    }
  };

  /**
   * Request Camera Permission (invoked ONLY when user taps "Allow Camera" in our in-app modal)
   */
  const requestCameraPermission = async () => {
    setPermissionState('requesting');
    setCameraErrorDetail(null);

    // Secure context validation (getUserMedia requires HTTPS or localhost)
    if (typeof window !== 'undefined' && !window.isSecureContext && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
      setPermissionState('denied');
      setCameraErrorDetail('Camera access requires a secure HTTPS context. GitHub Pages serves HTTPS automatically, but plain HTTP or local file:// URLs block hardware media devices.');
      return;
    }

    // Check navigator.mediaDevices support
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setPermissionState('no-camera');
      return;
    }

    // Check for connected video inputs
    try {
      if (navigator.mediaDevices.enumerateDevices) {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoInputs = devices.filter(d => d.kind === 'videoinput');
        // If device enumeration returned results and has 0 video inputs, there is no camera
        if (devices.length > 0 && videoInputs.length === 0) {
          setPermissionState('no-camera');
          return;
        }
      }
    } catch (e) {
      console.debug('enumerateDevices check skipped:', e);
    }

    // Trigger browser's native permission dialog via getUserMedia
    try {
      const testStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' } },
      });

      // Granted! Immediately release the probe stream so we can bind to scanner cleanly
      testStream.getTracks().forEach((track) => {
        try { track.stop(); } catch {}
      });

      sessionPermissionGrantedRef.current = true;
      setPermissionState('granted');
      
      // Allow DOM to render the scanner container then start scanning
      setTimeout(() => {
        startLiveViewfinder();
      }, 100);

    } catch (err: any) {
      console.debug('getUserMedia permission error:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        // User denied native permission dialog
        setPermissionState('denied');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError' || err.name === 'OverconstrainedError') {
        // No hardware camera found on machine
        setPermissionState('no-camera');
      } else {
        setPermissionState('denied');
      }
    }
  };

  /**
   * User taps "Not Now" in in-app pre-prompt modal:
   * Dismiss the permission modal and transition straight to manual ID entry mode,
   * providing an "Enable Camera" action they can tap anytime later.
   */
  const handleNotNow = () => {
    stopCamera();
    setPermissionState('not-now');
  };

  // Manage modal open / close lifecycle and event listeners
  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      setManualInput('');
      setScanningStatus('idle');
      return;
    }

    // Modal just opened: check if already granted in this session
    if (sessionPermissionGrantedRef.current) {
      setPermissionState('granted');
      setTimeout(() => {
        startLiveViewfinder();
      }, 100);
    } else {
      // Show our custom in-app pre-prompt modal first!
      setPermissionState('prompt');
    }

    // Ensure all camera tracks are released when user navigates away or hides page
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopCamera();
      }
    };

    const handleBeforeUnload = () => {
      stopCamera();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      stopCamera();
    };
  }, [isOpen]);

  /**
   * When a QR code is detected:
   * 1. Synthesize confirmation beep.
   * 2. Immediately stop camera stream (all tracks released).
   * 3. Persist to recent scans.
   * 4. Select instrument and close modal.
   */
  const handleCodeDetected = (code: string) => {
    const trimmed = code.trim();
    const matched = instruments.find(
      i => i.id.toLowerCase() === trimmed.toLowerCase() || trimmed.includes(i.id)
    );

    const targetId = matched ? matched.id : trimmed;
    
    // Play short, pleasant Web Audio API confirmation beep immediately
    playWebAudioBeep();
    setScanningStatus('success');

    // Immediately stop camera tracks so device camera indicator LED turns off
    stopCamera();

    // Save to persistent recent scans
    saveRecentScan(targetId);

    setTimeout(() => {
      onSelectInstrument(targetId);
      onClose();
    }, 350);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualInput.trim()) return;
    handleCodeDetected(manualInput.trim());
  };

  const handleChipClick = (id: string) => {
    handleCodeDetected(id);
  };

  if (!isOpen) return null;

  // The 5 pre-embedded instruments specified in user requirements:
  const quickChips = [
    {
      id: 'IND-MH-2024-WB-0921',
      title: 'Weighbridge 60 MT Pitless',
      model: 'Avery Weigh-Tronix E-1205',
      status: 'Valid (Verified)',
      statusColor: 'text-emerald-400 bg-emerald-950/60 border-emerald-800/60',
      icon: <Scale className="w-3.5 h-3.5 text-blue-400" />,
    },
    {
      id: 'IND-DL-2023-CS-1104',
      title: 'Bench Scale Class III',
      model: 'Essae DS-852',
      status: 'Expiring in 9 days',
      statusColor: 'text-amber-400 bg-amber-950/60 border-amber-800/60',
      icon: <Activity className="w-3.5 h-3.5 text-amber-400" />,
    },
    {
      id: 'IND-KA-2023-FD-5520',
      title: 'Fuel Dispenser Multi-Nozzle',
      model: 'Tokheim Quantium',
      status: 'Valid (Verified)',
      statusColor: 'text-emerald-400 bg-emerald-950/60 border-emerald-800/60',
      icon: <Fuel className="w-3.5 h-3.5 text-emerald-400" />,
    },
    {
      id: 'IND-MH-2022-GM-3001',
      title: 'Grain Moisture Meter',
      model: 'AgroTech Pro-10',
      status: 'Tampered Lead Seal',
      statusColor: 'text-rose-400 bg-rose-950/60 border-rose-800/60',
      icon: <Wheat className="w-3.5 h-3.5 text-rose-400" />,
    },
    {
      id: 'IND-WB-2024-PS-7719',
      title: 'Analytical Balance Class II',
      model: 'Mettler Toledo ME-T',
      status: 'Pending GATC Lab Test',
      statusColor: 'text-purple-400 bg-purple-950/60 border-purple-800/60',
      icon: <Sparkles className="w-3.5 h-3.5 text-purple-400" />,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      {/* 
        ========================================================================
        1. CUSTOM PRE-PROMPT MODAL BEFORE CALLING getUserMedia
        ========================================================================
      */}
      {permissionState === 'prompt' && (
        <div className="relative w-full max-w-md bg-slate-900/95 border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-7 text-slate-100 text-center space-y-5 my-auto animate-scale-in">
          {/* Close button */}
          <button
            type="button"
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* National Metrology Camera emblem */}
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-b from-blue-900/80 to-slate-900 border border-blue-500/30 text-amber-400 shadow-inner mx-auto ring-4 ring-blue-500/10">
            <Camera className="w-7 h-7" />
          </div>

          <div className="space-y-2">
            <h3 className="text-lg sm:text-xl font-semibold text-white tracking-tight font-heading">
              Camera Access Needed
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 font-normal leading-[1.6]">
              Scaly needs camera access to scan the instrument's QR code. Allow camera access?
            </p>
          </div>

          {/* Buttons: Allow (blue-purple gradient) & Not Now (plain/outline) */}
          <div className="flex flex-col sm:flex-row-reverse items-center justify-center gap-2.5 pt-2">
            <button
              type="button"
              onClick={requestCameraPermission}
              className="w-full sm:flex-1 py-3 px-5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 font-heading tracking-[0.02em]"
            >
              <Camera className="w-4 h-4 text-amber-300" />
              <span>Allow Camera</span>
            </button>
            <button
              type="button"
              onClick={handleNotNow}
              className="w-full sm:w-auto py-3 px-5 border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white bg-slate-900/60 font-medium text-xs sm:text-sm rounded-xl transition-colors cursor-pointer text-center font-heading"
            >
              Not Now
            </button>
          </div>

          {/* Privacy footer */}
          <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400 font-normal pt-1 border-t border-slate-800/80">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Privacy Protected • Client-side hardware feed • Zero cloud recording</span>
          </div>
        </div>
      )}

      {/* 
        ========================================================================
        2. SCANNER WORKSPACE (Viewfinder, Manual Fallback, Presets, Recent Scans)
        Visible when permission is granted, denied, not-now, or no-camera
        ========================================================================
      */}
      {permissionState !== 'prompt' && (
        <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden text-slate-100 flex flex-col my-auto max-h-[90vh]">
          {/* Modal Header */}
          <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-950 border border-blue-700/60 flex items-center justify-center text-amber-400 shadow-inner">
                <Camera className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-white tracking-tight font-heading">
                  Factory OEM QR Scanner
                </h2>
                <p className="text-[10px] text-slate-400 font-normal">
                  {permissionState === 'granted'
                    ? 'Point hardware camera at chassis-etched QR code'
                    : 'Manual Instrument ID & Factory Preset Verification'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={playWebAudioBeep}
                title="Test Web Audio confirmation chime"
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 hover:border-emerald-500/60 text-slate-300 hover:text-emerald-300 text-[11px] font-mono tabular-nums transition-all cursor-pointer shadow-inner"
              >
                <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline font-medium">Chime Test</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  stopCamera();
                  onClose();
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Modal Body */}
          <div className="p-5 overflow-y-auto space-y-5">
            {/* 
              A. LIVE CAMERA VIEWFINDER (Active only when permission is granted)
            */}
            {permissionState === 'granted' && (
              <div className="relative w-full aspect-square max-w-[280px] sm:max-w-[300px] mx-auto bg-slate-950 rounded-2xl overflow-hidden border-2 border-slate-700 shadow-2xl flex items-center justify-center">
                {/* HTML5 QR reader element container */}
                <div 
                  id="scaly-qr-reader" 
                  className="w-full h-full [&_video]:w-full [&_video]:h-full [&_video]:object-cover" 
                />

                {/* Direct video fallback */}
                {!html5QrCodeRef.current && (
                  <video
                    ref={videoRef}
                    playsInline
                    muted
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                )}

                {/* Target Reticle & Laser Sweep */}
                <div className="absolute inset-4 pointer-events-none rounded-xl border border-white/20 flex flex-col justify-between">
                  <div className="flex justify-between">
                    <span className="w-4 h-4 border-t-2 border-l-2 border-amber-400 rounded-tl-sm" />
                    <span className="w-4 h-4 border-t-2 border-r-2 border-amber-400 rounded-tr-sm" />
                  </div>
                  <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent shadow-[0_0_12px_#ef4444] animate-bounce" />
                  <div className="flex justify-between">
                    <span className="w-4 h-4 border-b-2 border-l-2 border-amber-400 rounded-bl-sm" />
                    <span className="w-4 h-4 border-b-2 border-r-2 border-amber-400 rounded-br-sm" />
                  </div>
                </div>

                {scanningStatus === 'success' && (
                  <div className="absolute inset-0 bg-emerald-950/90 flex flex-col items-center justify-center text-center space-y-2 z-20">
                    <CheckCircle2 className="w-10 h-10 text-emerald-400 animate-scale-in" />
                    <span className="text-xs font-semibold text-white font-heading">QR Identity Resolved</span>
                  </div>
                )}
              </div>
            )}

            {/* 
              B. PERMISSION OUTCOME BANNERS & NOTICES
            */}
            {/* 1. Requesting state */}
            {permissionState === 'requesting' && (
              <div className="p-4 rounded-2xl bg-blue-950/40 border border-blue-500/40 text-blue-200 text-xs flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin shrink-0" />
                <div className="space-y-0.5">
                  <span className="font-semibold block font-heading">Checking Camera Permission...</span>
                  <p className="text-[11px] text-slate-300 font-normal">
                    Please approve the browser's camera prompt to start scanning.
                  </p>
                </div>
              </div>
            )}

            {/* 2. Denied state */}
            {permissionState === 'denied' && (
              <div className="p-4 bg-rose-950/70 border border-rose-500/80 rounded-2xl text-rose-200 text-xs space-y-2.5 shadow-sm">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <span className="font-semibold block text-rose-100 font-heading">
                      Camera access was denied.
                    </span>
                    <p className="text-[11px] text-rose-200/90 leading-[1.6] font-normal">
                      Camera access was denied. You can still enter the Instrument ID manually below.
                    </p>
                    {cameraErrorDetail && (
                      <p className="text-[10px] text-rose-300/80 font-mono pt-0.5">
                        {cameraErrorDetail}
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-2 border-t border-rose-800/60 flex items-center justify-between text-[11px]">
                  <span className="text-rose-300">Changed your browser permission?</span>
                  <button
                    type="button"
                    onClick={requestCameraPermission}
                    className="inline-flex items-center gap-1.5 text-rose-200 hover:text-white font-semibold underline cursor-pointer font-heading"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Enable Camera / Retry</span>
                  </button>
                </div>
              </div>
            )}

            {/* 3. No Camera Available state (desktop without webcam) */}
            {permissionState === 'no-camera' && (
              <div className="p-4 bg-slate-950/90 border border-amber-500/40 rounded-2xl text-slate-200 text-xs space-y-2.5 shadow-sm">
                <div className="flex items-start gap-3">
                  <CameraOff className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <span className="font-semibold block text-amber-300 font-heading">
                      No camera detected.
                    </span>
                    <p className="text-[11px] text-slate-300 leading-[1.6] font-normal">
                      No camera detected. You can still enter the Instrument ID manually below.
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Connected an external webcam?</span>
                  <button
                    type="button"
                    onClick={requestCameraPermission}
                    className="inline-flex items-center gap-1.5 text-amber-300 hover:text-amber-200 font-semibold underline cursor-pointer font-heading"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Check Devices Again</span>
                  </button>
                </div>
              </div>
            )}

            {/* 4. Not Now state (user chose manual entry from pre-prompt) */}
            {permissionState === 'not-now' && (
              <div className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-2xl text-slate-300 text-xs flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-blue-400 shrink-0" />
                  <span className="font-normal text-[11px]">
                    Direct Manual Inspection Mode
                  </span>
                </div>
                {/* Small "Enable Camera" link to reopen the permission flow */}
                <button
                  type="button"
                  onClick={() => setPermissionState('prompt')}
                  className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 font-semibold underline cursor-pointer font-heading"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Enable Camera</span>
                </button>
              </div>
            )}

            {/* 
              C. MANUAL INSTRUMENT ID INPUT FIELD
            */}
            <form onSubmit={handleManualSubmit} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-[11px] font-semibold uppercase tracking-[0.05em] text-slate-300 font-heading">
                  Manual Factory Machine ID Input:
                </label>
                {permissionState !== 'granted' && permissionState !== 'not-now' && (
                  <button
                    type="button"
                    onClick={() => setPermissionState('prompt')}
                    className="inline-flex items-center gap-1 text-[11px] text-blue-400 hover:text-blue-300 underline font-normal cursor-pointer"
                  >
                    <Camera className="w-3 h-3" />
                    <span>Enable Camera</span>
                  </button>
                )}
              </div>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={manualInput}
                    onChange={(e) => setManualInput(e.target.value)}
                    placeholder="Enter ID like IND-MH-2024-WB-0921..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono tabular-nums leading-[1.5] placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer font-heading tracking-[0.02em]"
                >
                  <span>Resolve</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>

            {/* 
              D. PRE-EMBEDDED INSTRUMENT QUICK-CHIPS (5 Factory Presets)
            */}
            <div className="space-y-2 pt-1 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-[0.05em] text-slate-300 font-heading">
                  Click to Simulate Pre-Embedded Machine QR:
                </span>
                <span className="text-[10px] text-slate-400 font-mono tabular-nums">5 Factory Presets</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {quickChips.map((chip) => (
                  <button
                    key={chip.id}
                    type="button"
                    onClick={() => handleChipClick(chip.id)}
                    className="w-full text-left p-2.5 rounded-xl bg-slate-950/70 hover:bg-slate-800 border border-slate-800 hover:border-blue-500/50 transition-all cursor-pointer group flex items-start gap-2.5 shadow-2xs"
                  >
                    <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 group-hover:border-blue-500/40 shrink-0">
                      {chip.icon}
                    </div>
                    <div className="min-w-0 flex-1 space-y-0.5">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-mono text-[11px] font-bold text-white group-hover:text-blue-300 truncate">
                          {chip.id}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-300 font-medium truncate">
                        {chip.title} • {chip.model}
                      </p>
                      <span className={`inline-block text-[9px] font-mono px-1.5 py-0.2 rounded border ${chip.statusColor}`}>
                        {chip.status}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 
              E. PERSISTENT RECENT SCANS LIST
            */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.05em] text-slate-300 font-heading">
                  <History className="w-3.5 h-3.5 text-blue-400" />
                  <span>Recent Scans</span>
                  {recentScans.length > 0 && (
                    <span className="text-[10px] font-mono tabular-nums px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                      {recentScans.length}
                    </span>
                  )}
                </div>
                {recentScans.length > 0 && (
                  <button
                    type="button"
                    onClick={clearRecentScans}
                    className="text-[10px] text-slate-500 hover:text-rose-400 transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Clear History</span>
                  </button>
                )}
              </div>

              {recentScans.length > 0 ? (
                <div className="space-y-1.5">
                  {recentScans.map((item) => {
                    const inst = instruments.find(i => i.id.toLowerCase() === item.id.toLowerCase());
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleChipClick(item.id)}
                        className="w-full text-left p-2.5 rounded-xl bg-slate-950/80 hover:bg-slate-800/90 border border-slate-800 hover:border-blue-500/50 transition-all cursor-pointer group flex items-center justify-between gap-3 shadow-2xs"
                      >
                        <div className="min-w-0 flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-blue-950/60 border border-blue-800/40 text-blue-400 flex items-center justify-center shrink-0">
                            <Clock className="w-3.5 h-3.5" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-bold text-white group-hover:text-blue-300">
                                {item.id}
                              </span>
                              {inst && (
                                <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded border ${
                                  inst.status === 'VALID' 
                                    ? 'text-emerald-400 bg-emerald-950/60 border-emerald-800/60'
                                    : inst.status === 'EXPIRING_SOON'
                                    ? 'text-amber-400 bg-amber-950/60 border-amber-800/60'
                                    : inst.status === 'SEAL_BROKEN'
                                    ? 'text-rose-400 bg-rose-950/60 border-rose-800/60'
                                    : 'text-purple-400 bg-purple-950/60 border-purple-800/60'
                                }`}>
                                  {inst.status}
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] text-slate-400 truncate">
                              {inst ? `${inst.type} • ${inst.ownerName}` : 'Factory Pre-Embedded QR Record'}
                            </p>
                          </div>
                        </div>

                        <div className="shrink-0 flex items-center gap-2">
                          <span className="text-[10px] font-mono text-slate-500">
                            {item.scannedAt}
                          </span>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="p-3 bg-slate-950/50 border border-slate-800/60 rounded-xl text-center text-[11px] text-slate-500 font-normal">
                  No recent scans yet. Scan a machine QR or select a preset above.
                </div>
              )}
            </div>
          </div>

          {/* Footer info */}
          <div className="p-3 bg-slate-950 border-t border-slate-800 text-[10px] text-slate-400 text-center font-normal">
            Audio Confirmation Synthesizer Active • Instant Identity Resolving Engine
          </div>
        </div>
      )}
    </div>
  );
};
