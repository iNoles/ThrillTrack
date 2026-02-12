# ThrillTrack - Full Stack Web Application

🚀 **ThrillTrack** is a React + Bootstrap + Bun + Supabase app that lets you explore theme park rides, including details like thrill rating, ride type, park, and more. Perfect for roller coaster enthusiasts!

## Features

- List all rides from your Supabase database
- View ride details with:
  - Description
  - Type
  - Park
  - Status
  - Opening year
  - Manufacturer
  - Height requirement
  - Thrill rating (0–10) visualized with progress bar
- Dark mode support
- Bootstrap-friendly UI
- React Router navigation with back button
- Fully powered by **Supabase Edge Function** for API routes
- CLI uses Bun Server

## Getting Started

1. Clone the repo
```bash
git clone https://github.com/iNoles/ThrillTrack.git
```
2. Set up environment variables in .env:
```ini
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
```
3. Install dependencies:
```bash
bun install
cd my-rides-app
bun install
```
4. Run the app:
```bash
# Start the Bun Server (if using CLI)
bun index.ts
sh show_rides_cli.sh
```

## Contributions

Contributions welcome! Feel free to open issues or PRs.

# Start React frontend
cd my-rides-app
bun dev
```
