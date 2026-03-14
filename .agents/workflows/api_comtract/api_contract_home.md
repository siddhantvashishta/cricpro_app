# Home Module API Contract 🏗️🌐📑

This document defines the RESTful API endpoints and data structures required for the **Home** module of the CricPro application.

## Base URL
`https://api.cricpro.com/v1/home`

---

## Endpoints

### 1. Unified Home Dashboard
Returns a consolidated view of top players, previews for Looking, Store, and Community sections, and active banners.

- **URL**: `/dashboard`
- **Method**: `GET`
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "banners": [
        { "id": "b1", "image": "url", "action": "deep-link" }
      ],
      "topPlayers": [
        { "id": "p1", "name": "Roman Saini", "isPro": true, "runs": 1240, "wickets": 45, "avatar": "url" }
      ],
      "lookingPreview": [
        { "id": "l1", "type": "Opponent", "teamName": "Warriors", "description": "...", "date": "..." }
      ],
      "storePreview": [
        { "id": "s1", "name": "SS Bat", "price": 12499, "image": "url" }
      ]
    }
    ```

---

### 2. Match Feed
Retrieves matches filtered by status (Live, Upcoming, Finished).

- **URL**: `/matches`
- **Method**: `GET`
- **Query Parameters**: 
  - `status`: `live` | `upcoming` | `finished` (Optional)
  - `page`: `number` (Default: 1)
  - `limit`: `number` (Default: 10)
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "matches": [
        {
          "id": "m1",
          "status": "live",
          "teamA": { "name": "Meteors", "score": "145/2", "overs": "15.4" },
          "teamB": { "name": "Strikers", "score": "...", "overs": "..." },
          "location": "Sydney",
          "venue": "Greenfield Stadium",
          "time": "Today, 2:00 PM",
          "series": "Sydney Premier League"
        }
      ],
      "pagination": { "total": 100, "page": 1, "limit": 10 }
    }
    ```

---

### 3. Polls System
Provides active polls and handling for user participation.

- **URL**: `/polls`
- **Method**: `GET`
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    [
      {
        "id": "poll1",
        "question": "Who will win the toss?",
        "options": [
          { "id": "opt1", "label": "India", "voteCount": 8000, "percentage": 65 },
          { "id": "opt2", "label": "Australia", "voteCount": 4450, "percentage": 35 }
        ],
        "totalVotes": 12450,
        "hasVoted": false
      }
    ]
    ```

#### Vote on a Poll
- **URL**: `/polls/:id/vote`
- **Method**: `POST`
- **Body**: `{ "optionId": "string" }`
- **Success Response**: `200 OK`

---

### 4. News & Highlights
Full feed of cricketing news and match highlights.

- **URL**: `/news`
- **Method**: `GET`
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "news": [
        {
          "id": "n1",
          "title": "World Cup 2026 Begins!",
          "summary": "...",
          "image": "url",
          "category": "International",
          "timestamp": "2026-03-14T12:00:00Z"
        }
      ]
    }
    ```

---

### 5. Fantasy Tips
Expert advice and analytics for fantasy gaming.

- **URL**: `/fantasy-tips`
- **Method**: `GET`
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    [
      {
        "id": "t1",
        "matchId": "m1",
        "title": "Top Picks for Meteors vs Strikers",
        "tips": ["Pick Roman Saini as Captain", "Opt for spinners on this pitch"],
        "players": [
          { "id": "p1", "name": "Roman Saini", "selectionRate": 85.5 }
        ]
      }
    ]
    ```
