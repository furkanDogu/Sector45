import { Router, Response, Request } from 'express';

import customer from './customer';
import account from './account';
import operation from './operation';
import transaction from './transaction';

const router = Router();

router.get('/', (req: Request, res: Response) => res.send('Hi there'));
router.use('/customer', customer);
router.use('/account', account);
router.use('/operation', operation);
router.use('/transaction', transaction);

export default router;
