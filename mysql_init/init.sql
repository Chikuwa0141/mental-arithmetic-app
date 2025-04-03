-- MySQLコンテナ起動時に実行されるスクリプト
CREATE DATABASE IF NOT EXISTS prisma_shadow_db;

GRANT ALL PRIVILEGES ON *.* TO 'user'@'%';
FLUSH PRIVILEGES;