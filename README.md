# Scaly — Legal Metrology Digital Verification Gateway

Scaly is a production-grade, QR-centric digital lifecycle platform for India's Legal Metrology ecosystem under the Legal Metrology Act, 2009. It provides role-based access for Citizens, Commercial Businesses, Legal Metrology Officers (LMO), Govt. Approved Testing Centers (GATC), and State Oversight Administrators.

---

## 📷 Camera Permissions & Hardware QR Scanner Flow

The camera scanner incorporates a secure, user-centric permission lifecycle:

### 1. In-App Pre-Prompt Before Native Browser Prompt
Before invoking the browser's native `navigator.mediaDevices.getUserMedia` dialog, Scaly presents an in-app permission modal:
- **Title**: *Camera Access Needed*
- **Description**: Explains transparently that the camera feed is processed exclusively client-side to decode chassis-etched QR codes and is never recorded, transmitted, or stored.
- **Actions**:
  - **"Allow Camera"**: Tapping this invokes `navigator.mediaDevices.getUserMedia` to trigger the browser's native prompt.
  - **"Not Now"**: Closes the prompt modal and routes directly to the manual **"Enter Instrument ID"** input with 5 pre-embedded simulated presets and a persistent **"Enable Camera"** link to reopen the permission request anytime.

### 2. Comprehensive Handling of Browser Native Prompt Outcomes
- **Granted**: Closes all modal prompts and immediately starts the live camera viewfinder and real-time QR decoding engine.
- **Denied**: If the user or browser denies access (`NotAllowedError`), an inline banner is displayed:
  > *"Camera access was denied. You can enable it in your browser's site settings, or enter the Instrument ID manually below."*
  along with an **Enable Camera / Retry** button and the manual entry field.
- **No Camera Detected**: If the user is on a desktop system or workstation without a webcam (`NotFoundError` or 0 `videoinput` devices), Scaly cleanly displays:
  > *"No camera detected on this device."*
  and defaults to manual Instrument ID entry and factory preset chips.

### 3. Immediate Video Track Teardown
All video tracks (`MediaStreamTrack.stop()`) and scanner instances (`Html5Qrcode.stop()`) are explicitly terminated when:
1. A QR code is successfully decoded.
2. The user closes the scanner modal.
3. The page is backgrounded or navigated away (`visibilitychange` / `beforeunload`).
This guarantees that the hardware camera LED indicator light does not remain active in the background.

### 4. Audio Confirmation
Decoded QR codes immediately synthesize an acoustic confirmation chime (A5 to E6 interval) via the native **Web Audio API** (`OscillatorNode` + `GainNode`), with automatic fallback.

---

## 🚀 GitHub Pages Deployment Guide

### Secure Context (HTTPS) Requirement
> ⚠️ **Important Note on `getUserMedia`**: Hardware camera access via the browser's `navigator.mediaDevices.getUserMedia` API **only functions in a Secure Context** (`https://` or `localhost`).
> - Camera access **will NOT work** if the application is opened over plain unencrypted `http://` (unless `localhost`) or as a local `file:///` path.
> - When deployed to **GitHub Pages**, GitHub automatically serves the entire site over **HTTPS**, satisfying the secure context requirement for webcams and mobile cameras.

### Relative Subpath Asset Resolution
When deploying to a GitHub Pages repository subpath (e.g., `https://<username>.github.io/<repo-name>/`), hardcoded absolute asset paths (like `/assets/index.js`) result in 404 errors. 

Scaly is configured with:
```ts
// vite.config.ts
export default defineConfig(() => {
  return {
    base: process.env.VITE_BASE_PATH || './',
    ...
  };
});
```
This ensures all script, stylesheet, font, and asset references resolve relative to the deployment directory (`./assets/...`), allowing the bundle to function on custom domains, root URLs, and repository subpaths without modification.

### Bundled Scanning Dependencies
The scanning engine (`html5-qrcode`) is installed as a direct project dependency and bundled into the production JavaScript bundle during `npm run build`. No external unpinned CDN scripts or root-path-dependent runtime scripts are loaded.

### Building & Deploying
```bash
# Install dependencies
npm install

# Build static distribution
npm run build

# Preview build locally
npm run preview
```
The output directory `dist/` contains the complete static site ready for GitHub Pages deployment.
