import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";

import NewTeamCampeon from "../assets/NewTeamCampeon.jpeg";
import PapaJamon from "../assets/PapaJamon.jpeg";
import Chato from "../assets/Chato.jpeg";

import "./BienvenidaPage.css";

function BienvenidaPage()
{
    const navigate = useNavigate();

    const { perfil, loading } = useAuth();

    useEffect(() =>
    {
        if (loading)
        {
            return;
        }

        const timer = setTimeout(() =>
        {
            navigate("/", {
                replace: true,
            });
        }, 5000);

        return () => clearTimeout(timer);
    }, [loading, navigate]);

    if (loading)
    {
        return null;
    }

    let titulo = "Bienvenido";
    let mensaje1 = "Prepárate para el próximo entrenamiento.";
    let mensaje2 = "";
    let imagen = "";

    if (perfil?.equipo_id === 1)
    {
        titulo = "Bienvenido, hermano NewTiniano";

        mensaje1 =
            "Recuerda que estás donde todos quieren estar, pero no todos pueden.";

        mensaje2 =
            "¿Quieres otra estrella? Pelea por ella.";

        imagen = NewTeamCampeon;
    }

    if (perfil?.equipo_id === 2)
    {
        titulo = "Bienvenido, semifinalista!!";

        mensaje1 =
            "¿Quieres jugar una final y no pechofiar cuando queman las papas?";

        mensaje2 =
            "Así empezó tu patrocinador, luchad por ello, haced que se sienta orgulloso!!!!!";

        imagen = PapaJamon;
    }

    if (perfil?.equipo_id === 4)
    {
        titulo = "Bienvenido, futbolista";

        mensaje1 =
            "Entrena duro.";

        mensaje2 =
            "O te convertirás en un futbolista como él.";

        imagen = Chato;
    }

    return (
        <main className="bienvenida-page">
            <section className="bienvenida-card">

                {imagen && (
                    <img
                        src={imagen}
                        alt="Bienvenida"
                        className="bienvenida-image"
                    />
                )}

                <h1>{titulo}</h1>

                <p>{mensaje1}</p>

                {mensaje2 && (
                    <p className="bienvenida-destacado">
                        {mensaje2}
                    </p>
                )}

                {perfil?.equipo_id === 1 && (
                    <div className="bienvenida-stars">
                        ⭐⭐⭐⭐⭐⭐
                    </div>
                )}

            </section>
        </main>
    );
}

export default BienvenidaPage;