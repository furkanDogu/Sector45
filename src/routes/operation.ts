import { Router } from 'express';

import { OperationController } from '@controllers';
import { bodyChecker } from '@middlewares';

const router = Router();

router.post('/withdraw', [bodyChecker(['amount', 'accountNo']), OperationController.withdraw]);

router.post('/deposit', [bodyChecker(['amount', 'accountNo']), OperationController.deposit]);

router.get('/:accountId', [OperationController.operations]);

export default router;
