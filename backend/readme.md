# URL Shortener - Backend Service

A high-performance URL shortening microservice with analytics capabilities.

## Features

- Create short URLs with custom codes
- Automatic 302 redirection
- Detailed click analytics
- Automatic link expiration (TTL)
- Rate limiting and API security
- RESTful API endpoints

## Tech Stack

- Node.js (Express)
- MongoDB (with Mongoose)
- Redis (for caching)
- JWT (for authentication)
- Docker (for containerization)

## API Documentation

### Base URL
`https://api.yourdomain.com/v1`

### Endpoints

| Method | Endpoint          | Description                     |
|--------|-------------------|---------------------------------|
| POST   | `/shorten`        | Create short URL                |
| GET    | `/:code`          | Redirect to original URL        |
| GET    | `/analytics/:code`| Get URL statistics              |
| GET    | `/user/urls`      | Get user's URLs (authenticated) |

## Environment Variables

Create a `.env` file with:

```
PORT=8000
MONGO_URI=mongodb://localhost:27017/urlshortener
BASE_URL=http://localhost:8000


## Installations

#CLone the repository
git clone https://github.com/yashgupta5532/11222868

# Navigate to the project backennd directory
cd backend

# Install dependencies
npm install

# Start development server
npm run dev

# Start production server
npm start