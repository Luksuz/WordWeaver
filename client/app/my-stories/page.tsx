"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { getOutlines, getOutlineSections } from "./actions"

interface OutlineSection {
  id: string
  outline_id: string
  title: string
  instructions: string
  position: number
  content: string
}


interface Story {
  id: string
  script_title: string
  word_count: number
  model: string
  created_at: string
  updated_at: string
  audience: string
  language: string
  style: string
  tone: string
  additional_data: string
  status: string
  user_id: string
  sections?: OutlineSection[]
}

export default function MyStories() {
  const [selectedStory, setSelectedStory] = useState<Story | null>(null)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [stories, setStories] = useState<Story[]>([])
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await supabase.auth.getUser()
        setUser(data.user)
        
        if (data.user) {
          const outlines = await getOutlines(data.user.id)
          console.log(outlines)
          setStories(outlines)
        }
      } catch (error) {
        console.error("Error fetching user:", error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchUser()
  }, [])

  const handleSelectStory = async (story: Story) => {
    try {
      const sections = await getOutlineSections(story.id)
      setSelectedStory({
        ...story,
        sections
      })
    } catch (error) {
      console.error("Error fetching story sections:", error)
    }
  }

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
      
      {stories.length === 0 ? (
        <div className="text-center py-8">
          <p className="mb-4">You haven't created any stories yet.</p>
          <Link href="/create-content">
            <Button>Create Your First Story</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stories.map((story) => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleSelectStory(story)}>
                <CardHeader>
                  <CardTitle>{story.script_title}</CardTitle>
                  <CardDescription>{story.audience || "No audience specified"}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Word count: {story.word_count}</p>
                  <p className="text-sm text-muted-foreground">AI Model: {story.model}</p>
                  <p className="text-sm text-muted-foreground">Status: {story.status === "draft" ? "Draft" : "Completed"}</p>
                  <p className="text-sm text-muted-foreground">Created: {new Date(story.created_at).toLocaleDateString()}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

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
                  <CardTitle>{selectedStory.script_title}</CardTitle>
                  <CardDescription>{selectedStory.audience || "No audience specified"}</CardDescription>
                </div>
                <div className="flex space-x-2">
                  {selectedStory.status === "draft" && (
                    <Link href={`/create-content?outline=${selectedStory.id}`}>
                      <Button variant="outline">Edit</Button>
                    </Link>
                  )}
                  <Button variant="ghost" onClick={() => setSelectedStory(null)}>
                    Close
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[calc(90vh-8rem)]">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold">Parameters</h3>
                      <p>Word count: {selectedStory.word_count}</p>
                      <p>AI Model: {selectedStory.model}</p>
                      <p>Status: {selectedStory.status === "draft" ? "Draft" : "Completed"}</p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">Outline Sections</h3>
                      {selectedStory.sections && selectedStory.sections.length > 0 ? (
                        <ul className="list-disc list-inside">
                          {selectedStory.sections.map((section) => (
                            <li key={section.id}>
                              <span className="font-medium">{section.title}</span> - {section.instructions}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-muted-foreground">No sections found</p>
                      )}
                    </div>
                    {selectedStory.status !== "draft" && selectedStory.sections && (
                      <div>
                        <h3 className="text-lg font-semibold">Content</h3>
                        {selectedStory.sections.map((section) => (
                          <div key={section.id} className="mb-4">
                            <h4 className="font-medium">{section.title}</h4>
                            <p className="whitespace-pre-wrap">{section.content || "No content generated yet"}</p>
                          </div>
                        ))}
                      </div>
                    )}
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

