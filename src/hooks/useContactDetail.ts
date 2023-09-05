import { useContext } from 'react';
import { ContactDetailContext } from '../context/ContactDetailContext';

const useContactDetail = () => {
	const context = useContext(ContactDetailContext);
	if (!context) {
		throw new Error('useContactDetail must be used within a ContactDetailProvider')
	}

	return context
}

export default useContactDetail;
