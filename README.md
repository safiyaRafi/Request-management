# Request Management Application

A full-stack application for managing employee requests with manager approval workflows.

## Features

- **Authentication**: JWT-based auth with Role-based access (Employee, Manager).
- **Request Management**:
  - Employees can create requests and assign them to other employees.
  - Managers can approve or reject requests assigned to their subordinates.
  - Assignees can only action/close requests after manager approval.
- **Tech Stack**:
  - **Backend**: Node.js, Express, TypeScript, PostgreSQL, Prisma.
  - **Frontend**: React, Vite, TailwindCSS, React Router, React Hook Form.

## Setup

### Prerequisites
- Node.js
- PostgreSQL

### Backend
1. Navigate to `backend` directory.
2. Install dependencies: `npm install`.
3. Create `.env` file (see `.env.example` or use default).
4. Run migrations: `npx prisma migrate dev`.
5. Start server: `npm run dev`.

### Frontend
1. Navigate to `client` directory.
2. Install dependencies: `npm install`.
3. Start dev server: `npm run dev`.

## Usage Flow
1. Register a **Manager**.
2. Register an **Employee** (select the Manager).
3. Login as Employee, create a request assigned to another Employee.
4. Login as Manager, approve the request.
5. Login as Assignee, close the request.
