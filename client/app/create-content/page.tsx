"use client"

import { useState } from "react"
import { ResearchPanel } from "@/components/research-panel"
import { ContentGenerator } from "@/components/content-generator"
import { SectionOutlines } from "@/components/section-outlines"
import { GeneratedContent } from "@/components/generated-content"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { SectionOutline } from "@/types/section-outline"
import { motion, AnimatePresence } from "framer-motion"

export default function Home() {
  const [additionalContext, setAdditionalContext] = useState("")
  const [sectionOutlines, setSectionOutlines] = useState<SectionOutline[]>([])
  const [generatedContent, setGeneratedContent] = useState<{ [key: string]: string }>({
    "0": "Initial content for section 0",
    "1": "Initial content for section 1",
    "2": "Initial content for section 2",
    "3": "Initial content for section 3",
  })
  const [activeTab, setActiveTab] = useState("generator")

  const handleApplySummary = (summary: string) => {
    setAdditionalContext(summary)
    setActiveTab("generator")
  }

  const handleGenerateOutlines = (outlines: SectionOutline[]) => {
    setSectionOutlines(outlines)
  }

  const handleUpdateOutlines = (updatedOutlines: SectionOutline[]) => {
    setSectionOutlines(updatedOutlines)
  }

  const handleGenerateContent = (content: { [key: string]: string }) => {
    setGeneratedContent(content)
    setActiveTab("content")
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <motion.h1
        className="text-3xl font-bold text-center my-6 text-gray-800 dark:text-gray-100"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        AI Content Generator
      </motion.h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="research">Research</TabsTrigger>
          <TabsTrigger value="generator">Generator</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
        </TabsList>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <TabsContent value="research" className="space-y-4">
              <ResearchPanel onApplySummary={handleApplySummary} />
            </TabsContent>

            <TabsContent value="generator" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <ContentGenerator
                    additionalContext={additionalContext}
                    onGenerateOutlines={handleGenerateOutlines}
                    onGenerateContent={() => handleGenerateContent(generatedContent)}
                    sectionOutlines={sectionOutlines as SectionOutline[]}
                    isLoading={false}
                  />
                </div>
                <div>
                  <ScrollArea className="h-[calc(100vh-200px)]">
                    <SectionOutlines outlines={sectionOutlines} onUpdateOutlines={handleUpdateOutlines} />
                  </ScrollArea>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="content">
              <GeneratedContent content={generatedContent} sectionOutlines={sectionOutlines as SectionOutline[]} />
            </TabsContent>
          </motion.div>
        </AnimatePresence>
      </Tabs>
    </div>
  )
}

