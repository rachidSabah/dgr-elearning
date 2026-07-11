"use client";

// ============================================================
// AGENT SKILLS REGISTRY
// Integrates external skill packs (like Obsidian Skills) that
// extend the AI Course Builder's capabilities.
// Skills follow the Agent Skills specification (agentskills.io)
// ============================================================

export interface AgentSkill {
  id: string;
  name: string;
  description: string;
  category: "content" | "format" | "cli" | "integrations" | "custom";
  source: string;
  sourceUrl: string;
  isEnabled: boolean;
  installCommand?: string;
  workflow?: string[];
  capabilities?: string[];
}

export interface SkillPack {
  id: string;
  name: string;
  description: string;
  source: string;
  sourceUrl: string;
  installUrl: string;
  docsUrl: string;
  skills: AgentSkill[];
  icon: string;
  color: string;
}

// ============================================================
// OBSIDIAN SKILLS PACK
// From: https://github.com/kepano/obsidian-skills
// ============================================================

export const OBSIDIAN_SKILLS_PACK: SkillPack = {
  id: "obsidian-skills",
  name: "Obsidian Skills",
  description: "Agent skills for Obsidian by kepano. Teach the AI agent to use Obsidian CLI and open formats including Markdown, Bases, and JSON Canvas. Follows the Agent Skills specification — compatible with Claude Code, Codex, and OpenCode.",
  source: "kepano/obsidian-skills",
  sourceUrl: "https://github.com/kepano/obsidian-skills",
  installUrl: "https://github.com/kepano/obsidian-skills",
  docsUrl: "https://opencode.ai/docs/zen/",
  icon: "notebook",
  color: "#7c3aed",
  skills: [
    {
      id: "obsidian-markdown",
      name: "Obsidian Flavored Markdown",
      description: "Create and edit Obsidian Flavored Markdown (.md) with wikilinks, embeds, callouts, properties, and other Obsidian-specific syntax. Use when working with .md files in Obsidian, or when the user mentions wikilinks, callouts, frontmatter, tags, embeds, or Obsidian notes.",
      category: "content",
      source: "obsidian-skills",
      sourceUrl: "https://github.com/kepano/obsidian-skills/tree/main/skills/obsidian-markdown",
      isEnabled: true,
      capabilities: [
        "Wikilinks ([[Note]], [[Note|Display]], [[Note#Heading]], [[Note#^block-id]])",
        "Embeds (![[note]], ![[image.png]], ![[note#heading]])",
        "Callouts (> [!info], > [!warning], > [!danger], > [!tip], > [!note], > [!success], > [!quote], > [!example])",
        "Properties/Frontmatter (YAML: title, tags, aliases, cssclass)",
        "Tags (#tag, #nested/tag)",
        "Comments (%% comment %%)",
        "Math ($inline$, $$block$$)",
        "Block references (^block-id)",
      ],
      workflow: [
        "Add frontmatter with properties (title, tags, aliases) at the top of the file",
        "Write content using standard Markdown for structure, plus Obsidian-specific syntax",
        "Link related notes using wikilinks ([[Note]]) for internal vault connections",
        "Embed content from other notes, images, or PDFs using ![[embed]] syntax",
        "Add callouts for highlighted information using > [!type] syntax",
        "Verify the note renders correctly in Obsidian's reading view",
      ],
    },
    {
      id: "obsidian-bases",
      name: "Obsidian Bases",
      description: "Create and edit Obsidian Bases (.base files) with views, filters, formulas, and summaries. Use when working with .base files, creating database-like views of notes, or when the user mentions Bases, table views, card views, filters, or formulas in Obsidian.",
      category: "format",
      source: "obsidian-skills",
      sourceUrl: "https://github.com/kepano/obsidian-skills/tree/main/skills/obsidian-bases",
      isEnabled: true,
      capabilities: [
        "Create .base files with YAML content",
        "Define filters to select notes (by tag, folder, property)",
        "Create table views and card views",
        "Use formulas for computed columns",
        "Add summaries (count, sum, average, min, max)",
        "Sort and group by properties",
      ],
      workflow: [
        "Create a .base file in the vault with valid YAML content",
        "Define filters to select which notes appear (by tag, folder, property)",
        "Add formulas for computed columns",
        "Configure view type (table or card)",
        "Add summaries for aggregate statistics",
      ],
    },
    {
      id: "json-canvas",
      name: "JSON Canvas",
      description: "Create and edit JSON Canvas files (.canvas) with nodes, edges, groups, and connections. Use when working with .canvas files, creating visual canvases, mind maps, flowcharts, or when the user mentions Canvas files in Obsidian.",
      category: "format",
      source: "obsidian-skills",
      sourceUrl: "https://github.com/kepano/obsidian-skills/tree/main/skills/json-canvas",
      isEnabled: true,
      capabilities: [
        "Create .canvas files with nodes and edges arrays (JSON Canvas Spec 1.0)",
        "Node types: text, file, link, group",
        "Edge types: directed, undirected",
        "Position nodes with x, y coordinates",
        "Set node dimensions (width, height)",
        "Group nodes with .group type",
        "Color nodes and edges",
        "Create mind maps, flowcharts, and visual diagrams",
      ],
      workflow: [
        "Create a .canvas file with { nodes: [], edges: [] } structure",
        "Add nodes with type (text/file/link/group), position, and dimensions",
        "Add edges to connect nodes (from, to, label, color)",
        "Group related nodes using group-type nodes",
        "Position nodes using x/y coordinates for visual layout",
      ],
    },
    {
      id: "obsidian-cli",
      name: "Obsidian CLI",
      description: "Interact with Obsidian vaults using the Obsidian CLI to read, create, search, and manage notes, tasks, properties, and more. Also supports plugin and theme development with commands to reload plugins, run JavaScript, capture errors, take screenshots, and inspect the DOM.",
      category: "cli",
      source: "obsidian-skills",
      sourceUrl: "https://github.com/kepano/obsidian-skills/tree/main/skills/obsidian-cli",
      isEnabled: true,
      capabilities: [
        "Read notes: obsidian read <file>",
        "Create notes: obsidian create <file>",
        "Search vault: obsidian search <query>",
        "Manage tasks: obsidian tasks",
        "Get/set properties: obsidian properties <file>",
        "List tags: obsidian tags",
        "Reload plugins: obsidian reload <plugin>",
        "Run JavaScript: obsidian eval <code>",
        "Capture errors: obsidian errors",
        "Take screenshots: obsidian screenshot",
        "Inspect DOM: obsidian inspect",
      ],
      workflow: [
        "Use obsidian read to retrieve note content",
        "Use obsidian create to write new notes",
        "Use obsidian search to find notes by content",
        "Use obsidian tasks to manage task lists",
        "Use obsidian properties to get/set frontmatter",
      ],
    },
  ],
};

