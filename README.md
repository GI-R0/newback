BACKEND SERVER

Este proyecto es un servidor backend desarrollado con Node.js y Express , utilizando MongoDB como base de datos. Ofrece rutas par autenticación , gestión de usuarios y productos.

TECNOLOGIAS UTILIZADAS 

Node.js
Express.js
MONGODB Atlas + Mongoose
Cloudinary (Almacenar imágenes)
Multer(gestión de archivos)
JSON Web Token(autenticación)
Bcrypt.js (protección de contraseñas)
Dotenv(configuracion de variables de entorno)
CORS (Manejo de restricciones de origen)

REQUISITOS PREVIOS 

Antes de empezar , asegúrate de contar con:
Node.js (versión 14 o superior)
una instacia de MongoDB 
npm instalado


1. clona este repositorio y accede al directorio del proyecto:
 git clone https://github.com/GI-R0/backendos.git
cd backend-server

2. Instala las dependencias necesarias:

npm install

3. Crea un archivo .env en la raíz del proyecto con la siguiente configuración:

PORT=5000
MONGO_URI=tu_cadena_de_conexion_a_mongodb
JWT_SECRET=tu_secreto_jwt
 Ejecución del servidor


Para iniciar el backend, usa el siguiente comando:


node app.js
El servidor estará disponible en http://localhost:5000.




   Autenticación
Registro → POST /api/auth/register

Login → POST /api/auth/login

   Gestión de Usuarios
Obtener usuarios → GET /api/users

Modificar rol → PUT /api/users/role/:id

Eliminar usuario → DELETE /api/users/:id

  Gestión de Productos
Crear producto → POST /api/products

Obtener productos → GET /api/products

Obtener un producto específico → GET /api/products/:id

Actualizar producto → PUT /api/products/:id

Eliminar producto → DELETE /api/products/:id

*Pruebas
Para probar las rutas, puedes usar Postman, Insomnia o herramientas similares. Recuerda incluir los headers necesarios, como el token de autenticación cuando sea requerido.