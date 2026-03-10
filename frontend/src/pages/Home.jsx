import SearchBar from '../component/SearchBar'
import ProductSection from '../component/ProductSection'
import CompanyIntro from '../component/CompanyIntro'
import ServiceSection from '../component/ServiceSection'
import ProjectsSection from '../component/ProjectsSection'
import PartnersSection from '../component/PartnersSection'
import TestimonialSection from '../component/TestimonialSection'
import NewsSection from '../component/NewsSection'
import RecruitmentSection from '../component/RecruitmentSection'
import ContactSection from '../component/ContactSection'
import LeadershipSection from '../component/LeadershipSection'
const Home = () => {
    return (
        <>
            <SearchBar />
            <CompanyIntro />

            <ProductSection />
            <ServiceSection />
            <ProjectsSection />
            <PartnersSection />
            <LeadershipSection />
            <TestimonialSection />
            <NewsSection />
            <ContactSection />
        </>
    )
}

export default Home
