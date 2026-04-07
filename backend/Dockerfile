FROM oven/bun:latest
WORKDIR /app

# copy package.json + lock
COPY package.json bun.lock ./

# install dependencies
RUN bun install

# copy source code
COPY . .

# set DATABASE_URL
ENV DATABASE_URL=postgresql://user:password@host:5432/mydb

# ✅ client ถูก generate บน local → no import error
RUN bunx prisma generate

EXPOSE 3000
CMD ["bun", "run", "start"]