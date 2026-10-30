"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Terminal, X, ArrowRight, CornerDownLeft } from "lucide-react";
import { getMotionPreference, setMotionPreference } from "@/hooks/usePrefersReducedMotion";

interface CommandHistoryItem {
  command: string;
  output: React.ReactNode;
}

export default function DeveloperTerminal() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputVal, setInputVal] = useState("");
  const [history, setHistory] = useState<CommandHistoryItem[]>([
    {
      command: "welcome",
      output: (
        <div className="space-y-1 text-[#FFF3E6]/85">
          <p className="text-[#C6F277] font-bold">
            FORM / SHIFT &bull; Developer Diagnostics Console [v1.0.4]
          </p>
          <p className="text-[#FFF3E6]/60">
            Type <span className="text-[#C6F277] font-semibold">&apos;help&apos;</span> to inspect supported commands. Press <span className="text-[#FFF3E6]/80 font-semibold">ESC</span> or type <span className="text-[#C6F277] font-semibold">&apos;exit&apos;</span> to return.
          </p>
        </div>
      ),
    },
  ]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Open / Close modal handler
  const openTerminal = useCallback(() => {
    previousActiveElement.current = document.activeElement as HTMLElement;
    setIsOpen(true);
  }, []);

  const closeTerminal = useCallback(() => {
    setIsOpen(false);
    if (previousActiveElement.current) {
      previousActiveElement.current.focus();
    }
  }, []);

  // Global Keyboard listener for Ctrl+K / Cmd+K and custom trigger event
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Ctrl+K (Windows/Linux) or Cmd+K (macOS)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((prev) => {
          if (!prev) {
            previousActiveElement.current = document.activeElement as HTMLElement;
            return true;
          } else {
            if (previousActiveElement.current) previousActiveElement.current.focus();
            return false;
          }
        });
      }

      // Close on Escape if open
      if (e.key === "Escape" && isOpen) {
        e.preventDefault();
        closeTerminal();
      }
    };

    const handleCustomOpen = () => {
      openTerminal();
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("open-developer-terminal", handleCustomOpen);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("open-developer-terminal", handleCustomOpen);
    };
  }, [isOpen, openTerminal, closeTerminal]);

  // Handle body scroll lock & autofocus when terminal toggles
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      // Focus input
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 50);

      return () => {
        document.body.style.overflow = originalOverflow;
        clearTimeout(timer);
      };
    }
  }, [isOpen]);

  // Auto-scroll to bottom of command history
  useEffect(() => {
    if (isOpen) {
      terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [history, isOpen]);

  // Command Execution strictly using an allowlist (Zero dynamic eval / safe execution)
  const executeCommand = (cmdStr: string) => {
    const raw = cmdStr.trim();
    if (!raw) return;

    // Track command history for Up/Down arrows
    setCommandHistory((prev) => [...prev, raw]);
    setHistoryIndex(-1);

    const normalized = raw.toLowerCase();

    let resultOutput: React.ReactNode = null;

    switch (normalized) {
      case "help":
        resultOutput = (
          <div className="space-y-1.5 text-xs text-[#FFF3E6]/80">
            <p className="text-[#C6F277] font-bold uppercase tracking-wider">
              Available Console Commands:
            </p>
            <div className="grid grid-cols-[100px_1fr] gap-x-2 gap-y-1 font-mono">
              <span className="text-[#C6F277]">help</span>
              <span>List all supported commands</span>
              <span className="text-[#C6F277]">motion</span>
              <span>Toggle motion mode [full | reduced | system]</span>
              <span className="text-[#C6F277]">intro</span>
              <span>Replay the cinematic digital awakening</span>
              <span className="text-[#C6F277]">about</span>
              <span>Factual engineering profile of Khaled Amr</span>
              <span className="text-[#C6F277]">projects</span>
              <span>Navigate directly to the Project Observatory</span>
              <span className="text-[#C6F277]">secret</span>
              <span>Reveal transmission from behind the interface</span>
              <span className="text-[#C6F277]">clear</span>
              <span>Clear current terminal buffer</span>
              <span className="text-[#C6F277]">exit</span>
              <span>Close terminal session</span>
            </div>
          </div>
        );
        break;

      case "about":
        resultOutput = (
          <div className="space-y-2 text-xs leading-relaxed text-[#FFF3E6]/85 border-l-2 border-[#C6F277]/60 pl-3 py-1">
            <div className="font-bold text-[#C6F277] tracking-wider uppercase">
              KHALED AMR &bull; FRONTEND ARCHITECT & CREATIVE DEVELOPER
            </div>
            <p>
              Based in Alexandria, Egypt (31.2001&deg; N, 29.9187&deg; E). Specializes in high-performance Next.js architectures, engineered GSAP motion choreography, bespoke design systems, and Arabic/English bilingual RTL storefronts.
            </p>
            <p className="text-[#FFF3E6]/60 font-mono text-[11px]">
              Flagship Works: Code Systems SW, El Almia Leather, Retone Color Engine, Chronos Engine.
            </p>
          </div>
        );
        break;

      case "projects":
        resultOutput = (
          <div className="text-xs text-[#C6F277] space-y-1">
            <p>&gt; Navigating to #work (Project Observatory)...</p>
            <p className="text-[#FFF3E6]/60">Redirecting viewport stage now.</p>
          </div>
        );
        setTimeout(() => {
          closeTerminal();
          const workEl = document.getElementById("work");
          if (workEl) {
            workEl.scrollIntoView({ behavior: "smooth" });
          } else {
            window.location.hash = "work";
          }
        }, 350);
        break;

      case "secret":
        resultOutput = (
          <div className="p-3 border border-[#C6F277]/30 bg-[#381932]/70 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-[#C6F277] font-bold">
              <span className="w-2 h-2 rounded-full bg-[#C6F277] animate-pulse" />
              <span>TRANSMISSION UNLOCKED // ARCHITECTURAL KERNEL</span>
            </div>
            <p className="font-serif italic text-sm text-[#FFF3E6]/95 leading-snug">
              &ldquo;Software should feel alive. I engineer digital interfaces where structural rigor and kinetic motion operate as one seamless medium.&rdquo;
            </p>
            <p className="font-mono text-[10px] text-[#FFF3E6]/50">
              [15 production codebases verified &bull; Zero layout shift &bull; Crafted in Alexandria]
            </p>
          </div>
        );
        break;

      case "clear":
        setHistory([]);
        setInputVal("");
        return;

      case "motion":
      case "motion on":
      case "motion full":
      case "motion off":
      case "motion reduced":
      case "motion system": {
        let newPref: "full" | "reduced" | "system" = "full";
        if (normalized === "motion off" || normalized === "motion reduced") {
          newPref = "reduced";
        } else if (normalized === "motion system") {
          newPref = "system";
        } else if (normalized === "motion on" || normalized === "motion full") {
          newPref = "full";
        } else {
          const current = getMotionPreference();
          newPref = current === "full" ? "reduced" : "full";
        }
        setMotionPreference(newPref);
        resultOutput = (
          <div className="text-xs space-y-1 font-mono">
            <p className="text-[#C6F277] font-bold">
              &gt; MOTION CHOREOGRAPHY: [{newPref.toUpperCase()}]
            </p>
            <p className="text-[#FFF3E6]/75">
              {newPref === "full"
                ? "Full kinetic sequences, 3D tilt physics, and GSAP scroll choreography enabled."
                : newPref === "reduced"
                ? "Reduced motion active. Accessible static layouts and transitions enforced."
                : "Synchronized with operating system prefers-reduced-motion media query."}
            </p>
          </div>
        );
        break;
      }

      case "intro":
      case "replay": {
        resultOutput = (
          <div className="text-xs text-[#C6F277] space-y-1 font-mono">
            <p>&gt; Rebooting Digital Awakening sequence...</p>
          </div>
        );
        setTimeout(() => {
          closeTerminal();
          window.location.reload();
        }, 300);
        break;
      }

      case "exit":
        closeTerminal();
        setInputVal("");
        return;

      default:
        resultOutput = (
          <div className="text-xs text-[#FF8585]/90 space-y-1 font-mono">
            <p>Command not recognized: &quot;{raw}&quot;</p>
            <p className="text-[#FFF3E6]/50">
              Type <span className="text-[#C6F277] font-bold">&apos;help&apos;</span> to view the command allowlist.
            </p>
          </div>
        );
        break;
    }

    setHistory((prev) => [...prev, { command: raw, output: resultOutput }]);
    setInputVal("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      executeCommand(inputVal);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length === 0) return;
      const nextIdx =
        historyIndex === -1
          ? commandHistory.length - 1
          : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIdx);
      setInputVal(commandHistory[nextIdx] || "");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex === -1) return;
      const nextIdx = historyIndex + 1;
      if (nextIdx >= commandHistory.length) {
        setHistoryIndex(-1);
        setInputVal("");
      } else {
        setHistoryIndex(nextIdx);
        setInputVal(commandHistory[nextIdx] || "");
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Developer Diagnostics Terminal"
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-[#1b0a18]/75 backdrop-blur-md animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeTerminal();
      }}
    >
      {/* Terminal Window Container */}
      <div className="relative w-full max-w-2xl bg-[#240f20] border border-[#381932] shadow-2xl rounded-sm overflow-hidden flex flex-col max-h-[85vh]">
        {/* Title Bar */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-[#381932] border-b border-[#FFF3E6]/10 select-none">
          <div className="flex items-center gap-2.5">
            <Terminal className="w-4 h-4 text-[#C6F277]" />
            <span className="font-mono text-xs font-bold tracking-wider text-[#FFF3E6] uppercase">
              khaled_amr // console.sh
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline font-mono text-[10px] text-[#FFF3E6]/50 uppercase tracking-widest">
              [ESC TO CLOSE]
            </span>
            <button
              type="button"
              onClick={closeTerminal}
              aria-label="Close terminal"
              className="p-1 text-[#FFF3E6]/70 hover:text-[#C6F277] transition-colors cursor-pointer rounded-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C6F277]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Output Stream */}
        <div
          tabIndex={0}
          aria-label="Terminal History"
          className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 font-mono text-xs sm:text-sm text-[#FFF3E6] scrollbar-thin scrollbar-thumb-[#381932] scrollbar-track-transparent focus:outline-none"
        >
          {history.map((item, idx) => (
            <div key={idx} className="space-y-1.5">
              <div className="flex items-center gap-2 text-[#C6F277]">
                <ArrowRight className="w-3.5 h-3.5 shrink-0 opacity-70" />
                <span className="text-[#FFF3E6]/60 font-semibold text-xs">
                  visitor@khaledamr:~$
                </span>
                <span className="font-bold text-[#FFF3E6]">{item.command}</span>
              </div>
              <div className="pl-5">{item.output}</div>
            </div>
          ))}
          <div ref={terminalEndRef} />
        </div>

        {/* Command Input Row */}
        <div className="flex items-center gap-2 px-4 py-3 bg-[#1b0a18]/90 border-t border-[#381932] font-mono text-xs sm:text-sm">
          <span className="text-[#C6F277] shrink-0 font-bold">
            visitor@khaledamr:~$
          </span>
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            aria-label="Terminal command prompt"
            placeholder="Type 'help' for commands..."
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            className="flex-1 bg-transparent text-[#FFF3E6] placeholder-[#FFF3E6]/30 outline-none caret-[#C6F277] font-mono text-xs sm:text-sm"
          />
          <button
            type="button"
            onClick={() => executeCommand(inputVal)}
            aria-label="Execute command"
            className="px-2 py-1 bg-[#381932] text-[#C6F277] hover:bg-[#421e3b] transition-colors rounded-xs text-[11px] font-bold flex items-center gap-1 cursor-pointer focus-visible:ring-1 focus-visible:ring-[#C6F277]"
          >
            <span>RUN</span>
            <CornerDownLeft className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
