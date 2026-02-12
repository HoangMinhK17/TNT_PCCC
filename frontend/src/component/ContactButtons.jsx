import React from 'react';
import '../styles/ContactButtons.css';

import zaloIcon from '../uploads/contractbutton/Icon_zalo.png';
import fbIcon from '../uploads/contractbutton/icon_fb.png';
import callIcon from '../uploads/contractbutton/call.png';

const ContactButtons = () => {
    return (
        <div className="social-contact-global">
            <a href="https://zalo.me/0912345678" target="_blank" rel="noopener noreferrer" className="social-btn-global zalo">
                <img src={zaloIcon} alt="Zalo" /> <span>Zalo</span>
            </a>
            <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" className="social-btn-global facebook">
                <img src={fbIcon} alt="Facebook" /> <span>Facebook</span>
            </a>
            <a href="sms:0912345678" className="social-btn-global sms">
                <img src={callIcon} alt="Call" /> <span>Gọi cho chúng tôi</span>
            </a>
        </div>
    );
};

export default ContactButtons;
