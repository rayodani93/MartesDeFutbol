import { Link } from "react-router-dom";

import BolloCunao from "../assets/BolloCuñao.png";

import "./LoginPage.css";

function ConfirmadoPage()
{
    return (
        <main className="auth-page">

            <section className="auth-card">

                <div className="auth-ball">
                    ✅
                </div>

                <h1>
                    Cuenta confirmada
                </h1>

                <p className="auth-subtitle">
                    Puedes venir a entrenar,
                    o no.
                </p>

                <p className="auth-subtitle">
                    Pero sobre todo...
                </p>

                <p
                    className="auth-subtitle"
                    style={{
                        fontWeight: 700,
                        color: "#ffffff",
                    }}
                >
                    No te conviertas nunca en una rata como esta.
                </p>

                <div className="rata-container">

                    <img
                        src={BolloCunao}
                        alt="Bollo Cuñao"
                        className="rata-image"
                    />

                </div>

                <p
                    style={{
                        fontSize: "12px",
                        opacity: 0.7,
                        marginBottom: "20px",
                    }}
                >
                    
                </p>

                <Link
                    to="/login"
                    className="confirmado-button"
                >
                    Iniciar sesión
                </Link>

            </section>

        </main>
    );
}

export default ConfirmadoPage;