import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { css } from "@emotion/react";
import Layout from "../../design/Layout";
import BillTable from "../../components/BillTable";
import CalendarNavigator from "../../components/CalendarNavigator";
import { shortDateWithWeekday } from "../../config/utils";
import calendar from "../../data/calendar.json";
import allBills from "../../data/bills.json";
import committees from "../../data/committees.json";

const capitalizeFirstLetter = string => string.charAt(0).toUpperCase() + string.slice(1);

const groupHearingsByCommittee = hearings => {
    return hearings.reduce((acc, hearing) => {
        const committee = hearing.data.committee;
        if (!acc[committee]) {
            acc[committee] = [];
        }
        acc[committee].push(hearing);
        return acc;
    }, {});
};

const Committee = ({ committee, onCalendarBills, hearings }) => {
    const committeeHearingBills = hearings
        .filter((d) => d.data.committee === committee)
        .map((d) => d.data.bill);

    const bills = onCalendarBills
        .filter((d) => committeeHearingBills.includes(d.identifier));

    return (
        <div>
            <h4>👥 {committee}</h4>
            <BillTable bills={bills} displayLimit={10} suppressCount={true} />
        </div>
    );
};

export default function CalendarDay({ dateData, onCalendarBills, committees, isInvalidDate, dateStr }) {
    const router = useRouter();

    // For invalid dates (no legislative activity), show a custom message
    if (isInvalidDate || (dateData.hearings.length === 0 && dateData.floorDebates.length === 0 && dateData.finalVotes.length === 0)) {
        // Parse the date for display
        const [month, day, year] = dateStr.split('-').map(Number);
        const requestedDate = new Date(year, month - 1, day);
        const formattedDate = requestedDate.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });

        return (
            <Layout
                relativePath={`/calendar/${dateStr}`}
                pageTitle={`Legislative Calendar for ${formattedDate} | MTFP Capitol Tracker`}
                pageDescription={`Montana legislative calendar for ${formattedDate}`}
            >
                <h1>Legislative Calendar</h1>

                <div css={css`
                  background: var(--gray2);
                  padding: 1em;
                  margin-bottom: 2em;
                  border-radius: 4px;
                  text-align: center;
                `}>
                    <h2>No Legislative Events on {formattedDate}</h2>
                    <p>There are no scheduled legislative events for this date. Please select a date from the calendar below.</p>
                </div>

                <CalendarNavigator
                    dates={calendar.dates}
                    currentPageDate={null}
                />
            </Layout>
        );
    }

    if (!dateData) {
        return (
            <Layout>
                <h1>Loading...</h1>
            </Layout>
        );
    }

    const day = shortDateWithWeekday(new Date(dateData.date));
    const hearingsByCommittee = groupHearingsByCommittee(dateData.hearings);

    const committeesWithHearings = Array.from(
        new Set(dateData.hearings.map((a) => a.data.committee))
    ).map((name) => {
        const match = committees.find((d) => d.name === name) || {};
        return {
            name,
            key: match.key || null,
            cat: match.time && match.type ? `${match.time}-${match.type}` : 'other',
        };
    });

    const categories = {
        amPolicyCommittees: committeesWithHearings.filter((d) => d.cat === "morning-policy"),
        pmPolicyCommittees: committeesWithHearings.filter((d) => d.cat === "afternoon-policy"),
        appropsCommittees: committeesWithHearings.filter((d) =>
            ["morning-fiscal-sub", "varies-fiscal"].includes(d.cat)
        ),
        otherCommittees: committeesWithHearings.filter(
            (d) => !["morning-policy", "afternoon-policy", "morning-fiscal-sub", "varies-fiscal"].includes(d.cat)
        ),
    };

    return (
        <Layout
            relativePath={`/calendar/${dateData.key}`}
            pageTitle={`Legislative Calendar for ${day} | 2025 MTFP Capitol Tracker`}
            pageDescription={`Committee hearings and legislative activity for ${day}`}
        >
            <h1>Calendar — {day}</h1>
            <div css={css`
                background-color: var(--gray1);
                padding: 0.75em;
                border-radius: 4px;
                margin-bottom: 1em;
                text-align: center;
                font-weight: 500;
            `}>
                {dateData.hearings.length > 0 || dateData.floorDebates.length > 0 || dateData.finalVotes.length > 0 ? (
                    <>
                        <span css={css`color: var(--text);`}>
                            <a href="#hearings" css={css`
                                text-decoration: none;
                                &:hover { color: #ce5a00; }
                            `}>
                                <b>{dateData.hearings.length}</b> {dateData.hearings.length === 1 ? 'hearing' : 'hearings'}
                            </a>{' '}
                            <span css={css`color: #ce5a00;`}>•</span>{' '}
                            <a href="#debates" css={css`
                                text-decoration: none;
                                &:hover { color: #ce5a00; }
                            `}>
                                <b>{dateData.floorDebates.length}</b> floor {dateData.floorDebates.length === 1 ? 'debate' : 'debates'}
                            </a>{' '}
                            <span css={css`color: #ce5a00;`}>•</span>{' '}
                            <a href="#votes" css={css`
                                text-decoration: none;
                                &:hover { color: #ce5a00; }
                            `}>
                                <b>{dateData.finalVotes.length}</b> final {dateData.finalVotes.length === 1 ? 'vote' : 'votes'}
                            </a>
                        </span>
                    </>
                ) : (
                    <span>No scheduled legislative activity</span>
                )}
            </div>

            <CalendarNavigator
                dates={calendar.dates}
                currentPageDate={dateData.key}
            />

            <section>
                <h3>Committee Hearings</h3>
                <div className="note">
                    Bill hearings allow the sponsor to explain a bill and enable public testimony.
                </div>
                {dateData.hearings.length === 0 ? (
                    <p>No committee hearings scheduled for this date.</p>
                ) : (
                    Object.entries(categories).map(([key, categoryCommittees]) => {
                        if (categoryCommittees.length > 0) {
                            const title = {
                                amPolicyCommittees: "Morning Policy Committees",
                                pmPolicyCommittees: "Afternoon Policy Committees",
                                appropsCommittees: "Budget Committees",
                                otherCommittees: "Other Committees",
                            }[key];

                            return (
                                <div key={key}>
                                    <h4>{title}</h4>
                                    {categoryCommittees.map((committee) => (
                                        <Committee
                                            key={`${day}-${committee.name}`}
                                            committee={committee.name}
                                            hearings={dateData.hearings}
                                            onCalendarBills={onCalendarBills}
                                        />
                                    ))}
                                </div>
                            );
                        }
                        return null;
                    })
                )}
            </section>

            <section>
                <h3>Floor Debates</h3>
                {!dateData.floorDebates?.length ? (
                    <p>No floor debates scheduled for this date.</p>
                ) : (
                    <>
                        <div className="note">
                            Debates are followed by Second Reading votes.
                        </div>

                        {/* House Floor Debates */}
                        {dateData.floorDebates.some(debate => debate.data.billHolder?.toLowerCase() === "house") && (
                            <div css={css`margin-bottom: 1.5em;`}>
                                <h4>🏠 House</h4>
                                <BillTable
                                    bills={onCalendarBills.filter(bill =>
                                        dateData.floorDebates
                                            .filter(debate => debate.data.billHolder?.toLowerCase() === "house")
                                            .map(d => d.data.bill)
                                            .includes(bill.identifier)
                                    )}
                                    displayLimit={10}
                                    suppressCount={true}
                                />
                            </div>
                        )}

                        {/* Senate Floor Debates */}
                        {dateData.floorDebates.some(debate => debate.data.billHolder?.toLowerCase() === "senate") && (
                            <div>
                                <h4>🏛 Senate</h4>
                                <BillTable
                                    bills={onCalendarBills.filter(bill =>
                                        dateData.floorDebates
                                            .filter(debate => debate.data.billHolder?.toLowerCase() === "senate")
                                            .map(d => d.data.bill)
                                            .includes(bill.identifier)
                                    )}
                                    displayLimit={10}
                                    suppressCount={true}
                                />
                            </div>
                        )}

                        {/* Handle debates without a specified chamber */}
                        {dateData.floorDebates.some(debate => !debate.data.billHolder ||
                            (debate.data.billHolder.toLowerCase() !== "house" &&
                                debate.data.billHolder.toLowerCase() !== "senate")) && (
                                <div css={css`margin-top: 1.5em;`}>
                                    <h4>Other Floor Debates</h4>
                                    <BillTable
                                        bills={onCalendarBills.filter(bill =>
                                            dateData.floorDebates
                                                .filter(debate => !debate.data.billHolder ||
                                                    (debate.data.billHolder.toLowerCase() !== "house" &&
                                                        debate.data.billHolder.toLowerCase() !== "senate"))
                                                .map(d => d.data.bill)
                                                .includes(bill.identifier)
                                        )}
                                        displayLimit={10}
                                        suppressCount={true}
                                    />
                                </div>
                            )}
                    </>
                )}
            </section>

            <section>
                <h3>Final Votes</h3>
                {!dateData.finalVotes?.length ? (
                    <p>No final votes scheduled for this date.</p>
                ) : (
                    <>
                        <div className="note">
                            Final votes determine if a bill advances to the next chamber or to the governor.
                        </div>

                        {/* House Final Votes */}
                        {dateData.finalVotes.some(vote => vote.data.billHolder?.toLowerCase() === "house") && (
                            <div css={css`margin-bottom: 1.5em;`}>
                                <h4>🏠 House</h4>
                                <BillTable
                                    bills={onCalendarBills.filter(bill =>
                                        dateData.finalVotes
                                            .filter(vote => vote.data.billHolder?.toLowerCase() === "house")
                                            .map(d => d.data.bill)
                                            .includes(bill.identifier)
                                    )}
                                    displayLimit={10}
                                    suppressCount={true}
                                />
                            </div>
                        )}

                        {/* Senate Final Votes */}
                        {dateData.finalVotes.some(vote => vote.data.billHolder?.toLowerCase() === "senate") && (
                            <div>
                                <h4>🏛 Senate</h4>
                                <BillTable
                                    bills={onCalendarBills.filter(bill =>
                                        dateData.finalVotes
                                            .filter(vote => vote.data.billHolder?.toLowerCase() === "senate")
                                            .map(d => d.data.bill)
                                            .includes(bill.identifier)
                                    )}
                                    displayLimit={10}
                                    suppressCount={true}
                                />
                            </div>
                        )}

                        {/* Handle votes without a specified chamber */}
                        {dateData.finalVotes.some(vote => !vote.data.billHolder ||
                            (vote.data.billHolder.toLowerCase() !== "house" &&
                                vote.data.billHolder.toLowerCase() !== "senate")) && (
                                <div css={css`margin-top: 1.5em;`}>
                                    <h4>Other Final Votes</h4>
                                    <BillTable
                                        bills={onCalendarBills.filter(bill =>
                                            dateData.finalVotes
                                                .filter(vote => !vote.data.billHolder ||
                                                    (vote.data.billHolder.toLowerCase() !== "house" &&
                                                        vote.data.billHolder.toLowerCase() !== "senate"))
                                                .map(d => d.data.bill)
                                                .includes(bill.identifier)
                                        )}
                                        displayLimit={10}
                                        suppressCount={true}
                                    />
                                </div>
                            )}
                    </>
                )}
            </section>
        </Layout>
    );
}

export async function getStaticPaths() {
    return {
        paths: calendar.dateKeys.map((key) => ({
            params: { key }
        })),
        fallback: false
    };
}

export async function getStaticProps({ params }) {
    const dateData = calendar.dateMap[params.key];

    if (!dateData) {
        return {
            props: {
                isInvalidDate: true,
                dateStr: params.key,
                committees: committees || [],
                onCalendarBills: []
            }
        };
    }

    const onCalendarBills = allBills.filter(bill =>
        dateData.billsInvolved.includes(bill.identifier)
    );

    return {
        props: {
            dateData,
            onCalendarBills,
            committees: committees || [],
            isInvalidDate: false,
            dateStr: params.key
        }
    };
}