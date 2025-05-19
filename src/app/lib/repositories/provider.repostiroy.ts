import { Provider, IProvider } from '../models/provider.model';

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
    
    async findById(id: string): Promise<IProvider | null> {
        return await Provider.findById(id);
    }
    
    async findActiveProviders(): Promise<IProvider[]> {
        return await Provider.find({
            isActive: true
        });
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

    async findByLocation(longitude: number, latitude: number, maxDistance: number = 5000): Promise<IProvider[]> {
        return await Provider.find({
            location: {
                $near: {
                $geometry: {
                    type: 'Point',
                    coordinates: [longitude, latitude]
                },
                $maxDistance: maxDistance
                }
            }
        });
    }
}