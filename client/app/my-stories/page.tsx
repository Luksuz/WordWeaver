"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { supabase } from "@/lib/supabase"

interface Story {
  id: string
  title: string
  theme: string
  wordCount: number
  aiModel: string
  outlines: { title: string; format: string }[]
  content: string
}

const mockStories: Story[] = [
  {
    id: "1",
    title: "The Elephant Conspiracy",
    theme: "Elephants and government secrets",
    wordCount: 2000,
    aiModel: "GPT-4o",
    outlines: [
      { title: "Unveiling the Giants", format: "Investigative narrative" },
      { title: "Ecosystem Architects Under Surveillance", format: "Probing tone" },
      { title: "The Secret Societies of Elephants", format: "Detailed investigation" },
      { title: "Shadowed Threats and Covert Conservation", format: "Investigative approach" },
    ],
    content: "As night enveloped the savannah, the air thickened with suspense...",
  },
  // Add more mock stories here
]

export default function MyStories() {
  const [selectedStory, setSelectedStory] = useState<Story | null>(null)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await supabase.auth.getUser()
        setUser(data.user)
      } catch (error) {
        console.error("Error fetching user:", error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchUser()
  }, [])

  if (loading) {
    return <div className="container mx-auto p-4 text-center">Loading...</div>
  }

  if (!user) {
    return (
      <div className="container mx-auto p-4 text-center">
        <h1 className="text-3xl font-bold mb-6">My Stories</h1>
        <p className="mb-4">Please log in to view your stories.</p>
        <Link href="/login">
          <Button>Login</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">My Stories</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockStories.map((story) => (
          <motion.div
            key={story.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setSelectedStory(story)}>
              <CardHeader>
                <CardTitle>{story.title}</CardTitle>
                <CardDescription>{story.theme}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Word count: {story.wordCount}</p>
                <p className="text-sm text-muted-foreground">AI Model: {story.aiModel}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedStory && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>{selectedStory.title}</CardTitle>
                  <CardDescription>{selectedStory.theme}</CardDescription>
                </div>
                <Button variant="ghost" onClick={() => setSelectedStory(null)}>
                  Close
                </Button>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[calc(90vh-8rem)]">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold">Parameters</h3>
                      <p>Word count: {selectedStory.wordCount}</p>
                      <p>AI Model: {selectedStory.aiModel}</p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">Outline Sections</h3>
                      <ul className="list-disc list-inside">
                        {selectedStory.outlines.map((outline, index) => (
                          <li key={index}>
                            <span className="font-medium">{outline.title}</span> - {outline.format}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">Content</h3>
                      <p className="whitespace-pre-wrap">{selectedStory.content}</p>
                    </div>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

