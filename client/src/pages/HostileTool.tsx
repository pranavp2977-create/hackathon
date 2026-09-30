// client/src/pages/HostileTool.tsx
import React, { useState, useEffect, useRef } from 'react';
import { 
  AlertTriangle, 
  Flame, 
  Skull, 
  RefreshCw,
  Lock,
  Zap
} from 'lucide-react';

export const HostileTool: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [conversionType, setConversionType] = useState('rot13');
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusText, setStatusText] = useState('PARSING CIPHER BLOCKS...');
  const [progressWidth, setProgressWidth] = useState(0);
  const [buttonOffset, setButtonOffset] = useState({ x: 0, y: 0 });

  const isAlertingRef = useRef(false);
  const isProcessingRef = useRef(false);
  const inputTextRef = useRef('');

  useEffect(() => {
    inputTextRef.current = inputText;
  }, [inputText]);

  // Aggressive session erasure listeners
  useEffect(() => {
    const handleFocusLoss = (eventType: string) => {
      if (isAlertingRef.current || isProcessingRef.current) return;
      if (inputTextRef.current.length > 0) {
        setInputText('');
        isAlertingRef.current = true;
        window.alert(
          `[SECURITY PROTOCOL ENGAGED - FOCUS VIOLATION]: Window focus was lost (${eventType}). ` +
          `In accordance with strict ephemeral security policy, all volatile buffer memory has been zeroed out to prevent credential harvesting. Returning to blank state.`
        );
        isAlertingRef.current = false;
      }
    };

    const onBlur = () => handleFocusLoss('WINDOW_BLUR_DETECTED');
    const onVisibilityChange = () => {
      if (document.hidden) handleFocusLoss('TAB_SWITCH_OR_MINIMIZE');
    };
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (inputTextRef.current.length > 0) {
        e.preventDefault();
        e.returnValue = "Warning: Leaving this page deletes your progress forever.";
        return e.returnValue;
      }
    };

    window.addEventListener('blur', onBlur);
    document.addEventListener('visibilitychange', onVisibilityChange);
    window.addEventListener('beforeunload', onBeforeUnload);

    return () => {
      window.removeEventListener('blur', onBlur);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('beforeunload', onBeforeUnload);
    };
  }, []);

  // Moving button evasion
  const handleMouseEnterRealBtn = () => {
    const offsetX = (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 6) + 5);
    const offsetY = (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 6) + 5);
    setButtonOffset({ x: offsetX, y: offsetY });
  };

  // Accidental reset trap
  const handleTrapClick = () => {
    setInputText('');
    isAlertingRef.current = true;
    window.alert(
      "[FATAL EXCEPTION - ACCIDENTAL PURGE]: You activated the primary reset sequence. " +
      "All text area contents have been purged from volatile RAM.\n\nNotice: You must re-type your payload from scratch."
    );
    isAlertingRef.current = false;
  };

  // Core transformation
  const executeTransformation = (text: string, algo: string) => {
    switch(algo) {
      case 'rot13':
        return text.replace(/[a-zA-Z]/g, (c) => {
          const base = c <= 'Z' ? 65 : 97;
          return String.fromCharCode(((c.charCodeAt(0) - base + 13) % 26) + base);
        });
      case 'binary':
        return text.split('').map(c => c.charCodeAt(0).toString(2).padStart(8, '0')).join(' ');
      case 'base64':
        try {
          return btoa(unescape(encodeURIComponent(text)));
        } catch {
          return 'ERROR_CODEC_FAILURE';
        }
      case 'inverse':
        return text.split('').map((c, i) => (i % 2 === 0 ? c.toLowerCase() : c.toUpperCase())).join('');
      case 'reverse':
        return text.split('').reverse().join('');
      case 'strip':
        return text.replace(/[^a-zA-Z0-9]/g, '');
      default:
        return text.toUpperCase();
    }
  };

  // Cold system warnings
  const SYSTEM_WARNING_TEMPLATES = [
    "Confirming deep overwrite of volatile system buffer. Click OK to advance state.",
    "Verification of non-repudiation cryptographic certificate. Click OK to advance state.",
    "Mandatory acknowledgment of destructive memory reclamation protocol. Click OK to advance state.",
    "Under Section 104-B, proceeding waives all statutory rights to audit trail reconstruction. Click OK to advance state.",
    "Caching mechanisms disabled by hypervisor. Risk of irrecoverable bit-rot accepted. Click OK to advance state.",
    "Host system resources pinned to high-priority lock. System instability may occur. Click OK to advance state.",
    "Validating zero-knowledge ephemeral proof against root revocation authority. Click OK to advance state.",
    "Pseudorandom sequence entropy threshold verified. Proceeding with single-use pipeline. Click OK to advance state.",
    "Terminal authorization granted. Execution phase will consume execution slot irrevocably. Click OK to advance state.",
    "Final authorization handshake completed. No recovery vectors remain. Click OK to proceed."
  ];

  // Real action execution
  const handleRealActionClick = () => {
    const textToProcess = inputText;
    if (!textToProcess || textToProcess.trim().length === 0) {
      isAlertingRef.current = true;
      window.alert("[VALIDATION ERROR]: Cannot execute on zero-length payload. Textarea is empty.");
      isAlertingRef.current = false;
      return;
    }

    // 1. Hostile popup block (7 to 10 repetitions)
    const popupCount = Math.floor(Math.random() * 4) + 7;
    isAlertingRef.current = true;
    for (let i = 1; i <= popupCount; i++) {
      const template = SYSTEM_WARNING_TEMPLATES[(i - 1) % SYSTEM_WARNING_TEMPLATES.length];
      window.alert(`[SYSTEM EXCEPTION ${i}/${popupCount}]: ${template}`);
    }
    isAlertingRef.current = false;

    // 2. 5-second unskippable visual delay
    setIsProcessing(true);
    isProcessingRef.current = true;
    setProgressWidth(0);

    const delayPhrases = [
      "PARSING CIPHER BLOCKS...",
      "DEALLOCATING MEMORY TABLES...",
      "COMPUTING IRREVERSIBLE ENTROPY CHECKSUM...",
      "SYNCHRONIZING ATOMIC REGISTER STATES...",
      "PURGING RECOVERY STACK FRAMES..."
    ];

    let elapsedSeconds = 0;
    setStatusText(delayPhrases[0]);

    const intervalId = setInterval(() => {
      elapsedSeconds++;
      setProgressWidth(Math.min(elapsedSeconds * 20, 100));

      if (elapsedSeconds < delayPhrases.length) {
        setStatusText(delayPhrases[elapsedSeconds]);
      }

      if (elapsedSeconds >= 5) {
        clearInterval(intervalId);
        setIsProcessing(false);
        isProcessingRef.current = false;

        // Deliver result in final native alert
        const finalResult = executeTransformation(textToProcess, conversionType);
        isAlertingRef.current = true;
        window.alert(
          "[COMPLETION NOTICE]: Transformation executed successfully.\n\n" +
          "--------------------------------------------------\n" +
          "OUTPUT PAYLOAD:\n" +
          finalResult + "\n" +
          "--------------------------------------------------\n\n" +
          "CRITICAL WARNING: This alert is your sole opportunity to capture output. " +
          "All tool states and input fields will now be irrevocably zeroed out."
        );
        isAlertingRef.current = false;

        // Zero out inputs
        setInputText('');
        setButtonOffset({ x: 0, y: 0 });
      }
    }, 1000);
  };

  return (
    <div 
      className="min-h-screen bg-black text-[#39ff14] font-mono p-4 flex flex-col items-center justify-start select-text"
      style={{ scrollbarWidth: 'thin', scrollbarColor: '#ff0055 #000000' }}
    >
      <div className="w-full max-w-3xl bg-[#030802] border-t-4 border-dashed border-t-[#ff0055] border-r-8 border-r-[#39ff14] border-b-6 border-double border-b-[#00ffff] border-l-5 border-dotted border-l-[#ffff00] p-6 shadow-[12px_12px_0px_#220011,-8px_-8px_0px_#002211] my-4">
        {/* Banner */}
        <div className="bg-[#ff0055] text-white font-black text-xs py-1.5 px-3 uppercase tracking-wider mb-4 border-2 border-[#ffff00] flex justify-between items-center">
          <span>[SECURITY NODE: 0x992B]</span>
          <span>SINGLE-USE TRANSACTION GATEWAY</span>
          <span>IP LOGGED</span>
        </div>

        {/* Title */}
        <div className="border-b-2 border-dashed border-[#ff0055] pb-3 mb-4">
          <h1 className="text-xl font-black text-[#ffff00] uppercase drop-shadow-[2px_2px_0px_#ff0055]">
            STRICT ENCRYPTION & DATA SANITIZER
          </h1>
          <p className="text-[11px] text-gray-500 mt-1">
            AUTHORIZATION LEVEL: ONE-TIME VOLATILE ALLOCATION. STATE RETENTION PERMANENTLY INHIBITED.
          </p>
        </div>

        {/* Legal Warning Box */}
        <div className="bg-[#1a0007] border-2 border-[#ff2222] text-[#ff99aa] p-3 text-xs leading-relaxed mb-4">
          <strong className="text-[#ff2222] uppercase">CRITICAL REPOSITORY PROTOCOL [NO RETENTION GUARANTEE]:</strong><br />
          Leaving this viewport, toggling active application focus, pressing system backspace excessively, or attempting background caching invokes an immediate cryptographic zero-fill. Progress cannot be saved, restored, or audited.
        </div>

        {/* Form Controls */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-black text-[#00ffff] uppercase mb-1">
              Transformation Algorithm Selection:
            </label>
            <select
              value={conversionType}
              onChange={(e) => setConversionType(e.target.value)}
              className="w-full bg-black text-[#ffff00] border-2 border-[#39ff14] p-2 text-xs font-bold outline-none cursor-pointer"
            >
              <option value="rot13">ALGO-01: ROT-13 Cryptographic Offset</option>
              <option value="binary">ALGO-02: 8-Bit Binary ASCII Encoding</option>
              <option value="base64">ALGO-03: RFC-4648 Base64 Stream Encoding</option>
              <option value="inverse">ALGO-04: InVeRsE CaSe Alternating Sanitization</option>
              <option value="reverse">ALGO-05: Strict Sequence Reversion (Reverse)</option>
              <option value="strip">ALGO-06: Destructive Delimiter & Control Strip</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-black text-[#00ffff] uppercase mb-1">
              Input String Payload:
            </label>
            <span className="block text-[10px] text-[#ff2222] font-bold mb-2">
              WARNING: LEAVING THIS PAGE DELETES YOUR PROGRESS FOREVER. DO NOT ATTEMPT TO RELOAD.
            </span>
            <textarea
              rows={4}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              autoComplete="new-password"
              data-lpignore="true"
              placeholder="[REQUIRED]: Input string payload here. All input resides exclusively in volatile RAM. Moving window focus triggers self-destruction."
              className="w-full bg-black text-[#39ff14] border-4 border-[#ff0055] p-3 text-xs leading-relaxed outline-none focus:border-[#ffff00] shadow-[inset_4px_4px_0px_#1a0007]"
            />
          </div>

          {/* Action Cluster */}
          <div className="pt-4 border-t-2 border-dotted border-[#39ff14] flex flex-col gap-4">
            {/* Primary Trap Button */}
            <button
              type="button"
              onClick={handleTrapClick}
              className="w-full py-4 px-6 bg-gradient-to-r from-[#39ff14] to-[#00ffff] hover:from-[#00ffff] hover:to-[#39ff14] text-black font-black text-sm uppercase border-4 border-white shadow-[0px_0px_20px_#39ff14,6px_6px_0px_#ff0055] transition transform hover:scale-[1.02] cursor-pointer"
            >
              ► CONVERT & PROCESS STRING (PRIMARY ACTION) ◄
            </button>

            {/* Disguised Real Functional Button */}
            <div className="flex justify-center py-2 relative">
              <button
                type="button"
                onClick={handleRealActionClick}
                onMouseEnter={handleMouseEnterRealBtn}
                style={{
                  transform: `translate(${buttonOffset.x}px, ${buttonOffset.y}px)`
                }}
                className="bg-[#0a0a0a] text-gray-500 hover:text-gray-400 border border-dashed border-[#333333] hover:border-[#555555] text-[10px] py-1.5 px-3 cursor-pointer opacity-70 hover:opacity-100 transition-transform duration-100"
              >
                [-- execute irreversible transformation sequence [secondary/deprecated] --]
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 text-[9px] text-gray-600 text-center">
          TERMINAL SESSION ID: SEC-88091-REV-4 • ENFORCING HOSTILE INTERACTION DIRECTIVES • DO NOT RETURN
        </div>
      </div>

      {/* 5-Second Modal Delay Spinner */}
      {isProcessing && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-6 text-center select-none">
          <div className="w-16 h-16 border-6 border-[#111111] border-t-[#ff0055] border-r-[#39ff14] rounded-full animate-spin mb-6" />
          <div className="text-[#ff2222] text-sm font-black uppercase tracking-widest mb-3">
            [SYSTEM DELAY IN PROGRESS]
          </div>
          <div className="text-[#ffff00] text-xs font-bold mb-5 min-h-[20px]">
            {statusText}
          </div>
          <div className="w-72 h-3 bg-[#111111] border-2 border-[#39ff14] overflow-hidden">
            <div 
              className="h-full bg-[#ff0055] transition-all duration-300"
              style={{ width: `${progressWidth}%` }}
            />
          </div>
          <p className="text-[10px] text-gray-500 mt-4 max-w-xs">
            SYSTEM BUFFER LOCKED. DO NOT CLOSE OR REFRESH BROWSER WINDOW DURING IRREVERSIBLE CRYPTOGRAPHIC PASS.
          </p>
        </div>
      )}
    </div>
  );
};

export default HostileTool;
