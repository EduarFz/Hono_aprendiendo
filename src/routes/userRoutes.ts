import { Hono } from "hono";
import db from "../db/database.js";
import { basicAuth } from "../middlewares/basicAuth.js";

const userRoutes = new Hono();

//getALL
userRoutes.get("/", (c) => {
    const users = db.prepare("SELECT * FROM users").all();
  return c.json(users);
});

//getById
userRoutes.get("/:id", (c) => {
    const id = c.req.param("id");
    const user = db.prepare("SELECT * FROM users WHERE id = ?").get(id);
    if (user) {
        return c.json(user);
    } else {
        c.status(404);
        return c.json({ message: "User not found" });
    }
}
);

//create
userRoutes.post("/", async (c) => {
    const { name, email } = await c.req.json();
    try {const stmt = db.prepare("INSERT INTO users (name, email) VALUES (?, ?)");
    const info = stmt.run(name, email);
    return c.json({ id: info.lastInsertRowid, name, email }, 201);
    } catch (error) {
        return c.json({ error: "email ya existe" }, 400);
    }
}); 

//update
userRoutes.put("/:id", async (c) => {   
    const {id} = c.req.param();
    const { name, email } = await c.req.json();
    const stmt = db.prepare("UPDATE users SET name = ?, email = ? WHERE id = ?");
    const info = stmt.run(name, email, id);
    if (info.changes > 0) {
        return c.json({ id, name, email });
    } else {
        c.status(404);
        return c.json({ message: "User not found" });
    }
}   
);

//delete
userRoutes.delete("/:id", (c) => {
    const {id} = c.req.param();
    const stmt = db.prepare("DELETE FROM users WHERE id = ?");
    const info = stmt.run(id);
    if (info.changes > 0) {
        return c.json({ message: "User deleted successfully" });
    } else {
        c.status(404);
        return c.json({ message: "User not found" });
    }
});

export default userRoutes;