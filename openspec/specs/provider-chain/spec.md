## ADDED Requirements

### Requirement: Groq as primary summarization provider
The system SHALL use Groq (Llama 3.3 70B) as the primary provider for all summarization requests. The Groq client SHALL be initialized with the `GROQ_API_KEY` environment variable.

#### Scenario: Successful Groq summarization
- **WHEN** an item is submitted for summarization and Groq API is available
- **THEN** the system sends the prompt to Groq and returns the JSON response text

#### Scenario: Groq API key not configured
- **WHEN** `GROQ_API_KEY` is not set and summarization is requested
- **THEN** the system skips Groq and attempts Gemini directly

### Requirement: Gemini as fallback summarization provider
The system SHALL use Gemini 2.5 Flash as the fallback provider when Groq fails. The model SHALL be `gemini-2.5-flash` (not flash-lite). The Gemini client SHALL be initialized with the `GEMINI_API_KEY` environment variable.

#### Scenario: Groq fails, Gemini succeeds
- **WHEN** Groq returns an error (rate limit, network, malformed response) for an item
- **THEN** the system retries the same item with Gemini 2.5 Flash

#### Scenario: Gemini API key not configured
- **WHEN** `GEMINI_API_KEY` is not set and Gemini is attempted as fallback
- **THEN** the system skips Gemini and uses the local fallback

### Requirement: Local fallback for total provider failure
The system SHALL fall back to local summary extraction when both Groq and Gemini fail. The local fallback SHALL extract the first 2 sentences of content, assign default category `industry_trends`, importance 2, and devRelevance `general`.

#### Scenario: Both providers fail
- **WHEN** both Groq and Gemini fail for an item
- **THEN** the system generates a local fallback summary and logs the failure

### Requirement: Per-item fallback chain
The fallback chain SHALL execute per-item, not per-batch. Each item independently attempts Groq → Gemini → local fallback.

#### Scenario: Mixed provider success in a batch
- **WHEN** a batch of 10 items is processed and Groq fails on item 3
- **THEN** item 3 falls back to Gemini while items 4-10 continue attempting Groq

### Requirement: Provider-specific rate limiting
The system SHALL enforce rate limits per provider:
- Groq: minimum 4 seconds between requests
- Gemini: minimum 6.5 seconds between requests

Rate limit delays SHALL only apply to the provider being called (not globally across providers).

#### Scenario: Rate-limited request pacing
- **WHEN** multiple items are processed sequentially via Groq
- **THEN** the system waits at least 4 seconds between each Groq API call

### Requirement: Safety cap on items per run
The summarize script SHALL process up to 200 unsummarized items per run. This replaces the previous limit of 5 items per run.

#### Scenario: Normal batch processing
- **WHEN** the summarize script runs and 80 unsummarized items exist
- **THEN** all 80 items are processed

#### Scenario: Large backlog
- **WHEN** the summarize script runs and 500 unsummarized items exist
- **THEN** only the 200 most recent items are processed

### Requirement: GROQ_API_KEY environment variable
The system SHALL require `GROQ_API_KEY` as an environment variable for Groq provider access. It SHALL be added to the GitHub Actions pipeline workflow as a secret.

#### Scenario: Pipeline workflow uses Groq key
- **WHEN** the GitHub Actions summarize step runs
- **THEN** `GROQ_API_KEY` is available from repository secrets
