import { IProvider } from '../models/provider.model';
import { ProviderRepository, SearchFilters, PaginatedResult } from '../repositories/provider.repostiroy';

export class ProviderService {
    private providerRepository: ProviderRepository;
    
    constructor() {
        this.providerRepository = new ProviderRepository();
    }

    async getAllProviders(limit: number = 10, page: number = 1): Promise<IProvider[]> {
        return await this.providerRepository.findAll(limit, page);
    }

    async getAllProvidersWithPagination(limit: number = 10, page: number = 1): Promise<PaginatedResult> {
        return await this.providerRepository.findAllWithCount(limit, page);
    }

    async getProviderById(id: string): Promise<IProvider | null> {
        return await this.providerRepository.findById(id);
    }

    async searchProviders(keyword: string, limit: number = 10, page: number = 1): Promise<IProvider[]> {
        return await this.providerRepository.search(keyword, limit, page);
    }

    async getActiveProviders(limit: number = 10, page: number = 1): Promise<IProvider[]> {
        return await this.providerRepository.findActiveProviders(limit, page);
    }

    async getActiveProvidersWithPagination(limit: number = 10, page: number = 1): Promise<PaginatedResult> {
        return await this.providerRepository.findActiveProvidersWithCount(limit, page);
    }

    async searchProvidersWithFilters(filters: SearchFilters, limit: number = 10, page: number = 1): Promise<PaginatedResult> {
        return await this.providerRepository.searchWithFilters(filters, limit, page);
    }

    async createProvider(providerData: Partial<IProvider>): Promise<IProvider> {
        return await this.providerRepository.create(providerData);
    }

    async updateProvider(id: string, providerData: Partial<IProvider>): Promise<IProvider | null> {
        return await this.providerRepository.update(id, providerData);
    }

    async deleteProvider(id: string): Promise<boolean> {
        return await this.providerRepository.delete(id);
    }

    async softDeleteProvider(id: string): Promise<IProvider | null> {
        return await this.providerRepository.softDelete(id);
    }
}