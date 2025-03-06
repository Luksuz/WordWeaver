import { createClient } from '@supabase/supabase-js'
const supabase = createClient("https://qfpjbgjxkpwtsegtkaze.supabase.co","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFmcGpiZ2p4a3B3dHNlZ3RrYXplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA3MDE4NDcsImV4cCI6MjA1NjI3Nzg0N30.v0nFEXArDGSkzJaM1il8lxYPyB_w6CspvMiaPGPtok4")

// Create a function to handle changes
const handleChanges = (payload) => {
  console.log('Change received!', payload)
}

// Get the current user
const getCurrentUser = async () => {
  const { data } = await supabase.auth.getUser()
  return data.user
}

// Set up realtime subscription for the current user
const setupRealtimeForUser = async () => {
  const user = await getCurrentUser()
  if (user) {
    console.log(`Setting up realtime for user: ${user.id}`)
    
    const channel = supabase.channel('user_specific_changes')
    
    // Listen for updates to outline_sections for this user
    channel.on('postgres_changes', 
      { 
        event: 'UPDATE', 
        schema: 'public', 
        table: 'outline_sections',
        filter: `user_id=eq.${user.id}`
      }, 
      handleChanges
    )
    
    // Listen for inserts to outline_sections for this user
    channel.on('postgres_changes', 
      { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'outline_sections',
        filter: `user_id=eq.${user.id}`
      }, 
      handleChanges
    )
    
    // Subscribe to the channel
    channel.subscribe((status) => {
      console.log(`Realtime subscription status: ${status}`)
    })
    
    return channel
  } else {
    console.log('No user logged in, skipping realtime setup')
    return null
  }
}

// Initialize the realtime functionality
setupRealtimeForUser()