# SportsGA 🏀

A full-stack NBA player comparison web application that allows users to compare two players head-to-head based on their 2025-2026 season statistics.

## Features

- Compare any two NBA players by points, rebounds, and assists per game
- Visual stat highlighting — winning stats displayed in green, losing stats in red
- Official NBA headshots pulled directly from the NBA CDN
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
| GET | `/compare?player1=X&player2=Y` | Returns comparison data for two players |

## Project Status

🚧 Currently in active development — styling and deployment coming soon.
