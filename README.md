# 🚀 SEO Dashboard - 120 Website Portfolio Manager

Complete dashboard for tracking Google Search Console data across 120 websites with real-time QTV (Qualified Traffic Value) calculations.

## Features

✅ **Real-Time GSC Integration** - Direct connection to Google Search Console API  
✅ **120 Websites** - Manage and track all client sites  
✅ **QTV Calculation** - Automatic lead value estimation  
✅ **Portfolio View** - See all websites at a glance  
✅ **Top Performers** - Identify high-performing sites  
✅ **Quick Wins** - Find optimization opportunities  
✅ **Specialist Breakdown** - Track performance by team member  

## Tech Stack

- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Node.js + Express
- **Database**: Google Search Console API
- **Hosting**: Vercel (frontend) + Render (backend)

## Quick Start

### Local Development

```bash
# Backend
cd backend
npm install
npm start

# Frontend (new terminal)
cd frontend
npm install
npm run dev
```

Visit `http://localhost:3000`

### Deployment

- **Frontend**: Deploy to Vercel
- **Backend**: Deploy to Render

See deployment docs for details.

## Configuration

### Service Account Credentials

The backend uses Google Service Account credentials for Search Console API access. Credentials are embedded in `backend/services/gscServiceWithCredentials.js`.

### OAuth Token

For the frontend dashboard, users paste their Google OAuth token to authenticate.

## API Endpoints

- `GET /api/gsc-portfolio/list` - Get all 120 websites
- `POST /api/gsc-portfolio/sync-all` - Sync data from all websites
- `GET /api/gsc-portfolio/single/:siteUrl` - Get data for single site
- `GET /api/gsc-portfolio/health` - Health check

## License

MIT

## Support

For issues or questions, see the documentation in `/docs`
