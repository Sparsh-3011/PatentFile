# PatentFile - PRD (Product Requirements Document)

## Original Problem Statement
Build a patent filing website for students to file Indian Design and Utility Patents. Features include 10 AI/ML patent topics, student registration form, tracking system, admin portal, collaboration with KIITPD2S Society, H&P Products, NextCare Foundation under Dr. Anish Pandey. Certificate of filing upon completion. 100% patent grant guarantee. KIITPDS society of KIIT University has 50+ patents granted.

## Architecture
- **Frontend**: React + Tailwind CSS + Shadcn UI
- **Backend**: FastAPI (Python)
- **Database**: MongoDB
- **Auth**: JWT (httpOnly cookies) for admin portal

## User Personas
1. **Students**: Want to file design patents to boost academic profiles
2. **Admin**: Manages applications, updates statuses, tracks pipeline

## Core Requirements
- [x] Landing page with hero, benefits, topics, process, certificate, collaborators sections
- [x] 10 AI/ML design patent topics
- [x] Student application form (Name, Email, Phone, College, Course/Year, Topic, Abstract)
- [x] Application tracking with unique tracking IDs (PAT-XXXXXXXX)
- [x] Admin login (JWT auth with httpOnly cookies)
- [x] Admin dashboard with statistics
- [x] Admin applications management with status updates
- [x] Status pipeline: submitted → under_review → in_progress → abstract_needed → filing → filed → acknowledged → granted

## What's Been Implemented (April 23, 2026)
- Full landing page with Swiss high-contrast design
- Student application form with topic selection
- Application tracking page with progress visualization
- Admin login with brute force protection
- Admin dashboard with stats (total, submitted, in progress, filed)
- Admin applications list with search/filter and status update dialog
- All APIs: auth, topics, applications CRUD, stats
- 100% backend + frontend test pass rate

## Prioritized Backlog
### P0 (Critical)
- None remaining for MVP

### P1 (Important)
- Payment gateway integration (Razorpay) for filing fees
- Email notifications to students on status changes
- Fee amount configuration in admin panel

### P2 (Nice to have)
- Student dashboard (login and view own applications)
- Bulk status update for admin
- Export applications to CSV/Excel
- Analytics dashboard with charts
- Email verification for student applications

## Next Tasks
1. Add payment integration when fee amount is decided
2. Add email notifications
3. Student portal with login
