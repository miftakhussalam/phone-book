export interface PhoneModel {
	number: string | undefined,
}

export interface ContactModel {
	id: number,
	created_at: string,
	first_name: string | undefined,
	last_name: string | undefined,
	phones: PhoneModel[] | [],
}