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
    id: 'sec-005',
    projectId: 'p-001',
    kind: 'Flujo funcional',
    title: 'Flujo funcional',
    versions: [
      {
        id: 'v1-005',
        number: 1,
        author: maria,
        createdAt: '08 Mar 2026',
        note: 'Flujo funcional inicial',
        content: `# Flujo funcional · API Solicitudes

## Flujo principal

1. El cliente inicia una solicitud desde el Portal Cliente o Mobile Banking.
2. La API recibe el request y valida los datos básicos (cliente, monto, plazo).
3. Se crea la solicitud en estado \`EN_EVALUACION\`.
4. Se encola un mensaje en el topic \`solic.events\` para el motor de scoring.
5. El motor de scoring calcula el riesgo y devuelve el resultado.
6. La API actualiza la solicitud con el resultado y pasa al estado \`APROBADA\` o \`RECHAZADA\`.
7. Se notifica al cliente vía push y email.

## Actores

- **Cliente** — origina la solicitud
- **API Solicitudes** — orquesta el flujo
- **Motor de Scoring** — calcula el riesgo crediticio
- **Service Bus** — desacopla el scoring del flujo principal
- **Notificaciones** — envía push y email

## Estados posibles

| Estado | Descripción |
| --- | --- |
| \`EN_EVALUACION\` | Solicitud recibida, pendiente de scoring |
| \`APROBADA\` | Scoring positivo, se pueden desembolsar fondos |
| \`RECHAZADA\` | Scoring negativo, el cliente recibe notificación |
| \`CANCELADA\` | El cliente canceló la solicitud |
`,
      },
    ],
  },
  {
    id: 'sec-006',
    projectId: 'p-001',
    kind: 'Despliegue',
    title: 'Despliegue',
    versions: [
      {
        id: 'v1-006',
        number: 1,
        author: carlos,
        createdAt: '09 Mar 2026',
        note: 'Instrucciones de despliegue inicial',
        content: `# Despliegue · API Solicitudes

## Ambientes

| Ambiente | URL | Branch |
| --- | --- | --- |
| DEV | https://api-solic-dev.bancoademi.internal | \`develop\` |
| QA | https://api-solic-qa.bancoademi.internal | \`release/*\` |
| UAT | https://api-solic-uat.bancoademi.internal | \`release/*\` |
| PROD | https://api-solic.bancoademi.com.do | \`main\` |

## Pipeline de CI/CD

1. Push a \`develop\` → build automático en Azure DevOps
2. Tests unitarios y de integración
3. Code coverage mínimo: 75%
4. Deploy automático a DEV si todos los checks pasan
5. Promoción manual a QA/UAT/PROD vía release pipeline

## Pasos de despliegue manual

\`\`\`bash
# Conectar al servidor
ssh deploy@api-solic-prod.bancoademi.internal

# Detener el servicio
systemctl stop api-solicitudes

# Hacer backup
cp -r /opt/api-solicitudes /opt/backups/api-solicitudes-$(date +%Y%m%d)

# Copiar nueva versión
cp -r ./release/* /opt/api-solicitudes/

# Aplicar migraciones de BD
dotnet ef database update --connection-string "\$PROD_DB"

# Reiniciar servicio
systemctl start api-solicitudes
systemctl status api-solicitudes
\`\`\`

## Rollback

En caso de fallo, restaurar desde \`/opt/backups/\` y revertir la migración de BD con el script de rollback correspondiente.
`,
      },
    ],
  },
  {
    id: 'sec-007',
    projectId: 'p-001',
    kind: 'Dependencias',
    title: 'Dependencias',
    versions: [
      {
        id: 'v1-007',
        number: 1,
        author: maria,
        createdAt: '10 Mar 2026',
        note: 'Inventario inicial de dependencias',
        content: `# Dependencias · API Solicitudes

## Frameworks y runtimes

| Nombre | Versión | Propósito |
| --- | --- | --- |
| .NET | 8.0 LTS | Runtime del servicio |
| ASP.NET Core | 8.0 | Framework web |
| Entity Framework Core | 8.0 | ORM para SQL Server |

## Paquetes NuGet principales

| Paquete | Versión | Propósito |
| --- | --- | --- |
| \`Microsoft.Identity.Web\` | 2.16.0 | Autenticación con Entra ID |
| \`StackExchange.Redis\` | 2.7.33 | Caché de resultados de scoring |
| \`Azure.Messaging.ServiceBus\` | 7.17.0 | Cola para scoring asíncrono |
| \`Microsoft.ApplicationInsights\` | 2.22.0 | Telemetría |
| \`Serilog.AspNetCore\` | 8.0.0 | Logging estructurado |

## Servicios externos

- **SQL Server 2022** — base de datos transaccional
- **Azure Service Bus** — topic \`solic.events\`
- **Redis 7** — caché de primer nivel (cluster corporativo)
- **Motor de Scoring** — servicio interno, consumido vía REST
- **Application Insights** — métricas, trazas y logs

## Políticas de actualización

- **.NET LTS**: actualizar solo a versiones LTS cada 2 años
- **Paquetes de seguridad**: evaluar y aplicar en máximo 7 días
- **Paquetes mayores**: revisar breaking changes antes de actualizar
`,
      },
    ],
  },
  {
    id: 'sec-008',
    projectId: 'p-001',
    kind: 'Riesgos',
    title: 'Riesgos',
    versions: [
      {
        id: 'v1-008',
        number: 1,
        author: ana,
        createdAt: '11 Mar 2026',
        note: 'Matriz de riesgos inicial',
        content: `# Riesgos · API Solicitudes

## Matriz de riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Caída del motor de scoring | Media | Alto | Scoring asíncrono vía Service Bus + reintentos automáticos |
| Saturación del pool de conexiones SQL | Media | Alto | Pool aumentado a 200, caché Redis, monitoreo en Application Insights |
| Inyección SQL | Baja | Crítico | Uso exclusivo de Entity Framework con parámetros |
| Expiración del token MSAL en producción | Baja | Medio | Refresh automático con \`acquireTokenSilent\` |
| Brecha de datos sensibles | Baja | Crítico | Cifrado en reposo + TLS 1.3 + auditoría |
| Pérdida de mensajes en Service Bus | Baja | Alto | Dead-letter queue + alertas en Grafana |
| Indisponibilidad de SQL Server | Baja | Crítico | Always On + failover automático |

## Riesgos regulatorios

- Cumplimiento **PCI-DSS** si se manejan tarjetas (no aplica actualmente, pero monitorear).
- Cumplimiento con regulaciones de la **Superintendencia de Bancos** en República Dominicana.
- Retención de datos: 10 años según normativa.

## Plan de contingencia

1. **Nivel 1 — degradación suave:** el scoring se retrasa pero las solicitudes siguen ingresando en estado \`EN_EVALUACION\`.
2. **Nivel 2 — parcial:** solo se aceptan solicitudes de clientes existentes con historial.
3. **Nivel 3 — total:** se activa el flujo manual con mesa de control.
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
