import React from 'react';
import { css } from '@emotion/react';

import LawmakerInline from '../LawmakerInline';

// import {
//     dateFormat,
// } from '../../config/utils'

const infoRowCss = css`
  display: flex;
  flex-wrap: wrap;
  margin-left: -0.125em;
  margin-right: 0.125em;
`;

const infoColCss = css`
  flex: 1 1 100px;
  border: 1px solid #AE9864;
  padding: 0.25em;
  margin: 0.125em;
  background-color: #EAE3DA;
`;

const infoColLabelCss = css`
  font-size: 0.8em;
  text-transform: uppercase;
  /* font-weight: bold; */
  color: #736440;
  margin-bottom: 0.25em;
`;

const infoColContentCss = css`
  color: #222;
  display: flex;
  align-items: center;
  height: 2.2em;
  text-align: center;
`;

const sponsorCss = css`
  margin-top: 0.3em;
  margin-bottom: 0.3em;
`;

const BillInfo = ({ bill }) => {
    const {
        lawsUrl, textUrl, fiscalNoteUrl, legalNoteUrl, amendmentsUrl,
        // transmittalDeadline, secondHouseReturnIfAmendedDeadline, 
        voteMajorityRequired, vetoMemoUrl,
        sponsor, requestor
    } = bill;
    
    return (
        <div>
            <div css={sponsorCss}>
                Sponsor: <LawmakerInline lawmaker={sponsor} />
                {requestor && <span>| Requestor: {requestor}</span>}
            </div>

            <div css={infoRowCss}>
                <div css={infoColCss}>
                    <div css={infoColLabelCss}>
                        📃 Bill text
                    </div>
                    <div css={infoColContentCss}>
                        {textUrl ? (
                            <span>
                                <a href={textUrl} target="_blank" rel="noopener noreferrer">Available here</a>
                            </span>
                        ) : (
                            <span>Not available</span>
                        )}
                    </div>
                </div>

                <div css={infoColCss}>
                    <div css={infoColLabelCss}>
                        💵 Fiscal note
                    </div>
                    <div css={infoColContentCss}>
                        {fiscalNoteUrl ? (
                            <span>
                                <a href={fiscalNoteUrl} target="_blank" rel="noopener noreferrer">Available here</a>
                            </span>
                        ) : (
                            <em>None on file</em>
                        )}
                    </div>
                </div>

                <div css={infoColCss}>
                    <div css={infoColLabelCss}>
                        🏛 Legal note
                    </div>
                    <div css={infoColContentCss}>
                        {legalNoteUrl ? (
                            <span>
                                <a href={legalNoteUrl} target="_blank" rel="noopener noreferrer">Available here</a>
                            </span>
                        ) : (
                            <em>None on file</em>
                        )}
                    </div>
                </div>

                <div css={infoColCss}>
                    <div css={infoColLabelCss}>
                        🖍 Proposed amendments
                    </div>
                    <div css={infoColContentCss}>
                        {amendmentsUrl ? (
                            <span>
                                <a href={amendmentsUrl} target="_blank" rel="noopener noreferrer">Available here</a>
                            </span>
                        ) : (
                            <em>None on file</em>
                        )}
                    </div>
                </div>

                {vetoMemoUrl && (
                    <div css={infoColCss}>
                        <div css={infoColLabelCss}>
                            🚫 Veto memo
                        </div>
                        <div css={infoColContentCss}>
                            {vetoMemoUrl ? (
                                <span>
                                    <a href={vetoMemoUrl} target="_blank" rel="noopener noreferrer">Available here</a>
                                </span>
                            ) : (
                                <em>None on file</em>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <div className="note">
                See also: The <a href={lawsUrl} target="_blank" rel="noopener noreferrer">official bill page</a>.
            </div>

            <div className="note">
                {voteMajorityRequired !== 'Simple' ? (
                    <span>Passage requires supermajority, {voteMajorityRequired}.</span>
                ) : null}
                {/* If needed in the future, uncomment to display deadlines */}
                {/* 
                <span>Deadline for passing first chamber (the House for House bills and the Senate for Senate bills):  
                    {dateFormat(new Date(transmittalDeadline))}.
                </span>
                <span>Deadline for first chamber return if amended in second: 
                    {dateFormat(new Date(secondHouseReturnIfAmendedDeadline))}.
                </span> 
                */}
            </div>
        </div>
    );
};

export default BillInfo;
