import React from "react";
import PartnersSection from "../component/PartnersSection";
import SEO from '../component/SEO';

const Partner = () => {
    return (
        <div>
            <SEO
                title="Đối tác"
                description="Các đối tác chiến lược của  - Hợp tác cùng các thương hiệu uy tín trong ngành "
                keywords="đối tác , hợp tác , thương hiệu"
                url="/partners"
            />
            <PartnersSection />
        </div>
    );
}
export default Partner;