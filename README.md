# MarketSpace — Digital Asset Marketplace

A production-ready digital marketplace built with Next.js 16, Tailwind CSS v4, Prisma, Clerk, and Stripe.

## 🚀 One-Click Vercel Deployment

1.  **Push to GitHub**: Push this repository to your GitHub account.
2.  **Import to Vercel**: Connect your repository to Vercel.
3.  **Environment Variables**: add the following keys in the Vercel Dashboard:

### Database (PostgreSQL)
- `DATABASE_URL`: Your PostgreSQL connection string (Supabase/Neon/Railway).

### Authentication (Clerk)
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: From your Clerk dashboard.
- `CLERK_SECRET_KEY`: From your Clerk dashboard.

### Payments (Stripe)
- `STRIPE_SECRET_KEY`: Your Stripe secret key.
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Your Stripe publishable key.
- `STRIPE_WEBHOOK_SECRET`: Your Stripe webhook signing secret (get this from the Stripe CLI or dashboard after configuring `/api/webhooks/stripe`).

### Storage (Supabase)
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon key.

### App Config
- `NEXT_PUBLIC_APP_URL`: Your production domain (e.g., `https://marketspace.vercel.app`).

## 🛠️ Local Development

```bash
# 1. Install dependencies
npm install --legacy-peer-deps

# 2. Setup database
npx prisma generate
npx prisma migrate dev

# 3. Start dev server
npm run dev
```

## 📦 Features
- **Buyer/Seller Flows**: Complete marketplace lifecycle.
- **Stripe Connect**: Automatic payouts and commissions (stubbed).
- **Supabase Storage**: Secure asset management.
- **Tailwind v4**: Next-generation styling.
- **Next.js 16**: High-performance App Router architecture.
