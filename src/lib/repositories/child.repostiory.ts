import { Child, IChild } from "../models/child.model";

export class ChildRepository {
    async create(childData: Partial<IChild>): Promise<IChild> {
      return await Child.create(childData);
    }
  
    async findAll(limit: number = 10, page: number = 1): Promise<IChild[]> {
      return await Child.find()
        .limit(limit)
        .skip((page - 1) * limit)
        .sort({ createdAt: -1 });
    }

    async findById(id: string): Promise<IChild | null> {
        return await Child.findById(id);
    }

    async findByIds(ids: string[]): Promise<IChild[]> {
        return await Child.find({ 
            _id: { $in: ids } 
        });
    }

    async findByIdsAndUser(ids: string[], userId: string): Promise<IChild[]> {
        return await Child.find({ 
            _id: { $in: ids },
            userId: userId
        });
    }

    async findByUser(userId: string): Promise<IChild[]> {
        return await Child.find({ userId })
            .sort({ createdAt: -1 });
    }
}