# MovieBook — Setup & Run Guide

This covers how to get the backend (Spring Boot) and frontend (React) running locally, plus the optional environment variables for email and the OMDb movie search integration.

---

## 1. Prerequisites

- **Java 17** installed
- **Node.js** (with npm) installed
- **MySQL** installed and running

---

## 2. Database Setup

The backend expects a MySQL database named `movie_booking`. Open MySQL and run:

```sql
CREATE DATABASE IF NOT EXISTS movie_booking;
```

Your database username/password are already set in:
```
moviebooking/moviebooking/src/main/resources/application.properties
```
Update `spring.datasource.username` / `spring.datasource.password` there if your MySQL credentials are different. Tables are created automatically on first run (`spring.jpa.hibernate.ddl-auto=update`).

---

## 3. Running the Backend

Open a terminal in the backend project folder (the one containing `pom.xml`, `mvnw`, `mvnw.cmd`):

**Windows (PowerShell or Command Prompt):**
```
cd moviebooking\moviebooking
.\mvnw.cmd spring-boot:run
```

**Mac / Linux:**
```
cd moviebooking/moviebooking
./mvnw spring-boot:run
```

First run downloads dependencies, so it'll take a minute or two. Once you see:
```
Tomcat started on port 8081
Started MoviebookingApplication
```
the backend is live at **http://localhost:8081**

Leave this terminal running.

---

## 4. Running the Frontend

Open a **second, separate terminal** in the frontend project folder (the one containing `package.json`):

```
cd moviebooking-frontend
npm install
npm run dev
```

Once it starts, it'll print a local URL — open it in your browser:

**http://localhost:5173**

Leave this terminal running too. Both backend and frontend need to stay running at the same time.

---

## 5. Optional Environment Variables

These enable two extra features. The app works fine without them — they just won't be active.

### OMDb movie search
Already has a working default key. To use your own instead, set:
```
OMDB_API_KEY=your_key_here
```

### Booking confirmation emails
Not set by default, so emails are silently skipped (bookings still work normally). To enable them, set these **before starting the backend**:
```
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_16_character_app_password
```
Use a Gmail **App Password**, not your normal password: [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)

**How to set environment variables before running the backend:**

Windows PowerShell (per session):
```powershell
$env:MAIL_USERNAME="your_email@gmail.com"
$env:MAIL_PASSWORD="your_app_password"
.\mvnw.cmd spring-boot:run
```

Mac/Linux:
```bash
export MAIL_USERNAME=your_email@gmail.com
export MAIL_PASSWORD=your_app_password
./mvnw spring-boot:run
```

---

## 6. URLs

| What | URL |
|---|---|
| Frontend (website) | http://localhost:5173 |
| Backend (API) | http://localhost:8081 |

---

## 7. Creating an Admin Account

1. Register a normal account at http://localhost:5173/register
2. In MySQL, promote it to admin:
```sql
UPDATE users SET role = 'ADMIN' WHERE email = 'your@email.com';
```
3. Log out and log back in — you'll now see the Admin option in the navbar.

---

## 8. Stopping the App

Press `Ctrl + C` in each terminal (backend and frontend) to stop them.

---

## Troubleshooting

- **"mvnw.cmd is not recognized"** → make sure you're in the exact folder containing `mvnw.cmd`, and on PowerShell prefix it with `.\` (i.e. `.\mvnw.cmd`).
- **Backend can't connect to MySQL** → make sure MySQL is running and the database `movie_booking` exists.
- **Port already in use** → close whatever else is using port 8081 or 5173, or stop a previous running copy of the app.
