import { RequestHandler } from '@appTypes';

export const bodyChecker = (requirements: string[]): RequestHandler<any> => (req, res, next) => {
    if (!requirements.every(requirement => !!req.body[requirement])) {
        return res.send({ error: `Needed fields are: ${requirements.join(', ')}` });
    }

    next();
};
