import React from 'react';
import '../styles/VisionMission.css';
import { getMissionVision } from '../utils/introductApi';
import { useState } from 'react';
import { useEffect } from 'react';

const VisionMission = () => {
    const [missionVision, setMissionVision] = useState([]);
    const [loading, setLoading] = useState(true);

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

    return (
        <section className="vision-mission-section">
            <div className="container">
                <div className="vm-container">
                    <div className="vm-item" data-aos="fade-right">
                        <div className="vm-image">
                            <img src={missionVision?.mission?.image} alt="Tầm Nhìn" />
                        </div>
                        <div className="vm-content">
                            <h3>{missionVision?.mission?.title}</h3>
                            <p>
                                {missionVision?.mission?.description}
                            </p>
                        </div>
                    </div>

                    <div className="vm-item reverse" data-aos="fade-left">
                        <div className="vm-image">
                            <img src={missionVision?.vision?.image} alt="Sứ Mệnh" />
                        </div>
                        <div className="vm-content">
                            <h3>{missionVision?.vision?.title}</h3>
                            <p>
                                {missionVision?.vision?.description}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default VisionMission;
