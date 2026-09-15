-- Seed Data for Product Catalog
-- Run this AFTER 001_schema.sql

-- Products
insert into products (id, name, slug, description, category, base_price, is_active) values
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567801', 'Anaar phulkari shawl', 'anaar-phulkari-shawl', 'Hand-embroidered phulkari shawl with pomegranate motifs, worked on hand-loomed khaddar over several weeks.', 'Shawls', 6500.00, true),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567802', 'Gulmohar kurta', 'gulmohar-kurta', 'Chikankari-inspired floral kurta in soft lawn, finished with a hand-stitched hem.', 'Kurtas', 4200.00, true),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567803', 'Neelam cushion pair', 'neelam-cushion-pair', 'A pair of mirror-work cushion covers in deep indigo, backed in raw cotton.', 'Home', 2800.00, true),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567804', 'Zaitoon table runner', 'zaitoon-table-runner', 'Olive-branch thread work on natural linen — a table runner for six place settings.', 'Home', 3100.00, true),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567805', 'Mahi dupatta', 'mahi-dupatta', 'Fish-scale embroidery on sheer cotton voile, a lightweight dupatta for all seasons.', 'Dupattas', 5200.00, true),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567806', 'Roshan cushion pair', 'roshan-cushion-pair', 'Gold thread geometric motifs on deep indigo cotton, backed in natural linen.', 'Home', 3400.00, true);

-- Product Images (placeholder URLs — replace with real Supabase Storage URLs later)
insert into product_images (product_id, url, alt_text, sort_order) values
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567801', '/images/anaar-phulkari-shawl.jpg', 'Anaar phulkari shawl — hand-embroidered pomegranate motifs on khaddar', 0),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567802', '/images/gulmohar-kurta.jpg', 'Gulmohar kurta — chikankari-inspired floral embroidery on lawn', 0),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567803', '/images/neelam-cushion-pair.jpg', 'Neelam cushion pair — mirror-work in deep indigo', 0),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567804', '/images/zaitoon-table-runner.jpg', 'Zaitoon table runner — olive-branch thread work on linen', 0),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567805', '/images/mahi-dupatta.jpg', 'Mahi dupatta — fish-scale embroidery on cotton voile', 0),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567806', '/images/roshan-cushion-pair.jpg', 'Roshan cushion pair — gold thread geometric motifs on indigo', 0);

-- Product Variants
insert into product_variants (product_id, fabric, color, size, price_modifier, stock_quantity, sku) values
  -- Anaar phulkari shawl
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567801', 'Khaddar', 'Maroon', 'One size', 0.00, 4, 'APS-KHA-MAR-OS'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567801', 'Khaddar', 'Indigo', 'One size', 300.00, 2, 'APS-KHA-IND-OS'),
  -- Gulmohar kurta
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567802', 'Lawn', 'Ivory', 'M', 0.00, 6, 'GK-LAW-IVR-M'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567802', 'Lawn', 'Ivory', 'L', 0.00, 3, 'GK-LAW-IVR-L'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567802', 'Lawn', 'Dusty rose', 'M', 200.00, 1, 'GK-LAW-DRS-M'),
  -- Neelam cushion pair
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567803', 'Cotton', 'Indigo', '16x16 in', 0.00, 8, 'NCP-COT-IND-16'),
  -- Zaitoon table runner
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567804', 'Linen', 'Olive', '72 in', 0.00, 5, 'ZTR-LIN-OLI-72'),
  -- Mahi dupatta
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567805', 'Cotton voile', 'Ivory', 'One size', 0.00, 3, 'MD-CVO-IVR-OS'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567805', 'Cotton voile', 'Indigo', 'One size', 400.00, 2, 'MD-CVO-IND-OS'),
  -- Roshan cushion pair
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567806', 'Cotton', 'Indigo', '16x16 in', 0.00, 6, 'RCP-COT-IND-16'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567806', 'Cotton', 'Indigo', '20x20 in', 500.00, 4, 'RCP-COT-IND-20');
