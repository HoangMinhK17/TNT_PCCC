import React, { useEffect } from "react";
import ServiceSection from "../component/ServiceSection";
import SEO from '../component/SEO';

const Service = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []); 
    return (
        <div>
            <SEO
                title="Dịch vụ"
                description="Dịch vụ  lắp đặt, bảo trì hệ thống chuyên nghiệp."
                keywords="dịch vụ , thi công , lắp đặt , bảo trì "
                url="/services"
            />
            <ServiceSection />
        </div>
    );
}
export default Service;