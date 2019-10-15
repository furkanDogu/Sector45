import { Router } from 'express';

import { AccountController } from '@controllers';

const router = Router();

router.get('/new/:customerId', [AccountController.getNewAccount]);

router.get('/close/:accountId', [AccountController.closeAccount]);

router.get('/operations/:accountId', [AccountController.operations]);

export default router;
