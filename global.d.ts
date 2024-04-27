// noinspection JSUnusedGlobalSymbols

export {};

export type Role = 'admin' | undefined;

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      role?: Role;
    };
  }

  interface UserPublicMetadata {
    role?: Role;
  }
}
