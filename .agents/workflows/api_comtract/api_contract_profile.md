# Profile & More Module API Contract 🏗️👤📑

This document defines the RESTful API endpoints and data structures required for the **Profile (More)** module of the CricPro application.

## Base URL
`https://api.cricpro.com/v1/profile`

---

## Endpoints

### 1. User Profile
Management of personal and professional cricketing profile.

#### Get Profile
- **URL**: `/me`
- **Method**: `GET`
- **Success Response**:
    ```json
    {
      "id": "u1",
      "name": "Siddhant V.",
      "email": "user@example.com",
      "role": "Pro Captain",
      "isProMember": true,
      "avatar": "url",
      "coins": 1250
    }
    ```

#### Update Profile
- **URL**: `/me`
- **Method**: `PATCH`
- **Body**: `{ "name": "...", "avatar": "url", "role": "..." }`

---

### 2. Platform Leaderboards
Retrieves top-performing players and teams across the network.

- **URL**: `/leaderboards`
- **Method**: `GET`
- **Query Parameters**: `type`: `player` | `team`, `category`: `batting` | `bowling` | `wins`
- **Success Response**:
    ```json
    [
      { "rank": 1, "name": "Virat K", "score": 8500, "avatar": "url" }
    ]
    ```

---

### 3. Associations & Clubs
Directory of affiliated cricketing bodies.

- **URL**: `/associations`
- **Method**: `GET`
- **Success Response**: `List of association objects`

- **URL**: `/clubs`
- **Method**: `GET`
- **Success Response**: `List of club objects`

---

### 4. Awards & Achievements
Digital trophies and recognition awarded to the user.

- **URL**: `/awards`
- **Method**: `GET`
- **Success Response**: `[ { "id": "aw1", "title": "Finisher of the Year", "icon": "medal", "date": "2025" } ]`

---

### 5. App Support & Feedback
- **URL**: `/contact`
- **Method**: `POST`
- **Body**: `{ "subject": "string", "message": "string" }`
