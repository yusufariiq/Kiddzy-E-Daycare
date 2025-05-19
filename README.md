# 🧸 Kiddzy E-Daycare

**Kiddzy E-Daycare** is a web platform designed to help parents easily search, explore, and book daycare services for their children. The application serves as a digital bridge between parents and trusted childcare providers.

---

## 📌 Features

👩‍👧 **User Role: Parent**

- Register & login
- View and book daycare services
- Manage bookings and child information
- Contact daycare providers

🧑‍💼 **User Role: Admin**

- Manage users and providers
- View booking statistics
- Access contact requests

---

## 🧱 Tech Stack

| Layer    | Technology           |
| -------- | -------------------- |
| Frontend | Next.js, TypeScript  |
| Styling  | Tailwind CSS         |
| Database | MongoDB              |
| Auth     | JWT (JSON Web Token) |

## 🔐 Authentication & Authorization

- **JWT-based authentication**
- **Role-based access control**
- `admin`: Full access to platform management
- `user`: Parents who can browse and book services

## 📁 Folder Structure

```
src/
├── app/
│ └── api/ # API routes (auth, booking, admin, etc.)
├── config/ # DB connection and config
├── lib/ # Controllers, services, repositories
├── utils/ # Utility functions
```

## To Run Locally

```
git clone https://github.com/yusufariiq/Kiddzy-E-Daycare
cd kiddzy-e-daycare
npm install
cp .env
npm run dev
```
