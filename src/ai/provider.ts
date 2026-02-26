// src/ai/provider.ts

type ProviderName = "openai" | "azure" | "mock";

interface LLMRequest {
  prompt: string;
  maxTokens?: number;
}

interface LLMResponse {
  text: string;
  provider: ProviderName;
  ok: boolean;
}

interface ImageRequest {
  prompt: string;
  size?: "512x512" | "1024x1024";
}

interface ImageResponse {
  url: string;
  provider: ProviderName;
  ok: boolean;
}

function getProvider(): ProviderName {
  const p = process.env.PF_AI_PROVIDER || "mock";
  if (p === "openai" || p === "azure" || p === "mock") return p;
  return "mock";
}

// --- Low-level single-provider calls ----------------------------------------

async function callOpenAI(req: LLMRequest): Promise<LLMResponse> {
  // TODO: wire real OpenAI SDK here
  return {
    text: `[OPENAI LLM] (not yet wired) ${req.prompt.slice(0, 200)}`,
    provider: "openai",
    ok: true,
  };
}

async function callAzure(req: LLMRequest): Promise<LLMResponse> {
  // TODO: wire real Azure OpenAI SDK here
  return {
    text: `[AZURE LLM] (not yet wired) ${req.prompt.slice(0, 200)}`,
    provider: "azure",
    ok: true,
  };
}

async function callMock(req: LLMRequest): Promise<LLMResponse> {
  return {
    text: `[MOCK LLM] ${req.prompt.slice(0, 200)}`,
    provider: "mock",
    ok: true,
  };
}

async function generateOpenAIImage(req: ImageRequest): Promise<ImageResponse> {
  // TODO: wire real OpenAI image generation here
  return {
    url: `https://placehold.co/600x400?text=OPENAI`,
    provider: "openai",
    ok: true,
  };
}

async function generateAzureImage(req: ImageRequest): Promise<ImageResponse> {
  // TODO: wire real Azure image generation here
  return {
    url: `https://placehold.co/600x400?text=AZURE`,
    provider: "azure",
    ok: true,
  };
}

async function generateMockImage(req: ImageRequest): Promise<ImageResponse> {
  return {
    url: `https://placehold.co/600x400?text=${encodeURIComponent(
      req.prompt.slice(0, 40)
    )}`,
    provider: "mock",
    ok: true,
  };
}

// --- Public LLM API (single best-effort call) -------------------------------

export async function callLLM(req: LLMRequest): Promise<LLMResponse> {
  const provider = getProvider();

  if (provider === "openai") {
    try {
      return await callOpenAI(req);
    } catch {
      return await callMock(req);
    }
  }

  if (provider === "azure") {
    try {
      return await callAzure(req);
    } catch {
      return await callMock(req);
    }
  }

  return await callMock(req);
}

// --- Multi-AI fan-out for Prime Forge / AI7 ---------------------------------

export interface MultiAIResult {
  primary: string | null;
  providers: LLMResponse[];
}

export async function runMultiAI(
  prompt: string,
  _modeHandler?: unknown
): Promise<MultiAIResult> {
  // Hybrid strategy:
  // - LLMs: parallel fan-out (OpenAI + Azure + Mock)
  // - Selection: first non-mock success, else mock
  const tasks: Promise<LLMResponse>[] = [];

  tasks.push(callMock({ prompt })); // always available

  // Try OpenAI in parallel if configured
  if (process.env.OPENAI_API_KEY) {
    tasks.push(
      callOpenAI({
        prompt,
      })
    );
  }

  // Try Azure in parallel if configured
  if (process.env.AZURE_OPENAI_ENDPOINT && process.env.AZURE_OPENAI_KEY) {
    tasks.push(
      callAzure({
        prompt,
      })
    );
  }

  const results = await Promise.all(tasks);

  let primary: string | null = null;

  // Prefer non-mock providers if they succeeded
  for (const r of results) {
    if (r.ok && r.provider !== "mock") {
      primary = r.text;
      break;
    }
  }

  // Fallback to mock
  if (!primary) {
    const mock = results.find((r) => r.provider === "mock");
    primary = mock?.text ?? null;
  }

  return {
    primary,
    providers: results,
  };
}

// --- Public image API (hybrid: sequential/fallback) -------------------------

export async function generateImage(
  req: ImageRequest
): Promise<ImageResponse> {
  const provider = getProvider();

  // Hybrid strategy for images:
  // - Try configured provider first
  // - Fallback chain: OpenAI -> Azure -> Mock

  // If explicitly set to mock, just return mock
  if (provider === "mock") {
    return generateMockImage(req);
  }

  // If configured for OpenAI
  if (provider === "openai") {
    try {
      return await generateOpenAIImage(req);
    } catch {
      // fallback to Azure, then mock
      try {
        return await generateAzureImage(req);
      } catch {
        return await generateMockImage(req);
      }
    }
  }

  // If configured for Azure
  if (provider === "azure") {
    try {
      return await generateAzureImage(req);
    } catch {
      // fallback to OpenAI, then mock
      try {
        return await generateOpenAIImage(req);
      } catch {
        return await generateMockImage(req);
      }
    }
  }

  // Default fallback
  return generateMockImage(req);
}
