-- Crear base de datos para el sistema de atención médica
CREATE TABLE IF NOT EXISTS customers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS consultation_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    priority_level INTEGER DEFAULT 1, -- 1=baja, 2=media, 3=alta, 4=urgente
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS consultations (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES customers(id),
    category_id INTEGER REFERENCES consultation_categories(id),
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    ai_response TEXT,
    status VARCHAR(50) DEFAULT 'pending', -- pending, in_progress, resolved, closed
    priority_level INTEGER DEFAULT 1,
    sentiment_score DECIMAL(3,2), -- -1.00 a 1.00
    confidence_score DECIMAL(3,2), -- 0.00 a 1.00
    response_time_seconds INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS consultation_interactions (
    id SERIAL PRIMARY KEY,
    consultation_id INTEGER REFERENCES consultations(id),
    message TEXT NOT NULL,
    sender_type VARCHAR(20) NOT NULL, -- 'customer', 'ai', 'agent'
    sender_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS analytics_trends (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    category_id INTEGER REFERENCES consultation_categories(id),
    total_consultations INTEGER DEFAULT 0,
    avg_response_time DECIMAL(10,2),
    avg_sentiment_score DECIMAL(3,2),
    resolution_rate DECIMAL(5,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_consultations_created_at ON consultations(created_at);
CREATE INDEX IF NOT EXISTS idx_consultations_category ON consultations(category_id);
CREATE INDEX IF NOT EXISTS idx_consultations_status ON consultations(status);
CREATE INDEX IF NOT EXISTS idx_analytics_date ON analytics_trends(date);
