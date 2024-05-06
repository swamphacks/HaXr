// import { Role } from '@/global';
// import { PropsWithChildren } from 'react';
// import { useUser } from '@clerk/nextjs';
//
// export interface IsRoleProps {
//   role: Role | Role[];
// }
//
// export default function IsRole({
//   role,
//   children,
// }: PropsWithChildren<IsRoleProps>) {
//   const { user } = useUser();
//   if (user) {
//     const userRole = user.publicMetadata.role;
//     if (userRole === role || (Array.isArray(role) && role.includes(userRole)))
//       return <>{children}</>;
//   }
//   return null;
// }
