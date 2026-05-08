# Examen diagnóstico — Desarrollo Web Integral

## Nombre del proyecto
**Examen diagnóstico — Desarrollo Web Integral**

## Descripción
Proyecto full‑stack para gestión de **cursos** con un **backend en Django/Django REST Framework** y un **frontend en React (Vite)** que consume la API.

## Tecnologías utilizadas
- **Backend**: Python, Django, Django REST Framework
- **Frontend**: JavaScript, React, Vite
- **Otros**: npm, (opcional) SQLite por defecto en Django

## Funcionalidades
- **API REST de cursos** (CRUD de cursos)
- **Frontend** para visualizar y gestionar cursos consumiendo la API

## Instrucciones para ejecutar el proyecto
### Backend (Django)
1. Crear/activar entorno virtual (si aplica).
2. Instalar dependencias:

```bash
pip install -r requirements.txt
```

> Si no existe `requirements.txt`, instala al menos: `django` y `djangorestframework`.

3. Ejecutar migraciones:

```bash
python manage.py migrate
```

4. Levantar el servidor:

```bash
python manage.py runserver
```

El backend normalmente queda en `http://127.0.0.1:8000/`.

### Frontend (React + Vite)
En otra terminal:

```bash
cd curso_react
npm install
npm run dev
```

El frontend normalmente queda en `http://localhost:5173/`.

> Si tu API usa otra URL/puerto, ajusta la configuración del frontend en `curso_react/src/service/api.js`.

## Indicación de si se usó IA y para qué
Sí. Se usó IA para **redactar/estructurar los archivos README** del proyecto (documentación: secciones, pasos de ejecución y organización).