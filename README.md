## What I Built
A RAG (Retrieval-Augmented Generation) pipeline that ingests patient 
records, embeds them into vectors, stores them in Supabase pgvector, 
and retrieves relevant context before passing it to an LLM to answer 
questions. This prevents the LLM from hallucinating — it only answers 
from actual patient records.

## How I Chunked the Data
Each patient record is split into 4 chunks by section: Symptoms, 
Consultation History, Lifestyle Notes, and Treatment Plan. Every chunk 
carries the patient name, ID and age so retrieved chunks always know 
who they belong to.

## Embedding Model
I used `text-embedding-3-small` via OpenRouter because it supports multilingual text, since my patient data contain malay term  

## Similarity Search
Each chunk and query are converted into vectors using the same embedding model. pgvector then finds the closest vectors to the query using cosine similarity, chunks that are close to the question score higher, even if they don't share the exact same words.

## Production Considerations
- Patient data is sensitive — would use a locally hosted LLM and 
  embedding model instead of third party APIs
- Implement caching on common query embeddings to reduce API costs
- Add proper authentication and rate limiting on the query endpoint
- Use row-level security in Supabase so each doctor only sees 
  their own patients

 ## How to Run

  Prerequisites: Docker, and a `.env` file with your OpenRouter key and Supabase connection string.

  1. Start the services:
     docker compose up -d

  2. Ingest the patient records (run once, or whenever data changes):
     docker compose run --rm ingest

  3. Open `http://localhost` in your browser to ask questions.

