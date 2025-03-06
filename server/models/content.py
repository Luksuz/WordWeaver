from pydantic import BaseModel, ConfigDict, Field
from typing import List, Optional, ClassVar
from examples import (
    example_generate_outline_input, example_save_outline_input,
    example_section_content_input, example_complete_script_input,
    example_outline_response, example_section_content_output,
    example_complete_script_output
)


class OutlineSection(BaseModel):
    """Model representing a section of an outline."""
    id: Optional[str] = None
    outline_id: Optional[str] = None
    position: int
    title: str
    description: str
    instructions: str


class Outline(BaseModel):
    """Model representing a complete outline with multiple sections."""
    id: Optional[str]
    sections: List[OutlineSection]


class OutlineReference(BaseModel):
    outline_id: str


class GenerateOutlineInput(BaseModel):
    """Input model for generating an outline draft."""
    id: Optional[str] = None
    script_title: str
    word_count: int
    language: str
    audience: str
    style: str
    tone: str
    model: str
    additional_data: str
    
    model_config = ConfigDict(
        json_schema_extra={
            "examples": [example_generate_outline_input]
        }
    )


class GenerateOutlineSectionsInput(BaseModel):
    section_id: int
    section_title: str
    script_title: str
    description: str
    n_person_view: str
    excluded_words: str
    prev_section_title: Optional[str]
    next_section_title: Optional[str]


class GenerateOutlineSectionContentInput(BaseModel):
    """Input model for generating content for a specific outline section."""
    section_id: str
    current_section: OutlineSection
    previous_section: Optional[OutlineSection] = None
    next_section: Optional[OutlineSection] = None
    script_title: str
    context: str
    n_person_view: str
    excluded_words: str
    model: str
    
    model_config = ConfigDict(
        json_schema_extra={
            "examples": [example_section_content_input]
        }
    )


class GenerateOutlineSectionContentOutput(BaseModel):
    """Output model for section content generation."""
    content: str


class GenerateCompleteScriptInput(BaseModel):
    """Input model for generating a complete script from an outline."""
    outline: Outline
    
    model_config = ConfigDict(
        json_schema_extra={
            "examples": [example_complete_script_input]
        }
    )


class WrittenOutlineSection(BaseModel):
    """Model representing a section with generated content."""
    id: Optional[str] = None
    title: str
    description: str
    instructions: str
    content: str


class GenerateCompleteScriptOutput(BaseModel):
    """Output model for complete script generation."""
    sections: List[WrittenOutlineSection]
    
    model_config = ConfigDict(
        json_schema_extra={
            "examples": [example_complete_script_output]
        }
    )


class SaveOutlineInput(BaseModel):
    """Input model for saving a user-edited outline."""
    script_title: str
    word_count: int
    language: str
    audience: str
    style: str
    tone: str
    model: str
    additional_data: str
    sections: List[OutlineSection]
    
    model_config = ConfigDict(
        json_schema_extra={
            "examples": [example_save_outline_input]
        }
    )


class OutlineResponse(BaseModel):
    """Response model for outline operations."""
    outline_id: str
    
    model_config = ConfigDict(
        json_schema_extra={
            "examples": [example_outline_response]
        }
    )

