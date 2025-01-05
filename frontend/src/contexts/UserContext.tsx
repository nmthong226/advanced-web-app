import React, { createContext, ReactNode, useContext, useState } from 'react';
import { User } from "../types/type";

interface UserContextType {
    user: User;
    setUser: React.Dispatch<React.SetStateAction<User>>;
}
// Create the User context with default values
const UserContext = createContext<UserContextType | undefined>(undefined);
// User Context Provider Component
const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User>({
        id: '',
        clerkId: '',
        tasks: [],
        eventCategories: [],
        activitySchedule: [],
        settings: {
            theme: 'light',
            notifications: true,
            language: 'en',
        },
    });
    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

// Custom hook to use User context
const useUser = (): UserContextType => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};

export { UserProvider, useUser };
