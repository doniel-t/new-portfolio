"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";
import { COMMANDS, executeCommand } from "./commands";
import type { Command } from "./commands";
import type { Project } from "./types";

type TerminalProps = {
  projects: Project[];
  selectedIndex: number;
  onSelectProject: (index: number) => void;
  onOpenProject: (index: number) => void;
  isBooted: boolean;
  onBootComplete: () => void;
  isMobile: boolean;
  isExpanded: boolean;
};

type CommandEntry = {
  input: string;
  output: string;
};

const EXTRA_COMMANDS: Command[] = [
  {
    name: "open",
    description: "Open the selected project dossier",
    output: "",
  },
  {
    name: "next",
    description: "Move to the next project",
    output: "",
  },
  {
    name: "prev",
    description: "Move to the previous project",
    output: "",
  },
];

const TERMINAL_COMMANDS = [...COMMANDS, ...EXTRA_COMMANDS];
const BOOT_LINES = ["mount /work", "scan records", "attach preview pane", "ready"];
const OPEN_DELAY_MS = 180;

type ProjectRowProps = {
  index: number;
  project: Project;
  isSelected: boolean;
  isOpening: boolean;
  isMobile: boolean;
  onSelectProject: (index: number) => void;
  onOpenProject: (index: number) => void;
};

const ProjectRow = React.memo(function ProjectRow({
  index,
  project,
  isSelected,
  isOpening,
  isMobile,
  onSelectProject,
  onOpenProject,
}: ProjectRowProps) {
  const techPreview = project.techStack.slice(0, 2).join(" / ");

  const handlePointerEnter = useCallback(() => {
    if (!isMobile) {
      onSelectProject(index);
    }
  }, [index, isMobile, onSelectProject]);

  const handleClick = useCallback(() => {
    onSelectProject(index);
    onOpenProject(index);
  }, [index, onOpenProject, onSelectProject]);

  return (
    <button
      type="button"
      onClick={handleClick}
      onMouseEnter={handlePointerEnter}
      className={`group relative grid w-full grid-cols-[3.25rem_minmax(0,1fr)_auto] items-center gap-3 border-l-2 px-3 py-2.5 text-left font-mono text-xs transition-colors ${
        isOpening
          ? "border-l-[#f6f4ef] bg-[#f6f4ef] text-[#0d0b08]"
          : isSelected
            ? "border-l-[#d4cdc4] bg-[#d4cdc4]/10 text-[#f1ede5]"
            : "border-l-transparent text-[#d4cdc4]/60 hover:border-l-[#d4cdc4]/30 hover:bg-[#d4cdc4]/5 hover:text-[#d4cdc4]/85"
      }`}
      aria-selected={isSelected}
      role="option"
    >
      <span className="tracking-[0.22em]">{String(index + 1).padStart(2, "0")}</span>
      <span className="min-w-0">
        <span className="block truncate tracking-[0.14em]">{project.title}</span>
        <span className={`block truncate text-[10px] ${isOpening ? "text-[#0d0b08]/60" : "text-[#d4cdc4]/35"}`}>
          {techPreview}
        </span>
      </span>
      <span className={`text-[10px] tracking-[0.18em] ${isSelected ? "opacity-100" : "opacity-35"}`}>
        OPEN
      </span>
    </button>
  );
});

