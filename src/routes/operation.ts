import { Router } from 'express';

import { OperationController } from '@controllers';
import { bodyChecker } from '@middlewares';

const router = Router();

router.post('/withdraw', [
    bodyChecker(['amount', 'accountNo', 'source']),
    OperationController.withdraw,
]);

router.post('/deposit', [
    bodyChecker(['amount', 'accountNo', 'source']),
    OperationController.deposit,
]);

router.get('/:accountNo', [OperationController.operations]);

export default router;
