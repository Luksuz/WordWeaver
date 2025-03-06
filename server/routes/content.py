from fastapi import APIRouter, HTTPException, Depends, status, BackgroundTasks
from typing import List
from models.content import (
    GenerateOutlineInput, GenerateCompleteScriptInput, Outline, 
    OutlineSection, SaveOutlineInput, OutlineResponse, 
    GenerateCompleteScriptOutput, WrittenOutlineSection,
    GenerateOutlineSectionContentInput
)
from repository.content import ContentRepository
from service.content import ContentService
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/outline", tags=["Outline"])

@router.post("/generate", response_model=Outline, status_code=status.HTTP_200_OK)
async def generate_outline(request: GenerateOutlineInput):
    """
    Generate an outline draft without storing it.
    
    This endpoint allows users to preview an outline before saving it.
    The generated outline can be edited on the frontend before being saved.
    """
    try:
        outline = ContentService.generate_outline_draft(request)
        return outline
    except Exception as e:
        logger.error(f"Error generating outline: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate outline: {str(e)}"
        )

@router.post("/save", response_model=OutlineResponse, status_code=status.HTTP_201_CREATED)
async def save_outline(request: SaveOutlineInput):
    """
    Save a user-edited outline to the database.
    
    This endpoint stores the outline parameters and sections after user edits.
    Returns the ID of the saved outline for future reference.
    """
    try:
        outline_id = ContentService.save_outline(request)
        return OutlineResponse(outline_id=outline_id)
    except Exception as e:
        logger.error(f"Error saving outline: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to save outline: {str(e)}"
        )

@router.get("/{outline_id}", response_model=Outline, status_code=status.HTTP_200_OK)
async def get_outline(outline_id: str):
    """
    Get a stored outline and its sections by ID.
    
    This endpoint retrieves a previously saved outline with all its sections.
    """
    try:
        # Get the outline data
        outline_data = ContentRepository.get_outline(outline_id)
        
        # Get all sections for this outline
        sections_data = ContentRepository.get_outline_sections(outline_id)
        
        # Convert sections to OutlineSection objects
        sections = [OutlineSection(**section) for section in sections_data]
        
        # Create the complete Outline object
        outline = Outline(id=outline_id, sections=sections)
        
        return outline
    except ValueError as e:
        logger.error(f"Outline not found: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Outline not found: {str(e)}"
        )
    except Exception as e:
        logger.error(f"Error retrieving outline: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve outline: {str(e)}"
        )

@router.post("/complete", response_model=WrittenOutlineSection, status_code=status.HTTP_202_ACCEPTED)
async def generate_complete_script(
    background_tasks: BackgroundTasks,
    request: GenerateCompleteScriptInput
):
    """
    Start generating a complete script from a stored outline.
    
    This endpoint returns the first section immediately and continues 
    generating the remaining sections in the background. It's identical to
    the incremental endpoint but maintained for backward compatibility.
    """
    try:
        first_section = ContentService.generate_complete_script_incremental(
            background_tasks=background_tasks,
            input=request
        )
        return first_section
    except Exception as e:
        logger.error(f"Error starting script generation: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to start script generation: {str(e)}"
        )

@router.post("/complete/incremental", response_model=WrittenOutlineSection, status_code=status.HTTP_202_ACCEPTED)
async def generate_complete_script_incremental(
    background_tasks: BackgroundTasks,
    request: GenerateCompleteScriptInput
):
    """
    Start generating a complete script from a stored outline.
    
    This endpoint returns the first section immediately and continues 
    generating the remaining sections in the background.
    """
    try:
        first_section = ContentService.generate_complete_script_incremental(
            background_tasks=background_tasks,
            input=request
        )
        return first_section
    except Exception as e:
        logger.error(f"Error starting script generation: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to start script generation: {str(e)}"
        )

@router.get("/{outline_id}/sections", response_model=List[WrittenOutlineSection], status_code=status.HTTP_200_OK)
async def get_outline_sections(outline_id: str):
    """
    Get all sections with their content for a specific outline.
    
    This endpoint can be used to check the progress of background generation.
    """
    try:
        # Get all sections for this outline
        sections_data = ContentRepository.get_outline_sections(outline_id)
        
        # Convert to WrittenOutlineSection objects
        sections = [WrittenOutlineSection(
            id=section["id"],
            title=section["title"],
            description=section["description"],
            instructions=section["instructions"],
            content=section["content"]
        ) for section in sections_data]
        
        return sections
    except Exception as e:
        logger.error(f"Error retrieving outline sections: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve outline sections: {str(e)}"
        )