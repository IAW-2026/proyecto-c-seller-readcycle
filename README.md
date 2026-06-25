# Seller App

Aplicación **Seller App** del [Proyecto IAW 2026](https://iaw-2026.github.io/proyecto/) — comisión ReadCycle.

Esta app corresponde al módulo de gestión de vendedores del proyecto tipo **C (Marketplace)**.

## Descripción

Seller App es la aplicación utilizada por los vendedores de ReadCycle para administrar la venta de libros usados dentro del marketplace.

La plataforma permite:

- Publicar libros para la venta.
- Editar y eliminar publicaciones.
- Gestionar categorías de libros.
- Consultar órdenes realizadas.
- Administrar la información personal del vendedor.
- Gestionar direcciones de envío.
- Acceder a funcionalidades administrativas para el control de usuarios y categorías.

## Deploy

La aplicación está disponible en: [Vercel](https://proyecto-c-seller-readcycle.vercel.app)

## Credenciales de prueba
## Usuarios no administradores

- Email: seller+clerk_test@iaw.com
- Contraseña: iawuser#

- Email: seller2+clerk_test@iaw.com
- Contraseña: iawuser#

## Usuario administradores

- Email: admin+clerk_test@iaw.com
- Contraseña: iawuser#

## Instrucciones extra
- En la sección Órdenes existe un botón "Crear orden" que permite generar órdenes de prueba utilizando un carrito simulado. Las órdenes de ejemplo pertenecen al usuario `seller+clerktest@iaw.com`. Si las órdenes ya fueron generadas (aparecen), no se recomienda volver a presionar el botón, ya que se intentará crear nuevas órdenes con los mismos libros y podría producirse un error por falta de stock. Si se quiere testear, solo cambiar los libros del mockCart que se encuentra en src/app/dashboard/orders/page.tsx

- Los usuarios creados por un administrador deberán completar el proceso de autenticación al iniciar sesión por primera vez.

- Las Categorias deben crearse en Prisma Studio o desde Supabase (hay creadas 3 categorias para realizar la publicacion de libros)

## Enunciado

https://iaw-2026.github.io/proyecto/