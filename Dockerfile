FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Dummy env for build time
ENV DATABASE_URL="postgresql://user:password@localhost:5432/crm_db"

RUN npx prisma generate
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
