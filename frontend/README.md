# Команды для запуска backend`a локально

cd backend
npm ci
npm run start

# Команды для запуска frontend`a локально

cd frontend
npm ci
npm run dev

# docker-compose (в корне)

docker compose up --build -d

# создать админа (dev only) - он уже создан

curl -X POST http://localhost:5000/api/dev/create-admin \
 -H "Content-Type: application/json" \
 -d '{"email":"admin@example.ru","password":"adm1n123"}'
