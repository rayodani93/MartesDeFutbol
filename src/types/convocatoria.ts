export interface Convocatoria
{
    id: number;
    fecha_inicio: string;
    fecha_fin: string;
    apertura_inscripcion: string;
    cierre_inscripcion: string;
    estado:
        | "programada"
        | "abierta"
        | "cerrada"
        | "finalizada"
        | "cancelada";
}245