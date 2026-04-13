import type { DocSection } from './types'

const maria = { id: 'u-101', name: 'María P.', initials: 'MP' }
const carlos = { id: 'u-102', name: 'Carlos R.', initials: 'CR' }
const ana = { id: 'u-103', name: 'Ana G.', initials: 'AG' }

export const mockDocSections: DocSection[] = [
  {
    id: 'sec-001',
    projectId: 'p-001',
    kind: 'Arquitectura',
    title: 'Arquitectura',
    versions: [
      {
        id: 'v1-001',
        number: 1,
        author: maria,
        createdAt: '05 Mar 2026',
        note: 'Versión inicial',
        content: `# Arquitectura · API Solicitudes

## Componentes principales

- Gateway: ASP.NET Core 8 (api.solicitudes.internal)
- Motor de scoring: servicio interno en .NET
- Base de datos: SQL Server 2022 (esquema SOLIC)
- Cola: Azure Service Bus (topic: solic.events)

## Diagrama

\`\`\`
[Mobile / Web] → [API Gateway] → [Solic API] → [Scoring Service]
                                     ↓
                                  [SQL Server]
                                     ↓
                               [Service Bus]
\`\`\`

## Decisiones clave

1. Scoring asíncrono vía colas para desacoplar del flujo principal.
2. Versionado por rutas: /api/v1, /api/v2.
3. Telemetría con Application Insights.
`,
      },
      {
        id: 'v2-001',
        number: 2,
        author: carlos,
        createdAt: '12 Mar 2026',
        note: 'Se actualiza el diagrama y se agrega la sección de decisiones clave',
        content: `# Arquitectura · API Solicitudes

## Componentes principales

- Gateway: ASP.NET Core 8 (api.solicitudes.internal)
- Motor de scoring: servicio interno en .NET, ahora con caché Redis
- Base de datos: SQL Server 2022 (esquema SOLIC)
- Cola: Azure Service Bus (topic: solic.events)
- Caché: Redis 7 (cluster interno)

## Diagrama

\`\`\`
[Mobile / Web] → [API Gateway] → [Solic API] → [Scoring Service]
                                     ↓                  ↓
                                  [SQL Server]      [Redis]
                                     ↓
                               [Service Bus]
\`\`\`

## Decisiones clave

1. Scoring asíncrono vía colas para desacoplar del flujo principal.
2. Versionado por rutas: /api/v1, /api/v2.
3. Telemetría con Application Insights.
4. Caché Redis para resultados de scoring repetidos (TTL 5 min).
`,
      },
    ],
  },
  {
    id: 'sec-002',
    projectId: 'p-001',
    kind: 'APIs',
    title: 'APIs',
    versions: [
      {
        id: 'v1-002',
        number: 1,
        author: maria,
        createdAt: '06 Mar 2026',
        note: 'Contratos iniciales',
        content: `# APIs · API Solicitudes

## Endpoints

### POST /api/v1/solicitudes
Crea una nueva solicitud.

**Request:**
\`\`\`json
{
  "clienteId": "C-1001",
  "monto": 25000,
  "plazoMeses": 24
}
\`\`\`

**Response 201:**
\`\`\`json
{
  "id": "SOL-00001",
  "estado": "EN_EVALUACION"
}
\`\`\`

### GET /api/v1/solicitudes/:id
Consulta una solicitud por ID.

### GET /api/v1/scoring/:id
Obtiene el resultado del scoring asociado.
`,
      },
    ],
  },
  {
    id: 'sec-003',
    projectId: 'p-001',
    kind: 'Base de datos',
    title: 'Base de datos',
    versions: [
      {
        id: 'v1-003',
        number: 1,
        author: ana,
        createdAt: '07 Mar 2026',
        content: `# Base de datos · API Solicitudes

## Esquema SOLIC

- \`solicitudes\` — cabecera de solicitud
- \`solicitud_detalle\` — información extendida
- \`scoring_resultados\` — respuestas del motor de scoring
- \`historial_estados\` — auditoría de cambios de estado

## Índices clave

- \`ix_solic_cliente\` sobre \`solicitudes(clienteId)\`
- \`ix_scoring_solic\` sobre \`scoring_resultados(solicitudId)\`
`,
      },
    ],
  },
  {
    id: 'sec-004',
    projectId: 'p-002',
    kind: 'Arquitectura',
    title: 'Arquitectura',
    versions: [
      {
        id: 'v1-004',
        number: 1,
        author: carlos,
        createdAt: '10 Mar 2026',
        content: `# Arquitectura · Portal Cliente

Aplicación SPA en React + TypeScript consumiendo APIs internas del banco vía API Gateway.

- Frontend: React 19, Vite, Fluent UI
- Autenticación: MSAL (Entra ID corporativo)
- Backend: múltiples APIs internas agregadas por BFF
`,
      },
    ],
  },
]
