# Dota 2 Draft Intelligence 🎮

An automated, ML-powered draft assistant for Dota 2, built using **Naive Bayes** classification. The system was trained on a dataset of **50,000 professional International matches** to compute the highest-probability winning synergies in real-time during a draft phase.

---

## 🧠 The Methodology

With 112 heroes yielding over 4.5 million possible team combinations, manual synergy analysis during a live draft is impossible. We framed this as a probabilistic classification problem.

We constructed two feature vectors, **F_win** and **F_loss**, where `x ∈ ℝ¹¹²`. A value of `1` represents a chosen hero, and `0` represents an unselected hero. By dividing our dataset into a 70/30 split, we calculated the prior probability and the likelihood of winning with a particular hero.

**Naive Bayes Posterior Calculation:**
```text
P(c|X) = P(x₁|c) × P(x₂|c) × ... × P(xₙ|c) × P(c)
```

For a given partial team (e.g., 2 heroes selected), the engine evaluates ~80,000 valid 5-hero permutations by summing log-posteriors, instantly returning the top recommended trajectories with a Top-25 recovery accuracy of 64%.

---

## 📊 Exploratory Data Analysis (EDA)

Our analysis of the dataset revealed several critical insights into hero performance metrics:
- **Carry Scaling:** We found incredibly strong correlations between Gold Per Minute (GPM) and Experience Per Minute (XPM), with heroes like Shadow Fiend and Invoker dominating both metrics.
- **Support Scaling:** Healing support heroes (like Dazzle and Omniknight) show completely different, non-linear scaling paths compared to traditional GPM/XPM carries, emphasizing the need for balanced drafting.

---

## 💻 Project Interfaces

This repository features two high-end interfaces to interact with the draft simulator.

### 1. The Interactive Next-Gen Web App (`/docs-website`)
We have built an Awwwards-inspired, state-of-the-art web application powered by **React, Vite, TailwindCSS, Framer Motion, and Three.js (React Three Fiber)**.
- Features a massive interactive 3D Neural Network background.
- Contains a fully functional, fluidly animated Draft Simulator terminal.

**To run the web app locally:**
```bash
cd docs-website
npm install
npm run dev
```

### 2. The Standalone HTML Experience (`README.html`)
For quick, drop-in viewing without installing Node modules, simply double-click the `README.html` file in your browser. 
- Features AOS scroll animations.
- Embedded Chart.js data visualizations.
- A functional Vanilla JavaScript simulator.

---

## 🛠️ Tech Stack
- **Machine Learning**: Python, Pandas, NumPy, Jupyter Notebook
- **Data Source**: Kaggle (Valve API)
- **Frontend App**: React 18, Vite, TailwindCSS, Framer Motion, Three.js
- **Standalone UI**: HTML5, Vanilla CSS/JS, AOS.js, Chart.js

---

*Machine Learning Project by Akshay Borse & Amey Baviskar*