import React from 'react';
import { css } from '@emotion/react';
import Link from 'next/link';

const navStyle = css`
    border-bottom: 1px solid #444;
    margin-bottom: 0.5em;
    margin-left: -2px;
    margin-right: -2px;
    padding-left: 2px;
    padding-right: 2px;
    box-shadow: 0px 3px 3px -3px #000;
`;

const navRowStyle = css`
    display: flex;
    flex-wrap: wrap;
    align-items: center;
`;

const navRowPrimary = css`
    margin: 0 -0.25em; /* Aligns items to edges */
`;

const navRowSecondary = css`
    justify-content: space-between;
    margin-left: -0.5em;
    margin-right: -0.5em;
    font-size: 15px;
`;

const navItemStyle = css`
    margin: 0 0.25em;
    margin-bottom: 0.5rem;
    text-align: center;
    text-decoration: none;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    padding-top: 0.3em;
    padding-bottom: 0.3em;
`;

const navPrimaryStyle = css`
    flex: 1 1 4em;
    padding: 0.2em;
    border: 1px solid #404040;
    background-color: #eee;
    box-shadow: 1px 1px 2px #ccc;
    display: flex;
    flex-direction: column;

    :hover {
        border: 1px solid #ce5a00;
        box-shadow: 1px 1px 2px #666;
    }
`;

const navPrimaryTitle = css`
    font-weight: bold;
    text-transform: uppercase;
    font-size: 1.1em;
    margin: 0.2em 0;

    @media screen and (max-width: 400px) {
        font-size: 13px;
    }
`;

const navPrimaryInfo = css`
    color: #666;
    font-size: 0.8em;
`;

const navSecondaryStyle = css`
    flex: 1 0 8em;
    display: block;
    border: 1px solid var(--gray2);
    padding: 0.2em 0.5em;
    margin: 0em 0.25em;
    margin-bottom: 0.25em;
`;

const activeStyle = css`
    background: var(--gray1);
    border: 1px solid var(--gray2);
`;

const PAGE_LINKS = [
    { path: '/#key-bill-status', label: '📑 Key bills' },
    { path: '/all-bills/', label: '🗂 All bills' },
    { path: '/#find-bill', label: '🔎 Find a bill' },
    { path: '/#find-lawmaker', label: '🔎 Find a lawmaker' },
    { path: '/#find-district', label: '🏡 Your district' },
    { path: '/calendar/', label: '🗓 Calendar' },
    { path: '/recap/', label: '📝 What\'s happened' },
    { path: '/participation/', label: '🙋 How to participate' },
];

const Nav = ({ location }) => {
    // We can add active state management here, if required
    const isActiveStyle = location ? activeStyle : null;

    const links = PAGE_LINKS.map((l) => (
        <Link key={l.path} href={l.path} passHref legacyBehavior>
            <a css={[navItemStyle, navSecondaryStyle, isActiveStyle]}>
                {l.label}
            </a>
        </Link>
    ));

    return (
        <div css={navStyle}>
            <div css={[navRowStyle, navRowSecondary]}>
                {links}
            </div>

            <div css={[navRowStyle, navRowPrimary]}>
                <Link href='/house' passHref legacyBehavior>
                    <a css={[navItemStyle, navPrimaryStyle]}>
                        <div css={navPrimaryTitle}>🏛 House</div>
                        <div css={navPrimaryInfo}>GOP-held 68-32</div>
                    </a>
                </Link>
                <Link href='/senate' passHref legacyBehavior>
                    <a css={[navItemStyle, navPrimaryStyle]}>
                        <div css={navPrimaryTitle}>🏛 Senate</div>
                        <div css={navPrimaryInfo}>GOP-held 34-16</div>
                    </a>
                </Link>
                <Link href='/governor' passHref legacyBehavior>
                    <a css={[navItemStyle, navPrimaryStyle]}>
                        <div css={navPrimaryTitle}>🖋 Governor</div>
                        <div css={navPrimaryInfo}>Greg Gianforte (R)</div>
                    </a>
                </Link>
            </div>
        </div>
    );
};

export default Nav;
