import React, { useEffect } from "react";
import CompanyIntro from "../component/CompanyIntro";
import VisionMission from "../component/VisionMission";
import Achievements from "../component/Achievements";
import LeadershipSection from "../component/LeadershipSection";
import SEO from '../component/SEO';
import { useHeader } from "../context/HeaderContext";

const IntroductionCompany = () => {
    const { isSectionVisible } = useHeader();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    const schema = {
        "@context": "https://schema.org",
        "@type": "AboutPage",
        "name": "Giới thiệu ",
        "description": "Thông tin về công ty - Lịch sử hình thành, tầm nhìn và sứ mệnh.",
        "url": ""
    };

    return (
        <div>
            <SEO
                title="Giới thiệu công ty"
                description=""
                keywords=""
                url="/about"
                schema={schema}
            />
            <CompanyIntro />
            <VisionMission />
            <Achievements />
            {isSectionVisible('management') && <LeadershipSection />}
        </div>
    );
}

export default IntroductionCompany;