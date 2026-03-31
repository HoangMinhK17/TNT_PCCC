import React, { useEffect } from "react";
import RecruitmentSection from "../component/RecruitmentSection";
import SEO from '../component/SEO';

const Recruiment = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    const schema = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "Tuyển dụng ",
        "description": "Cơ hội việc .",
        "url": ""
    };

    return (
        <div>
            <SEO
                title="Tuyển dụng"
                description="Cơ hội việc làm  - Tuyển dụng nhân sự."
                keywords="tuyển dụng , việc làm , tuyển dụng "
                url="/recruitment"
                schema={schema}
            />
            <RecruitmentSection />
        </div>
    );
}
export default Recruiment;