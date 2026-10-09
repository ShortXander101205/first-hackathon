// Strict server-only isolation
if (typeof window !== 'undefined') {
  throw new Error('This module can only be executed in a Node.js server runtime.');
}
try {
  require('server-only');
} catch (e: any) {
  // Ignored in non-react-server test runners when window is undefined
  if (typeof window !== 'undefined') {
    throw e;
  }
}
import { GoogleGenAI } from '@google/genai';
import { ALEX_SYSTEM_PROMPT, buildTriageUserPrompt, PATHLESS_SYSTEM_PROMPT, buildGuideUserPrompt } from './ai/prompts';
import { triageResultSchema, TriageResultInput } from '@/schemas/triage.schema';
import { guideResultSchema } from '@/schemas/career.schema';
import { IntakeAnswersState } from '@/types/intake';
import { SubmissionPayload } from '@/types/api';
import { GuideResult } from '@/types/career';
import { getCatalogEntryByTitle, isWhitelistedMajor } from '@/data/careerCatalog';
import responseSchema from '@/ai/response-schema.json';

export interface GeminiSynthesisResult {
  result: TriageResultInput;
  latencyMs: number;
  fallbackUsed: boolean;
  engine: string;
}

export interface GuideSynthesisResult {
  result: GuideResult;
  latencyMs: number;
  fallbackUsed: boolean;
  engine: string;
}

// Module-level mock client hook for isolated route tests
let mockGenAiClient: any = null;

export function setMockGenAiClient(mockClient: any): void {
  mockGenAiClient = mockClient;
}

export function getMockGenAiClient(): any {
  return mockGenAiClient;
}

/**
 * Returns a configured GoogleGenAI instance.
 * Strictly server-isolated.
 */
export function getGeminiClient(): GoogleGenAI {
  if (mockGenAiClient) {
    return mockGenAiClient;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '') {
    throw new Error('GEMINI_API_KEY is not configured on the server');
  }

  return new GoogleGenAI({ apiKey });
}

/**
 * Sanitizes error messages by masking API keys and sensitive tokens.
 */
export function sanitizeError(error: any): string {
  if (!error) return 'Unknown error';
  const msg = typeof error === 'string' ? error : error.message || JSON.stringify(error);
  const apiKey = process.env.GEMINI_API_KEY;

  let sanitized = msg
    .replace(/key=[A-Za-z0-9_-]+/gi, 'key=[REDACTED]')
    .replace(/x-goog-api-key:\s*[A-Za-z0-9_-]+/gi, 'x-goog-api-key: [REDACTED]');

  if (apiKey && apiKey.length > 5) {
    sanitized = sanitized.split(apiKey).join('[REDACTED_API_KEY]');
  }

  return sanitized;
}

/**
 * Executes the AI synthesis call using Gemini 2.5 Flash with timeout protection.
 */
export async function generateTriageRecommendations(
  answers: IntakeAnswersState,
  studentNickname?: string
): Promise<GeminiSynthesisResult> {
  const startTime = Date.now();
  const timeoutMs = parseInt(process.env.GEMINI_TIMEOUT_MS || '15000', 10);
  const client = getGeminiClient();

  const controller = new AbortController();
  const timeoutHandle = setTimeout(() => {
    controller.abort();
  }, timeoutMs);

  try {
    const userPrompt = buildTriageUserPrompt(answers, studentNickname);

    const modelName = process.env.GEMINI_MODEL || 'gemini-3.1-flash-lite';
    // Call generateContent with timeout race
    const callPromise = client.models.generateContent({
      model: modelName,
      contents: userPrompt,
      config: {
        systemInstruction: ALEX_SYSTEM_PROMPT,
        temperature: 0.2,
        topP: 0.8,
        maxOutputTokens: 8192,
        responseMimeType: 'application/json',
        responseSchema: responseSchema as any,
      },
    });

    const timeoutPromise = new Promise((_, reject) => {
      controller.signal.addEventListener('abort', () => {
        const timeoutErr = new Error(`Gemini synthesis timed out after ${timeoutMs}ms`);
        timeoutErr.name = 'TimeoutError';
        reject(timeoutErr);
      });
    });

    // Prevent unhandled promise rejections if callPromise rejects after timeout
    callPromise.catch(() => {});

    const response: any = await Promise.race([callPromise, timeoutPromise]);
    clearTimeout(timeoutHandle);

    const latencyMs = Date.now() - startTime;
    const rawText = (response.text || '').trim();

    // Defensive strip of accidental markdown code fences
    const cleanJson = rawText
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();

    if (!cleanJson) {
      throw new Error('Gemini returned an empty response payload');
    }

    const parsedJson = JSON.parse(cleanJson);

    // Normalize careers to ensure cross-compatibility between daily_tasks and day_in_the_life
    if (Array.isArray(parsedJson.careers)) {
      for (const career of parsedJson.careers) {
        if (!career.day_in_the_life && Array.isArray(career.daily_tasks)) {
          career.day_in_the_life = {
            tasks: career.daily_tasks,
            misconceptions: [
              'Myth: Isolated repetitive work. Reality: Collaborative systems design with modern tooling.',
            ],
          };
        }
        if (!career.daily_tasks && Array.isArray(career.day_in_the_life?.tasks)) {
          career.daily_tasks = career.day_in_the_life.tasks;
        }
        if (!Array.isArray(career.minors)) {
          career.minors = [];
        }
      }
    }

    // Strict downstream Zod verification (enforcing exactly 4 tiers & trial courses)
    const validatedResult = triageResultSchema.parse(parsedJson);

    return {
      result: validatedResult,
      latencyMs,
      fallbackUsed: false,
      engine: 'gemini-2.5-flash',
    };
  } catch (err: any) {
    clearTimeout(timeoutHandle);
    const sanitized = sanitizeError(err);
    console.error('[GeminiService] Upstream synthesis error:', sanitized);
    throw err;
  }
}

