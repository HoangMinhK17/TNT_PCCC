import React, { useEffect } from "react";
import ContactSection from "../component/ContactSection";
import SEO from '../component/SEO';

const Contact = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    const schema = {
        "@context": "https://schema.org",
        "@type": "ContactPage",
        "name": "Liên hệ ",
        "description": "Thông tin liên hệ ",
        "url": ""
    };

    return (
        <div>
            <SEO
                title="Liên hệ"
                description="Liên hệ để được tư vấn và báo giá thiết bị "
                keywords="liên hệ, tư vấn, báo giá"
                url="/contact"
                schema={schema}
            />
            <ContactSection />
        </div>
    );
}

export default Contact;