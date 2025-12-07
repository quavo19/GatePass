# Bridge Blueprint GatePass - Angular Frontend

[🌐 Live Demo](https://curious-lolly-f1d397.netlify.app)
[📦 Frontend Repo](https://github.com/quavo19/GatePass) | [🛠 Backend API](https://github.com/quavo19/GatePassApi)

---

## 🚀 Project Overview

**Bridge Blueprint GatePass** is a simple, responsive **check-in / check-out system** built with **Angular 17** (frontend) and **Rails 8** (backend).

It is designed to streamline visitor management by allowing:

- Visitors to check in with personal details
- Automatic ticket generation for checkout
- Admins to track logs and analytics

The app is fully responsive and styled using **Tailwind CSS**.

---

## 🎯 Features

### For Users

- Enter visitor information
- Receive a check-in ticket
- Check out using the ticket

### For Admins

- View visitor logs
- Track top visits and analytics

### Authentication

- **User:** `user@example.com` / `password123`
- **Admin:** `admin@example.com` / `password123`

---

## 🖼 Screenshots

### User Check-In

![User Check-In](./screenshots/user-checkin.png)

### Admin Dashboard

![Admin Dashboard](./screenshots/admin-dashboard.png)

_(Replace placeholders with actual screenshots.)_

---

## 💻 Tech Stack

| Layer    | Technology                                              |
| -------- | ------------------------------------------------------- |
| Frontend | Angular 17, Tailwind CSS                                |
| Backend  | Ruby on Rails 8, PostgreSQL                             |
| Hosting  | Frontend: Netlify, Backend: Render / Local Rails Server |

---

## ⚡ Quick Start - Frontend

1. Clone the repository:

```bash
git clone https://github.com/quavo19/GatePass.git
cd GatePass
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
ng serve
```

4. Open your browser at [http://localhost:4200](http://localhost:4200)

---

## ⚡ Quick Start - Backend

1. Clone the Rails API repo:

```bash
git clone https://github.com/quavo19/GatePassApi.git
cd GatePassApi
```

2. Install Ruby dependencies:

```bash
bundle install
```

3. Create and migrate the database:

```bash
rails db:create
rails db:migrate
```

4. Start the Rails server:

```bash
rails s
```

5. Make sure the frontend points to your backend API (default: `http://localhost:3000`)

---

## 📝 Notes

- If the live backend is unavailable, running the Rails backend locally is necessary.
- Tailwind CSS is used for fast, responsive UI development.
- Admin dashboards provide analytics and logs for better visitor management.

---

## 📜 License

MIT License © Bridge Blueprint Solutions
