# Grand Heist API

Backend API for **Grand Heist**, a tournament game for the SorSU Bulan Campus library.
CS 313 Software Engineering 1, A.Y. 2026-2027.

- Developer: Christine G. Gersalia (chrstne-gersalia), BSCS 3-2
- Group and game concept: Team 8 (3-2) - Grand Heist

This is my own build of my group's game concept. Every commit in this repository was made by me, with Git, on my own computer or in my own Codespace.

## Tech stack

| Layer | Tool |
|---|---|
| Runtime | Node.js 22 LTS or newer |
| Web framework | Express 5 |
| Database | PostgreSQL 16 or newer |
| ORM and migrations | Sequelize 6 with sequelize-cli |

## Setup

```
git clone [repository-url]
cd [folder-name]
npm install
```

Copy `.env.example` to `.env`, then put your own PostgreSQL password in `DB_PASSWORD`.

```
npm run db:create     (first time only)
npm run db:migrate
npm run db:seed
npm run db:check
npm run dev
```

## Environment variables

| Key | Example | Purpose |
|---|---|---|
| NODE_ENV | development | Which config block to use |
| PORT | 3001 | Port the API listens on (the library assigns the final port at deployment) |
| DB_HOST | 127.0.0.1 | PostgreSQL host |
| DB_PORT | 5432 | PostgreSQL port |
| DB_NAME | your_game_slug | Database name: your game slug, with underscores |
| DB_USER | postgres | Database user |
| DB_PASSWORD | (your own) | Database password. Never commit this. |
| HUB_API_KEY | dev-hub-key | Key the Library Game Hub sends to read results. The library gives the real one at deployment. |

## Endpoints

Base URL: `http://localhost:3001/api/v1`

### Hub Contract v1.2

| Method | Path | Purpose | Who may call |
|---|---|---|---|
| GET | /health | Check API and database status | Anyone |
| GET | /game-info | Get game information | Anyone |
| GET | /results | Get finished game results | Library Game Hub (requires X-Hub-Key) |

### Module 1 - Question Sets

| Method | Path | Purpose | Who may call |
|---|---|---|---|
| POST | /question-sets | Create a question set | Host |
| GET | /question-sets | List question sets | Host |
| GET | /question-sets/:id | View a question set | Owning host |
| PATCH | /question-sets/:id | Update a question set | Owning host |
| DELETE | /question-sets/:id | Delete a question set | Owning host |

### Module 2 - Sessions and Players

| Method | Path | Purpose | Who may call |
|---|---|---|---|
| POST | /sessions | Create a game session | Host |
| GET | /sessions/:code | View a game session | Anyone with the session code |
| PATCH | /sessions/:code | Change session status | Session host |
| POST | /sessions/:code/players | Join a game session | Player |
| GET | /sessions/:code/players | List session players | Anyone with the session code |

## What "completed" means in my game

A player is considered completed when they have answered every question in the question set assigned to the finished game session.
The number of distinct questions answered by the player must equal the total number of questions in that session's question set.
Players who have not answered every question are marked as incomplete and do not receive a rank or appear on the podium.

## Tables



The results endpoint uses the following database tables:

- `sessions`: Provides the game join code, status, start time, end time, and assigned question set.
- `players`: Provides the player's nickname, session membership, player ID, and final score.
- `users`: Provides each player's school ID.
- `questions`: Provides the total number of questions in the session's assigned question set.
- `answers`: Provides the player's submitted answers, used to determine whether the player completed the game.

## Database scripts

| Command | What it does |
|---|---|
| npm run db:migrate | Runs migrations that have not run yet |
| npm run db:migrate:status | Lists every migration as up or down |
| npm run db:seed | Loads the seed data |
| npm run db:check | Counts the rows in every table |
| npm run db:reset | Empties the database, rebuilds every table and reloads the seed data |
| npm run check | Runs the same automatic check that GitHub runs after every push |
