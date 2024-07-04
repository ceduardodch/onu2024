export interface Importacion {
  id: number;
  vue: string;
  importador: string;
  proveedor?: string;
  country?: string;
  years: string;
  month: string;
  solicitud_date: string;
  authorization_date: string;
//   proforma: any[];
  status: string;
  grupo: string;
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



