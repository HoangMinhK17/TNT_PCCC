import React, { createContext, useState, useEffect, useContext } from 'react';
import { getAdminThemeAPI } from '../utils/userApi';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [userTheme, setUserTheme] = useState('light');

    useEffect(() => {
        const fetchTheme = async () => {
            try {
                const res = await getAdminThemeAPI();
                if (res && res.theme) {
                    setUserTheme(res.theme);
                    document.body.className = `theme-${res.theme}`;
                } else {
                    document.body.className = 'theme-light';
                }
            } catch (e) {
                document.body.className = 'theme-light';
            }
        };
        fetchTheme();
    }, []);

    const updateThemeState = (newTheme) => {
        setUserTheme(newTheme);
        document.body.className = `theme-${newTheme}`;
    };

    return (
        <ThemeContext.Provider value={{ userTheme, updateThemeState }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useThemeSettings = () => useContext(ThemeContext);
