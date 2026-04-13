# wiki DEV

Portal interno de conocimiento y trazabilidad técnica. Centraliza documentación técnica, bitácora de cambios, historias de usuario y pull requests, con integración prevista para Jira y Azure DevOps.

## Stack

- **Vite** + **React 19** + **TypeScript** (modo estricto)
- **Fluent UI v9** (`@fluentui/react-components`) con tema custom derivado del color de marca `#0395A9`
- **React Router v6** con rutas protegidas
- Estructura por features: `src/features/*` + `src/shared/*` + `src/app/*`
- Alias de imports `@/` apuntando a `src/`

## Scripts

```bash
npm install     # instalar dependencias
npm run dev     # servidor de desarrollo (http://localhost:5173)
npm run build   # build de producción
npm run preview # previsualizar el build
npm run lint    # linter
```

## Autenticación

Actualmente la autenticación usa un **mock service** en memoria (`src/features/auth/services/authService.ts`) con persistencia en `localStorage`. La arquitectura está preparada para reemplazarse por un backend real o Microsoft Entra ID (MSAL) sin cambios en los componentes.

### Usuarios de prueba (mock)

| Email                          | Contraseña  | Rol     |
| ------------------------------ | ----------- | ------- |
| `jeheredia@bancoademi.com.do`  | `admin123`  | admin   |
| `editor@wikidev.local`         | `editor123` | editor  |
| `reader@wikidev.local`         | `reader123` | reader  |

> Estas credenciales existen únicamente para desarrollo local. Antes de desplegar a cualquier ambiente real, el `authService` debe apuntarse al backend corporativo y eliminar el array `MOCK_USERS`.

## Estructura

```
src/
├── app/                    # composición raíz (App, router)
├── features/               # módulos del portal
│   ├── auth/               # login, contexto, guard
│   ├── dashboard/
│   ├── projects/
│   ├── documentation/
│   ├── changelog/
│   ├── integrations/
│   ├── comments/
│   ├── attachments/
│   └── administration/
└── shared/                 # layout, theme, componentes comunes
    ├── components/
    ├── layout/
    └── theme/
```

## Módulos

Dashboard, Proyectos, Documentación, Bitácora de Cambios, Integraciones, Comentarios, Adjuntos y Administración.
