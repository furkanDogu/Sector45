import { Router } from 'express';

import { HGSController } from '@controllers';
import { bodyChecker } from '@middlewares';

const router = Router();

router.post('/register', [bodyChecker(['amount', 'accountNo']), HGSController.registerNewCard]);
router.post('/deposit', [bodyChecker(['amount', 'accountNo', 'cardId'])], HGSController.deposit);

export default router;
