"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ChevronDown, ChevronUp, Edit, Trash2, Plus } from "lucide-react"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

interface SectionOutline {
  id: string
  outline_id: string
  description: string
  instructions: string
  position: number  
  title: string
  content: string
}

interface SectionOutlinesProps {
  outlines: SectionOutline[]
  onUpdateOutlines: (outlines: SectionOutline[]) => void
}

export function SectionOutlines({ outlines, onUpdateOutlines }: SectionOutlinesProps) {
  const [editingSection, setEditingSection] = useState<string | null>(null)
  const [editValues, setEditValues] = useState<Record<string, { title: string, format: string }>>({})

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor),
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = outlines.findIndex((item) => item.id === active.id)
      const newIndex = outlines.findIndex((item) => item.id === over.id)

      const newOutlines = arrayMove(outlines, oldIndex, newIndex)
      
      // Update position values to match new array order
      const updatedOutlines = newOutlines.map((section, index) => ({
        ...section,
        position: index
      }))
      
      onUpdateOutlines(updatedOutlines)
    }
  }

  const handleEditSection = (section: SectionOutline) => {
    setEditingSection(section.id)
    setEditValues({
      ...editValues,
      [section.id]: { title: section.title, format: section.instructions }
    })
  }

  const handleSaveEdit = () => {
    if (!editingSection || !editValues[editingSection]) return

    const updatedOutlines = outlines.map((section) =>
      section.id === editingSection ? { 
        ...section, 
        title: editValues[editingSection].title, 
        format: editValues[editingSection].format 
      } : section,
    )

    onUpdateOutlines(updatedOutlines)
    setEditingSection(null)
  }

  const handleUpdateEditValue = (id: string, field: 'title' | 'format', value: string) => {
    setEditValues({
      ...editValues,
      [id]: {
        ...editValues[id],
        [field]: value
      }
    })
  }

  const handleDeleteSection = (id: string) => {
    const updatedOutlines = outlines.filter((section) => section.id !== id)
    onUpdateOutlines(updatedOutlines)
  }

  const handleAddSection = () => {
    const newId = String(outlines.length)
    const newSection: SectionOutline = {
      id: newId,
      title: "New Section",
      instructions: "Describe how this section should be structured and what tone it should have.",
      outline_id: "",
      description: "",
      position: outlines.length, // Set position to the end of the array
      content: "",
    }

    onUpdateOutlines([...outlines, newSection])
  }

  const handleMoveUp = (index: number) => {
    if (index === 0) return
    const newOutlines = [...outlines]
    const temp = newOutlines[index]
    newOutlines[index] = newOutlines[index - 1]
    newOutlines[index - 1] = temp
    
    // Update position values after moving
    const updatedOutlines = newOutlines.map((section, idx) => ({
      ...section,
      position: idx
    }))
    
    onUpdateOutlines(updatedOutlines)
  }

  const handleMoveDown = (index: number) => {
    if (index === outlines.length - 1) return
    const newOutlines = [...outlines]
    const temp = newOutlines[index]
    newOutlines[index] = newOutlines[index + 1]
    newOutlines[index + 1] = temp
    
    // Update position values after moving
    const updatedOutlines = newOutlines.map((section, idx) => ({
      ...section,
      position: idx
    }))
    
    onUpdateOutlines(updatedOutlines)
  }

  const handleCancelEdit = () => {
    setEditingSection(null)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Story Outline</CardTitle>
        <CardDescription>Create and organize your story structure before generating content.</CardDescription>
      </CardHeader>
      <CardContent>
        {outlines.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Generate outline sections to start building your content structure
          </div>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={outlines.map((section) => section.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-4">
                {outlines.map((section, index) => (
                  <SortableItem
                    key={section.id}
                    id={section.id}
                    section={section}
                    isEditing={editingSection === section.id}
                    editValue={editValues[section.id] || { title: section.title, format: section.instructions }}
                    onUpdateEditValue={(field, value) => handleUpdateEditValue(section.id, field, value)}
                    onEdit={() => handleEditSection(section)}
                    onSave={handleSaveEdit}
                    onCancel={handleCancelEdit}
                    onDelete={() => handleDeleteSection(section.id)}
                    onMoveUp={() => handleMoveUp(index)}
                    onMoveDown={() => handleMoveDown(index)}
                    canMoveUp={index > 0}
                    canMoveDown={index < outlines.length - 1}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}

        {outlines.length > 0 && (
          <Button variant="outline" className="w-full mt-4" onClick={handleAddSection}>
            <Plus className="h-4 w-4 mr-2" />
            Add Section
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

interface SortableItemProps {
  id: string
  section: SectionOutline
  isEditing: boolean
  editValue: { title: string, format: string }
  onUpdateEditValue: (field: 'title' | 'format', value: string) => void
  onEdit: () => void
  onSave: () => void
  onCancel: () => void
  onDelete: () => void
  onMoveUp: () => void
  onMoveDown: () => void
  canMoveUp: boolean
  canMoveDown: boolean
}

function SortableItem({
  id,
  section,
  isEditing,
  editValue,
  onUpdateEditValue,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
}: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div ref={setNodeRef} style={style} className="border rounded-lg p-4 bg-card">
      {isEditing ? (
        <div className="space-y-3">
          <Input 
            value={editValue.title} 
            onChange={(e) => onUpdateEditValue('title', e.target.value)} 
            placeholder="Section title" 
          />
          <Textarea
            value={editValue.format}
            onChange={(e) => onUpdateEditValue('format', e.target.value)}
            placeholder="Section format description"
            rows={4}
          />
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button onClick={onSave}>Save</Button>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold">{section.title}</h3>
            <div className="flex items-center space-x-1">
              <Button variant="ghost" size="icon" onClick={onMoveUp} disabled={!canMoveUp}>
                <ChevronUp className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={onMoveDown} disabled={!canMoveDown}>
                <ChevronDown className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={onEdit}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={onDelete}>
                <Trash2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="cursor-grab" {...attributes} {...listeners}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 4H6V6H4V4Z" fill="currentColor" />
                  <path d="M10 4H12V6H10V4Z" fill="currentColor" />
                  <path d="M4 10H6V12H4V10Z" fill="currentColor" />
                  <path d="M10 10H12V12H10V10Z" fill="currentColor" />
                </svg>
              </Button>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">{section.instructions}</p>
        </div>
      )}
    </div>
  )
}

