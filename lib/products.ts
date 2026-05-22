// Admin write operations have moved to server-side API routes:
//   POST   /api/admin/products          — create product
//   PATCH  /api/admin/products/[id]     — update product + relations
//   DELETE /api/admin/products/[id]     — delete product
//
// Server-side reads are in lib/products-server.ts
