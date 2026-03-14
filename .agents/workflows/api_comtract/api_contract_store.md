# Store Module API Contract 🏗️🛒📑

This document defines the RESTful API endpoints and data structures required for the **Store** (E-commerce) module of the CricPro application.

## Base URL
`https://api.cricpro.com/v1/store`

---

## Endpoints

### 1. Catalog Access
Retrieve products and categories for the storefront.

#### Get Categories
- **URL**: `/categories`
- **Method**: `GET`
- **Success Response**: `[ { "id": "bats", "name": "Cricket Bats", "icon": "url" } ]`

#### Get Products
- **URL**: `/products`
- **Method**: `GET`
- **Query Parameters**: `category`: `string`, `search`: `string`, `trending`: `boolean`
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "products": [
        {
          "id": "b1",
          "name": "SS Bat",
          "price": 45000,
          "originalPrice": 52000,
          "rating": 4.9,
          "image": "url",
          "discount": "15% OFF"
        }
      ]
    }
    ```

---

### 2. Product Details
- **URL**: `/products/:id`
- **Method**: `GET`
- **Success Response**:
    ```json
    {
      "id": "b1",
      "name": "...",
      "description": "...",
      "specifications": { "Willow": "Grade 1" },
      "variants": { "weights": ["2.8lb", "2.9lb"] }
    }
    ```

---

### 3. Shopping Cart
Manage items ready for purchase.

- **URL**: `/cart`
- **Methods**: `GET`, `POST`, `DELETE`, `PATCH`
- **POST Body**: `{ "productId": "string", "quantity": "number", "variant": "object" }`

---

### 4. Order Management
Placing and tracking orders.

#### Checkout / Place Order
- **URL**: `/orders`
- **Method**: `POST`
- **Body**: `{ "items": [], "addressId": "string", "paymentMethod": "string" }`

#### Order History
- **URL**: `/orders`
- **Method**: `GET`

#### Track Order
- **URL**: `/orders/:id/track`
- **Method**: `GET`

---

### 5. Shipping Address
- **URL**: `/addresses`
- **Methods**: `GET`, `POST`, `PUT`, `DELETE`
- **Structure**: `{ "name": "...", "street": "...", "city": "...", "phone": "..." }`
