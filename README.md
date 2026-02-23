# Bienestar Emocional

Aplicación web personal para el registro y análisis de estados emocionales con conversaciones contextuales con IA.

## Características

- Autenticación de usuarios con Supabase
- Registro de estados emocionales con intensidad y notas
- Conversaciones automáticas con IA post-registro
- Historial emocional
- Insights y patrones emocionales
- Interfaz responsive y moderna

## Stack Tecnológico

- **Frontend**: Next.js 14+ con App Router
- **UI/UX**: Tailwind CSS + ShadCN UI
- **Backend**: Supabase (Auth + PostgreSQL)
- **IA**: OpenAI API (GPT-3.5-turbo)
- **Animaciones**: Framer Motion
- **Lenguaje**: TypeScript estricto

## Configuración Inicial

### 1. Variables de Entorno

Copia `.env.example` a `.env.local` y configura:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# OpenAI Configuration
OPENAI_API_KEY=sk-your-openai-key-here

# Database URL
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.your-project.supabase.co:5432/postgres
```

### 2. Configuración de Supabase

1. Crea un nuevo proyecto en [Supabase](https://supabase.com)
2. Ejecuta el script de migración `database/migrations/001_initial_schema.sql`
3. Habilita Authentication en tu proyecto Supabase
4. Configura las variables de entorno con tus credenciales

### 3. Instalación y Ejecución

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Construir para producción
npm run build

# Iniciar producción
npm start
```

## Estructura del Proyecto

```
src/
├── app/                    # App Router (páginas y layouts)
├── components/            # Componentes UI
│   ├── ui/               # ShadCN base
│   ├── auth/             # Autenticación
│   ├── mood/             # Registro emocional
│   └── chat/             # Conversación IA
├── lib/                  # Configuración (Supabase, OpenAI)
├── hooks/                # Lógica personalizada
└── types/                # Tipos TypeScript
```

## Flujo Principal

1. **Registro/Login**: Usuario se autentica con Supabase Auth
2. **Registro Emocional**: Selecciona emoción, intensidad (1-10) y notas opcionales
3. **Conversación Automática**: IA genera respuesta contextual basada en el estado emocional
4. **Historial**: Acceso a registros y conversaciones anteriores

## Scripts SQL Importantes

El archivo `database/migrations/001_initial_schema.sql` contiene:
- Creación de tablas (profiles, mood_entries, conversations, messages)
- Políticas de seguridad (RLS)
- Triggers para timestamps y creación automática de perfiles
- Índices para optimización

## Próximos Pasos

- [ ] Componente de chat interactivo
- [ ] Historial de emociones con filtros
- [ ] Visualización de patrones emocionales
- [ ] Exportación de datos
- [ ] Notificaciones y recordatorios

## Contribución

Este es un proyecto personal. Las contribuciones son bienvenidas mediante issues y pull requests.

## Licencia

MIT License - ver archivo LICENSE para detalles.
