// Everything personal lives here — edit this file to make the site yours.
export const content = {
  name: 'Akash Kumar',
  handle: 'machthreetwo',
  role: 'Applied ML · Agentic AI · RAG',
  tagline: 'Applied ML and agentic AI — getting LLMs out of the chat window and into real systems.',
  status: 'Open to AI startup internships',

  // Typed out on the keyboard during the top-down shot.
  typing: "Hello, I'm Akash",

  // Shown beside the exploded view, top layer first.
  layers: [
    { title: 'Keycaps', text: 'Interfaces — React, Next.js and Flutter front ends people actually use.' },
    { title: 'Switches', text: 'Agents — LangGraph orchestration, RAG pipelines and LLM tooling.' },
    { title: 'Plate', text: 'Backends — FastAPI, Kafka, Redis and Docker holding it all together.' },
    { title: 'Case', text: 'Foundations — PyTorch, data pipelines and honest evaluation.' },
  ],

  // Each word is spelled out by the flying keycaps. Keep them short (≤ 9 chars).
  skills: [
    { word: 'PYTORCH', note: 'CNN + Transformer models, trained from scratch' },
    { word: 'LANGCHAIN', note: 'RAG pipelines with hybrid search and reranking' },
    { word: 'FAISS', note: 'Vector search over legal and market corpora' },
    { word: 'FASTAPI', note: 'Async Python backends behind every project' },
    { word: 'KAFKA', note: 'Streaming ingestion for real-time systems' },
  ],

  projects: [
    {
      title: 'InsideX',
      kind: 'Fintech · RAG',
      description:
        'Stock research copilot. Perplexity pulls live market news, Claude condenses it into a five-point brief, and a RAG chat answers follow-ups with sources.',
      tags: ['FastAPI', 'Pathway', 'Chroma', 'React'],
      link: 'https://github.com/machthreetwo/INSIDEX-FULL',
      badge: 'Top 10 · IIT Ropar × Pathway',
    },
    {
      title: 'Legal RAG',
      kind: 'Legal-tech · Retrieval',
      description:
        'Retrieval over Indian Supreme Court judgments — FAISS + BM25 hybrid search, cross-encoder reranking and Llama 3.1 on Groq, with ablation studies.',
      tags: ['FAISS', 'BM25', 'Groq', 'Llama 3.1'],
      link: 'https://github.com/machthreetwo/Nyaay',
    },
    {
      title: 'OmniResol',
      kind: 'Gov-tech · Agents',
      description:
        'Seven ML agents triage complaints for public sector banks — emotion, severity, root cause and escalation — over a Kafka-fed pipeline.',
      tags: ['LangGraph', 'Kafka', 'Redis', 'PostgreSQL'],
      link: 'https://github.com/machthreetwo/UCCD',
      badge: 'DFS / AI-CSPARC Hackathon 2026',
    },
    {
      title: 'Claim Defender',
      kind: 'Insurtech · Document AI',
      description:
        'Photograph your health-insurance documents and it predicts the chance of rejection — IRDAI rules checked directly, insurer terms retrieved with RAG.',
      tags: ['FastAPI', 'OCR', 'RAG'],
      link: 'https://github.com/machthreetwo/Claim_defender_backend',
    },
    {
      title: 'Helios',
      kind: 'Heliophysics · ML',
      description:
        'Solar flare prediction from SDO/HMI SHARP parameters — 187k labelled hourly records across 1,197 active regions, split leak-free by region.',
      tags: ['Python', 'JSOC', 'pytest'],
      link: 'https://github.com/machthreetwo/helios',
    },
    {
      title: 'Astranet',
      kind: 'Space · Mobile',
      description:
        'Flutter app for spotting celestial objects — camera capture with an AI mode, detection history and a mission-control dashboard.',
      tags: ['Flutter', 'FastAPI', 'fl_chart'],
      link: 'https://github.com/machthreetwo/Astranet_app',
    },
  ],

  awards: [
    { place: '2nd', title: 'Gen AI Hackathon', where: 'Team AetherFlux' },
    { place: 'Top 10', title: 'GenAI Hackathon', where: 'IIT Ropar × Pathway · Team AlienX' },
    { place: '2026', title: 'NASA Space Apps', where: 'Participant' },
  ],

  contact: {
    // TODO: add the address you want public, e.g. 'you@example.com'.
    email: '',
    links: [
      { label: 'GitHub', href: 'https://github.com/machthreetwo' },
      // TODO: add your LinkedIn URL.
    ],
  },
}
