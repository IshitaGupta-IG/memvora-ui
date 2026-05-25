export type Memory = {
  id: string;
  title: string;
  source_type: string;
  original_content: string;
  created_at: string;
};

export type SearchResult = {
  chunk_id: string;
  memory_id: string;
  title: string;
  content: string;
  similarity: number;
  created_at: string;
};

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  sources?: SearchResult[];
};

