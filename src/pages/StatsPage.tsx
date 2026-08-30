import
{
    CalendarCheck,
    ChartNoAxesColumnIncreasing,
    CircleEqual,
    CircleX,
    Medal,
    Percent,
    Trophy,
} from "lucide-react";

import
{
    useEffect,
    useState,
} from "react";

import { useAuth } from "../contexts/AuthContext";

import
{
    obtenerEstadisticasUsuario,
    obtenerRankingAsistencia,
    type EstadisticasUsuario,
    type RankingAsistencia,
} from "../services/estadisticasService";

import "./StatsPage.css";

const estadisticasIniciales: EstadisticasUsuario =
{
    entrenamientos: 0,
    victorias: 0,
    empates: 0,
    derrotas: 0,
    porcentaje_victorias: 0,
    porcentaje_asistencia: 0,
};

function StatsPage()
{
    const { perfil } = useAuth();

    const [estadisticas, setEstadisticas] =
        useState<EstadisticasUsuario>(
            estadisticasIniciales,
        );

    const [ranking, setRanking] =
        useState<RankingAsistencia[]>([]);

    const [cargando, setCargando] =
        useState(true);

    const [error, setError] =
        useState<string | null>(
            null,
        );

    useEffect(
        () =>
        {
            async function cargarEstadisticas()
            {
                if (!perfil)
                {
                    return;
                }

                try
                {
                    setCargando(true);
                    setError(null);

                    const [
                        datosEstadisticas,
                        datosRanking,
                    ] =
                        await Promise.all(
                            [
                                obtenerEstadisticasUsuario(
                                    perfil.id,
                                ),
                                obtenerRankingAsistencia(),
                            ],
                        );

                    setEstadisticas(
                        datosEstadisticas,
                    );

                    setRanking(
                        datosRanking,
                    );
                }
                catch (error)
                {
                    console.error(
                        "Error cargando estadísticas:",
                        error,
                    );

                    setError(
                        "No se han podido cargar las estadísticas.",
                    );
                }
                finally
                {
                    setCargando(false);
                }
            }

            cargarEstadisticas();
        },
        [
            perfil,
        ],
    );

    function obtenerPosicion(
        posicion: number,
    )
    {
        if (posicion === 1)
        {
            return "🥇";
        }

        if (posicion === 2)
        {
            return "🥈";
        }

        if (posicion === 3)
        {
            return "🥉";
        }

        return posicion;
    }

    if (cargando)
    {
        return (
            <section className="stats-page">

                <div className="stats-empty">

                    <p>
                        Cargando estadísticas...
                    </p>

                </div>

            </section>
        );
    }

    return (
        <section className="stats-page">

            <header className="stats-page-header">

                <div>

                    <p className="stats-page-eyebrow">
                        Rendimiento personal
                    </p>

                    <h2>
                        Estadísticas
                    </h2>

                    <p>
                        Consulta tu participación y tus
                        resultados en los entrenamientos.
                    </p>

                </div>

                <ChartNoAxesColumnIncreasing
                    aria-hidden="true"
                />

            </header>

            {
                error &&
                (
                    <div className="stats-empty">

                        <p>
                            {error}
                        </p>

                    </div>
                )
            }

            <section className="stats-summary">

                <article className="stats-card">

                    <div className="stats-card-icon">

                        <CalendarCheck
                            aria-hidden="true"
                        />

                    </div>

                    <div>

                        <span>
                            Entrenamientos
                        </span>

                        <strong>
                            {estadisticas.entrenamientos}
                        </strong>

                    </div>

                </article>

                <article className="stats-card">

                    <div className="stats-card-icon">

                        <Trophy
                            aria-hidden="true"
                        />

                    </div>

                    <div>

                        <span>
                            Victorias
                        </span>

                        <strong>
                            {estadisticas.victorias}
                        </strong>

                    </div>

                </article>

                <article className="stats-card">

                    <div className="stats-card-icon">

                        <CircleEqual
                            aria-hidden="true"
                        />

                    </div>

                    <div>

                        <span>
                            Empates
                        </span>

                        <strong>
                            {estadisticas.empates}
                        </strong>

                    </div>

                </article>

                <article className="stats-card">

                    <div className="stats-card-icon">

                        <CircleX
                            aria-hidden="true"
                        />

                    </div>

                    <div>

                        <span>
                            Derrotas
                        </span>

                        <strong>
                            {estadisticas.derrotas}
                        </strong>

                    </div>

                </article>

                <article className="stats-card">

                    <div className="stats-card-icon">

                        <Medal
                            aria-hidden="true"
                        />

                    </div>

                    <div>

                        <span>
                            Porcentaje de victorias
                        </span>

                        <strong>
                            {
                                estadisticas
                                    .porcentaje_victorias
                            }%
                        </strong>

                    </div>

                </article>

                <article className="stats-card">

                    <div className="stats-card-icon">

                        <Percent
                            aria-hidden="true"
                        />

                    </div>

                    <div>

                        <span>
                            Porcentaje de asistencia
                        </span>

                        <strong>
                            {
                                estadisticas
                                    .porcentaje_asistencia
                            }%
                        </strong>

                    </div>

                </article>

            </section>

            <section className="stats-ranking">

                <div className="stats-section-heading">

                    <div>

                        <p>
                            Clasificación
                        </p>

                        <h3>
                            Ranking de asistencia
                        </h3>

                    </div>

                    <Medal
                        aria-hidden="true"
                    />

                </div>

                {
                    ranking.length === 0
                        ?
                        (
                            <div className="stats-empty">

                                <p>
                                    Las estadísticas aparecerán cuando
                                    haya entrenamientos finalizados.
                                </p>

                            </div>
                        )
                        :
                        (
                            <div className="stats-ranking-list">

                                {
                                    ranking.map(
                                        (jugador) =>
                                        {
                                            const esUsuario =
                                                jugador.perfil_id ===
                                                perfil?.id;

                                            return (
                                                <article
                                                    key={jugador.perfil_id}
                                                    className={
                                                        esUsuario
                                                            ? "stats-ranking-row stats-ranking-row-me"
                                                            : "stats-ranking-row"
                                                    }
                                                >

                                                    <div className="stats-ranking-position">

                                                        {
                                                            obtenerPosicion(
                                                                jugador.posicion,
                                                            )
                                                        }

                                                    </div>

                                                    <div className="stats-ranking-player">

                                                        <strong>
                                                            {jugador.nickname}
                                                        </strong>

                                                        {
                                                            esUsuario &&
                                                            (
                                                                <span className="stats-ranking-you">
                                                                    Tú
                                                                </span>
                                                            )
                                                        }

                                                    </div>

                                                    <div className="stats-ranking-trainings">

                                                        <span>
                                                            Entrenamientos
                                                        </span>

                                                        <strong>
                                                            {
                                                                jugador
                                                                    .entrenamientos
                                                            }
                                                        </strong>

                                                    </div>

                                                    <div className="stats-ranking-percentage">

                                                        <span>
                                                            Asistencia
                                                        </span>

                                                        <strong>
                                                            {
                                                                jugador
                                                                    .porcentaje_asistencia
                                                            }%
                                                        </strong>

                                                    </div>

                                                </article>
                                            );
                                        },
                                    )
                                }

                            </div>
                        )
                }

            </section>

        </section>
    );
}

export default StatsPage;