import { Router } from 'express';

import { TransactionController } from '@controllers';
import { bodyChecker } from '@middlewares';

const router = Router();

router.post('/', [
    bodyChecker(['receiverAccountId', 'senderAccountId', 'amount']),
    TransactionController.makeTransaction,
]);

router.get('/:accountId', [TransactionController.transactions]);

export default router;
