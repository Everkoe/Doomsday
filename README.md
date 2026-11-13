# MARVEL — El camino a Doomsday

Una plataforma personal, estilo streaming, para organizar un maratón del Universo Cinematográfico de Marvel y llegar preparado a **Avengers: Doomsday** (18 de diciembre de 2026).

Funciona 100 % en local: sin backend, sin cuentas. El progreso se guarda en `localStorage`.

## Ejecutar

```bash
npm install
npm run dev
```

Abre la URL que muestra Vite (por defecto http://localhost:5173).

| Script | Qué hace |
| --- | --- |
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Comprobación de tipos + build de producción en `dist/` |
| `npm run preview` | Sirve el build |
| `npm run media:wiki` | Vuelve a descargar los pósteres oficiales desde Wikipedia (sin clave) |
| `npm run media:tmdb` | Opcional: pósteres HD, backdrops y duraciones reales desde TMDB |

## Imágenes

- **Incluido:** 22 pósteres oficiales descargados de Wikipedia a `public/media/posters/`. Para las 4 series cuyo artículo usa logotipo en lugar de póster (WandaVision, Falcon y el Soldado del Invierno, Agatha All Along, VisionQuest), la tarjeta muestra el **logotipo oficial** sobre un fondo neutro. Nunca se genera ni se inventa un póster.
- **Opcional (TMDB):** pósteres en alta resolución, backdrops horizontales reales para el hero y las fichas, y duraciones exactas.
  1. Crea una clave gratuita en https://www.themoviedb.org/settings/api
  2. `cp .env.example .env` y rellena `TMDB_API_KEY` con la clave v3 (32 caracteres) **o** `TMDB_READ_TOKEN` con el token v4 (empieza por `eyJ…`). No los intercambies: TMDB responde 401.
  3. `npm run media:tmdb` y reinicia `npm run dev`.

  La clave solo la usa el script de Node: las imágenes se descargan a `public/media/tmdb/` y los datos se escriben en `src/data/media.generated.json`. Nada llega al navegador.

Atribución: pósteres © Marvel Studios / Disney, usados con fines personales y no comerciales. Con datos de TMDB: *This product uses the TMDB API but is not endorsed or certified by TMDB.*

## Funcionalidades

- **Inicio:** hero con muro de pósteres reales y la meta final, continuar viendo, próxima película pendiente, historias, carruseles por saga, resumen de progreso y reparto confirmado de Doomsday.
- **Mi maratón:** catálogo completo con filtros (todas, pendientes, vistas, saltadas, películas, series, esenciales) y la opción *Ocultar vistas*. Los filtros se recuerdan.
- **Cronología:** orden de visionado con marcas para lo que ocurre **fuera del tiempo** (Loki), en **universos alternativos** (Tierra-828, Tierra-10005) o con **ubicación aproximada**.
- **Mi progreso:** porcentaje, películas y series vistas, pendientes, saltadas, tiempo restante, próxima producción, progreso por historia y vistas recientes. Exporta/importa JSON y reinicia el maratón (con confirmación y opción de deshacer).
- **Historias:** Los Vengadores, Guardianes de la Galaxia, Wanda y Visión, El Multiverso, Los Nuevos Vengadores y El camino hacia Doom, cada una con su color y sus capítulos.
- **Fichas:** modal accesible (foco atrapado, Escape, enlace compartible con `?ver=id`) con sinopsis sin spoilers, importancia para Doomsday, personajes, conexiones, ubicación temporal, estado, *Siguiente* y spoilers opcionales.
- **Estados:** pendiente / vista / saltada. Las saltadas salen del total, se muestran en gris y se recuperan con un clic. Todos los cambios avisan con un toast que permite deshacer.

## Criterios de contenido

- El orden es de visionado y sigue la cronología interna cuando está clara. Sin fechas inventadas donde el MCU no las fija.
- Solo información confirmada (premisa oficial y reparto anunciado de Doomsday). Cuando algo no está confirmado, se dice explícitamente.
- Las duraciones de las series son aproximadas (suma de episodios) hasta que se ejecuta `media:tmdb`.

## Estructura

```
scripts/            Descarga de imágenes y datos (Wikipedia / TMDB)
public/media/       Pósteres y logotipos locales
src/
  components/       Navbar, Hero, MovieCard, MovieCarousel, MovieDetail, SagaSection,
                    ProgressIndicator, FilterBar, WatchStatusButton, Modal, Toaster…
  pages/            Inicio, Mi maratón, Cronología, Mi progreso, Historia
  data/             catalog.ts, sagas.ts, media.generated.json
  hooks/            useProgress (contexto + localStorage), useToast, useDetail
  lib/              progress.ts (lógica pura e inmutable), media.ts
  styles/           Tailwind v4 + tokens de diseño
  types/            Tipos de dominio
```

Stack: React 18, TypeScript, Vite 6, Tailwind CSS 4, Motion, Lucide, React Router 6. Respeta `prefers-reduced-motion`.
