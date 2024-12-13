import React from "react";
import { css } from '@emotion/react';
import ReactMarkdown from 'react-markdown';
import Layout from '../Layout';
import ContactUs from '../ContactUs';
import NewsletterSignup from '../NewsletterSignup';
import CommitteeSummary from './Summary';
import BillTable from '../BillTable';
import { lawmakerUrl, shortDateWithWeekday } from '../../config/utils';
import { partyColors } from '../../config/config';

const committeeMemberListStyle = css`
    // your CSS here...
`;

const getDay = d => shortDateWithWeekday(new Date(d));

const CommitteePage = ({ committee, bills }) => {
    const {
        name, time, type, billCount, billsWithdrawn,
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
    
    const chair = members.find(d => d.role === 'Chair');

    return (
        <Layout>
            <h1>{name} Committee</h1>
            <CommitteeSummary {...committee} />

            <div style={{ fontSize: '1.2em', margin: '0.5em 0' }}>
                🪑 Chair: 
                <a href={`/lawmakers/${lawmakerUrl(chair.name)}`}>
                    <strong>{chair.name}</strong> <span style={{ color: partyColors(chair.party) }}>
                        ({chair.party}-{chair.locale})
                    </span>
                </a>
            </div>

            <ReactMarkdown>{committeePageText}</ReactMarkdown>

            <h2>Members ({members.length})</h2>
            <div css={committeeMemberListStyle}>
                {/* Members list rendering */}
                {members.map(member => (
                    <div key={member.id}>
                        <a href={`/lawmakers/${lawmakerUrl(member.name)}`}>
                            <strong>{member.name}</strong> <span style={{ color: partyColors(member.party) }}>
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
