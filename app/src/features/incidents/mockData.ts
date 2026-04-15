import type { ProjectMember } from '@/features/projects/types'
import type { Incident } from './types'

const maria: ProjectMember = { id: 'u-101', name: 'María P.', initials: 'MP' }
const carlos: ProjectMember = { id: 'u-102', name: 'Carlos R.', initials: 'CR' }
const ana: ProjectMember = { id: 'u-103', name: 'Ana G.', initials: 'AG' }
const jorge: ProjectMember = { id: 'u-104', name: 'Jorge V.', initials: 'JV' }
const luisa: ProjectMember = { id: 'u-105', name: 'Luisa F.', initials: 'LF' }
const ricardo: ProjectMember = { id: 'u-106', name: 'Ricardo M.', initials: 'RM' }

export const mockIncidents: Incident[] = [
  {
    id: 'inc-001',
    code: 'INC-001',
    title: 'Timeouts intermitentes en el endpoint de scoring',
    description:
      'Los usuarios reportan timeouts (504) al solicitar el scoring crediticio en horas pico entre 11:00 y 14:00.',
    rootCause:
      'El pool de conexiones de SQL Server se saturaba bajo carga concurrente porque cada request abría una conexión nueva sin reutilizar.',
    severity: 'Alta',
    status: 'Resuelta',
    projectId: 'p-001',
    environment: 'PROD',
    reportedBy: maria,
    reportedAt: '09 Abr 2026',
    resolvedAt: '12 Abr 2026',
    tags: ['performance', 'sql-server', 'scoring'],
    solutionSummary:
      'Se migró a un pool con reutilización + caché Redis para resultados repetidos.',
    solutionSteps: [
      { order: 1, text: 'Aumentar el pool de conexiones de SQL Server a 200.' },
      {
        order: 2,
        text: 'Agregar Redis como caché de primer nivel para scoring con TTL de 5 min.',
      },
      { order: 3, text: 'Instrumentar métricas con Application Insights.' },
      { order: 4, text: 'Validar en QA y UAT antes de promover a PROD.' },
    ],
    linkedHuKeys: ['HU-098'],
    linkedPrKeys: ['PR-421'],
  },
  {
    id: 'inc-002',
    code: 'INC-002',
    title: 'Error ORA-01403 en consultas de clientes sin resultados',
    description:
      'Los usuarios que consultan clientes sin registros ven un error técnico ORA-01403 en lugar de un mensaje controlado.',
    rootCause:
      'La consulta no manejaba el caso `NO_DATA_FOUND` y propagaba la excepción de Oracle al frontend.',
    severity: 'Media',
    status: 'Resuelta',
    projectId: 'p-001',
    environment: 'DEV',
    reportedBy: ana,
    reportedAt: '08 Abr 2026',
    resolvedAt: '10 Abr 2026',
    tags: ['bugfix', 'base-de-datos', 'oracle'],
    solutionSummary:
      'Se añadió manejo explícito de NO_DATA_FOUND y se devuelve una respuesta 404 controlada.',
    solutionSteps: [
      {
        order: 1,
        text: 'Envolver la consulta en un bloque BEGIN ... EXCEPTION WHEN NO_DATA_FOUND.',
      },
      { order: 2, text: 'Mapear el caso a HTTP 404 en la API.' },
      { order: 3, text: 'Agregar test de regresión para clientes inexistentes.' },
    ],
    linkedHuKeys: ['HU-115'],
    linkedPrKeys: ['PR-432'],
  },
  {
    id: 'inc-003',
    code: 'INC-003',
    title: 'Sesión SSO expira sin renovar token en segundo plano',
    description:
      'Después de 1 hora inactivo, el portal muestra error 401 al primer click aunque el usuario tenga sesión activa en otras pestañas.',
    rootCause:
      'El interceptor de axios no manejaba el refresh silencioso de MSAL cuando el token ya estaba expirado.',
    severity: 'Alta',
    status: 'Resuelta',
    projectId: 'p-002',
    environment: 'PROD',
    reportedBy: carlos,
    reportedAt: '11 Abr 2026',
    resolvedAt: '13 Abr 2026',
    tags: ['autenticacion', 'msal', 'frontend'],
    solutionSummary:
      'Se migró completamente a acquireTokenSilent con retry automático en el interceptor.',
    solutionSteps: [
      {
        order: 1,
        text: 'Reemplazar interceptor legacy por uno basado en MSAL acquireTokenSilent.',
      },
      {
        order: 2,
        text: 'Si falla el silent acquire, disparar popup y reintentar la request original.',
      },
      { order: 3, text: 'Agregar logging en Application Insights para trackear renovaciones.' },
    ],
    linkedHuKeys: ['HU-211'],
    linkedPrKeys: ['PR-512'],
  },
  {
    id: 'inc-004',
    code: 'INC-004',
    title: 'Pipeline de build falla intermitente por timeout de NPM',
    description:
      'Aproximadamente 1 de cada 5 builds de Azure DevOps falla en `npm install` con timeout al descargar dependencias.',
    rootCause:
      'El registry corporativo tenía picos de latencia por reciclaje de su pod. No es un bug del portal sino de infraestructura.',
    severity: 'Media',
    status: 'Workaround',
    projectId: 'p-002',
    environment: 'QA',
    reportedBy: luisa,
    reportedAt: '12 Abr 2026',
    tags: ['ci-cd', 'npm', 'infraestructura'],
    solutionSummary:
      'Workaround: retry automático en el pipeline y caché de node_modules. Problema raíz en manos de Infra.',
    solutionSteps: [
      {
        order: 1,
        text: 'Agregar `retryCountOnTaskFailure: 3` en el task de npm install.',
      },
      {
        order: 2,
        text: 'Habilitar cache task de Azure Pipelines sobre `~/.npm` con key `package-lock.json`.',
      },
      {
        order: 3,
        text: 'Ticket abierto con el equipo de Infra: INFRA-884.',
      },
    ],
    linkedHuKeys: [],
    linkedPrKeys: [],
    notes: 'Esperando resolución definitiva desde el equipo de infraestructura.',
  },
  {
    id: 'inc-005',
    code: 'INC-005',
    title: 'Validación de montos ACH acepta valores negativos',
    description:
      'Un cliente logró crear una transferencia ACH con monto negativo causando un descuadre contable.',
    rootCause:
      'La validación en el motor de pagos solo verificaba que el monto no fuera cero, no que fuera positivo.',
    severity: 'Crítica',
    status: 'Resuelta',
    projectId: 'p-003',
    environment: 'PROD',
    reportedBy: ricardo,
    reportedAt: '11 Abr 2026',
    resolvedAt: '12 Abr 2026',
    tags: ['bugfix', 'pagos', 'ach', 'critico'],
    solutionSummary:
      'Se añadió validación de monto > 0 en el motor y en el endpoint antes de persistir.',
    solutionSteps: [
      { order: 1, text: 'Hotfix en validador: monto debe ser > 0 y con máximo 2 decimales.' },
      { order: 2, text: 'Rollback y reproceso de las 3 transacciones afectadas.' },
      {
        order: 3,
        text: 'Nuevas pruebas unitarias cubriendo montos negativos, cero y redondeo.',
      },
      { order: 4, text: 'Post-mortem documentado en bitácora.' },
    ],
    linkedHuKeys: ['HU-305'],
    linkedPrKeys: ['PR-612'],
  },
  {
    id: 'inc-006',
    code: 'INC-006',
    title: 'Connection pool de DB2 agotado durante migración',
    description:
      'Durante las pruebas en UAT, el core bancario reporta `SQL0904N` por falta de conexiones disponibles al cliente DB2.',
    rootCause:
      'La nueva versión del driver DB2 12.1 no está liberando las conexiones después de cada transacción batch.',
    severity: 'Alta',
    status: 'En investigación',
    projectId: 'p-006',
    environment: 'UAT',
    reportedBy: ricardo,
    reportedAt: '13 Abr 2026',
    tags: ['base-de-datos', 'db2', 'migracion'],
    solutionSummary:
      'Aún sin solución definitiva. Caso abierto con soporte de IBM. Rollback disponible.',
    solutionSteps: [
      {
        order: 1,
        text: 'Revisar configuración del JDBC driver (parámetros maxPoolSize, idleTimeout).',
      },
      { order: 2, text: 'Reproducir con un batch controlado para capturar stack trace.' },
      { order: 3, text: 'Caso abierto con IBM Support: SR-#88921.' },
    ],
    linkedHuKeys: ['HU-510'],
    linkedPrKeys: ['PR-801'],
    notes: 'Se mantiene el rollback plan como respaldo antes de promover a PROD.',
  },
  {
    id: 'inc-007',
    code: 'INC-007',
    title: 'Push notifications no llegan en iOS tras actualización',
    description:
      'Usuarios con iOS 17.4+ dejan de recibir notificaciones push del banco después de la última release móvil.',
    rootCause:
      'Apple cambió el comportamiento de background fetch; el token APNs del device se invalidaba sin renovarse.',
    severity: 'Media',
    status: 'Resuelta',
    projectId: 'p-005',
    environment: 'PROD',
    reportedBy: luisa,
    reportedAt: '10 Abr 2026',
    resolvedAt: '11 Abr 2026',
    tags: ['mobile', 'ios', 'notificaciones', 'apns'],
    solutionSummary:
      'Renovación automática del token APNs en cada app launch y migración a FCM como intermediario.',
    solutionSteps: [
      {
        order: 1,
        text: 'Agregar hook en app launch que pida un token APNs fresco.',
      },
      {
        order: 2,
        text: 'Enviar el token al backend vía endpoint /devices/apns-token.',
      },
      { order: 3, text: 'Integrar FCM como capa intermedia para simplificar el envío.' },
    ],
    linkedHuKeys: ['HU-421'],
    linkedPrKeys: ['PR-702'],
  },
  {
    id: 'inc-008',
    code: 'INC-008',
    title: 'Panel de notificaciones no se marca como leído',
    description:
      'Los usuarios del portal reportan que el contador de notificaciones no baja aunque hayan leído los mensajes.',
    rootCause:
      'La llamada `PATCH /notifications/{id}` retornaba 200 pero el servicio interno no persistía el estado porque el DTO estaba mal mapeado.',
    severity: 'Baja',
    status: 'Abierta',
    projectId: 'p-002',
    environment: 'UAT',
    reportedBy: jorge,
    reportedAt: '14 Abr 2026',
    tags: ['bugfix', 'ux', 'notificaciones'],
    solutionSummary: 'Pendiente de fix. Investigando el mapeo del DTO.',
    solutionSteps: [
      {
        order: 1,
        text: 'Revisar el mapeo del DTO NotificationReadDto en el controlador.',
      },
      { order: 2, text: 'Agregar integration test que verifique la persistencia.' },
    ],
    linkedHuKeys: ['HU-220'],
    linkedPrKeys: [],
  },
]
