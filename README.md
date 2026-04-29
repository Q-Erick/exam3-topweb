# Portal Estudiantil - TecNM Celaya

Aplicación web para consultar información académica del sistema SII ITC.
Desarrollada con Next.js, TypeScript y Tailwind CSS.

## Tecnologías

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Lucide React (iconos)
<img width="1913" height="906" alt="image" src="https://github.com/user-attachments/assets/dd762887-e696-49ba-9ea7-1d5aaa900fdd" />

## Requisitos

- Node.js 18 o superior
- npm

## Instalación

1. Clonar el repositorio

git clone <url-del-repo>
cd exam3-topweb

2. Instalar dependencias

npm install

3. Iniciar el servidor de desarrollo

npm run dev

4. Abrir en el navegador

http://localhost:3000

## Estructura del proyecto

src/
├── app/                        Rutas y páginas (Next.js App Router)
│   ├── (auth)/login/           Página de inicio de sesión
│   └── (dashboard)/            Páginas protegidas con sidebar
│       ├── inicio/             Dashboard principal
│       ├── calificaciones/     Calificaciones del semestre
│       ├── kardex/             Historial académico
│       └── horarios/           Horario del semestre
│
├── features/                   Lógica por funcionalidad
│   ├── auth/                   Login y autenticación
│   ├── estudiante/             Datos del perfil
│   ├── calificaciones/         Calificaciones
│   ├── kardex/                 Kardex
│   └── horarios/               Horarios
│
└── shared/                     Código reutilizable
    ├── components/ui/          Button, Input, Card, Badge, Spinner, Avatar
    ├── components/layout/      Sidebar, TopBar
    ├── hooks/                  useAuth (protección de rutas)
    ├── lib/                    api.ts (cliente HTTP), utils.ts
    └── types/                  Tipos base de la API

## API

Base URL: https://sii.celaya.tecnm.mx/api

El token JWT se obtiene en /api/login y se guarda en localStorage.
Todos los endpoints protegidos lo usan automáticamente via shared/lib/api.ts.

## Como agregar una nueva sección

1. Crear la carpeta en src/features/tu-seccion/
2. Agregar componentes en features/tu-seccion/components/
3. Agregar el hook en features/tu-seccion/hooks/
4. Agregar los tipos en features/tu-seccion/types/
5. Crear la página en src/app/(dashboard)/tu-seccion/page.tsx
6. Agregar el enlace en src/shared/components/layout/Sidebar.tsx
