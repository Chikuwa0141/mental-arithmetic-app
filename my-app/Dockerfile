# Dockerfile
# Next.js開発用Dockerfile
FROM node:20

# コンテナ内の作業ディレクトリを作成
WORKDIR /app

# package.jsonとpackage-lock.jsonをコピー
COPY package*.json ./

# 依存パッケージをインストール
RUN npm install

# プロジェクト全体をコンテナにコピー
COPY . .

# 開発モードでNext.jsを起動
CMD ["npm", "run", "dev"]
