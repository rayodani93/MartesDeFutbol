import "./EquiposPartido.css";

import type
{
    InscripcionVisible,
} from "../services/inscripcionesService";

interface EquiposPartidoProps
{
    inscripciones: InscripcionVisible[];
    nicknameUsuario?: string;
}

function EquiposPartido(
    {
        inscripciones,
        nicknameUsuario,
    }: EquiposPartidoProps,
)
{
    const equipoBlanco =
        inscripciones.filter(
            (inscripcion) =>
                inscripcion.estado === "confirmado" &&
                inscripcion.equipo_partido === "blanco",
        );

    const equipoRojo =
        inscripciones.filter(
            (inscripcion) =>
                inscripcion.estado === "confirmado" &&
                inscripcion.equipo_partido === "rojo",
        );

    const hayInscripcionesConfirmadas =
        inscripciones.some(
            (inscripcion) =>
                inscripcion.estado === "confirmado",
        );

    if (!hayInscripcionesConfirmadas)
    {
        return null;
    }

    return (
        <section className="equipos-partido">

            <div className="equipos-partido-header">

                <h2>
                    🏟️ Equipos del partido
                </h2>

                <p>
                    Ya puedes consultar la distribución para el próximo
                    entrenamiento.
                </p>

            </div>

            <div className="campo-futbol">

                <div className="equipos-grid">

                    <article className="equipo">

                        <h3>

                            <span
                                className="circulo circulo-blanco"
                                aria-hidden="true"
                            />

                            Equipo Blanco

                        </h3>

                        {
                            equipoBlanco.length === 0
                                ? (
                                    <p className="equipo-vacio">
                                        Todavía no hay jugadores asignados.
                                    </p>
                                )
                                : (
                                    <ul>

                                        {
                                            equipoBlanco.map(
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
                                                                ? "mi-equipo-jugador mi-equipo-blanco"
                                                                : ""
                                                        }
                                                    >

                                                        <span>

                                                            {
                                                                inscripcion.posicion ===
                                                                "portero"
                                                                    ? "🧤"
                                                                    : "⚽"
                                                            }

                                                        </span>

                                                        <span>

                                                            {
                                                                inscripcion.nickname
                                                            }

                                                        </span>

                                                        {
                                                            inscripcion.nickname ===
                                                            nicknameUsuario &&
                                                            (
                                                                <span className="equipo-etiqueta-tu">
                                                                    Tú
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

                    </article>

                    <article className="equipo">

                        <h3>

                            <span
                                className="circulo circulo-rojo"
                                aria-hidden="true"
                            />

                            Equipo Rojo

                        </h3>

                        {
                            equipoRojo.length === 0
                                ? (
                                    <p className="equipo-vacio">
                                        Todavía no hay jugadores asignados.
                                    </p>
                                )
                                : (
                                    <ul>

                                        {
                                            equipoRojo.map(
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
                                                                ? "mi-equipo-jugador mi-equipo-rojo"
                                                                : ""
                                                        }
                                                    >

                                                        <span>

                                                            {
                                                                inscripcion.posicion ===
                                                                "portero"
                                                                    ? "🧤"
                                                                    : "⚽"
                                                            }

                                                        </span>

                                                        <span>

                                                            {
                                                                inscripcion.nickname
                                                            }

                                                        </span>

                                                        {
                                                            inscripcion.nickname ===
                                                            nicknameUsuario &&
                                                            (
                                                                <span className="equipo-etiqueta-tu">
                                                                    Tú
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

                    </article>

                </div>

            </div>

        </section>
    );
}

export default EquiposPartido;