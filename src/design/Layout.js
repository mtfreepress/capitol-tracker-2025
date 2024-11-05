import { css } from "@emotion/react";
import PropTypes from "prop-types";

import Head from 'next/head';

import Header from './Header'
import Nav from './Nav'
import Footer from './Footer'
import Script from 'next/script'

import { metaData } from "@/config";

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
      <div css={bodyStyle}>
        <div css={contentStyle}>
          <Header />

          <div css={navCss}>
            <Nav location={location} />
          </div>

          <main>{children}</main>
        </div>

        <Footer />
      </div>
    </div>
    // <div>
    //   <Header />
    //   <Nav location={location} />
    //   <main>{children}</main>
    //   <Footer />
    // </div>

  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  location: PropTypes.object,
};

export default Layout;


//  <div></div>
//     <div css={bodyStyles}>
//       <div css={contentStyle}></div>
//         <Header />

//         <div css={navCss}>
//           <Nav location={location} />
//         </div>

//         <main>{children}</main>
//       </div>

//       <Footer />
//     </div>

// export default function Layout({
//   pageTitle,
//   pageDescription,
//   pageFeatureImage,
//   siteSeoTitle,
//   // seoDescription,
//   socialTitle, // TODO
//   socialDescription, // TODO
//   // home,
//   relativePath,
//   pageCss,
//   children,
// }) {
//   const {
//     baseUrl,
//   } = metaData

//   const pageUrl = relativePath === '/' ? `${baseUrl}/` : `${baseUrl}/${relativePath}/`
//   const featureImage = pageFeatureImage || `${baseUrl}/election-guide-2024-feature-art.jpg`
//   return (
//     <div>
//       <Head>
//         <meta charSet="utf-8" />
//         <title>{siteSeoTitle}</title>
//         <meta name="description" content={pageDescription} />
//         <meta name="image" content={featureImage} />
//         <link rel="canonical" href={pageUrl} />
//         {/* OpenGraph / FB */}
//         <meta property="og:url" content={pageUrl} />
//         <meta property="og:locale" content="en_US" />
//         <meta property="og:site_name" content="Montana Free Press" />
//         <meta property="og:title" content={socialTitle} />
//         <meta property="og:image" content={featureImage} />
//         <meta property="og:image:width" content="1200" />
//         <meta property="og:image:height" content="630" />
//         <meta property="og:type" content="website" />
//         {/* Twitter */}
//         <meta name="twitter:card" content="summary_large_image" />
//         <meta name="twitter:creator" content="@mtfreepress" />
//         <meta name="twitter:title" content={socialTitle} />
//         <meta name="twitter:image" content={featureImage} />
//         <meta name="twitter:description" content={socialDescription} />

//         <link rel="preload" href="https://use.typekit.net/fsd6htq.css" as="style" />
//         <link rel="stylesheet" href="https://use.typekit.net/fsd6htq.css" />

//       </Head>
//       {/* Google Analytics */}
//       <Script async src="https://www.googletagmanager.com/gtag/js?id=G-PC1205XZ5F"></Script>
//       <Script id="ga">
//         {`
//         window.dataLayer = window.dataLayer || [];
//         function gtag(){window.dataLayer.push(arguments);}
//         gtag('js', new Date());

//         gtag('config', 'G-PC1205XZ5F');
//       `}
//       </Script>
//       {/* Parsely information */}
//       <Script type="application/ld+json" id="parsely">
//         {`
//           {
//             "@context": "http://schema.org",
//             "@type": "NewsArticle",
//             "name": "${pageTitle}",
//             "headline": "${pageTitle}",
//             "url": "${pageUrl}",
//             "thumbnailUrl": "${featureImage}",
//             "datePublished: "2024-05-07T20:38:48Z",
//             "dateModified": "${new Date().toISOString()}",
//             "articleSection": "News apps",
//             "author": [
//               {
//                   "@type": "Person",
//                   "name": "Eric Dietrich"
//               }
//             ],
//             "creator": "Eric Dietrich"
//             "publisher": {
//                 "@type": "Organization",
//                 "name": "Montana Free Press",
//                 "logo": "https:\/\/montanafreepress.org\/wp-content\/uploads\/2020\/05\/mtfp-logo-1.png"
//             },
//           }
//         `}
//       </Script>

//       <div css={[bodyStyle]}>
//         <Header />
//         <Nav />
//         <main css={[contentStyle, pageCss]}>{children}</main>
//         <Footer />
//         {/* Parsely analytics */}
//         <Script id="parsely-cfg" src="https://cdn.parsely.com/keys/montanafreepress.org/p.js"></Script>
//       </div>


//     </div>
//   );
// }