# MindForge Backend Service Repository

## Table of Contents

1. [MindForge Backend Service Repository](#mindforge-backend-service-repository)
   - [Local Dev Setup](#local-dev-setup)
2. [Functional Requirements Document (FRD)](#functional-requirements-document-frd)
   - [User Stories and Use Cases](#user-stories-and-use-cases)
     - [Feature: User](#feature-user)
     - [Feature: Profile](#feature-profile)
     - [Feature: Course](#feature-course)
     - [Feature: Topic](#feature-topic)
   - [Role-based Access Definitions](#role-based-access-definitions)
   - [Workflow Descriptions](#workflow-descriptions)
3. [Non-Functional Requirements (NFR)](#non-functional-requirements-nfr)
   - [Performance Targets](#performance-targets)
   - [Availability Goals](#availability-goals)
   - [Scalability Considerations](#scalability-considerations)
   - [Security Measures](#security-measures)
   - [Maintainability Principles](#maintainability-principles)
4. [Project Structure](#project-structure)
   - [src/app.ts](#srcappts)
   - [src/server.ts](#srcserverts)
   - [prisma/schema.prisma](#prismaschemaprisma)
   - [package.json](#packagejson)
   - [tsconfig.json](#tsconfigjson)
   - [src/features/](#srcfeatures)
   - [src/middleware/](#srcmiddleware)
   - [src/shared/](#srcshared)
   - [docker-compose.yml](#docker-composeyml)
   - [README.md](#readmemd)
5. [Low-Level System Architecture (LLA)](#low-level-system-architecture-lla)
   - [Diagram showing frontend, backend, database, APIs](#diagram-showing-frontend-backend-database-apis)
   - [Rationale for Technology Choices](#rationale-for-technology-choices)
   - [Breakdown of Modules/Services and How They Interact](#breakdown-of-modulesservices-and-how-they-interact)
6. [DevOps & Deployment Plan](#devops--deployment-plan)
   - [GitHub Actions Configuration](#github-actions-configuration)

### Local Dev Setup

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/mind-forgee/mind-forge-be.git
    cd mind-forge-be
    ```

2.  **Configure Environment Variables:**
    Create a `.env` file from the example. The default database values are pre-configured to work with the provided `docker-compose.yml`.

    ```bash
    cp .env.example .env
    ```

    Open the new `.env` file and fill all the values.

    ```env
    NODE_ENV=development # or production
    PORT=3001

    # Postgre Database URL for local development
    DATABASE_URL=postgresql://user:password@localhost:5432/mydatabase

    # Generate a strong secret with: openssl rand -base64 32
    JWT_SECRET=your-super-strong-jwt-secret
    ```

3.  **Install Go Dependencies :**

    ```bash
    npm install
    ```

4.  **Generate Prisma Client :**

    ```bash
    npx prisma generate
    ```

5.  **Initialize the Database (First-Time Setup Only):**
    For the first time, you need to run migrations to create the tables and then seed the database with initial data.

    **Step 5a: Run Migrations**

    ```sh
    npx prisma migrate dev --name init
    ```

6.  **Run the Application:**

    ```bash
    npm run dev
    ```

    The server will now be running at `http://localhost:3001`.

# Functional Requirements Document (FRD)

## User Stories and Use Cases

### **Feature: User**

#### **User Stories**

1. As a user, I want to register so that I can access the platform.
2. As a user, I want to log in so that I can access my account.
3. As a user, I want to log out so that I can secure my account.
4. As a user, I want to change my password so that I can maintain the security of my account.
5. As a new user, I want to pick a topic so that I can start learning in my area of interest.
6. As a user, I want to pick the difficulty level of the topic so that I can learn at my preferred pace.
7. As a user, I want the system to assign me to an existing course if it matches my topic and difficulty so that I can start learning immediately.
8. As a user, I want the system to generate a new course if no matching course exists so that I can still learn my chosen topic and difficulty.
9. As a user, I want to access my dashboard after being assigned to a course so that I can track my learning progress.
10. As a user, I want to start and complete chapters in the course so that I can progress through the material.
11. As a user, I want to submit proof for the study case chapter (optional) so that I can validate my learning.
12. As a user, I want to see my progress percentage so that I can track how much of the course I have completed.

#### **Use Cases**

- **UC1: Register**
  - **Actor**: User
  - **Precondition**: User provides valid registration details.
  - **Steps**:
    1. User submits registration form.
    2. System validates and creates a new account.
  - **Postcondition**: User account is created.

- **UC2: Log In**
  - **Actor**: User
  - **Precondition**: User provides valid credentials.
  - **Steps**:
    1. User submits login form.
    2. System validates credentials and grants access.
  - **Postcondition**: User is logged in.

- **UC3: Log Out**
  - **Actor**: User
  - **Precondition**: User is logged in.
  - **Steps**:
    1. User clicks the log-out button.
    2. System terminates the session.
  - **Postcondition**: User is logged out.

- **UC4: Change Password**
  - **Actor**: User
  - **Precondition**: User is logged in and provides the current password.
  - **Steps**:
    1. User navigates to the change password section.
    2. User enters the current password and the new password.
    3. System validates the current password and updates the password.
  - **Postcondition**: User's password is updated.

- **UC5: Pick Topic**
  - **Actor**: New User
  - **Precondition**: User is authenticated.
  - **Steps**:
    1. User selects a topic from the available list.
    2. System records the selected topic.
  - **Postcondition**: Topic is selected.

- **UC6: Pick Difficulty**
  - **Actor**: User
  - **Precondition**: User has selected a topic.
  - **Steps**:
    1. User selects a difficulty level for the topic.
    2. System records the selected difficulty.
  - **Postcondition**: Difficulty is selected.

- **UC7: Assign to Existing Course**
  - **Actor**: User
  - **Precondition**: User has selected a topic and difficulty, and a matching course exists.
  - **Steps**:
    1. System checks for an existing course matching the topic and difficulty.
    2. System assigns the user to the course.
  - **Postcondition**: User is assigned to an existing course.

- **UC8: Generate New Course**
  - **Actor**: User
  - **Precondition**: User has selected a topic and difficulty, and no matching course exists.
  - **Steps**:
    1. System generates a new course using AI based on the selected topic and difficulty.
    2. System assigns the user to the newly generated course.
  - **Postcondition**: User is assigned to a newly generated course.

- **UC9: Access Dashboard**
  - **Actor**: User
  - **Precondition**: User is assigned to a course.
  - **Steps**:
    1. User navigates to the dashboard.
    2. System displays the user’s course and progress.
  - **Postcondition**: User accesses the dashboard.

- **UC10: Start and Complete Chapters**
  - **Actor**: User
  - **Precondition**: User is assigned to a course.
  - **Steps**:
    1. User starts a chapter in the course.
    2. User completes the chapter.
    3. System updates the user’s progress.
  - **Postcondition**: User progresses through the course.

- **UC11: Submit Proof for Study Case Chapter**
  - **Actor**: User
  - **Precondition**: User has reached the study case chapter.
  - **Steps**:
    1. User submits a link as proof for the study case (optional).
    2. System records the submission.
  - **Postcondition**: Proof is submitted (if provided).

- **UC12: View Progress Percentage**
  - **Actor**: User
  - **Precondition**: User is assigned to a course.
  - **Steps**:
    1. User views the progress percentage on the dashboard.
    2. System calculates and displays the progress percentage.
  - **Postcondition**: User sees their progress percentage.

---

### **Feature: Profile**

#### **User Stories**

1. As a user, I want to view my profile so that I can see my personal information.
2. As a user, I want to update my profile so that I can keep my information up to date.

#### **Use Cases**

- **UC1: View Profile**
  - **Actor**: User
  - **Precondition**: User is authenticated.
  - **Steps**:
    1. User navigates to their profile.
    2. System displays the user's profile information.
  - **Postcondition**: User views their profile.

- **UC2: Update Profile**
  - **Actor**: User
  - **Precondition**: User is authenticated.
  - **Steps**:
    1. User submits updated profile information.
    2. System validates and saves the changes.
  - **Postcondition**: User's profile is updated.

---

### **Feature: Course**

#### **User Stories**

1. As a user, I want to view detailed information about a course so that I can decide whether to enroll.
2. As an admin can delete courses so that I can manage the course catalog.

#### **Use Cases**

- **UC1: View Assigned Course**
  - **Actor**: User
  - **Precondition**: User has selected a topic and difficulty, and the system has assigned a course.
  - **Steps**:
    1. User navigates to their dashboard.
    2. System displays the assigned course details.
  - **Postcondition**: User views the assigned course.

- **UC2: View Course Details**
  - **Actor**: User
  - **Precondition**: User is assigned to a course.
  - **Steps**:
    1. User clicks on the assigned course.
    2. System displays detailed information about the course.
  - **Postcondition**: User views course details.

- **UC3: Manage Courses**
  - **Actor**: Admin
  - **Precondition**: Admin is authenticated.
  - **Steps**:
    1. Admin can deletes a course.
    2. System updates the course catalog.
  - **Postcondition**: Course catalog is updated.

---

### **Feature: Topic**

#### **User Stories**

1. As a user, I want to browse topics so that I can explore areas of interest.
2. As an admin, I want to manage topics so that I can organize content effectively.

#### **Use Cases**

- **UC1: Browse Topics**
  - **Actor**: User
  - **Precondition**: User is authenticated.
  - **Steps**:
    1. User navigates to the topic list.
    2. System displays a list of topics.
  - **Postcondition**: User views the list of topics.

- **UC2: Manage Topics**
  - **Actor**: Admin
  - **Precondition**: Admin is authenticated.
  - **Steps**:
    1. Admin creates a topic.
    2. System updates the topic list.
  - **Postcondition**: Topic list is updated.

---

## Role-based access definitions

### **Roles**

1. **User**: A regular user of the platform who can register, log in, and access learning materials.
2. **Admin**: A privileged user who can manage courses, topics, and user accounts.

### **Access Control**

- **User**:
  - Can register, log in, and log out.
  - Can pick topics and difficulty levels.
  - Can view and complete assigned courses.
  - Can view and update their profile.
  - Can submit proof for study case chapters.

- **Admin**:
  - Can manage courses
  - Can manage topics
  - Can view and manage user accounts.

---

## Workflow descriptions

### **Workflow: Generating Course and Chapters Structure**

1. **Trigger**: User selects a topic and difficulty level.
2. **Process**:
   - The system uses Gemini AI to generate the course structure and chapters based on the selected topic and difficulty.
   - The generated structure is saved in the database.
3. **Background Task**:
   - Using Redis, the system asynchronously generates detailed content for each chapter.
4. **Outcome**: A fully structured course with chapters and content is available for the user.

### **Workflow: User Registration and Authentication**

1. **Trigger**: User submits registration or login form.
2. **Process**:
   - For registration, the system validates the input and creates a new user account.
   - For login, the system verifies the credentials and generates an authentication token.
3. **Outcome**: User is authenticated and can access the platform.

### **Workflow: Course Management by Admin**

1. **Trigger**: Admin performs actions like deleting a course.
2. **Process**:
   - The system validates the admin's input.
   - Updates are reflected in the course catalog.
3. **Outcome**: The course catalog is updated accordingly.

### **Workflow: Topic Management by Admin**

1. **Trigger**: Admin creates topics.
2. **Process**:
   - The system validates the input and updates the topic list.
3. **Outcome**: Topics are organized and available for users.

### **Workflow: User Progress Tracking**

1. **Trigger**: User completes a chapter or submits proof for a study case.
2. **Process**:
   - The system updates the user's progress percentage.
   - For study case submissions, the system records the proof.
3. **Outcome**: User's progress is tracked and displayed on the dashboard.

# Non-Functional Requirements (NFR)

## Performance Targets

- **Transaction Submission:** Ensure API endpoints respond within 500 ms under normal load.
- **Database Queries:** Optimize Prisma queries to minimize latency.

## Availability Goals

- **Uptime:** Maintain 99.9% uptime by leveraging robust error handling.
- **Redundancy:** Use Docker and for container orchestration to ensure high availability.

## Scalability Considerations

- **Horizontal Scaling:** Support 10× more users by deploying additional instances of the backend.
- **Queue Management:** Use Bull queues for handling asynchronous tasks efficiently.

## Security Measures

- **Authentication:** Implement JWT-based authentication for secure user sessions.
- **Data Protection:** Use bcrypt for password hashing and enforce HTTPS for secure communication.
- **RBAC:** Role-Based Access Control for managing user permissions.

## Maintainability Principles

- **Modular Architecture:** Organize code into features (e.g., `user`, `course`, `topic`) for better maintainability.
- **CLI Logging:** Use middleware for centralized error logging and debugging.
- **Documentation:** Maintain up-to-date API documentation in [postman](https://www.postman.com/jevvonn-team/workspace/mind-forge-api-documentation).

---

## Project Structure

### `src/app.ts`

- **Purpose:** Initializes the Express application and sets up middleware, routes, and error handling.
- **NFR Alignment:**
  - **Performance:** Middleware like `express.json()` ensures efficient request parsing.
  - **Maintainability:** Modular route imports (`userRoutes`, `courseRoutes`, etc.) improve code organization.

### `src/server.ts`

- **Purpose:** Starts the Express server and listens on the configured port.
- **NFR Alignment:**
  - **Availability:** Logs server status to ensure uptime monitoring.
  - **Scalability:** Configurable port allows deployment flexibility.

### `prisma/schema.prisma`

- **Purpose:** Defines the database schema and relationships.
- **NFR Alignment:**
  - **Performance:** Optimized schema design for efficient queries.
  - **Scalability:** Supports migrations for evolving database needs.

### `package.json`

- **Purpose:** Manages project dependencies and scripts.
- **NFR Alignment:**
  - **Maintainability:** Scripts like `npm run dev` streamline development workflows.
  - **Scalability:** Dependencies like `@prisma/client` and `bull` support robust backend operations.

### `tsconfig.json`

- **Purpose:** Configures TypeScript compiler options.
- **NFR Alignment:**
  - **Maintainability:** Enforces strict type checking for reliable code.
  - **Performance:** Optimized output directory (`dist`) for production builds.

### `src/features/`

- **Subdirectories:**
  - **`user/`:** Handles user authentication and management.
  - **`course/`:** Manages course-related operations.
  - **`topic/`:** Handles topic-related functionalities.
- **NFR Alignment:**
  - **Maintainability:** Feature-based structure simplifies code navigation.
  - **Security:** Each feature implements its own validation and authorization logic.

### `src/middleware/`

- **Files:**
  - **`errorHandler.ts`:** Centralized error handling.
  - **`verifyToken.ts`:** Middleware for token validation.
- **NFR Alignment:**
  - **Security:** Ensures only authenticated requests are processed.
  - **Maintainability:** Reusable middleware components.

### `src/shared/`

- **Files:**
  - **`chapterQueue.ts`:** Manages asynchronous tasks using Bull.
  - **`generateToken.ts`:** Utility for generating JWT tokens.
- **NFR Alignment:**
  - **Scalability:** Efficient task management for high-load scenarios.
  - **Security:** Secure token generation for authentication.

### `docker-compose.yml`

- **Purpose:** Defines services for local and production development and testing.
- **NFR Alignment:**
  - **Availability:** Simplifies environment setup for consistent deployments.
  - **Scalability:** Supports multi-container applications.

### `README.md`

- **Purpose:** Provides setup instructions and project overview.
- **NFR Alignment:**
  - **Maintainability:** Ensures developers can quickly onboard and understand the project.

---

# Low-Level System Architecture (LLA)

## Diagram showing frontend, backend, database, APIs

![LLA Diagram](https://hgojinfbxixjverqabql.supabase.co/storage/v1/object/public/readme/lla.png)

## Rationale for Technology Choices

### Vite + React

Vite was chosen as the bundler for its blazing-fast development and build performance. React is used to build dynamic, modular, and maintainable user interfaces.

### Express (TypeScript)

Express provides flexibility for building APIs with a mature ecosystem. TypeScript adds type-safety, which improves reliability, reduces runtime errors, and simplifies debugging and maintenance.

### PostgreSQL

PostgreSQL was selected for its stability, strong support for complex transactions, relational data modeling, and high performance at scale. It ensures data integrity and consistency, making it suitable for structured data needs.

### Redis (Background Task)

Redis is used as a fast in-memory data store to handle task queues and background jobs. Offloading heavy tasks to background workers improves responsiveness and scalability of the main application.

### REST API

REST was chosen for its simplicity, wide adoption, and compatibility across platforms and libraries. It is well-suited for standard API requirements without the added complexity of GraphQL.

### Prisma ORM

Prisma provides a modern ORM experience with type-safety, auto-completion, and a developer-friendly query builder. It simplifies schema management and database migrations compared to raw SQL.

### Docker

Docker ensures that each component (API, database, cache, worker) runs in isolated containers. This guarantees consistency across development, staging, and production environments.

### GitHub Actions (CI/CD)

GitHub Actions was chosen to automate build, test, and deployment pipelines. Its native integration with GitHub makes it efficient and easy to maintain without requiring additional CI/CD tools.

## Breakdown of Modules/Services and How They Interact

### 1. Course Module

- **Controller**: `course.controller.ts`
  - Handles API requests for creating courses, fetching user courses, completing chapters, collecting study case proofs, and updating study case statuses.
- **Service**: `course.service.ts`
  - Implements business logic for course-related operations, such as:
    - Creating courses using Prisma ORM and integrating with AI models for content generation.
    - Managing user-course relationships and chapter progress.
    - Handling study case proofs and their statuses.

**Interaction**:

- The controller interacts with the service layer to process requests and send responses.
- The service layer communicates with the database via Prisma and integrates with shared utilities like `chapterQueue` and `geminiAI`.

### 2. User Module

- **Controller**: `user.controller.ts`
  - Manages user-related API endpoints, including user creation, login, logout, fetching user details, and password changes.
- **Service**: `user.service.ts`
  - Handles user authentication, token generation, and database operations for user management.

**Interaction**:

- The controller uses the service layer for user authentication and data retrieval.
- The service layer interacts with shared utilities like `generateToken` and `checkUser`.

### 3. Profile Module

- **Controller**: `profile.controller.ts`
  - Provides an endpoint for updating user profiles.
- **Service**: `profile.service.ts`
  - Updates user profile information in the database, ensuring email uniqueness.

**Interaction**:

- The controller calls the service to update user details.
- The service validates and updates the database using Prisma.

### 4. Topic Module

- **Controller**: `topic.controller.ts`
  - Handles API requests for fetching, creating, and deleting topics.
- **Service**: `topic.service.ts`
  - Manages topic-related database operations, including validation and CRUD operations.

**Interaction**:

- The controller interacts with the service for topic management.
- The service ensures data integrity and interacts with the database.

### 5. Shared Utilities

- **Purpose**: Provide reusable functionalities across modules.
  - `chapterQueue`: Manages background tasks for chapter content generation.
  - `geminiAI`: Integrates with AI models for content generation.
  - `generateToken`, `setAuthCookie`, `clearAuthCookie`: Handle authentication and session management.
  - `checkUser`: Validates user existence in the database.

**Interaction**:

- Shared utilities are used by multiple services to perform specific tasks, such as AI integration, authentication, and background processing.

### 6. Middleware

- **Purpose**: Handle cross-cutting concerns like authentication and error handling.
  - `verifyToken`: Ensures API requests are authenticated.
  - `errorHandler`: Manages API error responses.

**Interaction**:

- Middleware is invoked in the request lifecycle to validate and process requests before reaching controllers.

# DevOps & Deployment Plan

## 1. Environment Setup

### Backend

- Use **Docker** to containerize the backend application.
- Deploy the backend on a **Virtual Machine (VM)**
- Use **PostgreSQL** as the database (as indicated in `.env.example`).
- Use **Redis** for caching or queueing.

### Frontend

- Deploy the frontend on **Vercel** for seamless CI/CD and hosting.

## 2. `.env` Template and Configuration Guidelines

- The `.env.example` file already provides a good template. Ensure the following:
  - Replace placeholders with actual values for production.

## 3. CI/CD Pipeline Overview

### Backend

- Build and test the backend application.
- Push the Docker image to a container registry.
- Deploy the Docker container to the VM.

### Frontend

- Automatically deploy to Vercel on every push to the `main` branch.

## GitHub Actions Configuration

### Backend CI/CD Workflow

```yaml
name: Deploy

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout the repo
        uses: actions/checkout@v4

      - name: Deploy to Server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          passphrase: ${{ secrets.SERVER_PASSPHRASE }}
          port: ${{ secrets.SERVER_PORT }}
          script: |
            cd mind-forge-be
            git pull
            sudo docker compose up -d --build
```
