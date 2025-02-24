import React from "react";
import Link from "next/link";
import { useRouter } from 'next/router';
import { css } from "@emotion/react";
import Layout from "../../design/Layout";
import BillTable from "../../components/BillTable";
import { shortDateWithWeekday } from "../../config/utils";
import calendar from "../../data/calendar.json";
import allBills from "../../data/bills.json";
import committees from "../../data/committees.json";

const dateSelectStyle = css`
  margin: 1em 0;
  padding: 1em;
  background: var(--gray1);
  border-radius: 4px;

  select {
    padding: 0.5em;
    font-size: 1em;
    margin: 0 0.5em;
  }
`;

const DateSelector = ({ dates, currentKey }) => {
    const router = useRouter();

    const handleDateChange = (event) => {
        const selectedDate = event.target.value;
        if (selectedDate) {
            router.push(`/calendar/${selectedDate}`);
        }
    };

    return (
        <div css={dateSelectStyle}>
            <label>
                View schedule for: {" "}
                <select
                    onChange={handleDateChange}
                    value={currentKey}
                >
                    {dates.map(date => (
                        <option
                            key={date.key}
                            value={date.key}
                        >
                            {shortDateWithWeekday(new Date(date.date))}
                        </option>
                    ))}
                </select>
            </label>
        </div>
    );
};

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

export default function CalendarDay({ dateData, onCalendarBills, committees }) {
    const day = shortDateWithWeekday(new Date(dateData.date));
    const hearingsByCommittee = groupHearingsByCommittee(dateData.hearings);

    // Group committees by type
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
            <h1>Legislative Calendar for {day}</h1>

            <DateSelector
                dates={calendar.dates}
                currentKey={dateData.key}
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

                            // console.log('Debug bill data:', {
                            //     floorDebates: dateData.floorDebates.map(d => d.data.bill),
                            //     finalVotes: dateData.finalVotes.map(d => d.data.bill),
                            //     sampleBill: onCalendarBills[0]?.data?.bill
                            // });

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
                        <BillTable
                            bills={onCalendarBills.filter(bill =>
                                dateData.floorDebates
                                    .map(d => d.data.bill)
                                    .includes(bill.identifier)
                            )}
                            displayLimit={10}
                            suppressCount={true}
                        />
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
                        <BillTable
                            bills={onCalendarBills.filter(bill =>
                                dateData.finalVotes
                                    .map(d => d.data.bill)
                                    .includes(bill.identifier)
                            )}
                            displayLimit={10}
                            suppressCount={true}
                        />
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
            notFound: true
        };
    }

    const onCalendarBills = allBills.filter(bill => 
        dateData.billsInvolved.includes(bill.identifier)
    );

    return {
        props: {
            dateData,
            onCalendarBills,
            committees: committees || []
        }
    };
}
