import { NextRequest, NextResponse } from 'next/server';

interface GroqMessage {
  role: 'user' | 'system';
  content: string;
}

interface EditLetterRequest {
  instruction: string;
  currentForm: Record<string, any>;
}

const GROQ_FALLBACK_MODELS = [
  'llama-3.3-70b-versatile',
  'llama-3.1-8b-instant',
];

async function callGroqModel(
  messages: GroqMessage[],
  model: string,
  maxTokens: number,
  apiKey: string
): Promise<{ content: string; model: string }> {
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages,
      max_tokens: maxTokens,
      temperature: 0.3, // Lower temperature for more precise edits
      top_p: 0.95,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error('No content in Groq API response');
  return { content, model };
}

async function callGroqWithFallback(
  messages: GroqMessage[],
  maxTokens: number = 3000
): Promise<{ content: string; model: string }> {
  const apiKey = process.env.GROQ_API_KEY!;
  let lastError: Error | null = null;

  for (const model of GROQ_FALLBACK_MODELS) {
    try {
      return await callGroqModel(messages, model, maxTokens, apiKey);
    } catch (err: any) {
      lastError = err;
      if (err.message.includes('429')) {
        continue;
      }
      throw err;
    }
  }
  throw lastError ?? new Error('All Groq models exhausted or unavailable');
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as EditLetterRequest;
  const { instruction, currentForm } = body;

  if (!instruction) {
    return NextResponse.json({ error: 'Instruction is required' }, { status: 400 });
  }

  if (!process.env.GROQ_API_KEY) {
    console.warn('[letterpad] GROQ_API_KEY is not set. Applying rule-based edit.');
    const changes: Record<string, any> = {};
    const lower = instruction.toLowerCase();
    if (lower.includes('memorandum') || lower.includes('om')) {
      changes.sal = '';
      changes.cls = '';
      changes.body = `The undersigned is directed to state that in reference to the subject cited above, the competent authority has accorded approval.\n\n2. All concerned field formations are hereby advised to ensure strict compliance.\n\n3. This issues with the approval of the Competent Authority.`;
    } else if (lower.includes('demi-official') || lower.includes('d.o.')) {
      changes.sal = 'Dear Shri Sharma,';
      changes.cls = 'Yours sincerely,\nWith warm regards,';
    } else if (lower.includes('show cause') || lower.includes('scn')) {
      changes.body = `WHEREAS the matter has been brought to the notice of the undersigned;\n\nAND WHEREAS the aforementioned act constitutes a prima facie violation of the established rules;\n\nNOW THEREFORE, you are hereby called upon to show cause within 15 days as to why appropriate action should not be initiated against you.`;
    } else if (lower.includes('student') || lower.includes('principal')) {
      changes.h1 = ''; changes.h2 = ''; changes.e1 = ''; changes.e2 = ''; changes.dept = ''; changes.divn = ''; changes.ofc = '';
      changes.sal = 'Respected Principal / Sir,';
      changes.cls = 'Yours obediently,';
    } else if (lower.includes('personal') || lower.includes('romantic')) {
      changes.h1 = ''; changes.h2 = ''; changes.e1 = ''; changes.e2 = ''; changes.dept = ''; changes.divn = ''; changes.ofc = ''; changes.fno = '';
    }
    return NextResponse.json({
      success: true,
      data: changes,
      model: 'CSMOP Protocol Editor (Add GROQ_API_KEY in Vercel to activate Groq AI)',
    });
  }

  try {

    const systemPrompt = `You are an expert Government of India and State Government correspondence editor with deep mastery of the Central Secretariat Manual of Office Procedure (CSMOP 16th Edition), official administrative vocabulary, and legal protocols.

The user will provide their exact current letter data in JSON format, and an instruction on what they want to change.

Your task is to follow their instruction and return a JSON object containing ONLY the keys that need to be changed, with their new updated values. 
Do not return keys that should remain exactly the same.

CORRESPONDENCE & PROTOCOL INTELLIGENCE:
1. If asked for Office Memorandum (OM) style:
   - Body must be strictly written in the third person ("The undersigned is directed to convey...").
   - Set 'sal': "" (no salutation like Sir/Madam).
   - Set 'cls': "" (no subscription like Yours faithfully).
2. If asked for Demi-Official (D.O.) style:
   - Salutation 'sal': "Dear Shri [Surname]" or "Dear Dr. [Surname]".
   - Subscription 'cls': "Yours sincerely" or "With warm regards".
   - Warm, personal yet dignified tone without rigid numbered clauses.
3. If asked for Show Cause Notice (SCN):
   - Restructure body into legal "WHEREAS... AND WHEREAS... NOW THEREFORE the undersigned hereby calls upon you to show cause within [X] days...".
4. If asked for Reminder:
   - Add explicit citation to previous communication: "I am directed to invite your attention to this office letter of even number dated [Date]... A reply in this regard is still awaited."
5. If asked for Academic Student Application:
   - Set 'sal': "Respected Principal / Sir".
   - Set 'cls': "Yours obediently".
   - Remove any government headers (h1, h2, e1, e2, dept, divn, ofc).
6. If asked for Personal / Romantic / Traditional:
   - Remove any government headers and file numbers.
   - Adjust salutation and closing to natural, affectionate, or traditional Indian phrasing.
7. Tone Polishing & Official Vocabulary:
   - "Sanction of the Competent Authority is hereby accorded..."
   - "This issues with the approval of..."
   - "Necessary action may be taken accordingly."

CRITICAL: Respond with ONLY a valid JSON object. No markdown, no code fences, no explanations.`;

    const userPrompt = `CURRENT LETTER DATA (JSON):
${JSON.stringify(currentForm, null, 2)}

USER INSTRUCTION:
"${instruction}"

Return ONLY the JSON object with the modified fields based on the instruction.`;

    const result = await callGroqWithFallback([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ]);

    let cleanedResponse = result.content.trim();
    cleanedResponse = cleanedResponse
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/```\s*$/, '');
      
    const jsonStart = cleanedResponse.indexOf('{');
    const jsonEnd = cleanedResponse.lastIndexOf('}');
    if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
      cleanedResponse = cleanedResponse.slice(jsonStart, jsonEnd + 1);
    }

    const modifiedFields = JSON.parse(cleanedResponse.trim());

    return NextResponse.json({
      success: true,
      data: modifiedFields,
    });

  } catch (error: any) {
    console.error('Edit letter error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to edit letter' },
      { status: 500 }
    );
  }
}
