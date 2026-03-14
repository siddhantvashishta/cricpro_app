# Notification System API Contract 🏗️🔔📑

This document defines the API endpoints for managing push notifications, user activity alerts, and notification preferences.

## Base URL
`https://api.cricpro.com/v1/notifications`

---

## Endpoints

### 1. Notification Feed
Retrieve recent alerts (match starts, new messages, recruitment hits).

- **URL**: `/`
- **Method**: `GET`
- **Success Response**:
    ```json
    [
      {
        "id": "notif1",
        "type": "MATCH_START",
        "title": "Match Beginning",
        "body": "Your match against Titans starts in 30 mins.",
        "data": { "matchId": "m1" },
        "isRead": false,
        "createdAt": "2026-03-14T06:00:00Z"
      }
    ]
    ```

---

### 2. Mark as Read
- **URL**: `/read`
- **Method**: `POST`
- **Body**: `{ "notificationIds": ["string"] }` // Pass empty for "Mark all as read"

---

### 3. Push Token Registration
Linking physical devices to the user account for FCM/APNs.

- **URL**: `/tokens`
- **Method**: `POST`
- **Body**: `{ "token": "device_push_token", "platform": "android|ios", "deviceId": "unique_id" }`

---

### 4. Notification Settings
Fine-grained control over what alerts the user receives.

- **URL**: `/settings`
- **Methods**: `GET`, `PATCH`
- **Settings Object**:
    ```json
    {
      "muteAll": false,
      "matches": true,
      "chat": true,
      "recruitment": true,
      "promotions": false
    }
    ```
