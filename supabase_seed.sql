-- ========================================
-- iRemax Shop Seeding Data
-- ========================================

-- ========================================
-- CATEGORIES
-- ========================================

INSERT INTO "Category" (id, name, slug, description, image, "isMain") VALUES
('cat-001', 'Phone Cases', 'phone-cases', 'Premium protection for your smartphone', 'https://images.unsplash.com/photo-1601784551446-20ac9e923372?w=400', true),
('cat-002', 'Earphones', 'earphones', 'Wireless and wired audio solutions', 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400', true),
('cat-003', 'Chargers & Cables', 'chargers', 'Fast charging and data synchronization', 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400', false),
('cat-004', 'Power Banks', 'power-banks', 'Portable energy on the go', 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400', false),
('cat-005', 'Screen Protectors', 'screen-protectors', 'Crystal clear screen protection', 'https://images.unsplash.com/photo-1616348436918-d2b46e3e8d2f?w=400', false),
('cat-006', 'Phone Holders', 'phone-holders', 'Hands-free convenience', 'https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=400', false),
('cat-007', 'Smartwatches', 'smartwatches', 'Wearable technology', 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400', false),
('cat-008', 'Speakers', 'speakers', 'Portable audio powerhouses', 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400', false);

-- ========================================
-- COLLECTIONS
-- ========================================

INSERT INTO "Collection" (id, name, slug) VALUES
('col-001', 'New Arrivals', 'new-arrivals'),
('col-002', 'Best Sellers', 'best-sellers'),
('col-003', 'Premium Series', 'premium-series'),
('col-004', 'Budget Friendly', 'budget-friendly');

-- ========================================
-- PRODUCTS (30 items)
-- ========================================

-- Phone Cases (8 products)
INSERT INTO "Product" (id, title, slug, description, price, "oldPrice", image, "categoryId", "collectionId", "stockStatus", "isNew", "reviewsCount", rating) VALUES
('prod-001', 'iPhone 15 Pro Max Silicone Case - Midnight Blue', 'iphone-15-pro-max-silicone-midnight', 'Premium soft-touch silicone case with microfiber lining. Shock-resistant protection up to 6ft drop.', 299, 399, 'https://images.unsplash.com/photo-1601784551446-20ac9e923372?w=400', 'cat-001', 'col-002', 'in-stock', false, 45, 4.8),
('prod-002', 'Samsung Galaxy S24 Ultra Clear Case', 'samsung-galaxy-s24-ultra-clear', 'Crystal clear transparent case that resists yellowing. Military-grade protection.', 249, NULL, 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400', 'cat-001', 'col-003', 'in-stock', true, 12, 4.5),
('prod-003', 'iPhone 14 Pro Max MagSafe Clear Case', 'iphone-14-pro-max-magsafe-clear', 'Official MagSafe compatible clear case with built-in magnets for wireless charging.', 349, 399, 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400', 'cat-001', 'col-001', 'in-stock', true, 28, 4.7),
('prod-004', 'Samsung Galaxy Z Fold 5 Premium Leather Case', 'samsung-z-fold-5-leather', 'Genuine leather case with precise cutouts for the foldable display.', 599, NULL, 'https://images.unsplash.com/photo-1623126908029-58cb08a2b272?w=400', 'cat-001', 'col-003', 'low-stock', false, 8, 4.9),
('prod-005', 'iPhone 13 Mini Rugged Case - Black', 'iphone-13-mini-rugged-black', 'Heavy-duty protection with built-in screen protector. Outdoor adventure ready.', 399, 499, 'https://images.unsplash.com/photo-1586943101103-3b03d8c86074?w=400', 'cat-001', 'col-002', 'in-stock', false, 67, 4.6),
('prod-006', 'Google Pixel 8 Pro Fabric Case - Sage', 'google-pixel-8-pro-fabric', 'Sustainable fabric material with comfortable grip. Machine washable.', 199, NULL, 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400', 'cat-001', 'col-004', 'in-stock', false, 33, 4.4),
('prod-007', 'OnePlus 12 Carbon Fiber Case', 'oneplus-12-carbon-fiber', 'Ultra-light carbon fiber pattern case. Premium textured finish.', 279, 329, 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=400', 'cat-001', 'col-003', 'in-stock', false, 19, 4.7),
('prod-008', 'iPhone 15 Plus Liquid Silicone Case - Lavender', 'iphone-15-plus-liquid-silicone-lavender', 'Liquid silicone coating with anti-fingerprint properties. Soft microfiber interior.', 249, NULL, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', 'cat-001', 'col-001', 'in-stock', true, 5, 4.3);

-- Earphones (6 products)
INSERT INTO "Product" (id, title, slug, description, price, "oldPrice", image, "categoryId", "collectionId", "stockStatus", "isNew", "reviewsCount", rating) VALUES
('prod-009', 'AirPods Pro 2nd Generation', 'airpods-pro-2nd-gen', 'Active Noise Cancellation, Adaptive Transparency, Personalized Spatial Audio.', 1499, NULL, 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=400', 'cat-002', 'col-002', 'in-stock', false, 234, 4.9),
('prod-010', 'Samsung Galaxy Buds2 Pro', 'samsung-galaxy-buds2-pro', '24-bit Hi-Fi sound, ANC, IPX7 water resistance.', 899, 1099, 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400', 'cat-002', 'col-003', 'in-stock', false, 156, 4.7),
('prod-011', 'Apple AirPods 3rd Generation', 'airpods-3rd-gen', 'Spatial Audio, force sensor controls, MagSafe charging case.', 999, NULL, 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=400', 'cat-002', 'col-001', 'in-stock', true, 89, 4.6),
('prod-012', 'Sony WF-1000XM5 Earbuds', 'sony-wf-1000xm5', 'Industry-leading noise cancellation, LDAC support, 8hr battery.', 1699, 1899, 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400', 'cat-002', 'col-003', 'in-stock', false, 78, 4.8),
('prod-013', 'Xiaomi Redmi Buds 4 Pro', 'xiaomi-redmi-buds-4-pro', 'ANC up to 43dB, 36hr total battery life, dual devices connection.', 399, NULL, 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400', 'cat-002', 'col-004', 'in-stock', false, 145, 4.3),
('prod-014', 'Nothing Ear (2)', 'nothing-ear-2', 'Personalized sound profile, hybrid ANC, dual connection.', 699, NULL, 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400', 'cat-002', 'col-001', 'in-stock', true, 42, 4.5);

-- Chargers & Cables (5 products)
INSERT INTO "Product" (id, title, slug, description, price, "oldPrice", image, "categoryId", "collectionId", "stockStatus", "isNew", "reviewsCount", rating) VALUES
('prod-015', 'Apple 35W Dual USB-C Charger', 'apple-35w-dual-charger', 'Fast charge two devices simultaneously. Compact folding design.', 499, NULL, 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400', 'cat-003', 'col-002', 'in-stock', false, 198, 4.8),
('prod-016', 'Anker 65W GaN Fast Charger', 'anker-65w-gan-charger', 'GaN technology, 3 ports, PD compatible. 50% smaller than traditional.', 699, 899, 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400', 'cat-003', 'col-003', 'in-stock', false, 267, 4.7),
('prod-017', 'Apple MFi Lightning Cable 1m', 'apple-mfi-lightning-1m', 'Original MFi certified, braided design, fast charging support.', 299, NULL, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', 'cat-003', 'col-004', 'in-stock', false, 412, 4.6),
('prod-018', 'Samsung 45W USB-C Charger', 'samsung-45w-usb-c-charger', 'Super Fast Charging 2.0, includes 5A USB-C cable.', 499, NULL, 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400', 'cat-003', 'col-002', 'in-stock', false, 87, 4.5),
('prod-019', 'Anker 100W USB-C Cable 2m', 'anker-100w-usb-c-cable', 'E-marker chip, 100W power delivery, 10Gbps data transfer.', 249, NULL, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', 'cat-003', 'col-004', 'in-stock', false, 156, 4.4);

-- Power Banks (4 products)
INSERT INTO "Product" (id, title, slug, description, price, "oldPrice", image, "categoryId", "collectionId", "stockStatus", "isNew", "reviewsCount", rating) VALUES
('prod-020', 'Anker 20000mAh Power Bank 65W', 'anker-20000mah-65w', '65W output, charges laptop, 3 output ports, digital display.', 1299, 1499, 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400', 'cat-004', 'col-003', 'in-stock', false, 234, 4.8),
('prod-021', 'Xiaomi 10000mAh Power Bank 22.5W', 'xiaomi-10000mah-22-5w', 'Compact design, 22.5W fast charge, dual output.', 399, NULL, 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400', 'cat-004', 'col-004', 'in-stock', false, 567, 4.5),
('prod-022', 'Samsung 20000mAh Wireless Power Bank', 'samsung-20000mah-wireless', 'Wireless charging, 25W wired, dual charging capability.', 899, NULL, 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400', 'cat-004', 'col-002', 'in-stock', false, 89, 4.6),
('prod-023', 'Romoss 30000mAh Power Bank', 'romoss-30000mah', 'High capacity, 3 input ports, smart protection.', 599, 699, 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400', 'cat-004', 'col-004', 'in-stock', false, 345, 4.2);

-- Screen Protectors (3 products)
INSERT INTO "Product" (id, title, slug, description, price, "oldPrice", image, "categoryId", "collectionId", "stockStatus", "isNew", "reviewsCount", rating) VALUES
('prod-024', 'iPhone 15 Pro Max Tempered Glass 3-Pack', 'iphone-15-pro-max-tempered-glass', '9H hardness, anti-fingerprint, bubble-free installation.', 199, NULL, 'https://images.unsplash.com/photo-1616348436918-d2b46e3e8d2f?w=400', 'cat-005', 'col-002', 'in-stock', false, 678, 4.7),
('prod-025', 'Samsung Galaxy S24 Ultra Glass Protector', 'samsung-s24-ultra-glass', 'Ultra-thin 0.3mm, case-friendly, blue light filter.', 249, 299, 'https://images.unsplash.com/photo-1616348436918-d2b46e3e8d2f?w=400', 'cat-005', 'col-003', 'in-stock', false, 234, 4.6),
('prod-026', 'Privacy Screen Protector iPhone 14 Pro', 'iphone-14-pro-privacy-glass', 'Anti-spy technology, blocks side visibility, 9H protection.', 299, NULL, 'https://images.unsplash.com/photo-1616348436918-d2b46e3e8d2f?w=400', 'cat-005', 'col-001', 'in-stock', true, 56, 4.4);

-- Phone Holders (2 products)
INSERT INTO "Product" (id, title, slug, description, price, "oldPrice", image, "categoryId", "collectionId", "stockStatus", "isNew", "reviewsCount", rating) VALUES
('prod-027', 'Magnetic Car Mount Wireless Charger', 'magnetic-car-mount-wireless', '15W fast wireless charging, strong magnetic hold, one-hand operation.', 499, NULL, 'https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=400', 'cat-006', 'col-002', 'in-stock', false, 189, 4.5),
('prod-028', 'Desk Phone Stand Adjustable', 'desk-phone-stand-adjustable', 'Aluminum alloy, 360° rotation, height adjustable, non-slip base.', 299, 399, 'https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=400', 'cat-006', 'col-004', 'in-stock', false, 267, 4.7);

-- Smartwatches (1 product)
INSERT INTO "Product" (id, title, slug, description, price, "oldPrice", image, "categoryId", "collectionId", "stockStatus", "isNew", "reviewsCount", rating) VALUES
('prod-029', 'Apple Watch Series 9 GPS 45mm', 'apple-watch-series-9-45mm', 'S9 chip, always-on display, health sensors, 18hr battery.', 2699, NULL, 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400', 'cat-007', 'col-001', 'in-stock', true, 45, 4.9);

-- Speakers (1 product)
INSERT INTO "Product" (id, title, slug, description, price, "oldPrice", image, "categoryId", "collectionId", "stockStatus", "isNew", "reviewsCount", rating) VALUES
('prod-030', 'JBL Flip 6 Portable Speaker', 'jbl-flip-6', '12hr battery, IP67 waterproof, PartyBoost, powerful bass.', 999, NULL, 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400', 'cat-008', 'col-002', 'in-stock', false, 312, 4.6);

-- ========================================
-- VERIFICATION
-- ========================================

-- Check counts
SELECT 'Categories' as table_name, COUNT(*) as count FROM "Category"
UNION ALL
SELECT 'Collections', COUNT(*) FROM "Collection"
UNION ALL
SELECT 'Products', COUNT(*) FROM "Product";