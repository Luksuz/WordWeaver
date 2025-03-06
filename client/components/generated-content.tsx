"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, RefreshCw } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface SectionOutline {
  id: string
  outline_id: string
  description: string
  instructions: string
  position: number  
  title: string
  content: string
}

interface GeneratedContentProps {
  content: { [key: string]: string }
  sectionOutlines: SectionOutline[]
}

export function GeneratedContent({ content, sectionOutlines }: GeneratedContentProps) {
  const [activeSection, setActiveSection] = useState<string | null>(
    Object.keys(content).length > 0 ? Object.keys(content)[0] : null,
  )
  const [editedContent, setEditedContent] = useState<{ [key: string]: string }>(content)
  const [isRegenerating, setIsRegenerating] = useState<{ [key: string]: boolean }>({})

  const handleRegenerateSection = async (sectionId: string) => {
    setIsRegenerating({ ...isRegenerating, [sectionId]: true })

    // In a real app, this would call the API to regenerate the section
    // For demo purposes, we'll simulate a delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Mock regenerated content
    const regeneratedContent = `${editedContent[sectionId].substring(0, 100)}... 
    
[This is newly regenerated content for section ${sectionId}]

The elephants moved silently through the forest, their massive forms somehow blending into the shadows despite their size. Government satellites tracked their movements, recording patterns that seemed too deliberate to be random. Like the experiments in Hawkins Lab, these gentle giants appeared to be unwitting participants in something far beyond their comprehension.

Local researchers reported unusual equipment installed near watering holes—devices that emitted frequencies inaudible to human ears but precisely calibrated to elephant communication ranges. When questioned, officials claimed they were simple conservation monitoring tools. But the elephants' behavior changed whenever these devices activated, their movements becoming more regimented, almost military in precision.

What secrets do these magnificent creatures hold? And more importantly, who is trying to unlock them, and what doors might they open?`

    setEditedContent({
      ...editedContent,
      [sectionId]: regeneratedContent,
    })

    setIsRegenerating({ ...isRegenerating, [sectionId]: false })
  }

  const handleContentChange = (sectionId: string, newContent: string) => {
    setEditedContent({
      ...editedContent,
      [sectionId]: newContent,
    })
  }

  if (Object.keys(content).length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Generated Content</CardTitle>
          <CardDescription>Your generated content will appear here</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">Generate a script first to see content here</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Generated Content</CardTitle>
        <CardDescription>Review and edit your generated content</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeSection || ""} onValueChange={setActiveSection as (value: string) => void}>
          <TabsList className="mb-4 flex flex-wrap">
            {sectionOutlines.map((section) => (
              <TabsTrigger key={section.id} value={section.id}>
                {section.title}
              </TabsTrigger>
            ))}
          </TabsList>

          <AnimatePresence mode="wait">
            {sectionOutlines.map((section) => (
              <TabsContent key={section.id} value={section.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">{section.title}</h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRegenerateSection(section.id)}
                      disabled={isRegenerating[section.id]}
                    >
                      {isRegenerating[section.id] ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <RefreshCw className="mr-2 h-4 w-4" />
                      )}
                      Regenerate Section
                    </Button>
                  </div>

                  <Textarea
                    value={editedContent[section.id] || ""}
                    onChange={(e) => handleContentChange(section.id, e.target.value)}
                    className="min-h-[400px] font-mono text-sm transition-all duration-300 ease-in-out"
                  />

                  <div className="text-xs text-muted-foreground">
                    <p>Instructions: {section.instructions}</p>
                  </div>
                </motion.div>
              </TabsContent>
            ))}
          </AnimatePresence>
        </Tabs>
      </CardContent>
    </Card>
  )
}

