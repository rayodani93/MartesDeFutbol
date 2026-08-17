import "./AdminCard.css";

interface AdminCardProps
{
    icono: string;
    titulo: string;
    descripcion: string;
    onClick: () => void;
}

function AdminCard(
    {
        icono,
        titulo,
        descripcion,
        onClick,
    }: AdminCardProps,
)
{
    return (
        <button
            type="button"
            className="admin-card"
            onClick={onClick}
        >
            <span className="admin-card-icon">
                {icono}
            </span>

            <h2>
                {titulo}
            </h2>

            <p>
                {descripcion}
            </p>
        </button>
    );
}

export default AdminCard;