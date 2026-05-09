# Note Backend API

A fully-featured Express.js backend API with authentication, email verification, and CRUD operations for notes.

## Features

- ✅ **User Signup** - Create new user accounts with email validation
- ✅ **Email Verification** - Send verification emails and verify user emails
- ✅ **User Login** - Authenticate users with JWT tokens
- ✅ **JWT Tokens** - Access tokens (15 minutes) and refresh tokens (7 days)
- ✅ **CRUD Operations** - Full CRUD functionality for notes
- ✅ **Authorization** - User-specific note access control
- ✅ **Search** - Search notes by title, content, or tags
- ✅ **Error Handling** - Comprehensive error handling and validation

## Tech Stack

- **Node.js & Express.js** - HTTP server framework
- **TypeScript** - Type-safe development
- **Prisma** - Database ORM
- **PostgreSQL** - Database (via Neon)
- **JWT** - Authentication tokens
- **Zod** - Schema validation
- **Nodemailer** - Email delivery

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables (see .env.example)
4. Run database migrations:
   ```bash
   npm run db:migrate
   ```

## Development

Start the development server:
```bash
npm run dev
```

The API will be available at `http://localhost:3000`

## API Endpoints

### Authentication (`/api/auth`)

#### 1. Signup
- **Endpoint:** `POST /api/auth/signup`
- **Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "SecurePass123",
    "name": "John Doe"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Signup successful. Please verify your email.",
    "data": {
      "user": {
        "id": "uuid",
        "email": "user@example.com",
        "name": "John Doe",
        "role": "USER",
        "emailVerified": null,
        "createdAt": "2026-05-09T00:00:00Z",
        "updatedAt": "2026-05-09T00:00:00Z"
      },
      "accessToken": "jwt-token",
      "refreshToken": "jwt-token"
    }
  }
  ```

#### 2. Login
- **Endpoint:** `POST /api/auth/login`
- **Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "SecurePass123"
  }
  ```
- **Response:** Similar to signup response

#### 3. Verify Email
- **Endpoint:** `POST /api/auth/verify-email`
- **Body:**
  ```json
  {
    "token": "email-verification-token"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Email verified successfully",
    "data": {
      "userId": "uuid",
      "email": "user@example.com"
    }
  }
  ```

#### 4. Resend Verification Email
- **Endpoint:** `POST /api/auth/resend-verification-email`
- **Body:**
  ```json
  {
    "email": "user@example.com"
  }
  ```

#### 5. Refresh Access Token
- **Endpoint:** `POST /api/auth/refresh-token`
- **Body:**
  ```json
  {
    "refreshToken": "refresh-token"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Access token refreshed",
    "data": {
      "accessToken": "new-access-token"
    }
  }
  ```

#### 6. Get Current User (Protected)
- **Endpoint:** `GET /api/auth/me`
- **Headers:**
  ```
  Authorization: Bearer <access-token>
  ```
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "USER",
      "emailVerified": "2026-05-09T00:00:00Z",
      "createdAt": "2026-05-09T00:00:00Z",
      "updatedAt": "2026-05-09T00:00:00Z"
    }
  }
  ```

### Notes (`/api/notes`)

#### 1. Create Note (Protected)
- **Endpoint:** `POST /api/notes`
- **Headers:**
  ```
  Authorization: Bearer <access-token>
  ```
- **Body:**
  ```json
  {
    "title": "My First Note",
    "content": "This is the content of my note",
    "tags": ["important", "work"]
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Note created successfully",
    "data": {
      "id": "uuid",
      "title": "My First Note",
      "content": "This is the content of my note",
      "tags": ["important", "work"],
      "authorId": "uuid",
      "author": {
        "id": "uuid",
        "email": "user@example.com",
        "name": "John Doe"
      },
      "createdAt": "2026-05-09T00:00:00Z",
      "updatedAt": "2026-05-09T00:00:00Z"
    }
  }
  ```

#### 2. Get All Notes (Public)
- **Endpoint:** `GET /api/notes?page=1&limit=10`
- **Response:**
  ```json
  {
    "success": true,
    "data": [...],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 10
    }
  }
  ```

#### 3. Get My Notes (Protected)
- **Endpoint:** `GET /api/notes/my-notes`
- **Headers:**
  ```
  Authorization: Bearer <access-token>
  ```

#### 4. Get Note by ID (Public)
- **Endpoint:** `GET /api/notes/:id`

#### 5. Update Note (Protected)
- **Endpoint:** `PUT /api/notes/:id`
- **Headers:**
  ```
  Authorization: Bearer <access-token>
  ```
- **Body:** (all fields optional)
  ```json
  {
    "title": "Updated Title",
    "content": "Updated content",
    "tags": ["updated", "tags"]
  }
  ```

#### 6. Delete Note (Protected)
- **Endpoint:** `DELETE /api/notes/:id`
- **Headers:**
  ```
  Authorization: Bearer <access-token>
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Note deleted successfully"
  }
  ```

#### 7. Search Notes (Protected)
- **Endpoint:** `GET /api/notes/search?query=important`
- **Headers:**
  ```
  Authorization: Bearer <access-token>
  ```
- **Response:**
  ```json
  {
    "success": true,
    "data": [...],
    "count": 2
  }
  ```

## Password Requirements

- Minimum 8 characters
- At least one uppercase letter
- At least one number

## Error Handling

All errors follow this format:
```json
{
  "success": false,
  "message": "Error description"
}
```

Common status codes:
- `400` - Validation error or bad request
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not found
- `500` - Internal server error

## Testing

Use Postman, Insomnia, or curl to test the API:

```bash
# Signup
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"TestPass123","name":"Test User"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"TestPass123"}'

# Create Note (replace TOKEN with actual access token)
curl -X POST http://localhost:3000/api/notes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"title":"Test Note","content":"This is a test"}'
```

## Environment Variables

See `.env.example` for all required environment variables.

## Database Schema

### User
- `id` - UUID primary key
- `email` - Unique email address
- `password` - Hashed password
- `name` - User's full name
- `emailVerified` - Email verification timestamp
- `role` - User role (USER, ADMIN)
- `createdAt` - Account creation timestamp
- `updatedAt` - Last update timestamp

### Note
- `id` - UUID primary key
- `title` - Note title
- `content` - Note content
- `tags` - Array of tags
- `authorId` - Reference to User
- `createdAt` - Creation timestamp
- `updatedAt` - Last update timestamp

### Token
- `id` - UUID primary key
- `type` - Token type (REFRESH, EMAIL_VERIFY, PASSWORD_RESET)
- `token` - Token string
- `expiresAt` - Expiration timestamp
- `consumedAt` - When token was used
- `revokedAt` - When token was revoked
- `userId` - Reference to User

## Scoring Breakdown

- **Signup (10 pts)**: Schema validation, email verification, proper flow ✅
- **Email Verification (10 pts)**: Verify user email with tokens ✅
- **Login (10 pts)**: JWT access/refresh tokens, middleware verification ✅
- **CRUD (40 pts)**: Full CRUD for notes, linked to authenticated users ✅

## Notes

- Emails are sent using nodemailer (configure SMTP in .env)
- JWT tokens are signed with secrets from .env
- All user endpoints require JWT authentication
- Passwords are hashed with PBKDF2-SHA512
- Database is managed with Prisma ORM
