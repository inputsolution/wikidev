import type {
  Attachment,
  DevOpsLink,
  JiraLink,
  Project,
  ProjectChange,
} from './types'

export const mockProjects: Project[] = [
  {
    id: 'p-001',
    code: 'PR001',
    name: 'API Solicitudes',
    description:
      'Servicio REST para la gestión de solicitudes de crédito de clientes personales y empresariales.',
    status: 'Activo',
    owner: { id: 'u-101', name: 'María P.', initials: 'MP' },
    lastUpdate: '15/03/2026',
    changesCount: 42,
    prCount: 8,
    docsCount: 14,
    tech: ['.NET 8', 'SQL Server', 'Azure'],
  },
  {
    id: 'p-002',
    code: 'PR002',
    name: 'Portal Cliente',
    description:
      'Portal transaccional para clientes con autenticación SSO, consultas y operaciones.',
    status: 'Activo',
    owner: { id: 'u-102', name: 'Carlos R.', initials: 'CR' },
    lastUpdate: '12/03/2026',
    changesCount: 67,
    prCount: 12,
    docsCount: 21,
    tech: ['React', 'TypeScript', 'Node'],
  },
  {
    id: 'p-003',
    code: 'PR003',
    name: 'Motor de Pagos',
    description:
      'Orquestador de pagos integrado con ACH, tarjetas y billeteras digitales.',
    status: 'Activo',
    owner: { id: 'u-103', name: 'Ana G.', initials: 'AG' },
    lastUpdate: '10/03/2026',
    changesCount: 128,
    prCount: 5,
    docsCount: 33,
    tech: ['Java', 'Kafka', 'PostgreSQL'],
  },
  {
    id: 'p-004',
    code: 'PR004',
    name: 'Data Warehouse',
    description: 'Repositorio analítico centralizado con pipelines ETL diarios.',
    status: 'En pausa',
    owner: { id: 'u-104', name: 'Jorge V.', initials: 'JV' },
    lastUpdate: '28/02/2026',
    changesCount: 19,
    prCount: 2,
    docsCount: 9,
    tech: ['Python', 'Airflow', 'Snowflake'],
  },
  {
    id: 'p-005',
    code: 'PR005',
    name: 'Mobile Banking',
    description: 'Aplicación móvil oficial para iOS y Android del banco.',
    status: 'Activo',
    owner: { id: 'u-105', name: 'Luisa F.', initials: 'LF' },
    lastUpdate: '14/03/2026',
    changesCount: 88,
    prCount: 6,
    docsCount: 18,
    tech: ['React Native', 'Swift', 'Kotlin'],
  },
  {
    id: 'p-006',
    code: 'PR006',
    name: 'Core Bancario',
    description: 'Sistema central de cuentas, transacciones y conciliaciones.',
    status: 'Activo',
    owner: { id: 'u-106', name: 'Ricardo M.', initials: 'RM' },
    lastUpdate: '13/03/2026',
    changesCount: 251,
    prCount: 4,
    docsCount: 47,
    tech: ['COBOL', 'DB2', 'AIX'],
  },
]

export const mockChanges: Record<string, ProjectChange[]> = {
  'p-001': [
    {
      id: 'c-001',
      date: '12 Abr 2026',
      type: 'Mejora',
      title: 'Actualización de validación de dirección',
      description: 'Se actualizó el servicio de validación con la nueva integración de Google Maps.',
      huRefs: ['HU-120', 'HU-450'],
      prRefs: ['PR-450'],
      author: { id: 'u-101', name: 'María P.', initials: 'MP' },
      environment: 'QA',
      version: '1.5.2',
      comment: {
        author: { id: 'u-102', name: 'Carlos R.', initials: 'CR' },
        text: 'Pruebas en QA completadas correctamente.',
      },
    },
    {
      id: 'c-002',
      date: '10 Abr 2026',
      type: 'Bugfix',
      title: 'Corrección error ORA-01403',
      description: 'Se corrigió la consulta que no manejaba el caso cuando no hay registros.',
      huRefs: ['HU-115'],
      prRefs: ['PR-432'],
      author: { id: 'u-103', name: 'Diego G.', initials: 'DG' },
      environment: 'DEV',
      version: '1.5.1',
    },
    {
      id: 'c-003',
      date: '05 Abr 2026',
      type: 'Refactor',
      title: 'Refactor del módulo de scoring',
      description: 'Migración de scoring sincrónico a colas para mejorar tiempos de respuesta.',
      huRefs: ['HU-098'],
      prRefs: ['PR-421'],
      author: { id: 'u-101', name: 'María P.', initials: 'MP' },
      environment: 'DEV',
      version: '1.5.0',
    },
  ],
}

export const mockJiraLinks: Record<string, JiraLink[]> = {
  'p-001': [
    { id: 'j-1', key: 'HU-120', title: 'Validar Dirección – Jira' },
    { id: 'j-2', key: 'HU-450', title: 'Integración Google Maps' },
    { id: 'j-3', key: 'HU-115', title: 'Bug consulta clientes' },
  ],
}

export const mockDevOpsLinks: Record<string, DevOpsLink[]> = {
  'p-001': [
    { id: 'd-1', prNumber: 450, title: 'Azure DevOps · Refactor Dirección' },
    { id: 'd-2', prNumber: 432, title: 'Azure DevOps · Fix Query' },
    { id: 'd-3', prNumber: 421, title: 'Azure DevOps · Scoring async' },
  ],
}

export const mockAttachments: Record<string, Attachment[]> = {
  'p-001': [
    { id: 'a-1', name: 'script_validacion.sql', size: '24 KB', uploadedAt: '12/04/2026' },
    { id: 'a-2', name: 'Pruebas_QA.png', size: '318 KB', uploadedAt: '12/04/2026' },
    { id: 'a-3', name: 'diagrama-flujo.pdf', size: '1.2 MB', uploadedAt: '10/04/2026' },
  ],
}
