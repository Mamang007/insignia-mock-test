import { useState, useEffect } from 'react';

const STORAGE_KEY = 'insignia_recipients';

export const useRecipients = () => {
  const [recipients, setRecipients] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setRecipients(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse recipients from storage', e);
      }
    }
  }, []);

  const addRecipient = (username: string) => {
    if (!recipients.includes(username)) {
      const updated = [username, ...recipients];
      setRecipients(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
  };

  const removeRecipient = (username: string) => {
    const updated = recipients.filter((r) => r !== username);
    setRecipients(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  return { recipients, addRecipient, removeRecipient };
};
