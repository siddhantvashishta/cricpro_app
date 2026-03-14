# Global Search & Discovery API Contract 🏗️🔍📖

This document defines the unified search endpoint for discovering entities across the CricPro ecosystem.

## Base URL
`https://api.cricpro.com/v1/search`

---

## Endpoints

### 1. Unified Search
Search across players, teams, products, and posts in a single request.

- **URL**: `/`
- **Method**: `GET`
- **Query Parameters**: 
  - `q`: Search query string
  - `type`: `all` | `player` | `team` | `product` | `post` (Default: `all`)
  - `page`: Pagination page number
- **Success Response**:
    ```json
    {
      "players": [ { "id": "u1", "name": "...", "role": "..." } ],
      "teams": [ { "id": "t1", "name": "...", "location": "..." } ],
      "products": [ { "id": "p1", "name": "...", "price": 0 } ],
      "posts": [ { "id": "post1", "excerpt": "...", "author": "..." } ]
    }
    ```

---

### 2. Location-Based Discovery
Find matches or recruitment posts near the user.

- **URL**: `/nearby`
- **Method**: `GET`
- **Query Parameters**: `lat`, `lng`, `radius`, `entityType`: `match|listing|ground`
- **Success Response**: `List of entities with distance information`

---

### 3. Trending & Suggestions
- **URL**: `/suggestions`
- **Method**: `GET`
- **Success Response**: `{ "trendingTags": ["#IPL", "#T20"], "popularPlayers": [] }`
