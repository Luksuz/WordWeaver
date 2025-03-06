# Examples for GenerateOutlineInput
example_generate_outline_input = {
    "script_title": "The Future of Artificial Intelligence in Healthcare",
    "word_count": 2100,  # This would generate approximately 3 sections (700 words each)
    "language": "English",
    "audience": "Healthcare professionals and technology enthusiasts",
    "style": "Informative and analytical",
    "tone": "Professional with accessible explanations",
    "model": "gpt-4o-mini",
    "additional_data": """
    Focus on recent advancements in AI diagnostic tools, 
    patient care automation, and ethical considerations. 
    Include examples of successful AI implementations in hospitals.
    Discuss potential future developments in the next 5-10 years.
    Address concerns about data privacy and the human element in healthcare.
    """
}

# Example for SaveOutlineInput
example_save_outline_input = {
    "script_title": "The Future of Artificial Intelligence in Healthcare",
    "word_count": 2100,
    "language": "English",
    "audience": "Healthcare professionals and technology enthusiasts",
    "style": "Informative and analytical",
    "tone": "Professional with accessible explanations",
    "model": "gpt-4o-mini",
    "additional_data": "Focus on recent advancements in AI diagnostic tools and ethical considerations.",
    "sections": [
        {
            "position": 0,
            "title": "Current State of AI in Healthcare",
            "description": "Overview of how AI is currently being used in healthcare settings",
            "instructions": "Start with concrete examples of AI applications in hospitals and clinics."
        },
        {
            "position": 1,
            "title": "Ethical Considerations and Challenges",
            "description": "Discussion of ethical issues surrounding AI in healthcare",
            "instructions": "Address data privacy, bias in algorithms, and the balance between automation and human care."
        },
        {
            "position": 2,
            "title": "Future Developments and Potential",
            "description": "Exploration of upcoming AI technologies in healthcare",
            "instructions": "Focus on innovations in the pipeline and their potential impact on patient outcomes."
        }
    ]
}

# Example for GenerateOutlineSectionContentInput
example_section_content_input = {
    "section_id": 1,
    "current_section": {
        "position": 0,
        "title": "Current State of AI in Healthcare",
        "description": "Overview of how AI is currently being used in healthcare settings",
        "instructions": "Start with concrete examples of AI applications in hospitals and clinics."
    },
    "previous_section": None,
    "next_section": {
        "position": 1,
        "title": "Ethical Considerations and Challenges",
        "description": "Discussion of ethical issues surrounding AI in healthcare",
        "instructions": "Address data privacy, bias in algorithms, and the balance between automation and human care."
    },
    "script_title": "The Future of Artificial Intelligence in Healthcare",
    "context": "Focus on recent advancements in AI diagnostic tools and ethical considerations.",
    "n_person_view": "first",
    "excluded_words": "basically, actually, simply, just",
    "model": "gpt-4o-mini"
}

# Example for GenerateCompleteScriptInput
example_complete_script_input = {
    "outline": {
        "id": "123e4567-e89b-12d3-a456-426614174000",
        "sections": [
            {
                "id": 1,
                "outline_id": "123e4567-e89b-12d3-a456-426614174000",
                "position": 0,
                "title": "Current State of AI in Healthcare",
                "description": "Overview of how AI is currently being used in healthcare settings",
                "instructions": "Start with concrete examples of AI applications in hospitals and clinics."
            },
            {
                "id": 2,
                "outline_id": "123e4567-e89b-12d3-a456-426614174000",
                "position": 1,
                "title": "Ethical Considerations and Challenges",
                "description": "Discussion of ethical issues surrounding AI in healthcare",
                "instructions": "Address data privacy, bias in algorithms, and the balance between automation and human care."
            },
            {
                "id": 3,
                "outline_id": "123e4567-e89b-12d3-a456-426614174000",
                "position": 2,
                "title": "Future Developments and Potential",
                "description": "Exploration of upcoming AI technologies in healthcare",
                "instructions": "Focus on innovations in the pipeline and their potential impact on patient outcomes."
            }
        ]
    },
    "script_title": "The Future of Artificial Intelligence in Healthcare",
    "context": "Focus on recent advancements in AI diagnostic tools and ethical considerations.",
    "n_person_view": "first",
    "excluded_words": "basically, actually, simply, just",
    "model": "gpt-4o-mini"
}

# Example for OutlineResponse
example_outline_response = {
    "outline_id": "123e4567-e89b-12d3-a456-426614174000"
}

# Example for GenerateOutlineSectionContentOutput
example_section_content_output = {
    "content": """
    AI has transformed healthcare in ways we couldn't have imagined a decade ago. In hospitals across the country, machine learning algorithms now analyze medical images with remarkable accuracy. These systems can detect subtle patterns in X-rays, MRIs, and CT scans that might escape even the trained eye of an experienced radiologist.
    
    At Memorial Hospital in Boston, an AI system called DeepDiagnose has reduced diagnostic errors by 32% in the past year alone. The technology doesn't replace radiologists—it augments their capabilities, flagging potential issues for further review and providing a second opinion that helps doctors make more informed decisions.
    
    Beyond imaging, AI is revolutionizing patient care through predictive analytics. At Northwestern Medical Center, algorithms analyze thousands of data points from electronic health records to identify patients at risk of deterioration before obvious symptoms appear. This early warning system has reduced ICU admissions by 18% by enabling preventive interventions.
    
    What makes these systems truly remarkable isn't just their accuracy, but their ability to learn and improve over time. Each case they analyze adds to their knowledge base, refining their predictive capabilities.
    
    But how do these systems actually work? And what happens when we entrust critical healthcare decisions to algorithms that even their creators don't fully understand?
    """
}

