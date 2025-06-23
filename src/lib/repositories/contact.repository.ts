import { Contact, IContact } from "../models/contact.model";

export class ContactRepository {
    async create(contactData: Partial<IContact>): Promise<IContact> {
      return await Contact.create(contactData);
    }
  
    async findAll(limit: number = 10, page: number = 1): Promise<IContact[]> {
      return await Contact.find()
        .limit(limit)
        .skip((page - 1) * limit)
        .sort({ createdAt: -1 });
    }

    async update(id: string, contactData: Partial<IContact>): Promise<IContact | null> {
      return await Contact.findByIdAndUpdate(id, contactData, { new: true });
    }

    async delete(id: string): Promise<boolean> {
        const result = await Contact.findByIdAndDelete(id);
        return !!result;
    }
}