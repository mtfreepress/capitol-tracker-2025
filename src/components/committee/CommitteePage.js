import React from "react";
import { css } from '@emotion/react';
import ReactMarkdown from 'react-markdown';
import Layout from '../../design/Layout';
import ContactUs from '../ContactUs';
import NewsletterSignup from '../NewsletterSignup';
import CommitteeSummary from './Summary';
import BillTable from '../BillTable';
import { lawmakerUrl, shortDateWithWeekday } from '../../config/utils';
import { partyColors } from '../../config/config';
import getConfig from 'next/config';


const committeeMemberListStyle = css`
// TODO: Needs styling
`;

const getDay = d => shortDateWithWeekday(new Date(d));

const CommitteePage = ({ committee, bills }) => {
    const { publicRuntimeConfig } = getConfig() || {};
    const basePath = publicRuntimeConfig.basePath || process.env.BASE_PATH || '';

    const {
        key, name, time, type, billCount, billsWithdrawn,
        billsUnscheduled, billsScheduledByDay, billsAwaitingVote,
        billsFailed, billsAdvanced, billsBlasted, members, committeePageText
    } = committee;

    const unscheduledBills = bills.filter(d => billsUnscheduled.includes(d.identifier));
    const scheduledBillsByDay = billsScheduledByDay.map(day => ({
        date: day.day,
        bills: bills.filter(d => day.bills.includes(d.identifier)),
    }));

    const awaitingVoteBills = bills.filter(d => billsAwaitingVote.includes(d.identifier));
    const withdrawnBills = bills.filter(d => billsWithdrawn.includes(d.identifier));
    const failedBills = bills.filter(d => billsFailed.includes(d.identifier));
    const passedBills = bills.filter(d => billsAdvanced.includes(d.identifier));
    const blastedBills = bills.filter(d => billsBlasted.includes(d.identifier));

    const chair = members.find(d => d.role === 'chair');

    return (
        <Layout
            relativePath={`/${key}`}
            pageTitle={`${name} | 2025 MTFP Capitol Tracker`}
            pageDescription={`${name} members and bills.`}
            socialTitle={`${name} | 2025 MTFP Capitol Tracker`}
            socialDescription={`${name} members and bills.`}
        >
            <h1>{name} Committee</h1>
            <CommitteeSummary {...committee} />

            {chair && (
                <div style={{ fontSize: '1.2em', margin: '0.5em 0' }}>
                    🪑 Chair:
                    <a href={`${basePath}/lawmakers/${lawmakerUrl(chair.name)}`}>
                        <strong>{chair.name}</strong>
                        <span style={{ color: partyColors(chair.party) }}>
                            ({chair.party}-{chair.locale})
                        </span>
                    </a>
                </div>
            )}

            <ReactMarkdown>{committeePageText}</ReactMarkdown>

            <h2>Members ({members.length})</h2>
            <div css={committeeMemberListStyle}>
                {members.map(member => (
                    console.log(member.name),
                    <div key={member.name}>
                        <a href={`${basePath}/lawmakers/${lawmakerUrl(member.name)}`}>
                            <strong>{member.name}</strong>
                            <span style={{ color: partyColors(member.party) }}>
                                ({member.party}-{member.locale})
                            </span>
                        </a>
                    </div>
                ))}
            </div>

            <h2>Committee Bills ({billCount})</h2>
            <BillTable bills={unscheduledBills} />
            {/* More sections for other bill statuses can be added here */}

            <ContactUs />
        </Layout>
    );
};

export default CommitteePage;