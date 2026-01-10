# VOGUEX - The Future of Fashion E-Commerce

[![Next.js](https://img.shields.io/badge/Next.js-15.0-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![Django](https://img.shields.io/badge/Django-4.1-092E20?style=for-the-badge&logo=django&logoColor=white)](https://www.djangoproject.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Deploy on Render](https://img.shields.io/badge/Deploy-Render-black?style=for-the-badge&logo=render&logoColor=white)](https://render.com/)

**VogueX** is a next-generation fashion e-commerce platform that blends immersive design with cutting-edge AI. Built for the modern consumer, it features real-time interaction, AI-driven recommendations, and a seamless shopping experience across devices.

---

## 🚀 Key Features

### 🛍️ Immersive Shopping Experience
- **Modern UI/UX**: Built with **Next.js 15** and **Tailwind CSS v4** for lightning-fast performance and stunning aesthetics.
- **Dynamic Animations**: Powered by **Framer Motion** for fluid transitions and micro-interactions.
- **3D Elements**: Integrated **React Three Fiber** for immersive product showcases.

### 🧠 AI & Personalization
- **Smart Recommendations**: Custom machine learning engine (TF-IDF & SVD) built with **Scikit-Learn** & **Pandas** suggests products based on user behavior.
- **Visual Intelligence**: Recommendations inspired by your browsing history and interactions.

### 🎙️ Voice Commerce
- **VoiceOrb**: Navigate and shop hands-free with our custom voice assistant.

### ⚡ Real-Time Interactions
- **Live Notifications**: Powered by **Django Channels** and **WebSockets**.
- **Instant Updates**: Real-time order tracking and inventory status.

### 🛡️ Secure & Scalable Backend
- **Robust API**: RESTful architecture built with **Django REST Framework**.
- **Database**: **PostgreSQL** for production-grade data integrity.
- **Payments**: Integrated **Stripe** and **Razorpay** for secure global transactions.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4, Radix UI
- **State Management**: Zustand
- **Animations**: Framer Motion
- **Maps**: React Leaflet
- **Authentication**: Firebase Auth

### Backend
- **Framework**: Django 4.1 + Django REST Framework
- **Database**: PostgreSQL (Production), SQLite (Dev)
- **ML/AI**: Scikit-learn, NumPy, Pandas
- **Real-time**: Django Channels, Redis
- **Server**: Gunicorn, WhiteNoise

### DevOps
- **Deployment**: Vercel (Frontend), Render (Backend)
- **Containerization**: Docker support available

---

## 🏁 Getting Started

### Prerequisites
- Node.js 18+
- Python 3.10+
- Git

### Installation

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/Angrajkarn/Shopping-website-VogueX.git
    cd Shopping-website-VogueX
    ```

2.  **Frontend Setup**
    ```bash
    npm install
    npm run dev
    ```
    The frontend will start at `http://localhost:3000`.

3.  **Backend Setup**
    ```bash
    cd backend
    python -m venv venv
    
    # Windows
    venv\Scripts\activate
    # Mac/Linux
    source venv/bin/activate
    
    pip install -r requirements.txt
    python manage.py migrate
    python manage.py runserver
    ```
    The backend will start at `http://127.0.0.1:8000`.

---

## 🌍 Deployment

This project is fully configured for cloud deployment.

### Frontend (Vercel)
Connect your GitHub repo to Vercel and set `NEXT_PUBLIC_API_URL` to your backend URL.

### Backend (Render)
Connect your GitHub repo to Render as a Web Service.
- **Build Command**: `./build.sh`
- **Start Command**: `gunicorn config.wsgi:application --log-file -`
- **Env Vars**: `DATABASE_URL` (Internal Postgres), `SECRET_KEY`, `DEBUG=False`.

See detailed [Deployment Guide](DEPLOYMENT_GUIDE.md) included in the repo.

---

## 🤝 Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any enhancements.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

**Built with ❤️ by [Angraj Karn](https://github.com/Angrajkarn)**
