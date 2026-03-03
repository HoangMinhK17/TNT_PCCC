import React, { useEffect } from "react";
import CompanyIntro from "../component/CompanyIntro";
import VisionMission from "../component/VisionMission";
import Achievements from "../component/Achievements";
import SEO from '../component/SEO';

const IntroductionCompany = () => {

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    const schema = {
        "@context": "https://schema.org",
        "@type": "AboutPage",
        "name": "Giới thiệu TNT PCCC",
        "description": "Thông tin về công ty TNT PCCC - Lịch sử hình thành, tầm nhìn và sứ mệnh.",
        "url": "https://tnt-pccc.com/about"
    };

    return (
        <div>
            <SEO
                title="Giới thiệu công ty"
                description="TNT PCCC - Công ty chuyên cung cấp thiết bị PCCC uy tín. Tìm hiểu về lịch sử, tầm nhìn, sứ mệnh và thành tựu của chúng tôi."
                keywords="giới thiệu TNT PCCC, về chúng tôi, công ty pccc, lịch sử TNT"
                url="/about"
                schema={schema}
            />
            <CompanyIntro />
            <VisionMission />
            <Achievements />
        </div>
    );
}

export default IntroductionCompany;