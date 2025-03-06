"use server"

import { supabase } from "@/lib/supabase"

export async function getOutlines(userId: string) {
  const { data, error } = await supabase
    .from("outlines")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
  
  if (error) {
    console.error("Error fetching outlines:", error)
    return []
  }
  
  return data || []
}

export async function getOutline(outlineId: string) {
  const { data, error } = await supabase
    .from("outlines")
    .select("*")
    .eq("id", outlineId)
    .single()
  
  if (error) {
    console.error("Error fetching outline:", error)
    return null
  }
  
  return data
}

export async function getOutlineSections(outlineId: string) {
  const { data, error } = await supabase
    .from("outline_sections")
    .select("*")
    .eq("outline_id", outlineId)
    .order("position", { ascending: true })
  
  if (error) {
    console.error("Error fetching outline sections:", error)
    return []
  }
  
  return data || []
}

