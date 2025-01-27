import { css } from "@emotion/react";
import Head from 'next/head';
import Script from 'next/script'
import PropTypes from "prop-types";

import "../styles/base.css"

import Header from './Header'
import Nav from './Nav'
import Footer from './Footer'

import { metaData } from "@/config";

// filler stuff until we can get metadata pipeline worked out
const pageTitle = 'TK'
const pageUrl = 'TK'
const defaultFeatureImage = null

const bodyStyle = css`
    position: relative;
`

const contentStyle = css`
    padding: 10px;
    padding-top: 0;
    max-width: 800px;
    margin: auto;
`

const navCss = css`
  position: sticky;
  top: 0px;
  background-color: white;
  margin: -10px;
  padding: 10px;
  margin-bottom: 0;
  padding-bottom: 0;
  z-index: 1000;
`;

const Layout = ({ 
  pageTitle,
  pageDescription,
  pageFeatureImage,
  relativePath,
  socialTitle,
  socialDescription,
  children, 
  location 
}) => {
  
  const {
    baseUrl,
  } = metaData

  const pageUrl = relativePath === '/' ? `${baseUrl}/` : `${baseUrl}${relativePath}/`
  const featureImage = pageFeatureImage ?  `${baseUrl}/${pageFeatureImage}` : `${baseUrl}/2025-capitol-tracker-feature-image.jpg`
  return (
    <div>
      <Head>
        {/* TODO: Populate SEO stuff here -- adapt from elex guide */}
        <meta charSet="utf-8" />
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="image" content={featureImage} />
        <link rel="canonical" href={pageUrl} />
        {/* OpenGraph / FB */}
        <meta property="og:url" content={pageUrl} />
        <meta property="og:locale" content="en_US" />
        <meta property="og:site_name" content="Montana Free Press" />
        <meta property="og:title" content={socialTitle || pageTitle } />
        <meta property="og:image" content={featureImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:type" content="website" />
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:creator" content="@mtfreepress" />
        <meta name="twitter:title" content={socialTitle || pageTitle} />
        <meta name="twitter:image" content={featureImage} />
        <meta name="twitter:description" content={socialDescription || pageDescription} />

        <link rel="preload" href="https://use.typekit.net/fsd6htq.css" as="style" />
        <link rel="stylesheet" href="https://use.typekit.net/fsd6htq.css" />

      </Head>
      {/* Google Analytics */}
      <Script async src="https://www.googletagmanager.com/gtag/js?id=G-S068DPGXET"></Script>
      <Script id="ga">
        {`
        window.dataLayer = window.dataLayer || [];
        function gtag(){window.dataLayer.push(arguments);}
        gtag('js', new Date());
        
        gtag('config', 'G-S068DPGXET');
      `}
      </Script>
      {/* Parsely information */}
      <Script id="parsely-jsonld" type="application/ld+json" strategy="afterInteractive">
        {`
          {
            "@context": "http://schema.org",
            "@type": "NewsArticle",
            "name": "${pageTitle}",
            "headline": "${pageTitle}",
            "url": "${pageUrl}",
            "thumbnailUrl": "${featureImage}",
            "datePublished: "2025-01-013T20:38:48Z",
            "dateModified": "${new Date().toISOString()}",
            "articleSection": "News apps",
            "author": [
              {
                  "@type": "Person",
                  "name": "Jacob Olness"
              },  
              {
                  "@type": "Person",
                  "name": "Eric Dietrich"
              }
            ],
            "creator": "Eric Dietrich and Jacob Olness"
            "publisher": {
                "@type": "Organization",
                "name": "Montana Free Press",
                "logo": "https:\/\/montanafreepress.org\/wp-content\/uploads\/2020\/05\/mtfp-logo-1.png"
            },
          }
        `}
      </Script>
      <div css={bodyStyle}>
        <div css={contentStyle}>
          <Header />

          <div css={navCss}>
            <Nav location={location} />
          </div>

          <main>{children}</main>
        </div>

        <Footer />
         {/* Parsely analytics */}
         <Script id="parsely-cfg" src="https://cdn.parsely.com/keys/montanafreepress.org/p.js"></Script>
      </div>
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  location: PropTypes.object,
};

export default Layout;