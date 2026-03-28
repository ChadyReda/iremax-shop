-- Supabase Database Schema (to match Prisma models)

-- Enable pgcrypto for UUIDs if needed
-- CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Category Table
CREATE TABLE IF NOT EXISTS "Category" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image TEXT,
  "isMain" BOOLEAN DEFAULT false,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Collection Table
CREATE TABLE IF NOT EXISTS "Collection" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Table (matching default NextAuth/Prisma schema)
CREATE TABLE IF NOT EXISTS "User" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  email TEXT UNIQUE,
  "emailVerified" TIMESTAMP WITH TIME ZONE,
  image TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  role TEXT DEFAULT 'user',
  password TEXT NOT NULL,

  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Product Table
CREATE TABLE IF NOT EXISTS "Product" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  price DOUBLE PRECISION NOT NULL,
  "oldPrice" DOUBLE PRECISION,
  image TEXT NOT NULL,
  gallery JSONB DEFAULT '[]'::jsonb,
  "categoryId" TEXT NOT NULL REFERENCES "Category"(id),
  "collectionId" TEXT REFERENCES "Collection"(id),
  "stockStatus" TEXT DEFAULT 'in-stock',
  "isNew" BOOLEAN DEFAULT false,
  "reviewsCount" INTEGER DEFAULT 0,
  rating DOUBLE PRECISION DEFAULT 0,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order Table
CREATE TABLE IF NOT EXISTS "Order" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" TEXT REFERENCES "User"(id),
  "totalAmount" DOUBLE PRECISION NOT NULL,
  status TEXT DEFAULT 'pending',
  "customerName" TEXT NOT NULL,
  "customerPhone" TEXT NOT NULL,
  "whatsappNumber" TEXT NOT NULL,
  "customerAddress" TEXT NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- OrderItem Table
CREATE TABLE IF NOT EXISTS "OrderItem" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  "orderId" TEXT NOT NULL REFERENCES "Order"(id) ON DELETE CASCADE,
  "productId" TEXT NOT NULL REFERENCES "Product"(id),
  "title" TEXT,
  "image" TEXT,
  quantity INTEGER NOT NULL,
  price DOUBLE PRECISION NOT NULL
);


-- Review Table
CREATE TABLE IF NOT EXISTS "Review" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  rating INTEGER NOT NULL,
  comment TEXT NOT NULL,
  "userId" TEXT NOT NULL REFERENCES "User"(id),
  "productId" TEXT NOT NULL REFERENCES "Product"(id),
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- WishlistItem Table
CREATE TABLE IF NOT EXISTS "WishlistItem" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" TEXT NOT NULL REFERENCES "User"(id),
  "productId" TEXT NOT NULL REFERENCES "Product"(id),
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE("userId", "productId")
);

-- CartItem Table
CREATE TABLE IF NOT EXISTS "CartItem" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" TEXT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
  "productId" TEXT NOT NULL REFERENCES "Product"(id),
  "quantity" INTEGER DEFAULT 1,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE("userId", "productId")
);

-- NextAuth standard tables (if using NextAuth with Supabase/Postgres)
CREATE TABLE IF NOT EXISTS "Account" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" TEXT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  provider TEXT NOT NULL,
  "providerAccountId" TEXT NOT NULL,
  refresh_token TEXT,
  access_token TEXT,
  expires_at INTEGER,
  token_type TEXT,
  scope TEXT,
  id_token TEXT,
  session_state TEXT,
  UNIQUE(provider, "providerAccountId")
);

CREATE TABLE IF NOT EXISTS "Session" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  "sessionToken" TEXT UNIQUE NOT NULL,
  "userId" TEXT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
  expires TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE TABLE IF NOT EXISTS "VerificationToken" (
  identifier TEXT NOT NULL,
  token TEXT UNIQUE NOT NULL,
  expires TIMESTAMP WITH TIME ZONE NOT NULL,
  UNIQUE(identifier, token)
);
