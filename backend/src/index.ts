import { Elysia } from "elysia";

const app = new Elysia()
  .get("/", () => "Hello Backend")
  .get("/users", () => {
    return [];
  })
  .listen(3000);

console.log("Server running at http://localhost:3000");