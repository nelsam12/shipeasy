export interface JwtUser {
  userId: number;
}

export interface JwtPayload {
  sub: number;
  email?: string;
}

export interface RequestWithUser extends Request {
  user: JwtUser;
}
