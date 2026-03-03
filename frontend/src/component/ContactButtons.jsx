import React from 'react';
import '../styles/ContactButtons.css';

import { getContactInformation } from '../utils/informationApi';

const ContactButtons = () => {
    const [contactInformation, setContactInformation] = React.useState([]);
    React.useEffect(() => {
        const fetchContactInformation = async () => {
            try {
                const data = await getContactInformation();
                setContactInformation(Array.isArray(data) ? data[0] : data);
            } catch (error) {
                console.error("Error fetching contact information:", error);
            }
        };
        fetchContactInformation();
    }, []);
    return (
        <div className="social-contact-global">
            {contactInformation?.socialLinks?.map((link, index) => (
                <a key={index} href={link.url} target="_blank" rel="noopener noreferrer" className={`social-btn-global ${link.name.toLowerCase()}`}>
                    <img src={link.icon} alt={link.name} /> <span>{link.name}</span>
                </a>
            ))}
        </div>
    );
};

export default ContactButtons;
