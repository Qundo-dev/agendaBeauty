CREATE TABLE services (
    id SERIAL PRIMARY KEY,
    business_id INTEGER REFERENCES businesses(id),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    duration_minutes INTEGER NOT NULL, -- En minutos (ej: 30, 60, 90)
    price DECIMAL(10, 2) NOT NULL,
    is_enabled BOOLEAN DEFAULT true
);
