import React, { useState, useEffect } from 'react';
import '../styles/ContactButtons.css';

import { getContactInformation } from '../utils/informationApi';

const getChatSrcDoc = (scriptUrl, token) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body, html { margin: 0; padding: 0; height: 100%; width: 100%; overflow: hidden; background: white; }
    </style>
</head>
<body>
    <script src="${scriptUrl}" data-token="${token}"></script>
    <script>
        function tryClickFetcher() {
            const btn = document.querySelector('.chat-launcher');
            if (btn) {
                btn.click();
                return true;
            }
            return false;
        }

        const observer = new MutationObserver(() => {
            if (tryClickFetcher()) observer.disconnect();
        });
        observer.observe(document.body, { childList: true, subtree: true });

        const interval = setInterval(() => {
            if (tryClickFetcher()) clearInterval(interval);
        }, 500);

        setTimeout(() => clearInterval(interval), 10000);
    </script>
</body>
</html>
`;

const ContactButtons = () => {
    const [contactInformation, setContactInformation] = useState(null);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isChatMinimized, setIsChatMinimized] = useState(false);

    useEffect(() => {
        const fetchContactInformation = async () => {
            try {
                const data = await getContactInformation();
                let info = Array.isArray(data) ? data[0] : data;

                if (info) {
                    const chatCfg = info.chatConfig;
                    const socialLinks = info.socialLinks || [];
                    const filteredLinks = socialLinks.filter(l => !l.isConfigChat);

                    if (chatCfg && chatCfg.enable) {
                        filteredLinks.push({
                            name: chatCfg.name || "Chat Hỗ Trợ",
                            url: chatCfg.scriptUrl,
                            icon: chatCfg.imageChat || "",
                            isConfigChat: true
                        });
                    }
                    info.socialLinks = filteredLinks;
                }
                setContactInformation(info);
            } catch (error) {
                console.error("Error fetching contact information:", error);
            }
        };
        fetchContactInformation();
    }, []);

    const handleLinkClick = (e, link) => {
        if (link.isConfigChat) {
            e.preventDefault();
            if (!isChatOpen) {
                setIsChatOpen(true);
                setIsChatMinimized(false);
            } else if (isChatMinimized) {
                setIsChatMinimized(false);
            } else {
                setIsChatOpen(false);
            }
        }
    };

    return (
        <div className="social-contact-global">
            {contactInformation?.socialLinks?.map((link, index) => (
                <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`social-btn-global ${link.isConfigChat ? 'chat-config-btn' : (link.name?.toLowerCase() || '')}`}
                    onClick={(e) => handleLinkClick(e, link)}
                >
                    <img src={link.icon} alt={link.name} /> <span>{link.name}</span>
                </a>
            ))}

            {isChatOpen && contactInformation?.chatConfig && (
                <div className={`custom-chatbox-container ${isChatMinimized ? 'minimized' : ''}`}>
                    <div className="chatbox-header" onClick={() => setIsChatMinimized(!isChatMinimized)}>
                        <span>Hỗ trợ trực tuyến</span>
                        <div className="chatbox-header-actions">
                            <button onClick={(e) => { e.stopPropagation(); setIsChatOpen(false); }} className="action-chat-btn close-btn" title="Đóng chat">
                                ✖
                            </button>
                        </div>
                    </div>
                    <iframe
                        srcDoc={getChatSrcDoc(contactInformation.chatConfig.scriptUrl, contactInformation.chatConfig.token)}
                        title="Chatbox"
                        style={{
                            flex: 1,
                            border: 'none',
                            width: '100%',
                            height: '100%',
                            background: 'transparent',
                            overflow: 'hidden'
                        }}
                    ></iframe>
                </div>
            )}
        </div>
    );
};

export default ContactButtons;
