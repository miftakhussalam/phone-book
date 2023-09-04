import { InMemoryCache, ReactiveVar, makeVar } from '@apollo/client';
import { ContactModel } from './models';
export const cache: InMemoryCache = new InMemoryCache({
	typePolicies: { // Type policy map
		Query: {
			fields: { // Field policy map for the Product type
				favoriteContacts: {
					read() {
						return favoriteContactsVar();
					}
				},
				regularContacts: {
					read() {
						return regularContactsVar();
					}
				},
			}
		}
	}
});
export const favoriteContactsVar: ReactiveVar<ContactModel[]> = makeVar<ContactModel[]>(JSON?.parse(localStorage?.getItem('fav') || '[]') || []);
export const regularContactsVar: ReactiveVar<ContactModel[]> = makeVar<ContactModel[]>([]);
