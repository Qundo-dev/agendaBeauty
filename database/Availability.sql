CREATE TABLE availability (
    id SERIAL PRIMARY KEY,
    business_id INTEGER REFERENCES businesses(id),
    day_of_week INTEGER NOT NULL, -- 0 (Domingo) a 6 (Sábado)
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_closed BOOLEAN DEFAULT false -- Para marcar días festivos o cerrados
);
