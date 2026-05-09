# Setup Guide

## Quick Start

### 1. Environment Configuration

Update your `.env` file with the following (or use values from `.env.example`):

```env
# Database
DATABASE_URL="your-postgres-connection-string"

# JWT Secrets - Generate secure random strings
JWT_SECRET="generate-a-strong-secret-key"
JWT_REFRESH_SECRET="generate-another-strong-secret-key"
JWT_EMAIL_SECRET="generate-another-strong-secret-key"

# Email Configuration (Gmail Example)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-specific-password"  # NOT your Gmail password!

# Frontend
FRONTEND_URL="http://localhost:3000"

# Server
PORT="3000"
NODE_ENV="development"
```

### 2. Gmail Setup (for email sending)

To send emails from Gmail:

1. Enable 2-Factor Authentication on your Google Account
2. Create an App Password:
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and "Windows Computer"
   - Copy the generated 16-character password
   - Use this password as `SMTP_PASSWORD` in `.env`

### 3. Database Setup

With Neon PostgreSQL (already configured):

```bash
# Run migrations
npm run db:migrate

# Generate Prisma client
npm run db:generate
```

### 4. Development Server

Start the development server:

```bash
npm run dev
```

The API will be available at `http://localhost:3000`

Check health: `http://localhost:3000/health`

### 5. Build for Production

```bash
npm run build
npm start
```

## API Implementation Details

### Signup (10 pts)
✅ **Implemented:**
- Schema validation with Zod (email, password strength, name)
- Password hashing with PBKDF2-SHA512
- User creation in database
- Automatic JWT token generation
- Email verification token creation
- Verification email sent via nodemailer
- Returns user data + accessToken + refreshToken

### Email Verification (10 pts)
✅ **Implemented:**
- Verification email sent on signup
- Email verification endpoint with token validation
- Token expiration (24 hours)
- JWT token verification
- Database token tracking (consumed/revoked)
- Resend verification email functionality
- Email marked as verified in user record

### Login (10 pts)
✅ **Implemented:**
- Email/password validation
- Password comparison with PBKDF2
- Access token generation (15-minute expiry)
- Refresh token generation (7-day expiry)
- Refresh token stored in database
- JWT middleware for protected routes
- Token refresh endpoint for getting new access tokens
- Get current user endpoint

### CRUD Operations (40 pts)
✅ **Implemented:**
- **Create**: POST /api/notes - Create note with title, content, tags
- **Read**: GET /api/notes - Get all notes (paginated)
- **Read**: GET /api/notes/:id - Get single note
- **Read**: GET /api/notes/my-notes - Get user's notes
- **Update**: PUT /api/notes/:id - Update note fields
- **Delete**: DELETE /api/notes/:id - Delete note
- **Search**: GET /api/notes/search - Search notes by query
- **Authorization**: All user endpoints check that notes belong to the authenticated user
- **User Relationship**: Notes are linked to User via authorId
- **Validation**: All inputs validated with Zod schemas

## Project Structure

```
src/
├── controllers/      # HTTP request handlers
│   ├── auth.controller.ts
│   └── note.controller.ts
├── services/         # Business logic
│   ├── auth.service.ts
│   └── note.service.ts
├── repositories/     # Database access layer
│   ├── user.repository.ts
│   ├── token.repository.ts
│   └── note.repository.ts
├── routes/           # API route definitions
│   ├── auth.routes.ts
│   ├── note.routes.ts
│   └── index.ts
├── middlewares/      # Express middlewares
│   ├── auth.middleware.ts
│   ├── error.middleware.ts
│   └── logger.middleware.ts
├── schema/           # Zod validation schemas
│   └── validation.ts
├── utils/            # Utility functions
│   ├── password.ts
│   ├── jwt.ts
│   ├── email.ts
│   ├── random.ts
│   └── index.ts
├── lib/              # External library integrations
│   └── prisma.ts
├── app.ts            # Express app setup
└── server.ts         # Server entry point
```

## Database Schema

### Models
- **User** - User accounts with email verification
- **Token** - Refresh, email verification, and password reset tokens
- **Note** - User notes with tags and relationships
- **KnowledgeBase** - AI knowledge base (for future features)

## Authentication Flow

### Signup
```
POST /api/auth/signup
→ Validate input
→ Hash password
→ Create user
→ Generate JWT tokens
→ Create email verification token
→ Send verification email
→ Return user + tokens
```

### Login
```
POST /api/auth/login
→ Validate email/password
→ Compare hashed password
→ Generate JWT tokens
→ Store refresh token
→ Return user + tokens
```

### Protected Requests
```
GET /api/notes/my-notes
+ Header: Authorization: Bearer <accessToken>
→ Verify JWT token
→ Extract userId
→ Get user's notes
→ Return notes
```

### Token Refresh
```
POST /api/auth/refresh-token
+ Body: { refreshToken }
→ Validate refresh token
→ Check token in database (not expired/revoked)
→ Generate new access token
→ Return new access token
```

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "message": "Error description"
}
```

Common HTTP Status Codes:
- `400` - Validation error (bad input)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not found
- `500` - Server error

## Testing

### Using curl

```bash
# Signup
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123",
    "name": "Test User"
  }'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123"
  }'

# Create Note (with token)
curl -X POST http://localhost:3000/api/notes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "title": "My Note",
    "content": "Note content",
    "tags": ["tag1", "tag2"]
  }'
```

### Using Postman

Import `postman_collection.json` into Postman:
1. Open Postman
2. Click "Import"
3. Select the `postman_collection.json` file
4. Use the collection to test endpoints
5. Save tokens in Postman variables

## Troubleshooting

### Database Connection Error
- Verify DATABASE_URL is correct
- Check if Neon database is active (not suspended)
- Test connection: `npx prisma db push`

### Email Not Sending
- Verify SMTP credentials in .env
- For Gmail, make sure to use App Password (not your Gmail password)
- Check spam folder
- Enable "Less secure apps" if not using App Password

### JWT Token Errors
- Ensure JWT_SECRET, JWT_REFRESH_SECRET, JWT_EMAIL_SECRET are set
- Check token expiration times
- Verify token format (Bearer TOKEN)

### TypeScript Errors
- Run `npm run db:generate` to update Prisma types
- Ensure all imports use `@/` alias (configured in tsconfig.json)

## Next Steps

1. **Configure Email**: Set up SMTP credentials for email sending
2. **Test Authentication**: Use Postman collection to test signup/login
3. **Create Notes**: Test CRUD operations with authenticated requests
4. **Frontend Integration**: Integrate with frontend at http://localhost:3000
5. **Deploy**: Configure production environment and deploy

## Production Considerations

Before deploying:
- [ ] Update JWT_SECRET to strong random values
- [ ] Configure proper SMTP (not test account)
- [ ] Set NODE_ENV=production
- [ ] Enable HTTPS/SSL
- [ ] Set up environment-specific .env files
- [ ] Configure CORS for production domain
- [ ] Set up logging and monitoring
- [ ] Run database migrations on production
- [ ] Set up backup strategy for database

## Support

For issues or questions:
1. Check the README.md for API documentation
2. Review error messages and status codes
3. Check database migrations in prisma/migrations/
4. Verify environment variables are set correctly
