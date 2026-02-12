# Marketing Landing - Implementacion

## Objetivo

Crear una landing de marketing publica, minimalista y en castellano argentino,
con una sola pagina, orientada a madres/padres/tutores y CTA para ir al login.

Nombre de escuela mostrado en la pagina:

- `Ohalei Jinuj - Escuela Primaria Jabad Lubavitch Argentina`

## Ubicacion (todo en una carpeta)

- `apps/app/app/(public)/page.tsx`
- `apps/app/app/(public)/marketing-landing.tsx`
- `apps/app/app/(public)/marketing-landing.module.css`
- `apps/app/app/(public)/MARKETING_PAGE.md`

## Que hace cada archivo

- `page.tsx`
  - Define la ruta publica `/`.
  - Si el usuario ya esta autenticado, redirige a `/dashboard`.
  - Obtiene datos de precios desde base de datos via `database.$queryRaw`.
  - Si falla conexion DB, usa un fallback local con los mismos valores fake.
- `marketing-landing.tsx`
  - Render de la landing.
  - Incluye pestanas: `Familias`, `Colegio`, `Pagos`, `Planes`.
  - Incluye CTA con redireccion a `/sign-in`.
- `marketing-landing.module.css`
  - Estilos de la landing.
  - Paleta aplicada:
    - `#5F7566`
    - `#779279`
    - `#94AF90`
    - `#B5CCA8`
    - `#D7E8C1`
    - `#E3ECC9`
    - `#EDEFD1`
    - `#F2EFD9`
    - `#F6EFE1`
    - `#F8F1E9`
    - `#FBF5F2`

## Sistema de redirect

Se aplico un redirect simple en dos capas:

1. **Landing publica (`/`)**
   - Si hay sesion activa -> `redirect("/dashboard")`.
2. **Botones CTA**
   - En landing, el boton `Ingresar` apunta a `/sign-in`.

## Cambios fuera de esta carpeta para que funcione

- Se movio la home autenticada a:
  - `apps/app/app/(authenticated)/dashboard/page.tsx`
- Se elimino la antigua ruta autenticada en `/`:
  - `apps/app/app/(authenticated)/page.tsx`
- Se actualizo redirect interno de busqueda:
  - `apps/app/app/(authenticated)/search/page.tsx`
  - Cambio de `redirect("/")` a `redirect("/dashboard")`.
- Se actualizo el `OrganizationSwitcher`:
  - `apps/app/app/(authenticated)/components/sidebar.tsx`
  - Cambio `afterSelectOrganizationUrl` a `"/dashboard"`.

## Nota sobre precios

La tabla de precios usa **valores de prueba** cargados por query SQL `VALUES`
para simular origen DB hasta definir tablas reales (`plans`, `plan_prices`, etc.).
