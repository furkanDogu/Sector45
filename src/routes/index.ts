import { Router, Response, Request } from 'express';

import user from './user';

const router = Router();
router.get('/', (req: Request, res: Response) => res.send('TODO: add endpoint details here'));
router.use('/user', user);

export default router;
