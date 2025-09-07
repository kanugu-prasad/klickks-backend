# Klickks Project Backend

This is a Node.js backend for user authentication using Express, SQLite, JWT, and bcrypt.

## Features

- User registration and login
- Password hashing with bcrypt
- JWT-based authentication (stored in HTTP-only cookies)
- Protected dashboard route
- User logout
- SQLite database for user storage

## Project Structure

```
.env
db.js
package.json
server.js
users.db
routes/
  auth.js
```

## Setup

1. **Install dependencies:**
   ```sh
   npm install
   ```

2. **Configure environment variables:**

   Edit `.env`:
   ```
   SECRET_KEY=your_jwt_secret
   PORT=5000
   ```

3. **Start the server:**
   ```sh
   npm run dev
   ```
   or
   ```sh
   npm start
   ```

## API Endpoints

- `POST /api/register`  
  Register a new user.  
  **Body:** `{ name, email, password, confirmPassword }`

- `POST /api/login`  
  Login and receive a JWT cookie.  
  **Body:** `{ email, password }`

- `GET /api/dashboard`  
  Protected route. Requires valid JWT cookie.

- `POST /api/logout`  
  Logout and clear JWT cookie.

## Database

- SQLite database file: `users.db`
- Table: `users (id, name, email, password)`

## Notes

- The backend expects requests from `http://localhost:3000` (see CORS settings).
- JWT tokens are stored in HTTP-only cookies for security.
- Passwords are hashed using bcrypt before storage.

---

**Author:**  
See [package.json](package.json)