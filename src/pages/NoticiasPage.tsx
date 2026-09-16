import {
    useEffect,
    useState,
} from "react";

import type {
    ChangeEvent,
    FormEvent,
} from "react";

import "./NoticiasPage.css";

import {
    crearNoticia,
    editarNoticia,
    eliminarImagenNoticia,
    eliminarNoticia,
    obtenerNoticias,
    registrarVisitaNoticias,
    subirImagenNoticia,
} from "../services/noticiasService";

import type {
    Noticia,
} from "../types/noticia";

import {
    useAuth,
} from "../contexts/AuthContext";

function NoticiasPage()
{
    const { perfil } = useAuth();

    const [noticias, setNoticias] =
        useState<Noticia[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [mostrarFormulario, setMostrarFormulario] =
        useState(false);

    const [noticiaEditando, setNoticiaEditando] =
        useState<Noticia | null>(null);

    const [titulo, setTitulo] =
        useState("");

    const [contenido, setContenido] =
        useState("");

    const [imagen, setImagen] =
        useState<File | null>(null);

    const [previewImagen, setPreviewImagen] =
        useState<string | null>(null);

    const [quitarImagenActual, setQuitarImagenActual] =
        useState(false);

    const [guardando, setGuardando] =
        useState(false);

    const [eliminandoId, setEliminandoId] =
        useState<number | null>(null);

    const esAdmin =
        perfil?.rol === "admin";

    async function cargarNoticias()
    {
        try
        {
            setLoading(true);
            setError("");

            const data =
                await obtenerNoticias();

            setNoticias(data);
        }
        catch (error)
        {
            console.error(
                "Error cargando noticias:",
                error,
            );

            setError(
                "No se han podido cargar las noticias.",
            );
        }
        finally
        {
            setLoading(false);
        }
    }

    /*
     * =========================================================
     * CARGAR NOTICIAS Y REGISTRAR VISITA
     * =========================================================
     *
     * Cada vez que el usuario entra en /noticias,
     * registramos una nueva visita.
     *
     * Si falla el registro de la visita,
     * NO impedimos que pueda seguir leyendo las noticias.
     */
    useEffect(() =>
{
    console.log(
        "ENTRANDO EN NOTICIAS",
    );

    registrarVisitaNoticias()
        .then(() =>
        {
            console.log(
                "VISITA REGISTRADA CORRECTAMENTE",
            );
        })
        .catch((error) =>
        {
            console.error(
                "ERROR REGISTRANDO VISITA:",
                error,
            );
        });

    cargarNoticias();
}, []);

    useEffect(() =>
    {
        return () =>
        {
            if (
                previewImagen &&
                previewImagen.startsWith("blob:")
            )
            {
                URL.revokeObjectURL(
                    previewImagen,
                );
            }
        };
    }, [previewImagen]);

    function formatearFecha(
        fecha: string,
    )
    {
        return new Intl.DateTimeFormat(
            "es-ES",
            {
                day: "numeric",
                month: "long",
                year: "numeric",
                timeZone: "Europe/Madrid",
            },
        ).format(
            new Date(fecha),
        );
    }

    function liberarPreview()
    {
        if (
            previewImagen &&
            previewImagen.startsWith("blob:")
        )
        {
            URL.revokeObjectURL(
                previewImagen,
            );
        }
    }

    function seleccionarImagen(
        event: ChangeEvent<HTMLInputElement>,
    )
    {
        const archivo =
            event.target.files?.[0];

        if (!archivo)
        {
            return;
        }

        if (!archivo.type.startsWith("image/"))
        {
            alert(
                "El archivo seleccionado debe ser una imagen.",
            );

            event.target.value = "";

            return;
        }

        if (archivo.size > 10 * 1024 * 1024)
        {
            alert(
                "La imagen no puede superar los 10 MB.",
            );

            event.target.value = "";

            return;
        }

        liberarPreview();

        setImagen(archivo);

        setPreviewImagen(
            URL.createObjectURL(
                archivo,
            ),
        );

        setQuitarImagenActual(false);
    }

    function limpiarFormulario()
    {
        liberarPreview();

        setTitulo("");
        setContenido("");
        setImagen(null);
        setPreviewImagen(null);
        setQuitarImagenActual(false);
        setNoticiaEditando(null);
        setMostrarFormulario(false);
    }

    function abrirNuevaNoticia()
    {
        liberarPreview();

        setTitulo("");
        setContenido("");
        setImagen(null);
        setPreviewImagen(null);
        setQuitarImagenActual(false);
        setNoticiaEditando(null);
        setMostrarFormulario(true);

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }

    function abrirEdicion(
        noticia: Noticia,
    )
    {
        liberarPreview();

        setNoticiaEditando(noticia);
        setTitulo(noticia.titulo);
        setContenido(noticia.contenido);
        setImagen(null);
        setPreviewImagen(null);
        setQuitarImagenActual(false);
        setMostrarFormulario(true);

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }

    function quitarFoto()
    {
        liberarPreview();

        setImagen(null);
        setPreviewImagen(null);
        setQuitarImagenActual(true);
    }

    async function guardarNoticia(
        event: FormEvent<HTMLFormElement>,
    )
    {
        event.preventDefault();

        const tituloLimpio =
            titulo.trim();

        const contenidoLimpio =
            contenido.trim();

        if (!tituloLimpio)
        {
            alert(
                "Escribe un título para la noticia.",
            );

            return;
        }

        if (!contenidoLimpio)
        {
            alert(
                "Escribe el contenido de la noticia.",
            );

            return;
        }

        try
        {
            setGuardando(true);
            setError("");

            /*
             * =================================================
             * CREAR NOTICIA
             * =================================================
             */
            if (!noticiaEditando)
            {
                let imagenUrl: string | null =
                    null;

                if (imagen)
                {
                    imagenUrl =
                        await subirImagenNoticia(
                            imagen,
                        );
                }

                await crearNoticia(
                    tituloLimpio,
                    contenidoLimpio,
                    imagenUrl,
                );
            }

            /*
             * =================================================
             * EDITAR NOTICIA
             * =================================================
             */
            else
            {
                const imagenAnterior =
                    noticiaEditando.imagen_url;

                let imagenUrlFinal =
                    imagenAnterior;

                /*
                 * El administrador ha elegido
                 * una foto nueva.
                 */
                if (imagen)
                {
                    imagenUrlFinal =
                        await subirImagenNoticia(
                            imagen,
                        );
                }
                /*
                 * El administrador quiere dejar
                 * la noticia sin fotografía.
                 */
                else if (quitarImagenActual)
                {
                    imagenUrlFinal =
                        null;
                }

                await editarNoticia(
                    noticiaEditando.id,
                    tituloLimpio,
                    contenidoLimpio,
                    imagenUrlFinal,
                );

                /*
                 * Borramos la imagen antigua únicamente
                 * después de haber actualizado correctamente
                 * la noticia.
                 */
                const imagenHaCambiado =
                    imagenAnterior &&
                    imagenAnterior !== imagenUrlFinal;

                if (imagenHaCambiado)
                {
                    try
                    {
                        await eliminarImagenNoticia(
                            imagenAnterior,
                        );
                    }
                    catch (error)
                    {
                        console.error(
                            "La noticia se editó, pero no se pudo eliminar la imagen anterior:",
                            error,
                        );
                    }
                }
            }

            limpiarFormulario();

            await cargarNoticias();
        }
        catch (error)
        {
            console.error(
                "Error guardando noticia:",
                error,
            );

            setError(
                noticiaEditando
                    ? "No se ha podido editar la noticia."
                    : "No se ha podido publicar la noticia.",
            );
        }
        finally
        {
            setGuardando(false);
        }
    }

    async function confirmarEliminar(
        noticia: Noticia,
    )
    {
        const confirmado =
            window.confirm(
                `¿Seguro que quieres eliminar "${noticia.titulo}"?\n\nEsta acción no se puede deshacer.`,
            );

        if (!confirmado)
        {
            return;
        }

        try
        {
            setEliminandoId(
                noticia.id,
            );

            setError("");

            await eliminarNoticia(
                noticia,
            );

            /*
             * Podemos quitarla directamente de pantalla
             * sin volver a consultar toda la tabla.
             */
            setNoticias(
                (actuales) =>
                    actuales.filter(
                        (item) =>
                            item.id !== noticia.id,
                    ),
            );

            if (
                noticiaEditando?.id ===
                noticia.id
            )
            {
                limpiarFormulario();
            }
        }
        catch (error)
        {
            console.error(
                "Error eliminando noticia:",
                error,
            );

            setError(
                "No se ha podido eliminar la noticia.",
            );
        }
        finally
        {
            setEliminandoId(null);
        }
    }

    return (
        <main className="noticias-page">
            <div className="noticias-container">
                <header className="noticias-header">
                    <div>
                        <h1>
                            📰 Noticias
                        </h1>

                        <p>
                            Toda la actualidad de Martes de Fútbol.
                        </p>
                    </div>

                    {esAdmin && (
                        <button
                            type="button"
                            className="noticias-nueva-boton"
                            onClick={
                                mostrarFormulario
                                    ? limpiarFormulario
                                    : abrirNuevaNoticia
                            }
                            disabled={guardando}
                        >
                            {mostrarFormulario
                                ? "✖ Cancelar"
                                : "➕ Nueva noticia"}
                        </button>
                    )}
                </header>

                {error && (
                    <p
                        className="noticias-error"
                        role="alert"
                    >
                        {error}
                    </p>
                )}

                {esAdmin &&
                    mostrarFormulario && (
                        <section className="noticia-formulario-card">
                            <h2>
                                {noticiaEditando
                                    ? "✏️ Editar noticia"
                                    : "📝 Nueva noticia"}
                            </h2>

                            <form
                                onSubmit={
                                    guardarNoticia
                                }
                            >
                                <label htmlFor="noticia-titulo">
                                    Título
                                </label>

                                <input
                                    id="noticia-titulo"
                                    type="text"
                                    value={titulo}
                                    maxLength={150}
                                    disabled={guardando}
                                    placeholder="Título de la noticia"
                                    onChange={(event) =>
                                        setTitulo(
                                            event.target.value,
                                        )
                                    }
                                />

                                <label htmlFor="noticia-contenido">
                                    Texto
                                </label>

                                <textarea
                                    id="noticia-contenido"
                                    value={contenido}
                                    disabled={guardando}
                                    placeholder="Escribe aquí la noticia..."
                                    rows={8}
                                    onChange={(event) =>
                                        setContenido(
                                            event.target.value,
                                        )
                                    }
                                />

                                <label htmlFor="noticia-imagen">
                                    Foto
                                </label>

                                {noticiaEditando?.imagen_url &&
                                    !imagen &&
                                    !quitarImagenActual && (
                                        <div className="noticia-imagen-actual">
                                            <p>
                                                Foto actual
                                            </p>

                                            <img
                                                src={
                                                    noticiaEditando.imagen_url
                                                }
                                                alt="Foto actual de la noticia"
                                            />

                                            <button
                                                type="button"
                                                className="noticia-quitar-imagen"
                                                onClick={
                                                    quitarFoto
                                                }
                                                disabled={
                                                    guardando
                                                }
                                            >
                                                🗑️ Quitar foto
                                            </button>
                                        </div>
                                    )}

                                {quitarImagenActual && (
                                    <p className="noticia-foto-eliminada">
                                        La noticia quedará sin foto.
                                        Puedes seleccionar otra si quieres sustituirla.
                                    </p>
                                )}

                                <input
                                    id="noticia-imagen"
                                    type="file"
                                    accept="image/*"
                                    disabled={guardando}
                                    onChange={
                                        seleccionarImagen
                                    }
                                />

                                {previewImagen && (
                                    <div className="noticia-preview">
                                        <p>
                                            Nueva foto
                                        </p>

                                        <img
                                            src={
                                                previewImagen
                                            }
                                            alt="Vista previa de la nueva imagen"
                                        />

                                        <button
                                            type="button"
                                            className="noticia-quitar-imagen"
                                            onClick={
                                                quitarFoto
                                            }
                                            disabled={
                                                guardando
                                            }
                                        >
                                            🗑️ Quitar selección
                                        </button>
                                    </div>
                                )}

                                <div className="noticia-formulario-acciones">
                                    <button
                                        type="button"
                                        className="noticia-cancelar"
                                        disabled={
                                            guardando
                                        }
                                        onClick={
                                            limpiarFormulario
                                        }
                                    >
                                        Cancelar
                                    </button>

                                    <button
                                        type="submit"
                                        className="noticia-publicar"
                                        disabled={
                                            guardando
                                        }
                                    >
                                        {guardando
                                            ? "Guardando..."
                                            : noticiaEditando
                                              ? "💾 Guardar cambios"
                                              : "📰 Publicar noticia"}
                                    </button>
                                </div>
                            </form>
                        </section>
                    )}

                {loading && (
                    <p>
                        Cargando noticias...
                    </p>
                )}

                {!loading &&
                    !error &&
                    noticias.length === 0 &&
                    !mostrarFormulario && (
                        <div className="noticias-vacio">
                            <div className="noticias-vacio-icono">
                                📰
                            </div>

                            <h2>
                                Todavía no hay noticias
                            </h2>

                            <p>
                                Cuando se publique la primera,
                                aparecerá aquí.
                            </p>
                        </div>
                    )}

                <section className="noticias-listado">
                    {noticias.map(
                        (noticia) => (
                            <article
                                key={noticia.id}
                                className="noticia-card"
                            >
                                {noticia.imagen_url && (
                                    <img
                                        src={
                                            noticia.imagen_url
                                        }
                                        alt={
                                            noticia.titulo
                                        }
                                        className="noticia-imagen"
                                    />
                                )}

                                <div className="noticia-contenido">
                                    <h2>
                                        {
                                            noticia.titulo
                                        }
                                    </h2>

                                    <p className="noticia-fecha">
                                        {formatearFecha(
                                            noticia.created_at,
                                        )}
                                    </p>

                                    <p className="noticia-texto">
                                        {
                                            noticia.contenido
                                        }
                                    </p>

                                    {esAdmin && (
                                        <div className="noticia-admin-acciones">
                                            <button
                                                type="button"
                                                className="noticia-editar"
                                                onClick={() =>
                                                    abrirEdicion(
                                                        noticia,
                                                    )
                                                }
                                                disabled={
                                                    eliminandoId ===
                                                    noticia.id
                                                }
                                            >
                                                ✏️ Editar
                                            </button>

                                            <button
                                                type="button"
                                                className="noticia-eliminar"
                                                onClick={() =>
                                                    confirmarEliminar(
                                                        noticia,
                                                    )
                                                }
                                                disabled={
                                                    eliminandoId ===
                                                    noticia.id
                                                }
                                            >
                                                {eliminandoId ===
                                                noticia.id
                                                    ? "Eliminando..."
                                                    : "🗑️ Eliminar"}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </article>
                        ),
                    )}
                </section>
            </div>
        </main>
    );
}

export default NoticiasPage;