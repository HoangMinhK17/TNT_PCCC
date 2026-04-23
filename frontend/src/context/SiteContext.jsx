import React, { createContext, useContext, useEffect, useState } from 'react';
import { getAllIntroduction } from '../utils/introductApi';

const SiteContext = createContext(null);

export const SiteProvider = ({ children }) => {
    const [introduction, setIntroduction] = useState(null);

    useEffect(() => {
        getAllIntroduction()
            .then(res => setIntroduction(Array.isArray(res) ? (res[0] ?? null) : res))
            .catch(() => {});
    }, []);

    return (
        <SiteContext.Provider value={{ introduction }}>
            {children}
        </SiteContext.Provider>
    );
};

export const useSite = () => useContext(SiteContext);
