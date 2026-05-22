import 'dotenv/config';
import OpenAI from 'openai';
import patientsJson from './data/patients.json' with { type: 'json' };

import chunker from './chunker.js';

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const client = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
});

async function embedChunk(text) {
  const response = await client.embeddings.create({
    model: 'openai/text-embedding-3-small',
    input: text,
  });
  return response.data[0].embedding;
}

async function main() {
  const chunks = chunker(patientsJson);
 for (const chunk of chunks) {
    const embedding = await embedChunk(chunk);

    await supabase
      .from('patient_chunks')
      .insert({
        content: chunk,
        embedding,
      })
      .select('id')
      .then(({ data, error }) => {
        if (error) {
          console.error('Error inserting chunk:', error);
        } else {
          console.log('Inserted chunk id:', data[0].id);
        }
      });
  }

  console.log("done")
}

main();