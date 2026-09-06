-- Insert REITs
INSERT INTO reits (ticker, name, sector, market_cap, yield_pct, nta_premium_discount, gearing_pct, wale_years)
VALUES 
('GMG', 'Goodman Group', 'Industrial', 35000000000, 1.2, 4.2, 8.5, 4.5),
('SCG', 'Scentre Group', 'Retail', 15000000000, 5.5, -15.6, 36.8, 6.2),
('DXS', 'Dexus', 'Office', 8000000000, 6.1, -12.1, 31.2, 5.1),
('CQR', 'Charter Hall Retail', 'Retail', 2000000000, 6.5, -10.5, 29.5, 4.8),
('CIP', 'Centuria Industrial', 'Industrial', 1800000000, 5.2, -5.4, 33.2, 7.2)
ON CONFLICT (ticker) DO NOTHING;

-- Insert Assets (Using ST_SetSRID(ST_MakePoint(lng, lat), 4326) for PostGIS)
INSERT INTO assets (reit_ticker, address, suburb, state, location, property_type, book_value, acquired_year)
VALUES
('GMG', '1-3 Burrows Road', 'Alexandria', 'NSW', ST_SetSRID(ST_MakePoint(151.191, -33.911), 4326), 'Logistics Facility', 45000000, 2018),
('GMG', 'Oakdale Industrial Estate', 'Horsley Park', 'NSW', ST_SetSRID(ST_MakePoint(150.865, -33.844), 4326), 'Distribution Centre', 120000000, 2019),
('GMG', '5-17 Rothschild Avenue', 'Rosebery', 'NSW', ST_SetSRID(ST_MakePoint(151.202, -33.916), 4326), 'Business Park', 35000000, 2015),
('SCG', '188 Pitt Street', 'Sydney', 'NSW', ST_SetSRID(ST_MakePoint(151.208, -33.868), 4326), 'Shopping Centre', 3200000000, 2005),
('SCG', '500 Oxford Street', 'Bondi Junction', 'NSW', ST_SetSRID(ST_MakePoint(151.248, -33.891), 4326), 'Shopping Centre', 2800000000, 2004),
('SCG', '159-175 Church Street', 'Parramatta', 'NSW', ST_SetSRID(ST_MakePoint(151.002, -33.816), 4326), 'Shopping Centre', 1900000000, 2006),
('DXS', '1 Farrer Place', 'Sydney', 'NSW', ST_SetSRID(ST_MakePoint(151.211, -33.864), 4326), 'Premium Office Tower', 1100000000, 2010),
('DXS', '100 Harris Street', 'Pyrmont', 'NSW', ST_SetSRID(ST_MakePoint(151.194, -33.871), 4326), 'A-Grade Office', 350000000, 2017),
('DXS', '14 Lee Street', 'Haymarket', 'NSW', ST_SetSRID(ST_MakePoint(151.203, -33.882), 4326), 'A-Grade Office', 420000000, 2019),
('CQR', '112-122 Belmore Road', 'Randwick', 'NSW', ST_SetSRID(ST_MakePoint(151.240, -33.916), 4326), 'Convenience Retail', 65000000, 2014),
('CQR', '24-32 Lexington Drive', 'Bella Vista', 'NSW', ST_SetSRID(ST_MakePoint(150.957, -33.737), 4326), 'Convenience Retail', 55000000, 2016),
('CIP', '10 Williamson Road', 'Ingleburn', 'NSW', ST_SetSRID(ST_MakePoint(150.864, -34.004), 4326), 'Cold Storage Facility', 38000000, 2020),
('CIP', '37-51 Scrivener Street', 'Warwick Farm', 'NSW', ST_SetSRID(ST_MakePoint(150.938, -33.921), 4326), 'Manufacturing Facility', 42000000, 2021);
