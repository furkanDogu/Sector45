import { Router } from 'express';

import { AccountController } from '@controllers';
import { urlParamChecker, auth } from '@middlewares';

const router = Router();

router.get('/new/:customerId', [auth, AccountController.getNewAccount]);

router.get('/close/:accountId', [auth, AccountController.closeAccount]);

router.get('/operations/:accountId', [AccountController.operations]);

export default router;
