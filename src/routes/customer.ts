import { Router } from 'express';

import { CustomerController } from '@controllers';
import { bodyChecker } from '@middlewares';

const router = Router();

router.post('/register', [bodyChecker(['address']), CustomerController.register]);

router.post('/login', [bodyChecker(), CustomerController.login]);

router.get('/accounts/:customerId', [CustomerController.accounts]);

export default router;
