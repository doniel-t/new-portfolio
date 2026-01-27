export type Command = {
  name: string;
  description: string;
  output: string;
};

export const COMMANDS: Command[] = [
  {
    name: "help",
    description: "List all available commands",
    output: "", // generated dynamically
  },
  {
    name: "about",
    description: "Short bio / intro",
    output:
      "YoRHa-designated operator — Full-stack developer specializing in modern web technologies. Building digital experiences with precision and purpose.",
  },
  {
    name: "contact",
    description: "Contact info / links",
    output:
      "◇ GitHub: github.com/DoNel-Lab\n◇ Email: daniel@donel.dev\n◇ LinkedIn: linkedin.com/in/donel",
  },
  {
    name: "skills",
    description: "Tech stack summary",
    output:
      "◇ Languages: TypeScript, JavaScript, Python, C#\n◇ Frontend: React, Next.js, Tailwind CSS, Framer Motion\n◇ Backend: Node.js, Express, PostgreSQL, MongoDB\n◇ Tools: Git, Docker, Figma, Vercel",
  },
  {
    name: "status",
    description: "System status report",
    output:
      "[SYSTEM STATUS]\n◇ Black Box: ONLINE\n◇ Combat Data: SYNCHRONIZED\n◇ Pod Connection: STABLE\n◇ Memory Leaks: NONE DETECTED\n◇ Uplink: NOMINAL\n◇ Glory to mankind.",
  },
  {
    name: "clear",
    description: "Clear command output history",
    output: "", // handled specially
  },
];

export function getHelpOutput(): string {
  return COMMANDS.map((cmd) => `  /${cmd.name.padEnd(10)} — ${cmd.description}`).join("\n");
}

export function executeCommand(input: string): { output: string; clear?: boolean } | null {
  const trimmed = input.trim();
  if (!trimmed.startsWith("/")) return null;

  const cmdName = trimmed.slice(1).toLowerCase();
  const command = COMMANDS.find((c) => c.name === cmdName);

  if (!command) {
    return { output: "[ERROR] Unknown command. Type /help for available commands." };
  }

  if (command.name === "clear") {
    return { output: "", clear: true };
  }

  if (command.name === "help") {
    return { output: `[AVAILABLE COMMANDS]\n${getHelpOutput()}` };
  }

  return { output: command.output };
}
