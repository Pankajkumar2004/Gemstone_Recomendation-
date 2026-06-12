# Gemstone Recommendation Backend

Node.js and Express backend for the Gemstone Recommendation System.

## Features

- RESTful API for recommendations, gemstones, and users
- Zodiac sign calculation based on birth date
- Purpose-based recommendation engine
- JSON file storage
- CORS enabled for frontend integration

## Installation

```bash
npm install
```

## Running the Server

Development:
```bash
npm run dev
```

Production:
```bash
npm start
```

The server will run on `http://localhost:5000`

## API Documentation

### Health Check
```
GET /api/health
```

### Recommendations

**Get Recommendation**
```
POST /api/recommendations
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "dob": "2001-10-10",
  "time": "10:30",
  "place": "Mumbai",
  "gender": "Male",
  "purpose": "Career",
  "budget": "₹5000 - ₹10000"
}
```

**Get User History**
```
GET /api/recommendations/history/:email
```

**Get Analytics**
```
GET /api/recommendations/analytics
```

### Gemstones

**Get All Gemstones**
```
GET /api/gemstones
```

**Get Single Gemstone**
```
GET /api/gemstones/:id
```

**Add Gemstone**
```
POST /api/gemstones
Content-Type: application/json

{
  "name": "Ruby",
  "planet": "Sun",
  "color": "Red",
  "priceRange": "₹5000 - ₹50000",
  "minPrice": 5000,
  "maxPrice": 50000,
  "benefits": ["Confidence", "Leadership"],
  "purposes": ["Career", "Leadership"],
  "wearInstructions": {
    "metal": "Gold",
    "finger": "Ring Finger",
    "day": "Sunday",
    "time": "Morning"
  },
  "alternatives": ["Red Garnet", "Sunstone"],
  "description": "Ruby is a precious gemstone...",
  "zodiacSigns": ["Leo", "Aries"]
}
```

**Update Gemstone**
```
PUT /api/gemstones/:id
```

**Delete Gemstone**
```
DELETE /api/gemstones/:id
```

**Get Zodiac Mapping**
```
GET /api/gemstones/mapping/zodiac
```

**Update Zodiac Mapping**
```
PUT /api/gemstones/mapping/zodiac
Content-Type: application/json

{
  "mapping": {
    "Leo": "Ruby",
    "Virgo": "Emerald"
  }
}
```

### Users

**Get All Users**
```
GET /api/users
```

**Get Single User**
```
GET /api/users/:email
```

**Delete User**
```
DELETE /api/users/:email
```

## Data Structure

### Gemstone Object
```json
{
  "id": 1,
  "name": "Ruby",
  "planet": "Sun",
  "color": "Red",
  "priceRange": "₹5000 - ₹50000",
  "minPrice": 5000,
  "maxPrice": 50000,
  "benefits": ["Confidence", "Leadership", "Success"],
  "purposes": ["Career", "Leadership"],
  "wearInstructions": {
    "metal": "Gold",
    "finger": "Ring Finger",
    "day": "Sunday",
    "time": "Morning"
  },
  "alternatives": ["Red Garnet", "Sunstone"],
  "description": "Ruby is a precious gemstone...",
  "zodiacSigns": ["Leo", "Aries"]
}
```

### Recommendation Object
```json
{
  "id": 1234567890,
  "userId": "user@example.com",
  "userName": "John Doe",
  "dob": "2001-10-10",
  "gender": "Male",
  "purpose": "Career",
  "budget": "₹5000 - ₹10000",
  "zodiacSign": "Leo",
  "primaryRecommendation": {
    "name": "Ruby",
    "matchScore": 92,
    "planet": "Sun",
    "color": "Red",
    "priceRange": "₹5000 - ₹50000",
    "benefits": ["Confidence", "Leadership"],
    "wearInstructions": {...},
    "alternatives": ["Red Garnet"]
  },
  "alternatives": [...],
  "explanation": "Your zodiac sign is Leo...",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

## Services

### Zodiac Calculator
Calculates zodiac sign based on birth date.

### Recommendation Engine
- Calculates match scores based on zodiac, purpose, and budget
- Generates explanations
- Saves recommendations and users
- Provides analytics data

## Environment Variables

```
PORT=5000
```

## File Structure

```
backend/
├── app.js                      # Main Express app
├── package.json                # Dependencies
├── controllers/
│   ├── recommendationController.js
│   ├── gemstoneController.js
│   └── userController.js
├── routes/
│   ├── recommendationRoutes.js
│   ├── gemstoneRoutes.js
│   └── userRoutes.js
├── services/
│   ├── zodiacCalculator.js
│   └── recommendationEngine.js
└── data/
    ├── gemstones.json
    ├── users.json
    └── recommendations.json
```
