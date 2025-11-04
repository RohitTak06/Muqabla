# Muqabla - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Set Up Database
Create a `.env` file in the root directory:
```env
DATABASE_URL="your_postgresql_connection_string"
```

**Example for local PostgreSQL:**
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/muqabla"
```

**Example for Neon (cloud):**
```env
DATABASE_URL="postgresql://user:password@ep-xxx.us-east-1.aws.neon.tech/neondb"
```

### Step 3: Run Migrations
```bash
npm run db:migrate
```

### Step 4: Seed Initial Data
```bash
npm run db:seed
```

This will create:
- 8 popular sports (Football, Basketball, Cricket, etc.)
- Admin user: `admin@muqabla.com` / `admin123`
- Organizer user: `organizer@muqabla.com` / `organizer123`

### Step 5: Start Development Server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 📋 What's Included

### Pages
- **Home** (`/`) - Landing page with features
- **Events** (`/events`) - Browse and create tournaments
- **Teams** (`/teams`) - Manage teams and rosters
- **Matches** (`/matches`) - View live and scheduled matches
- **Sports** (`/sports`) - Browse sports categories

### API Endpoints
All endpoints are available at `/api/*`:
- `/api/sports` - Sports CRUD
- `/api/events` - Events CRUD
- `/api/teams` - Teams CRUD
- `/api/matches` - Matches CRUD
- `/api/users` - User management

## 🎯 Next Steps

### 1. Create Your First Sport (via API)
```bash
curl -X POST http://localhost:3000/api/sports \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Swimming",
    "description": "Aquatic sport",
    "icon": "🏊"
  }'
```

### 2. Create a Team
```bash
curl -X POST http://localhost:3000/api/teams \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Thunder Strikers",
    "sportId": "your_sport_id",
    "description": "Championship team"
  }'
```

### 3. Create an Event
```bash
curl -X POST http://localhost:3000/api/events \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Summer Championship 2024",
    "sportId": "your_sport_id",
    "organizerId": "your_user_id",
    "venue": "City Stadium",
    "startDate": "2024-06-01T10:00:00Z",
    "endDate": "2024-06-15T18:00:00Z",
    "registrationDeadline": "2024-05-25T23:59:59Z",
    "maxTeams": 16,
    "entryFee": 100
  }'
```

## 🛠️ Useful Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Start production server

# Database
npm run db:migrate       # Run migrations
npm run db:seed          # Seed database
npm run db:studio        # Open Prisma Studio (GUI)
npm run db:reset         # Reset database

# Code Quality
npm run lint             # Run linter
npm run format           # Format code
```

## 🗄️ Database Management

### View Database with Prisma Studio
```bash
npm run db:studio
```
Opens a GUI at [http://localhost:5555](http://localhost:5555)

### Reset Database (⚠️ Deletes all data)
```bash
npm run db:reset
```

## 📊 Sample Data Structure

### Event Status Flow
```
UPCOMING → REGISTRATION_OPEN → REGISTRATION_CLOSED → ONGOING → COMPLETED
```

### Match Status Flow
```
SCHEDULED → LIVE → COMPLETED
```

### User Roles
- **ADMIN** - Full system access
- **ORGANIZER** - Create/manage events
- **PLAYER** - Join teams, participate
- **REFEREE** - Officiate matches
- **USER** - Basic access

## 🔧 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000 (Windows)
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or use a different port
PORT=3001 npm run dev
```

### Database Connection Error
1. Verify PostgreSQL is running
2. Check DATABASE_URL in `.env`
3. Test connection: `npx prisma db pull`

### Prisma Client Not Generated
```bash
npx prisma generate
```

## 📱 Testing the Application

### 1. Browse Sports
Visit `/sports` to see all available sports

### 2. Create an Event
- Go to `/events`
- Click "Create Event"
- Fill in the form

### 3. Register Teams
- Create teams via `/teams`
- Register them for events

### 4. Schedule Matches
- Use the API to create matches
- View them at `/matches`

## 🎨 Customization

### Add Custom Sports
Edit `prisma/seed.ts` and add your sports:
```typescript
{ name: 'Rugby', description: 'Contact team sport', icon: '🏉' }
```

### Modify UI Theme
Edit `src/app/globals.css` for custom colors

### Add New Pages
Create files in `src/app/[page-name]/page.tsx`

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [ShadCN UI Components](https://ui.shadcn.com)

## 🆘 Need Help?

- Check the main [README.md](./README.md)
- Review API responses for error messages
- Use Prisma Studio to inspect database
- Check browser console for frontend errors

---

Happy coding! 🎉
