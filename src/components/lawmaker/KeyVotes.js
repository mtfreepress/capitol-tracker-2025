import React from 'react';
import { css } from '@emotion/react';
import Link from 'next/link'; 

import {
    billUrl
} from '../../config/utils';

import {
    positionColors,
    partyColors
} from '../../config/config';

import {
    tableStyle,
} from '../../config/styles.js';

const keyVotesStyle = css`
  tr.vote-row {
    padding: 0.5em;
    background: var(--tan1);
  }
  td, th {
    text-align: center;
    border-left: 1px solid white;
  }
  .description-col {
    text-align: left;
    max-width: 300px;
  }
  .name-col {
    font-weight: bold;
    font-size: 1.2em;
  }
  .icon {
    font-weight: bold;
  }
  .vote-breakdown {
    display: inline-block;
    font-weight: normal;
  }
`;

const LawmakerKeyVotes = ({ lastName, party, keyBillVotes }) => {
    const keyBillVotesFiltered = keyBillVotes.filter(d => d.voteData.type === 'floor');
    if (keyBillVotesFiltered.length === 0) {
        return (
            <div css={keyVotesStyle}>
                <div className="note">No key votes identified at this point.</div>
            </div>
        );
    }

    return (
        <div css={keyVotesStyle}>
            <table css={tableStyle}>
                <thead>
                    <tr>
                        <th className="description-col">Motion / Bill</th>
                        <th className="name-col"><strong>{lastName} <span style={{ color: partyColors(party) }}>({party})</span></strong></th>
                        <th className="outcome-col">Outcome</th>
                        <th className="gop-outcome-col" style={{ color: partyColors('R') }}>Republicans</th>
                        <th className="dem-outcome-col" style={{ color: partyColors('D') }}>Democrats</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        keyBillVotesFiltered.map(v => (
                            <KeyVote
                                key={v.voteData.action}
                                vote={v.lawmakerVote}
                                voteData={v.voteData}
                                identifier={v.identifier}
                                title={v.title}
                                explanation={v.explanation}
                            />
                        ))
                    }
                </tbody>
            </table>
        </div>
    );
};

const KeyVote = ({
    vote, voteData, identifier, title,
}) => {
    const url = billUrl(identifier);
    return (
        <tr className="vote-row">
            <td className="description-col">
                <div>{voteData.motion} /</div>
                <Link href={`/bills/${url}`}><strong>{identifier}</strong>: {title}</Link>
                {/* <div>{explanation}</div> */}
            </td>
            <td className="name-col" style={{ background: positionColors(vote) }}>
                {{ 'Y': 'YES', 'N': 'NO', 'E': 'Excused', 'A': 'Absent' }[vote]}
            </td>
            <td className="outcome-col" style={{ background: positionColors(voteData.motionPassed ? 'Y' : 'N'), opacity: 0.7 }}>
                <div className="icon">{voteData.motionPassed ? 'Y' : 'N'}</div>
                <div className="vote-breakdown">{voteData.count.Y}-{voteData.count.N}</div>
            </td>
            <td className="gop-outcome-col" style={{ background: positionColors(voteData.gopSupported ? 'Y' : 'N'), opacity: 0.7 }}>
                <div className="icon">{voteData.gopSupported ? 'Y' : 'N'}</div>
                <div className="vote-breakdown">{voteData.gopCount.Y}-{voteData.gopCount.N}</div>
            </td>
            <td className="dem-outcome-col" style={{ background: positionColors(voteData.demSupported ? 'Y' : 'N'), opacity: 0.7 }}>
                <div className="icon">{voteData.demSupported ? 'Y' : 'N'}</div>
                <div className="vote-breakdown">{voteData.demCount.Y}-{voteData.demCount.N}</div>
            </td>
        </tr>
    );
};

export default LawmakerKeyVotes;
