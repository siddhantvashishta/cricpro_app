# Auth Module API Contract 🏗️🔐📑

This document defines the RESTful API endpoints and data structures required for **Authentication & Authorization** within the CricPro application.

## Base URL
`https://api.cricpro.com/v1/auth`

---

## Endpoints

### 1. Login
Authenticates a user and returns a session token.

- **URL**: `/login`
- **Method**: `POST`
- **Body**: `{ "email": "string", "password": "string" }`
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "token": "jwt_access_token",
      "refreshToken": "jwt_refresh_token",
      "user": { "id": "u1", "name": "Siddhant V.", "email": "..." }
    }
    ```

---

### 2. Registration
Creates a new user account on the platform.

- **URL**: `/register`
- **Method**: `POST`
- **Body**: 
    ```json
    {
      "name": "string",
      "email": "string",
      "password": "string",
      "role": "string (Optional)"
    }
    ```
- **Success Response**: `201 Created`

---

### 3. Token Management
Handles session maintenance and security.

#### Refresh Token
- **URL**: `/refresh`
- **Method**: `POST`
- **Body**: `{ "refreshToken": "string" }`

#### Logout
- **URL**: `/logout`
- **Method**: `POST`
- **Success Response**: `204 No Content`

---

### 4. Password Recovery
- **URL**: `/forgot-password`
- **Method**: `POST`
- **Body**: `{ "email": "string" }`

- **URL**: `/reset-password`
- **Method**: `POST`
- **Body**: `{ "token": "string", "newPassword": "string" }`

---

### 5. Identity Verification (Pro)
Endpoints for submitting verification documents for "Pro" status.

- **URL**: `/verify-identity`
- **Method**: `POST`
- **Body**: `{ "documentType": "string", "documentUrl": "url" }`
