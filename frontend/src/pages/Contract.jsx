import React, { useEffect } from "react";
import ContactSection from "../component/ContactSection";
import SEO from '../component/SEO';

const Contract = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    const schema = {
        "@context": "https://schema.org",
        "@type": "ContactPage",
        "name": "Liên hệ TNT PCCC",
        "description": "Thông tin liên hệ TNT PCCC - Tư vấn và báo giá thiết bị PCCC.",
        "url": "https://tnt-pccc.com/contact"
    };

    return (
        <div>
            <SEO
                title="Liên hệ"
                description="Liên hệ TNT PCCC để được tư vấn và báo giá thiết bị phòng cháy chữa cháy, hệ thống báo cháy, bảo hộ lao động."
                keywords="liên hệ, tư vấn pccc, báo giá pccc, TNT PCCC"
                url="/contact"
                schema={schema}
            />
            <ContactSection />
        </div>
    );
}

export default Contract;