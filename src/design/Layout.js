import { css } from "@emotion/react";
import PropTypes from "prop-types";

import "../styles/base.css"

import Header from './Header'
import Nav from './Nav'
import Footer from './Footer'

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
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  location: PropTypes.object,
};

export default Layout;