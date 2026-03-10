import { generateImage } from "../ai/provider";

export async function createImage(payload: any) {
  const prompt = payload.prompt;

  if (!prompt || typeof prompt !== "string") {
    return {
      ok: false,
      message: "Missing 'prompt'."
    };
  }

  const img = await generateImage({
    prompt,
    size: payload.size || "1024x1024"
  });

  return {
    ok: true,
    message: "Image generation request processed.",
    data: img
  };
}
