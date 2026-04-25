# CoderView

<div align="center">

**A private, real-time interview and coding practice platform built for technical interviews, peer-to-peer prep, and everyday problem solving.**

[Live Demo](https://coderview-3a0a.onrender.com) · [Report a Bug](#support) · [Setup](#local-development)

</div>

## Overview

CoderView is a full-stack interview platform that combines a live video room, a private 1-to-1 chat experience, and a Monaco-powered code editor with problem statements, test cases, and execution feedback.

It is designed to work in three modes:

- Technical interview platform for recruiters and candidates
- Peer-to-peer interview preparation space for friends or study partners
- Solo coding practice environment with curated problems or custom questions

## Why CoderView

Most interview tools only solve one part of the workflow. CoderView brings the entire session into one place:

- Invite-based private sessions so only the host and invited candidate can access the room
- Live code execution with automatic success/failure feedback
- Custom problem support for LeetCode-style questions, company-specific prompts, or your own format
- Real-time video, chat, and collaborative interview flow
- A clean dashboard for active sessions, past sessions, and quick room creation

## Key Features

- **VS Code-powered editor** with Monaco Editor and language switching
- **Private 1-to-1 interview rooms** with host and invited-user access control
- **Clerk authentication** for secure sign-in and user identity
- **Real-time video and chat** using Stream APIs
- **Screen sharing** and interview collaboration tools
- **Code execution in isolated environment** using Piston
- **Automatic test feedback** with success/fail output handling
- **Confetti and notifications** on successful test runs
- **Practice problems mode** for solo coding
- **Custom problem mode** for pasting your own question, examples, and constraints
- **Invite-only session creation** so only the candidate email can join
- **Session privacy enforcement on the backend** so direct URL access is protected
- **Dashboard with live stats** for active and recent sessions
- **Inngest background jobs** for Clerk user sync and cleanup

## Unique Differentiators

### Custom Problem Sessions

You can create a session with a fully custom question instead of picking from the built-in problem bank. The host can paste:

- Problem title
- Full problem statement
- Sample test cases

This is ideal for:

- Company-specific interview questions
- LeetCode-style prompts
- Internal assessments
- Mock interview drills

### Interview + Practice in One Platform

CoderView is not only for live interviews. It can also act as:

- A peer interview prep room
- A pair-programming workspace
- A normal coding editor with built-in problems

### Private Invite-Based Rooms

Sessions are restricted to:

- Host
- Invited user
- Joined participant

That means random users cannot access the room, even if they guess the URL.

## Tech Stack

### Frontend

- React 19
- Vite
- Tailwind CSS + daisyUI
- React Router
- TanStack Query
- Clerk React
- Monaco Editor
- Stream React SDK
- React Resizable Panels

### Backend

- Node.js
- Express
- MongoDB + Mongoose
- Clerk Express
- Stream Node SDK
- Stream Chat
- Inngest
- CORS

## How It Works

1. The host signs in and creates a session.
2. The host selects a built-in problem or enters a custom problem.
3. The host invites a candidate by email.
4. The invited user signs up or signs in with the same email.
5. The session appears for that user when the interview is available.
6. Both users join a private 1-to-1 room with video, chat, and code execution.

## Project Structure

```text
coderview/
├─ backend/
│  ├─ src/
│  │  ├─ controllers/
│  │  ├─ lib/
│  │  ├─ middleware/
│  │  ├─ models/
│  │  ├─ routes/
│  │  └─ server.js
│  └─ package.json
├─ frontend/
│  ├─ src/
│  │  ├─ api/
│  │  ├─ components/
│  │  ├─ data/
│  │  ├─ hooks/
│  │  ├─ lib/
│  │  ├─ pages/
│  │  └─ main.jsx
│  └─ package.json
└─ README.md
```

## Core User Flows

### Technical Interview

- Host creates a private room
- Invites candidate by email
- Candidate joins at the scheduled time
- Users discuss the question through video and chat
- Candidate codes in the shared editor and runs test cases

### Peer Interview Preparation

- Two users create a mock interview room
- They practice realistic technical questions
- They can switch languages and run code repeatedly
- They can simulate live interview pressure without a formal recruiter

### Solo Practice

- Open the Problems page
- Choose a coding challenge
- Solve in the editor
- Run code and compare against expected output

