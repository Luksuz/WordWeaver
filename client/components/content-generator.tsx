"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import { motion } from "framer-motion"

interface SectionOutline {
  id: string
  outline_id: string
  description: string
  instructions: string
  position: number  
  title: string
  content: string
}

interface ContentGeneratorProps {
  additionalContext: string
  sectionOutlines: SectionOutline[]
  onGenerateOutlines: (outlines: SectionOutline[]) => void
  onGenerateContent: () => void
  isLoading: boolean
}

export function ContentGenerator({
  additionalContext,
  sectionOutlines,
  onGenerateOutlines,
  onGenerateContent,
  isLoading
}: ContentGeneratorProps) {
  const [theme, setTheme] = useState("")
  const [context, setContext] = useState(additionalContext)
  const [forbiddenWords, setForbiddenWords] = useState("")
  const [wordCount, setWordCount] = useState("2000")
  const [isGeneratingOutlines, setIsGeneratingOutlines] = useState(false)
  const [isGeneratingScript, setIsGeneratingScript] = useState(false)
  const [aiModel, setAiModel] = useState("gpt-4o-mini")

  // Update context when additionalContext prop changes
  if (additionalContext !== context && additionalContext !== "") {
    setContext(additionalContext)
  }

  const handleGenerateOutlines = async () => {
    if (!theme.trim()) {
      return
    }
    
    setIsGeneratingOutlines(true)
    try {
      const response = await fetch('http://localhost:8000/outline/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          script_title: theme,
          word_count: parseInt(wordCount) || 2000,
          language: "English",
          audience: "General",
          style: "Informative",
          tone: "Neutral",
          model: aiModel,
          additional_data: context,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate outlines')
      }

      const data = await response.json()
      
      // Transform the API response to match our SectionOutline format
      const generatedOutlines: SectionOutline[] = data.sections.map((section: any, index: number) => ({
        id: section.id || String(index),
        outline_id: section.outline_id || data.outline_id,
        description: section.description || "",
        instructions: section.instructions || "",
        position: section.position || index,
        title: section.title,
        content: "",
      }))

      onGenerateOutlines(generatedOutlines)
    } catch (error) {
      console.error("Error generating outlines:", error)
      alert("Failed to generate outlines. Please try again.")
    } finally {
      setIsGeneratingOutlines(false)
    }
  }

  const handleGenerateScript = async () => {
    if (sectionOutlines.length === 0) {
      alert("Please generate section outlines first")
      return
    }

    setIsGeneratingScript(true)
    try {
      const response = await fetch('http://localhost:8000/outline/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          outline: {
            sections: sectionOutlines.map((section) => ({
              id: section.id,
              outline_id: section.outline_id,
              position: section.position,
              title: section.title,
              description: section.description,
              instructions: section.instructions,
            }))
          },
          script_title: theme,
          context: context,
          n_person_view: "third",
          excluded_words: forbiddenWords,
          model: aiModel,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate script')
      }

      await response.json()
      onGenerateContent()
    } catch (error) {
      console.error("Error generating script:", error)
      alert("Failed to generate script. Please try again.")
    } finally {
      setIsGeneratingScript(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Content Generator</CardTitle>
        <CardDescription>Configure your content parameters and generate your script</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <label className="text-sm font-medium">Theme/Topic:</label>
          <Input
            placeholder="Enter the main theme of your content"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <label className="text-sm font-medium">Additional Context:</label>
          <Textarea
            placeholder="Paste research summaries or add additional context here"
            value={context}
            onChange={(e) => setContext(e.target.value)}
            className="min-h-[150px]"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <label className="text-sm font-medium">Forbidden Words (optional):</label>
          <Input
            placeholder="Enter words to exclude from generation, separated by commas"
            value={forbiddenWords}
            onChange={(e) => setForbiddenWords(e.target.value)}
          />
          <p className="text-xs text-muted-foreground mt-1">
            Words listed here will be avoided in the generated content. Separate multiple words with commas.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <label className="text-sm font-medium">AI Model:</label>
          <Select value={aiModel} onValueChange={setAiModel}>
            <SelectTrigger>
              <SelectValue placeholder="Select AI model" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gpt-4o-mini">GPT-4o Mini (Fast & Economical)</SelectItem>
              <SelectItem value="gpt-4o">GPT-4o (Balanced)</SelectItem>
              <SelectItem value="claude-3-opus">Claude 3 Opus (High Quality)</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <label className="text-sm font-medium">Desired Word Count:</label>
          <Input
            type="number"
            placeholder="Total word count for the generated content"
            value={wordCount}
            onChange={(e) => setWordCount(e.target.value)}
          />
        </motion.div>

        <motion.div
          className="flex flex-col sm:flex-row gap-2 pt-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <Button onClick={handleGenerateOutlines} disabled={isGeneratingOutlines || !theme.trim()} className="flex-1">
            {isGeneratingOutlines ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Generate Outline Sections
          </Button>

          <Button
            onClick={handleGenerateScript}
            disabled={isGeneratingScript || sectionOutlines.length === 0}
            className="flex-1"
            variant="secondary"
          >
            {isGeneratingScript ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Generate Script
          </Button>
        </motion.div>

        <Button 
          onClick={onGenerateContent} 
          disabled={sectionOutlines.length === 0 || isLoading}
          className="w-full mt-4"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            "Generate Content"
          )}
        </Button>
      </CardContent>
    </Card>
  )
}

