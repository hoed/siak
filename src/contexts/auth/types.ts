
// User type definition with roles
export type User = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager';
  profileImage?: string;
};
