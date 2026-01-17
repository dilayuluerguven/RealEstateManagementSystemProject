export interface AlanAnalizSonuc {
geometriAdi: string;
  analizTuru: string;
  islem: string;
  geometriJson: string;
  alanMetrekare: number;
  olusturmaTarihi: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  geoJson?: string;
  area?: number;
}
