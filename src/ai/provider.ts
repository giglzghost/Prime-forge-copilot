type ProviderName = "openai" | "azure" | "mock";

interface LLMRequest {
  prompt: string;
  maxTokens?: number;
}

interface LLMResponse {
  text: string;
}

interface ImageRequest {
  prompt: string;
  size?: "512x512" | "1024x1024";
}

interface ImageResponse {
  url: string;
}

function getProvider(): ProviderName {
  const p = process.env.PF_AI_PROVIDER || "mock";
  if (p === "openai" || p === "azure" || p === "mock") return p;
  return "mock";
}

export async function callLLM(req: LLMRequest): Promise<LLMResponse> {
  const provider = getProvider();

  if (provider === "mock") {
    return {
      text: `[MOCK LLM] ${req.prompt.slice(0, 200)}`
    };
  }

  // TODO: wire real OpenAI/Azure SDKs here
  // Use env vars like OPENAI_API_KEY, AZURE_OPENAI_ENDPOINT, etc.
  return {
    text: `[${provider.toUpperCase()} LLM] (not yet wired) ${req.prompt.slice(
      0,
      200
    )}`
  };
}

export async function generateImage(
  req: ImageRequest
): Promise<ImageResponse> {
  const provider = getProvider();

  if (provider === "mock") {
    return {
      url: `https://placehold.co/600x400?text=${encodeURIComponent(
        req.prompt.slice(0, 40)
      )}`
    };
  }

  // TODO: wire real image generation (DALL·E, Azure, etc.)
  return {
    url: `https://placehold.co/600x400?text=${encodeURIComponent(
      provider.toUpperCase()
    )}`
  };
}
