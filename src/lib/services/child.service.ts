import { IChild } from '../models/child.model';
import { ChildRepository } from '../repositories/child.repostiory';

export class ChildService {
    private childRepository: ChildRepository;
    
    constructor() {
        this.childRepository = new ChildRepository();
    }

    async getAllChilds(limit: number = 10, page: number = 1): Promise<IChild[]> {
        return await this.childRepository.findAll(limit, page);
    }

    async getChildById(id: string): Promise<IChild | null> {
        return await this.childRepository.findById(id);
    }
}