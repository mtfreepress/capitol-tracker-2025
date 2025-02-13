import React from "react";
import Link from "next/link";
import { css } from "@emotion/react";
import Layout from "../design/Layout";
import ContactUs from "../components/ContactUs";
import NewsletterSignup from "../components/NewsletterSignup";
import BillTable from "../components/BillTable";
import { shortDateWithWeekday, committeeUrl, capitalize } from "../config/utils";
import calendar from "../data/calendar.json";
import allBills from "../data/bills.json"
import committees from "../data/committees.json"

// Styles
const scheduleDayStyle = css`
  h2 {
    color: white;
    background-color: var(--gray5);
    padding: 0.5em 0.5em;
    position: sticky;
    top: 130px;
    z-index: 10;
  }
`;

// Utility functions
const getDay = (d) => shortDateWithWeekday(new Date(d));
const urlizeDay = (day) => day.replaceAll(",", "").replaceAll(" ", "-");

// Calendar Component
const Calendar = ({ onCalendarBills, committees }) => {
    const { scheduledHearings, datesOnCalendar } = calendar;
    console.log({onCalendarBills})
    console.log({datesOnCalendar})
    // map dates into readable format
    const days = datesOnCalendar.map((d) => getDay(d));
    console.log({days})

    const schedule = days.map((day, i) => {
        const hearings = scheduledHearings.filter((d) => getDay(d.data.date) === day);

        // group committee data by their hearing times
        const committeesWithHearings = Array.from(new Set(hearings.map((a) => a.data.committee))).map(
            (name) => {
                const match = committees.find((d) => d.name === name) || {};
            
                if (!match.key) console.log("No committee match", name); // log unmatched committees
                return {
                    name,
                    key: match.key || null,
                    cat: match.time && match.type ? `${match.time}-${match.type}` : null,
                };
            }
        );
        // console.log({committeesWithHearings})
        // sort committees into categories
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
        // console.log({categories})

        return (
            <div key={day} id={urlizeDay(day)} css={scheduleDayStyle}>
                <hr />
                <h2>📅 {day}</h2>

                {/* Uncomment this section if floor debates are ready to be included */}
                {/* {(floorDebates.length > 0) && <>
          <h3>Floor debates</h3>
          <div className="note">Debates are followed by Second Reading votes.</div>
        </>} */}

                {/* display committee hearings */}
                {hearings.length > 0 && (
                    <>

                {/* TODO: Fix committees and renable this */}
                        <h3>Committee Hearings</h3>
                        <div className="note">
                            Bill hearings allow the sponsor to explain a bill and enable public testimony.
                        </div>

                        {/* iterate over committee categories */}
                        {Object.entries(categories).map(([key, committees]) => {
                            if (committees.length > 0) {
                                const title = {
                                    //  TODO: Revert this once committees is fixed
                                    amPolicyCommittees: "Morning Policy Committees",
                                    pmPolicyCommittees: "Afternoon Policy Committees",
                                    appropsCommittees: "Budget Committees",
                                    otherCommittees: "Other Committees",
                                    amPolicyCommittees: "",
                                    pmPolicyCommittees: "",
                                    appropsCommittees: "",
                                    otherCommittees: "",
                                }[key];
                                return (
                                    <div key={key}>
                                        <h4>{title.toUpperCase()}</h4>
                                        {committees.map((committee) => (
                                            <Committee
                                                key={`${day}-${committee.name}`}
                                                committee={committee}
                                                hearings={hearings}
                                                onCalendarBills={onCalendarBills}
                                            />
                                        ))}
                                    </div>
                                );
                            }
                            return null;
                        })}
                    </>
                )}

                {/* Add newsletter signup after the first calendar day */}
                {i === 0 && <NewsletterSignup />}
            </div>
        );
    });

    return (
        <Layout
            relativePath='/calendar'
            pageTitle={"Calendar | 2025 MTFP Capitol Tracker"}
            pageDescription={"The lawmakers, bills and votes making Montana's laws at the 2025 Legislature."}
            socialTitle={"Calendar | 2025 MTFP Capitol Tracker"}
            socialDescription={"The lawmakers, bills and votes making Montana's laws at the 2025 Legislature."}
        >
            <h1>What&apos;s Coming Up at the Legislature</h1>

            {/* Navigation for days */}
            <div>
                {days.map((day, i) => (
                    <span key={day}>
                        {i !== 0 ? " • " : ""}
                        <a href={`#${urlizeDay(day)}`}>{day}</a>
                    </span>
                ))}
            </div>

            <p>
                This listing includes only committee bill hearings. Official calendars listing floor
                debates are available{" "}
                <a
                    href="http://laws.leg.mt.gov/legprd/laws_agendas.agendarpt?chamber=H&P_SESS=20231"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    here for the House
                </a>{" "}
                and{" "}
                <a
                    href="http://laws.leg.mt.gov/legprd/laws_agendas.agendarpt?chamber=S&P_SESS=20231"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    here for the Senate
                </a>
                .
            </p>

            {/* Render the schedule */}
            {schedule}

            <ContactUs />
        </Layout>
    );
};

// Committee component renders a single committee and its hearings
const Committee = ({ committee, onCalendarBills, hearings }) => {
    const committeeHearingBills = hearings.filter((d) => d.committee === committee.name).map((d) => d.bill);
    const bills = onCalendarBills.filter((d) => committeeHearingBills.includes(d.identifier));

    return (
        <div>
            <h4>
                👥 <Link href={`/committees/${committee.key}`}>{committee.name}</Link>
            </h4>
            {/* display bill table */}
            <BillTable bills={bills} displayLimit={10} suppressCount={true} />
        </div>
    );
};

// Data Fetching: Fetch data required for the calendar
export async function getStaticProps() {
    // filter all bills to only include those marked as "on calendar"
    const onCalendarBills = allBills.filter((bill) => bill.isOnCalendar);
  
    // committees are directly imported, so we don't need to re-fetch or require them
    return {
      props: {
        onCalendarBills, // these are the filtered bills for display
        committees,      // using the imported committees JSON directly
      },
    };
  }

export default Calendar;