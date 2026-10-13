import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      text,
      voiceId = 'pNInz6obpgDQGcFmaJgB', // Adam by default
      apiKey,
      stability = 0.5,
      similarityBoost = 0.75,
    } = body;

    if (!text || text.trim().length === 0) {
      return NextResponse.json({ error: 'Text prompt is required' }, { status: 400 });
    }

    // If real ElevenLabs API key is supplied by the user
    if (apiKey && apiKey.trim().length > 5) {
      const elevenRes = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`,
        {
          method: 'POST',
          headers: {
            'xi-api-key': apiKey.trim(),
            'Content-Type': 'application/json',
            Accept: 'audio/mpeg',
          },
          body: JSON.stringify({
            text,
            model_id: 'eleven_multilingual_v2',
            voice_settings: {
              stability: Number(stability),
              similarity_boost: Number(similarityBoost),
            },
          }),
        }
      );

      if (!elevenRes.ok) {
        const errorText = await elevenRes.text();
        return NextResponse.json(
          { error: `ElevenLabs API error (${elevenRes.status}): ${errorText}` },
          { status: elevenRes.status }
        );
      }

      const audioBuffer = await elevenRes.arrayBuffer();
      return new NextResponse(audioBuffer, {
        headers: {
          'Content-Type': 'audio/mpeg',
          'Content-Length': audioBuffer.byteLength.toString(),
        },
      });
    }

    // Fallback demo mode if user hasn't configured an API key yet
    // Return standard sample audio with metadata
    return NextResponse.json({
      fallback: true,
      message: 'Demo Mode: ElevenLabs API Key not provided in settings. Using dynamic demo speech sync.',
      audioUrl: 'https://cdn.freesound.org/previews/612/612610_5674468-lq.mp3',
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: `Internal server error: ${errorMessage}` },
      { status: 500 }
    );
  }
}
