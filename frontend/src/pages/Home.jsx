import SearchBar from '../component/SearchBar'
import ProductSection from '../component/ProductSection'
import CompanyIntro from '../component/CompanyIntro'
import ServiceSection from '../component/ServiceSection'
import ProjectsSection from '../component/ProjectsSection'
import PartnersSection from '../component/PartnersSection'
import NewsSection from '../component/NewsSection'
import RecruitmentSection from '../component/RecruitmentSection'
import ContactSection from '../component/ContactSection'
import SEO from '../component/SEO'

const Home = () => {
    const schema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "TNT PCCC",
        "description": "Chuyên cung cấp thiết bị phòng cháy chữa cháy, hệ thống báo cháy, và bảo hộ lao động.",
        "url": "https://tnt-pccc.com"
    };

    return (
        <>
            <SEO
                title="Trang chủ"
                description="TNT PCCC - Chuyên cung cấp thiết bị phòng cháy chữa cháy, hệ thống báo cháy, bảo hộ lao động uy tín, chất lượng hàng đầu Việt Nam."
                keywords="pccc, thiết bị chữa cháy, báo cháy, bảo hộ lao động, TNT PCCC, phòng cháy chữa cháy"
                url="/"
                schema={schema}
            />
            <SearchBar />
            <CompanyIntro />

            <ProductSection />
            <ServiceSection />
            <ProjectsSection />
            <PartnersSection />
            <NewsSection />
            <ContactSection />
        </>
    )
}

export default Home
