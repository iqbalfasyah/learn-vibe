# Implement User Logout API

## Objective
Create an API endpoint that handles user logout by validating their session token and removing the corresponding session record from the database.

## API Specification

**Endpoint:** `POST /api/users/logout`

**Headers:**
- `Authorization: Bearer <token>` (The token is the session token stored in the `sessions` table).

**Request Body:**
(Empty)

**Response (Success - 200 OK):**
```json
{
    "data": "Ok"
}
```

**Response (Error - 401 Unauthorized):**
```json
{
    "error": "Unauthorized"
}
```

## Project Structure
We will be updating the existing files in the `src` directory:
- `src/routes/users-route.ts`: Contains Elysia.js routing logic.
- `src/services/users-service.ts`: Contains application business logic.

## Step-by-Step Implementation Guide

Please follow these detailed steps to implement the feature:

1.  **Update the Service Layer (`src/services/users-service.ts`)**:
    -   Open `src/services/users-service.ts`.
    -   Add a new function (e.g., `logoutUser`) that takes the `token` as a string argument.
    -   Inside this function:
        -   First, verify if the session exists in the `sessions` table using the provided `token`.
        -   If the session does not exist, throw an error or return a specific failure indicating "Unauthorized".
        -   If the session exists, execute a delete query on the `sessions` table where the `token` matches the provided token. This effectively logs the user out.
        -   Return a success payload: `{"data": "Ok"}`.

2.  **Update the Route Layer (`src/routes/users-route.ts`)**:
    -   Open `src/routes/users-route.ts`.
    -   Define a new `POST /logout` endpoint on the existing `usersRoute` Elysia instance (which is mounted on `/api/users`).
    -   Inside the endpoint handler:
        -   Extract the `Authorization` header from the request.
        -   Check if the header exists and starts with `Bearer `. If not, immediately return a 401 Unauthorized status with the `{"error": "Unauthorized"}` payload.
        -   Extract the raw token string by removing the `Bearer ` prefix.
        -   Call the service function (`logoutUser`) passing the extracted token.
        -   If the service function is successful, return the data `{"data": "Ok"}` with a 200 OK status.
        -   If the service function throws an error (e.g., token not found), catch it and return `{"error": "Unauthorized"}` with a 401 Unauthorized status.

3.  **Final Verification**:
    -   Start the application server (`bun dev`).
    -   Log in using the `/api/users/login` endpoint to obtain a valid session token.
    -   Send a `POST` request to `/api/users/logout` with the header `Authorization: Bearer <YOUR_TOKEN>`. Verify that the response is `{"data": "Ok"}`.
    -   Check your database's `sessions` table to confirm that the row corresponding to your token has been deleted.
    -   Send another request to `/api/users/logout` or `/api/users/current` with the same token. Verify that you receive an `{"error": "Unauthorized"}` response, confirming the token is no longer valid.
