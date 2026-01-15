# 📋 GUÍA DE INSTALACIÓN - Sistema de Gestión de Arrestos

## 📌 Requisitos del Sistema

### Software Necesario

1. **Node.js** (v14 o superior)
   - Descargar: https://nodejs.org/
   - Verificar instalación: `node --version`

2. **npm** (viene incluido con Node.js)
   - Verificar instalación: `npm --version`

3. **Docker Desktop**
   - Descargar: https://www.docker.com/products/docker-desktop/
   - Necesario para la base de datos PostgreSQL

4. **Python** (v3.10 o 3.11)
   - Descargar: https://www.python.org/downloads/
   - ⚠️ Importante: Durante la instalación, marcar "Add Python to PATH"
   - Verificar instalación: `python --version`

5. **pgAdmin** (para gestionar la base de datos)
   - Descargar: https://www.pgadmin.org/download/
   - Necesario para crear las tablas de la base de datos

6. **Git** (opcional, para clonar el proyecto)
   - Descargar: https://git-scm.com/downloads

### Hardware Recomendado

- **RAM:** Mínimo 8GB
- **Disco:** 5GB libres
- **Sistema Operativo:** Windows 10/11

---

## 🚀 Pasos de Instalación

### 1️⃣ Copiar el Proyecto

Copia la carpeta completa `Sistema_de_Arresto_V4` a la ubicación deseada en tu computadora.

### 2️⃣ Instalar Dependencias del Backend

Abre PowerShell o CMD en la carpeta del proyecto y ejecuta:

```bash
cd backend
npm install
```

Esto instalará todas las librerías necesarias para el servidor Node.js.

### 3️⃣ Instalar Dependencias del Frontend

```bash
cd frontend
npm install
```

Esto instalará React y todas sus dependencias.

### 4️⃣ Instalar Dependencias de Python

Desde la carpeta raíz del proyecto:

```bash
pip install -r requirements.txt
```

Esto instalará:
- DeepFace (reconocimiento facial)
- TensorFlow
- OpenCV
- Y otras librerías necesarias

⚠️ **Nota:** La instalación de TensorFlow puede tomar varios minutos.

### 5️⃣ Configurar Docker y Base de Datos

#### Paso 1: Iniciar Docker

1. Abre **Docker Desktop**
2. Asegúrate de que esté corriendo (ícono de Docker en la barra de tareas)

#### Paso 2: Construir y ejecutar el contenedor de PostgreSQL

Desde la carpeta raíz del proyecto, ejecuta:

```bash
docker-compose up -d
```

Esto hará:
- Descargará la imagen de PostgreSQL (primera vez, puede tomar unos minutos)
- Creará el contenedor `arrest_registry_db`
- Iniciará PostgreSQL en el puerto 5432

#### Paso 3: Verificar que el contenedor esté corriendo

```bash
docker ps
```

Deberías ver un contenedor llamado `arrest_registry_db` con estado `Up`.

#### Paso 4: Crear las tablas de la base de datos

La base de datos se crea automáticamente, pero necesitas crear las tablas.

**Opción A: Usando pgAdmin (Recomendado para principiantes)**

1. Descarga e instala **pgAdmin**: https://www.pgadmin.org/download/
2. Abre pgAdmin
3. Clic derecho en "Servers" → "Register" → "Server"
4. Configuración:
   - **Name:** Sistema Arrestos
   - **Host:** localhost
   - **Port:** 5432
   - **Database:** arrest_registry
   - **Username:** db_user_2025
   - **Password:** SecurePass#2025!
5. Conecta al servidor
6. Clic derecho en la base de datos `arrest_registry` → "Query Tool"
7. Copia y ejecuta el script SQL que se encuentra en `estructura basede datos.txt`

**Opción B: Usando la línea de comandos**

```bash
# Acceder al contenedor
docker exec -it arrest_registry_db psql -U db_user_2025 -d arrest_registry

# Luego pega el contenido de "estructura basede datos.txt" o ejecuta:
\i /ruta/al/archivo/estructura_basede_datos.sql
```

