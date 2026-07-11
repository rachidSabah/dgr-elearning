"use client";

// ============================================================
// AI PROVIDER REGISTRY
// Manages multiple AI providers with API key storage
// Supports: OpenRouter, Mistral, Z.ai, NVIDIA, GitHub, OpenAI, Anthropic, Custom
// ============================================================

export interface AIProvider {
  id: string;
  name: string;
  description: string;
  apiBaseUrl: string;
  apiKeyHeader: string;
  authPrefix: string;
  models: AIModel[];
  freeTier: boolean;
  signupUrl: string;
  docsUrl: string;
  icon: string;
  color: string;
}

export interface AIModel {
  id: string;
  name: string;
  contextWindow: number;
  inputCostPer1k?: number;
  outputCostPer1k?: number;
  free: boolean;
  capabilities: string[];
}

export interface ProviderConfig {
  providerId: string;
  apiKey: string;
  selectedModel: string;
  isEnabled: boolean;
  customBaseUrl?: string;
}

// ============================================================
// ALL KNOWN PROVIDERS
// ============================================================

export const AI_PROVIDERS: AIProvider[] = [
  {
    id: "openrouter",
    name: "OpenRouter",
    description: "Access 200+ models from multiple providers. Free models available including Claude, GPT-4, Llama, Mistral, and more. Unified API for all major LLMs.",
    apiBaseUrl: "https://openrouter.ai/api/v1/chat/completions",
    apiKeyHeader: "Authorization",
    authPrefix: "Bearer ",
    freeTier: true,
    signupUrl: "https://openrouter.ai/keys",
    docsUrl: "https://openrouter.ai/docs",
    icon: "router",
    color: "#6366f1",
    models: [
      { id: "meta-llama/llama-3.3-70b-instruct:free", name: "Llama 3.3 70B (Free)", contextWindow: 131072, free: true, capabilities: ["text", "json", "structured"] },
      { id: "google/gemini-2.0-flash-exp:free", name: "Gemini 2.0 Flash (Free)", contextWindow: 1048576, free: true, capabilities: ["text", "vision", "json"] },
      { id: "mistralai/mistral-7b-instruct:free", name: "Mistral 7B (Free)", contextWindow: 32768, free: true, capabilities: ["text", "json"] },
      { id: "qwen/qwen-2.5-72b-instruct:free", name: "Qwen 2.5 72B (Free)", contextWindow: 131072, free: true, capabilities: ["text", "json", "structured"] },
      { id: "anthropic/claude-3.5-sonnet", name: "Claude 3.5 Sonnet", contextWindow: 200000, free: false, inputCostPer1k: 0.003, outputCostPer1k: 0.015, capabilities: ["text", "vision", "structured"] },
      { id: "openai/gpt-4o", name: "GPT-4o", contextWindow: 128000, free: false, inputCostPer1k: 0.005, outputCostPer1k: 0.015, capabilities: ["text", "vision", "json"] },
      { id: "openai/gpt-4o-mini", name: "GPT-4o Mini", contextWindow: 128000, free: false, inputCostPer1k: 0.00015, outputCostPer1k: 0.0006, capabilities: ["text", "vision", "json"] },
    ],
  },
  {
    id: "mistral",
    name: "Mistral AI",
    description: "European AI lab. Free API tier with Mistral 7B, Mixtral, and Codestral. Excellent for structured outputs and multilingual content.",
    apiBaseUrl: "https://api.mistral.ai/v1/chat/completions",
    apiKeyHeader: "Authorization",
    authPrefix: "Bearer ",
    freeTier: true,
    signupUrl: "https://console.mistral.ai/api-keys/",
    docsUrl: "https://docs.mistral.ai/",
    icon: "wind",
    color: "#ff7000",
    models: [
      { id: "mistral-large-latest", name: "Mistral Large", contextWindow: 128000, free: false, inputCostPer1k: 0.002, outputCostPer1k: 0.006, capabilities: ["text", "json", "structured"] },
      { id: "mistral-small-latest", name: "Mistral Small", contextWindow: 32000, free: false, inputCostPer1k: 0.0002, outputCostPer1k: 0.0006, capabilities: ["text", "json"] },
      { id: "open-mistral-7b", name: "Mistral 7B (Open)", contextWindow: 32768, free: true, capabilities: ["text", "json"] },
      { id: "open-mixtral-8x7b", name: "Mixtral 8x7B (Open)", contextWindow: 32768, free: true, capabilities: ["text", "json"] },
      { id: "codestral-latest", name: "Codestral", contextWindow: 256000, free: true, capabilities: ["code", "text"] },
    ],
  },
  {
    id: "zai",
    name: "Z.ai (GLM)",
    description: "Z.ai's GLM models. Already integrated in this platform via z-ai-web-dev-sdk. Excellent for Chinese/English bilingual content.",
    apiBaseUrl: "https://api.z.ai/api/paas/v4/chat/completions",
    apiKeyHeader: "Authorization",
    authPrefix: "Bearer ",
    freeTier: true,
    signupUrl: "https://z.ai",
    docsUrl: "https://docs.z.ai",
    icon: "sparkles",
    color: "#0ea5e9",
    models: [
      { id: "glm-4-plus", name: "GLM-4 Plus", contextWindow: 128000, free: false, capabilities: ["text", "vision", "json", "structured"] },
      { id: "glm-4", name: "GLM-4", contextWindow: 128000, free: false, capabilities: ["text", "json"] },
      { id: "glm-4-flash", name: "GLM-4 Flash (Free)", contextWindow: 128000, free: true, capabilities: ["text", "json"] },
      { id: "glm-4v", name: "GLM-4V (Vision)", contextWindow: 8192, free: false, capabilities: ["text", "vision"] },
    ],
  },
  {
    id: "nvidia",
    name: "NVIDIA NIM",
    description: "NVIDIA's inference microservices. Free API access to Llama, Mistral, and Nemotron models via build.nvidia.com.",
    apiBaseUrl: "https://integrate.api.nvidia.com/v1/chat/completions",
    apiKeyHeader: "Authorization",
    authPrefix: "Bearer ",
    freeTier: true,
    signupUrl: "https://build.nvidia.com/api-keys",
    docsUrl: "https://docs.api.nvidia.com/nim/reference",
    icon: "cpu",
    color: "#76b900",
    models: [
      { id: "meta/llama-3.3-70b-instruct", name: "Llama 3.3 70B", contextWindow: 131072, free: true, capabilities: ["text", "json", "structured"] },
      { id: "meta/llama-3.1-405b-instruct", name: "Llama 3.1 405B", contextWindow: 131072, free: true, capabilities: ["text", "json"] },
      { id: "mistralai/mixtral-8x22b-instruct-v0.1", name: "Mixtral 8x22B", contextWindow: 65536, free: true, capabilities: ["text", "json"] },
      { id: "nvidia/llama-3.1-nemotron-70b-instruct", name: "Nemotron 70B", contextWindow: 131072, free: true, capabilities: ["text", "structured"] },
    ],
  },
  {
    id: "github",
    name: "GitHub Models",
    description: "GitHub's model marketplace. Free access to GPT-4o, Llama, Mistral, and Phi models via GitHub token. Requires GitHub account.",
    apiBaseUrl: "https://models.inference.ai.azure.com/chat/completions",
    apiKeyHeader: "Authorization",
    authPrefix: "Bearer ",
    freeTier: true,
    signupUrl: "https://github.com/settings/tokens",
    docsUrl: "https://docs.github.com/en/models",
    icon: "github",
    color: "#181717",
    models: [
      { id: "gpt-4o", name: "GPT-4o", contextWindow: 128000, free: true, capabilities: ["text", "vision", "json"] },
      { id: "gpt-4o-mini", name: "GPT-4o Mini", contextWindow: 128000, free: true, capabilities: ["text", "json"] },
      { id: "Meta-Llama-3.1-70B-Instruct", name: "Llama 3.1 70B", contextWindow: 131072, free: true, capabilities: ["text", "json"] },
      { id: "Mistral-large", name: "Mistral Large", contextWindow: 32768, free: true, capabilities: ["text", "json"] },
      { id: "Phi-3.5-mini-instruct", name: "Phi 3.5 Mini", contextWindow: 128000, free: true, capabilities: ["text"] },
    ],
  },
  {
    id: "openai",
    name: "OpenAI",
    description: "Direct OpenAI API. GPT-4o, GPT-4, GPT-3.5 Turbo. Paid only but highest quality.",
    apiBaseUrl: "https://api.openai.com/v1/chat/completions",
    apiKeyHeader: "Authorization",
    authPrefix: "Bearer ",
    freeTier: false,
    signupUrl: "https://platform.openai.com/api-keys",
    docsUrl: "https://platform.openai.com/docs",
    icon: "brain",
    color: "#10a37f",
    models: [
      { id: "gpt-4o", name: "GPT-4o", contextWindow: 128000, free: false, inputCostPer1k: 0.005, outputCostPer1k: 0.015, capabilities: ["text", "vision", "json"] },
      { id: "gpt-4o-mini", name: "GPT-4o Mini", contextWindow: 128000, free: false, inputCostPer1k: 0.00015, outputCostPer1k: 0.0006, capabilities: ["text", "vision", "json"] },
      { id: "gpt-4-turbo", name: "GPT-4 Turbo", contextWindow: 128000, free: false, inputCostPer1k: 0.01, outputCostPer1k: 0.03, capabilities: ["text", "vision", "json"] },
    ],
  },
  {
    id: "anthropic",
    name: "Anthropic (Claude)",
    description: "Claude 3.5 Sonnet, Opus, and Haiku. Best for long-context reasoning and structured output.",
    apiBaseUrl: "https://api.anthropic.com/v1/messages",
    apiKeyHeader: "x-api-key",
    authPrefix: "",
    freeTier: false,
    signupUrl: "https://console.anthropic.com/settings/keys",
    docsUrl: "https://docs.anthropic.com",
    icon: "message-square",
    color: "#d4a574",
    models: [
      { id: "claude-3-5-sonnet-20241022", name: "Claude 3.5 Sonnet", contextWindow: 200000, free: false, inputCostPer1k: 0.003, outputCostPer1k: 0.015, capabilities: ["text", "vision", "structured"] },
      { id: "claude-3-5-haiku-20241022", name: "Claude 3.5 Haiku", contextWindow: 200000, free: false, inputCostPer1k: 0.0008, outputCostPer1k: 0.004, capabilities: ["text", "vision"] },
      { id: "claude-3-opus-20240229", name: "Claude 3 Opus", contextWindow: 200000, free: false, inputCostPer1k: 0.015, outputCostPer1k: 0.075, capabilities: ["text", "vision"] },
    ],
  },
  {
    id: "groq",
    name: "Groq",
    description: "Ultra-fast inference. Free tier with Llama 3.3, Mixtral, and Gemma. Fastest API responses available.",
    apiBaseUrl: "https://api.groq.com/openai/v1/chat/completions",
    apiKeyHeader: "Authorization",
    authPrefix: "Bearer ",
    freeTier: true,
    signupUrl: "https://console.groq.com/keys",
    docsUrl: "https://console.groq.com/docs",
    icon: "zap",
    color: "#f55036",
    models: [
      { id: "llama-3.3-70b-versatile", name: "Llama 3.3 70B", contextWindow: 131072, free: true, capabilities: ["text", "json"] },
      { id: "llama-3.1-8b-instant", name: "Llama 3.1 8B Instant", contextWindow: 131072, free: true, capabilities: ["text", "json"] },
      { id: "mixtral-8x7b-32768", name: "Mixtral 8x7B", contextWindow: 32768, free: true, capabilities: ["text", "json"] },
    ],
  },
  {
    id: "google",
    name: "Google AI Studio",
    description: "Google's Gemini models via AI Studio API. FREE tier with generous limits. Gemini 2.0 Flash, Gemini 1.5 Pro, and Gemini 1.5 Flash. 1M+ token context window.",
    apiBaseUrl: "https://generativelanguage.googleapis.com/v1beta/models",
    apiKeyHeader: "x-goog-api-key",
    authPrefix: "",
    freeTier: true,
    signupUrl: "https://aistudio.google.com/app/apikey",
    docsUrl: "https://ai.google.dev/gemini-api/docs",
    icon: "search",
    color: "#4285f4",
    models: [
      { id: "gemini-2.0-flash", name: "Gemini 2.0 Flash (Free)", contextWindow: 1048576, free: true, capabilities: ["text", "vision", "json", "structured"] },
      { id: "gemini-1.5-flash", name: "Gemini 1.5 Flash (Free)", contextWindow: 1048576, free: true, capabilities: ["text", "vision", "json"] },
      { id: "gemini-1.5-pro", name: "Gemini 1.5 Pro", contextWindow: 2097152, free: false, inputCostPer1k: 0.00125, outputCostPer1k: 0.005, capabilities: ["text", "vision", "json", "structured"] },
      { id: "gemini-1.5-flash-8b", name: "Gemini 1.5 Flash 8B (Free)", contextWindow: 1048576, free: true, capabilities: ["text", "json"] },
    ],
  },
  {
    id: "opencode",
    name: "OpenCode AI",
    description: "OpenCode AI provides free API access to open-source models. Community-driven, no cost. Includes Zen, CodeLlama, and other open models for text generation and code.",
    apiBaseUrl: "https://api.opencode.ai/v1/chat/completions",
    apiKeyHeader: "Authorization",
    authPrefix: "Bearer ",
    freeTier: true,
    signupUrl: "https://opencode.ai",
    docsUrl: "https://docs.opencode.ai",
    icon: "code",
    color: "#8b5cf6",
    models: [
      { id: "opencode/zen-7b", name: "Zen 7B (Free)", contextWindow: 32768, free: true, capabilities: ["text", "json", "structured"] },
      { id: "opencode/zen-13b", name: "Zen 13B (Free)", contextWindow: 32768, free: true, capabilities: ["text", "json"] },
      { id: "opencode/codellama-34b", name: "CodeLlama 34B (Free)", contextWindow: 16384, free: true, capabilities: ["code", "text"] },
      { id: "opencode/codellama-70b", name: "CodeLlama 70B", contextWindow: 32768, free: true, capabilities: ["code", "text"] },
    ],
  },
  {
    id: "zenoracle",
    name: "Zen Oracle",
    description: "Zen Oracle AI — free community API for the Zen model family. Zen-1 and Zen-2 models optimized for reasoning, structured output, and multilingual content. Completely free with rate limits.",
    apiBaseUrl: "https://api.zenoracle.ai/v1/chat/completions",
    apiKeyHeader: "Authorization",
    authPrefix: "Bearer ",
    freeTier: true,
    signupUrl: "https://zenoracle.ai/signup",
    docsUrl: "https://docs.zenoracle.ai",
    icon: "sparkles",
    color: "#06b6d4",
    models: [
      { id: "zen-1", name: "Zen-1 (Free)", contextWindow: 32768, free: true, capabilities: ["text", "json", "structured"] },
      { id: "zen-2", name: "Zen-2 (Free)", contextWindow: 65536, free: true, capabilities: ["text", "json", "structured", "reasoning"] },
      { id: "zen-2-mini", name: "Zen-2 Mini (Free)", contextWindow: 32768, free: true, capabilities: ["text", "json"] },
    ],
  },
  {
    id: "together",
    name: "Together AI",
    description: "Together AI offers free credits for open-source model inference. Llama 3.3, Mixtral, DBRX, Qwen, and more. OpenAI-compatible API with generous free tier.",
    apiBaseUrl: "https://api.together.xyz/v1/chat/completions",
    apiKeyHeader: "Authorization",
    authPrefix: "Bearer ",
    freeTier: true,
    signupUrl: "https://api.together.xyz/settings/api-keys",
    docsUrl: "https://docs.together.ai",
    icon: "users",
    color: "#0f172a",
    models: [
      { id: "meta-llama/Llama-3.3-70B-Instruct-Turbo", name: "Llama 3.3 70B Turbo", contextWindow: 131072, free: true, capabilities: ["text", "json", "structured"] },
      { id: "meta-llama/Meta-Llama-3.1-405B-Instruct-Turbo", name: "Llama 3.1 405B Turbo", contextWindow: 131072, free: false, inputCostPer1k: 0.005, outputCostPer1k: 0.015, capabilities: ["text", "json"] },
      { id: "mistralai/Mixtral-8x22B-Instruct-v0.1", name: "Mixtral 8x22B", contextWindow: 65536, free: true, capabilities: ["text", "json"] },
      { id: "Qwen/Qwen2.5-72B-Instruct-Turbo", name: "Qwen 2.5 72B", contextWindow: 131072, free: true, capabilities: ["text", "json"] },
      { id: "databricks/dbrx-instruct", name: "DBRX Instruct", contextWindow: 32768, free: true, capabilities: ["text", "json"] },
    ],
  },
  {
    id: "huggingface",
    name: "Hugging Face",
    description: "Hugging Face Inference API — free access to 200,000+ open-source models. Llama, Mistral, Phi, Gemma, and thousands more. Free tier with rate limits, OpenAI-compatible endpoint.",
    apiBaseUrl: "https://api-inference.huggingface.co/models",
    apiKeyHeader: "Authorization",
    authPrefix: "Bearer ",
    freeTier: true,
    signupUrl: "https://huggingface.co/settings/tokens",
    docsUrl: "https://huggingface.co/docs/api-inference",
    icon: "brain",
    color: "#ffd21e",
    models: [
      { id: "meta-llama/Meta-Llama-3.1-70B-Instruct", name: "Llama 3.1 70B (Free)", contextWindow: 131072, free: true, capabilities: ["text", "json"] },
      { id: "mistralai/Mistral-7B-Instruct-v0.3", name: "Mistral 7B v0.3 (Free)", contextWindow: 32768, free: true, capabilities: ["text", "json"] },
      { id: "microsoft/Phi-3.5-mini-instruct", name: "Phi 3.5 Mini (Free)", contextWindow: 128000, free: true, capabilities: ["text"] },
      { id: "google/gemma-2-9b-it", name: "Gemma 2 9B (Free)", contextWindow: 8192, free: true, capabilities: ["text", "json"] },
      { id: "Qwen/Qwen2.5-72B-Instruct", name: "Qwen 2.5 72B (Free)", contextWindow: 32768, free: true, capabilities: ["text", "json"] },
    ],
  },
  {
    id: "custom",
    name: "Custom Provider",
    description: "Connect to any OpenAI-compatible API endpoint. Self-hosted models, local LLMs (Ollama), or private endpoints.",
    apiBaseUrl: "",
    apiKeyHeader: "Authorization",
    authPrefix: "Bearer ",
    freeTier: true,
    signupUrl: "",
    docsUrl: "",
    icon: "settings",
    color: "#64748b",
    models: [
      { id: "custom-model", name: "Custom Model", contextWindow: 32768, free: true, capabilities: ["text", "json"] },
    ],
  },
];

