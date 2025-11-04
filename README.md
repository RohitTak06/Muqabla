# Muqabla - Sports Management Platform

A comprehensive sports management web application built with Next.js, TypeScript, PostgreSQL, Prisma ORM, TailwindCSS, and ShadCN UI.

## 🏆 Features

- **Event Management**: Create and manage sports events, tournaments, and competitions
- **Team Organization**: Build teams, manage rosters, and track player statistics
- **Match Scheduling**: Schedule matches, assign referees, and track live scores
- **Live Scoring**: Real-time match updates and scorecard management
- **Standings & Leaderboards**: Automatic standings calculation and rankings
- **User Management**: Role-based access control (Admin, Organizer, Player, Referee)
- **Notifications**: Real-time notifications for events, matches, and registrations

## 🛠️ Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript
- **Styling**: TailwindCSS 4, ShadCN UI Components
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: bcryptjs for password hashing
- **Icons**: Lucide React

## 📋 Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (or use a cloud provider like Neon, Supabase, etc.)

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd rohit
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/muqabla"
```

Replace with your actual PostgreSQL connection string.

### 4. Run database migrations

```bash
npx prisma migrate dev
```

This will create all the necessary tables in your database.

### 5. (Optional) Seed the database

You can create a seed script to populate initial data like sports categories:

```bash
npx prisma db seed
```

### 6. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📁 Project Structure

```
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── app/
│   │   ├── api/               # API routes
│   │   │   ├── events/        # Event endpoints
│   │   │   ├── teams/         # Team endpoints
│   │   │   ├── matches/       # Match endpoints
│   │   │   ├── sports/        # Sports endpoints
│   │   │   └── users/         # User endpoints
│   │   ├── events/            # Events pages
│   │   ├── teams/             # Teams pages
│   │   ├── matches/           # Matches pages
│   │   ├── sports/            # Sports pages
│   │   ├── layout.js          # Root layout
│   │   └── page.js            # Homepage
│   ├── components/
│   │   ├── ui/                # ShadCN UI components
│   │   └── navigation.tsx     # Navigation component
│   └── lib/
│       ├── prisma.ts          # Prisma client
│       ├── auth.ts            # Authentication utilities
│       └── api-response.ts    # API response helpers
└── README.md
```

## 🗄️ Database Schema

The application includes the following main models:

- **User**: User accounts with role-based access
- **Sport**: Sports categories (Football, Basketball, Cricket, etc.)
- **Event**: Tournaments and competitions
- **Team**: Sports teams with members
- **Match**: Individual matches with scores
- **Registration**: Team registrations for events
- **Standing**: Leaderboard and rankings
- **Player**: Player profiles and statistics
- **Referee**: Referee management
- **Scorecard**: Live match updates
- **Notification**: User notifications

## 🔑 API Endpoints

### Sports
- `GET /api/sports` - Get all sports
- `POST /api/sports` - Create a sport
- `GET /api/sports/[id]` - Get sport details
- `PATCH /api/sports/[id]` - Update sport
- `DELETE /api/sports/[id]` - Delete sport

### Events
- `GET /api/events` - Get all events (with filters)
- `POST /api/events` - Create an event
- `GET /api/events/[id]` - Get event details
- `PATCH /api/events/[id]` - Update event
- `DELETE /api/events/[id]` - Delete event

### Teams
- `GET /api/teams` - Get all teams
- `POST /api/teams` - Create a team
- `GET /api/teams/[id]` - Get team details
- `PATCH /api/teams/[id]` - Update team
- `DELETE /api/teams/[id]` - Delete team

### Matches
- `GET /api/matches` - Get all matches
- `POST /api/matches` - Create a match
- `GET /api/matches/[id]` - Get match details
- `PATCH /api/matches/[id]` - Update match
- `DELETE /api/matches/[id]` - Delete match

### Users
- `GET /api/users` - Get all users
- `POST /api/users` - Create a user

## 🎨 Customization

### Adding New Sports

Use the Sports API or directly insert into the database:

```typescript
await prisma.sport.create({
  data: {
    name: "Football",
    description: "Association football",
    icon: "⚽"
  }
})
```

### User Roles

The system supports five user roles:
- `ADMIN`: Full system access
- `ORGANIZER`: Can create and manage events
- `PLAYER`: Can join teams and participate
- `REFEREE`: Can officiate matches
- `USER`: Basic access

## 🔐 Security Notes

- Passwords are hashed using bcryptjs
- API routes should be protected with authentication middleware (to be implemented)
- Sensitive environment variables should never be committed

## 📝 Future Enhancements

- [ ] Complete authentication system with JWT
- [ ] Real-time match updates using WebSockets
- [ ] Payment integration for entry fees
- [ ] Mobile app using React Native
- [ ] Advanced analytics and statistics
- [ ] Social features (comments, likes, sharing)
- [ ] Email notifications
- [ ] File upload for team logos and event banners

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Format code
npm run format
```

## 🐛 Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running
- Verify DATABASE_URL in `.env` is correct
- Check firewall settings

### Prisma Issues
```bash
# Reset database
npx prisma migrate reset

# Generate Prisma Client
npx prisma generate

# View database in Prisma Studio
npx prisma studio
```

## 📧 Support

For support, please open an issue in the GitHub repository.

---

Built with ❤️ using Next.js and Prisma
