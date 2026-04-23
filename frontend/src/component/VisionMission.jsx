import React from 'react';
import '../styles/VisionMission.css';
import { getMissionVision } from '../utils/introductApi';
import { useState } from 'react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const VisionMission = () => {
    const [missionVision, setMissionVision] = useState([]);
    const [loading, setLoading] = useState(true);
    const { i18n } = useTranslation();

    useEffect(() => {
        const fetchMissionVision = async () => {
            try {
                setLoading(true)
                const response = await getMissionVision();
                setMissionVision(Array.isArray(response) ? (response[0] ?? null) : response);
            } catch (error) {
                console.error("Error fetching mission vision:", error);
            }
            finally {
                setLoading(false);
            }
        };
        fetchMissionVision();
    }, []);

    const descriptionVisionText =
        i18n.language === 'en' && missionVision?.vision?.description_en
            ? missionVision.vision.description_en
            : missionVision?.vision?.description;

    const descriptionMissionText =
        i18n.language === 'en' && missionVision?.mission?.description_en
            ? missionVision.mission.description_en
            : missionVision?.mission?.description;

    return (
        <section className="vision-mission-section">
            <div className="container">
                <div className="vm-container">
                    <div className="vm-item" data-aos="fade-right">
                        <div className="vm-image">
                            <img src={missionVision?.mission?.image} alt="Tầm Nhìn" />
                        </div>
                        <div className="vm-content">
                            <h3>{i18n.language === 'en' && missionVision?.mission?.title_en ? missionVision.mission.title_en : missionVision?.mission?.title}</h3>

                            {descriptionMissionText
                                ?.split('.')
                                .filter(item => item.trim() !== '')
                                .map((item, index) => (
                                    <p key={index}>{item.trim()}.</p>
                                ))}
                        </div>
                    </div>

                    <div className="vm-item reverse" data-aos="fade-left">
                        <div className="vm-image">
                            <img src={missionVision?.vision?.image} alt="Sứ Mệnh" />
                        </div>
                        <div className="vm-content">
                            <h3>{i18n.language === 'en' && missionVision?.vision?.title_en ? missionVision.vision.title_en : missionVision?.vision?.title}</h3>

                            {descriptionVisionText
                                ?.split('.')
                                .filter(item => item.trim() !== '')
                                .map((item, index) => (
                                    <p key={index}>{item.trim()}.</p>
                                ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default VisionMission;
