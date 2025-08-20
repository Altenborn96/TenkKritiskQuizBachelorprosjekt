# Tenk Kritisk – Fullstack Quiz Platform

Tenk Kritisk is a fullstack educational quiz platform developed as part of a bachelor's thesis project. The system aims to strengthen users' critical thinking skills through modular quizzes, point tracking, achievements, and progress visualization.

The solution includes:

- A **mobile app** built with React Native and Expo
- A **.NET backend API** for data handling and authentication
- A **web-based CMS** for content management and quiz administration

---

## Project Structure

tenk-kritisk/
├── backend/ # .NET 8 Web API project
│ ├── Controllers/ # API endpoints (Quiz, Results, Users, etc.)
│ ├── Models/ # Data models (Quiz, Section, Achievement, etc.)
│ ├── Data/ # EF Core DbContext and migrations
│ ├── Services/ # Logic for handling tokens, etc.
│ ├── appsettings.json # Configuration (connection strings, etc.)
│ └── Program.cs # API entry point
│
├── frontend/ # React Native app using Expo
│ ├── app/ # Screens and routes (Expo Router)
│ ├── components/ # Shared UI components (charts, buttons, cards)
│ ├── services/ # API wrapper using Fetch
│ ├── assets/ # Fonts, images, and icons
│ ├── .env # API URL and environment config
│
│
├── cms/ # Admin panel for managing content
│ ├── components/ # Shared CMS UI components
│ ├── pages/ # Section, question, and achievement editors
│ ├── services/ # Fetch-based API utilities
│ ├── css/ # Styling (or Tailwind if used)
│
│
├── .gitignore
├── README.md # Main project overview (this file)
├── package.json # Root dependency info (optional if per-project)

## Getting Started

Each part of the project has its own `README.md` with specific setup instructions:
