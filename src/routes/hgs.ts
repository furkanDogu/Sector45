import { Router } from 'express';

import { HGSController } from '@controllers';
import { bodyChecker } from '@middlewares';

const router = Router();

router.post('/register', [
    bodyChecker(['amount', 'accountNo', 'source']),
    HGSController.registerNewCard,
]);
router.post(
    '/deposit',
    [bodyChecker(['amount', 'accountNo', 'cardId', 'source'])],
    HGSController.deposit
);

export default router;
