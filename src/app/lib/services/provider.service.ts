import { IProvider } from '../models/provider.model';
import { ProviderRepository } from '../repositories/provider.repostiroy';

export class ProviderService {
    private providerRepository: ProviderRepository;
    
    constructor() {
        this.providerRepository = new ProviderRepository();
    }

    async getAllProviders(limit: number = 10, page: number = 1): Promise<IProvider[]> {
        return await this.providerRepository.findAll(limit, page);
    }

    async getProviderById(id: string): Promise<IProvider | null> {
        return await this.providerRepository.findById(id);
    }

    async searchProviders(keyword: string, limit: number = 10, page: number = 1): Promise<IProvider[]> {
        return await this.providerRepository.search(keyword, limit, page);
    }

    async findProvidersByLocation(longitude: number, latitude: number, maxDistance: number = 5000): Promise<IProvider[]> {
        return await this.providerRepository.findByLocation(longitude, latitude, maxDistance);
    }
}