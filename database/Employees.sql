CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    business_id INTEGER REFERENCES businesses(id),
    name VARCHAR(100) NOT NULL,
    specialty VARCHAR(100),
    is_active BOOLEAN DEFAULT true
);