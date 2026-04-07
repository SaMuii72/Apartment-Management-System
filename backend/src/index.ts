import { Elysia } from "elysia";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const app = new Elysia()
  .get("/", () => "Hello Backend")
  .get("/users", () => [])
  .get("/rooms", async () => {
    return prisma.room.findMany({ include: { tenant: true } });
  })
  .listen(3000);

console.log("Server running at http://localhost:3000");