# Gemstone Recommendation System

A comprehensive astrology-based gemstone recommendation platform built with React, Node.js, and Express. This system provides personalized gemstone recommendations based on birth details, zodiac signs, and user purposes.

## Features

### User Features
- **Home Page**: Hero banner, popular gemstones, benefits, and how it works
- **Recommendation Form**: Personal information, birth details, purpose, and budget selection
- **Recommendation Engine**: Zodiac calculation and purpose-based matching
- **Result Page**: Detailed recommendations with benefits, wearing instructions, and alternatives
- **Gemstone Catalog**: Browse all gemstones with filters (planet, purpose, price, color)
- **Recommendation History**: View past recommendations by email
- **Dark Mode**: Toggle between light and dark themes

### Admin Features
- **Dashboard**: Overview with total users, recommendations, gemstones, and most recommended stone
- **Gemstone Management**: Add, edit, and delete gemstones
- **User Management**: View and delete users
- **Analytics Dashboard**: Charts for gemstone distribution, purpose distribution, and monthly trends
- **Zodiac Mapping**: Manage zodiac-to-gemstone mappings

### Bonus Features
- **PDF Export**: Download recommendation reports as PDF
- **Share**: Share recommendations via native sharing
- **Responsive Design**: Works on desktop, tablet, and mobile

## Tech Stack

### Frontend
- React 18
- React Router DOM
- Tailwind CSS
- Lucide React (Icons)
- Recharts (Charts)
- Axios (API client)
- html2canvas & jsPDF (PDF generation)

### Backend
- Node.js
- Express
- CORS
- Body Parser

### Storage
- JSON files (gemstones.json, users.json, recommendations.json)

## Project Structure

```
gemstone-app/
├── backend/
│   ├── app.js                 # Main Express app
│   ├── package.json           # Backend dependencies
│   ├── controllers/           # Route controllers
│   │   ├── recommendationController.js
│   │   ├── gemstoneController.js
│   │   └── userController.js
│   ├── routes/                # API routes
│   │   ├── recommendationRoutes.js
│   │   ├── gemstoneRoutes.js
│   │   └── userRoutes.js
│   ├── services/              # Business logic
│   │   ├── zodiacCalculator.js
│   │   └── recommendationEngine.js
│   └── data/                  # JSON data files
│       ├── gemstones.json
│       ├── users.json
│       └── recommendations.json
└── frontend/
    ├── package.json           # Frontend dependencies
    ├── tailwind.config.js     # Tailwind configuration
    ├── postcss.config.js      # PostCSS configuration
    ├── public/
    │   └── index.html
    └── src/
        ├── App.js             # Main React app
        ├── index.js           # React entry point
        ├── index.css          # Global styles
        ├── pages/             # Page components
        │   ├── Home/
        │   ├── Recommendation/
        │   ├── Result/
        │   ├── Gemstones/
        │   ├── History/
        │   └── Admin/
        ├── components/        # Reusable components
        ├── services/          # API services
        │   └── api.js
        └── utils/             # Utility functions
```

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Start the backend server:
```bash
npm start
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the frontend development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## API Endpoints

### Recommendations
- `POST /api/recommendations` - Get a new recommendation
- `GET /api/recommendations/history/:email` - Get user's recommendation history
- `GET /api/recommendations/analytics` - Get analytics data

### Gemstones
- `GET /api/gemstones` - Get all gemstones
- `GET /api/gemstones/:id` - Get a specific gemstone
- `POST /api/gemstones` - Add a new gemstone
- `PUT /api/gemstones/:id` - Update a gemstone
- `DELETE /api/gemstones/:id` - Delete a gemstone
- `GET /api/gemstones/mapping/zodiac` - Get zodiac mappings
- `PUT /api/gemstones/mapping/zodiac` - Update zodiac mappings

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:email` - Get a specific user
- `DELETE /api/users/:email` - Delete a user

## How It Works

### Recommendation Algorithm

1. **Input**: User provides birth date, purpose, and optional budget
2. **Zodiac Calculation**: System calculates zodiac sign based on birth date
3. **Gemstone Matching**: 
   - Zodiac match (40 points)
   - Purpose match (40 points)
   - Budget match (20 points)
4. **Scoring**: Each gemstone receives a match score (0-100%)
5. **Result**: Primary recommendation + alternatives with explanations

### Zodiac Signs

The system supports all 12 zodiac signs:
- Aries (Mar 21 - Apr 19)
- Taurus (Apr 20 - May 20)
- Gemini (May 21 - Jun 20)
- Cancer (Jun 21 - Jul 22)
- Leo (Jul 23 - Aug 22)
- Virgo (Aug 23 - Sep 22)
- Libra (Sep 23 - Oct 22)
- Scorpio (Oct 23 - Nov 21)
- Sagittarius (Nov 22 - Dec 21)
- Capricorn (Dec 22 - Jan 19)
- Aquarius (Jan 20 - Feb 18)
- Pisces (Feb 19 - Mar 20)

## Gemstones Available

1. **Ruby** (Sun) - Leadership, Confidence, Success
2. **Emerald** (Mercury) - Intelligence, Communication, Education
3. **Pearl** (Moon) - Peace, Mental Stability, Relationships
4. **Diamond** (Venus) - Luxury, Love, Beauty, Marriage
5. **Blue Sapphire** (Saturn) - Discipline, Focus, Career Growth
6. **Yellow Sapphire** (Jupiter) - Wisdom, Wealth, Marriage
7. **Red Coral** (Mars) - Courage, Energy, Health
8. **Hessonite** (Rahu) - Success, Ambition, Innovation
9. **Cat's Eye** (Ketu) - Spirituality, Protection, Healing

## Admin Panel

Access the admin panel at `/admin` to:
- View dashboard statistics
- Manage gemstones (CRUD operations)
- Manage users
- View analytics with interactive charts
- Update zodiac-to-gemstone mappings

## Development

### Adding New Gemstones

1. Go to Admin Panel → Gemstones
2. Click "Add Gemstone"
3. Fill in the details:
   - Name
   - Planet
   - Color
   - Price Range
   - Benefits
   - Purposes
   - Wearing Instructions
   - Zodiac Signs
   - Alternatives

### Modifying Recommendation Rules

1. Go to Admin Panel → Gemstones
2. Edit gemstone properties
3. Update zodiac mappings via API or directly in gemstones.json

## Deployment

### Backend Deployment

1. Set environment variables:
```bash
PORT=5000
```

2. Deploy to any Node.js hosting platform (Heroku, Railway, Render, etc.)

### Frontend Deployment

1. Build the production bundle:
```bash
npm run build
```

2. Deploy the `build` folder to any static hosting platform (Netlify, Vercel, etc.)

3. Update API base URL in `frontend/src/services/api.js` to point to your deployed backend

## License

This project is for educational purposes.

## Credits

Built for astrology platform assignment - Humara Pandit
