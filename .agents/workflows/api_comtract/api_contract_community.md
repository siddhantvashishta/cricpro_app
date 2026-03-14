# Community Module API Contract 🏗️👥📑

This document defines the RESTful API endpoints and data structures required for the **Community** (Social Feed & Directory) module of the CricPro application.

## Base URL
`https://api.cricpro.com/v1/community`

---

## Endpoints

### 1. Social Feed
Retrieves the global or category-specific social feed.

- **URL**: `/feed`
- **Method**: `GET`
- **Query Parameters**: 
  - `category`: `Scorers` | `Umpires` | `Commentators` | `Streamers` | `Organisers` | `Academies` | `Grounds` (Optional)
  - `page`: `number` (Default: 1)
  - `limit`: `number` (Default: 10)
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "posts": [
        {
          "id": "p1",
          "author": { "id": "u1", "name": "Virat K", "verified": true, "role": "Pro Player", "avatar": "url" },
          "content": "Match highlight content...",
          "image": "url",
          "tags": ["#Victory"],
          "likes": 1240,
          "commentsCount": 85,
          "timestamp": "2026-03-14T12:00:00Z"
        }
      ]
    }
    ```

---

### 2. Post Interactions
Handling likes and comments on posts.

#### Toggle Like
- **URL**: `/posts/:id/like`
- **Method**: `POST`
- **Success Response**: `{ "likesCount": 1241, "isLiked": true }`

#### Get Comments
- **URL**: `/posts/:id/comments`
- **Method**: `GET`

#### Add Comment
- **URL**: `/posts/:id/comments`
- **Method**: `POST`
- **Body**: `{ "content": "string" }`

---

### 3. Professional Directory
Access details for specialized cricket service providers.

- **URL**: `/directory`
- **Method**: `GET`
- **Query Parameters**: `type`: `Umpires` | `Scorers` etc.
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    [
      {
        "id": "prof1",
        "name": "Elite Umpires",
        "role": "ICC Panel",
        "rating": 4.9,
        "location": "Mumbai",
        "verified": true
      }
    ]
    ```

---

### 4. Create Community Post
- **URL**: `/posts`
- **Method**: `POST`
- **Body**: 
    ```json
    {
      "content": "string",
      "image": "url (Optional)",
      "tags": ["string"],
      "category": "string"
    }
    ```
- **Success Response**: `201 Created`
