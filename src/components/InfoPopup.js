import React, { useState } from 'react'
import { css } from '@emotion/react'
import ReactMarkdown from 'react-markdown'

const color = '#444'
const iconSvg = css`
    fill: white;
    position: relative;
    top: 3px;
    height: 18px;
    width: 18px;
    margin-right: 3px;
`

// From: https://material.io/resources/icons/?search=infor&icon=help&style=baseline
const questionMarkSvg = (
    <svg
        css={iconSvg}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        height="18px"
        width="18px"
    >
        <path fill="none" d="M0 0h24v24H0z" />
        <path fill="#444" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z" />
    </svg>
);


// Adapted from https://codesandbox.io/s/how-to-make-an-extremely-reusable-tooltip-component-with-react-and-nothing-else-7opo3?from-embed=&file=/src/Tooltip.css

const tipWrapperCss = css`
    display: inline-block;
    position: relative;

    border: 1px solid var(--gray2);
    padding: 0.2em 0.4em;
    background-color: var(--gray1);
    color: black;
    /* border-radius: 0.2em; */
    font-size: 1em;

    margin: 0.5em 0;

    width: 100%;
    /* max-width: 400px; */

    cursor: pointer;

    :hover {
        background-color: var(--gray2);
        border: 1px solid #222;
        box-shadow: 1px 1px 2px #eee;
    }

    div {
        margin-bottom: 0.5em;
    }
`

const isActiveCss = css`
    border: 1px solid #222;
`

const tipCss = css`
    position: absolute;
    /* border-radius: 4px; */
    left: 50%;
    transform: translateX(-50%);
    padding: 6px;
    color: #222;
    background: var(--gray1);
    font-size: 0.9em;
    line-height: 1.1;
    z-index: 100;
    /* white-space: nowrap; */
    border: 1px solid var(--gray4);
    width: 90%;
    max-width: 400px;

    /* font-style: italic; */
    text-transform: none;

    box-shadow: 1px 1px 2px #444;

    p {
        font-family: futura-pt, Arial, Helvetica, sans-serif;
        font-size: 1em;
        line-height: 1.1em;
        color: #444;
        margin-top: 0.1em;

        :last-of-type {
            margin-bottom: 0.1em;
        }
    }

    /* CSS border triangles */
    :before {
        content: " ";
        left: 50%;
        border: solid transparent;
        height: 0;
        width: 0;
        position: absolute;
        pointer-events: none;
        border-width: 6px;
        margin-left: -6px;
    }
`

const bottomCss = css`
    top: 40px;

    :before {
        bottom: 100%;
        border-bottom-color: ${color};
    }
`

const InfoPopup = ({ label, content }) => {
    const [active, setActive] = useState(false)

    const toggleTip = () => {
        setActive(prev => !prev)
    }

    return (
        <div css={[tipWrapperCss, active && isActiveCss]} onClick={toggleTip}>
            {questionMarkSvg}
            <em>{label}</em>
            {active && (
                <div css={[tipCss, bottomCss]}>
                    <ReactMarkdown>{content}</ReactMarkdown>
                </div>
            )}
        </div>
    )
}

export default InfoPopup
