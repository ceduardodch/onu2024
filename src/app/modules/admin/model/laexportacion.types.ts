export interface InventoryLaExportacion
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

export interface InventoryPagination
{
    length: number;
    size: number;
    page: number;
    lastPage: number;
    startIndex: number;
    endIndex: number;
}


