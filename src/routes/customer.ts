import { Router } from 'express';

import { CustomerController } from '@controllers';

const router = Router();

router.post('/login', [CustomerController.login]);

router.post('/register', [CustomerController.register]);

export default router;
