"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Settings, Plus, Trash2, Eye, EyeOff, Check, ExternalLink,
  Bot, Cable, Zap, X, RefreshCw, Sparkles, Notebook
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { initializeAuth } from "@/lib/client-auth";
import {
  AI_PROVIDERS, getProviderConfigs, saveProviderConfig, deleteProviderConfig,
  getProviderById, type ProviderConfig,
  getMCPConnections, saveMCPConnection, deleteMCPConnection, type MCPConnection
} from "@/lib/ai-providers";
import { ALL_SKILL_PACKS, getEnabledSkills, toggleSkill, buildSkillsContext } from "@/lib/agent-skills";

export default function AIProvidersPage() {
  const [configs, setConfigs] = useState<ProviderConfig[]>([]);
  const [mcpConnections, setMcpConnections] = useState<MCPConnection[]>([]);
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [editingProvider, setEditingProvider] = useState<string | null>(null);
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [selectedModelInput, setSelectedModelInput] = useState("");
  const [customBaseUrlInput, setCustomBaseUrlInput] = useState("");

  // MCP form state
  const [mcpName, setMcpName] = useState("");
  const [mcpType, setMcpType] = useState<MCPConnection["type"]>("hermes-desktop");
  const [mcpEndpoint, setMcpEndpoint] = useState("");
  const [mcpToken, setMcpToken] = useState("");

  useEffect(() => {
    initializeAuth();
    setConfigs(getProviderConfigs());
    setMcpConnections(getMCPConnections());
  }, []);

  const handleSaveProvider = (providerId: string) => {
    const provider = getProviderById(providerId);
    if (!provider) return;

    if (!apiKeyInput && !configs.find(c => c.providerId === providerId)?.apiKey) {
      toast.error("API key is required");
      return;
    }

    const config: ProviderConfig = {
      providerId,
      apiKey: apiKeyInput || configs.find(c => c.providerId === providerId)?.apiKey || "",
      selectedModel: selectedModelInput || provider.models[0]?.id || "",
      isEnabled: true,
      customBaseUrl: customBaseUrlInput || (providerId === "custom" ? customBaseUrlInput : undefined),
    };

    saveProviderConfig(config);
    setConfigs(getProviderConfigs());
    setEditingProvider(null);
    setApiKeyInput("");
    setSelectedModelInput("");
    setCustomBaseUrlInput("");
    toast.success(`${provider.name} configured successfully!`);
  };

  const handleToggleProvider = (providerId: string) => {
    const config = configs.find(c => c.providerId === providerId);
    if (!config) return;
    const updated = { ...config, isEnabled: !config.isEnabled };
    saveProviderConfig(updated);
    setConfigs(getProviderConfigs());
  };

  const handleDeleteProvider = (providerId: string) => {
    deleteProviderConfig(providerId);
    setConfigs(getProviderConfigs());
    toast.info("Provider removed");
  };

  const handleAddMCP = () => {
    if (!mcpName || !mcpEndpoint) {
      toast.error("Name and endpoint are required");
      return;
    }

    const conn: MCPConnection = {
      id: `mcp-${Date.now()}`,
      name: mcpName,
      type: mcpType,
      endpoint: mcpEndpoint,
      authToken: mcpToken,
      isEnabled: true,
      capabilities: ["course-build", "file-upload", "image-upload", "task-dispatch"],
    };

    saveMCPConnection(conn);
    setMcpConnections(getMCPConnections());
    setMcpName(""); setMcpEndpoint(""); setMcpToken("");
    toast.success("MCP connection added!");
  };

  const handleDeleteMCP = (id: string) => {
    deleteMCPConnection(id);
    setMcpConnections(getMCPConnections());
    toast.info("MCP connection removed");
  };

  const handleToggleMCP = (id: string) => {
    const conn = mcpConnections.find(c => c.id === id);
    if (!conn) return;
    saveMCPConnection({ ...conn, isEnabled: !conn.isEnabled });
    setMcpConnections(getMCPConnections());
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">AI Providers &amp; MCP</h1>
        <p className="text-sm text-slate-500 mt-1">
          Configure AI providers for course generation and connect external agents via MCP
        </p>
      </div>

      <Tabs defaultValue="providers">
        <TabsList>
          <TabsTrigger value="providers" className="gap-1.5"><Bot className="h-3.5 w-3.5" /> AI Providers</TabsTrigger>
          <TabsTrigger value="skills" className="gap-1.5"><Sparkles className="h-3.5 w-3.5" /> Agent Skills</TabsTrigger>
          <TabsTrigger value="mcp" className="gap-1.5"><Cable className="h-3.5 w-3.5" /> MCP Connections</TabsTrigger>
        </TabsList>

        {/* === AI PROVIDERS TAB === */}
        <TabsContent value="providers" className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {AI_PROVIDERS.map((provider) => {
              const config = configs.find(c => c.providerId === provider.id);
              const isConfigured = !!config?.apiKey;
              const isEditing = editingProvider === provider.id;
              const isFree = provider.freeTier;

              return (
                <Card key={provider.id} className={isConfigured ? "border-green-300" : ""}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
                          style={{ backgroundColor: provider.color }}
                        >
                          <Bot className="h-5 w-5" />
                        </div>
                        <div>
                          <CardTitle className="text-sm flex items-center gap-2">
                            {provider.name}
                            {isFree && <Badge className="bg-green-100 text-green-700 border-green-200 text-xs">Free tier</Badge>}
                          </CardTitle>
                          <p className="text-xs text-slate-500 mt-0.5">{provider.models.length} models available</p>
                        </div>
                      </div>
                      {isConfigured && (
                        <Switch
                          checked={config.isEnabled}
                          onCheckedChange={() => handleToggleProvider(provider.id)}
                        />
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-xs text-slate-500">{provider.description}</p>

                    {isConfigured && !isEditing && (
                      <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-900">
                        <div className="text-xs">
                          <span className="text-slate-400">Model: </span>
                          <span className="font-medium">{provider.models.find(m => m.id === config.selectedModel)?.name || config.selectedModel}</span>
                          <span className="text-slate-400 ml-2">Key: </span>
                          <span className="font-mono">{config.apiKey.substring(0, 8)}...</span>
                        </div>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" className="h-7" onClick={() => { setEditingProvider(provider.id); setApiKeyInput(""); setSelectedModelInput(config.selectedModel); setCustomBaseUrlInput(config.customBaseUrl || ""); }}>
                            <Settings className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-7 text-red-600" onClick={() => handleDeleteProvider(provider.id)}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    )}

                    {(!isConfigured || isEditing) && (
                      <div className="space-y-2 p-3 rounded-lg bg-slate-50 dark:bg-slate-900">
                        <div className="space-y-1">
                          <Label className="text-xs">API Key</Label>
                          <div className="flex gap-1">
                            <Input
                              type={showKeys[provider.id] ? "text" : "password"}
                              value={apiKeyInput}
                              onChange={(e) => setApiKeyInput(e.target.value)}
                              placeholder={isConfigured ? "Enter new key to replace" : `Get free key from ${provider.name}`}
                              className="text-xs h-8"
                            />
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setShowKeys({ ...showKeys, [provider.id]: !showKeys[provider.id] })}>
                              {showKeys[provider.id] ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <Label className="text-xs">Model</Label>
                          <Select value={selectedModelInput || provider.models[0]?.id} onValueChange={setSelectedModelInput}>
                            <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              {provider.models.map(m => (
                                <SelectItem key={m.id} value={m.id} className="text-xs">
                                  {m.name} {m.free && "🆓"} ({(m.contextWindow / 1000).toFixed(0)}k ctx)
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {provider.id === "custom" && (
                          <div className="space-y-1">
                            <Label className="text-xs">Custom API Base URL</Label>
                            <Input value={customBaseUrlInput} onChange={(e) => setCustomBaseUrlInput(e.target.value)} placeholder="http://localhost:11434/v1/chat/completions" className="text-xs h-8" />
                          </div>
                        )}

                        <div className="flex gap-2">
                          <Button size="sm" className="h-8 text-xs flex-1" onClick={() => handleSaveProvider(provider.id)}>
                            <Check className="h-3.5 w-3.5 mr-1" /> Save
                          </Button>
                          {isEditing && (
                            <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => setEditingProvider(null)}>
                              <X className="h-3.5 w-3.5" />
                            </Button>
                          )}
                          {provider.signupUrl && (
                            <a href={provider.signupUrl} target="_blank" rel="noopener noreferrer">
                              <Button variant="outline" size="sm" className="h-8 text-xs gap-1">
                                <ExternalLink className="h-3 w-3" /> Get Key
                              </Button>
                            </a>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Models list */}
                    <details className="text-xs">
                      <summary className="cursor-pointer text-slate-500 hover:text-slate-700">View all models</summary>
                      <div className="mt-2 space-y-1">
                        {provider.models.map(m => (
                          <div key={m.id} className="flex items-center justify-between p-1.5 rounded bg-white dark:bg-slate-800">
                            <span className="font-medium">{m.name}</span>
                            <div className="flex items-center gap-2">
                              {m.free && <Badge className="bg-green-100 text-green-700 text-[10px] px-1.5 py-0">FREE</Badge>}
                              <span className="text-slate-400 text-[10px]">{(m.contextWindow / 1000).toFixed(0)}k ctx</span>
                              {!m.free && m.inputCostPer1k && <span className="text-slate-400 text-[10px]">${m.inputCostPer1k}/1k</span>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </details>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* === AGENT SKILLS TAB === */}
        <TabsContent value="skills" className="space-y-4">
          <Card>
            <CardContent className="pt-5">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-purple-600 flex items-center justify-center text-white">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Agent Skills</h3>
                  <p className="text-xs text-slate-500">Extend the AI Course Builder with specialized skills. Skills follow the Agent Skills specification (agentskills.io) and are compatible with Claude Code, Codex, and OpenCode.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {ALL_SKILL_PACKS.map((pack) => (
            <Card key={pack.id} className="overflow-hidden">
              <div className="h-1" style={{ backgroundColor: pack.color }} />
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white" style={{ backgroundColor: pack.color }}>
                      <Notebook className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-sm">{pack.name}</CardTitle>
                      <p className="text-xs text-slate-500 mt-0.5">{pack.description.substring(0, 120)}...</p>
                    </div>
                  </div>
                  <a href={pack.sourceUrl} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm" className="gap-1 text-xs">
                      <ExternalLink className="h-3 w-3" /> Source
                    </Button>
                  </a>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {pack.skills.map((skill) => {
                  const enabled = getEnabledSkills().includes(skill.id);
                  return (
                    <div key={skill.id} className="border rounded-lg p-3 bg-slate-50 dark:bg-slate-900">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-medium">{skill.name}</h4>
                            <Badge variant="outline" className="text-xs capitalize">{skill.category}</Badge>
                            {enabled && <Badge className="bg-green-100 text-green-700 border-green-200 text-xs">Active</Badge>}
                          </div>
                          <p className="text-xs text-slate-500 mt-1">{skill.description}</p>
                        </div>
                        <Switch checked={enabled} onCheckedChange={() => { toggleSkill(skill.id); setConfigs(getProviderConfigs()); toast.success(`${skill.name} ${enabled ? "disabled" : "enabled"}`); }} />
                      </div>
                      {enabled && skill.capabilities && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {skill.capabilities.map((cap, i) => (
                            <Badge key={i} variant="secondary" className="text-[10px]">{cap}</Badge>
                          ))}
                        </div>
                      )}
                      {enabled && skill.workflow && (
                        <details className="mt-2 text-xs">
                          <summary className="cursor-pointer text-slate-500 hover:text-slate-700">View workflow</summary>
                          <ol className="list-decimal list-inside mt-1 space-y-0.5 text-slate-500">
                            {skill.workflow.map((step, i) => <li key={i}>{step}</li>)}
                          </ol>
                        </details>
                      )}
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          ))}

          <Card className="border-purple-200 bg-purple-50/30">
            <CardContent className="pt-4">
              <p className="text-xs text-slate-600">
                <strong>How skills work:</strong> When the AI Course Builder generates a course, enabled skills are injected into the AI's system prompt. This teaches the AI agent how to use Obsidian-flavored Markdown (wikilinks, callouts, embeds), create .base database views, build .canvas visual diagrams, and interact with vaults via the Obsidian CLI. Generated courses can use these formats for richer content.
              </p>
              <p className="text-xs text-slate-500 mt-2">
                To install these skills in OpenCode: <code className="text-xs bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">git clone https://github.com/kepano/obsidian-skills.git ~/.opencode/skills/obsidian-skills</code>
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* === MCP CONNECTIONS TAB === */}
        <TabsContent value="mcp" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Cable className="h-4 w-4" /> Add MCP Connection
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Connection Name</Label>
                  <Input value={mcpName} onChange={(e) => setMcpName(e.target.value)} placeholder="e.g., Hermes Desktop" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Connection Type</Label>
                  <Select value={mcpType} onValueChange={(v) => setMcpType(v as MCPConnection["type"])}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hermes-desktop">Hermes Desktop</SelectItem>
                      <SelectItem value="hermes-agent">Hermes Agent</SelectItem>
                      <SelectItem value="claude-desktop">Claude Desktop (MCP)</SelectItem>
                      <SelectItem value="custom-mcp">Custom MCP Server</SelectItem>
                      <SelectItem value="webhook">Webhook</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Endpoint URL</Label>
                <Input value={mcpEndpoint} onChange={(e) => setMcpEndpoint(e.target.value)} placeholder="ws://localhost:3001/mcp or https://your-agent.com/webhook" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Auth Token (optional)</Label>
                <Input type="password" value={mcpToken} onChange={(e) => setMcpToken(e.target.value)} placeholder="Bearer token for authentication" />
              </div>
              <Button onClick={handleAddMCP} className="gap-1.5">
                <Plus className="h-4 w-4" /> Add Connection
              </Button>

              <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 text-xs text-blue-700">
                <p className="font-medium mb-1">How MCP connections work:</p>
                <p>External AI agents (like Hermes Desktop) connect to this platform via MCP protocol. Once connected, the agent can:</p>
                <ul className="list-disc list-inside mt-1 space-y-0.5">
                  <li>Dispatch course-building tasks from your desktop</li>
                  <li>Upload PDFs and images directly to the platform</li>
                  <li>Trigger course generation using configured AI providers</li>
                  <li>Manage course content remotely</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Existing connections */}
          {mcpConnections.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Active Connections</h3>
              {mcpConnections.map((conn) => (
                <Card key={conn.id}>
                  <CardContent className="pt-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center text-white">
                        <Cable className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-sm font-medium flex items-center gap-2">
                          {conn.name}
                          <Badge variant="outline" className="text-xs">{conn.type}</Badge>
                          {conn.isEnabled ? (
                            <Badge className="bg-green-100 text-green-700 border-green-200 text-xs">Connected</Badge>
                          ) : (
                            <Badge variant="secondary" className="text-xs">Disabled</Badge>
                          )}
                        </div>
                        <div className="text-xs text-slate-400 font-mono">{conn.endpoint}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Switch checked={conn.isEnabled} onCheckedChange={() => handleToggleMCP(conn.id)} />
                      <Button variant="ghost" size="sm" className="text-red-600 h-8 w-8 p-0" onClick={() => handleDeleteMCP(conn.id)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
