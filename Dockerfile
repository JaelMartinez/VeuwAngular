# Usa una imagen de Node.js como base para construir la aplicación Angular
FROM node:18 AS build

# Establece el directorio de trabajo en el contenedor
WORKDIR /app

# Copia los archivos package.json y package-lock.json al contenedor
COPY package*.json ./

# Instala las dependencias de la aplicación
RUN npm install

# Copia el resto de los archivos del proyecto
COPY . .

# Construye la aplicación Angular
RUN npm run build

# Añadir diagnóstico: Verifica que los archivos se hayan construido
RUN ls /app/dist/veuw-angular/browser

# Usa una imagen de Nginx para servir la aplicación
FROM nginx:alpine
COPY --from=build /app/dist/veuw-angular/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer el puerto 80 para que la aplicación sea accesible
EXPOSE 80

# Comando para correr el servidor Nginx
CMD ["nginx", "-g", "daemon off;"]
