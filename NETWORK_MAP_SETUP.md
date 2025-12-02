# Network Map - Social Relations Tracker

A simple, collaborative social network mapper where you and your friends can build a map of all the people you know.

## Features ✨

- **Add People** - Register people with basic info (name, age, religion, location, occupation)
- **Track Connections** - Link people with relationship types (family, friend, colleague, etc.)
- **Auto-calculated Connection Strength** - Based on relationship type + years known
- **Mobile-First Design** - Responsive interface optimized for mobile
- **Collaborative** - Anyone can add or edit any information
- **Search** - Find people by name, occupation, or location
- **Stats Dashboard** - Total people, connections, and recent additions
- **Onboarding** - First-time user wizard to add yourself

## Quick Start 🚀

### 1. Set up the Database

The database configuration is in `packages/database/.env`. Make sure your `DATABASE_URL` is set correctly.

Run migrations and seed:

```bash
cd packages/database
npx prisma db push
node seed.js
```

This will:
- Create 3 tables (Person, Connection, RelationshipType)
- Seed 16 default relationship types

### 2. Start the Development Server

```bash
npm run dev
```

Visit http://localhost:3000

### 3. First Login

When you first log in, you'll see an onboarding wizard to create your profile. Fill in your basic info to get started!

## Database Schema 📊

### Person
- Basic: firstName, lastName, email, phone, photoUrl
- Demographics: age, gender, religion
- Location: city, country
- Professional: occupation, company
- Notes: Free-form text

### Connection
- Links two people together
- Multiple relationship types (array)
- Context: howMet, whenMetYear
- Auto-calculated strengthScore

### RelationshipType
- Pre-seeded with 16 types:
  - **Family** (10 strength): Family, Parent, Sibling, Child, Spouse
  - **Friends** (7-9 strength): Friend, Best Friend, Childhood Friend, Acquaintance
  - **Professional** (5-7 strength): Colleague, Boss, Mentor, Client
  - **Community** (4 strength): Neighbor
  - **Education** (5-6 strength): Classmate, Roommate

## How to Use 📝

### Add a Person

1. Click "Add Person" button on dashboard
2. Fill in basic info (only first name is required)
3. Add optional details (demographics, location, job, notes)
4. Click "Create"

### Add a Connection

1. Go to a person's profile page
2. Click "Add Connection"
3. Select another person from the dropdown
4. Choose relationship type(s) - can select multiple!
5. Optionally add how/when you met
6. Click "Add Connection"

### Search People

Use the search bar on the dashboard to filter by:
- Name (first or last)
- Occupation
- Location (city)

### Edit Anyone

Click "View Profile" on any person card, then click "Edit" to update their information. Anyone can edit anyone - fully collaborative!

## Connection Strength Algorithm 💪

The strength score is auto-calculated based on:

**Base Strength** (by relationship type):
- Family/Spouse/Parent/Child/Sibling: 10
- Best Friend: 9
- Friend: 7
- Colleague/Boss/Mentor: 5
- Acquaintance/Neighbor: 4

**Time Multiplier**:
- Years known × 0.1 (capped at 2x)
- Example: Friend for 10 years = 7 × (1 + 1.0) = 14

## File Structure 📁

```
apps/app/
├── app/
│   ├── (authenticated)/
│   │   ├── page.jsx                    # Main dashboard
│   │   ├── person/[id]/page.jsx        # Person profile
│   │   └── components/
│   │       ├── add-person-dialog.jsx   # Add person modal
│   │       ├── person-card.jsx         # Person grid item
│   │       ├── person-form.jsx         # Add/Edit form
│   │       ├── connection-form.jsx     # Add connection
│   │       ├── stats-card.jsx          # Stat display
│   │       └── onboarding-wizard.jsx   # First-time setup
│   └── actions/
│       ├── people.js                   # People CRUD
│       └── connections.js              # Connection CRUD

packages/database/
├── prisma/
│   └── schema.prisma                   # Database schema
└── seed.js                             # Relationship types seed
```

## Tech Stack 💻

- **Framework**: Next.js 16 (App Router)
- **Language**: JavaScript
- **Database**: PostgreSQL + Prisma
- **Auth**: Clerk
- **UI**: Design System (shadcn/ui)
- **Styling**: Tailwind CSS

## Next Steps 🎯

Once you have the basic system working, you can add:

1. **Photo Uploads** - Add real photos for people
2. **Advanced Filters** - Filter by relationship type, location, etc.
3. **Notes System** - Multiple notes per person with timestamps
4. **Network Visualization** - Graph view of connections
5. **Export Data** - CSV/JSON export for visualization tools
6. **Bulk Import** - Import from CSV or Google Contacts
7. **Edit History** - Track who changed what
8. **Suggestions** - "People you might know" based on mutual connections

## Troubleshooting 🔧

### Database connection failed
- Check your `DATABASE_URL` in `packages/database/.env`
- Make sure your PostgreSQL database is running

### Onboarding won't dismiss
- Make sure your Clerk user ID is being saved correctly
- Check browser console for errors

### Search not working
- The search uses case-insensitive contains matching
- Make sure you have people added to the database

### Relationship types missing
- Run the seed script: `node packages/database/seed.js`

## Contributing 🤝

This is a simple, minimal MVP. Feel free to extend it! The code is designed to be easy to understand and modify.

## Future: Network Visualization 🌐

The database is structured to export data for graph visualization libraries like:
- D3.js force-directed graphs
- Vis.js network graphs
- Cytoscape.js
- anvaka's map-of-reddit style visualizations

Export format will be:
```json
{
  "nodes": [{ "id": "uuid", "label": "Name", "size": 10, "color": "#hex" }],
  "edges": [{ "source": "uuid1", "target": "uuid2", "weight": 8.5 }]
}
```

---

**Built with ❤️ for mapping human connections**
