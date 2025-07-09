import React, { useState, useEffect } from 'react';
import { css } from '@emotion/react';
import Link from 'next/link';
import { fetchDocumentList, fetchBillsWithAmendments } from '../../config/utils';
import DocumentModal from '../common/DocumentModal';

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
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [documents, setDocuments] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasAmendments, setHasAmendments] = useState(false);

    useEffect(() => {
        const checkForAmendments = async () => {
            const amendmentsList = await fetchBillsWithAmendments();
            setHasAmendments(amendmentsList.includes(bill.identifier));
        };

        checkForAmendments();
    }, [bill.identifier]);

    const handleOpenModal = async () => {
        setIsModalOpen(true);
        setIsLoading(true);

        try {
            const documentList = await fetchDocumentList('amendments', bill.identifier);
            setDocuments(documentList);
        } catch (error) {
            console.error('Error loading amendment documents:', error);
        } finally {
            setIsLoading(false);
        }
    };
    const {
        lawsUrl, textUrl, fiscalNoteUrl, legalNoteUrl, amendmentsUrl,
        // transmittalDeadline, secondHouseReturnIfAmendedDeadline, 
        voteMajorityRequired, vetoMemoUrl,
        sponsor, requestor
    } = bill;

    return (
        <div>
            <div>
                <div css={sponsorCss}>
                    Sponsor: <LawmakerInline lawmaker={sponsor} />
                    {requestor && <span>| Requester: {requestor}</span>}
                </div>

                <div css={infoRowCss}>
                    <div css={infoColCss}>
                        <div css={infoColLabelCss}>
                            📃 Bill text
                        </div>
                        <div css={infoColContentCss}>
                        {textUrl ? (
                            <Link href={textUrl} target="_blank" rel="noopener noreferrer">
                            <span>Available here</span>
                            </Link>
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
                                <Link href={fiscalNoteUrl} target="_blank" rel="noopener noreferrer">
                                    <span>Available here</span>
                                </Link>
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
                                    <Link href={legalNoteUrl} target="_blank" rel="noopener noreferrer">
                                        <span>Available here</span>
                                    </Link>
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
                            {hasAmendments ? (
                                <span>
                                    <a
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleOpenModal();
                                        }}
                                    >
                                        Available here
                                    </a>
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
                                        <Link href={vetoMemoUrl} target="_blank" rel="noopener noreferrer">Available here</Link>
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
            <DocumentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                documents={documents}
                isLoading={isLoading}
                title={`Proposed amendments for ${bill.identifier}`}
            />
        </div>
    );
};


export default BillInfo;
