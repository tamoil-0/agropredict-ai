import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const { message, context } = await req.json();

    // 💡 Context-aware prompt generation
    const prompt = `
You are **AgroPredict AI 🌾**, a friendly yet technical agricultural assistant.
Your goal is to help users understand their agricultural environment — weather, crops, NDVI, heat units (GDD), and flowering.

Current context (use only if relevant):
- Temperature: ${context?.temp ?? "—"} °C
- Humidity: ${context?.hum ?? "—"} %
- Pressure: ${context?.pres ?? "—"} hPa
- Altitude: ${context?.alt ?? "—"} m
- Crop status: ${context?.phase ?? "—"}
- Flowering index: ${context?.indice?.toFixed?.(1) ?? "—"} %

Instructions:
- If the question relates to weather, flowering, or crop conditions, use these IoT values in your explanation.
- If it’s a general question (e.g., about NDVI, crops, sensors, or AI), answer normally without referencing IoT data.
- Keep answers concise — 1–2 sentences, technical yet friendly.
- Use emojis 🌱☀️💧🌾 only if they make the response clearer.

User: ${message}
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.8,
    });

    const reply =
      completion.choices[0]?.message?.content?.trim() ||
      "🌱 I don’t have precise information on that right now.";

    return NextResponse.json({ reply });
  } catch (error: unknown) {
    console.error("Error in /api/chat:", error);
    return NextResponse.json(
      { reply: "⚠️ Internal error while connecting to OpenAI." },
      { status: 500 }
    );
  }
}
