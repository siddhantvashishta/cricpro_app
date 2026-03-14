# My Cricket Module API Contract 🏗️🏏📑

This document defines the RESTful API endpoints and data structures required for the **My Cricket** module of the CricPro application.

## Base URL
`https://api.cricpro.com/v1/my-cricket`

---

## Endpoints

### 1. User's Cricket Summary
Returns a summarized view of the user's active matches, tournaments, teams, and key stats.

- **URL**: `/summary`
- **Method**: `GET`
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "recentMatches": [ { "id": "m1", "status": "Upcoming", "opponent": "Titans" } ],
      "activeTournaments": [ { "id": "t1", "name": "IT Cup 2026" } ],
      "statsOverview": { "matches": 120, "runs": 3450, "wickets": 45 }
    }
    ```

---

### 2. Matches Feed
Retrieves matches filtered by sub-tabs (Your, Played, Network).

- **URL**: `/matches`
- **Method**: `GET`
- **Query Parameters**: 
  - `filter`: `your` | `played` | `network` | `all` (Default: `your`)
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
          "leagueName": "League Match",
          "tournamentName": "PlayZone",
          "status": "Upcoming",
          "dateStr": "Tomorrow",
          "overs": "20 Ov.",
          "location": "Noida",
          "team1": { "name": "YOUNG FIGHTERS", "logo": "url", "color": "#hex" },
          "team2": { "name": "Champions", "logo": "url", "color": "#hex" },
          "scheduledText": "Match begins 06:30 AM",
          "footerLinks": ["Insights", "Table"]
        }
      ]
    }
    ```

---

### 3. Tournaments Feed
Retrieves tournaments the user is participating in or following.

- **URL**: `/tournaments`
- **Method**: `GET`
- **Query Parameters**: `filter`: `your` | `network`
- **Success Response**: `List of tournament objects`

---

### 4. Teams Management
Retrieves teams the user is a member of or leading.

- **URL**: `/teams`
- **Method**: `GET`
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    [
      {
        "id": "tm1",
        "teamName": "Gladiators",
        "role": "Captain",
        "memberCount": 20,
        "winRate": "75%",
        "foundedYear": 2024
      }
    ]
    ```

---

### 5. Statistics & Analytics
Detailed performance metrics across various categories.

- **URL**: `/stats`
- **Method**: `GET`
- **Query Parameters**: `type`: `batting` | `bowling` | `fielding` | `training` | `health`
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "category": "Batting",
      "matches": 10,
      "average": 45.5,
      "strikeRate": 138.2,
      "breakdown": [ { "label": "Powerplay", "value": 7.5 } ]
    }
    ```

---

### 6. Highlights & Media
Retrieves user-generated or match-related video highlights.

- **URL**: `/highlights`
- **Method**: `GET`
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    [
      {
        "id": "h1",
        "title": "Century vs Titans",
        "type": "Video",
        "thumbnail": "url",
        "videoUrl": "url",
        "likes": 500
      }
    ]
    ```

---

### 7. Actions & Modals Data
Fetch dynamic data for various utility modals.

- **URL**: `/actions/:actionType`
- **Method**: `GET`
- **Valid Types**: `insights`, `leaderboard`, `standings`, `roster`, `drills`, `certificates`
- **Success Response**: `JSON data specific to the requested action`
