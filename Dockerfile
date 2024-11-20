# Usar una imagen base de Node.js para construir el frontend
FROM node:22.11.0 AS build

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar los archivos package.json y package-lock.json al contenedor
COPY package*.json ./

# Instalar las dependencias
RUN npm install

# Copiar el resto del código fuente
COPY . .

# Construir el proyecto para producción
#RUN npm run build

# Usar una imagen base de Nginx para servir el frontend
#FROM nginx:alpine

# Copiar los archivos generados por el build al contenedor de Nginx
#COPY --from=build /app/build /usr/share/nginx/html

# Exponer el puerto
EXPOSE 3000

# Comando por defecto para iniciar Nginx
#CMD ["nginx", "-g", "daemon off;"]

# Comando para iniciar normalmente
CMD ["npm", "start"]