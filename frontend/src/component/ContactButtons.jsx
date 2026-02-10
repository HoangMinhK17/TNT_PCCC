import React from 'react';
import '../styles/ContactButtons.css';

const ContactButtons = () => {
    return (
        <div className="social-contact-global">
            <a href="https://zalo.me/0912345678" target="_blank" rel="noopener noreferrer" className="social-btn-global zalo">
                <i>Z</i> Zalo
            </a>
            <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" className="social-btn-global facebook">
                <i>f</i> Facebook
            </a>
            <a href="sms:0912345678" className="social-btn-global sms">
                <i>✉</i> SMS
            </a>
        </div>
    );
};

export default ContactButtons;
