export type User = {
    username: string;
    email: string;
    password: string;
    role: 'admin' | 'user';
}