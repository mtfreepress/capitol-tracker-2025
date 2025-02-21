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

export default function CalendarDay({ dateData, committees }) {
    console.log({dateData})
    const day = shortDateWithWeekday(new Date(dateData.date));
    const hearingsByCommittee = groupHearingsByCommittee(dateData.hearings);

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
                    Object.entries(hearingsByCommittee).map(([committee, hearings]) => (
                        <div key={committee}>
                            <h4>{committee}</h4>
                            {hearings.map(hearing => (
                                console.log(hearing),
                                <div key={hearing.data.id}>
                                    <strong>Bill:</strong> {hearing.data.bill}
                                    <br />
                                    <strong>Description:</strong> {hearing.data.description}
                                </div>
                            ))}
                        </div>
                    ))
                )}
            </section>

            <section>
                <h3>Floor Debates</h3>
                {dateData.floorDebates.length === 0 ? (
                    <p>No floor debates scheduled for this date.</p>
                ) : (
                    dateData.floorDebates.map(debate => (
                        <div key={debate.data.id}>
                            <h4>{debate.data.bill}</h4>
                            <div>
                                <strong>Chamber:</strong> {capitalizeFirstLetter(debate.data.billHolder)}
                                <br />
                                <strong>Description:</strong> {debate.data.description}
                            </div>
                        </div>
                    ))
                )}
            </section>

            <section>
                <h3>Final Votes</h3>
                {dateData.finalVotes.length === 0 ? (
                    <p>No final votes scheduled for this date.</p>
                ) : (
                    dateData.finalVotes.map(vote => (
                        <div key={vote.data.id}>
                            <h4>{vote.data.bill}</h4>
                            <div>
                                <strong>Chamber:</strong> {capitalizeFirstLetter(vote.data.billHolder)}
                                <br />
                                <strong>Description:</strong> {vote.data.description}
                            </div>
                        </div>
                    ))
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

    // Debug logging
    console.log('Processing date:', params.key, {
        billsInvolved: dateData.billsInvolved,
        sampleBill: dateData.billsInvolved[0]
    });

    const onCalendarBills = allBills.filter(bill => 
        dateData.billsInvolved.includes(bill.identifier)
    );

    return {
        props: {
            dateData,
            onCalendarBills
        }
    };
}