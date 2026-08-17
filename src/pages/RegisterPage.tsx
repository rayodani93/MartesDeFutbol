import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { obtenerEquipos } from "../services/equiposService";
import type { Equipo } from "../types/equipo";
import { registrarUsuario } from "../services/authService";
import "./LoginPage.css";
import "./RegisterPage.css";

const GROUP_PIN = "1357";

function RegisterPage()
{
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [nickname, setNickname] = useState("");
    const [email, setEmail] = useState("");
    const [teamId, setTeamId] = useState<number | "">("");
    const [position, setPosition] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [groupPin, setGroupPin] = useState("");
    const [teams, setTeams] = useState<Equipo[]>([]);
    const [loadingTeams, setLoadingTeams] = useState(true);
    const [error, setError] = useState("");

    useEffect(() =>
    {
        async function cargarEquipos()
        {
            try
            {
                const equipos = await obtenerEquipos();
                setTeams(equipos);
            }
            catch (error)
            {
                console.error("Error al cargar los equipos:", error);
                setError("No se han podido cargar los equipos.");
            }
            finally
            {
                setLoadingTeams(false);
            }
        }

        cargarEquipos();
    }, []);

    const handleGroupPinChange = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) =>
    {
        const value = event.target.value;

        if (/^\d{0,4}$/.test(value))
        {
            setGroupPin(value);
        }
    };

    const handleTeamChange = (
        event: React.ChangeEvent<HTMLSelectElement>,
    ) =>
    {
        const value = event.target.value;

        if (value === "")
        {
            setTeamId("");
            return;
        }

        setTeamId(Number(value));
    };

const handleRegister = async (
    event: React.FormEvent<HTMLFormElement>,
) =>
{
    event.preventDefault();
    setError("");

    const cleanName = name.trim();
    const cleanSurname = surname.trim();
    const cleanNickname = nickname.trim();
    const cleanEmail = email.trim();

    if (
        cleanName === "" ||
        cleanSurname === "" ||
        cleanNickname === "" ||
        cleanEmail === "" ||
        teamId === "" ||
        position === "" ||
        password === "" ||
        confirmPassword === "" ||
        groupPin === ""
    )
    {
        setError("Completa todos los campos.");
        return;
    }

    if (password.length < 6)
    {
        setError("La contraseña debe tener al menos 6 caracteres.");
        return;
    }

    if (password !== confirmPassword)
    {
        setError("Las contraseñas no coinciden.");
        return;
    }

    if (groupPin.length !== 4)
    {
        setError("El PIN del grupo debe tener exactamente 4 números.");
        return;
    }

    if (groupPin !== GROUP_PIN)
    {
        setError("El PIN del grupo no es correcto.");
        return;
    }

    if (position !== "jugador" && position !== "portero")
    {
        setError("Selecciona una posición válida.");
        return;
    }

    try
    {
        await registrarUsuario({
            nombre: cleanName,
            apellidos: cleanSurname,
            nickname: cleanNickname,
            email: cleanEmail,
            password,
            equipoId: teamId,
            posicion: position,
        });

        alert(
            "Usuario registrado correctamente. Revisa tu correo para confirmar la cuenta.",
        );
    }
    catch (error)
{
    console.error(
        "Error al registrar el usuario:",
        error,
    );

    if (error instanceof Error)
    {
        setError(error.message);
    }
    else
    {
        setError(
            "No se ha podido crear la cuenta.",
        );
    }
}

};
    return (
        <main className="auth-page register-page">
            <section className="auth-card">
                <div className="auth-ball">⚽</div>

                <h1>Crear cuenta</h1>

                <p className="auth-subtitle">
                    Regístrate para entrar en las convocatorias semanales
                </p>

                <form
                    className="auth-form"
                    onSubmit={handleRegister}
                    noValidate
                >
                    <label htmlFor="name">
                        Nombre
                    </label>

                    <input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Ej. Javier"
                        autoComplete="given-name"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                    />

                    <label htmlFor="surname">
                        Apellidos
                    </label>

                    <input
                        id="surname"
                        name="surname"
                        type="text"
                        placeholder="Ej. Martin de la Fuente"
                        autoComplete="family-name"
                        value={surname}
                        onChange={(event) => setSurname(event.target.value)}
                    />

                    <label htmlFor="nickname">
                        Nickname
                    </label>

                    <input
                        id="nickname"
                        name="nickname"
                        type="text"
                        placeholder="Ej. BolloSuciaRata"
                        autoComplete="nickname"
                        value={nickname}
                        onChange={(event) => setNickname(event.target.value)}
                    />

                    <label htmlFor="email">
                        Correo electrónico
                    </label>

                    <input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Ej. Bollito@ratamugrosa.com"
                        autoComplete="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                    />

                    <label htmlFor="team">
                        Equipo
                    </label>

                    <select
                        id="team"
                        name="team"
                        value={teamId}
                        onChange={handleTeamChange}
                        disabled={loadingTeams}
                    >
                        <option value="">
                            {loadingTeams
                                ? "Cargando equipos..."
                                : "Selecciona tu equipo"}
                        </option>

                        {teams.map((team) => (
                            <option
                                key={team.id}
                                value={team.id}
                            >
                                {team.nombre}
                            </option>
                        ))}
                    </select>

                    <label htmlFor="position">
                        Posición
                    </label>

                    <select
                        id="position"
                        name="position"
                        value={position}
                        onChange={(event) =>
                            setPosition(event.target.value)
                        }
                    >
                        <option value="">
                            Selecciona una posición
                        </option>

                        <option value="jugador">
                            Jugador
                        </option>

                        <option value="portero">
                            Portero
                        </option>
                    </select>

                    <label htmlFor="password">
                        Contraseña
                    </label>

                    <input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="Introduce una contraseña"
                        autoComplete="new-password"
                        value={password}
                        onChange={(event) =>
                            setPassword(event.target.value)
                        }
                    />

                    <label htmlFor="confirmPassword">
                        Confirmar contraseña
                    </label>

                    <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        placeholder="Repite la contraseña"
                        autoComplete="new-password"
                        value={confirmPassword}
                        onChange={(event) =>
                            setConfirmPassword(event.target.value)
                        }
                    />

                    <label htmlFor="groupPin">
                        PIN de acceso del grupo
                    </label>

                    <input
                        id="groupPin"
                        name="groupPin"
                        type="password"
                        inputMode="numeric"
                        maxLength={4}
                        placeholder="PIN enviado por WhatsApp"
                        value={groupPin}
                        onChange={handleGroupPinChange}
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
                    >
                        Crear cuenta
                    </button>
                </form>

                <p className="auth-footer">
                    ¿Ya tienes una cuenta?{" "}
                    <Link
                        to="/login"
                        className="auth-link"
                    >
                        Iniciar sesión
                    </Link>
                </p>
            </section>
        </main>
    );
}

export default RegisterPage;