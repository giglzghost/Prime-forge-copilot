import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, message: 'Use POST.' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    const prompt = body?.prompt ?? 'Prime Forge avatar';

    return res.status(200).json({
      ok: true,
      message: 'Prime Forge V3 avatar stub online.',
      data: {
        prompt,
        suggestion: {
          name: 'Elaira',
          description: 'Primary interface of the Prime Forge Empire.',
          style: 'futuristic, calm, human‑aligned',
          colors: ['fire', 'ice', 'deep space']
        }
      }
    });
  } catch (err: any) {
    return res.status(500).json({
      ok: false,
      message: 'Avatar handler error.',
      error: err?.message ?? String(err)
    });
  }
}
