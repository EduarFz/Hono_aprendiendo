// Middleware de Basic Authentication para Hono

// Usuarios de prueba (esto en la vida real debería ir en DB o variables de entorno)
const VALID_USERS: Record<string, string> = {
  "admin": "1234",
  "juan": "password"
};

export const basicAuth = async (c: any, next: any) => {
  const authHeader = c.req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Basic ")) {
    c.status(401);
    c.header("WWW-Authenticate", 'Basic realm="MyApp"');
    return c.text("Unauthorized");
  }

  // Extraer credenciales en Base64
  const base64Credentials = authHeader.split(" ")[1];
  const decoded = Buffer.from(base64Credentials, "base64").toString("utf-8");

  const [username, password] = decoded.split(":");

  if (VALID_USERS[username] && VALID_USERS[username] === password) {
    // Credenciales válidas → sigue con la ruta
    await next();
  } else {
    c.status(401);
    c.header("WWW-Authenticate", 'Basic realm="MyApp"');
    return c.text("Invalid credentials");
  }
};
