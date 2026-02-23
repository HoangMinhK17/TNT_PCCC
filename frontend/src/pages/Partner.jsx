import React from "react";
import PartnersSection from "../component/PartnersSection";
import SEO from '../component/SEO';

const Partner = () => {
    return (
        <div>
            <SEO
                title="Đối tác"
                description="Các đối tác chiến lược của TNT PCCC - Hợp tác cùng các thương hiệu uy tín trong ngành phòng cháy chữa cháy."
                keywords="đối tác TNT PCCC, hợp tác pccc, thương hiệu pccc"
                url="/partners"
            />
            <PartnersSection />
        </div>
    );
}
export default Partner;