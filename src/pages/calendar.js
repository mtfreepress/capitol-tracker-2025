import { useEffect } from 'react';
import { useRouter } from 'next/router';
import calendar from "../data/calendar.json";

const CalendarRedirect = () => {
  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) return;
    
    if (calendar.mostRecentActiveDay) {
      router.replace(`/calendar/${calendar.mostRecentActiveDay}`);
      return;
    }
    
    const today = new Date();
    const todayKey = `${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}-${today.getFullYear()}`;
    
    if (calendar.dateKeys.includes(todayKey)) {
      router.replace(`/calendar/${todayKey}`);
      return;
    }
    
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