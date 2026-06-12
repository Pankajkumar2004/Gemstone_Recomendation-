# Gemstone Recommendation Frontend

React frontend for the Gemstone Recommendation System with Tailwind CSS.

## Features

- Responsive design with Tailwind CSS
- Dark mode support
- React Router for navigation
- Interactive charts with Recharts
- PDF export with jsPDF
- Native sharing support
- Beautiful UI with Lucide icons

## Installation

```bash
npm install
```

## Running the Development Server

```bash
npm start
```

The app will run on `http://localhost:3000`

## Building for Production

```bash
npm run build
```

The production build will be in the `build/` directory.

## Pages

### Home (`/`)
- Hero banner
- Popular gemstones
- Benefits section
- How it works
- Call to action

### Recommendation Form (`/recommend`)
- Personal information form
- Birth details input
- Purpose selection
- Budget selection
- Form validation

### Result (`/result/:id`)
- Primary recommendation display
- Match score
- Why recommended explanation
- Benefits grid
- Wearing instructions
- Price range
- Alternative stones
- PDF download
- Share button

### Gemstones (`/gemstones`)
- Search functionality
- Filters (planet, purpose, price)
- Gemstone cards
- Color-coded icons
- Benefits preview

### History (`/history`)
- Email-based history search
- Recommendation list
- View details button
- Date and purpose display

### Admin (`/admin`)
- Dashboard with statistics
- Gemstone management (CRUD)
- User management
- Analytics with charts
- Tab-based navigation

## Components

### Navbar
- Responsive navigation
- Dark mode toggle
- Mobile menu
- Active state indication

### Cards
- Reusable card component
- Hover effects
- Dark mode support

## Services

### API Service (`src/services/api.js`)

```javascript
import { recommendationAPI, gemstoneAPI, userAPI } from './services/api';

// Get recommendation
const response = await recommendationAPI.getRecommendation(userData);

// Get user history
const history = await recommendationAPI.getUserHistory(email);

// Get analytics
const analytics = await recommendationAPI.getAnalytics();

// Get all gemstones
const gemstones = await gemstoneAPI.getAllGemstones();
```

## Styling

### Tailwind CSS Configuration

The app uses Tailwind CSS with custom color schemes:
- Primary: Red tones (for Ruby theme)
- Secondary: Green tones (for Emerald theme)

### Custom Components

Defined in `src/index.css`:
- `.btn-primary` - Primary button style
- `.btn-secondary` - Secondary button style
- `.card` - Card component style
- `.input-field` - Input field style

## Dark Mode

Dark mode is implemented using Tailwind's dark mode variant. The preference is saved in localStorage.

## PDF Export

The Result page supports PDF export using:
- html2canvas - Captures the recommendation card as an image
- jsPDF - Converts the image to a downloadable PDF

## Charts

The Admin panel uses Recharts for:
- Pie chart for gemstone distribution
- Bar chart for purpose distribution
- Bar chart for monthly recommendations

## File Structure

```
frontend/
├── package.json                # Dependencies
├── tailwind.config.js          # Tailwind configuration
├── postcss.config.js           # PostCSS configuration
├── public/
│   └── index.html
└── src/
    ├── App.js                  # Main React app
    ├── index.js                # React entry point
    ├── index.css               # Global styles
    ├── pages/
    │   ├── Home/
    │   │   └── Home.js
    │   ├── Recommendation/
    │   │   └── Recommendation.js
    │   ├── Result/
    │   │   └── Result.js
    │   ├── Gemstones/
    │   │   └── Gemstones.js
    │   ├── History/
    │   │   └── History.js
    │   └── Admin/
    │       └── Admin.js
    ├── components/             # Reusable components
    ├── services/
    │   └── api.js              # API service
    └── utils/                  # Utility functions
```

## Dependencies

### Core
- react
- react-dom
- react-router-dom

### UI/UX
- tailwindcss
- lucide-react
- recharts

### API
- axios

### PDF
- html2canvas
- jspdf

## Environment Variables

Update the API base URL in `src/services/api.js`:

```javascript
const API_BASE_URL = 'http://localhost:5000/api';
```

For production, change this to your deployed backend URL.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance

- Code splitting with React Router
- Lazy loading for better performance
- Optimized images and assets
- CSS purging with Tailwind
