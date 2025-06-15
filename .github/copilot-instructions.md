# GitHub Copilot Instructions

This document provides guidelines for using GitHub Copilot effectively within this project.

## Project Overview

This project is an authentication service built with Node.js, Express, TypeScript, and TypeORM. It includes JWT-based authentication, user management, role-based access control, and tenant management.

## Key Directories and Files

-   **src/**

    -   `app.ts`: Express application setup.
    -   `server.ts`: Server initialization and database connection.
    -   `routes/`: API route definitions.
    -   `controllers/`: Request handling logic.
    -   `services/`: Business logic and database interactions.
    -   `entity/`: TypeORM entities.
    -   `middlewares/`: Authentication and authorization middleware.
    -   `validators/`: Request validation schemas.
    -   `config/`: Configuration files and environment variables.
    -   `migration/`: Database migration scripts.

-   **tests/**
    -   Unit and integration tests using Jest and Supertest.

## Coding Standards

-   **Language**: TypeScript
-   **Linting**: ESLint with Prettier integration
-   **Testing**: Jest for unit/integration tests
-   **Database**: PostgreSQL with TypeORM
-   **Logging**: Winston logger

## Common Tasks

### Creating a New Route

1. Define route in `src/routes/`.
2. Implement controller logic in `src/controllers/`.
3. Add business logic in `src/services/`.
4. Validate requests using schemas in `src/validators/`.

### Database Operations

-   Use TypeORM repositories for CRUD operations.
-   Write migrations for schema changes (`npm run migration:generate`).

### Authentication & Authorization

-   JWT tokens generated and validated by `TokenService`.
-   Middleware (`authenticate.ts`, `canAccess.ts`) handles authorization.

## Important Commands

-   **Run Development Server**:

    ```sh
    npm run dev
    ```

-   **Run Tests**:

    ```sh
    npm test
    ```

-   **Lint and Format**:

    ```sh
    npm run lint:fix
    npm run format:fix
    ```

-   **Generate Migration**:

    ```sh
    npm run migration:generate -- src/migration/<migration-name> -d src/config/data-source.ts
    ```

-   **Run Migration**:
    ```sh
    npm run migration:run -- -d src/config/data-source.ts
    ```

## Copilot Usage Tips

-   Clearly comment your intent before writing code to get accurate suggestions.
-   Use descriptive function and variable names.
-   Leverage existing patterns in the codebase for consistency.
-   Review Copilot-generated code carefully before committing.
