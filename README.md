BuddyHelp — tools and help marketplace (TaskRabbit-style)

Stack: Next.js App Router, TypeScript, Tailwind v4, Prisma + SQLite (file DB for portability).

Run locally
```bash
cd /Users/twessels/Desktop/code/buddyhelp
npm run dev
# http://localhost:3000
```

Quick start
- Create user: open `/signup` and create an account. Copy the returned `id`.
- Create listing: open `/listings/new` and paste your user id as `ownerId`.
- Book listing: open the listing page and submit the booking form.
- Favorites: on home, add your `userId` in the header form to enable favorite toggles.
- Messages: `/messages?listingId=...&userAId=OWNER_ID&userBId=YOUR_ID&me=YOUR_ID`.
- Dashboard: `/dashboard?userId=YOUR_ID`.

APIs
- Listings: `GET/POST /api/listings`
- Bookings: `GET/POST /api/bookings`; form handler: `POST /api/bookings/create`
- Users: `GET/POST /api/users`
- Favorites: `GET/POST /api/favorites`
- Conversations: `GET/POST /api/conversations`
- Messages: `POST /api/messages`
- Reviews: `GET/POST /api/reviews`
- Top 20: `GET /api/top`
- Health: `GET /api/health`

Deploy (Vercel)
1) Push to GitHub, then import in Vercel.
2) Build command: `npm run build` (postinstall runs `prisma generate`).
3) No extra env needed for SQLite.

