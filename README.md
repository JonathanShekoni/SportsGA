# SportsGA 🏀

A full-stack NBA player analytics web application featuring player comparisons, individual player profiles, and season statistics for the 2025-2026 NBA season.

🌐 **Live at [sports-ga.vercel.app](https://sports-ga.vercel.app)**

## Features

- Compare any two NBA players head-to-head across 9 statistical categories
- Visual stat highlighting — winning stats in green, losing stats in red
- Official NBA headshots pulled directly from the NBA CDN
- Autocomplete player search with live suggestions
- Individual player profile pages with full season stats
- Navbar search to navigate directly to any player's profile
- REST API backend returning structured JSON data

## Tech Stack

![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-CC2927?style=for-the-badge&logo=python&logoColor=white)

## How to Run Locally

### Backend
```bash
cd Backend
pip install -r requirements.txt
python main.py
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/compare?player1=X&player2=Y` | Returns head-to-head comparison data for two players |
| GET | `/player?name=X` | Returns season stats for a single player |
| GET | `/players` | Returns a list of all available players |

## Deployment

- **Frontend** — Vercel
- **Backend** — Render
- **Database** — Render PostgreSQL (525+ NBA players, 2025-2026 season)

## Project Status

✅ Beta live — player profiles and season averages graph in active development.
