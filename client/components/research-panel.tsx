"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Search } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

interface ResearchPanelProps {
  onApplySummary: (summary: string) => void
}

export function ResearchPanel({ onApplySummary }: ResearchPanelProps) {
  const [activeSource, setActiveSource] = useState<string>("browser")
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [redditUrl, setRedditUrl] = useState("")
  const [youtubeUrl, setYoutubeUrl] = useState("")
  const [analysisPrompt, setAnalysisPrompt] = useState("")
  const [researchResults, setResearchResults] = useState<string>("")
  const [summary, setSummary] = useState<string>("")

  const handleSearch = async () => {
    setIsLoading(true)
    // In a real app, this would make an API call to fetch search results
    // For demo purposes, we'll simulate a delay and return mock data
    await new Promise((resolve) => setTimeout(resolve, 1500))

    let mockResults = ""

    if (activeSource === "browser") {
      mockResults = `### Elephant Research Results

#### General Characteristics
- **Species**: Three living species of elephants recognized:
  - African Bush Elephant (largest land animal)
  - African Forest Elephant
  - Asian Elephant
- **Size**: Can reach heights of 13 feet and weigh up to 14,000 pounds
- **Lifespan**: 60-70 years in the wild

#### Unique Adaptations
- Highly dexterous trunk with up to 40,000 muscles
- Large ears that help regulate body temperature
- Modified incisor teeth (tusks) used for digging, lifting, gathering food, and defense
- Thick, wrinkled skin that retains moisture and regulates temperature

#### Social Structure
- Live in matriarchal family groups led by the oldest female
- Complex social networks with strong family bonds
- Sophisticated communication using infrasound, body language, and vocalizations
- Demonstrate empathy, grief, and self-awareness`
    } else if (activeSource === "reddit") {
      mockResults = `### Reddit Thread Analysis: r/Elephants

#### Top Comments:
1. "Elephants are one of the few animals that recognize themselves in mirrors, showing self-awareness similar to humans and great apes."
2. "Their trunks contain over 40,000 muscles and can be used for breathing, smelling, touching, grasping, and producing sound."
3. "Elephants mourn their dead and have been observed covering deceased elephants with branches and dirt, and returning to visit the remains years later."
4. "They communicate through infrasound frequencies below human hearing range, allowing them to coordinate movements over several miles."
5. "Elephant populations have declined by 62% over the last decade, primarily due to poaching and habitat loss."

#### Controversial Points:
- Debate about the effectiveness of conservation efforts
- Discussion about ethical concerns regarding elephants in captivity
- Arguments about the role of local communities in elephant conservation`
    } else if (activeSource === "youtube") {
      mockResults = `### YouTube Video: "The Secret Life of Elephants"

#### Key Points:
- Elephants have the largest brain of any land animal and demonstrate remarkable intelligence
- They can recognize over 200 different individuals by scent and sound
- Elephant herds are led by matriarchs who pass down generational knowledge about migration routes, water sources, and danger zones
- They use tools, solve problems, and show emotional intelligence
- Elephants play a crucial role as "ecosystem engineers," creating habitats for other species

#### Expert Insights:
Dr. Jane Goodall: "Elephants show many of the same emotional traits as humans - they experience joy, grief, and form deep bonds with family members."
Dr. Cynthia Moss: "After 40 years of research, we're still discovering new aspects of elephant communication and social structures."`
    }

    setResearchResults(mockResults)
    setIsLoading(false)
  }

  const handleSummarize = async () => {
    setIsLoading(true)
    // In a real app, this would call the OpenAI API to summarize the research
    // For demo purposes, we'll simulate a delay and return a mock summary
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const mockSummary = `### Summary of Research on Elephants

#### General Characteristics
- **Species**: Three living species of elephants recognized:
  - African Bush Elephant (largest land animal)
  - African Forest Elephant
  - Asian Elephant
- **Size**: Can reach heights of 13 feet and weigh up to 14,000 pounds
- **Lifespan**: 60-70 years in the wild

#### Intelligence & Social Behavior
- Self-aware (recognize themselves in mirrors)
- Complex social structures led by matriarchs
- Demonstrate empathy, grief, and emotional intelligence
- Communicate through infrasound over long distances
- Form deep family bonds and mourn their dead

#### Ecological Importance
- Act as "ecosystem engineers" creating habitats for other species
- Play crucial role in seed dispersal and vegetation management
- Help maintain biodiversity in their habitats

#### Conservation Status
- Populations declined by 62% over the last decade
- Main threats include poaching and habitat loss
- Ongoing debates about conservation approaches and captivity ethics`

    setSummary(mockSummary)
    setIsLoading(false)
  }

  const handleApplySummary = () => {
    onApplySummary(summary)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Research Assistant</CardTitle>
        <CardDescription>Gather information from various sources to enhance your content</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeSource} onValueChange={setActiveSource}>
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="browser">Browser Search</TabsTrigger>
            <TabsTrigger value="reddit">Reddit Research</TabsTrigger>
            <TabsTrigger value="youtube">YouTube Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="browser" className="space-y-4">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Research Source:</label>
                <Select defaultValue="google">
                  <SelectTrigger>
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="google">Google</SelectItem>
                    <SelectItem value="brave">Brave</SelectItem>
                    <SelectItem value="bing">Bing</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Analysis Prompt (optional):</label>
                <Textarea
                  placeholder="Enter your research topic or question"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>

              <Button onClick={handleSearch} disabled={isLoading || !searchQuery.trim()}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
                Search
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="reddit" className="space-y-4">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Reddit URL:</label>
                <Input
                  placeholder="Enter Reddit post URL"
                  value={redditUrl}
                  onChange={(e) => setRedditUrl(e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Analysis Prompt (optional):</label>
                <Textarea
                  placeholder="Enter instructions for analyzing the Reddit comments"
                  value={analysisPrompt}
                  onChange={(e) => setAnalysisPrompt(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>

              <Button onClick={handleSearch} disabled={isLoading || !redditUrl.trim()}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
                Extract Comments
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="youtube" className="space-y-4">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">YouTube URL:</label>
                <Input
                  placeholder="Enter YouTube video URL"
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Analysis Prompt (optional):</label>
                <Textarea
                  placeholder="Enter instructions for analyzing the video content"
                  value={analysisPrompt}
                  onChange={(e) => setAnalysisPrompt(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>

              <Button onClick={handleSearch} disabled={isLoading || !youtubeUrl.trim()}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
                Analyze Video
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        {researchResults && (
          <div className="mt-8 space-y-4">
            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-medium mb-2">Research Results</h3>
              <ScrollArea className="h-[300px]">
                <div className="prose dark:prose-invert max-w-none">
                  {researchResults.split("\n").map((line, index) => {
                    if (line.startsWith("###")) {
                      return <h3 key={index}>{line.replace("###", "")}</h3>
                    } else if (line.startsWith("####")) {
                      return <h4 key={index}>{line.replace("####", "")}</h4>
                    } else if (line.startsWith("-")) {
                      return (
                        <p key={index} className="ml-4">
                          {line}
                        </p>
                      )
                    } else {
                      return <p key={index}>{line}</p>
                    }
                  })}
                </div>
              </ScrollArea>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={handleSummarize} disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Summarize
              </Button>
            </div>

            {summary && (
              <div className="border rounded-lg p-4">
                <h3 className="text-lg font-medium mb-2">Summary</h3>
                <ScrollArea className="h-[200px]">
                  <div className="prose dark:prose-invert max-w-none">
                    {summary.split("\n").map((line, index) => {
                      if (line.startsWith("###")) {
                        return <h3 key={index}>{line.replace("###", "")}</h3>
                      } else if (line.startsWith("####")) {
                        return <h4 key={index}>{line.replace("####", "")}</h4>
                      } else if (line.startsWith("-")) {
                        return (
                          <p key={index} className="ml-4">
                            {line}
                          </p>
                        )
                      } else {
                        return <p key={index}>{line}</p>
                      }
                    })}
                  </div>
                </ScrollArea>
                <div className="mt-4 flex justify-end">
                  <Button onClick={handleApplySummary}>Apply Summary to Generator</Button>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

