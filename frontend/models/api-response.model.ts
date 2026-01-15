export interface ApiResponse<T> {
  statusCode: number;
  success: boolean;
  message?: string;
  data: T; // C'est ici que se trouvera ton objet User
}
