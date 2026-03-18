import React, { createContext, useState, useEffect, useContext } from 'react';
import { getAllHeaderForShowHome } from '../utils/headerApi';

const HeaderContext = createContext();

export const HeaderProvider = ({ children }) => {
    const [headerTitles, setHeaderTitles] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchHeaders = async () => {
        try {
            const data = await getAllHeaderForShowHome();
            setHeaderTitles(data);
        } catch (error) {
            console.error("Error fetching headers in context:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHeaders();
    }, []);

    const isSectionVisible = (key) => {
        if (loading) return true;
        return headerTitles.some(header => header.key?.toLowerCase() === key.toLowerCase());
    };

    return (
        <HeaderContext.Provider value={{ headerTitles, isSectionVisible, loading, refreshHeaders: fetchHeaders }}>
            {children}
        </HeaderContext.Provider>
    );
};

export const useHeader = () => {
    const context = useContext(HeaderContext);
    if (!context) {
        throw new Error('useHeader must be used within a HeaderProvider');
    }
    return context;
};
