FROM node:25-alpine

WORKDIR /app

# 依存関係を先にインストールしてレイヤーキャッシュを効かせる。
# node_modules はコンテナ内（Linux musl 用）で解決する必要があるため、
# ここでインストールした結果を匿名ボリュームで保持する（compose 側で設定）。
COPY package.json package-lock.json ./
RUN npm ci
