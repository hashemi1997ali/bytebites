# 🍽️ ByteBites

ByteBites is a modern recipe discovery and personal cookbook web app built with **Next.js, React, Prisma, and PostgreSQL**.
Users can browse recipes, search for meals, filter by cuisine or diet type, and save their favourite recipes to a personal cookbook.

Because apparently even deciding what to eat now needs a full-stack application. 🍝

---

## 🚀 Live Demo

🔗 **Website:**  
Click [here](https://bytebites-gules.vercel.app) to view the live demo.

---

## 👥 Team

* Ali
* Jochen
* Moritz

---

## 📌 Project Overview

ByteBites is a recipe platform where users can discover meals, view detailed recipe pages, and save recipes to their own cookbook.

The goal of this project was to build a full-stack web application with a clean UI, database integration, filtering logic, and a simple admin area for managing recipes.

---

## ✨ Features

### 🍲 Recipe Discovery

* Browse different recipes
* View featured recipes
* Open detailed recipe pages
* See cooking time, servings, category, cuisine, and diet labels

### 🔍 Search and Filters

* Search recipes by title
* Filter by category, cuisine, and diet type
* Sort recipes by newest, quickest, or A–Z
* Use pagination for easier browsing

### 📖 Personal Cookbook

* Save favourite recipes
* Add personal notes
* Remove saved recipes
* Cookbook data is stored locally in the browser

### 🛠️ Admin Dashboard

* Admin login
* Create new recipes
* Edit existing recipes
* Delete recipes
* Mark recipes as featured

### 🗄️ Database and API

* PostgreSQL database
* Prisma ORM
* Neon database integration
* Spoonacular API support for recipe data

---

## 🛠️ Technologies Used

* Next.js
* React
* JavaScript
* CSS
* Prisma
* PostgreSQL
* Neon
* Spoonacular API
* LocalStorage

---

## ⚙️ Getting Started

Clone the repository and install the dependencies:

```bash
git clone https://github.com/hashemi1997ali/bytebites.git
cd bytebites
npm install
```

Create a `.env` file and add your environment variables:

```env
DATABASE_URL=your_database_url
SPOONACULAR_API_KEY=your_api_key
ADMIN_USER=your_admin_username
ADMIN_PASS=your_admin_password
ADMIN_TOKEN_SECRET=your_secret_key
```

Start the development server:

```bash
npm run dev
```

Open the project in your browser:

```txt
http://localhost:3003
```

---

## 📜 Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run seed     # Seed recipe data
```

---

## 🎯 Learning Goals

This project was created to practice:

* Full-stack development with Next.js
* Database handling with Prisma
* Working with PostgreSQL and Neon
* Using external APIs
* Search, filter, sort, and pagination logic
* LocalStorage persistence
* Admin authentication
* CRUD functionality
* Responsive UI design

---

## ⚠️ Disclaimer

This project uses recipe data from the Spoonacular API for educational and portfolio purposes.
It is not an official nutrition or medical recommendation platform.

---

## 📝 Notes

Recipe data is stored in a database, while the personal cookbook is stored locally in the browser.

Admin access is protected with a simple token-based authentication system.