// ============================================================
// PROVIDER CONFIG MANAGEMENT (localStorage)
// ============================================================

const PROVIDER_CONFIG_KEY = "dgr-academy-ai-providers";
const MCP_CONFIG_KEY = "dgr-academy-mcp-config";

export function getProviderConfigs(): ProviderConfig[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(PROVIDER_CONFIG_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export function saveProviderConfigs(configs: ProviderConfig[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(PROVIDER_CONFIG_KEY, JSON.stringify(configs));
}

export function getProviderConfig(providerId: string): ProviderConfig | null {
  return getProviderConfigs().find((c) => c.providerId === providerId) || null;
}

export function saveProviderConfig(config: ProviderConfig) {
  const configs = getProviderConfigs();
  const idx = configs.findIndex((c) => c.providerId === config.providerId);
  if (idx >= 0) {
    configs[idx] = config;
  } else {
    configs.push(config);
  }
  saveProviderConfigs(configs);
}

export function deleteProviderConfig(providerId: string) {
  const configs = getProviderConfigs().filter((c) => c.providerId !== providerId);
  saveProviderConfigs(configs);
}

export function getEnabledProviders(): ProviderConfig[] {
  return getProviderConfigs().filter((c) => c.isEnabled && c.apiKey);
}

export function getProviderById(providerId: string): AIProvider | null {
  return AI_PROVIDERS.find((p) => p.id === providerId) || null;
}

// ============================================================
// MCP CONNECTION CONFIG
// ============================================================

export interface MCPConnection {
  id: string;
  name: string;
  type: "hermes-desktop" | "hermes-agent" | "claude-desktop" | "custom-mcp" | "webhook";
  endpoint: string;
  authToken: string;
  isEnabled: boolean;
  lastConnected?: string;
  capabilities: string[];
}

export function getMCPConnections(): MCPConnection[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(MCP_CONFIG_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export function saveMCPConnections(connections: MCPConnection[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(MCP_CONFIG_KEY, JSON.stringify(connections));
}

export function saveMCPConnection(conn: MCPConnection) {
  const conns = getMCPConnections();
  const idx = conns.findIndex((c) => c.id === conn.id);
  if (idx >= 0) conns[idx] = conn;
  else conns.push(conn);
  saveMCPConnections(conns);
}

export function deleteMCPConnection(id: string) {
  saveMCPConnections(getMCPConnections().filter((c) => c.id !== id));
}

// ============================================================
// AI API CALL FUNCTION
// ============================================================

export async function callAI(
  providerId: string,
  model: string,
  messages: { role: string; content: string }[],
  options?: { temperature?: number; maxTokens?: number; jsonMode?: boolean }
): Promise<{ success: boolean; content?: string; error?: string }> {
  const config = getProviderConfig(providerId);
  if (!config || !config.apiKey) {
    return { success: false, error: "Provider not configured. Add an API key in AI Providers settings." };
  }

  const provider = getProviderById(providerId);
  if (!provider) {
    return { success: false, error: "Unknown provider" };
  }

  const baseUrl = config.customBaseUrl || provider.apiBaseUrl;
  if (!baseUrl) {
    return { success: false, error: "No API endpoint configured" };
  }

  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    // Set auth header
    if (provider.authPrefix) {
      headers[provider.apiKeyHeader] = provider.authPrefix + config.apiKey;
    } else {
      headers[provider.apiKeyHeader] = config.apiKey;
    }

    // OpenRouter specific headers
    if (providerId === "openrouter") {
      headers["HTTP-Referer"] = "https://dgr-elearning.pages.dev";
      headers["X-Title"] = "DGR Aviation Academy";
    }

    // Anthropic specific headers
    if (providerId === "anthropic") {
      headers["anthropic-version"] = "2023-06-01";
    }

    let body: any = {
      model,
      messages,
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.maxTokens ?? 4096,
    };

    if (options?.jsonMode) {
      body.response_format = { type: "json_object" };
    }

    // Google AI Studio uses different API format
    if (providerId === "google") {
      const systemMsg = messages.find((m) => m.role === "system");
      const userMessages = messages.filter((m) => m.role !== "system");
      body = {
        contents: userMessages.map((m) => ({
          role: m.role === "assistant" ? "model" : "user",
          parts: [{ text: m.content }],
        })),
        generationConfig: {
          temperature: options?.temperature ?? 0.7,
          maxOutputTokens: options?.maxTokens ?? 8192,
          responseMimeType: options?.jsonMode ? "application/json" : "text/plain",
        },
      };
      if (systemMsg) {
        body.systemInstruction = { parts: [{ text: systemMsg.content }] };
      }
    }

    // Hugging Face uses a different endpoint format
    if (providerId === "huggingface") {
      body = {
        inputs: messages.map((m) => `${m.role}: ${m.content}`).join("\n"),
        parameters: {
          temperature: options?.temperature ?? 0.7,
          max_new_tokens: options?.maxTokens ?? 4096,
          return_full_text: false,
        },
      };
    }

    // Anthropic uses different message format
    if (providerId === "anthropic") {
      const systemMsg = messages.find((m) => m.role === "system");
      const userMessages = messages.filter((m) => m.role !== "system");
      body.system = systemMsg?.content || "";
      body.messages = userMessages.map((m) => ({ role: m.role, content: m.content }));
      body.max_tokens = options?.maxTokens ?? 4096;
      delete body.temperature;
    }

    const response = await fetch(baseUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return { success: false, error: `API error (${response.status}): ${errorText.substring(0, 200)}` };
    }

    const data = await response.json();

    // Extract content based on provider format
    let content = "";
    if (providerId === "google" && data.candidates) {
      // Google AI Studio format
      content = data.candidates[0]?.content?.parts?.map((p: any) => p.text).join("") || "";
    } else if (providerId === "huggingface" && Array.isArray(data) && data[0]?.generated_text) {
      content = data[0].generated_text;
    } else if (data.choices && data.choices[0]?.message?.content) {
      content = data.choices[0].message.content;
    } else if (data.content && data.content[0]?.text) {
      // Anthropic format
      content = data.content[0].text;
    } else if (data.choices && data.choices[0]?.text) {
      content = data.choices[0].text;
    } else {
      content = JSON.stringify(data);
    }

    return { success: true, content };
  } catch (error) {
    return { success: false, error: `Network error: ${String(error).substring(0, 200)}` };
  }
}

// ============================================================
// COURSE GENERATION PIPELINE
// ============================================================

export interface CourseGenerationRequest {
  pdfText: string;
  prompt: string;
  providerId: string;
  model: string;
  courseTitle?: string;
  courseCategory?: string;
  difficulty?: string;
  numberOfModules?: number;
}

export interface GeneratedCourse {
  title: string;
  subtitle: string;
  description: string;
  duration: number;
  difficulty: string;
  objectives: string[];
  modules: {
    code: string;
    title: string;
    description: string;
    color: string;
    icon: string;
    lessons: {
      code: string;
      title: string;
      duration: number;
      objectives: string[];
      content: any[];
      summary: string[];
      reviewQuestions: string[];
    }[];
  }[];
  finalExam: {
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  }[];
  flashcards: { front: string; back: string; category: string }[];
  glossary: { term: string; definition: string }[];
  scenarios: {
    title: string;
    situation: string;
    background: string;
    choices: { text: string; correct: boolean; feedback: string }[];
    correctExplanation: string;
    reference: string;
  }[];
}

const COURSE_GENERATION_SYSTEM_PROMPT = `You are an expert aviation training course designer. You create professional, interactive eLearning courses for cabin crew and aviation professionals.

Given a PDF's text content and a user's instructions, you must generate a complete, structured course in JSON format.

The course must include:
1. Multiple modules with lessons (each lesson has objectives, content blocks, summary, review questions)
2. Content blocks can be: paragraph, heading, callout (info/warning/danger/tip/note), list, table, image (use placeholder URLs like /images/placeholder.jpg), keyTerms, knowledgeCheck
3. A final exam with 15-20 multiple choice questions
4. 20+ flashcards with front/back
5. A glossary of 15+ key terms
6. 3-5 realistic scenario simulations

CRITICAL RULES:
- Preserve ALL educational content from the PDF
- Make every lesson interactive with knowledge checks
- Include callout boxes for important warnings and procedures
- Use tables for reference data
- Generate realistic scenarios with decision points
- The output must be valid JSON

Return ONLY the JSON, no markdown formatting, no explanation.`;

export async function generateCourse(
  request: CourseGenerationRequest
): Promise<{ success: boolean; course?: GeneratedCourse; error?: string; progress?: string }> {
  const { pdfText, prompt, providerId, model } = request;

  if (!pdfText || pdfText.trim().length < 100) {
    return { success: false, error: "PDF text is too short or empty. Please upload a valid PDF." };
  }

  if (!prompt || prompt.trim().length < 10) {
    return { success: false, error: "Please provide instructions for how you want the course built." };
  }

  // Truncate PDF text if too long (most models handle 32k-128k tokens)
  const maxChars = 80000; // ~20k tokens
  const truncatedText = pdfText.length > maxChars ? pdfText.substring(0, maxChars) + "\n[... PDF truncated ...]" : pdfText;

  const userPrompt = `Build a professional aviation training course based on the following PDF content.

USER INSTRUCTIONS: ${prompt}

COURSE PARAMETERS:
- Title: ${request.courseTitle || "Auto-generate based on content"}
- Category: ${request.courseCategory || "Cabin Crew Training"}
- Difficulty: ${request.difficulty || "Professional"}
- Number of modules: ${request.numberOfModules || "Determine based on content"}

PDF CONTENT (preserve all educational information):
---
${truncatedText}
---

Generate the complete course as JSON with this structure:
{
  "title": "string",
  "subtitle": "string",
  "description": "string",
  "duration": number (minutes),
  "difficulty": "string",
  "objectives": ["string"],
  "modules": [{
    "code": "string",
    "title": "string",
    "description": "string",
    "color": "#hex",
    "icon": "string",
    "lessons": [{
      "code": "string",
      "title": "string",
      "duration": number,
      "objectives": ["string"],
      "content": [
        {"type": "paragraph", "text": "string"},
        {"type": "heading", "text": "string", "level": 3},
        {"type": "callout", "variant": "info|warning|danger|tip|note", "title": "string", "text": "string"},
        {"type": "list", "items": ["string"]},
        {"type": "table", "headers": ["string"], "rows": [["string"]], "caption": "string"},
        {"type": "keyTerms", "terms": [{"term": "string", "definition": "string"}]},
        {"type": "knowledgeCheck", "question": "string", "options": ["string"], "correctAnswer": 0, "explanation": "string"}
      ],
      "summary": ["string"],
      "reviewQuestions": ["string"]
    }]
  }],
  "finalExam": [{"question": "string", "options": ["string"], "correctAnswer": 0, "explanation": "string"}],
  "flashcards": [{"front": "string", "back": "string", "category": "string"}],
  "glossary": [{"term": "string", "definition": "string"}],
  "scenarios": [{
    "title": "string",
    "situation": "string",
    "background": "string",
    "choices": [{"text": "string", "correct": boolean, "feedback": "string"}],
    "correctExplanation": "string",
    "reference": "string"
  }]
}

Return ONLY valid JSON. No markdown, no code fences, no explanation.`;

  const result = await callAI(
    providerId,
    model,
    [
      { role: "system", content: COURSE_GENERATION_SYSTEM_PROMPT },
      { role: "user", content: userPrompt },
    ],
    { temperature: 0.7, maxTokens: 8192, jsonMode: true }
  );

  if (!result.success) {
    return { success: false, error: result.error };
  }

  // Parse the JSON response
  try {
    // Strip any markdown code fences if present
    let jsonStr = result.content || "";
    jsonStr = jsonStr.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

    const course = JSON.parse(jsonStr) as GeneratedCourse;

    // Basic validation
    if (!course.title || !course.modules || course.modules.length === 0) {
      return { success: false, error: "AI generated invalid course structure. Try again with a different prompt or model." };
    }

    return { success: true, course };
  } catch (error) {
    return { success: false, error: `Failed to parse AI response as JSON. The model may not support structured output. Try a different model. Error: ${String(error).substring(0, 200)}` };
  }
}

// Convert GeneratedCourse to CourseData format
export function convertGeneratedCourse(gen: GeneratedCourse): import("./types").CourseData {
  const moduleIdMap: Record<string, string> = {};
  const lessonIdMap: Record<string, string> = {};

  return {
    title: gen.title,
    subtitle: gen.subtitle || "Generated Course",
    description: gen.description,
    edition: "AI Generated",
    duration: gen.duration || 300,
    difficulty: gen.difficulty || "Professional",
    instructor: "AI Course Builder",
    objectives: gen.objectives || [],
    modules: gen.modules.map((m, mi) => {
      const moduleId = `gen-mod-${mi}`;
      return {
        id: moduleId,
        code: m.code,
        title: m.title,
        description: m.description,
        icon: m.icon || "BookOpen",
        color: m.color || "#0ea5e9",
        lessons: m.lessons.map((l, li) => {
          const lessonId = `gen-lesson-${mi}-${li}`;
          return {
            id: lessonId,
            moduleId,
            code: l.code,
            title: l.title,
            duration: l.duration || 15,
            objectives: l.objectives,
            content: l.content,
            summary: l.summary,
            reviewQuestions: l.reviewQuestions,
          };
        }),
      };
    }),
    quizzes: {},
    moduleQuizzes: {},
    finalExam: gen.finalExam.map((q, i) => ({
      id: `gen-exam-${i}`,
      type: "mcq" as const,
      question: q.question,
      options: q.options,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
      difficulty: "medium" as const,
      topic: "General",
    })),
    flashcards: gen.flashcards.map((f, i) => ({
      id: `gen-fc-${i}`,
      front: f.front,
      back: f.back,
      category: f.category || "General",
    })),
    scenarios: gen.scenarios.map((s, i) => ({
      id: `gen-sc-${i}`,
      title: s.title,
      situation: s.situation,
      background: s.background,
      choices: s.choices,
      correctExplanation: s.correctExplanation,
      reference: s.reference || "",
    })),
    glossary: gen.glossary,
    faq: [],
    testimonials: [],
  };
}
