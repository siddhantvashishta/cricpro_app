# Live Scoring Engine API Contract 🏗️🏏📊

This document defines the API endpoints and real-time event structures for the **Live Scoring** system, match state synchronization, and historical archival.

## Base URL
- **REST**: `https://api.cricpro.com/v1/scoring`
- **WS**: `wss://api.cricpro.com/v1/scoring/live`

---

## Endpoints

### 1. Match Initialization
- **URL**: `/matches/:id/start`
- **Method**: `POST`
- **Body**: `{ "tossWinner": "string", "decision": "bat|bowl", "squadA": [], "squadB": [] }`

---

### 2. Score Updates (The "Scorer" API)
Used by the match official/scorer to push ball-by-ball updates.

- **URL**: `/matches/:id/update`
- **Method**: `POST`
- **Body**:
    ```json
    {
      "ball": {
        "bowlerId": "string",
        "batterId": "string",
        "runs": 0,
        "isExtra": false,
        "extraType": "wd|nb|lb|b",
        "isWicket": false,
        "wicketType": "bowled|caught|lbw|run-out",
        "commentary": "string"
      }
    }
    ```

---

### 3. Live State Fetch
- **URL**: `/matches/:id/live`
- **Method**: `GET`
- **Success Response**:
    ```json
    {
      "score": "145/3",
      "overs": "18.4",
      "crr": 7.8,
      "batter1": { "name": "...", "runs": 45, "balls": 30 },
      "batter2": { "name": "...", "runs": 12, "balls": 8 },
      "bowler": { "name": "...", "overs": 3.4, "runs": 22, "wickets": 2 },
      "recentBalls": [4, 1, "W", 0, 6, "1wd"]
    }
    ```

---

### 4. Match Archival (Post-Match)
- **URL**: `/matches/:id/finalize`
- **Method**: `POST`
- **Body**: `{ "outcome": "Team A won by 15 runs", "pom": "playerId" }`

---

## WebSocket Events (Live Feed)
- `ball_update`: Real-time notification for every ball delivered.
- `over_summary`: Detailed stats update at the end of each over.
- `match_alert`: Critical updates like wickets, centuries, or match conclusion.
