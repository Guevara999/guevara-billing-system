import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface GuestContextType {
  isGuest: boolean;
  setGuest: (value: boolean) => void;
  guestName: string;
  setGuestName: (name: string) => void;
}

const GuestContext = createContext<GuestContextType>({
  isGuest: false,
  setGuest: () => {},
  guestName: 'Guest User',
  setGuestName: () => {},
});

export const useGuest = () => {
  return useContext(GuestContext);
};

export const GuestContextProvider = ({ children }: { children: ReactNode }) => {
  const [isGuest, setIsGuest] = useState(false);
  const [guestName, setGuestName] = useState('Guest User');

  // Persist guest state in localStorage
  useEffect(() => {
    const storedGuest = localStorage.getItem('guevara_guest');
    if (storedGuest === 'true') {
      setIsGuest(true);
    }
  }, []);

  useEffect(() => {
    if (isGuest) {
      localStorage.setItem('guevara_guest', 'true');
    } else {
      localStorage.removeItem('guevara_guest');
    }
  }, [isGuest]);

  return (
    <GuestContext.Provider value={{ isGuest, setGuest: setIsGuest, guestName, setGuestName }}>
      {children}
    </GuestContext.Provider>
  );
};