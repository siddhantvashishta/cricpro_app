# Looking Module API Contract 🏗️🕵️‍♂️📑

This document defines the RESTful API endpoints and data structures required for the **Looking** (Recruitment & Matchmaking) module of the CricPro application.

## Base URL
`https://api.cricpro.com/v1/looking`

---

## Endpoints

### 1. Unified Listings Feed
Retrieves all "Looking For" posts with filtering capabilities.

- **URL**: `/listings`
- **Method**: `GET`
- **Query Parameters**: 
  - `type`: `Opponent` | `Recruitment` | `Player` (Optional)
  - `ground`: `string` (Optional)
  - `distance`: `number` (Optional, in KM)
  - `page`: `number` (Default: 1)
  - `limit`: `number` (Default: 10)
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "listings": [
        {
          "id": "opp1",
          "type": "Opponent",
          "authorId": "user123",
          "teamName": "Warriors XI",
          "description": "Friendly T20 match invitation",
          "date": "2026-03-20T10:00:00Z",
          "ground": "HSR Ground",
          "location": { "lat": 12.91, "lng": 77.64 },
          "distance": "2 KM",
          "requirementText": "Need 11 players",
          "timestamp": "2026-03-14T08:00:00Z"
        }
      ],
      "pagination": { "total": 50, "page": 1, "limit": 10 }
    }
    ```

---

### 2. Create Listing
Allows users to post a new request (Opponent, Recruitment, or Player).

- **URL**: `/listings`
- **Method**: `POST`
- **Body**: 
    ```json
    {
      "type": "Opponent" | "Recruitment" | "Player",
      "teamName": "string",
      "description": "string",
      "ground": "string",
      "date": "string (ISO)",
      "requirementText": "string (Optional)"
    }
    ```
- **Success Response**:
  - **Code**: 201 Created
  - **Content**: `{ "id": "new_listing_id", "status": "success" }`

---

### 3. Manage Own Listings
Endpoints for users to handle their active recruitment or match requests.

#### My Active Posts
- **URL**: `/my-listings`
- **Method**: `GET`
- **Success Response**: `List of listing objects created by the authenticated user`

#### Delete Listing
- **URL**: `/listings/:id`
- **Method**: `DELETE`
- **Success Response**: `204 No Content`

---

### 4. Direct Connect / Hire Action
While actual communication happens via DMs, this endpoint can be used to track engagement or initiate the hiring process on the backend.

- **URL**: `/listings/:id/connect`
- **Method**: `POST`
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "chatThreadId": "chat_456",
      "message": "Connection initiated successfully"
    }
    ```

---

### 5. Filters Data
Returns available ground names and types for the filter modal.

- **URL**: `/filters`
- **Method**: `GET`
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "grounds": ["HSR Ground", "Central Park", "Kanteerava Stadium"],
      "types": ["Opponent", "Recruitment", "Player"]
    }
    ```
