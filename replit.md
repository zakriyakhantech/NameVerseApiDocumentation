# NameVerse API Documentation

## Overview
This is a static HTML website that serves as the documentation and testing interface for the NameVerse API. The API provides access to a comprehensive database of 70,000+ names across Islamic, Hindu, and Christian traditions with detailed information including meanings, origins, lucky days, personality traits, and more.

## Project Structure
```
public/                    # Static site root (deployed)
├── index.html            # Main landing page with client-side router
├── 404.html              # Handles clean URL routing
├── server.js             # Development static server
├── package.json          # Development server config
├── docs/                 # Documentation HTML pages
│   ├── Docs.html
│   ├── Blog.html
│   └── ...
└── src/                  # Endpoint testing pages
    ├── getnames.html
    ├── getnamesbysearch.html
    └── ...

NameMeaningApiDocumentation/   # Original Node.js source (reference)
```

## Tech Stack
- **Frontend**: Static HTML, CSS (TailwindCSS CDN), Vanilla JavaScript
- **Hosting**: Replit Static Deployment (FREE)
- **Routing**: Client-side JavaScript routing for clean URLs
- **API**: Calls external API at namverse-api.vercel.app

## Deployment
- **Type**: Static deployment (FREE hosting)
- **Public Directory**: `public`
- **URLs**: Clean URLs without hash (e.g., `/docs`, `/names/islamic/muhammad`)

## How Clean URLs Work
1. The 404.html catches unknown paths and stores them in sessionStorage
2. It redirects to index.html
3. index.html reads the stored path and loads the appropriate page
4. Client-side navigation uses the History API for seamless routing

## Recent Changes (December 01, 2025)
- Converted from Node.js/Express to static site for FREE hosting
- Implemented client-side routing for clean URLs
- Created 404.html for SPA-style routing
- All routes work: `/`, `/docs`, `/blog`, `/names/:religion/:slug`, etc.
- External API calls to 65K+ names database work correctly

## Available Routes
- `/` - Main documentation landing page
- `/docs` - API documentation
- `/blog` - Blog page
- `/getnames` - Get names endpoint testing
- `/getnamesbysearch` - Search names by query
- `/getnamesbyletter` - Filter names by starting letter
- `/getnamesbyreligion` - Filter names by religion
- `/getfilteroptions` - Get available filter options
- `/names/:religion/:slug` - View specific name (e.g., `/names/islamic/muhammad`)
- `/health` - Health check endpoint

## API Features
- 70,000+ names across religions
- 50+ origins (Arabic, Sanskrit, Hebrew, etc.)
- Deep meanings and interpretations
- Lucky days and numbers
- Personality traits
- Filter by religion, alphabet, and more
