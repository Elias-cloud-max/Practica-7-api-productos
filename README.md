# Práctica 7 - API de productos con MongoDB

1. Crea un cluster de MongoDB Atlas y un usuario de base de datos; configura el acceso de red.
2. Copia `.env.example` a `.env` y reemplaza MONGODB_URI por tu cadena de conexión, incluyendo `/tienda` antes de `?`.
3. Ejecuta `npm install` y `npm run dev`.
4. Usa Thunder Client en `http://localhost:3000/productos`.

Nunca subas `.env` a GitHub. Los productos se guardan en MongoDB, no en memoria.
