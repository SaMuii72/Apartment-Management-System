import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const app = new Elysia()
  .use(cors())
  .get("/", () => "Hello Backend")
  .get("/users", () => [])
  .get("/rooms", async () => {
    return prisma.room.findMany({ include: { tenant: true } });
  })

  .post("/rooms", async ({ body }) => {
    const { number, floor, pricePerMonth } = body as {
      number: string
      floor: number
      pricePerMonth: number
    }
    return prisma.room.create({
      data: { number, floor, pricePerMonth }
    })
  })
  .listen(3000);

console.log("Server running at http://localhost:3000");