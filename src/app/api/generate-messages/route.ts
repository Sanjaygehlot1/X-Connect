import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export const runtime = "edge";

export async function POST() {
  try {
    const prompt =
      "Generate a list of three lighthearted and amusing questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should encourage laughter, kindness, and fun interactions. Avoid personal or sensitive topics, ensuring the questions are universally enjoyable and spark playful conversations. For example, your output should be structured like this: 'What’s the most ridiculous superpower you can think of?||If animals could talk, which one do you think would be the sassiest?||What’s the funniest thing you’ve accidentally said in a serious moment?'. Make sure each question is unique, engaging, and contributes to a positive, lighthearted atmosphere.";

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    
    const result = await model.generateContentStream(prompt);

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of result.stream) {
          controller.enqueue(encoder.encode(await chunk.text()));
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: { "Content-Type": "text/plain" },
    });
  } catch (error) {
    console.error("An unexpected error occurred:", error);
    return NextResponse.json(
      { success: false, message: "Failed to generate response" },
      { status: 500 }
    );
  }
}
