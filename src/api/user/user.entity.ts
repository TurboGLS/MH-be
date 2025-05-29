export type User = {
    id?: string;
    username: string;
    email: string;
    password: string;
    role: 'admin' | 'user';
}