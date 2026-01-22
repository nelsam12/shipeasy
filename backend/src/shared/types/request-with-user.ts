export interface JwtUser {
  userId: number;
  role?: string;
}

export interface JwtPayload {
  sub: number;
  email?: string;
  role?: string;
}

export interface RequestWithUser extends Request {
  user: JwtUser;
}
