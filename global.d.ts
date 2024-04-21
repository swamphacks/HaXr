// noinspection JSUnusedGlobalSymbols

export {};

export type Role = 'admin' | 'organizer' | undefined;

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
