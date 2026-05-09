# Quick Start Guide

## Files You Need to Configure

### 1. `.env` - Environment Variables
- **DATABASE_URL** - PostgreSQL connection string (already configured)
- **JWT_SECRET** - Random string for access tokens
- **JWT_REFRESH_SECRET** - Random string for refresh tokens
- **JWT_EMAIL_SECRET** - Random string for email verification
- **SMTP_USER** - Your email for sending verification emails
- **SMTP_PASSWORD** - Gmail app password (not your Gmail password!)
- **FRONTEND_URL** - Your frontend application URL

See `.env.example` for the format.

### 2. Database Setup
```bash
npm run db:generate    # Generate Prisma client
npm run db:migrate     # Run migrations
```

## Important Files

### Source Code
| File | Purpose |
|------|---------|
| [src/app.ts](src/app.ts) | Express app configuration |
| [src/server.ts](src/server.ts) | Server startup |
| [src/controllers/auth.controller.ts](src/controllers/auth.controller.ts) | Auth endpoints (signup, login, verify email) |
| [src/controllers/note.controller.ts](src/controllers/note.controller.ts) | Note endpoints (CRUD operations) |
| [src/services/auth.service.ts](src/services/auth.service.ts) | Auth business logic |
| [src/services/note.service.ts](src/services/note.service.ts) | Note business logic |
| [src/middlewares/auth.middleware.ts](src/middlewares/auth.middleware.ts) | JWT verification |
| [src/routes/auth.routes.ts](src/routes/auth.routes.ts) | Auth API routes |
| [src/routes/note.routes.ts](src/routes/note.routes.ts) | Note API routes |

### Documentation
| File | Purpose |
|------|---------|
| [README.md](README.md) | Complete API documentation |
| [SETUP.md](SETUP.md) | Setup and configuration guide |
| [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) | Implementation details and scoring |
| [postman_collection.json](postman_collection.json) | Postman API testing collection |

### Database
| File | Purpose |
|------|---------|
| [prisma/schema.prisma](prisma/schema.prisma) | Database schema (User, Note, Token) |
| [prisma/migrations/](prisma/migrations/) | Database migration files |
| [prisma.config.ts](prisma.config.ts) | Prisma configuration |

## Quick Commands

```bash
# Install dependencies
npm install

# Generate Prisma client types
npm run db:generate

# Run database migrations
npm run db:migrate

# Development server (with auto-reload)
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## API Endpoints Quick Reference

### Authentication
```
POST   /api/auth/signup              - Create new user account
POST   /api/auth/login               - Login user (returns tokens)
POST   /api/auth/verify-email        - Verify email with token
POST   /api/auth/resend-verification-email - Resend verification
POST   /api/auth/refresh-token       - Get new access token
GET    /api/auth/me                  - Get current user (protected)
```

### Notes (CRUD)
```
POST   /api/notes                    - Create note (protected)
GET    /api/notes                    - Get all notes (public)
GET    /api/notes/:id                - Get note by ID (public)
GET    /api/notes/my-notes           - Get user's notes (protected)
PUT    /api/notes/:id                - Update note (protected)
DELETE /api/notes/:id                - Delete note (protected)
GET    /api/notes/search             - Search notes (protected)
```

## Testing the API

### Using curl

1. **Signup**
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"TestPass123","name":"Test User"}'
```

2. **Login** (save the accessToken)
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"TestPass123"}'
```

3. **Create Note** (replace TOKEN with accessToken from login)
```bash
curl -X POST http://localhost:3000/api/notes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"title":"My Note","content":"Note content","tags":["tag1"]}'
```

### Using Postman
1. Import `postman_collection.json` into Postman
2. Update variables: `baseUrl`, `accessToken`, `refreshToken`
3. Use the collection to test endpoints

## Folder Structure

```
src/
├── controllers/         - HTTP request handlers
├── services/            - Business logic layer
├── repositories/        - Database access layer
├── routes/              - API route definitions
├── middlewares/         - Express middlewares (auth, error handling)
├── schema/              - Zod validation schemas
├── utils/               - Utility functions (password, JWT, email)
├── lib/                 - External library setup (Prisma)
├── app.ts               - Express app configuration
└── server.ts            - Server entry point

prisma/
├── schema.prisma        - Database models and schema
└── migrations/          - Database migration files
```

## Features Implemented

✅ **Signup** (10 pts)
- Email validation, password strength check
- Email verification with token
- User creation with JWT tokens

✅ **Email Verification** (10 pts)
- Send verification email on signup
- Verify email with token
- Resend verification email
- Token expiration (24 hours)

✅ **Login** (10 pts)
- Email and password validation
- Access Token (15 min expiry)
- Refresh Token (7 day expiry)
- JWT middleware for protected routes
- Token refresh endpoint

✅ **CRUD Operations** (40 pts)
- Create, Read, Update, Delete notes
- User authentication required
- Search and filter notes
- Proper authorization checks
- Full data validation

## Environment Variables

Required in `.env`:
```
DATABASE_URL=your-postgres-url
JWT_SECRET=random-secret-key
JWT_REFRESH_SECRET=another-random-key
JWT_EMAIL_SECRET=another-random-key
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
FRONTEND_URL=http://localhost:3000
PORT=3000
NODE_ENV=development
```

## Email Configuration (Gmail)

To enable email sending:
1. Enable 2-Factor Authentication on Gmail
2. Visit: https://myaccount.google.com/apppasswords
3. Select Mail + Windows Computer
4. Copy the 16-character password
5. Paste in `.env` as `SMTP_PASSWORD`

## Troubleshooting

**Database connection error?**
- Verify DATABASE_URL in .env
- Check if Neon database is active
- Run: `npm run db:generate`

**Email not sending?**
- Check SMTP credentials
- Verify you're using App Password (not Gmail password)
- Check spam folder

**TypeScript errors?**
- Run: `npm run db:generate`
- Delete dist folder and rebuild: `npm run build`

**Port already in use?**
- Change PORT in .env
- Or kill process on port 3000

## Next Steps

1. Set up environment variables in `.env`
2. Configure email (SMTP_USER and SMTP_PASSWORD)
3. Run database migrations: `npm run db:migrate`
4. Start dev server: `npm run dev`
5. Test endpoints with Postman collection
6. Check [README.md](README.md) for detailed API docs

## Support Files

- **README.md** - Full API documentation with examples
- **SETUP.md** - Detailed setup and configuration guide
- **IMPLEMENTATION_SUMMARY.md** - Implementation details and scoring breakdown
- **postman_collection.json** - Ready-to-use API test collection

---

Ready to start? Begin with [SETUP.md](SETUP.md) for detailed instructions!
