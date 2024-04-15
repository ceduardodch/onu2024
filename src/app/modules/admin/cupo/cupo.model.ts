export interface Cupo {
    id?: number;
    importador_id: number;
    importador: string;
    anio: string;
    hfc: string;
    hcfc: string;
    created_at?: string;
    updated_at?: string;
}

export interface Anio {
    id?: number;
    name: string;
    activo: boolean;
    created_at?: string;
    updated_at?: string;
}