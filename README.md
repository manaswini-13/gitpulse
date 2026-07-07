# ⚡ GitPulse — Neo-Brutalist Repository Health Auditor

GitPulse is a high-contrast, production-grade full-stack web application that allows users to perform instant algorithmic "health checks" on public GitHub repositories. Built using a strict Neo-Brutalist design system, it parses live repository data, issue metrics, and commit timelines to output an auditable engineering grade.

## 🛠️ Tech Stack & Architecture
- **Framework:** Next.js (App Router, Server/Client components)
- **Styling:** Tailwind CSS with custom Neo-Brutalist layout modules
- **Data Layer:** Asynchronous integration with the Upstream GitHub REST API

## 🧠 Algorithmic Scoring Engine
The application utilizes a backend computing pipeline (`app/api/pulse/route.js`) to generate a transparent health score out of 100 points based on two key vectors:
1. **Issue Hygiene:** Calculates the ratio of open issues relative to repository traction metrics to monitor support backlogs.
2. **Maintenance Staleness:** Audits the timestamp of the last 30 commits to penalize inactive or abandoned codebases.

## 📈 Learning Journey
I deliberately built this project to challenge myself to acquire and master modern frontend engineering architectures over a short timeline. Through this build, I taught myself:
- Complete component-driven design layouts with fluid CSS text-reveal animations.
- Structuring clean Next.js internal API route handlers with granular HTTP error branches (400, 404, 429).
- Operating advanced version control workflows and maintaining clean code documentation patterns.
