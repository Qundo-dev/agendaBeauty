CREATE TABLE shifts (
    id SERIAL PRIMARY KEY,
    business_id INTEGER REFERENCES businesses(id),
    service_id INTEGER REFERENCES services(id),
    employee_id INTEGER REFERENCES employees(id), -- Quién lo atiende
    client_name VARCHAR(100) NOT NULL,
    client_email VARCHAR(100),
    client_phone VARCHAR(20) NOT NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL, -- Calculado: start_time + service.duration
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'confirmed', 'cancelled', 'done'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
