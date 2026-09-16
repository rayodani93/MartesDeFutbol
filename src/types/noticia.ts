export interface Noticia
{
    id: number;

    titulo: string;

    contenido: string;

    imagen_url: string | null;

    autor_id: string;

    publicada: boolean;

    created_at: string;

    updated_at: string;
}