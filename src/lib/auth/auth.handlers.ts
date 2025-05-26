import './local/local-strategy';
import './jwt/jwt-strategy';
import { User as iUser } from '../../api/user/user.entity';

declare global {
    namespace Express {
        interface User extends iUser { } // prende ogni riferimento di User di express gli estende la nostra class User da aggiungere poi l'import su app.ts
    }
}