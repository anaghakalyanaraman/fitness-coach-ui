# AI Fitness & Nutrition Coach UI

A React frontend for the AI Fitness Coach application. Get personalized workout plans, meal plans, recipes, and chat with your AI coach.

**Live Demo:** https://fitness-coach-ui-qk6l.vercel.app  
**Backend Repo:** https://github.com/anaghakalyanaraman/fitness-coach-api  
**Demo:** [Watch Demo](https://www.youtube.com/watch?v=s2y2ual-MF0)

---

## Tech Stack

- **Frontend:** React, Vite
- **Styling:** Tailwind CSS
- **HTTP Client:** Axios
- **Routing:** React Router
- **Auth:** JWT stored in localStorage

---

## Features

- Register and login with JWT authentication
- Set up fitness profile (age, weight, height, goal, activity level)
- Generate AI-powered personalized 7-day workout plans
- Generate meal plans from ingredients you have at home
- Generate detailed recipes with instructions and nutrition info
- Chat with AI fitness coach for personalized advice
- Log workout sessions with multiple exercises
- Track weight over time
- View progress dashboard

---

## Pages

| Page | Route | Description |
|---|---|---|
| Login | /login | Email + password login |
| Register | /register | Create new account |
| Dashboard | /dashboard | Navigation hub |
| Profile | /profile | Set up fitness profile |
| Workout Plan | /workout | Generate AI workout plan |
| Nutrition | /nutrition | Meal plans and recipes |
| Chat | /chat | Chat with AI coach |
| Progress | /progress | Track workouts and weight |

---

## Screenshots

Login
<img width="1600" height="761" alt="image" src="https://github.com/user-attachments/assets/4bd55ff6-44b4-4bcb-b305-abd383586cdf" />

Dashboard
<img width="1600" height="765" alt="image" src="https://github.com/user-attachments/assets/f66cf3c4-c5f6-42fb-b33d-ff7c91861340" />

Workout Plan
<img width="1600" height="752" alt="image" src="https://github.com/user-attachments/assets/04eb58c9-aaa9-4398-851a-49ee02f28ce3" />

Nutrition Page
<img width="1600" height="774" alt="image" src="https://github.com/user-attachments/assets/a8189147-ae3b-4a92-b08c-3e5759a8aeee" />

Chat Coach
<img width="1600" height="756" alt="image" src="https://github.com/user-attachments/assets/b70bc33a-92f9-405e-a5fc-f84de3ecd1b1" />

Progress
<img width="1600" height="769" alt="image" src="https://github.com/user-attachments/assets/d94e54bb-8c5b-48d3-bdb5-249444415429" />

Profile
<img width="1600" height="759" alt="image" src="https://github.com/user-attachments/assets/445d5235-2601-4981-92c6-df63971386b0" />


---

## Running Locally

```bash
git clone https://github.com/anaghakalyanaraman/fitness-coach-ui
cd fitness-coach-ui
npm install
npm run dev
```

Make sure the backend is running at `http://localhost:8000` first.

App runs at `http://localhost:5173`
