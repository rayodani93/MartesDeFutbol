export interface Perfil
{
    id: string;
    nombre: string;
    apellidos: string;
    nickname: string;
    equipo_id: number | null;
    rol: "jugador" | "admin";
    activo: boolean;
    bloqueado: boolean;
    motivo_bloqueo: string | null;
    retiradas_penalizables: number;
    penalizado_hasta: string | null;
    notificaciones_email: boolean;
    notificaciones_push: boolean;
    posicion: "jugador" | "portero";
}