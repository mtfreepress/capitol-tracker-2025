import { css } from "@emotion/react";
import Head from 'next/head';
import Script from 'next/script'
import PropTypes from "prop-types";

import "../styles/base.css"

import Header from './Header'
import Nav from './Nav'
import Footer from './Footer'

// import { metaData } from "@/config";

// filler stuff until we can get metadata pipeline worked out
const pageTitle = 'TK'
const pageUrl = 'TK'
const featureImage = null

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

const Layout = ({ children, location }) => {
  return (
    <div>
      <Head>
        {/* TODO: Populate SEO stuff here -- adapt from elex guide */}

      </Head>
      {/* Google Analytics */}
      <Script async src="https://www.googletagmanager.com/gtag/js?id=G-PC1205XZ5F"></Script>
      <Script id="ga">
        {`
        window.dataLayer = window.dataLayer || [];
        function gtag(){window.dataLayer.push(arguments);}
        gtag('js', new Date());
        
        gtag('config', 'G-PC1205XZ5F'); // OLD ELEX GUIDE TAG -- TODO UPDATE
      `}
      </Script>
      {/* Parsely information */}
      <Script type="application/ld+json" id="parsely">
        {`
          {
            "@context": "http://schema.org",
            "@type": "NewsArticle",
            "name": "${pageTitle}",
            "headline": "${pageTitle}",
            "url": "${pageUrl}",
            "thumbnailUrl": "${featureImage}",
            "datePublished: "2024-05-07T20:38:48Z",
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