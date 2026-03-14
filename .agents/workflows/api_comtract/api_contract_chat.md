# Chat & Messaging API Contract 🏗️💬📑

This document defines the RESTful and Real-Time (WebSocket) API design for the **Chat & Messaging** system in the CricPro application.

## Base URL
- **REST**: `https://api.cricpro.com/v1/chat`
- **WS**: `wss://api.cricpro.com/v1/realtime`

---

## REST Endpoints

### 1. Conversations
- **URL**: `/conversations`
- **Method**: `GET`
- **Success Response**:
    ```json
    [
      {
        "id": "conv1",
        "lastMessage": { "text": "Match on Sunday?", "time": "2026-03-14T10:00:00Z" },
        "recipient": { "id": "u2", "name": "Aryan S.", "avatar": "url" },
        "unreadCount": 2
      }
    ]
    ```

---

### 2. Message History
- **URL**: `/conversations/:id/messages`
- **Method**: `GET`
- **Query Parameters**: `limit`, `before` (for pagination)
- **Success Response**: `List of message objects`

---

### 3. Connection Requests
Handling "Hire", "Challenge", or "Apply" initiations from the Looking section.

#### Send Request
- **URL**: `/requests`
- **Method**: `POST`
- **Body**: `{ "targetId": "string", "targetType": "player|team|match", "initialMessage": "string" }`

#### Manage Requests
- **URL**: `/requests/:id/:action`
- **Method**: `POST`
- **Valid Actions**: `accept`, `decline`, `cancel`

---

## WebSocket Events (Real-Time)

### Outgoing (Client to Server)
- `send_message`: `{ "conversationId": "string", "text": "string" }`
- `typing_start`: `{ "conversationId": "string" }`

### Incoming (Server to Client)
- `new_message`: `{ "id": "msg1", "conversationId": "string", "text": "...", "senderId": "..." }`
- `request_update`: `{ "requestId": "...", "status": "accepted" }`
- `online_status`: `{ "userId": "...", "status": "online" }`
