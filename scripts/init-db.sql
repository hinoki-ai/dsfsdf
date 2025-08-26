-- Liquor Store SaaS Database Initialization Script
-- This script creates the basic database structure for optional PostgreSQL storage
-- The main data storage uses Convex, but PostgreSQL can be used for additional data

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "unaccent";

-- Set timezone
SET timezone = 'America/Santiago';

-- Create schemas
CREATE SCHEMA IF NOT EXISTS liquor_store;
CREATE SCHEMA IF NOT EXISTS audit;
CREATE SCHEMA IF NOT EXISTS analytics;

-- Switch to liquor_store schema
SET search_path TO liquor_store, public;

-- ===========================================
-- AUDIT AND LOGGING TABLES
-- ===========================================

-- Audit log table for compliance tracking
CREATE TABLE IF NOT EXISTS audit.activity_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(255),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100),
    entity_id VARCHAR(255),
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Age verification log for legal compliance
CREATE TABLE IF NOT EXISTS audit.age_verification_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id VARCHAR(255),
    user_id VARCHAR(255),
    verification_method VARCHAR(50) NOT NULL, -- 'birthdate', 'id_document', 'third_party'
    verification_result BOOLEAN NOT NULL,
    ip_address INET,
    user_agent TEXT,
    device_fingerprint VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ===========================================
-- ANALYTICS AND REPORTING TABLES
-- ===========================================

