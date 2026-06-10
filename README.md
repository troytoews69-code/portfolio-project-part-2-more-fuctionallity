# Troy Lussier — Developer Portfolio

A responsive, interactive personal portfolio website showcasing my journey from 20+ years in carpentry to full-stack web development. Built entirely with vanilla HTML, CSS, and JavaScript — no frameworks, no dependencies beyond Font Awesome.

---

## Live Site

> Deployed via GitHub Pages: **https://troytoews69-code.github.io/portfolio-project-part-2-more-fuctionallity/**  
> *(Update this URL after deployment)*

---

## Features

- **Dark / Light theme toggle** — persists across page sessions
- **Typing animation** in the hero section
- **Animated skill progress bars** on scroll
- **Project filtering** — filter by category (Web Apps, JavaScript, Portfolio)
- **Live weather widget** in the navbar powered by WeatherAPI
- **Smooth scroll navigation** with responsive hamburger menu
- **Contact form** with client-side validation

---

## Mini-Apps (Live Demos)

| App | File | Description |
|---|---|---|
| Weather Dashboard | `weather-app.html` | Current conditions, 3-day forecast, hourly chart — WeatherAPI |
| Task Manager | `task-manager.html` | Add/edit/delete tasks with priority levels and localStorage |
| Calculator | `calculator.html` | Full arithmetic calculator with history log |
| Interactive Quiz | `quiz-app.html` | Timed quiz with score tracking and high score persistence |

---

## File Structure

```
portfolio-project-part-2-more-fuctionallity/
│
├── index.html                  # Main portfolio page
├── styles.css                  # Portfolio styles
├── script.js                   # Portfolio interactivity
│
├── weather-app.html            # Weather Dashboard
├── weather-app.css
├── weather-app.js
│
├── task-manager.html           # Task Manager App
├── task-manager.css
├── task-manager.js
│
├── calculator.html             # Calculator App
├── calculator.css
├── calculator.js
│
├── quiz-app.html               # Quiz App
├── quiz-app.css
├── quiz-app.js
│
└── README.md
```

---

## Tech Stack

- **HTML5** — semantic markup
- **CSS3** — Flexbox, Grid, CSS animations, custom properties
- **JavaScript (ES6+)** — DOM manipulation, Fetch API, localStorage
- **Font Awesome 6** — icons
- **WeatherAPI** — weather data (weather app + navbar widget)

---

## Deploying to GitHub Pages (step-by-step)

These steps will get your portfolio live at a public URL in under 5 minutes.

### 1. Push to GitHub

If you haven't already, initialize a repo and push:

```bash
git init
git add .
git commit -m "Initial portfolio commit"
git branch -M main
git remote add origin https://github.com/troytoews69-code/portfolio-project-part-2-more-fuctionallity.git
git push -u origin main
```

### 2. Enable GitHub Pages

1. Go to your repository on GitHub.
2. Click **Settings** → **Pages** (in the left sidebar).
3. Under **Branch**, select `main` and folder `/root`, then click **Save**.
4. GitHub will build the site — it usually goes live within 1–2 minutes.
5. Your URL will be: `https://troytoews69-code.github.io/portfolio-project-part-2-more-fuctionallity/`

### 3. Verify

Open the URL — `index.html` loads automatically as the homepage. All mini-app links (`weather-app.html`, etc.) will work relative to the same domain.

---

## Running Locally

No build step needed. Just open `index.html` in any modern browser, or use the VS Code Live Server extension:

1. Right-click `index.html` → **Open with Live Server**
2. The site opens at `http://127.0.0.1:5500`

---

## About Me

I'm Troy Lussier — after 20+ years as a carpenter, a workplace injury redirected me toward coding and web development. The same precision and problem-solving mindset I brought to construction, I now bring to every line of code.

- **GitHub:** [troytoews69-code](https://github.com/troytoews69-code)