function BarebonesTerminal({
  projects,
  selectedIndex,
  onSelectProject,
  onOpenProject,
  isBooted,
  onBootComplete,
  isMobile,
  isExpanded,
}: TerminalProps) {
  const selectedProject = projects[selectedIndex] ?? projects[0];
  const [inputValue, setInputValue] = useState("");
  const [commandHistory, setCommandHistory] = useState<CommandEntry[]>([
    {
      input: "system",
      output: "Work console is listening. Try /help, /next, /prev, or /open.",
    },
  ]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [openingIndex, setOpeningIndex] = useState<number | null>(null);
  const inputFocusedRef = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const openTimeoutRef = useRef<number | null>(null);

  const filteredCommands = useMemo(() => {
    if (!inputValue.startsWith("/")) {
      return [];
    }

    const commandName = inputValue.slice(1).toLowerCase();
    return TERMINAL_COMMANDS.filter(
      (command) => command.name.startsWith(commandName) && command.name !== commandName
    );
  }, [inputValue]);

  useEffect(() => {
    if (isBooted) {
      return;
    }

    const timer = window.setTimeout(onBootComplete, isMobile ? 0 : 420);
    return () => window.clearTimeout(timer);
  }, [isBooted, isMobile, onBootComplete]);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [commandHistory]);

  useEffect(() => {
    return () => {
      if (openTimeoutRef.current !== null) {
        window.clearTimeout(openTimeoutRef.current);
      }
    };
  }, []);

  const triggerOpenProject = useCallback(
    (index: number) => {
      if (openTimeoutRef.current !== null) {
        window.clearTimeout(openTimeoutRef.current);
      }

      setOpeningIndex(index);
      openTimeoutRef.current = window.setTimeout(() => {
        setOpeningIndex(null);
        openTimeoutRef.current = null;
        onOpenProject(index);
      }, OPEN_DELAY_MS);
    },
    [onOpenProject]
  );

  const appendHistory = useCallback((entry: CommandEntry) => {
    setCommandHistory((history) => [...history, entry].slice(-6));
  }, []);

  const handleCommandSubmit = useCallback(() => {
    const commandInput = inputValue.trim();
    const commandName = commandInput.startsWith("/") ? commandInput.slice(1).toLowerCase() : "";

    if (!commandInput) {
      return;
    }

    if (commandName === "open") {
      appendHistory({
        input: commandInput,
        output: `Opening ${selectedProject.title}.`,
      });
      triggerOpenProject(selectedIndex);
    } else if (commandName === "next") {
      const nextIndex = Math.min(projects.length - 1, selectedIndex + 1);
      onSelectProject(nextIndex);
      appendHistory({
        input: commandInput,
        output: `Selected ${projects[nextIndex]?.title ?? "last record"}.`,
      });
    } else if (commandName === "prev") {
      const nextIndex = Math.max(0, selectedIndex - 1);
      onSelectProject(nextIndex);
      appendHistory({
        input: commandInput,
        output: `Selected ${projects[nextIndex]?.title ?? "first record"}.`,
      });
    } else {
      const result = executeCommand(commandInput);

      if (!result) {
        appendHistory({
          input: commandInput,
          output: "[ERROR] Unknown command. Type /help for available commands.",
        });
      } else if (result.clear) {
        setCommandHistory([]);
      } else {
        appendHistory({ input: commandInput, output: result.output });
      }
    }

    setInputValue("");
    setShowSuggestions(false);
  }, [
    appendHistory,
    inputValue,
    onSelectProject,
    projects,
    selectedIndex,
    selectedProject.title,
    triggerOpenProject,
  ]);

  const handleInputKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        event.preventDefault();
        handleCommandSubmit();
      } else if (event.key === "Tab" && filteredCommands.length > 0) {
        event.preventDefault();
        setInputValue(`/${filteredCommands[0].name}`);
        setShowSuggestions(false);
      } else if (event.key === "Escape") {
        setShowSuggestions(false);
        inputRef.current?.blur();
      }
    },
    [filteredCommands, handleCommandSubmit]
  );

  const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const nextValue = event.target.value;
    setInputValue(nextValue);
    setShowSuggestions(nextValue.startsWith("/") && nextValue.length > 1);
  }, []);

  useEffect(() => {
    if (isMobile) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (inputFocusedRef.current) {
        return;
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        onSelectProject(Math.max(0, selectedIndex - 1));
      } else if (event.key === "ArrowDown") {
        event.preventDefault();
        onSelectProject(Math.min(projects.length - 1, selectedIndex + 1));
      } else if (event.key === "Enter") {
        event.preventDefault();
        triggerOpenProject(selectedIndex);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMobile, onSelectProject, projects.length, selectedIndex, triggerOpenProject]);

  return (
    <div className="relative flex h-full min-h-[500px] w-full flex-col overflow-hidden bg-[#0d0b08] text-[#d4cdc4]">
      <div className="pointer-events-none absolute inset-0 cctv-noise-dark opacity-60" />
      <div className="pointer-events-none absolute inset-0 terminal-scanline-dark opacity-50" />

      <header className="relative z-[1] flex h-11 items-center justify-between border-b border-[#d4cdc4]/15 bg-[#16130f]/95 px-3 sm:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <div className="grid size-4 place-items-center border border-[#d4cdc4]/30">
            <div className="size-1.5 bg-[#7a9a5a]" />
          </div>
          <div className="min-w-0 font-mono text-[10px] uppercase tracking-[0.22em] text-[#d4cdc4]/75 sm:text-xs">
            <span className="hidden sm:inline">donel@work-archive</span>
            <span className="sm:hidden">work-archive</span>
          </div>
        </div>
        <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#d4cdc4]/45">
          {isExpanded ? "fullscreen" : "standby"} / {projects.length} records
        </div>
      </header>

      <main className="relative z-[1] grid min-h-0 flex-1 grid-rows-[minmax(0,1fr)_auto] lg:grid-cols-[minmax(320px,0.95fr)_minmax(0,1.05fr)] lg:grid-rows-1">
        <section
          data-lenis-prevent
          className="min-h-0 overflow-y-auto border-b border-[#d4cdc4]/10 p-4 font-mono terminal-scrollbar sm:p-5 lg:border-b-0 lg:border-r"
        >
          <div className="mb-5 grid gap-1 text-[10px] uppercase tracking-[0.2em] text-[#d4cdc4]/40">
            {BOOT_LINES.map((line, index) => (
              <div key={line} className="flex items-center gap-2">
                <span className={isBooted || index < 3 ? "text-[#7a9a5a]" : "text-[#d4cdc4]/35"}>
                  {isBooted || index < 3 ? "OK" : "--"}
                </span>
                <span>{line}</span>
              </div>
            ))}
          </div>

          <div className="mb-3 flex items-end justify-between gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.26em] text-[#d4cdc4]/40">
                project index
              </p>
              <h3 className="mt-1 font-display text-2xl leading-none tracking-tight text-[#f1ede5] sm:text-3xl">
                Work Console
              </h3>
            </div>
            <p className="hidden max-w-[16rem] text-right text-[10px] uppercase leading-relaxed tracking-[0.16em] text-[#d4cdc4]/35 sm:block">
              arrows select / enter opens / slash commands available
            </p>
          </div>

          <div className="space-y-1" role="listbox" aria-label="Project archive records">
            {projects.map((project, index) => (
              <ProjectRow
                key={project.id}
                index={index}
                project={project}
                isSelected={selectedIndex === index}
                isOpening={openingIndex === index}
                isMobile={isMobile}
                onSelectProject={onSelectProject}
                onOpenProject={triggerOpenProject}
              />
            ))}
          </div>
        </section>

        <section
          data-lenis-prevent
          className="relative min-h-0 overflow-y-auto p-4 terminal-scrollbar sm:p-5"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedProject.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className="flex min-h-full flex-col"
            >
              <div className="mb-4 border border-[#d4cdc4]/15 bg-[#d4cdc4]/[0.03] p-4">
                <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#7a9a5a]/80">
                      selected record
                    </p>
                    <h3 className="mt-1 font-display text-3xl leading-tight text-[#f1ede5] sm:text-4xl">
                      {selectedProject.title}
                    </h3>
                  </div>
                  <span className="border border-[#d4cdc4]/15 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-[#d4cdc4]/55">
                    {selectedProject.year}
                  </span>
                </div>

                <p className="text-sm leading-relaxed text-[#d4cdc4]/70">
                  {selectedProject.description}
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {selectedProject.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="border border-[#d4cdc4]/15 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-[#d4cdc4]/60"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-4 grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => triggerOpenProject(selectedIndex)}
                  className="border border-[#d4cdc4]/20 bg-[#d4cdc4]/10 px-4 py-3 font-mono text-xs uppercase tracking-[0.2em] text-[#f1ede5] transition-colors hover:bg-[#d4cdc4]/18"
                >
                  open dossier
                </button>
                <div className="grid grid-cols-2 gap-3">
                  {selectedProject.repoUrl ? (
                    <a
                      href={selectedProject.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 border border-[#d4cdc4]/15 px-3 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-[#d4cdc4]/70 transition-colors hover:bg-[#d4cdc4]/10"
                    >
                      <Github size={15} />
                      repo
                    </a>
                  ) : (
                    <span className="flex items-center justify-center border border-[#d4cdc4]/10 px-3 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-[#d4cdc4]/25">
                      repo
                    </span>
                  )}
                  {selectedProject.liveUrl ? (
                    <a
                      href={selectedProject.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 border border-[#d4cdc4]/15 px-3 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-[#d4cdc4]/70 transition-colors hover:bg-[#d4cdc4]/10"
                    >
                      <ExternalLink size={15} />
                      live
                    </a>
                  ) : (
                    <span className="flex items-center justify-center border border-[#d4cdc4]/10 px-3 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-[#d4cdc4]/25">
                      live
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-auto border border-[#d4cdc4]/15 bg-[#050403]/70 p-3 font-mono">
                <div
                  ref={outputRef}
                  data-lenis-prevent
                  className="max-h-28 overflow-y-auto pr-2 text-[11px] leading-relaxed terminal-scrollbar"
                  aria-live="polite"
                >
                  {commandHistory.map((entry, index) => (
                    <div key={`${entry.input}-${index}`} className="mb-2">
                      <div className="text-[#d4cdc4]/70">&gt; {entry.input}</div>
                      <div className="whitespace-pre-wrap text-[#d4cdc4]/45">{entry.output}</div>
                    </div>
                  ))}
                </div>

                <div className="relative mt-3">
                  {showSuggestions && filteredCommands.length > 0 && (
                    <div className="absolute bottom-full left-0 mb-2 w-full border border-[#d4cdc4]/15 bg-[#16130f]">
                      {filteredCommands.map((command) => (
                        <button
                          key={command.name}
                          type="button"
                          onMouseDown={(event) => {
                            event.preventDefault();
                            setInputValue(`/${command.name}`);
                            setShowSuggestions(false);
                            inputRef.current?.focus();
                          }}
                          className="flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-[10px] uppercase tracking-[0.16em] text-[#d4cdc4]/55 hover:bg-[#d4cdc4]/10 hover:text-[#d4cdc4]/85"
                        >
                          <span>/{command.name}</span>
                          <span className="truncate text-[#d4cdc4]/30">{command.description}</span>
                        </button>
                      ))}
                    </div>
                  )}
                  <label className="flex items-center gap-2 border-t border-[#d4cdc4]/15 pt-3 text-xs text-[#d4cdc4]/75">
                    <span className="select-none">&gt;</span>
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputValue}
                      onChange={handleInputChange}
                      onKeyDown={handleInputKeyDown}
                      onFocus={() => {
                        inputFocusedRef.current = true;
                      }}
                      onBlur={() => {
                        inputFocusedRef.current = false;
                        window.setTimeout(() => setShowSuggestions(false), 120);
                      }}
                      placeholder="/help"
                      spellCheck={false}
                      autoComplete="off"
                      className="min-w-0 flex-1 bg-transparent font-mono text-xs tracking-[0.08em] text-[#f1ede5] outline-none placeholder:text-[#d4cdc4]/25"
                    />
                  </label>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </section>
      </main>
    </div>
  );
}

export default BarebonesTerminal;
