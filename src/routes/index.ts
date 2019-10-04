import { Router, Response, Request } from 'express';

import customer from './customer';
import auth from './auth';

const router = Router();

router.get('/', (req: Request, res: Response) => res.send('TODO: add endpoint details here'));
router.use('/customer', customer);
router.use('/auth', auth);

export default router;
