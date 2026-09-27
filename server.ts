import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Schema for Phrase Entry
const phraseEntrySchema = {
  type: Type.OBJECT,
  properties: {
    id: { type: Type.STRING, description: 'kebab-case identifier' },
    common_phrase: { type: Type.STRING, description: 'Commonly known or truncated phrase' },
    authentic_phrase: { type: Type.STRING, description: 'Complete, historically authentic phrasing' },
    shortened_fragment: { type: Type.STRING, description: 'Fragment or popular colloquial snippet' },
    category: { type: Type.STRING, description: 'Accurate thematic category' },
    original_intent: { type: Type.STRING, description: 'The original intended historical meaning' },
    modern_misconception: { type: Type.STRING, description: 'How contemporary usage alters or reverses the intended meaning' },
    meaning_shift_type: { 
      type: Type.STRING, 
      enum: ['Reversed', 'Weakened', 'Truncated', 'Misattributed', 'Shifted', 'Refined'],
      description: 'Classification of how the meaning has shifted' 
    },
    historical_origin: { type: Type.STRING, description: 'Origin century, time period, and geographic/cultural root' },
    source_citation: { type: Type.STRING, description: 'Original text, author, speech, or historical work' },
    etymology_deep_dive: { type: Type.STRING, description: 'Detailed etymological and historical narrative' },
    authentic_usage_example: { type: Type.STRING, description: 'Example sentence using the authentic restored phrase properly' },
    modern_flawed_example: { type: Type.STRING, description: 'Example sentence depicting common modern flawed usage' },
    tags: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: 'Search tags and keywords'
    },
    key_takeaway: { type: Type.STRING, description: 'Punchy 1-sentence revelation of the restoration' }
  },
  required: [
    'id',
    'common_phrase',
    'authentic_phrase',
    'category',
    'original_intent',
    'modern_misconception',
    'meaning_shift_type',
    'historical_origin',
    'source_citation',
    'etymology_deep_dive',
    'authentic_usage_example',
    'modern_flawed_example',
    'tags',
    'key_takeaway'
  ]
};

// Search / Resolve phrase endpoint
app.post('/api/phrases/search', async (req, res) => {
  try {
    const { query, category } = req.body;
    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      return res.status(400).json({ error: 'Query parameter is required.' });
    }

    const prompt = `You are the core intelligence engine for "Know Your Phrases".
Resolve the user's query ("${query}"${category && category !== 'All Phrases' ? ` within the category "${category}"` : ''}) to the closest authentic idiom, proverb, or figure of speech.
Restore its complete, historically authentic phrasing, clarify the original intent versus modern misconceptions, and provide etymology and examples.

Strict Directives:
- If the query is a fragment, misspelled word, or keyword (e.g. "blood thicker", "jack trades", "curiosity", "rome", "second mouse"), resolve it to the authentic idiom.
- Always output raw valid JSON matching the schema.
- No markdown formatting, code fences, or surrounding notes.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            resolved_phrase: phraseEntrySchema,
            related_variants: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Alternative historical phrasings or related idioms'
            }
          },
          required: ['resolved_phrase']
        }
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error in /api/phrases/search:', error);
    return res.status(500).json({ error: error.message || 'Failed to resolve phrase.' });
  }
});

// Validate user sentence endpoint
app.post('/api/phrases/validate', async (req, res) => {
  try {
    const { phrase, userSentence } = req.body;
    if (!userSentence || typeof userSentence !== 'string') {
      return res.status(400).json({ error: 'userSentence is required.' });
    }

    const prompt = `You are the sentence validator for "Know Your Phrases".
The user has provided a sentence attempting to use the idiom or concept: "${phrase || 'idiomatic expression'}".
User's sentence: "${userSentence}".

Your Mission:
1. Determine whether the sentence applies the idiom in its true original/authentic historical intent, or if it falls prey to modern truncation/misinterpretation.
2. Set "usage_validity" strictly to either "Correct" or "Incorrect".
3. Provide a clear, sharp, informative "usage_critique" explaining why the usage is valid or flawed based on the authentic origin.
4. Provide an "improved_sentence" that demonstrates proper authentic usage.
5. Provide a brief "historical_context_note".

Strict Directives:
- "usage_validity" MUST BE strictly "Correct" or "Incorrect".
- Output raw valid JSON strictly adhering to the schema.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            phrase: { type: Type.STRING },
            user_sentence: { type: Type.STRING },
            usage_validity: { 
              type: Type.STRING, 
              enum: ['Correct', 'Incorrect']
            },
            usage_critique: { type: Type.STRING, description: 'Critique and analysis of the sentence usage' },
            original_phrase_detected: { type: Type.STRING, description: 'The complete restored authentic phrase' },
            intended_meaning_applied: { type: Type.BOOLEAN, description: 'Whether the true historical intent was captured' },
            improved_sentence: { type: Type.STRING, description: 'A polished sentence demonstrating the authentic restoration' },
            historical_context_note: { type: Type.STRING, description: 'Brief historical note on the origin' }
          },
          required: [
            'phrase',
            'user_sentence',
            'usage_validity',
            'usage_critique',
            'original_phrase_detected',
            'intended_meaning_applied',
            'improved_sentence',
            'historical_context_note'
          ]
        }
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error in /api/phrases/validate:', error);
    return res.status(500).json({ error: error.message || 'Failed to validate sentence.' });
  }
});

// Explore category endpoint
app.post('/api/phrases/category', async (req, res) => {
  try {
    const { category } = req.body;
    const prompt = `Provide 3 authentic restored idioms strictly belonging to the category: "${category}".
Ensure complete authentic restored phrasing, original intent vs modern misconception, and historical origin.
Output raw JSON matching the schema.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            category: { type: Type.STRING },
            phrases: {
              type: Type.ARRAY,
              items: phraseEntrySchema
            }
          },
          required: ['category', 'phrases']
        }
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error in /api/phrases/category:', error);
    return res.status(500).json({ error: error.message || 'Failed to load category phrases.' });
  }
});

// Dev vs Prod Vite mounting
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Know Your Phrases server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
