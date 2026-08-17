import
{
    CalendarCheck,
    ChartNoAxesColumnIncreasing,
    CircleEqual,
    CircleX,
    Medal,
    Trophy,
} from "lucide-react";

import "./StatsPage.css";

function StatsPage()
{
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
                            0
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
                            0
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
                            0
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
                            0
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
                            0%
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

                    <Medal aria-hidden="true" />
                </div>

                <div className="stats-empty">
                    <p>
                        Las estadísticas aparecerán cuando
                        haya entrenamientos finalizados.
                    </p>
                </div>
            </section>
        </section>
    );
}

export default StatsPage;