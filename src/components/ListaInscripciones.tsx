import "./ListaInscripciones.css";

import type
{
    InscripcionVisible,
} from "../services/inscripcionesService";

interface ListaInscripcionesProps
{
    inscripciones: InscripcionVisible[];
    nicknameUsuario?: string;
}

function ListaInscripciones(
    {
        inscripciones,
        nicknameUsuario,
    }: ListaInscripcionesProps,
)
{
    const jugadoresConfirmados =
        inscripciones.filter(
            (
                inscripcion,
            ) =>
                inscripcion.estado === "confirmado" &&
                inscripcion.posicion === "jugador",
        );

    const porterosConfirmados =
        inscripciones.filter(
            (
                inscripcion,
            ) =>
                inscripcion.estado === "confirmado" &&
                inscripcion.posicion === "portero",
        );

    const jugadoresEspera =
        inscripciones.filter(
            (
                inscripcion,
            ) =>
                inscripcion.estado === "espera" &&
                inscripcion.posicion === "jugador",
        );

    const porterosEspera =
        inscripciones.filter(
            (
                inscripcion,
            ) =>
                inscripcion.estado === "espera" &&
                inscripcion.posicion === "portero",
        );

    const plazasJugadores = 16;

    const plazasPorteros = 2;

    const libresJugadores =
        plazasJugadores -
        jugadoresConfirmados.length;

    const libresPorteros =
        plazasPorteros -
        porterosConfirmados.length;

    const porcentajeJugadores =
            Math.min(
            jugadoresConfirmados.length /
            plazasJugadores *
            100,
            100,
    );

    const porcentajePorteros =
        Math.min(
            porterosConfirmados.length /
            plazasPorteros *
            100,
            100,
    ); 

    return (
        <section className="listas-convocatoria">

            <article className="lista-card">

                <h2>
                    👥 Jugadores (
                    {jugadoresConfirmados.length}
                    /{plazasJugadores})
                </h2>

                <div className="barra-ocupacion">

                    <div
                        className="barra-ocupacion-relleno"
                        style={
                            {
                                width: `${porcentajeJugadores}%`,
                            }
                        }
                    />

                </div>

                <p className="porcentaje-ocupacion">
                    {jugadoresConfirmados.length}
                    {" / "}
                    {plazasJugadores}
                    {" plazas"}
                </p>

                {
                    jugadoresConfirmados.length === 0
                        ? (
                            <p>
                                Todavía no hay jugadores.
                            </p>
                        )
                        : (
                            <ul className="lista-confirmados">

                                {
                                    jugadoresConfirmados.map(
                                        (
                                            inscripcion,
                                        ) => (
                                            <li
                                                key={
                                                    inscripcion.id
                                                }
                                                className={
                                                    inscripcion.nickname ===
                                                    nicknameUsuario
                                                        ? "mi-inscripcion"
                                                        : ""
                                                }
                                            >
                                                <span className="estado-confirmado" />

                                                <span>
                                                    {
                                                        inscripcion.nickname
                                                    }
                                                </span>

                                                {
                                                    inscripcion.nickname ===
                                                    nicknameUsuario &&
                                                    (
                                                        <span className="etiqueta-tu">
                                                            ✓ Tú
                                                        </span>
                                                    )
                                                }

                                            </li>
                                        ),
                                    )
                                }

                            </ul>
                        )
                }

                <p className="plazas-disponibles">
                    {
                        libresJugadores === 0
                            ? "🟢 Completo"
                            : libresJugadores === 1
                                ? "Queda 1 plaza libre"
                                : `Quedan ${libresJugadores} plazas libres`
                    }
                </p>

            </article>
                
            <article className="lista-card">

                <h2>
                    🥅 Porteros (
                    {porterosConfirmados.length}
                    /2)
                </h2>

                <div className="barra-ocupacion">

                    <div
                        className="barra-ocupacion-relleno"
                        style={
                            {
                                width: `${porcentajePorteros}%`,
                            }
                        }
                    />

                </div>

                <p className="porcentaje-ocupacion">
                    {porterosConfirmados.length}
                    {" / "}
                    {plazasPorteros}
                    {" plazas"}
                </p>

                {
                    porterosConfirmados.length === 0
                        ? (
                            <p>
                                Todavía no hay porteros.
                            </p>
                        )
                        : (
                            <ul className="lista-confirmados">

                                {
                                    porterosConfirmados.map(
                                        (
                                            inscripcion,
                                        ) => (
                                            <li
                                                key={
                                                    inscripcion.id
                                                }
                                                className={
                                                    inscripcion.nickname ===
                                                    nicknameUsuario
                                                        ? "mi-inscripcion"
                                                        : ""
                                                }
                                            >
                                                <span className="estado-confirmado" />

                                                <span>
                                                    {
                                                        inscripcion.nickname
                                                    }
                                                </span>

                                                {
                                                    inscripcion.nickname ===
                                                    nicknameUsuario &&
                                                    (
                                                        <span className="etiqueta-tu">
                                                            ✓ Tú
                                                        </span>
                                                    )
                                                }

                                            </li>
                                        ),
                                    )
                                }

                            </ul>
                        )
                }

                <p className="plazas-disponibles">
                    {
                        libresPorteros === 0
                            ? "🟢 Completo"
                            : libresPorteros === 1
                                ? "Queda 1 plaza libre"
                                : `Quedan ${libresPorteros} plazas libres`
                    }
                </p>

            </article>

            {
                jugadoresEspera.length > 0 &&
                (
                    <article className="lista-card lista-espera">

                        <h2>
                            ⏳ Espera de jugadores (
                            {jugadoresEspera.length}
                            )
                        </h2>

                        <ol>

                            {
                                jugadoresEspera.map(
                                    (
                                        inscripcion,
                                    ) => (
                                        <li
                                            key={
                                                inscripcion.id
                                            }
                                            className={
                                                inscripcion.nickname ===
                                                nicknameUsuario
                                                    ? "mi-inscripcion-espera"
                                                    : ""
                                            }
                                        >
                                            <span>
                                                {
                                                    inscripcion.nickname
                                                }
                                            </span>

                                            {
                                                inscripcion.nickname ===
                                                nicknameUsuario &&
                                                (
                                                    <span className="etiqueta-tu etiqueta-tu-espera">
                                                        Tú
                                                    </span>
                                                )
                                            }

                                        </li>
                                    ),
                                )
                            }

                        </ol>

                    </article>
                )
            }

            {
                porterosEspera.length > 0 &&
                (
                    <article className="lista-card lista-espera">

                        <h2>
                            ⏳ Espera de porteros (
                            {porterosEspera.length}
                            )
                        </h2>

                        <ol>

                            {
                                porterosEspera.map(
                                    (
                                        inscripcion,
                                    ) => (
                                        <li
                                            key={
                                                inscripcion.id
                                            }
                                            className={
                                                inscripcion.nickname ===
                                                nicknameUsuario
                                                    ? "mi-inscripcion-espera"
                                                    : ""
                                            }
                                        >
                                            <span>
                                                {
                                                    inscripcion.nickname
                                                }
                                            </span>

                                            {
                                                inscripcion.nickname ===
                                                nicknameUsuario &&
                                                (
                                                    <span className="etiqueta-tu etiqueta-tu-espera">
                                                        Tú
                                                    </span>
                                                )
                                            }

                                        </li>
                                    ),
                                )
                            }

                        </ol>

                    </article>
                )
            }

        </section>
    );
}

export default ListaInscripciones;