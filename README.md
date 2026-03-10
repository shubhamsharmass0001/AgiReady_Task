# FormFlow - AI-Powered Form Builder

## Overview
Small businesses and creators often lack intelligent insights from typical form responses. FormFlow is a SaaS application that allows users to create forms, share them, collect responses, and get **AI-powered analytics**. The AI automatically detects sentiment, extracts key themes from open-text responses, and auto-generates summary reports.

## Features Built
- **Authentication & Workspace**: Custom credentials authentication via NextAuth, protected dashboard.
- **Form Builder**: Interactive Drag & Drop style interface with support for Short Text, Long Text, Multiple Choice, and Rating fields.
- **Respondent Experience**: Clean, distraction-free public form URL experience.
- **AI Analytics**: OpenAI (`gpt-4o-mini`) integration to analyze textual responses, outputting sentiment score (0.0-10.0) and key themes.
- **Export**: 1-click CSV export of all responses.
- **Design System**: Strict adherence to Vanilla CSS, featuring an immersive "Glassmorphism" dark theme aesthetic, micro-animations, and fluid responsive design—without leveraging Tailwind or component libraries.

## Tech Stack
- **Framework**: Next.js (App Router, Server Components, API Routes)
- **Database Architecture**: Prisma ORM with SQLite (for fast MVP setup & zero-configuration)
- **Authentication**: NextAuth.js v4 (Credentials Provider with `bcryptjs`)
- **Styling**: 100% Vanilla CSS (`globals.css`)
- **AI Integration**: OpenAI API Node SDK

## Setup Instructions

### 1. Requirements
- Node.js 18+
- An OpenAI API Key

### 2. Installation
Clone the repository (or navigate to the directory) and install dependencies:
```bash
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory:
```env
# Prisma SQLite connection
DATABASE_URL="file:./dev.db"

# NextAuth Secret
NEXTAUTH_SECRET="your_secure_random_string"
NEXTAUTH_URL="http://localhost:3000"

# OpenAI
OPENAI_API_KEY="sk-..."
```

### 4. Database Setup
Initialize the database and generate Prisma client:
```bash
npx prisma generate
npx prisma db push
```

### 5. Running the Application
```bash
npm run dev
```
Visit `http://localhost:3000` to interact with FormFlow.

## Approach & Decisions
- **Vanilla CSS Constraint**: To satisfy the core challenge while achieving a premium "wow" factor, I built a centralized design system using CSS variables mapped to common shading, glassmorphism filtering `backdrop-filter`, and CSS utilities. This provided maximum flexibility while entirely bypassing Tailwind.
- **Server vs Client Components**: Navigational layouts and data fetching leverage Next.js Server Components, while interactive elements (Form Builder, Respondent Form, AI Generation) utilize highly localized `use client` states. 
- **Database Simplification**: Implementing `SQLite` instead of PostgreSQL allowed for faster iteration during the sprint window. Complex schema references (like NextAuth Account/Sessions) were bypassed in favor of simple Credentials. 
- **AI Reliability**: AI completion tasks enforce strict `<Q>` and `<A>` text aggregation combined with JSON mode (`response_format: json_object`) to guarantee structured sentiment output and UI consistency.

## Deployed Link
*[Insert Vercel / Render Live URL Here when deployed]*
