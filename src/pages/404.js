import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from "../design/Layout";
import Link from 'next/link';
import { css } from '@emotion/react';
import calendar from "../data/calendar.json";

// TODO: Set this up later:

export default function Custom404() {
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [isRedirecting, setIsRedirecting] = useState(false);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Account for basePath in production
      const basePath = process.env.BASE_PATH || '';
      const fullPath = window.location.pathname;
      
      // Remove basePath from path if present
      const path = fullPath.startsWith(basePath) 
        ? fullPath.slice(basePath.length) 
        : fullPath;
      
      // Check for calendar date pattern
      const calendarMatch = path.match(/\/calendar\/(\d{2}-\d{2}-\d{4})/);
      
      if (calendarMatch) {
        const requestedDateKey = calendarMatch[1];
        
        try {
          // Parse the date
          const [month, day, year] = requestedDateKey.split('-').map(Number);
          const requestedDate = new Date(year, month - 1, day);
          
          // Format for display
          const formattedDate = requestedDate.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
          });
          
          setMessage(`${formattedDate} has no legislative activity.`);
          setIsRedirecting(true);
          
          // Find nearest date
          if (calendar.dateKeys && calendar.dateKeys.length > 0) {
            let nearestDateKey = null;
            let smallestDiff = Infinity;
            
            calendar.dateKeys.forEach(dateKey => {
              const [m, d, y] = dateKey.split('-').map(Number);
              const validDate = new Date(y, m - 1, d);
              const diff = Math.abs(validDate.getTime() - requestedDate.getTime());
              
              if (diff < smallestDiff) {
                smallestDiff = diff;
                nearestDateKey = dateKey;
              }
            });
            
            if (nearestDateKey) {
              // Show message for a moment before redirecting
              setTimeout(() => {
                window.location.href = `${basePath}/calendar/${nearestDateKey}?redirected=true&from=${requestedDateKey}`;
              }, 1000);
            }
          }
        } catch (e) {
          console.error("Error parsing date:", e);
        }
      }
    }
  }, []);

  return (
    <Layout
      pageTitle="Page Not Found | MTFP Capitol Tracker"
      pageDescription="The page you requested could not be found."
    >
      <div css={css`
        text-align: center;
        padding: 2rem;
      `}>
        <h1>404 - Page Not Found</h1>
        
        {message ? (
          <>
            <p>{message}</p>
            {isRedirecting && <p>Redirecting to the nearest date with legislative activity...</p>}
          </>
        ) : (
          <p>The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
        )}
        
        <div css={css`margin-top: 2rem;`}>
          <Link href="/">Return to Homepage</Link>
          {' '} | {' '}
          <Link href="/calendar">View Legislative Calendar</Link>
        </div>
      </div>
    </Layout>
  );
}