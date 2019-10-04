import { Repository } from 'typeorm';

export type Lazy<T> = Promise<T> | T;

export const findEntityById = async <T>(repo: Repository<T>, id: number | string): Promise<T> => {
    const entity = await repo.findOne(id);
    if (!entity) {
        //@ts-ignore
        throw new Error(`Entity ${repo.create().constructor.name} not found with ID ${id}`);
    }

    return entity;
};

export const modifyErrMsg = (e: any) => (e.constructor === Array && e[0].constraints) || e.message;
