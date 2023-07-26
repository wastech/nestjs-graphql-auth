// user/jwt-payload.interface.ts
export interface JwtPayload {
  sub: string; // The user ID
  email: string; // The user email (you can include more data as needed)
  // ... other properties if required
}
