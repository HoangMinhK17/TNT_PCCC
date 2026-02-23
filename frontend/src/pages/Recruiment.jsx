import React from "react";
import RecruitmentSection from "../component/RecruitmentSection";
import SEO from '../component/SEO';

const Recruiment = () => {
    const schema = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "Tuyển dụng TNT PCCC",
        "description": "Cơ hội việc làm tại TNT PCCC.",
        "url": "https://tnt-pccc.com/recruitment"
    };

    return (
        <div>
            <SEO
                title="Tuyển dụng"
                description="Cơ hội việc làm tại TNT PCCC - Tuyển dụng nhân sự ngành phòng cháy chữa cháy, kỹ thuật viên, nhân viên kinh doanh."
                keywords="tuyển dụng pccc, việc làm pccc, tuyển dụng TNT PCCC"
                url="/recruitment"
                schema={schema}
            />
            <RecruitmentSection />
        </div>
    );
}
export default Recruiment;