// ============================================================
// ALL SKILL PACKS
// ============================================================

export const ALL_SKILL_PACKS: SkillPack[] = [
  OBSIDIAN_SKILLS_PACK,
  // Future skill packs can be added here
];

// ============================================================
// SKILL PACK MANAGEMENT (localStorage)
// ============================================================

const SKILLS_KEY = "dgr-academy-agent-skills";

export function getEnabledSkills(): string[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(SKILLS_KEY);
  if (!data) {
    // Default: enable all Obsidian skills
    return OBSIDIAN_SKILLS_PACK.skills.map((s) => s.id);
  }
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export function setEnabledSkills(skillIds: string[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(SKILLS_KEY, JSON.stringify(skillIds));
}

export function toggleSkill(skillId: string) {
  const enabled = getEnabledSkills();
  const idx = enabled.indexOf(skillId);
  if (idx >= 0) {
    enabled.splice(idx, 1);
  } else {
    enabled.push(skillId);
  }
  setEnabledSkills(enabled);
}

export function isSkillEnabled(skillId: string): boolean {
  return getEnabledSkills().includes(skillId);
}

// ============================================================
// BUILD SKILL CONTEXT FOR AI PROMPT
// ============================================================

export function buildSkillsContext(): string {
  const enabledIds = getEnabledSkills();
  const contexts: string[] = [];

  for (const pack of ALL_SKILL_PACKS) {
    for (const skill of pack.skills) {
      if (!enabledIds.includes(skill.id)) continue;

      let ctx = `## Skill: ${skill.name}\n${skill.description}\n`;

      if (skill.capabilities && skill.capabilities.length > 0) {
        ctx += `\nCapabilities:\n`;
        skill.capabilities.forEach((c) => { ctx += `- ${c}\n`; });
      }

      if (skill.workflow && skill.workflow.length > 0) {
        ctx += `\nWorkflow:\n`;
        skill.workflow.forEach((step, i) => { ctx += `${i + 1}. ${step}\n`; });
      }

      contexts.push(ctx);
    }
  }

  if (contexts.length === 0) return "";
  return `\n## AGENT SKILLS AVAILABLE\nThe following agent skills are enabled and can be used when building courses:\n\n${contexts.join("\n")}\n`;
}
