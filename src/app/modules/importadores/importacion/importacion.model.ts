export interface Importacion
{
    id: string;
    vue : string;
    importador: string;
    proveedor: string;
    pais: string;
    ano: number;
    mes: number;
    fechaSolicitud: string;
    fechaAutorizacion: string;
    proforma: any[];
    status: boolean;
}

export interface ImportacionPagination
{
    length: number;
    size: number;
    page: number;
    lastPage: number;
    startIndex: number;
    endIndex: number;
}



