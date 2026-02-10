import SearchBar from '../component/SearchBar'
import ProductSection from '../component/ProductSection'
import CompanyIntro from '../component/CompanyIntro'
import ServiceSection from '../component/ServiceSection'
import ProjectsSection from '../component/ProjectsSection'
import PartnersSection from '../component/PartnersSection'
import NewsSection from '../component/NewsSection'
import RecruitmentSection from '../component/RecruitmentSection'
import ContactSection from '../component/ContactSection'

const Home = () => {
    return (
        <>
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
