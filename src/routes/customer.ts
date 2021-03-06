import { Router } from 'express';

import { CustomerController } from '@controllers';
import { bodyChecker } from '@middlewares';

const router = Router();

router.post('/register', [
    bodyChecker(['TCKN', 'name', 'surname', 'password', 'salary', 'dateOfBirth', 'address']),
    CustomerController.register,
]);

router.post('/login', [bodyChecker(['TCKN', 'password']), CustomerController.login]);

export default router;
