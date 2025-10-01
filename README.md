# QuantumCalc ⚛️

*Your All-in-One Scientific & Utility Suite, Powered by Gemini.*

[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-blue?logo=tailwindcss)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-5-blue?logo=vite)](https://vitejs.dev/)
[![Gemini API](https://img.shields.io/badge/Gemini_API-Google-blue?logo=google)](https://ai.google.dev/)

QuantumCalc is a comprehensive, web-based suite of calculators and tools designed for students, professionals, and anyone in need of powerful, accessible calculation capabilities. It combines a professional-grade scientific calculator with a wide range of specialized tools for data analysis, finance, health, and everyday conversions.

---

## Key Features

### 🧠 Gemini-Powered Formula Explorer
Go beyond just getting an answer. The integrated **Formula Explorer**, powered by Google's Gemini API, provides clear, concise explanations for mathematical functions in real-time. Understand the *how* and *why* behind your calculations with beautifully rendered LaTeX formulas.

### 📈 Multi-Chart Graphing Suite
Transform data into insight with a versatile visualization tool. The graphing module isn't just a function plotter—it's a complete charting suite that supports:
- **Function Plotting**: Graph complex mathematical functions (`y = f(x)`).
- **Scatter Plots**: Visualize relationships between X,Y data points.
- **Bar & Pie Charts**: Compare categorical data and see proportions at a glance.

### ❤️ Health & Fitness Suite
Track and understand key wellness metrics with a dedicated suite of health calculators, including:
- **BMI Calculator**: Determine your Body Mass Index with support for both metric and imperial units.
- **BMR & Daily Calorie Calculator**: Estimate your basal metabolic rate and daily calorie needs based on your activity level.

### 🛠️ A Full Suite of Specialized Tools
QuantumCalc is more than one calculator—it's a massive collection of specialized utilities designed to handle any task you throw at it, from matrix algebra to mortgage planning.

---

## Getting Started

To run QuantumCalc on your local machine, you'll need [Node.js](https://nodejs.org/) (version 18 or higher) installed.

### 1. Clone the Repository

First, get the project files onto your computer using Git:

```bash
git clone https://github.com/your-repo/quantum-calc.git
cd quantum-calc
```

### 2. Install Dependencies

Install the necessary project dependencies using npm:

```bash
npm install
```

### 3. Set Up Your Gemini API Key

The AI-powered features in QuantumCalc require a Google Gemini API key.

1.  **Get your key:** Visit [Google AI Studio](https://ai.google.dev/) to get your free API key.
2.  **Create an environment file:** In the root of the project (`quantum-calc`), create a new file named `.env`.
3.  **Add your key to the file:** Add the following line to your new `.env` file, replacing `YOUR_API_KEY_HERE` with the key you obtained.
    ```
    API_KEY=YOUR_API_KEY_HERE
    ```

### 4. Run the Development Server

Start the local development server:

```bash
npm run dev
```

The application will now be running at `http://localhost:3000`.

---

## Deployment to Vercel

This project is configured for easy deployment to [Vercel](https://vercel.com/).

### Step 1: Push to a Git Repository

Push your project to a GitHub, GitLab, or Bitbucket repository.

### Step 2: Import Project on Vercel

1.  Go to your Vercel dashboard and click "Add New... > Project".
2.  Import the Git repository you just created.
3.  Vercel will automatically detect that this is a Vite project and configure the build settings correctly.

### Step 3: Configure Environment Variable

Before deploying, you need to add your Gemini API key to Vercel.

1.  In the project settings on Vercel, navigate to the "Environment Variables" section.
2.  Create a new variable with the name `API_KEY`.
3.  Paste your Gemini API key into the value field.
4.  Click "Save".

### Step 4: Deploy

Click the "Deploy" button. Vercel will build and deploy your application.

---

## Tech Stack

- **Framework**: React 19, TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **AI Integration**: Google Gemini API
- **Mathematics Engine**: Math.js
- **Charting**: Recharts

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".

---
## License
This project is licensed under the MIT License. See the `LICENSE` file for details.
