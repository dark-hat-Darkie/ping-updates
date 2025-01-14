# Welcome!

This is a repository for a node.js backend RESTful API that serves as a websocket as well for real-time communication to all connected clients!

# Setup Instructions

## 1. Clone this repository

and from the root directory of the project, run

```
npm install
```

This will install all the required dependencies for the project.

## 2. Environment Variables

This project expects 1 environment variables to be present, `DATABASE_URL`. This variable is the URL of any running instance of `PostgresSQL` database

```
DATABASE_URL="YOUR DATABASE URL"
```

## 3. Run Tests

This project runs tests powered by jest and supertest. To make sure the project setup is working, run tests and make sure all of them passes

```
npm run test
```

## 4. Linters & Formatters

This project uses `ESLINT` for critical and syntax error detection and `Prettier` for formatting. If you're using `VS Code` code editor, you can install the extensions to automatically format on changes

To lint, you can use the following command

```
npm lint
```

This will run both prettier and eslint for all the targeted files.

## 5. Run Project

To run project in development mode,

```
npm run dev
```

This will start the server with `nodemon` in watch mode, a utility process tool which automatically restarts our app whenever there is any change in our code.

## 6. Build Project

To build the project for deployment, run

```
npm run build
```

This will first run tests and if it `passes`, will output the transpiled javascript code into `/dist` directory.

## 7. Deployment

This project is deployed to Railway. The project contains a `Dockerfile` to encapsulate environment, which enables greater stability of the app both in development and production environments.

Also, this project uses `Github Action` as a CI tool to test, lint, build before proceeding to deployment in Railway. So if anything fails in CI pipeline, it won't trigger a deployment in the production environment.

Tip: For a smoother workflow in development, use `Docker Compose` and a local `postgres` image as the prisma migrate is really fast in local environment (Rather than a remote database)

```
npm start
```

# Architecture

This project runs express in node.js. The aim is to provide a RESTful API endpoint to fetch historical data and a websocket connection to maintain real time updates to all connected clients.

## Directory Structure

```

.github/
	workflows/
		main.yml                           -> CI pipeline that runs before deployment
coverage/                                  -> test coverage files
dist                                       -> output directory
prisma/
	schema.prisma                          -> prisma ORM schema file
src/
	__tests__/                             -> test directory
	middlewares/                           -> all the middlewares goes here
	modules/                               -> module based organisation of router, controller and service layers
		historial/
			historical.controller.ts       -> controller layer
			historical.routes.ts           -> router layer
			historical.service.ts          -> service layer
			req.types.ts                   -> Zod schema validation layer
	routes.v1.ts                           -> API Versioning layer
types/                                     -> type definitions
utils/                                     -> utility functions
app.ts                                     -> express app setup
server.ts                                  -> server setup and entry point

```

## Microservices Architecture with DDD

This backend highly encourage microservices architecture as it is containerized and can be easily orchestrated using docker-compose, swarm or kubernetes.

With event-driver-architechture, we can achieve a lot more bandwidth for large scale app - specially for the async events that rarely depends on one-another. Message brokers like SQS, SNS, Kafka can be used further to handle the events.

## Modular Approach

We're maintaining a modular approach for all the sub-domains or entities for our API. This helps us to keep the project manageable even when it grows significantly bigger.

Also, this api supports versioning, which is really important for long term when the need for a new version is needed. Using the app architecture, we can easily create versioned API endpoints for different kinds of responses.

## Global Error Handling

We've a global error handler that handles any global error and sends a 500 status response to the user. It can also detect other types of errors based on the class of the error.

## Functional Programming

The project uses functional programming paradigm which helps in testing the code more easily than object oriented programming.

# Choice of Technologies & Reasoning

## Node.js with Express

Node.js is a single threaded non-blocking IO runtime that helps execute asynchronous code very efficiently as it uses its event pool to distribute longer tasks and keeps the main thread going. For APIs where we need to response with some moderate database query tasks, Node.js is an excellent solution.

Express, is a fantastic tool and one of the most popular server for node.js. Mainly, express is used to build different kinds of APIs like REST or GraphQL, but it can also serve a dynamic and static server.

## PostgreSQL with Prisma ORM

We're using `PostgreSQL ` because

1. Our application has structured data
2. Postgres is extendable and highly customizable
3. Open source, no vendor lock!
4. Can be configured for read heavy operations, where the write heavy operations can be handle by cassandra, a noSQL database that excells at heavy writes.

We're using `Prisma` because,

1. Complex queries without writing `SQL` for hours!
2. Its more than a general ORM, allows some `SQL` and database level capabilities
3. Fast schema design, fairly complex ones in a few hours
4. Types are automatically generated, so it remains type safe - **No accidental errors**

## Socket.io as Real Time Websocket Library

We've used socket.io, for its easy setup and good integration with express, http sever. Besides basic capabilities, Socket.io can handle rooms and namespaces

## Zod - Schema Validator

You probably know, or may be love Zod. Its one of the best schema validation package for node.js, specially helpful validating RESTful API's request `body`, `query` and `params`.

We've used `Zod` to take the validations to the next level, ensuring top-notch, error-free data handling for the API.

## Typescript & ESLint

Typescript is used to be more specific about data types and be on the safe side. ESLINT is used as a linter to notify and throw errors if anything is off.

## Jest & SuperTest

We've used `Jest` for mock and assertions and `SuperTest` to mimic a real request to our express app.

## Docker & Containers

Enables it to run anywhere, with an isolated environment

# Assumption Made

1. The frontend/backend currently doesn't need paginations supports.
2. We'll be running on microservices architecture, more specifically event-driven-architecture.
3. Server instances will be handled in future or handled explicitly.

# Future Improvements

## 1. Monorepo

Set up a monorepo that makes it easy to develop multiple microservices together with shared libraries and dependencies, managed by package manager like `pnpm`

## 2. Logging with Winston

Currently we do not log errors to any 3rd party services but this can be a significant improvement. Logging to services like Winston can help us detect and resolve errors quickly

## 3. Event Driven Architechture with SSE / Kafka

For a huge number of throughput of events, we need to migrate the current implementation to integrate with kafka cluster.

## 4. Husky

Husky can be used with pre-commit hooks to ensure that our code passes tests and linted well before doing a commit.

## 5. Process Management with PM2 / node clusters

We can further optimize the performance by process managers like PM2 / node clusters

## 6. Code Coverage

We must use more tests cases and tests to cover more of our important code that runs the business logic.

## 7. Docker-Compose

We should use docker compose to run containers locally and manage them efficiently during development.

## 8. Security Layer

There is basically no security as this moment. But we can enable JWT / SAML authentication with proper session and token management to ensure a secure environment.

# Testing Strategy

TDD strategy was followed during the development.

Our express API has 4 layers:

1. Router Layer
2. Controller Layer
3. Service Layer
4. Data Layer

When a user sends a request to the API, it first goes through:

1. Middlewares
2. Zod Validations
3. Router > Controller > Service Layer > Data Layer

`Prisma` provides CRUD functions for the data layer automatically based on the schema provided.

## What is the most important Layer?

The most important layer is service layer, where all the business logic fits. Also, API request validation has a significant importance. So we'll be covering up these 2 things:

1. Service Layer Tests
2. API Request Validation & Endpoint Tests
