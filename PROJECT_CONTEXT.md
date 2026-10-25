# Smart Faculty Leave Management System

## Project Purpose

A web-based leave management system for university/college
faculty members.

The system allows faculty to apply for leave digitally,
HODs to approve/reject leave requests, and administrators
to manage faculty, departments and the overall system.

---

# Technology Stack

Frontend:
- Next.js
- React
- TypeScript
- Tailwind CSS

Backend:
- Next.js API Routes / Server Actions

Database:
- Supabase PostgreSQL

Authentication:
- Supabase Auth

Authorization:
- Supabase Row Level Security (RLS)

Deployment:
- Vercel

Version Control:
- GitHub

---

# User Roles

1. Faculty
2. HOD
3. Admin

---

# Faculty Features

- Login
- Dashboard
- Profile
- Apply for leave
- Select leave type
- Select start and end dates
- Enter reason
- Submit leave request
- View leave history
- View leave status
- Cancel eligible leave requests
- Receive notifications

---

# HOD Features

- Login
- Dashboard
- View pending leave requests
- View leave details
- Approve leave
- Reject leave
- Add rejection reason
- View leave history
- View faculty under department
- Notifications

---

# Admin Features

- Login
- Dashboard
- Manage faculty
- Manage HODs
- Manage departments
- Manage leave types
- View leave records
- Generate reports
- Manage users

---

# Leave Status

A leave request can have:

- Pending
- Approved
- Rejected
- Cancelled

---

# Important Architecture Rules

DO NOT create a separate project.

DO NOT create a separate database.

DO NOT create a separate authentication system.

DO NOT redesign existing components without permission.

Always inspect existing code before modifying it.

Reuse existing components.

Maintain the existing design system.

Do not duplicate components.

Do not change database structure without documenting it.

Do not break existing functionality.

---

# Design Requirements

The website should look like a professional university
management portal.

Design must be:

- Modern
- Clean
- Professional
- Responsive
- Consistent
- Suitable for real-world university deployment

All dashboards must follow the same visual language.

Use the existing:
- Navbar
- Sidebar
- Buttons
- Cards
- Tables
- Forms
- Modals
- Notifications
- Typography
- Spacing

Do not create different designs for each role.

---

# Database

The project uses ONE shared Supabase project.

All developers must use the same database.

Core tables include:

profiles
departments
leave_types
leave_requests
notifications

Relationships must be maintained consistently.

---

# Development Rule

Before making any change:

1. Read this file.
2. Inspect the existing project.
3. Identify related components.
4. Reuse existing components.
5. Implement only the assigned feature.
6. Test the feature.
7. Make sure existing functionality still works.
