# Onboardly

Helps you onboard new users to your product by providing a simple and customizable onboarding experience.

Architecture
![Architecture](./docs/architecture.jpg)

Api diagram
![Api diagram](./docs/api-diagram.jpg)

#### Pre-requisites

- Docker or you can setup kafka on your own
- Nodejs >= 22
- Postgres >= 15

#### How to setup

1. Clone the repo
2. Run `docker-compose up` to start the postgres DB server, or use your own.
3. Make sure `uuid-ossp` extension is enabled on the postgres DB. You can do this by running the following command in the postgres shell:

    ```sql
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    ```

4. Run `npm install` to install the dependencies
5. Configure the environment variables in `.env` file. You can copy the `.env.example` file to create your own `.env` file.

    - Make sure to set the `DB_CONNECTION_STRING` variable to point to your postgres DB server. For example:

    ```bash
    DB_CONNECTION_STRING=postgres://username:password@localhost:5432/onboardly

    ```

6. Run `db:migrate:run` to create the database tables
7. Run `npm run dev` to start the server

#### API Endpoints

If you go to `{host}/docs` you will see the swagger documentation for the API endpoints. If you expand the swagger UI you can see the data model for each API endpoint. You can also test the API endpoints from the swagger UI.
![API docs](./docs/swagger.jpg)

1. `/api/user/magic-link` - Send a magic link to the user, to reduce the scope of the work instead of sending to email I've logged it to the console.
2. Copy the magic link token from console and use `/api/user/login/:token` API to get an access token. This access token will be used to authenticate the user for all the other API calls.
3. Now you can set access token to swagger UI by clicking on the `Authorize` button and pasting the access token in the input field.
4. Now get a planId from subscription list API and then create user subscription with payment details at `/api/user/subscription/create`.
5. You can verify the user table in the database to see if the user is updated with payment details.

#### Technologies used

- For mocking the payment gateway I've used MSW to intercept third party API calls and return mock data. You can find the mock data in `src/mocks/handlers.ts` file.
- Used `zod` for data validation and parsing. Zod also helps to auto generate swagger docs for the API endpoints.
- Used pino for logging.
- Skipped monitoring and auditing for now for time boundary. But its possible to use tools like datadog for monitoring metrics and logs.
- Used `knex` for database migrations and queries.
