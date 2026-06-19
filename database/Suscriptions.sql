CREATE TABLE subscriptions (
    id SERIAL PRIMARY KEY,
    business_id INTEGER REFERENCES businesses(id),
    plan_id INTEGER REFERENCES plans(id),
    status VARCHAR(20), -- 'active', 'expired', 'trial'
    start_at TIMESTAMP NOT NULL,
    end_at TIMESTAMP NOT NULL
);
