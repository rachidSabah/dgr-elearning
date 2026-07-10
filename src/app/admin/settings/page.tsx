"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Palette,
  Brain,
  Mail,
  Plug,
  Settings as SettingsIcon,
  Save,
  Loader2,
  Globe,
  GraduationCap,
  Award,
  Wrench,
  AtSign,
  Briefcase,
  ThumbsUp,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";

// ============================================================
// Client-side settings storage (localStorage)
// ============================================================
const SETTINGS_KEY = "dgr-academy-settings";

function getSettings(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const data = localStorage.getItem(SETTINGS_KEY);
  return data ? JSON.parse(data) : {};
}

function saveSettings(settings: Record<string, string>) {
  if (typeof window === "undefined") return;
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

// ---------- Types ----------
type SectionKey = "BRANDING" | "AI" | "EMAIL" | "INTEGRATION" | "GENERAL";

// Settings stored as flat key -> string for editing
type FormState = Record<string, string>;

interface SectionMeta {
  key: SectionKey;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const SECTIONS: SectionMeta[] = [
  {
    key: "BRANDING",
    label: "Branding",
    description: "Academy identity, colors, and social presence.",
    icon: Palette,
  },
  {
    key: "AI",
    label: "AI Configuration",
    description: "AI tutor, voice, and quiz generation.",
    icon: Brain,
  },
  {
    key: "EMAIL",
    label: "Email",
    description: "SMTP server and email templates.",
    icon: Mail,
  },
  {
    key: "INTEGRATION",
    label: "Integrations",
    description: "Cloudflare R2 and external API keys.",
    icon: Plug,
  },
  {
    key: "GENERAL",
    label: "General",
    description: "Language, pass marks, certificates, maintenance.",
    icon: SettingsIcon,
  },
];

// Field keys per section
const SECTION_KEYS: Record<SectionKey, string[]> = {
  BRANDING: [
    "academyName",
    "logoUrl",
    "primaryColor",
    "accentColor",
    "faviconUrl",
    "supportEmail",
    "footerText",
    "socialTwitter",
    "socialLinkedin",
    "socialFacebook",
  ],
  AI: [
    "aiProvider",
    "aiModel",
    "voiceProvider",
    "aiTutorEnabled",
    "quizGenerationEnabled",
    "quizDefaultCount",
    "quizDefaultDifficulty",
  ],
  EMAIL: [
    "smtpHost",
    "smtpPort",
    "smtpUsername",
    "smtpPassword",
    "fromEmail",
    "emailTemplateCertificate",
    "emailTemplateEnrollment",
  ],
  INTEGRATION: [
    "r2AccountId",
    "r2AccessKeyId",
    "r2SecretAccessKey",
    "r2Bucket",
    "r2PublicUrl",
    "externalApiKeyName",
    "externalApiKeyValue",
  ],
  GENERAL: [
    "defaultLanguage",
    "passMark",
    "certificateTemplate",
    "maintenanceMode",
  ],
};

const BOOL_KEYS = new Set<string>([
  "aiTutorEnabled",
  "quizGenerationEnabled",
  "maintenanceMode",
]);

const DEFAULTS: FormState = {
  academyName: "DGR Aviation Academy",
  logoUrl: "",
  primaryColor: "#0ea5e9",
  accentColor: "#1e40af",
  faviconUrl: "",
  supportEmail: "support@dgr-academy.com",
  footerText:
    "DGR Aviation Academy - Dangerous Goods Regulations Training. Certified by IATA & ICAO.",
  socialTwitter: "",
  socialLinkedin: "",
  socialFacebook: "",

  aiProvider: "openai",
  aiModel: "gpt-4o",
  voiceProvider: "openai",
  aiTutorEnabled: "true",
  quizGenerationEnabled: "true",
  quizDefaultCount: "5",
  quizDefaultDifficulty: "Professional",

  smtpHost: "",
  smtpPort: "587",
  smtpUsername: "",
  smtpPassword: "",
  fromEmail: "no-reply@dgr-academy.com",
  emailTemplateCertificate:
    "Dear {{name}},\n\nCongratulations! You have successfully completed {{course}} with a score of {{score}}%. Your certificate (#{{certificateNumber}}) is attached.\n\nBest regards,\nDGR Aviation Academy",
  emailTemplateEnrollment:
    "Dear {{name}},\n\nYou have been enrolled in {{course}}. You can access the course from your dashboard.\n\nBest regards,\nDGR Aviation Academy",

  r2AccountId: "",
  r2AccessKeyId: "",
  r2SecretAccessKey: "",
  r2Bucket: "dgr-media",
  r2PublicUrl: "",
  externalApiKeyName: "",
  externalApiKeyValue: "",

  defaultLanguage: "en",
  passMark: "70",
  certificateTemplate: "default",
  maintenanceMode: "false",
};

function valueToString(v: unknown): string {
  if (v === null || v === undefined) return "";
  if (typeof v === "string") return v;
  if (typeof v === "boolean") return v ? "true" : "false";
  return String(v);
}
void valueToString; // kept for downstream compatibility

export default function SettingsAdminPage() {
  const [activeSection, setActiveSection] = useState<SectionKey>("BRANDING");
  const [values, setValues] = useState<FormState>({ ...DEFAULTS });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState<Record<SectionKey, boolean>>({
    BRANDING: false,
    AI: false,
    EMAIL: false,
    INTEGRATION: false,
    GENERAL: false,
  });

  const fetchSettings = useCallback(() => {
    setLoading(true);
    try {
      const stored = getSettings();
      const next: FormState = { ...DEFAULTS };
      for (const [key, value] of Object.entries(stored)) {
        next[key] = value;
      }
      setValues(next);
      setDirty({
        BRANDING: false,
        AI: false,
        EMAIL: false,
        INTEGRATION: false,
        GENERAL: false,
      });
    } catch (err) {
      toast.error("Failed to load settings", {
        description: err instanceof Error ? err.message : "Unknown error",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const updateField = (key: string, val: string) => {
    setValues((prev) => ({ ...prev, [key]: val }));
    // Mark the relevant section dirty
    for (const [sectionKey, keys] of Object.entries(SECTION_KEYS)) {
      if (keys.includes(key)) {
        setDirty((prev) => ({ ...prev, [sectionKey]: true }));
        break;
      }
    }
  };

  const updateBool = (key: string, val: boolean) => {
    updateField(key, val ? "true" : "false");
  };

  const handleSaveSection = (section: SectionKey) => {
    const keys = SECTION_KEYS[section];
    const settingsObj: Record<string, string> = {};
    for (const k of keys) {
      const raw = values[k] ?? "";
      if (BOOL_KEYS.has(k)) {
        settingsObj[k] = raw === "true" ? "true" : "false";
      } else {
        settingsObj[k] = raw;
      }
    }

    setSaving(true);
    try {
      // Merge into existing localStorage settings and persist
      const current = getSettings();
      const merged = { ...current, ...settingsObj };
      saveSettings(merged);
      toast.success("Settings saved", {
        description: `${SECTIONS.find((s) => s.key === section)?.label} section updated.`,
      });
      setDirty((prev) => ({ ...prev, [section]: false }));
    } catch (err) {
      toast.error("Save failed", {
        description: err instanceof Error ? err.message : "Unknown error",
      });
    } finally {
      setSaving(false);
    }
  };

  const activeMeta = SECTIONS.find((s) => s.key === activeSection)!;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Settings
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Configure academy branding, AI, email, integrations, and general
          options.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <Card className="lg:w-64 lg:flex-shrink-0 h-fit">
          <CardContent className="p-2">
            <nav className="space-y-1">
              {SECTIONS.map((section) => {
                const Icon = section.icon;
                const isActive = activeSection === section.key;
                const isDirty = dirty[section.key];
                return (
                  <button
                    key={section.key}
                    onClick={() => setActiveSection(section.key)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all text-left ${
                      isActive
                        ? "bg-gradient-to-r from-sky-600 to-blue-600 text-white shadow-sm"
                        : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="flex-1 font-medium">{section.label}</span>
                    {isDirty && (
                      <span
                        className={`h-2 w-2 rounded-full ${
                          isActive ? "bg-white" : "bg-amber-500"
                        }`}
                        title="Unsaved changes"
                      />
                    )}
                  </button>
                );
              })}
            </nav>
          </CardContent>
        </Card>

        {/* Content area */}
        <div className="flex-1 min-w-0">
          {loading ? (
            <Card>
              <CardContent className="p-6 space-y-4">
                <Skeleton className="h-7 w-48" />
                <Skeleton className="h-4 w-72" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader className="border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <activeMeta.icon className="h-5 w-5 text-sky-600 dark:text-sky-400" />
                      {activeMeta.label}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {activeMeta.description}
                    </CardDescription>
                  </div>
                  {dirty[activeSection] && (
                    <Badge
                      variant="outline"
                      className="text-amber-700 border-amber-300 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800"
                    >
                      Unsaved changes
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <ScrollArea className="h-[calc(100vh-22rem)]">
                  <div className="pr-2">
                    {activeSection === "BRANDING" && (
                      <BrandingSection
                        values={values}
                        updateField={updateField}
                      />
                    )}
                    {activeSection === "AI" && (
                      <AISection
                        values={values}
                        updateField={updateField}
                        updateBool={updateBool}
                      />
                    )}
                    {activeSection === "EMAIL" && (
                      <EmailSection values={values} updateField={updateField} />
                    )}
                    {activeSection === "INTEGRATION" && (
                      <IntegrationSection
                        values={values}
                        updateField={updateField}
                      />
                    )}
                    {activeSection === "GENERAL" && (
                      <GeneralSection
                        values={values}
                        updateField={updateField}
                        updateBool={updateBool}
                      />
                    )}

                    {/* Save button */}
                    <div className="flex items-center justify-end gap-3 pt-6 mt-6 border-t border-slate-200 dark:border-slate-800">
                      <Button
                        variant="outline"
                        onClick={fetchSettings}
                        disabled={saving}
                      >
                        Reset
                      </Button>
                      <Button
                        onClick={() => handleSaveSection(activeSection)}
                        disabled={saving || !dirty[activeSection]}
                        className="gap-2"
                      >
                        {saving ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Save className="h-4 w-4" />
                        )}
                        Save Changes
                      </Button>
                    </div>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Reusable field components
// ============================================================

function FieldShell({
  label,
  htmlFor,
  hint,
  children,
  className,
}: {
  label: string;
  htmlFor?: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`space-y-2 ${className || ""}`}>
      <Label htmlFor={htmlFor} className="text-sm font-medium">
        {label}
      </Label>
      {children}
      {hint && (
        <p className="text-xs text-slate-500 dark:text-slate-400">{hint}</p>
      )}
    </div>
  );
}

function ColorField({
  label,
  value,
  onChange,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  hint?: string;
}) {
  return (
    <FieldShell label={label} hint={hint}>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value || "#000000"}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 w-12 rounded border border-slate-200 dark:border-slate-700 bg-transparent cursor-pointer"
        />
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#0ea5e9"
          className="flex-1"
        />
      </div>
    </FieldShell>
  );
}

function CheckboxField({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-slate-200 dark:border-slate-800 p-3">
      <Checkbox
        checked={checked}
        onCheckedChange={(v) => onChange(Boolean(v))}
        className="mt-0.5"
      />
      <div>
        <Label className="cursor-pointer font-medium text-sm">{label}</Label>
        {description && (
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}

function SwitchField({
  label,
  description,
  checked,
  onChange,
  icon: Icon,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="flex items-start justify-between gap-3 rounded-lg border border-slate-200 dark:border-slate-800 p-3">
      <div className="flex items-start gap-3">
        {Icon && (
          <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
            <Icon className="h-4 w-4 text-slate-600 dark:text-slate-300" />
          </div>
        )}
        <div>
          <Label className="cursor-pointer font-medium text-sm">{label}</Label>
          {description && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {description}
            </p>
          )}
        </div>
      </div>
      <Switch checked={checked} onCheckedChange={(v) => onChange(Boolean(v))} />
    </div>
  );
}

// ============================================================
// Sections
// ============================================================

function BrandingSection({
  values,
  updateField,
}: {
  values: FormState;
  updateField: (k: string, v: string) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FieldShell
          label="Academy Name"
          htmlFor="academyName"
          hint="Displayed across the academy site and certificates."
        >
          <Input
            id="academyName"
            value={values.academyName}
            onChange={(e) => updateField("academyName", e.target.value)}
            placeholder="DGR Aviation Academy"
          />
        </FieldShell>

        <FieldShell
          label="Support Email"
          htmlFor="supportEmail"
          hint="Receives student inquiries."
        >
          <Input
            id="supportEmail"
            type="email"
            value={values.supportEmail}
            onChange={(e) => updateField("supportEmail", e.target.value)}
            placeholder="support@dgr-academy.com"
          />
        </FieldShell>
      </div>

      <FieldShell
        label="Logo URL"
        htmlFor="logoUrl"
        hint="Public URL of the academy logo (SVG or PNG recommended)."
      >
        <Input
          id="logoUrl"
          value={values.logoUrl}
          onChange={(e) => updateField("logoUrl", e.target.value)}
          placeholder="https://..."
        />
        {values.logoUrl && (
          <div className="h-16 w-32 rounded-md overflow-hidden border border-slate-200 dark:border-slate-700 bg-white flex items-center justify-center p-2">
            <img
              src={values.logoUrl}
              alt="Logo preview"
              className="max-h-full max-w-full object-contain"
              onError={(e) =>
                ((e.target as HTMLImageElement).style.opacity = "0.2")
              }
            />
          </div>
        )}
      </FieldShell>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ColorField
          label="Primary Color"
          value={values.primaryColor}
          onChange={(v) => updateField("primaryColor", v)}
          hint="Main brand color used for buttons and accents."
        />
        <ColorField
          label="Accent Color"
          value={values.accentColor}
          onChange={(v) => updateField("accentColor", v)}
          hint="Secondary brand color for highlights."
        />
      </div>

      <FieldShell
        label="Favicon URL"
        htmlFor="faviconUrl"
        hint="Small icon shown in browser tabs."
      >
        <Input
          id="faviconUrl"
          value={values.faviconUrl}
          onChange={(e) => updateField("faviconUrl", e.target.value)}
          placeholder="https://..."
        />
      </FieldShell>

      <FieldShell
        label="Footer Text"
        htmlFor="footerText"
        hint="Shown at the bottom of public pages."
      >
        <Textarea
          id="footerText"
          rows={3}
          value={values.footerText}
          onChange={(e) => updateField("footerText", e.target.value)}
          placeholder="© 2024 DGR Aviation Academy..."
        />
      </FieldShell>

      <div>
        <Label className="text-sm font-medium mb-2 block">Social Links</Label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <FieldShell label="Twitter / X" htmlFor="socialTwitter">
            <div className="relative">
              <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                id="socialTwitter"
                value={values.socialTwitter}
                onChange={(e) => updateField("socialTwitter", e.target.value)}
                className="pl-9"
                placeholder="https://twitter.com/..."
              />
            </div>
          </FieldShell>
          <FieldShell label="LinkedIn" htmlFor="socialLinkedin">
            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                id="socialLinkedin"
                value={values.socialLinkedin}
                onChange={(e) => updateField("socialLinkedin", e.target.value)}
                className="pl-9"
                placeholder="https://linkedin.com/..."
              />
            </div>
          </FieldShell>
          <FieldShell label="Facebook" htmlFor="socialFacebook">
            <div className="relative">
              <ThumbsUp className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                id="socialFacebook"
                value={values.socialFacebook}
                onChange={(e) => updateField("socialFacebook", e.target.value)}
                className="pl-9"
                placeholder="https://facebook.com/..."
              />
            </div>
          </FieldShell>
        </div>
      </div>
    </div>
  );
}

function AISection({
  values,
  updateField,
  updateBool,
}: {
  values: FormState;
  updateField: (k: string, v: string) => void;
  updateBool: (k: string, v: boolean) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FieldShell
          label="AI Provider"
          hint="Select the LLM provider for the AI tutor."
        >
          <Select
            value={values.aiProvider}
            onValueChange={(v) => updateField("aiProvider", v)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select provider" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="openai">OpenAI</SelectItem>
              <SelectItem value="anthropic">Anthropic</SelectItem>
              <SelectItem value="google">Google Gemini</SelectItem>
              <SelectItem value="azure">Azure OpenAI</SelectItem>
              <SelectItem value="zai">ZAI</SelectItem>
            </SelectContent>
          </Select>
        </FieldShell>

        <FieldShell
          label="AI Model"
          htmlFor="aiModel"
          hint="Model identifier used by the tutor."
        >
          <Input
            id="aiModel"
            value={values.aiModel}
            onChange={(e) => updateField("aiModel", e.target.value)}
            placeholder="gpt-4o, claude-3-opus, gemini-1.5-pro"
          />
        </FieldShell>
      </div>

      <FieldShell
        label="Voice Provider"
        hint="Text-to-speech provider for narration."
      >
        <Select
          value={values.voiceProvider}
          onValueChange={(v) => updateField("voiceProvider", v)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select voice provider" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="openai">OpenAI TTS</SelectItem>
            <SelectItem value="elevenlabs">ElevenLabs</SelectItem>
            <SelectItem value="azure">Azure Speech</SelectItem>
            <SelectItem value="google">Google Cloud TTS</SelectItem>
            <SelectItem value="browser">Browser Native</SelectItem>
          </SelectContent>
        </Select>
      </FieldShell>

      <div className="space-y-3">
        <SwitchField
          label="AI Tutor Enabled"
          description="Allow students to ask questions to the AI tutor during lessons."
          checked={values.aiTutorEnabled === "true"}
          onChange={(v) => updateBool("aiTutorEnabled", v)}
          icon={Brain}
        />
        <SwitchField
          label="Quiz Generation Enabled"
          description="Let instructors auto-generate quizzes from lesson content."
          checked={values.quizGenerationEnabled === "true"}
          onChange={(v) => updateBool("quizGenerationEnabled", v)}
          icon={GraduationCap}
        />
      </div>

      <div className="rounded-lg border border-slate-200 dark:border-slate-800 p-4">
        <Label className="text-sm font-medium mb-3 block">
          Quiz Generation Defaults
        </Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FieldShell
            label="Default Question Count"
            htmlFor="quizDefaultCount"
            hint="Number of questions generated per lesson."
          >
            <Input
              id="quizDefaultCount"
              type="number"
              min={1}
              max={50}
              value={values.quizDefaultCount}
              onChange={(e) => updateField("quizDefaultCount", e.target.value)}
            />
          </FieldShell>
          <FieldShell
            label="Default Difficulty"
            hint="Difficulty applied to generated quizzes."
          >
            <Select
              value={values.quizDefaultDifficulty}
              onValueChange={(v) => updateField("quizDefaultDifficulty", v)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Beginner">Beginner</SelectItem>
                <SelectItem value="Intermediate">Intermediate</SelectItem>
                <SelectItem value="Professional">Professional</SelectItem>
              </SelectContent>
            </Select>
          </FieldShell>
        </div>
      </div>
    </div>
  );
}

function EmailSection({
  values,
  updateField,
}: {
  values: FormState;
  updateField: (k: string, v: string) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FieldShell label="SMTP Host" htmlFor="smtpHost">
          <Input
            id="smtpHost"
            value={values.smtpHost}
            onChange={(e) => updateField("smtpHost", e.target.value)}
            placeholder="smtp.gmail.com"
          />
        </FieldShell>
        <FieldShell label="SMTP Port" htmlFor="smtpPort">
          <Input
            id="smtpPort"
            type="number"
            min={1}
            max={65535}
            value={values.smtpPort}
            onChange={(e) => updateField("smtpPort", e.target.value)}
            placeholder="587"
          />
        </FieldShell>
        <FieldShell label="SMTP Username" htmlFor="smtpUsername">
          <Input
            id="smtpUsername"
            value={values.smtpUsername}
            onChange={(e) => updateField("smtpUsername", e.target.value)}
            placeholder="user@example.com"
          />
        </FieldShell>
        <FieldShell
          label="SMTP Password"
          htmlFor="smtpPassword"
          hint="Stored as a setting. Use an app password for Gmail."
        >
          <Input
            id="smtpPassword"
            type="password"
            value={values.smtpPassword}
            onChange={(e) => updateField("smtpPassword", e.target.value)}
            placeholder="••••••••"
          />
        </FieldShell>
      </div>

      <FieldShell
        label="From Email"
        htmlFor="fromEmail"
        hint="Sender address for all outgoing emails."
      >
        <Input
          id="fromEmail"
          type="email"
          value={values.fromEmail}
          onChange={(e) => updateField("fromEmail", e.target.value)}
          placeholder="no-reply@dgr-academy.com"
        />
      </FieldShell>

      <div className="space-y-4">
        <Label className="text-sm font-medium">Email Templates</Label>
        <FieldShell
          label="Certificate Email"
          htmlFor="emailTemplateCertificate"
          hint="Use {{name}}, {{course}}, {{score}}, {{certificateNumber}} placeholders."
        >
          <Textarea
            id="emailTemplateCertificate"
            rows={5}
            value={values.emailTemplateCertificate}
            onChange={(e) =>
              updateField("emailTemplateCertificate", e.target.value)
            }
            className="font-mono text-xs"
          />
        </FieldShell>
        <FieldShell
          label="Enrollment Email"
          htmlFor="emailTemplateEnrollment"
          hint="Use {{name}}, {{course}} placeholders."
        >
          <Textarea
            id="emailTemplateEnrollment"
            rows={5}
            value={values.emailTemplateEnrollment}
            onChange={(e) =>
              updateField("emailTemplateEnrollment", e.target.value)
            }
            className="font-mono text-xs"
          />
        </FieldShell>
      </div>
    </div>
  );
}

function IntegrationSection({
  values,
  updateField,
}: {
  values: FormState;
  updateField: (k: string, v: string) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-orange-200 bg-orange-50 dark:border-orange-900 dark:bg-orange-950/30 p-3 flex items-start gap-2">
        <ShieldCheck className="h-4 w-4 text-orange-600 dark:text-orange-400 mt-0.5 shrink-0" />
        <p className="text-xs text-orange-800 dark:text-orange-300">
          Secrets are stored as plain settings in this environment. In
          production, route these through a secrets manager or environment
          variables instead.
        </p>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/40 flex items-center justify-center">
            <Wrench className="h-4 w-4 text-orange-600 dark:text-orange-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold">Cloudflare R2</h3>
            <p className="text-xs text-slate-500">
              Object storage for media uploads.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FieldShell label="Account ID" htmlFor="r2AccountId">
            <Input
              id="r2AccountId"
              value={values.r2AccountId}
              onChange={(e) => updateField("r2AccountId", e.target.value)}
              placeholder="a1b2c3d4..."
            />
          </FieldShell>
          <FieldShell label="Bucket Name" htmlFor="r2Bucket">
            <Input
              id="r2Bucket"
              value={values.r2Bucket}
              onChange={(e) => updateField("r2Bucket", e.target.value)}
              placeholder="dgr-media"
            />
          </FieldShell>
          <FieldShell label="Access Key ID" htmlFor="r2AccessKeyId">
            <Input
              id="r2AccessKeyId"
              value={values.r2AccessKeyId}
              onChange={(e) => updateField("r2AccessKeyId", e.target.value)}
              placeholder="..."
            />
          </FieldShell>
          <FieldShell label="Secret Access Key" htmlFor="r2SecretAccessKey">
            <Input
              id="r2SecretAccessKey"
              type="password"
              value={values.r2SecretAccessKey}
              onChange={(e) => updateField("r2SecretAccessKey", e.target.value)}
              placeholder="••••••••"
            />
          </FieldShell>
          <FieldShell
            label="Public URL"
            htmlFor="r2PublicUrl"
            hint="Base URL for serving media publicly."
            className="sm:col-span-2"
          >
            <Input
              id="r2PublicUrl"
              value={values.r2PublicUrl}
              onChange={(e) => updateField("r2PublicUrl", e.target.value)}
              placeholder="https://media.dgr-academy.com"
            />
          </FieldShell>
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-sky-100 dark:bg-sky-900/40 flex items-center justify-center">
            <Plug className="h-4 w-4 text-sky-600 dark:text-sky-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold">External API Keys</h3>
            <p className="text-xs text-slate-500">
              Generic key/value pairs for third-party services.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FieldShell label="Key Name" htmlFor="externalApiKeyName">
            <Input
              id="externalApiKeyName"
              value={values.externalApiKeyName}
              onChange={(e) => updateField("externalApiKeyName", e.target.value)}
              placeholder="STRIPE_SECRET_KEY"
            />
          </FieldShell>
          <FieldShell label="Key Value" htmlFor="externalApiKeyValue">
            <Input
              id="externalApiKeyValue"
              type="password"
              value={values.externalApiKeyValue}
              onChange={(e) => updateField("externalApiKeyValue", e.target.value)}
              placeholder="sk_live_..."
            />
          </FieldShell>
        </div>
      </div>
    </div>
  );
}

function GeneralSection({
  values,
  updateField,
  updateBool,
}: {
  values: FormState;
  updateField: (k: string, v: string) => void;
  updateBool: (k: string, v: boolean) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FieldShell
          label="Default Language"
          hint="Interface language for new students."
        >
          <Select
            value={values.defaultLanguage}
            onValueChange={(v) => updateField("defaultLanguage", v)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="es">Spanish</SelectItem>
              <SelectItem value="fr">French</SelectItem>
              <SelectItem value="ar">Arabic</SelectItem>
              <SelectItem value="zh">Chinese</SelectItem>
              <SelectItem value="de">German</SelectItem>
            </SelectContent>
          </Select>
        </FieldShell>

        <FieldShell
          label="Pass Mark (%)"
          htmlFor="passMark"
          hint="Minimum score required to pass quizzes and exams."
        >
          <div className="relative">
            <Award className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              id="passMark"
              type="number"
              min={0}
              max={100}
              value={values.passMark}
              onChange={(e) => updateField("passMark", e.target.value)}
              className="pl-9"
            />
          </div>
        </FieldShell>
      </div>

      <FieldShell
        label="Certificate Template"
        htmlFor="certificateTemplate"
        hint="Identifier of the certificate design template."
      >
        <Select
          value={values.certificateTemplate}
          onValueChange={(v) => updateField("certificateTemplate", v)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select template" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Default</SelectItem>
            <SelectItem value="classic">Classic</SelectItem>
            <SelectItem value="modern">Modern</SelectItem>
            <SelectItem value="aviation">Aviation</SelectItem>
          </SelectContent>
        </Select>
      </FieldShell>

      <SwitchField
        label="Maintenance Mode"
        description="When enabled, students see a maintenance page instead of the academy."
        checked={values.maintenanceMode === "true"}
        onChange={(v) => updateBool("maintenanceMode", v)}
        icon={Wrench}
      />

      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 pt-2">
        <Globe className="h-3.5 w-3.5" />
        <span>
          Tip: settings are stored as key-value pairs and versioned with audit
          logs.
        </span>
      </div>
    </div>
  );
}
