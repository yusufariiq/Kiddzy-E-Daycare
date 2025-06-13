import { ContactRepository } from '../repositories/contact.repository';
import { IContact } from '../models/contact.model';

export class ContactService {
    private contactRepository: ContactRepository;
    
    constructor() {
        this.contactRepository = new ContactRepository();
    }

    async submitContactForm(contactData: Partial<IContact>): Promise<IContact> {
        return await this.contactRepository.create(contactData);
    }

    async updateContact(contactId: string, contactData: Partial<IContact>): Promise<IContact | null> {
        return await this.contactRepository.update(contactId, contactData);
    }
    
    async deleteContact(contactId: string): Promise<boolean> {
        return await this.contactRepository.delete(contactId);
    }
}