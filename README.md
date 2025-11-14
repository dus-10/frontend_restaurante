# Frontend Restaurante - Integración con Backend

Este proyecto es el frontend de un sistema de gestión de restaurantes desarrollado en Angular, que se integra con un backend en Python.

## 🚀 Características

- ✅ **CRUD Completo**: Crear, Leer, Actualizar y Eliminar restaurantes
- ✅ **Búsqueda en tiempo real**: Filtrado de restaurantes por término de búsqueda
- ✅ **Interfaz moderna**: Diseño responsive y fácil de usar
- ✅ **Manejo de errores**: Mensajes claros para el usuario
- ✅ **Indicadores de carga**: Feedback visual durante las operaciones

## 📋 Requisitos Previos

- Node.js (versión 18 o superior)
- npm o yarn
- Backend en Python corriendo y accesible

## 🔧 Instalación

1. Instala las dependencias:
```bash
npm install
```

2. Configura la URL del backend en `src/app/services/api.service.ts`:
```typescript
private apiUrl = 'http://localhost:8000/api'; // Cambia esta URL según tu backend
```

## 🏃 Ejecución

Para iniciar el servidor de desarrollo:

```bash
npm start
```

La aplicación estará disponible en `http://localhost:4200`

## 📡 Endpoints del Backend Esperados

El frontend espera que el backend tenga los siguientes endpoints:

- `GET /api/restaurantes` - Obtener lista completa de restaurantes
- `GET /api/restaurantes?search={termino}` - Buscar restaurantes
- `GET /api/restaurantes/{id}` - Obtener un restaurante por ID
- `POST /api/restaurantes` - Crear un nuevo restaurante
- `PUT /api/restaurantes/{id}` - Actualizar un restaurante
- `DELETE /api/restaurantes/{id}` - Eliminar un restaurante

### Formato de Datos

El modelo de Restaurante espera los siguientes campos:

```typescript
{
  id?: number;
  nombre: string;        // Requerido
  direccion: string;      // Requerido
  telefono: string;       // Requerido
  tipo_cocina?: string;   // Opcional
  capacidad?: number;     // Opcional
}
```

## 🎯 Funcionalidades Implementadas

### 1. Listar Restaurantes
- Muestra todos los restaurantes en una tabla
- Botón para crear nuevo restaurante
- Botones para editar y eliminar cada restaurante

### 2. Búsqueda
- Barra de búsqueda que filtra en tiempo real
- Búsqueda por cualquier campo del restaurante

### 3. Crear Restaurante
- Formulario con validación
- Campos: nombre, dirección, teléfono, tipo de cocina, capacidad

### 4. Editar Restaurante
- Mismo formulario que crear, pero prellenado con datos existentes
- Actualiza el restaurante seleccionado

### 5. Eliminar Restaurante
- Confirmación antes de eliminar
- Actualización automática de la lista después de eliminar

## 🎨 Estructura del Proyecto

```
src/
├── app/
│   ├── components/
│   │   ├── restaurantes-list/      # Componente para listar restaurantes
│   │   └── restaurante-form/       # Componente para crear/editar
│   ├── models/
│   │   └── restaurante.model.ts    # Interfaz del modelo Restaurante
│   ├── services/
│   │   └── api.service.ts          # Servicio para comunicación con API
│   ├── app.config.ts               # Configuración de la app
│   ├── app.routes.ts               # Rutas de la aplicación
│   └── app.ts                      # Componente principal
```

## 🔍 Verificación de Peticiones HTTP

Para ver las peticiones HTTP en el navegador:

1. Abre las **Herramientas de Desarrollador** (F12)
2. Ve a la pestaña **Network** (Red)
3. Realiza las operaciones CRUD
4. Verás todas las peticiones HTTP con sus respuestas

## 📝 Notas Importantes

- Asegúrate de que el backend tenga CORS habilitado para permitir peticiones desde `http://localhost:4200`
- Si tu backend usa un puerto diferente o una URL diferente, actualiza `apiUrl` en `api.service.ts`
- Los campos opcionales pueden ser `null` o `undefined` en el backend

## 🐛 Solución de Problemas

### Error de CORS
Si ves errores de CORS, asegúrate de que tu backend permita peticiones desde el origen del frontend.

### No se cargan los datos
- Verifica que el backend esté corriendo
- Verifica la URL en `api.service.ts`
- Revisa la consola del navegador para ver errores específicos

### Errores 404
- Verifica que los endpoints del backend coincidan con los esperados
- Revisa que la ruta base (`/api`) sea correcta

## 📚 Tecnologías Utilizadas

- Angular 20
- TypeScript
- RxJS
- CSS3

## 👥 Integrantes

[Agregar nombres de los integrantes aquí]
