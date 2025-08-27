CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE products REPLICA IDENTITY FULL;

INSERT INTO products (name, price) VALUES ('Laptop', 1200.50);
INSERT INTO products (name, price) VALUES ('Mouse', 25.00);
INSERT INTO products (name, price) VALUES ('Keyboard', 75.75);

CREATE PUBLICATION dbz_publication FOR TABLE products;
