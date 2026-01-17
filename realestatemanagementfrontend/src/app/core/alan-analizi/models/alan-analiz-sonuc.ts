export interface AlanAnalizSonuc {
  geometriAdi: string;
  geometriJson: string;
  alanMetrekare: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  geoJson?: string;
  area?: number;
}
