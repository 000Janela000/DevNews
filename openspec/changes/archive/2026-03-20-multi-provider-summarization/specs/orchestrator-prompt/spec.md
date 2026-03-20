## ADDED Requirements

### Requirement: Orchestrator-focused system prompt
The summarization system prompt SHALL instruct the AI to evaluate items from the perspective of a developer who acts as an AI orchestrator — someone who needs to know which AI tools to use, what changed, and how it affects their workflow and tool selection decisions.

#### Scenario: Model release item
- **WHEN** an item about a new AI model release is summarized
- **THEN** the summary focuses on capability differences, pricing, and when a developer should choose this model over alternatives

#### Scenario: Research paper with practical application
- **WHEN** an item about a research paper on prompt engineering techniques is summarized
- **THEN** the summary highlights the practical technique and how it improves AI-assisted development workflows

#### Scenario: Research paper without practical application
- **WHEN** an item about a purely theoretical ML paper is summarized
- **THEN** the item receives lower importance and devRelevance of `general`

### Requirement: Orchestrator relevance evaluation
The summarization prompt SHALL explicitly ask the AI to evaluate: "Does this help a developer choose, use, or get more from AI tools?" The response SHALL include this assessment in the `devRelevance` field.

#### Scenario: Direct orchestrator relevance
- **WHEN** an item about a new SDK release or API change is summarized
- **THEN** `devRelevance` is set to `direct` and importance is scored 3+

#### Scenario: Indirect orchestrator relevance
- **WHEN** an item about AI company funding that may affect tool pricing is summarized
- **THEN** `devRelevance` is set to `indirect`

### Requirement: Actionability emphasis in summaries
Each summary SHALL answer the implicit question: "What changed and do I need to act?" Summaries SHALL lead with the concrete change, not background context.

#### Scenario: Summary structure
- **WHEN** any item is summarized
- **THEN** the summary leads with what changed, followed by why it matters for a developer's toolkit or workflow

### Requirement: Prompt compatibility across providers
The system prompt and user prompt SHALL work identically across Groq (Llama 3.3 70B) and Gemini 2.5 Flash. The prompt SHALL not use provider-specific features or syntax.

#### Scenario: Same prompt, different providers
- **WHEN** the same item is sent to Groq and Gemini
- **THEN** both receive identical system and user prompts
