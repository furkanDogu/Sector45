import { Router } from 'express';

import { HGSController } from '@controllers';
import { bodyChecker } from '@middlewares';

const router = Router();

router.post('/subscribe', [bodyChecker(['amount', 'accountNo']), HGSController.register]);
router.post('/newCard', [bodyChecker(['amount', 'accountNo'])], HGSController.newCard);
router.post('/deposit', [bodyChecker(['amount', 'accountNo', 'cardId'])], HGSController.deposit);

export default router;
