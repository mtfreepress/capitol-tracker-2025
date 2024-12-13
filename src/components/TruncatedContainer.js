import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/react';
import { bottomFadeCss, inlineButtonCss } from '../config/styles';

const centeredButtonCss = css`
    display: block;
    margin: 0 auto;
    font-size: 1.1em;
`;

const contentCss = css`
    margin-bottom: 0.5em;
`;

const TruncatedContainer = ({ children, height = 500, openedText = 'See less', closedText = 'See all' }) => {
    const [isClosed, setClosedState] = useState(true);
    const toggleClosedState = () => setClosedState(prev => !prev);

    const truncateCss = css`
        height: ${height}px;
        overflow: hidden;
    `;

    return (
        <div>
            <div css={isClosed ? [truncateCss, bottomFadeCss, contentCss] : [contentCss]}>
                {children}
            </div>
            <button css={[inlineButtonCss, centeredButtonCss]} onClick={toggleClosedState}>
                {isClosed ? closedText : openedText}
            </button>
        </div>
    );
};

TruncatedContainer.propTypes = {
    children: PropTypes.node.isRequired,
    height: PropTypes.number,
    openedText: PropTypes.string,
    closedText: PropTypes.string,
};

export default TruncatedContainer;
