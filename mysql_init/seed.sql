USE test_db;

INSERT INTO User (id, email, password, name, createdAt, updatedAt)
VALUES
  (1, 'test1@example.com', '$2b$10$2C6ACz007AVKb.pb5fW2qONHzg87tA0rWJmdMsa2Sj8F1rqdzbWO.', 'テストユーザー', NOW(), NOW());
