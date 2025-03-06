import logging
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from models.content import (
    GenerateOutlineInput, Outline, OutlineSection, SaveOutlineInput,
    GenerateOutlineSectionContentInput, GenerateOutlineSectionContentOutput,
    GenerateCompleteScriptInput, GenerateCompleteScriptOutput, WrittenOutlineSection
)
from repository.content import ContentRepository
from fastapi import BackgroundTasks


logger = logging.getLogger(__name__)


class ContentService:
    """Service for handling content generation and management."""

    @staticmethod
    def generate_outline_draft(input: GenerateOutlineInput) -> Outline:
        """
        Generate an outline draft without storing it.
        
        Args:
            input: The input parameters for outline generation
            
        Returns:
            A complete outline with sections
        """
        try:
            model = ChatOpenAI(model=input.model, temperature=0.0).with_structured_output(Outline)
            sections_count = max(1, int(input.word_count / 700))  # Ensure at least 1 section

            prompt = ChatPromptTemplate.from_messages(
                [
                    ("user", """
                    Generate an outline for a script with the following title: "${script_title}".
                    The script should be aimed at ${audience}.
                    
                    The outline should have ${sections_count} sections, each with the following shape:
                    {{
                       "position": "Section Position (0, 1, 2 etc.)",
                       "title": "Section Title",
                       "description": "Concise description of what the section should be about",
                       "instructions": "Concise instructions on how to write the section, the style, the tone, the audience, etc."
                     }}


                    ***ADDITIONAL CONTEXT:***
                    ${context}
                    """),
                ]
            )

            chain = {
                "context": lambda x: input.additional_data,
                "script_title": lambda x: input.script_title,
                "audience": lambda x: input.audience,
                "sections_count": lambda x: sections_count,
            } | prompt | model

            # Get the outline from the LLM and return it directly
            outline = chain.invoke({})
            return outline
        except Exception as e:
            logger.error(f"Error generating outline draft: {str(e)}")
            raise
    
    @staticmethod
    def save_outline(input: SaveOutlineInput) -> str:
        """
        Save a user-edited outline to the database.
        
        Args:
            input: The outline data to save
            
        Returns:
            The ID of the saved outline
        """
        try:
            # Store the outline parameters in the database
            stored_outline = ContentRepository.create_outline({
                "script_title": input.script_title,
                "word_count": input.word_count,
                "language": input.language,
                "audience": input.audience,
                "style": input.style,
                "tone": input.tone,
                "model": input.model,
                "additional_data": input.additional_data
            })
            
            # Get the outline ID from the stored outline
            outline_id = stored_outline["id"]
            
            # Prepare sections for storage with the outline_id
            outline_sections = []
            for section in input.sections:
                section_data = {
                    "outline_id": outline_id,
                    "position": section.position,
                    "title": section.title,
                    "description": section.description,
                    "instructions": section.instructions,
                    "content": ""  # Initialize with empty content
                }
                outline_sections.append(section_data)
            
            # Store all sections in the database
            ContentRepository.create_outline_sections(outline_sections)
            
            # Return the outline ID
            return outline_id
        except Exception as e:
            logger.error(f"Error saving outline: {str(e)}")
            raise
    
    @staticmethod
    def generate_outline_section_content(input: GenerateOutlineSectionContentInput) -> GenerateOutlineSectionContentOutput:
        """
        Generate content for a specific outline section and store it in the database.
        
        Args:
            input: The input parameters for section content generation
            
        Returns:
            The generated section content
        """
        try:
            print("*"*100)
            print(input)
            print("*"*100)
            model = ChatOpenAI(model=input.model, temperature=0.0).with_structured_output(GenerateOutlineSectionContentOutput)
            
            # Get previously generated content if available
            previous_content = ""
            if input.previous_section and input.previous_section.id:
                previous_section_data = ContentRepository.get_outline_section(input.previous_section.id)
                if previous_section_data and "content" in previous_section_data and previous_section_data["content"]:
                    previous_content = previous_section_data["content"]
            
            prompt = ChatPromptTemplate.from_messages(
                [
                    ("user", """
                    You are a storyteller/narrator. Write a very detailed story/script for the following section:

                    - Write in {n_person_view} person view.
                    - Do not include scene directions or narrator markers, only the spoken text.
                    - Avoid welcoming phrases at the beginning.
                    - Keep language simple and clear.
                    - Exclude these words if possible: {excluded_words}
                    - Ensure coherence and flow from the previous section to this one.
                    - Maintain an investigative tone throughout, as if uncovering a secret government operation.
                    - Incorporate re-hooks by posing intriguing questions and adding suspenseful hints.
                    - IMPORTANT: Avoid repeating phrases, metaphors, or sentence structures from previous sections.
                    - Use varied vocabulary and sentence structures throughout.
                    - Each section should have its own unique voice and perspective while maintaining overall coherence.

                    Main script title: {script_title}

                    Current Section: {current_section}
                    Previous Section: {previous_section}
                    Next Section: {next_section}

                    {previous_content_instruction}
                    """),
                ]
            )
            
            # Remove ID and outline_id from sections before sending to the LLM
            def clean_section(section):
                if section:
                    section_dict = section.model_dump()
                    if "id" in section_dict:
                        del section_dict["id"]
                    if "outline_id" in section_dict:
                        del section_dict["outline_id"]
                    return section_dict
                return None
            
            previous_content_instruction = ""
            if previous_content:
                # Truncate if too long to fit in context window
                if len(previous_content) > 1000:
                    previous_content = previous_content[:1000] + "..."
                
                previous_content_instruction = f"""
                Here is the content from the previous section. DO NOT REPEAT phrases, examples, or sentence structures from this:
                
                {previous_content}
                
                Your content should be completely different in wording and examples while maintaining narrative coherence.
                """
            
            chain = {
                "current_section": lambda x: clean_section(input.current_section),
                "script_title": lambda x: input.script_title,
                "previous_section": lambda x: clean_section(input.previous_section) if input.previous_section else None,
                "next_section": lambda x: clean_section(input.next_section) if input.next_section else None,
                "n_person_view": lambda x: input.n_person_view,
                "excluded_words": lambda x: input.excluded_words,
                "previous_content_instruction": lambda x: previous_content_instruction,
            } | prompt | model
            
            content_output = chain.invoke({})
            
            # Store the generated content in the database
            if input.section_id:
                ContentRepository.update_section_content(input.section_id, content_output.content)
            
            return content_output
        except Exception as e:
            logger.error(f"Error generating section content: {str(e)}")
            raise
    
    @staticmethod
    def generate_remaining_sections(input: GenerateCompleteScriptInput, start_index: int = 1):
        """
        Background task to generate content for remaining sections.
        
        Args:
            input: The input parameters for complete script generation
            start_index: The index to start from (after the first section)
        """
        try:
            for index in range(start_index, len(input.outline.sections)):
                section = input.outline.sections[index]
                previous_section = input.outline.sections[index - 1] if index > 0 else None
                next_section = input.outline.sections[index + 1] if index < len(input.outline.sections) - 1 else None

                ContentService.generate_outline_section_content(GenerateOutlineSectionContentInput(
                    section_id=section.id,
                    current_section=section,
                    script_title=input.script_title,
                    context=input.context,
                    n_person_view=input.n_person_view,
                    excluded_words=input.excluded_words,
                    previous_section=previous_section,
                    next_section=next_section,
                    model=input.model,
                ))
                
                logger.info(f"Generated content for section {index+1} of {len(input.outline.sections)}")
                
        except Exception as e:
            logger.error(f"Error in background task generating sections: {str(e)}")
    
    @staticmethod
    def generate_complete_script_incremental(
        background_tasks: BackgroundTasks, 
        input: GenerateCompleteScriptInput
    ) -> WrittenOutlineSection:
        """
        Generate the first section immediately and queue the rest for background processing.
        
        Args:
            background_tasks: FastAPI BackgroundTasks object
            input: The input parameters for complete script generation
            
        Returns:
            The first section with generated content
        """
        try:
            print("*"*100)
            print(input)
            print("*"*100)
            if not input.outline.sections:
                raise ValueError("No sections found in the outline")
                
            # Generate content for the first section immediately
            first_section = input.outline.sections[0]
            next_section = input.outline.sections[1] if len(input.outline.sections) > 1 else None
            
            written_section = ContentService.generate_outline_section_content(GenerateOutlineSectionContentInput(
                section_id=first_section.id,
                current_section=first_section,
                script_title=input.script_title,
                context=input.context,
                n_person_view=input.n_person_view,
                excluded_words=input.excluded_words,
                previous_section=None,
                next_section=next_section,
                model=input.model,
            ))
            
            # Queue the remaining sections for background processing
            if len(input.outline.sections) > 1:
                background_tasks.add_task(
                    ContentService.generate_remaining_sections,
                    input=input,
                    start_index=1
                )
            
            # Return the first section immediately
            return WrittenOutlineSection(
                id=first_section.id,
                title=first_section.title,
                description=first_section.description,
                instructions=first_section.instructions,
                content=written_section.content
            )
            
        except Exception as e:
            logger.error(f"Error generating script incrementally: {str(e)}")
            raise
