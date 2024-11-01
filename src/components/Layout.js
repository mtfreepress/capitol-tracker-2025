import React from "react";
import PropTypes from "prop-types";
import { css } from '@emotion/react';

import Header from '../design/Header';
import Nav from "../design/Nav";
import Footer from "../design/Footer";

// Global body styles
const bodyStyles = css`
  position: relative;
`;

// Content styles
const contentStyle = css`
  padding: 10px;
  padding-top: 0;
  max-width: 800px;
  margin: auto;
`;

// Sticky navigation bar styles
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

// Layout component
const Layout = ({ children, location }) => {
  return (
    <div>
      <Header />
      <Nav location={location} />
      <main>{children}</main>
      <Footer />
    </div>
   
  );
};

// Layout.propTypes = {
//   children: PropTypes.node.isRequired,
//   location: PropTypes.object,
// };

export default Layout;


 // <div></div>
    // <div css={bodyStyles}>
      // <div css={contentStyle}></div>
        // <Header />

  //       <div css={navCss}>
          // <Nav location={location} />
  //       </div>

  //       <main>{children}</main>
  //     </div>

  //     <Footer />
  //   </div>