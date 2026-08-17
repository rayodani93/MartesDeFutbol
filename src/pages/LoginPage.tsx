import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { iniciarSesion } from "../services/authService";

import "./LoginPage.css";

function LoginPage()
{
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleLogin = async (
        event: React.FormEvent<HTMLFormElement>,
    ) =>
    {
        event.preventDefault();

        setError("");

        const cleanEmail = email.trim();

        if (cleanEmail === "")
        {
            setError(
                "Introduce tu correo electrónico.",
            );

            return;
        }

        if (password === "")
        {
            setError(
                "Introduce tu contraseña.",
            );

            return;
        }

        try
        {
            setLoading(true);

            await iniciarSesion({
                email: cleanEmail,
                password,
            });

            navigate(
                "/bienvenida",
                {
                    replace: true,
                },
            );
        }
        catch (error)
        {
            console.error(
                "Error al iniciar sesión:",
                error,
            );

            setError(
                "El correo o la contraseña no son correctos.",
            );
        }
        finally
        {
            setLoading(false);
        }
    };

    return (
        <main className="auth-page">

            <section className="auth-card">

                <div className="auth-ball">
                    ⚽
                </div>

                <h1>
                    Martes de Fútbol
                </h1>

                <p className="auth-subtitle">
                    Accede para apuntarte a la convocatoria semanal
                </p>

                <form
                    className="auth-form"
                    onSubmit={handleLogin}
                    noValidate
                >
                    <label htmlFor="email">
                        Correo electrónico
                    </label>

                    <input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Ej. dani@email.com"
                        autoComplete="email"
                        value={email}
                        onChange={(event) =>
                            setEmail(
                                event.target.value,
                            )
                        }
                        disabled={loading}
                    />

                    <label htmlFor="password">
                        Contraseña
                    </label>

                    <input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="Introduce tu contraseña"
                        autoComplete="current-password"
                        value={password}
                        onChange={(event) =>
                            setPassword(
                                event.target.value,
                            )
                        }
                        disabled={loading}
                    />

                    {error && (
                        <p
                            className="form-error"
                            role="alert"
                        >
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        className="primary-button"
                        disabled={loading}
                    >
                        {
                            loading
                                ? "Iniciando sesión..."
                                : "Iniciar sesión"
                        }
                    </button>

                </form>

                <p className="auth-footer">
                    ¿Todavía no tienes cuenta?{" "}

                    <Link
                        to="/register"
                        className="auth-link"
                    >
                        Registrarse
                    </Link>
                </p>

            </section>

        </main>
    );
}

export default LoginPage;