# Example for GenerateCompleteScriptOutput
example_complete_script_output = {
    "sections": [
        {
            "id": 1,
            "title": "Current State of AI in Healthcare",
            "description": "Overview of how AI is currently being used in healthcare settings",
            "instructions": "Start with concrete examples of AI applications in hospitals and clinics.",
            "content": """
            AI has transformed healthcare in ways we couldn't have imagined a decade ago. In hospitals across the country, machine learning algorithms now analyze medical images with remarkable accuracy. These systems can detect subtle patterns in X-rays, MRIs, and CT scans that might escape even the trained eye of an experienced radiologist.
            
            At Memorial Hospital in Boston, an AI system called DeepDiagnose has reduced diagnostic errors by 32% in the past year alone. The technology doesn't replace radiologists—it augments their capabilities, flagging potential issues for further review and providing a second opinion that helps doctors make more informed decisions.
            
            Beyond imaging, AI is revolutionizing patient care through predictive analytics. At Northwestern Medical Center, algorithms analyze thousands of data points from electronic health records to identify patients at risk of deterioration before obvious symptoms appear. This early warning system has reduced ICU admissions by 18% by enabling preventive interventions.
            
            What makes these systems truly remarkable isn't just their accuracy, but their ability to learn and improve over time. Each case they analyze adds to their knowledge base, refining their predictive capabilities.
            
            But how do these systems actually work? And what happens when we entrust critical healthcare decisions to algorithms that even their creators don't fully understand?
            """
        },
        {
            "id": 2,
            "title": "Ethical Considerations and Challenges",
            "description": "Discussion of ethical issues surrounding AI in healthcare",
            "instructions": "Address data privacy, bias in algorithms, and the balance between automation and human care.",
            "content": """
            The promise of AI in healthcare comes with profound ethical questions that we're only beginning to address. Every time you interact with an AI-powered healthcare system, your data becomes part of its learning process. Your medical history, your genetic information, your treatment outcomes—all potentially accessible to these algorithms.
            
            Who owns this data? Who controls access to it? These aren't abstract questions. In 2019, a major healthcare provider partnered with a tech company to analyze patient records, only to face backlash when patients discovered their data had been shared without their explicit consent.
            
            Even more concerning is the potential for bias in these systems. AI algorithms learn from historical data—data that reflects existing inequalities in healthcare. A study at University Hospital found that their diagnostic algorithm recommended fewer specialized treatments for minority patients, not because it was programmed to discriminate, but because it learned from historical treatment patterns that already contained these biases.
            
            The human element in healthcare also hangs in the balance. When a doctor relies on an AI recommendation, who bears responsibility for the outcome? A surgeon in Chicago faced this dilemma when an AI surgical planning system suggested an approach that contradicted her clinical judgment.
            
            What happens when the cold logic of algorithms clashes with the compassionate art of medicine? And who's watching to ensure these systems don't cross ethical boundaries in their pursuit of efficiency?
            """
        },
        {
            "id": 3,
            "title": "Future Developments and Potential",
            "description": "Exploration of upcoming AI technologies in healthcare",
            "instructions": "Focus on innovations in the pipeline and their potential impact on patient outcomes.",
            "content": """
            The next wave of AI healthcare innovations promises to transform medicine even more fundamentally than what we've seen so far. In research labs across the world, scientists are developing AI systems that can predict disease outbreaks before they happen, design personalized treatment plans based on your genetic makeup, and even create entirely new medications.
            
            At the MIT BioAI Lab, researchers have developed an algorithm that can screen billions of potential drug compounds in days rather than years. This system recently identified a novel antibiotic capable of killing bacteria strains resistant to all known antibiotics—a discovery that could save countless lives in our battle against superbugs.
            
            Personalized medicine stands to benefit enormously from these advances. Imagine receiving treatment tailored not just to your diagnosis, but to your specific genetic profile, lifestyle factors, and even the unique characteristics of your disease. At Memorial Sloan Kettering, oncologists are using AI to analyze tumor samples and recommend personalized cancer treatments with unprecedented precision.
            
            Perhaps most revolutionary are the developments in brain-computer interfaces. Companies like Neuralink are working on implantable devices that could restore movement to paralyzed patients, treat neurological disorders, and eventually enhance human cognitive capabilities.
            
            But these remarkable possibilities raise equally profound questions. If we can predict who will develop certain diseases with high accuracy, how will that affect insurance coverage? If AI can enhance human cognition, who will have access to these technologies? And what happens when the line between human and machine intelligence begins to blur?
            
            The future of AI in healthcare isn't just about technology—it's about the kind of healthcare system we want to create, and ultimately, what it means to be human in an age of intelligent machines.
            """
        }
    ]
}
