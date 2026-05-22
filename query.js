import 'dotenv/config';
import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);
const client = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: process.env.OPENROUTER_API_KEY,
});

async function embedQuery(question) {
    const response = await client.embeddings.create({
        model: 'openai/text-embedding-3-small',
        input: question,
    });
    return response.data[0].embedding;
}

async function searchChunks(queryVector) {
    const { data, error } = await supabase.rpc('match_patient_chunks', {
        query_embedding: queryVector,
        match_count: 5,
    });

    if (error) throw error;
    return data;
}
async function ask(question, chunks) {
    const context = chunks.map(c => c.content).join('\n\n');

    const response = await client.chat.completions.create({
        model: 'openai/gpt-oss-120b:free',
        messages: [
            {
                role: 'system',
                content: `You are a clinical assistant. Answer questions based only on the patient records provided. Do not use outside knowledge.`,
            },
            {
                role: 'user',
                content: `Patient records:\n\n${context}\n\nQuestion: ${question}`,
            },
        ],
    });

    return response.choices[0].message.content;
}

async function main() {
    const question = process.argv[2];

    if (!question) {
        console.error('Error: Please provide a question.');
        console.error('Usage: node query.js "Your question here"');
        process.exit(1);
    }
    const queryVector = await embedQuery(question);
    const results = await searchChunks(queryVector);
    const answer = await ask(question, results);
    console.log('\nAnswer:', answer);
}

export { searchChunks, ask, embedQuery };

// main();
