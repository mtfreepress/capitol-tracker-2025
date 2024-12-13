import React from "react";
import { css } from '@emotion/react';
import Link from 'next/link'; // Use Next.js Link for navigation
import {
    percentFormat,
    committeeUrl,
} from '../../config/utils';

const committeeSummaryStyle = css`
    display: flex;
    flex-wrap: wrap;

    .item {
        flex: 1 1 auto;
        border: 1px solid var(--tan4);
        background-color: var(--tan1);
        margin: 0.2em;
        padding: 0.2em 0.5em;
    }
    .item.main {
        border: 1px solid var(--tan5);
    }
    .num {
        font-size: 1.15em;
    }
`;

const CommitteeSummary = (props) => {
    const {
        name,
        billCount,
        billsUnscheduled,
        billsScheduled,
        billsAwaitingVote,
        billsFailed,
        billsAdvanced,
        billsBlasted
    } = props;

    const unheard = Array.from(new Set(
        billsUnscheduled.concat(billsScheduled)
    ));

    return (
        <div css={committeeSummaryStyle}>
            <div className="item main">
                <strong className="num">{billCount}</strong> bills considered
            </div>
            <div className="item">
                <strong className="num">{unheard.length}</strong> <Link href={`/committees/${committeeUrl(name)}#awaiting-hearing`}>awaiting hearing</Link>
            </div>
            <div className="item">
                <strong className="num">{billsAwaitingVote.length}</strong> <Link href={`/committees/${committeeUrl(name)}#awaiting-votes`}>awaiting votes</Link>
            </div>
            <div className="item">
                <strong className="num">{billsFailed.length}</strong> ({percentFormat(billsFailed.length / billCount || 0)}) <Link href={`/committees/${committeeUrl(name)}#failed`}>voted down</Link>
            </div>
            <div className="item">
                <strong className="num">{billsAdvanced.length}</strong> ({percentFormat(billsAdvanced.length / billCount || 0)}) <Link href={`/committees/${committeeUrl(name)}#passed`}>voted forward</Link>
            </div>
        </div>
    );
}

export default CommitteeSummary;