#### Paso 5: Configurar variables de entorno (Opcional)

Si necesitas cambiar la configuración, crea un archivo `.env` en la carpeta `backend/`:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=db_user_2025
DB_PASSWORD=SecurePass#2025!
DB_NAME=arrest_registry
PORT=3001
```

⚠️ **Nota:** El puerto del backend es 3001.

---

### 6️⃣ Verificar la Instalación

## ▶️ Ejecutar el Sistema

### Método 1: Usando el Launcher (Recomendado)

1. Haz doble clic en **`iniciar.bat`**
2. Selecciona la opción **[1] Iniciar Sistema**
3. Espera a que se inicien todos los servicios
4. El navegador se abrirá automáticamente en `http://localhost:3000`

### Método 2: Manual (Para desarrollo)

**Terminal 1 - Base de datos:**
```bash
docker-compose up -d
```

**Terminal 2 - Backend:**
```bash
cd backend
node app.js
```

**Terminal 3 - Frontend:**
```bash
cd frontend
npm start
```

---

## 🛑 Detener el Sistema

### Con el Launcher:

1. Ejecuta **`iniciar.bat`**
2. Selecciona la opción **[2] Detener Sistema**

### Manual:

1. Presiona `Ctrl + C` en las terminales del backend y frontend
2. Ejecuta: `docker-compose down`

---

## 🔧 Solución de Problemas

### ❌ Error: "El sistema no puede encontrar el archivo especificado" (Docker)

**Error completo:**
```
error during connect: Get "http://%2F%2F.%2Fpipe%2FdockerDesktopLinuxEngine/v1.51/...": 
open //./pipe/dockerDesktopLinuxEngine: El sistema no puede encontrar el archivo especificado.
```

**Causa:** Docker Desktop no está corriendo o no está instalado correctamente.

**Solución:**
1. **Abre Docker Desktop** desde el menú Inicio de Windows
2. **Espera 1-2 minutos** hasta que el ícono de Docker en la barra de tareas deje de parpadear
3. El ícono debe verse estable (no parpadeando) antes de continuar
4. **Verifica** que Docker esté corriendo:
   ```bash
   docker ps
   ```
   Debería mostrar una lista vacía o con contenedores, NO un error
5. Ahora sí, ejecuta:
   ```bash
   docker-compose up -d
   ```

**Si Docker Desktop no arranca:**
- Reinicia tu computadora
- Reinstala Docker Desktop desde: https://www.docker.com/products/docker-desktop/
- Durante la instalación, acepta todas las opciones recomendadas
- Asegúrate de tener la virtualización habilitada en la BIOS

### ❌ Error: "node no se reconoce como comando"

**Solución:** Node.js no está en el PATH.
1. Reinstala Node.js
2. Durante la instalación, marca la opción "Add to PATH"
3. Reinicia la computadora

### ❌ Error: "docker-compose no se reconoce"

**Solución:** Docker Desktop no está instalado o no está corriendo.
1. Instala Docker Desktop
2. Abre Docker Desktop y espera a que inicie completamente
3. Verifica que el ícono de Docker esté en la barra de tareas

### ❌ Error: "Puerto 3000 ya está en uso"

**Solución:** Otra aplicación está usando el puerto.

**Windows:**
```bash
netstat -ano | findstr :3000
taskkill /PID [número_del_PID] /F
```

### ❌ Error: "Cannot find module"

**Solución:** Faltan dependencias.
```bash
# En backend
cd backend
npm install

# En frontend
cd frontend
npm install
```

### ❌ Error al iniciar DeepFace o TensorFlow

**Solución:** 
1. Reinstala las dependencias de Python:
```bash
pip uninstall tensorflow deepface
pip install tensorflow deepface
```

2. Si persiste, instala Visual C++ Redistributable:
   - https://aka.ms/vs/17/release/vc_redist.x64.exe

