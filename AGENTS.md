# Project instructions

These instructions apply throughout this repository.

## Project purpose

- Build mobile-ready web games for mine worker safety training, guided by the existing documents in `docs/`.
- Design for phones first: responsive layouts, readable text, large touch targets, and controls that do not require a keyboard or hover.
- Keep game instructions and feedback clear and practical for mine workers. Preserve Vietnamese terminology from the source documents when presenting Vietnamese content.
- Base scenarios, correct answers, and safety feedback on relevant source documents. Keep source references traceable during development.
- Do not reward unsafe behavior or invent procedures to fill gaps in the documents; flag gaps for clarification.
- Verify gameplay and layout at mobile viewport sizes, as well as desktop, when implementing games.

## Working approach

- Read relevant files before making changes and keep changes focused on the requested task.
- Preserve existing user work and follow established project conventions.
- Use `rg` for file and text searches.
- Do not assume a language, framework, or build command; inspect the project first.
- Run relevant checks when available and report any checks that could not be run.

## Reference documents

- Treat files under `docs/` as source reference material; preserve their original contents and filenames unless asked to change them.
- Preserve Vietnamese text, diacritics, and document terminology.
- When deriving content from reference documents, identify the source and distinguish documented facts from assumptions.
- Do not invent safety procedures or regulatory requirements; flag missing or conflicting source information.

## Completion

- Summarize what changed, how it was verified, and any remaining limitations.
- Keep credentials and private configuration out of repository files.
