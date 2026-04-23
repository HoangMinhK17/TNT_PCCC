import SearchBar from '../component/SearchBar'
import ProductSection from '../component/ProductSection'
import CompanyIntro from '../component/CompanyIntro'
import ServiceSection from '../component/ServiceSection'
import ProjectsSection from '../component/ProjectsSection'
import PartnersSection from '../component/PartnersSection'
import TestimonialSection from '../component/TestimonialSection'
import NewsSection from '../component/NewsSection'
import ContactSection from '../component/ContactSection'
import LeadershipSection from '../component/LeadershipSection'
import { useHeader } from '../context/HeaderContext'
import { useEffect } from 'react'
import SEO from '../component/SEO';

const Home = () => {
    const { isSectionVisible } = useHeader();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div>
            <SEO
                title="Trang chủ"
                description=""
                keywords=""
                url=""
            />
            <>
            <SearchBar />
            {isSectionVisible('about') && <CompanyIntro />}
            {isSectionVisible('products') && <ProductSection />}
            {isSectionVisible('services') && <ServiceSection />}
            {isSectionVisible('projects') && <ProjectsSection />}
            {isSectionVisible('partners') && <PartnersSection />}
            {isSectionVisible('management') && <LeadershipSection />}
            {isSectionVisible('feedback') && <TestimonialSection />}
            {isSectionVisible('news') && <NewsSection />}
            {isSectionVisible('contact') && <ContactSection />}
        </>
        </div>
    )
}

export default Home
