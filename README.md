# MindForge Backend Service Repository

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
