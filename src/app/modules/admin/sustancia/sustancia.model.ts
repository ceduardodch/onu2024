export interface Sustancia {
    id?: number;
    name: string;
    subpartida: string;
    pao: string;
    pcg: string;
    grupo_sust: string;
    activo: boolean;
    cupo_prod: boolean;
    created_at?: string;
    updated_at?: string;
}