/**
 * Executes the PathLess Guide v2 AI synthesis call using Gemini 2.5 Flash with timeout protection.
 * Returns GuideSynthesisResult with GuideResult conforming to 4-tier taxonomy and word limits.
 */
export async function generateGuideRecommendations(
  payload: SubmissionPayload
): Promise<GuideSynthesisResult> {
  const startTime = Date.now();
  const timeoutMs = parseInt(process.env.GEMINI_TIMEOUT_MS || '15000', 10);
  const client = getGeminiClient();

  const controller = new AbortController();
  const timeoutHandle = setTimeout(() => {
    controller.abort();
  }, timeoutMs);

  try {
    const userPrompt = buildGuideUserPrompt(payload);
    const modelName = process.env.GEMINI_MODEL || 'gemini-3.1-flash-lite';
    const callPromise = client.models.generateContent({
      model: modelName,
      contents: userPrompt,
      config: {
        systemInstruction: PATHLESS_SYSTEM_PROMPT,
        temperature: 0.2,
        topP: 0.8,
        maxOutputTokens: 8192,
        responseMimeType: 'application/json',
        responseSchema: responseSchema as any,
      },
    });

    const timeoutPromise = new Promise((_, reject) => {
      controller.signal.addEventListener('abort', () => {
        const timeoutErr = new Error(`Gemini synthesis timed out after ${timeoutMs}ms`);
        timeoutErr.name = 'TimeoutError';
        reject(timeoutErr);
      });
    });

    callPromise.catch(() => {});

    const response: any = await Promise.race([callPromise, timeoutPromise]);
    clearTimeout(timeoutHandle);

    const latencyMs = Date.now() - startTime;
    const rawText = (response.text || '').trim();

    const cleanJson = rawText
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();

    if (!cleanJson) {
      throw new Error('Gemini returned an empty response payload');
    }

    const parsedJson = JSON.parse(cleanJson);

    // Support both pathways and careers
    if (!parsedJson.pathways && parsedJson.careers) {
      parsedJson.pathways = parsedJson.careers;
    }
    if (!parsedJson.careers && parsedJson.pathways) {
      parsedJson.careers = parsedJson.pathways;
    }

    const cards = parsedJson.pathways || parsedJson.careers;
    if (Array.isArray(cards)) {
      for (const card of cards) {
        const title = card.roleTitle || card.role_title;
        const entry = getCatalogEntryByTitle(title);
        if (entry) {
          card.roleTitle = entry.roleTitle;
          card.broadField = entry.field;
          if (
            !card.majors ||
            !Array.isArray(card.majors) ||
            card.majors.length === 0 ||
            !card.majors.every((m: string) => isWhitelistedMajor(m))
          ) {
            card.majors = entry.standardMajors;
          }
        }
      }
    }

    // Downstream Zod verification against guideResultSchema
    const validatedResult = guideResultSchema.parse(parsedJson);

    const guideResult: GuideResult = {
      success: true,
      submissionId: `sub_${Date.now()}`,
      studentProfile: payload.studentProfile,
      summary: validatedResult.summary,
      pathways: validatedResult.pathways as any,
      careers: validatedResult.careers as any,
      meta: {
        engine: modelName,
        generationLatencyMs: latencyMs,
        fallbackUsed: false,
      },
    };

    return {
      result: guideResult,
      latencyMs,
      fallbackUsed: false,
      engine: modelName,
    };
  } catch (err: any) {
    clearTimeout(timeoutHandle);
    const sanitized = sanitizeError(err);
    console.error('[GeminiService] Upstream synthesis error:', sanitized);
    throw err;
  }
}

