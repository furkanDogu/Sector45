import { Router, Response, Request } from 'express';

import customer from './customer';

const router = Router();

router.get('/', (req: Request, res: Response) => res.send('Hi there'));
router.use('/customer', customer);

export default router;
