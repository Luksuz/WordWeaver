from db.supabase import supabase
from typing import List, Dict, Any, Optional
from models.content import OutlineSection, Outline
from datetime import datetime

class ContentRepository:
    """Repository for interacting with content-related database tables."""
    
    @staticmethod
    def create_outline(outline_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Store outline parameters in the database.
        
        Args:
            outline_data: Dictionary containing outline parameters
            
        Returns:
            The stored outline data with generated ID
        """
        response = supabase.table("outlines").insert(outline_data).execute()
        if not response.data:
            raise ValueError("Failed to create outline in database")
        return response.data[0]

    @staticmethod
    def get_outline(outline_id: str) -> Dict[str, Any]:
        """
        Get outline by ID.
        
        Args:
            outline_id: The ID of the outline to retrieve
            
        Returns:
            The outline data
            
        Raises:
            ValueError: If outline not found
        """
        response = supabase.table("outlines").select("*").eq("id", outline_id).execute()
        if not response.data:
            raise ValueError(f"Outline with ID {outline_id} not found")
        return response.data[0]

    @staticmethod
    def create_outline_sections(outline_sections: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Store multiple outline sections.
        
        Args:
            outline_sections: List of section data dictionaries
            
        Returns:
            The stored sections data with generated IDs
        """
        if not outline_sections:
            return []
            
        response = supabase.table("outline_sections").insert(outline_sections).execute()
        if not response.data:
            raise ValueError("Failed to create outline sections in database")
        return response.data

    @staticmethod
    def update_section_content(section_id: str, content: str) -> Dict[str, Any]:
        """
        Update the content for a specific outline section.
        
        Args:
            section_id: The ID of the section to update
            content: The generated content to store
            
        Returns:
            The updated section data
        """
        response = supabase.table("outline_sections").update({"content": content, "updated_at": "now()"}).eq("id", section_id).execute()
        if not response.data:
            raise ValueError(f"Failed to update content for section {section_id}")
        return response.data[0]

    @staticmethod
    def get_outline_sections(outline_id: str) -> List[Dict[str, Any]]:
        """
        Get all sections for a specific outline.
        
        Args:
            outline_id: The ID of the outline
            
        Returns:
            List of section data dictionaries
        """
        response = supabase.table("outline_sections").select("*").eq("outline_id", outline_id).order("position").execute()
        return response.data or []

    @staticmethod
    def get_outline_section(section_id: str) -> Optional[Dict[str, Any]]:
        """
        Get a specific outline section.
        
        Args:
            section_id: The ID of the section
            
        Returns:
            The section data or None if not found
        """
        response = supabase.table("outline_sections").select("*").eq("id", section_id).execute()
        return response.data[0] if response.data else None