-- Page views and analytics
CREATE TABLE IF NOT EXISTS analytics.page_views (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id VARCHAR(255),
    user_id VARCHAR(255),
    page_path VARCHAR(500) NOT NULL,
    locale VARCHAR(10),
    referrer VARCHAR(500),
    user_agent TEXT,
    ip_address INET,
    duration_seconds INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Product views and interactions
CREATE TABLE IF NOT EXISTS analytics.product_interactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id VARCHAR(255),
    user_id VARCHAR(255),
    product_id VARCHAR(255) NOT NULL,
    interaction_type VARCHAR(50) NOT NULL, -- 'view', 'add_to_cart', 'remove_from_cart', 'wishlist'
    category VARCHAR(100),
    price DECIMAL(10,2),
    ip_address INET,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ===========================================
-- OPTIONAL CACHE TABLES
-- ===========================================

-- Product search cache for better performance
CREATE TABLE IF NOT EXISTS liquor_store.search_cache (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cache_key VARCHAR(255) UNIQUE NOT NULL,
    search_query TEXT,
    results JSONB,
    locale VARCHAR(10),
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Session data cache (optional, Redis is primary)
CREATE TABLE IF NOT EXISTS liquor_store.session_data (
    session_id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255),
    data JSONB,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ===========================================
-- COMPLIANCE AND REGULATORY TABLES
-- ===========================================

-- Chilean regions with delivery restrictions
CREATE TABLE IF NOT EXISTS liquor_store.delivery_regions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    region_name VARCHAR(100) NOT NULL,
    region_code VARCHAR(10) NOT NULL,
    delivery_allowed BOOLEAN DEFAULT true,
    alcohol_restrictions JSONB, -- Specific restrictions per alcohol type
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert Chilean regions
INSERT INTO liquor_store.delivery_regions (region_name, region_code, delivery_allowed, alcohol_restrictions) VALUES
('Región de Arica y Parinacota', 'XV', true, '{}'),
('Región de Tarapacá', 'I', true, '{}'),
('Región de Antofagasta', 'II', true, '{}'),
('Región de Atacama', 'III', true, '{}'),
('Región de Coquimbo', 'IV', true, '{}'),
('Región de Valparaíso', 'V', true, '{}'),
('Región Metropolitana', 'RM', true, '{}'),
('Región del Libertador General Bernardo O''Higgins', 'VI', true, '{}'),
('Región del Maule', 'VII', true, '{}'),
('Región de Ñuble', 'XVI', true, '{}'),
('Región del Biobío', 'VIII', true, '{}'),
('Región de la Araucanía', 'IX', true, '{}'),
('Región de Los Ríos', 'XIV', true, '{}'),
('Región de Los Lagos', 'X', true, '{}'),
('Región Aysén del General Carlos Ibáñez del Campo', 'XI', false, '{"reason": "Remote area restrictions"}'),
('Región de Magallanes y la Antártica Chilena', 'XII', false, '{"reason": "Remote area restrictions"}')
ON CONFLICT (region_code) DO NOTHING;

-- ===========================================
-- INDEXES FOR PERFORMANCE
-- ===========================================

-- Audit log indexes
CREATE INDEX IF NOT EXISTS idx_activity_log_user_id ON audit.activity_log(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_created_at ON audit.activity_log(created_at);
CREATE INDEX IF NOT EXISTS idx_activity_log_action ON audit.activity_log(action);

-- Age verification indexes
CREATE INDEX IF NOT EXISTS idx_age_verification_user_id ON audit.age_verification_log(user_id);
CREATE INDEX IF NOT EXISTS idx_age_verification_created_at ON audit.age_verification_log(created_at);
CREATE INDEX IF NOT EXISTS idx_age_verification_ip ON audit.age_verification_log(ip_address);

-- Analytics indexes
CREATE INDEX IF NOT EXISTS idx_page_views_session_id ON analytics.page_views(session_id);
CREATE INDEX IF NOT EXISTS idx_page_views_user_id ON analytics.page_views(user_id);
CREATE INDEX IF NOT EXISTS idx_page_views_created_at ON analytics.page_views(created_at);

CREATE INDEX IF NOT EXISTS idx_product_interactions_product_id ON analytics.product_interactions(product_id);
CREATE INDEX IF NOT EXISTS idx_product_interactions_user_id ON analytics.product_interactions(user_id);
CREATE INDEX IF NOT EXISTS idx_product_interactions_created_at ON analytics.product_interactions(created_at);

-- Cache indexes
CREATE INDEX IF NOT EXISTS idx_search_cache_key ON liquor_store.search_cache(cache_key);
CREATE INDEX IF NOT EXISTS idx_search_cache_expires_at ON liquor_store.search_cache(expires_at);

CREATE INDEX IF NOT EXISTS idx_session_data_expires_at ON liquor_store.session_data(expires_at);

-- ===========================================
-- FUNCTIONS FOR MAINTENANCE
-- ===========================================

-- Function to clean expired cache entries
CREATE OR REPLACE FUNCTION liquor_store.cleanup_expired_cache()
RETURNS void AS $$
BEGIN
    DELETE FROM liquor_store.search_cache WHERE expires_at < CURRENT_TIMESTAMP;
    DELETE FROM liquor_store.session_data WHERE expires_at < CURRENT_TIMESTAMP;
END;
$$ LANGUAGE plpgsql;

-- Function to archive old audit logs (keep 1 year)
CREATE OR REPLACE FUNCTION audit.archive_old_logs()
RETURNS void AS $$
BEGIN
    DELETE FROM audit.activity_log WHERE created_at < CURRENT_TIMESTAMP - INTERVAL '1 year';
    DELETE FROM audit.age_verification_log WHERE created_at < CURRENT_TIMESTAMP - INTERVAL '2 years'; -- Keep longer for compliance
END;
$$ LANGUAGE plpgsql;

-- ===========================================
-- GRANTS AND PERMISSIONS
-- ===========================================

-- Create application user if not exists (for security)
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'liquor_app') THEN
        CREATE ROLE liquor_app LOGIN;
    END IF;
END
$$;

-- Grant permissions
GRANT USAGE ON SCHEMA liquor_store TO liquor_app;
GRANT USAGE ON SCHEMA audit TO liquor_app;
GRANT USAGE ON SCHEMA analytics TO liquor_app;

GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA liquor_store TO liquor_app;
GRANT SELECT, INSERT ON ALL TABLES IN SCHEMA audit TO liquor_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA analytics TO liquor_app;

-- ===========================================
-- INITIAL DATA AND CONFIGURATION
-- ===========================================

-- Create configuration table
CREATE TABLE IF NOT EXISTS liquor_store.app_config (
    key VARCHAR(100) PRIMARY KEY,
    value JSONB,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert default configuration
INSERT INTO liquor_store.app_config (key, value, description) VALUES
('age_verification', '{"min_age": 18, "strict_mode": true}', 'Age verification settings'),
('delivery_hours', '{"start": "09:00", "end": "21:00", "timezone": "America/Santiago"}', 'Delivery time restrictions'),
('max_order_quantity', '12', 'Maximum bottles per order (Chilean law compliance)'),
('restricted_regions', '["XI", "XII"]', 'Regions with delivery restrictions')
ON CONFLICT (key) DO NOTHING;

-- ===========================================
-- TRIGGERS FOR UPDATED_AT
-- ===========================================

-- Function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to tables with updated_at column
CREATE TRIGGER update_session_data_updated_at 
    BEFORE UPDATE ON liquor_store.session_data 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_app_config_updated_at 
    BEFORE UPDATE ON liquor_store.app_config 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===========================================
-- DATABASE INITIALIZATION COMPLETE
-- ===========================================

-- Log initialization
INSERT INTO audit.activity_log (action, entity_type, new_values) 
VALUES ('database_init', 'system', '{"status": "completed", "version": "1.0"}');

-- Create a view for easy monitoring
CREATE OR REPLACE VIEW liquor_store.system_status AS
SELECT 
    'database' as component,
    'healthy' as status,
    CURRENT_TIMESTAMP as checked_at,
    (SELECT COUNT(*) FROM audit.activity_log WHERE created_at > CURRENT_TIMESTAMP - INTERVAL '1 hour') as recent_activity_count;

COMMENT ON DATABASE liquor_store IS 'Liquor Store SaaS - Auxiliary database for analytics, compliance, and caching';

-- Reset search path
SET search_path TO public;