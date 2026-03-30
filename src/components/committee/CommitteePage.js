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
import Link from 'next/link';

const committeeMemberListStyle = css`
  display: flex;
  flex-wrap: wrap;
  margin-left: -0.5em;

  .col {
    flex: 1 0 250px;
    margin: 0.5em;
  }

  .item {
    border: 1px solid var(--tan2);
    background: var(--tan1);
    padding: 0.2em 0.5em;
    margin: 0;
    margin-bottom: 0.2em;
  }
  
  .header {
    font-weight: bold;
    margin-bottom: 0.5em;
  }
`;

const getDay = d => shortDateWithWeekday(new Date(d));

// Normalize a bill identifier for comparison (e.g. "HB 1", "HB-1", "hb1" → "HB1")
const normalizeBillId = (id) => {
    if (!id) return '';
    return id.replace(/\s+|-/g, '').toUpperCase();
};

// Build a Set of normalized bill ids from an array, for O(1) membership checks
const buildNormalizedSet = (ids) => {
    if (!ids || ids.length === 0) return new Set();
    return new Set(ids.map(normalizeBillId));
};

const CommitteePage = ({ committee, bills }) => {
    const basePath = process.env.BASE_PATH || '';

    const {
        key, name, time, type, billCount, billsWithdrawn,
        billsUnscheduled, billsScheduledByDay, billsAwaitingVote,
        billsFailed, billsAdvanced, billsBlasted, members, committeePageText
    } = committee;

    // Build Sets once so each category lookup is O(1) instead of O(category_size)
    const unscheduledSet   = buildNormalizedSet(billsUnscheduled);
    const awaitingVoteSet  = buildNormalizedSet(billsAwaitingVote);
    const withdrawnSet     = buildNormalizedSet(billsWithdrawn);
    const failedSet        = buildNormalizedSet(billsFailed);
    const advancedSet      = buildNormalizedSet(billsAdvanced);
    const blastedSet       = buildNormalizedSet(billsBlasted);

    // Build a Map from normalized identifier → bill object for O(1) day-schedule lookups
    const billByNormalizedId = new Map(bills.map(d => [normalizeBillId(d.identifier), d]));

    // Single pass: categorize each bill instead of 6 separate filter passes
    const unscheduledBills  = [];
    const awaitingVoteBills = [];
    const withdrawnBills    = [];
    const failedBills       = [];
    const passedBills       = [];
    const blastedBills      = [];

    for (const bill of bills) {
        const nid = normalizeBillId(bill.identifier);
        if (unscheduledSet.has(nid))  unscheduledBills.push(bill);
        if (awaitingVoteSet.has(nid)) awaitingVoteBills.push(bill);
        if (withdrawnSet.has(nid))    withdrawnBills.push(bill);
        if (failedSet.has(nid))       failedBills.push(bill);
        if (advancedSet.has(nid))     passedBills.push(bill);
        if (blastedSet.has(nid))      blastedBills.push(bill);
    }

    const scheduledBillsByDay = billsScheduledByDay
        ? billsScheduledByDay.map(day => ({
            date: day.day,
            // Map scheduled identifiers directly to bill objects via the lookup map
            bills: (day.bills || []).map(id => billByNormalizedId.get(normalizeBillId(id))).filter(Boolean),
        }))
        : [];

    // create a combined unheard bills array (both unscheduled and scheduled)
    const unheard = Array.from(new Set(
        [...unscheduledBills, ...scheduledBillsByDay.flatMap(d => d.bills)]
    ));

    const chair = members && members.find(d => d.role && d.role.toLowerCase() === 'chair');

    const sortByRole = (a, b) => {
        // role hierarchy
        const roleRank = {
            'chair': 1,
            'vice chair': 2,
            'vice-chair': 2, // just in case there is a weird hyphen
            'member': 3
        };

        // role ranks (defaulting to member if role is undefined)
        const rankA = roleRank[(a.role || '').toLowerCase()] || 99;
        const rankB = roleRank[(b.role || '').toLowerCase()] || 99;

        // sort by role rank
        return rankA - rankB;
    };

    // split into members of each party
    const republicanMembers = members ?
        members.filter(m => m.party === 'R').sort(sortByRole) :
        [];

    const democratMembers = members ?
        members.filter(m => m.party === 'D').sort(sortByRole) :
        [];

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
                        <strong> {chair.name}</strong>
                        <span style={{ color: partyColors(chair.party) }}>
                            {' '}({chair.party}-{chair.locale})
                        </span>
                    </a>
                </div>
            )}

            {committeePageText && <ReactMarkdown>{committeePageText}</ReactMarkdown>}

            <hr />

            <h2>Members ({members ? members.length : 0})</h2>
            <div css={committeeMemberListStyle}>
                <div className="col">
                    <div className="header"><strong>{republicanMembers.length}</strong> Republicans</div>
                    {republicanMembers.map(m => (
                        <div className="item" key={m.name} style={{ borderLeft: `5px solid ${partyColors(m.party)}` }}>
                            👤{' '}
                            <a href={`${basePath}/lawmakers/${lawmakerUrl(m.name)}`}>
                                <strong>{m.name}</strong>{' '}
                                <span style={{ color: partyColors(m.party) }}>({m.party}-{m.locale})</span>
                            </a>
                            {m.role && m.role.toLowerCase() !== 'member' && <span> – {m.role}</span>}
                        </div>
                    ))}
                </div>
                <div className="col">
                    <div className="header"><strong>{democratMembers.length}</strong> Democrats</div>
                    {democratMembers.map(m => (
                        <div className="item" key={m.name} style={{ borderLeft: `5px solid ${partyColors(m.party)}` }}>
                            👤{' '}
                            <a href={`${basePath}/lawmakers/${lawmakerUrl(m.name)}`}>
                                <strong>{m.name}</strong>{' '}
                                <span style={{ color: partyColors(m.party) }}>({m.party}-{m.locale})</span>
                            </a>
                            {m.role && m.role.toLowerCase() !== 'member' && <span> – {m.role}</span>}
                        </div>
                    ))}
                </div>
            </div>

            <hr />

            <h2>Committee Bills ({billCount})</h2>

            <h3 id="awaiting-hearing">🗓 Awaiting hearing ({unheard.length})</h3>

            {scheduledBillsByDay.map(day => (
                <div key={day.date}>
                    <h4>Hearing set {getDay(day.date)}</h4>
                    <BillTable bills={day.bills} suppressCount={true} />
                </div>
            ))}

            <h4>Unscheduled</h4>
            <BillTable bills={unscheduledBills} displayLimit={5} />

            <NewsletterSignup />

            <h3 id="awaiting-votes">⌛️ Heard, awaiting vote ({awaitingVoteBills.length})</h3>
            <BillTable bills={awaitingVoteBills} displayLimit={5} />

            <h3>🚫 Withdrawn ({withdrawnBills.length})</h3>
            <BillTable bills={withdrawnBills} displayLimit={5} />

            <h3 id="failed">🚫 Voted down ({failedBills.length})</h3>
            <BillTable bills={failedBills} displayLimit={5} />

            <h3 id="passed">✅ Voted forward ({passedBills.length})</h3>
            <BillTable bills={passedBills} displayLimit={5} />

            {blastedBills.length > 0 && (
                <>
                    <h3 id="blasted">🧨 Blasted from committee</h3>
                    <div className="note">Blast motions on the House or Senate floor pull bills from committee for debate there.</div>
                    <BillTable bills={blastedBills} />
                </>
            )}

            <ContactUs />
        </Layout>
    );
};

export default CommitteePage;