import { useEffect } from 'react';
import { useRouter } from 'next/router';
import calendar from "../data/calendar.json";

// Simple redirect component - no UI rendered
const CalendarRedirect = () => {
  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) return;
    
    // Find today's date or nearest valid date
    const today = new Date();
    const todayKey = `${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}-${today.getFullYear()}`;
    
    // If today is a valid date in our calendar
    if (calendar.dateKeys.includes(todayKey)) {
      router.replace(`/calendar/${todayKey}`);
      return;
    }
    
    // Otherwise, find the nearest valid date
    let nearestDateKey = null;
    let smallestDiff = Infinity;
    
    calendar.dateKeys.forEach(dateKey => {
      const [month, day, year] = dateKey.split('-').map(Number);
      const validDate = new Date(year, month - 1, day);
      const diff = Math.abs(validDate.getTime() - today.getTime());
      
      if (diff < smallestDiff) {
        smallestDiff = diff;
        nearestDateKey = dateKey;
      }
    });
    
    if (nearestDateKey) {
      router.replace(`/calendar/${nearestDateKey}`);
    }
  }, [router.isReady]);

  return null;
};

export default CalendarRedirect;