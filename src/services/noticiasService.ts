import { supabase } from "./supabase";

import type {
    Noticia,
} from "../types/noticia";


/*
 * =========================================================
 * OBTENER NOTICIAS
 * =========================================================
 */

export async function obtenerNoticias()
: Promise<Noticia[]>
{
    const { data, error } = await supabase
        .from("noticias")
        .select("*")
        .eq("publicada", true)
        .order(
            "created_at",
            {
                ascending: false,
            },
        );

    if (error)
    {
        console.error(
            "Error obteniendo noticias:",
            error,
        );

        throw error;
    }

    return data ?? [];
}


/*
 * =========================================================
 * SUBIR IMAGEN
 * =========================================================
 */

export async function subirImagenNoticia(
    archivo: File,
): Promise<string>
{
    /*
     * Obtenemos la extensión del archivo.
     */
    const extension =
        archivo.name
            .split(".")
            .pop()
            ?.toLowerCase() ?? "jpg";

    /*
     * Generamos un nombre único para evitar
     * que dos imágenes se sobrescriban.
     */
    const nombreArchivo =
        `${crypto.randomUUID()}.${extension}`;

    /*
     * Guardamos las imágenes dentro de la carpeta
     * "noticias" del bucket "noticias".
     */
    const ruta =
        `noticias/${nombreArchivo}`;

    const { error } = await supabase.storage
        .from("noticias")
        .upload(
            ruta,
            archivo,
            {
                cacheControl: "3600",
                upsert: false,
            },
        );

    if (error)
    {
        console.error(
            "Error subiendo imagen:",
            error,
        );

        throw error;
    }

    /*
     * Como el bucket es público, obtenemos
     * directamente la URL pública de la imagen.
     */
    const { data } = supabase.storage
        .from("noticias")
        .getPublicUrl(ruta);

    return data.publicUrl;
}


/*
 * =========================================================
 * CREAR NOTICIA
 * =========================================================
 */

export async function crearNoticia(
    titulo: string,
    contenido: string,
    imagenUrl: string | null,
): Promise<Noticia>
{
    const {
        data: usuarioData,
        error: usuarioError,
    } = await supabase.auth.getUser();

    if (usuarioError)
    {
        throw usuarioError;
    }

    const usuario =
        usuarioData.user;

    if (!usuario)
    {
        throw new Error(
            "No hay ningún usuario autenticado.",
        );
    }

    const { data, error } = await supabase
        .from("noticias")
        .insert(
            {
                titulo: titulo.trim(),
                contenido: contenido.trim(),
                imagen_url: imagenUrl,
                autor_id: usuario.id,
                publicada: true,
            },
        )
        .select()
        .single();

    if (error)
    {
        console.error(
            "Error creando noticia:",
            error,
        );

        throw error;
    }

    return data;
}


/*
 * =========================================================
 * EDITAR NOTICIA
 * =========================================================
 */

export async function editarNoticia(
    noticiaId: number,
    titulo: string,
    contenido: string,
    imagenUrl: string | null,
): Promise<Noticia>
{
    const { data, error } = await supabase
        .from("noticias")
        .update(
            {
                titulo: titulo.trim(),
                contenido: contenido.trim(),
                imagen_url: imagenUrl,
                updated_at: new Date().toISOString(),
            },
        )
        .eq(
            "id",
            noticiaId,
        )
        .select()
        .single();

    if (error)
    {
        console.error(
            "Error editando noticia:",
            error,
        );

        throw error;
    }

    return data;
}


/*
 * =========================================================
 * ELIMINAR IMAGEN DE STORAGE
 * =========================================================
 */

export async function eliminarImagenNoticia(
    imagenUrl: string,
): Promise<void>
{
    try
    {
        /*
         * Las imágenes tienen una URL parecida a:
         *
         * .../storage/v1/object/public/noticias/
         * noticias/archivo.jpg
         *
         * Necesitamos recuperar únicamente:
         *
         * noticias/archivo.jpg
         */

        const url =
            new URL(imagenUrl);

        const marcador =
            "/storage/v1/object/public/noticias/";

        const posicion =
            url.pathname.indexOf(
                marcador,
            );

        if (posicion === -1)
        {
            console.warn(
                "No se ha podido obtener la ruta de la imagen:",
                imagenUrl,
            );

            return;
        }

        const rutaArchivo =
            decodeURIComponent(
                url.pathname.substring(
                    posicion + marcador.length,
                ),
            );

        const {
            error: storageError,
        } = await supabase.storage
            .from("noticias")
            .remove([
                rutaArchivo,
            ]);

        if (storageError)
        {
            console.error(
                "Error eliminando imagen de Storage:",
                storageError,
            );

            throw storageError;
        }
    }
    catch (error)
    {
        console.error(
            "Error procesando la imagen de la noticia:",
            error,
        );

        throw error;
    }
}


/*
 * =========================================================
 * ELIMINAR NOTICIA
 * =========================================================
 */

export async function eliminarNoticia(
    noticia: Noticia,
): Promise<void>
{
    /*
     * Primero eliminamos la noticia de la base de datos.
     */
    const { error } = await supabase
        .from("noticias")
        .delete()
        .eq(
            "id",
            noticia.id,
        );

    if (error)
    {
        console.error(
            "Error eliminando noticia:",
            error,
        );

        throw error;
    }

    /*
     * Si la noticia tenía una imagen,
     * también la eliminamos de Storage.
     */
    if (noticia.imagen_url)
    {
        try
        {
            await eliminarImagenNoticia(
                noticia.imagen_url,
            );
        }
        catch (error)
        {
            /*
             * La noticia ya ha sido eliminada de la tabla.
             *
             * Si falla únicamente la eliminación de la foto,
             * no hacemos fallar toda la operación.
             */
            console.error(
                "La noticia se eliminó, pero no se pudo eliminar su imagen:",
                error,
            );
        }
    }
}