import { Provider, IProvider } from '../models/provider.model';

export interface SearchFilters {
    keyword?: string;
    location?: string;
    ageGroup?: string;
    maxPrice?: number;
}

export interface PaginatedResult {
    providers: IProvider[];
    totalCount: number;
}

export class ProviderRepository {
    async create(providerData: Partial<IProvider>): Promise<IProvider> {
        return await Provider.create(providerData);
    }

    async findAll(limit: number = 10, page: number = 1): Promise<IProvider[]> {
        return await Provider.find()
          .limit(limit)
          .skip((page - 1) * limit)
          .sort({ createdAt: -1 });
    }

    async findAllWithCount(limit: number = 10, page: number = 1): Promise<PaginatedResult> {
        const [providers, totalCount] = await Promise.all([
            Provider.find()
                .limit(limit)
                .skip((page - 1) * limit)
                .sort({ createdAt: -1 }),
            Provider.countDocuments()
        ]);
        
        return { providers, totalCount };
    }
    
    async findById(id: string): Promise<IProvider | null> {
        return await Provider.findById(id);
    }
    
    async findActiveProviders(limit: number = 10, page: number = 1): Promise<IProvider[]> {
        return await Provider.find({
            isActive: true
        })
        .limit(limit)
        .skip((page - 1) * limit)
        .sort({ createdAt: -1 });
    }

    async findActiveProvidersWithCount(limit: number = 10, page: number = 1): Promise<PaginatedResult> {
        const baseQuery = { isActive: true };
        
        const [providers, totalCount] = await Promise.all([
            Provider.find(baseQuery)
                .limit(limit)
                .skip((page - 1) * limit)
                .sort({ createdAt: -1 }),
            Provider.countDocuments(baseQuery)
        ]);
        
        return { providers, totalCount };
    }

    async update(id: string, providerData: Partial<IProvider>): Promise<IProvider | null> {
        return await Provider.findByIdAndUpdate(id, providerData, { new: true });
    }

    async softDelete(id: string): Promise<IProvider | null> {
        return await Provider.findByIdAndUpdate(
            id, 
            { isActive: false }, 
            { new: true }
        );
    }

    async delete(id: string): Promise<boolean> {
        const result = await Provider.findByIdAndDelete(id);
        return !!result;
    }

    async search(keyword: string, limit: number = 10, page: number = 1): Promise<IProvider[]> {
        const regex = new RegExp(keyword, 'i');
        return await Provider.find({
            $or: [
                { name: { $regex: regex } },
                { description: { $regex: regex } },
                { address: { $regex: regex } }
            ]
        })
          .limit(limit)
          .skip((page - 1) * limit);
    }

    async searchWithFilters(filters: SearchFilters, limit: number = 10, page: number = 1): Promise<PaginatedResult> {
        const query: any = { isActive: true };
        
        const searchConditions: any[] = [];
        
        if (filters.keyword) {
            const keywordRegex = new RegExp(filters.keyword, 'i');
            searchConditions.push({
                $or: [
                    { name: { $regex: keywordRegex } },
                    { description: { $regex: keywordRegex } },
                    { address: { $regex: keywordRegex } },
                    { services: { $regex: keywordRegex } }
                ]
            });
        }
        
        if (filters.location) {
            const locationRegex = new RegExp(filters.location, 'i');
            searchConditions.push({
                $or: [
                    { address: { $regex: locationRegex } },
                    { city: { $regex: locationRegex } },
                    { province: { $regex: locationRegex } }
                ]
            });
        }
        
        if (filters.ageGroup) {
            searchConditions.push({
                ageGroups: { $in: [filters.ageGroup] }
            });
        }
        
        if (filters.maxPrice) {
            searchConditions.push({
                $or: [
                    { price: { $lte: filters.maxPrice } },
                    { priceRange: { $lte: filters.maxPrice } }
                ]
            });
        }
        
        if (searchConditions.length > 0) {
            query.$and = searchConditions;
        }
        
        const [providers, totalCount] = await Promise.all([
            Provider.find(query)
                .limit(limit)
                .skip((page - 1) * limit)
                .sort({ createdAt: -1 }),
            Provider.countDocuments(query)
        ]);
        
        return { providers, totalCount };
    }
}