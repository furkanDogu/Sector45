import { Router } from 'express';

import { OperationController } from '@controllers';
import { bodyChecker } from '@middlewares';

const router = Router();

router.post('/withdraw', [bodyChecker(['amount', 'accountId']), OperationController.withdraw]);

router.post('/deposit', [bodyChecker(), OperationController.deposit]);

router.get('/:accountId', [OperationController.operations]);

export default router;
