import { Router } from 'express';

import { AccountController } from '@controllers';

const router = Router();

router.get('/new/:customerId', [AccountController.getNewAccount]);

router.get('/close/:accountId', [AccountController.closeAccount]);

router.get('/:customerId', [AccountController.accounts]);

export default router;
