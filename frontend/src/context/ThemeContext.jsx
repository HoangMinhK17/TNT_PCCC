import React, { createContext, useState, useEffect, useContext } from 'react';
import { getAdminThemeAPI } from '../utils/userApi';
import { applyThemeVariables, THEME_COMPAT_MAP, getThemeById } from '../utils/themes';

export const ThemeContext = createContext();

const DEFAULT_LAYOUT = {
    news: 'grid',
    product: 'grid-4',
    service: 'card-image',
    section_style: 'sharp',
    section_spacing: 'normal',
    header: 'classic',
};

export const ThemeProvider = ({ children }) => {
    const [userTheme, setUserTheme] = useState('corporate-red');
    const [themeLayout, setThemeLayout] = useState(DEFAULT_LAYOUT);

    const applyTheme = (themeId) => {
        const resolvedId = THEME_COMPAT_MAP[themeId] || themeId;
        const themeObj = getThemeById(resolvedId);
        setUserTheme(resolvedId);
        setThemeLayout(themeObj?.layout || DEFAULT_LAYOUT);
        document.body.className = `theme-${resolvedId}`;
        applyThemeVariables(resolvedId);
    };

    useEffect(() => {
        const fetchTheme = async () => {
            try {
                const res = await getAdminThemeAPI();
                if (res && res.theme) {
                    applyTheme(res.theme);
                } else {
                    applyTheme('corporate-red');
                }
            } catch (e) {
                applyTheme('corporate-red');
            }
        };
        fetchTheme();
    }, []);

    const updateThemeState = (newTheme) => {
        applyTheme(newTheme);
    };

    return (
        <ThemeContext.Provider value={{ userTheme, themeLayout, updateThemeState }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useThemeSettings = () => useContext(ThemeContext);

