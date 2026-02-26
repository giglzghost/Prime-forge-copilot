import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, message: 'Use POST.' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    const message = body?.message ?? '(no message provided)';

    return res.status(200).json({
      ok: true,
      message: 'Prime Forge V3 chat stub online.',
      data: {
        echo: message,
        meta: {
          source: 'prime-forge-copilot',
          mode: 'stub',
          note: 'Replace this with full routing once the build is stable.'
        }
      }
    });
  } catch (err: any) {
    return res.status(500).json({
      ok: false,
      message: 'Chat handler error.',
      error: err?.message ?? String(err)
    });
  }
}
