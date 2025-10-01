# QuantumCalc ⚛️

*Your All-in-One Scientific & Utility Suite, Powered by Gemini.*

[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-blue?logo=tailwindcss)](https://tailwindcss.com/)
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

## Full Feature List

### Core Tools
- **Scientific Calculator**: Full-featured with a "2nd function" key, memory, constants, and a ticker-tape history.
- **Graphing Suite**: Multi-mode charting for functions, scatter, bar, and pie charts.
- **History**: Saves your recent calculations for easy access, with the ability to "favorite" important entries.

### Mathematical Tools
- **Matrix Calculator**: Perform matrix operations like addition, multiplication, determinant, inverse, and transpose.
- **Statistics Calculator**: Instantly compute key statistical metrics (mean, median, standard deviation, etc.).
- **Equation Solver**: Solve linear and quadratic equations for 'x' with a step-by-step formula explainer.

### Financial Tools
- **Comprehensive Financial Suite**: A collection of over 15 calculators including:
  - Mortgage, Loan, and Auto Loan Calculators with amortization schedules.
  - Retirement, Investment, and Compound Interest projectors.
  - Tax, Salary, and Inflation calculators.

### Health & Fitness Tools
- **BMI Calculator**: Calculates Body Mass Index from height and weight.
- **BMR Calculator**: Estimates Basal Metabolic Rate.
- **Daily Calorie Calculator**: Recommends daily calorie intake for weight goals.

### Converters
- **Unit Converter**: Convert between units for Length, Mass, Temperature, Time, and Data Storage.
- **Currency Converter**: Get real-time exchange rates for over 160 currencies.
- **Percentage Calculator**: Quickly solve three different types of common percentage problems.
- **Base Converter**: Real-time conversion between Binary, Octal, Decimal, and Hexadecimal.

### Utility Tools
- **Date Calculator**: Calculate the duration between two dates or add/subtract time from a date.

---

## Getting Started

Welcome! To get QuantumCalc running on your local machine, you'll need to serve the files using a local web server. **You cannot simply open the `index.html` file directly in your browser.**

Here's a quick guide for developers, followed by a more detailed step-by-step walkthrough.

### Quick Start (For Developers)

```bash
# 1. Clone the repo
git clone https://github.com/your-repo/quantum-calc.git
cd quantum-calc

# 2. Start a local server (requires Node.js)
npx serve

# 3. Open the app in your browser (usually http://localhost:3000)
# 4. Navigate to More > Settings and add your Google Gemini API key.
```

---

### Step-by-Step Guide

#### Step 1: Get the Code

First, you need to get the project files onto your computer.

**Option A: Using Git (Recommended)**
If you have Git installed, open your terminal and run this command:
```bash
git clone https://github.com/your-repo/quantum-calc.git
cd quantum-calc
```
*(Note: Replace the URL with the actual repository URL if you have it.)*

**Option B: Download ZIP**
If you don't use Git, you can download the project as a ZIP file from the repository's main page. Unzip the file to a location of your choice.

#### Step 2: Run a Local Web Server

Modern web applications need to be run from a web server for security and functionality reasons. Here are three easy ways to do this from your project folder:

**Option 1: Using `npx serve` (Easiest Method)**
This is the simplest way if you have [Node.js](https://nodejs.org/) installed.
1. Open your terminal in the project's root directory (`quantum-calc`).
2. Run the command:
   ```bash
   npx serve
   ```
3. Your terminal will show a local address, usually `http://localhost:3000`. Open this URL in your web browser.

**Option 2: Using VS Code's "Live Server" Extension**
If you use Visual Studio Code:
1. Install the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension from the VS Code Marketplace.
2. Open the `quantum-calc` folder in VS Code.
3. Right-click the `index.html` file in the file explorer and choose "Open with Live Server".
4. A browser window will automatically open with the application running.

**Option 3: Using Python's Built-in Server**
If you have Python installed, you can use its simple web server.
1. Open your terminal in the project's root directory.
2. Run one of these commands, depending on your Python version:
   ```bash
   # For Python 3
   python -m http.server

   # For Python 2
   python -m SimpleHTTPServer
   ```
3. Open your browser and go to `http://localhost:8000`.

#### Step 3: Set Up Your Gemini API Key

The AI-powered features in QuantumCalc, like the Formula Explorer, require a Google Gemini API key.

1.  **Get your key:** Visit [Google AI Studio](https://ai.google.dev/) to get your free API key.
2.  **Run the application:** Make sure QuantumCalc is running in your browser using one of the methods from Step 2.
3.  **Enter the key in settings:**
    - In the app, navigate to **More > Settings**.
    - Paste your API key into the input field.
    - Click **Save**.

Your key is stored securely in your browser's local storage and is never sent to our servers.

*(For developers: The application can also read from a `process.env.API_KEY` environment variable, which is useful for hosted deployments. However, for local use, the in-app setting is the recommended method.)*

---

## Deployment

This project uses Vite for its build process. When you run `npm run build`, Vite will generate the production-ready files in a directory named `dist`.

If you are deploying this application to a hosting service like Vercel, Netlify, or GitHub Pages, you may need to configure the **Output Directory** in your project's build settings. Make sure to set it to `dist` to match Vite's output. If you don't, you might see an error that the build output (e.g., a `build` folder) could not be found.

---

## Tech Stack

- **Frontend**: React 19, TypeScript
- **Styling**: Tailwind CSS
- **AI Integration**: Google Gemini API
- **Mathematics Engine**: Math.js
- **Charting**: Recharts

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".

1.  **Fork the Project**
2.  **Create your Feature Branch** (`git checkout -b feature/AmazingFeature`)
3.  **Commit your Changes** (`git commit -m 'Add some AmazingFeature'`)
4.  **Push to the Branch** (`git push origin feature/AmazingFeature`)
5.  **Open a Pull Request**

### Reporting Bugs

If you encounter a bug, please open an issue on the repository. Be sure to include:
- A clear and descriptive title.
- A detailed description of the problem, including steps to reproduce it.
- Screenshots or screen recordings, if applicable.
- Information about your environment (browser, OS).

---

## About the Supplier (EDGTEC)
This application is provided by EDGTEC. The following information is based on the Central Supplier Database (CSD) Registration Report.

### Supplier Identification
| Field                                 | Detail                                      |
| ------------------------------------- | ------------------------------------------- |
| **Supplier Number**                   | MAAA1626554                                 |
| **Legal Name**                        | EDGTEC                                      |
| **Supplier Type**                     | CIPC Company - Private Company (Pty)(Ltd)   |
| **Registration Number**               | 2025/534716/07                              |
| **Business Status**                   | In Business                                 |
| **Country of Origin**                 | South Africa                                |
| **Total Annual Turnover**             | R10 million or less                         |
| **Tax Status**                        | Tax Compliant                               |

### Ownership Structure
EDGTEC is a 100% black-owned and 100% youth-owned enterprise.
| Owner Name                     | RSA Citizen | Ethnic Group    |
| ------------------------------ | ----------- | --------------- |
| Ranthutu Lepheane              | Yes         | Black African   |
| Siphosakhe Mathews Msimango    | Yes         | Black African   |

### Contact Information
**Primary Contact (Preferred)**
- **Name**: Ranthutu Lepheane
- **Type**: Bid Office
- **Email**: r.lepheane@outlook.com
- **Cellphone**: +277 11 84 6709

**Secondary Contact**
- **Name**: Siphosakhe Mathews Msimango
- **Type**: Administration, Bid Office
- **Email**: siphosakhemsimanngo@gmail.com
- **Cellphone**: 069 423 7030

### Registered Address
106312 NGWABE STREET KWA-THEMA MINI SELECOURT, SPRINGS, Springs Central, Gauteng, 1575, South Africa

---

## License
This project is licensed under the MIT License. See the `LICENSE` file for details.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.