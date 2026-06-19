CREATE TABLE plans (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL, -- 'Básico', 'Premium'
    price DECIMAL(10, 2) NOT NULL,
    max_services INTEGER, -- Ejemplo de límite
    max_employees INTEGER, -- Ejemplo de límite
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);