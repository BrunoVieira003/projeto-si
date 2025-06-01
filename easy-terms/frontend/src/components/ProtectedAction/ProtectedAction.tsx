// components/ProtectedAction.tsx
import { ReactNode } from 'react';
import { useAuth } from '../../context/AuthContext';

type ProtectedActionProps = {
  allowedRoles: string[];
  ownerId?: string;
  children: ReactNode;
};

export function ProtectedAction({ allowedRoles, ownerId, children }: ProtectedActionProps) {
  const { user } = useAuth();

  const isAdmin = allowedRoles.includes(user?.role || '') && user?.role === 'ADMIN';
  const isOwner = ownerId && user?.id === ownerId;

  if (isAdmin || isOwner) return <>{children}</>;
  return null;
}
