import React from "react";
import ServiceSection from "../component/ServiceSection";
import SEO from '../component/SEO';

const Service = () => {
    return (
        <div>
            <SEO
                title="Dịch vụ"
                description="Dịch vụ phòng cháy chữa cháy của TNT PCCC - Thi công, lắp đặt, bảo trì hệ thống PCCC chuyên nghiệp."
                keywords="dịch vụ pccc, thi công pccc, lắp đặt báo cháy, bảo trì pccc, TNT PCCC"
                url="/services"
            />
            <ServiceSection />
        </div>
    );
}
export default Service;