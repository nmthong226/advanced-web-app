import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type Settings = {
    showGreetings: boolean;
    showUpcoming: boolean;
    showTaskOverview: boolean;
    showProductivityInsights: boolean;
    showCalendar: boolean;
    themeLight: boolean;
};

type SettingsContextType = {
    showLeftBar: boolean;
    settings: Settings;
    setSettings: React.Dispatch<React.SetStateAction<Settings>>;
    setShowLeftBar: React.Dispatch<React.SetStateAction<boolean>>;
};
const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [settings, setSettings] = useState<Settings>({
        showGreetings: true,
        showUpcoming: true,
        showTaskOverview: true,
        showProductivityInsights: true,
        showCalendar: true,
        themeLight: true
    });
    const [showLeftBar, setShowLeftBar] = useState(true);

    useEffect(() => {
        const handleCheckShowLeftBar = () => {
            const anyFeatureEnabled = settings.showGreetings || settings.showUpcoming || settings.showTaskOverview || settings.showProductivityInsights;
            setShowLeftBar(anyFeatureEnabled);
        };
        handleCheckShowLeftBar();
    }, [settings]);

    return (
        <SettingsContext.Provider value={{ settings, showLeftBar, setSettings, setShowLeftBar }}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
};
