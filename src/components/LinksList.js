import React from 'react';
import { css } from '@emotion/react';
import Link from 'next/link';

import {
    dateFormatWithYear
} from '../config/utils';

import {
    containerStyle,
    noteStyle
} from '../config/styles.js';

const linkContainerStyle = css`
    display: flex;
    flex-wrap: wrap;
    margin: -0.3em;
    padding: 0;
`;

const linkStyle = css`
    display: block;
    background-color: #EAE3DA;
    color: #222;
    padding: 0.7em 0.7em;
    border: 1px solid #806F47;
    margin: 0.3em;

    cursor: pointer;
    flex: 1 1 200px;
    min-width: 150px;

    :hover {
        text-decoration: none;
        color: #ce5a00;
    }

    :hover .title {
        text-decoration: underline;
    }

    .dek {
        font-size: 0.8em;
        line-height: 0.9em;
        text-transform: uppercase;
        color: var(--gray4) !important;
        margin-bottom: 0.5em;
    }

    .title {
        font-size: 1em;
        font-weight: bold;
        line-height: 1em;
        color: #ce5a00;
        margin-bottom: 0.3em;
    }

    .detail {
        font-size: 0.8em;
        font-style: italic;
        color: #666;
    }
`;

// Handles null dates from improperly parsed links
const presentDate = date => date ? dateFormatWithYear(new Date(date)) : null;

const LinksList = ({ articles }) => {
    if (articles.length === 0) return (
        <div css={containerStyle}>
            <div css={noteStyle}>No stories currently in our database.</div>
        </div>
    );

    return (
        <div css={containerStyle}>
            <div css={linkContainerStyle}>
                {
                    articles
                        .sort((a, b) => new Date(b.date) - new Date(a.date))
                        .map((article, i) => <Link key={String(i)} href={article.link} passHref><LinkItem {...article} /></Link>)
                }
            </div>
        </div>
    );
};

export default LinksList;

const LinkItem = (props) => {
    const { title, date, category, author } = props;

    // This is a "temporary" hack to work around a bug with how MTFP's main website exports authors
    // on republished stories written by partner orgs
    const displayAuthor = ['Stephanie Farmer'].includes(author) ? '' : author;

    return (
        <div css={linkStyle}>
            <div className='dek'>📰 {category}</div>
            <div className='title'>{title}</div>
            <div className='detail'>{presentDate(date)} • {displayAuthor}</div>
        </div>
    );
};
