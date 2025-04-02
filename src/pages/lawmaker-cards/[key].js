import React from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { css } from '@emotion/react';
import LawmakerCard from '../../components/lawmaker/LawmakerCard';
import { fetchLawmakerPaths, fetchLawmakerData, fetchPortraitImage } from "../../lib/lawmaker";

// Style for embedded mode
const embedContainerCss = css`
  margin: 0;
  padding: 0;
  /* Hide scrollbars for embed mode */
  html, body {
    overflow: hidden;
  }
`;

export default function LawmakerCardPage({ lawmaker }) {
  const router = useRouter();
  
  // Check if this is in embed mode - either via URL query or hash
  const isEmbed = router.query.embed === 'true' || 
                  (typeof window !== 'undefined' && window.location.hash === '#embed');
  
  if (!lawmaker) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Head>
        {isEmbed && (
          <style jsx global>{`
            html, body {
              margin: 0;
              padding: 0;
              overflow: hidden;
            }
          `}</style>
        )}
        <title>{`${lawmaker.title} ${lawmaker.name} | Capitol Tracker`}</title>
      </Head>
      
      <div css={isEmbed ? embedContainerCss : null}>
        <LawmakerCard 
          lawmaker={lawmaker}
          portrait={lawmaker.portrait}
          hideEmbed={isEmbed}
        />
      </div>
    </>
  );
}

// Fetch Data for Static Generation
export async function getStaticProps({ params }) {
  try {
    const lawmaker = await fetchLawmakerData(params.key);
    const portrait = lawmaker.portrait 
      ? await fetchPortraitImage(lawmaker.portrait)
      : null;
    
    return {
      props: {
        lawmaker: {
          ...lawmaker,
          portrait,
        },
      },
    };
  } catch (error) {
    console.error(`Error fetching lawmaker ${params.key}:`, error);
    return { notFound: true };
  }
}

export async function getStaticPaths() {
  const paths = await fetchLawmakerPaths();
  return { paths, fallback: false };
}