### ❌ La base de datos no inicia

**Solución:**
1. Verifica que Docker Desktop esté corriendo
2. Elimina volúmenes antiguos: `docker-compose down -v`
3. Reinicia: `docker-compose up -d`

### ❌ Error: "Cannot connect to database"

**Solución:**
1. Verifica que el contenedor de Docker esté corriendo: `docker ps`
2. Verifica que las credenciales sean correctas en el archivo `.env` o en `app.js`
3. Si creaste un archivo `.env`, asegúrate de que el backend lo esté leyendo
4. Prueba la conexión con pgAdmin usando las mismas credenciales

### ❌ Las tablas no existen

**Solución:**
1. Necesitas ejecutar el script SQL de `estructura basede datos.txt`
2. Conéctate con pgAdmin a la base de datos
3. Ejecuta el script completo en el Query Tool

---

## 🌐 Acceso desde Otros Dispositivos en la Red

Para acceder al sistema desde otros dispositivos (tablets, celulares, otras computadoras):

1. El script `start-backend.ps1` detecta automáticamente tu IP local
2. Busca en los logs el mensaje que dice: `Backend disponible en: http://192.168.X.X:3001`
3. Usa esa IP para acceder desde otros dispositivos en la misma red

Ejemplo: Si tu IP es `192.168.10.100`, accede desde:
- Frontend: `http://192.168.10.100:3000`
- Backend: `http://192.168.10.100:3001`

⚠️ **Importante:** Asegúrate de que el Firewall de Windows permita las conexiones en los puertos 3000 y 3001.

---

## 📁 Estructura del Proyecto

```
Sistema_de_Arresto_V3/
├── backend/               # Servidor Node.js + Express
│   ├── app.js            # Archivo principal del servidor
│   ├── routes/           # Rutas de la API
│   ├── python/           # Scripts de Python (DeepFace)
│   └── uploads/          # Archivos subidos (fotos, huellas, firmas)
├── frontend/             # Aplicación React
│   ├── src/              # Código fuente
│   ├── public/           # Archivos estáticos
│   └── package.json      # Dependencias del frontend
├── docker-compose.yml    # Configuración de PostgreSQL
├── iniciar.bat           # Launcher del sistema
├── start-backend.ps1     # Script de inicio del backend
└── requirements.txt      # Dependencias de Python
```

---

## 🔐 Credenciales por Defecto

### Base de Datos (PostgreSQL)
- **Host:** localhost
- **Puerto:** 5432
- **Base de datos:** arrest_registry
- **Usuario:** db_user_2025
- **Contraseña:** SecurePass#2025!

⚠️ **IMPORTANTE:** Estas son credenciales de EJEMPLO. Debes cambiarlas en el archivo `docker-compose.yml` antes de usar el sistema.

---

## 📞 Soporte

Si encuentras problemas durante la instalación:

1. Verifica que todos los requisitos estén instalados
2. Revisa la sección de "Solución de Problemas"
3. Verifica los logs en las terminales para mensajes de error específicos
4. Asegúrate de tener permisos de administrador si es necesario

---

## 📝 Notas Importantes

- ✅ La primera vez que inicies el sistema, la descarga de Docker puede tomar tiempo
- ✅ DeepFace descargará modelos de IA la primera vez (puede ser lento)
- ✅ Puedes cerrar la terminal del launcher sin afectar el sistema
- ✅ Para verificar si el sistema está corriendo, ejecuta `iniciar.bat` nuevamente
- ⚠️ No elimines la carpeta `uploads/` ya que contiene los datos subidos
- ⚠️ Haz copias de seguridad de la base de datos regularmente

---

## 🎯 Próximos Pasos

Una vez instalado correctamente:

1. Accede a `http://localhost:3000`
2. Comienza a registrar personas
3. Prueba el reconocimiento facial
4. Explora todas las funcionalidades del sistema

¡Listo! El sistema está configurado y funcionando. 🚀
