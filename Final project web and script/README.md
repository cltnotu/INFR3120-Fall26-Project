# TableUp — Restaurant Reservation System

An Express Generator-style application with EJS templates, MongoDB storage for reservations, and Google Calendar API integration for real-time availability and booking confirmation. The site has a home page, a reservation survey, and a reservations table.

## Start the project

1. Make sure you have Node.js installed.
2. Open the project directory in VS Code and run `npm install`.
3. Copy `.env.example` to a new file named `.env`.
4. Fill in the values in `.env` (see the Environment Variables section below).
5. Run `npm start`.
6. Open `http://localhost:3000`.

**Never upload `.env` or real passwords to a public GitHub repository.** `.env` is ignored by `.gitignore`.

## Environment Variables

You will need to create a `.env` file with the following variables:
- `MONGODB_URI`: Your MongoDB Atlas connection string.
- `GOOGLE_SERVICE_ACCOUNT_EMAIL`: The email from your Google Cloud service account.
- `GOOGLE_PRIVATE_KEY`: The private key from your Google Cloud service account JSON file (keep the `\n` characters).
- `GOOGLE_CALENDAR_ID`: The ID of the Google Calendar you are using for bookings (must be shared with the service account email).

## What's included

- `app.js` — Express setup, EJS layout, middleware and MongoDB connection.
- `bin/www` — starts the Express server.
- `routes/index.js` — GET home, GET survey, POST survey (integrates Google Calendar and MongoDB).
- `services/calendar.js` — Google Calendar API integration (checking availability and creating events).
- `models/reservation.js` — Mongoose schema for group size, time and automatic creation timestamp.
- `views/layout.ejs` + `views/partials/` — shared layout, header and footer.
- `views/index.ejs` — welcome page, reserve button and data table.
- `views/survey.ejs` — reservation survey with date, time, guest count, and name inputs.
- `public/stylesheets/style.css` — simple blue-and-orange rounded styling.

## Reservation flow

1. Home page `/` reads reservation records from MongoDB and renders the table.
2. Button goes to `/survey`.
3. After name, date, time, and group size are submitted, POST `/survey` validates values.
4. The server queries the Google Calendar API to check if the requested time slot is free.
5. If free, the server creates a Google Calendar event with the booking details.
6. `Reservation.create()` saves the record to MongoDB.
7. `res.redirect('/')` returns the user home and the table shows the record.

## Google Cloud Setup

To make the calendar integration work:
1. Create a project in Google Cloud Console and enable the **Google Calendar API**.
2. Create a **Service Account** and generate a JSON key.
3. Copy the `client_email` to `GOOGLE_SERVICE_ACCOUNT_EMAIL` and `private_key` to `GOOGLE_PRIVATE_KEY`.
4. Go to Google Calendar settings and share your calendar with the service account email, giving it "Make changes to events" permission.
5. Copy the Calendar ID from the settings into `GOOGLE_CALENDAR_ID`.

## Source attribution / academic integrity

This project was developed for the INFR3120 course.

- The core Express and MongoDB structure was adapted with assistance from OpenAI ChatGPT, building upon the user's previous Assignment 2 (`my-portfolio.zip`) and lecture slides (MEAN Stack Development: Express routing, Mongoose models, EJS).
- The Google Calendar integration (`services/calendar.js` and route logic) was adapted from the official Google Calendar API Node.js quickstart documentation: https://developers.google.com/workspace/calendar/api/quickstart/nodejs

All external code has been reviewed, documented with comments, and accounts for less than 10% of the total project code, in accordance with the course's external-code rules.

## Team Contributions

- **Urveesh Etwarowa**: Express setup, MongoDB connection, initial survey template, homepage layout, and reservation model.
- **Clinton Obazee**: Google Calendar API integration, calendar availability checks, survey date/name inputs, calendar event creation, README documentation, and cloud deployment.

## Deployment

This app is deployed on Render. To deploy your own version:
1. Create a Web Service on Render and connect your GitHub repository.
2. Set the Build Command to `npm install` and the Start Command to `npm start`.
3. Add `MONGODB_URI`, `GOOGLE_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_PRIVATE_KEY`, and `GOOGLE_CALENDAR_ID` as Environment Variables in the Render dashboard.

## Quick note
The application is hosted on Render's free tier. If the site takes up to 60 seconds to load on the first visit, please wait—the server is just waking up from sleep mode.