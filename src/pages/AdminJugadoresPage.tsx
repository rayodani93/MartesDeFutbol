import {
    useEffect,
    useMemo,
    useState,
} from "react";

import "./AdminPage.css";

import {
    actualizarPerfilAdmin,
    obtenerPerfiles,
} from "../services/perfilesService";

import {
    obtenerEquipos,
} from "../services/equiposService";

import type {
    Perfil,
} from "../types/perfil";

import type {
    Equipo,
} from "../types/equipo";

function AdminJugadoresPage() {
    const [perfiles, setPerfiles] =
        useState<Perfil[]>([]);

    const [equipos, setEquipos] =
        useState<Equipo[]>([]);

    const [busqueda, setBusqueda] =
        useState("");

    const [loading, setLoading] =
        useState(true);

    const [procesando, setProcesando] =
        useState<string | null>(null);

    const [error, setError] =
        useState("");

    const [mensaje, setMensaje] =
        useState("");

    async function cargarDatos() {
        try {
            setLoading(true);
            setError("");

            const [
                perfilesActuales,
                equiposActuales,
            ] = await Promise.all([
                obtenerPerfiles(),
                obtenerEquipos(),
            ]);

            setPerfiles(perfilesActuales);
            setEquipos(equiposActuales);
        }
        catch (error) {
            console.error(
                "Error cargando jugadores:",
                error,
            );

            setError(
                "No se han podido cargar los jugadores.",
            );
        }
        finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        cargarDatos();
    }, []);

    const perfilesFiltrados =
        useMemo(() => {
            const texto =
                busqueda
                    .trim()
                    .toLowerCase();

            if (!texto) {
                return perfiles;
            }

            return perfiles.filter(
                (perfil) => {
                    const nombreCompleto =
                        `${perfil.nombre} ${perfil.apellidos}`
                            .toLowerCase();

                    return (
                        perfil.nickname
                            .toLowerCase()
                            .includes(texto) ||
                        nombreCompleto.includes(texto)
                    );
                },
            );
        }, [perfiles, busqueda]);

    async function guardarCambios(
        perfilId: string,
        cambios: Parameters<
            typeof actualizarPerfilAdmin
        >[1],
        mensajeCorrecto: string,
    ) {
        try {
            setProcesando(perfilId);
            setError("");
            setMensaje("");

            await actualizarPerfilAdmin(
                perfilId,
                cambios,
            );

            setPerfiles(
                (actuales) =>
                    actuales.map(
                        (perfil) =>
                            perfil.id === perfilId
                                ? {
                                    ...perfil,
                                    ...cambios,
                                }
                                : perfil,
                    ),
            );

            setMensaje(mensajeCorrecto);
        }
        catch (error) {
            console.error(
                "Error actualizando perfil:",
                error,
            );

            setError(
                "No se ha podido actualizar el jugador.",
            );
        }
        finally {
            setProcesando(null);
        }
    }

    const handleEditar = async (
        perfil: Perfil,
    ) => {
        const nickname =
            window.prompt(
                "Nickname:",
                perfil.nickname,
            );

        if (nickname === null) {
            return;
        }

        const nombre =
            window.prompt(
                "Nombre:",
                perfil.nombre,
            );

        if (nombre === null) {
            return;
        }

        const apellidos =
            window.prompt(
                "Apellidos:",
                perfil.apellidos,
            );

        if (apellidos === null) {
            return;
        }

        if (
            !nickname.trim() ||
            !nombre.trim() ||
            !apellidos.trim()
        ) {
            setError(
                "Nombre, apellidos y nickname no pueden estar vacíos.",
            );

            return;
        }

        await guardarCambios(
            perfil.id,
            {
                nickname: nickname.trim(),
                nombre: nombre.trim(),
                apellidos: apellidos.trim(),
            },
            "Datos del jugador actualizados.",
        );
    };

    const handleCambiarEquipo = async (
        perfil: Perfil,
        equipoId: number | null,
    ) => {
        await guardarCambios(
            perfil.id,
            {
                equipo_id: equipoId,
            },
            "Equipo actualizado correctamente.",
        );
    };

    const handleCambiarPosicion = async (
        perfil: Perfil,
        posicion: "jugador" | "portero",
    ) => {
        await guardarCambios(
            perfil.id,
            {
                posicion,
            },
            "Posición actualizada correctamente.",
        );
    };

    const handleCambiarRol = async (
        perfil: Perfil,
    ) => {
        const nuevoRol =
            perfil.rol === "admin"
                ? "jugador"
                : "admin";

        const texto =
            nuevoRol === "admin"
                ? `¿Seguro que quieres convertir a ${perfil.nickname} en administrador?`
                : `¿Seguro que quieres quitar los permisos de administrador a ${perfil.nickname}?`;

        if (!window.confirm(texto)) {
            return;
        }

        await guardarCambios(
            perfil.id,
            {
                rol: nuevoRol,
            },
            nuevoRol === "admin"
                ? "Administrador añadido correctamente."
                : "Permisos de administrador retirados.",
        );
    };

    const handleActivo = async (
        perfil: Perfil,
    ) => {
        const nuevoEstado =
            !perfil.activo;

        const texto =
            nuevoEstado
                ? `¿Quieres activar a ${perfil.nickname}?`
                : `¿Quieres desactivar a ${perfil.nickname}?`;

        if (!window.confirm(texto)) {
            return;
        }

        await guardarCambios(
            perfil.id,
            {
                activo: nuevoEstado,
            },
            nuevoEstado
                ? "Jugador activado correctamente."
                : "Jugador desactivado correctamente.",
        );
    };

    const handleBloqueo = async (
        perfil: Perfil,
    ) => {
        if (perfil.bloqueado) {
            const confirmar =
                window.confirm(
                    `¿Quieres desbloquear a ${perfil.nickname}?`,
                );

            if (!confirmar) {
                return;
            }

            await guardarCambios(
                perfil.id,
                {
                    bloqueado: false,
                    motivo_bloqueo: null,
                },
                "Jugador desbloqueado correctamente.",
            );

            return;
        }

        const motivo =
            window.prompt(
                `Motivo del bloqueo de ${perfil.nickname}:`,
            );

        if (motivo === null) {
            return;
        }

        if (!motivo.trim()) {
            setError(
                "Debes indicar un motivo para bloquear al jugador.",
            );

            return;
        }

        const confirmar =
            window.confirm(
                `¿Seguro que quieres bloquear a ${perfil.nickname}?`,
            );

        if (!confirmar) {
            return;
        }

        await guardarCambios(
            perfil.id,
            {
                bloqueado: true,
                motivo_bloqueo:
                    motivo.trim(),
            },
            "Jugador bloqueado correctamente.",
        );
    };

    if (loading) {
        return (
            <main className="admin-page">
                <div className="admin-container">
                    <p>
                        Cargando jugadores...
                    </p>
                </div>
            </main>
        );
    }

    return (
        <main className="admin-page">
            <div className="admin-container">
                <div className="admin-header">
                    <h1>
                        👥 Jugadores
                    </h1>

                    <p>
                        Gestiona los jugadores registrados,
                        sus equipos, posición y estado.
                    </p>
                </div>

                {error && (
                    <p
                        className="form-error"
                        role="alert"
                    >
                        {error}
                    </p>
                )}

                {mensaje && (
                    <p
                        className="admin-mensaje-ok"
                        role="status"
                    >
                        {mensaje}
                    </p>
                )}

                <div className="admin-jugadores-resumen">
                    <span>
                        👥 {perfiles.length} perfiles
                    </span>

                    <span>
                        🟢 {
                            perfiles.filter(
                                (perfil) =>
                                    perfil.activo &&
                                    !perfil.bloqueado,
                            ).length
                        } activos
                    </span>

                    <span>
                        🛡️ {
                            perfiles.filter(
                                (perfil) =>
                                    perfil.rol === "admin",
                            ).length
                        } admin
                    </span>
                </div>

                <div className="admin-jugadores-buscador">
                    <input
                        type="search"
                        placeholder="🔎 Buscar por nombre o nickname..."
                        value={busqueda}
                        onChange={(event) =>
                            setBusqueda(
                                event.target.value,
                            )
                        }
                    />
                </div>

                <div className="admin-jugadores-lista">
                    {perfilesFiltrados.map(
                        (perfil) => {
                            const trabajando =
                                procesando ===
                                perfil.id;

                            return (
                                <article
                                    key={perfil.id}
                                    className={
                                        `admin-jugador-card ${perfil.bloqueado
                                            ? "admin-jugador-bloqueado"
                                            : !perfil.activo
                                                ? "admin-jugador-inactivo"
                                                : ""
                                        }`
                                    }
                                >
                                    <div className="admin-jugador-cabecera">
                                        <div>
                                            <h2>
                                                {perfil.nickname}

                                                {perfil.rol ===
                                                    "admin" && (
                                                        <span className="admin-badge">
                                                            ADMIN
                                                        </span>
                                                    )}
                                            </h2>

                                            <p>
                                                {perfil.nombre}{" "}
                                                {perfil.apellidos}
                                            </p>
                                        </div>

                                        <span
                                            className={
                                                perfil.bloqueado
                                                    ? "admin-estado admin-estado-bloqueado"
                                                    : perfil.activo
                                                        ? "admin-estado admin-estado-activo"
                                                        : "admin-estado admin-estado-inactivo"
                                            }
                                        >
                                            {perfil.bloqueado
                                                ? "🔴 Bloqueado"
                                                : perfil.activo
                                                    ? "🟢 Activo"
                                                    : "⚪ Inactivo"}
                                        </span>
                                    </div>

                                    {perfil.bloqueado &&
                                        perfil.motivo_bloqueo && (
                                            <p className="admin-motivo-bloqueo">
                                                Motivo:{" "}
                                                {perfil.motivo_bloqueo}
                                            </p>
                                        )}

                                    <div className="admin-jugador-campos">
                                        <label>
                                            Equipo

                                            <select
                                                value={
                                                    perfil.equipo_id ??
                                                    ""
                                                }
                                                disabled={
                                                    trabajando
                                                }
                                                onChange={(event) => {
                                                    const valor =
                                                        event.target.value;

                                                    handleCambiarEquipo(
                                                        perfil,
                                                        valor
                                                            ? Number(valor)
                                                            : null,
                                                    );
                                                }}
                                            >
                                                <option value="">
                                                    Sin equipo
                                                </option>

                                                {equipos.map(
                                                    (equipo) => (
                                                        <option
                                                            key={
                                                                equipo.id
                                                            }
                                                            value={
                                                                equipo.id
                                                            }
                                                        >
                                                            {
                                                                equipo.nombre
                                                            }
                                                        </option>
                                                    ),
                                                )}
                                            </select>
                                        </label>

                                        <label>
                                            Posición

                                            <select
                                                value={
                                                    perfil.posicion
                                                }
                                                disabled={
                                                    trabajando
                                                }
                                                onChange={(event) => {
                                                    const posicion =
                                                        event.target
                                                            .value;

                                                    if (
                                                        posicion === "jugador" ||
                                                        posicion === "portero"
                                                    ) {
                                                        handleCambiarPosicion(
                                                            perfil,
                                                            posicion,
                                                        );
                                                    }
                                                }}
                                            >
                                                <option value="jugador">
                                                    Jugador
                                                </option>

                                                <option value="portero">
                                                    Portero
                                                </option>
                                            </select>
                                        </label>
                                    </div>

                                    <div className="admin-jugador-acciones">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleEditar(
                                                    perfil,
                                                )
                                            }
                                            disabled={
                                                trabajando
                                            }
                                        >
                                            ✏️ Editar
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleActivo(
                                                    perfil,
                                                )
                                            }
                                            disabled={
                                                trabajando
                                            }
                                        >
                                            {perfil.activo
                                                ? "⏸️ Desactivar"
                                                : "▶️ Activar"}
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleBloqueo(
                                                    perfil,
                                                )
                                            }
                                            disabled={
                                                trabajando
                                            }
                                        >
                                            {perfil.bloqueado
                                                ? "🔓 Desbloquear"
                                                : "🚫 Bloquear"}
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleCambiarRol(
                                                    perfil,
                                                )
                                            }
                                            disabled={
                                                trabajando
                                            }
                                        >
                                            {perfil.rol ===
                                                "admin"
                                                ? "🛡️ Quitar admin"
                                                : "🛡️ Hacer admin"}
                                        </button>
                                    </div>
                                </article>
                            );
                        },
                    )}
                </div>

                {perfilesFiltrados.length === 0 && (
                    <p>
                        No se han encontrado jugadores.
                    </p>
                )}
            </div>
        </main>
    );
}

export default AdminJugadoresPage;