-- Enable PostGIS extension for geolocation
CREATE EXTENSION IF NOT EXISTS postgis;

-- 1. REITs Table
CREATE TABLE reits (
    ticker VARCHAR PRIMARY KEY,
    name VARCHAR NOT NULL,
    sector VARCHAR NOT NULL,
    market_cap BIGINT,
    yield_pct DECIMAL(5,2),
    nta_premium_discount DECIMAL(5,2),
    gearing_pct DECIMAL(5,2),
    wale_years DECIMAL(4,1),
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Assets Table
CREATE TABLE assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reit_ticker VARCHAR REFERENCES reits(ticker) ON DELETE CASCADE,
    address VARCHAR NOT NULL,
    suburb VARCHAR NOT NULL,
    state VARCHAR NOT NULL,
    postcode VARCHAR,
    location GEOMETRY(Point, 4326),
    property_type VARCHAR,
    book_value BIGINT,
    acquired_year INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for spatial queries on the asset map
CREATE INDEX assets_location_idx ON assets USING GIST (location);

-- 3. Announcements Table
CREATE TABLE announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reit_ticker VARCHAR REFERENCES reits(ticker) ON DELETE CASCADE,
    title VARCHAR NOT NULL,
    published_at TIMESTAMPTZ NOT NULL,
    source_url VARCHAR NOT NULL,
    is_price_sensitive BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for quickly fetching recent announcements per REIT
CREATE INDEX announcements_reit_date_idx ON announcements (reit_ticker, published_at DESC);

-- 4. User Alerts Table
CREATE TABLE user_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    reit_ticker VARCHAR REFERENCES reits(ticker) ON DELETE CASCADE,
    metric VARCHAR NOT NULL, -- e.g., 'nta_discount', 'distribution_announced'
    operator VARCHAR NOT NULL, -- e.g., '<', '>', '=='
    threshold_value DECIMAL(10,2),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security (RLS) setup
ALTER TABLE reits ENABLE ROW LEVEL SECURITY;
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_alerts ENABLE ROW LEVEL SECURITY;

-- Read-only policies for public data
CREATE POLICY "Allow public read access to reits" ON reits FOR SELECT USING (true);
CREATE POLICY "Allow public read access to assets" ON assets FOR SELECT USING (true);
CREATE POLICY "Allow public read access to announcements" ON announcements FOR SELECT USING (true);

-- User alerts policies (users can only read/manage their own alerts)
CREATE POLICY "Users can view their own alerts" ON user_alerts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own alerts" ON user_alerts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own alerts" ON user_alerts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own alerts" ON user_alerts FOR DELETE USING (auth.uid() = user_id);
