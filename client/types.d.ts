type ResearchSource = "google" | "brave" | "reddit" | "youtube"

interface SectionOutline {
  id: string
  title: string
  format: string
}

interface ResearchResult {
  source: ResearchSource
  content: string
  summary?: string
}

