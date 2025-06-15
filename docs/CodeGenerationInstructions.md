# Prompt Instructions for AI Assistance

This document provides guidelines for crafting effective prompts when interacting with AI assistants (e.g., GitHub Copilot, ChatGPT) for this project.

## General Prompting Guidelines

-   **Be Specific**: Clearly state your goal or problem.
-   **Provide Context**: Include relevant file paths, function names, or code snippets.
-   **Request Format**: Specify the desired format (e.g., TypeScript, JSON, Markdown).

## Example Prompts

### Feature Implementation

> "Create a new TypeORM entity named `Product` with fields: `id`, `name`, `price`, and `tenantId` (foreign key to `Tenant`). Include timestamps."

### Bug Fixing

> "The `/auth/login` route returns a 500 error when the email is not found. Suggest a fix in `AuthController.ts`."

### Testing

> "Write a Jest test case for the `/users` POST route to verify that only admin users can create new users."

### Refactoring

> "Refactor the `UserService.create` method to handle database errors more gracefully."

### Documentation

> "Generate Markdown documentation for the `TokenService` class methods."

## Project-Specific Context

-   **Authentication**: JWT-based, using RSA keys (`certs/private.pem`, `certs/public.pem`).
-   **Roles**: Defined in `src/constants/index.ts` (`CUSTOMER`, `ADMIN`, `MANAGER`).
-   **Database**: PostgreSQL, managed by TypeORM (`src/config/data-source.ts`).

## Important Project Files

-   **Environment Variables**: `.env.dev`, `.env.test`, `.env.example`
-   **Dockerfiles**: `docker/development/Dockerfile`, `docker/prod/Dockerfile`
-   **CI/CD**: GitHub Actions workflow (`.github/workflows/ci.yaml`)

## AI Assistant Best Practices

-   Always review AI-generated code thoroughly.
-   Use AI suggestions as a starting point, not as final solutions.
-   Maintain consistency with existing code patterns and standards.
