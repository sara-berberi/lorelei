-- Creates the product_templates table backing the "new product" templates
-- feature in the admin panel.
--
-- Apply with either:
--   npx prisma db push          (matches how the rest of this schema is managed)
-- or by running this file directly against the database.

CREATE TABLE IF NOT EXISTS "product_templates" (
  "id"          SERIAL PRIMARY KEY,
  "name"        VARCHAR(120) NOT NULL,
  "description" TEXT,
  "price"       DOUBLE PRECISION,
  "salePrice"   DOUBLE PRECISION,
  "category"    VARCHAR(100),
  "brand"       VARCHAR(100),
  "sizes"       TEXT,
  "stock"       INTEGER,
  "isOnSale"    BOOLEAN NOT NULL DEFAULT false,
  "isSoldOut"   BOOLEAN NOT NULL DEFAULT false,
  "productName" VARCHAR(255),
  "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
