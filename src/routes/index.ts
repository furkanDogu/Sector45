import { Router, Response, Request } from 'express';

import customer from './customer';
import account from './account';
import operation from './operation';
import transaction from './transaction';
import hgs from './hgs';

const router = Router();

router.get('/', (req: Request, res: Response) => res.send('Hi there'));
router.use('/customer', customer);
router.use('/account', account);
router.use('/operation', operation);
router.use('/transaction', transaction);
router.use('/hgs', hgs);

export default router;
