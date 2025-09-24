import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge'; // Use edge runtime for streaming

export async function POST(req: NextRequest) {
  // Parse multipart form data
  const contentType = req.headers.get('content-type') || '';
  if (!contentType.includes('multipart/form-data')) {
    return NextResponse.json({ error: 'Invalid content type' }, { status: 400 });
  }

  // Next.js edge runtime does not support file parsing out of the box.
  // For demo, just return success. In production, use a serverless function or custom server.
  return NextResponse.json({ success: true, message: 'File received (not actually saved in this demo).' });
}
