import React, { useState, useEffect, useRef } from 'react';
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

const formatDateForLegMtUrl = (dateStr) => {
    // MM-DD-YYYY to YYYY-MM-DD for state site
    const [month, day, year] = dateStr.split('-');
    return `${year}-${month}-${day}`;
  };

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
    const [isSticky, setIsSticky] = useState(false);
    const [navHeight, setNavHeight] = useState(88);
    const headerRef = useRef(null);
    const observerRef = useRef(null);

    useEffect(() => {
        // calculate nav height for position of "sticky" header
        function updateNavHeight() {
            const navElement = document.querySelector('nav') ||
                document.querySelector('header nav') ||
                document.querySelector('[css*="navCss"]');

            if (navElement) {
                const isMobile = window.innerWidth <= 440;
                const navRect = navElement.getBoundingClientRect();

                const mobileHeight = navRect.height + 20;
                const desktopHeight = navRect.height + 5;

                setNavHeight(isMobile ? mobileHeight : desktopHeight);

                document.documentElement.style.setProperty('--nav-height-mobile', `${mobileHeight}px`);
                document.documentElement.style.setProperty('--nav-height-desktop', `${desktopHeight}px`);

                console.log('Nav measurements:', {
                    isMobile,
                    height: navRect.height,
                    mobileHeight,
                    desktopHeight
                });
            }
        }

        observerRef.current = new IntersectionObserver(
            ([entry]) => {
                setIsSticky(!entry.isIntersecting);
            },
            {
                rootMargin: `-${navHeight}px 0px 0px 0px`,
                threshold: 0
            }
        );

        if (headerRef.current) {
            observerRef.current.observe(headerRef.current);
        }

        updateNavHeight();
        window.addEventListener('resize', updateNavHeight);

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
            window.removeEventListener('resize', updateNavHeight);
        };
    }, [navHeight]);

    const initialHeaderStyle = css``;

    const headerStyle = css`
        display: flex;
        justify-content: center;
        
        h1 {
            color: white;
            background-color: var(--gray5);
            padding: 0.5em 0.5em;
            padding-right: 120px;
            border-radius: 4px;
            margin: 0 0 0.5em 0;
            display: flex;
            align-items: center;
            width: 100%;
            max-width: 768px;
            position: relative;
            
            &::before {
                content: "📅";
                margin-right: 0.5em;
            }
            
            .back-to-top {
                position: absolute;
                right: 10px;
                top: 50%;
                transform: translateY(-50%);
                background-color: transparent;
                color: var(--link);
                border: none;
                padding: 0.3em 0.8em;
                cursor: pointer;
                font-size: 0.8em;
                font-weight: normal;
                text-transform: none;
                letter-spacing: normal;
                
                /* Desktop-specific smaller size */
                @media (min-width: 768px) {
                    font-size: 0.7em;
                    padding: 0.25em 0.7em;
                }
                
               &:hover {
                    background-color: transparent;
                    text-decoration: underline;
                    color: var(--link);
                    border: none;
                }
            }
        }
    `;
    

    const stickyStyle = css`
        position: fixed;
        top: var(--nav-height-desktop, ${navHeight + 20}px);
        left: 0;
        right: 0;
        z-index: 1000;
        padding: 0;
        width: 100%;

        display: flex;
        justify-content: center;

        max-width: 800px;
        margin-left: auto;
        margin-right: auto;

        h1 {
            margin: 0;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            width: 100%;
            max-width: 768px;
        }

        @media (max-width: 440px) {
            top: var(--nav-height-mobile, ${navHeight + 65}px); 
            width: 97%
        }
    `;
    // For invalid dates (no legislative activity), show a custom message
    if (isInvalidDate || (!dateData) || (dateData?.hearings?.length === 0 && dateData?.floorDebates?.length === 0 && dateData?.finalVotes?.length === 0)) {
        // Return only the initial header for these states
        const formattedDate = dateStr ? (() => {
            const [month, day, year] = dateStr.split('-').map(Number);
            const requestedDate = new Date(year, month - 1, day);
            return requestedDate.toLocaleDateString('en-US', {
                month: 'long', day: 'numeric', year: 'numeric'
            });
        })() : "Loading...";




        return (
            <Layout
                relativePath={`/calendar/${dateStr || ''}`}
                pageTitle={`Legislative Calendar for ${formattedDate} | MTFP Capitol Tracker`}
                pageDescription={`Montana legislative calendar for ${formattedDate}`}
            >
                <div id="calendar-header" css={initialHeaderStyle}>
                    <h1>Calendar — {!dateData ? "Loading..." : "No Activity"}</h1>
                </div>

                {isInvalidDate || (dateData?.hearings?.length === 0 && dateData?.floorDebates?.length === 0 && dateData?.finalVotes?.length === 0) ? (
                    <>
                        <div css={css`
                          background: var(--gray1);
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
                    </>
                ) : null}
            </Layout>
        );
    }

    if (!dateData) {
        return (
            <Layout>
                <div css={calendarHeaderStyle}>
                    <h1>Loading...</h1>
                </div>
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

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    const handleAnchorClick = (e, targetId) => {
        e.preventDefault();

        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
            // Add offset for nav + header height + extra padding
            const offset = navHeight + 110;

            // Scroll to adjusted position
            window.scrollTo({
                top: targetPosition - offset,
                behavior: 'smooth'
            });

            // Update URL without triggering browser scroll
            window.history.pushState(null, '', `#${targetId}`);
        }
    };

    const getCommitteeChamber = (committeeName, committeesData) => {
        const match = committeesData.find(d => d.name === committeeName);
        return match?.chamber?.toLowerCase() || 'other';
    };


    return (
        <Layout
            relativePath={`/calendar/${dateData.key}`}
            pageTitle={`Legislative Calendar for ${day} | MTFP Capitol Tracker`}
            pageDescription={`Committee hearings and legislative activity for ${day}`}
        >

            <div
                ref={headerRef}
                id="header-observer"
                css={css`height: 1px; margin-bottom: -1px;`}
            />



            <div css={[headerStyle, isSticky && stickyStyle]}>
                {isSticky ? (
                    <h1>
                        {day}
                        <button
                            className="back-to-top"
                            onClick={scrollToTop}
                            aria-label="Back to top"
                        >
                            Back to top
                        </button>
                    </h1>
                ) : (
                    <h1>{day}</h1>
                )}
            </div>

            {isSticky && (
                <div css={css`
                    height: 60px;
                    margin-bottom: 0.5em;
                    
                    @media (max-width: 768px) {
                        height: 70px;
                    }
                `}></div>
            )}

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
            <div css={css`
                display: flex;
                justify-content: space-around;
                flex-wrap: wrap;
                max-width: 900px;
                margin: 0 auto;
            `}>
                {/* HOUSE SECTION */}
                <div css={css`margin: 0.5em 1em;`}>
                    <div css={css`font-weight: bold; margin-bottom: 0.5em;`}>🏠 House</div>
                    <div css={css`
                        display: flex;
                        align-items: center;
                        font-size: 1em;
                    `}>
                        {/* Hearings */}
                        <div css={css`
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                        `}>
                            <b css={css`color: #ce5a00; margin-bottom: 0.1em;`}> {/* Reduced margin */}
                                {dateData.hearings.filter(h => getCommitteeChamber(h.data.committee, committees) === 'house').length}
                            </b>
                            <a href="#house-hearings"
                                onClick={(e) => handleAnchorClick(e, 'house-hearings')}
                                css={css`
                                    text-decoration: none;
                                    &:hover { color: #ce5a00; }
                                `}>
                                Hearings
                            </a>
                        </div>
                        
                        {/* Bullet separator - centered */}
                        <span css={css`
                            margin: 0 0.8em;
                            color: #ce5a00;
                            align-self: center;
                            position: relative;
                            top: -0.1em; /* Slight adjustment to center with text */
                        `}>•</span>
                        
                        {/* Floor Debates */}
                        <div css={css`
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                        `}>
                            <b css={css`color: #ce5a00; margin-bottom: 0.1em;`}> {/* Reduced margin */}
                                {dateData.floorDebates?.filter(debate => debate.data.billHolder?.toLowerCase() === "house").length || 0}
                            </b>
                            <a href="#house-debates"
                                onClick={(e) => handleAnchorClick(e, 'house-debates')}
                                css={css`
                                    text-decoration: none;
                                    display: flex;
                                    flex-direction: column;
                                    line-height: 0.85; /* Further tightened line spacing */
                                    text-align: center;
                                    &:hover { color: #ce5a00; }
                                `}>
                                <span>Floor</span>
                                <span>Debates</span>
                            </a>
                        </div>
                        
                        {/* Bullet separator - centered */}
                        <span css={css`
                            margin: 0 0.8em;
                            color: #ce5a00;
                            align-self: center;
                            position: relative;
                            top: -0.1em; /* Slight adjustment to center with text */
                        `}>•</span>
                        
                        {/* Floor Votes */}
                        <div css={css`
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                        `}>
                            <b css={css`color: #ce5a00; margin-bottom: 0.1em;`}> {/* Reduced margin */}
                                {dateData.finalVotes?.filter(vote => vote.data.billHolder?.toLowerCase() === "house").length || 0}
                            </b>
                            <a href="#house-votes"
                                onClick={(e) => handleAnchorClick(e, 'house-votes')}
                                css={css`
                                    text-decoration: none;
                                    display: flex;
                                    flex-direction: column;
                                    line-height: 0.85; /* Further tightened line spacing */
                                    text-align: center;
                                    &:hover { color: #ce5a00; }
                                `}>
                                <span>Floor</span>
                                <span>Votes</span>
                            </a>
                        </div>
                    </div>
                </div>
                
                {/* SENATE SECTION - with the same spacing adjustments */}
                <div css={css`margin: 0.5em 1em;`}>
                    <div css={css`font-weight: bold; margin-bottom: 0.5em;`}>🏛 Senate</div>
                    <div css={css`
                        display: flex;
                        align-items: center;
                        font-size: 1em;
                    `}>
                        {/* Hearings */}
                        <div css={css`
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                        `}>
                            <b css={css`color: #ce5a00; margin-bottom: 0.1em;`}> {/* Reduced margin */}
                                {dateData.hearings.filter(h => getCommitteeChamber(h.data.committee, committees) === 'senate').length}
                            </b>
                            <a href="#senate-hearings"
                                onClick={(e) => handleAnchorClick(e, 'senate-hearings')}
                                css={css`
                                    text-decoration: none;
                                    &:hover { color: #ce5a00; }
                                `}>
                                Hearings
                            </a>
                        </div>
                        
                        {/* Bullet separator - centered */}
                        <span css={css`
                            margin: 0 0.8em;
                            color: #ce5a00;
                            align-self: center;
                            position: relative;
                            top: -0.1em; /* Slight adjustment to center with text */
                        `}>•</span>
                        
                        {/* Floor Debates */}
                        <div css={css`
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                        `}>
                            <b css={css`color: #ce5a00; margin-bottom: 0.04em;`}> {/* Reduced margin */}
                                {dateData.floorDebates?.filter(debate => debate.data.billHolder?.toLowerCase() === "senate").length || 0}
                            </b>
                            <a href="#senate-debates"
                                onClick={(e) => handleAnchorClick(e, 'senate-debates')}
                                css={css`
                                    text-decoration: none;
                                    display: flex;
                                    flex-direction: column;
                                    line-height: 0.85; /* Further tightened line spacing */
                                    text-align: center;
                                    &:hover { color: #ce5a00; }
                                `}>
                                <span>Floor</span>
                                <span>Debates</span>
                            </a>
                        </div>
                        
                        {/* Bullet separator - centered */}
                        <span css={css`
                            margin: 0 0.8em;
                            color: #ce5a00;
                            align-self: center;
                            position: relative;
                            top: -0.1em; /* Slight adjustment to center with text */
                        `}>•</span>
                        
                        {/* Floor Votes */}
                        <div css={css`
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                        `}>
                            <b css={css`color: #ce5a00; margin-bottom: 0.04em;`}>
                                {dateData.finalVotes?.filter(vote => vote.data.billHolder?.toLowerCase() === "senate").length || 0}
                            </b>
                            <a href="#senate-votes"
                                onClick={(e) => handleAnchorClick(e, 'senate-votes')}
                                css={css`
                                    text-decoration: none;
                                    display: flex;
                                    flex-direction: column;
                                    line-height: 0.85; /* Further tightened line spacing */
                                    text-align: center;
                                    &:hover { color: #ce5a00; }
                                `}>
                                <span>Floor</span>
                                <span>Votes</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    ) : (
        <span>No scheduled legislative activity</span>
    )}
</div>

            <CalendarNavigator
                dates={calendar.dates}
                currentPageDate={dateData.key}
            />

            <div css={css`
                text-align: center;
                margin: 1em 0 1.5em;
            `}>
                <a 
                    href={`https://www.legmt.gov/events/${formatDateForLegMtUrl(dateData.key)}/`}
                    target="_blank"
                    rel="noopener noreferrer"
                    css={css`
                        display: inline-flex;
                        align-items: center;
                        background-color: var(--gray1);
                        color: var(--link);
                        padding: 0.5em 1em;
                        border-radius: 4px;
                        text-decoration: none;
                        font-weight: 500;
                        transition: all 0.2s ease;
                        
                        &:hover {
                            background-color: var(--gray2);
                            text-decoration: none; /* Remove default underline */
                        }
                        
                        &::before {
                            content: "🔗";
                            margin-right: 0.5em;
                        }
                    `}
                >
                    <span css={css`
                        &:hover {
                            text-decoration: underline;
                        }
                    `}>Official Legislature Calendar</span>
                </a>
            </div>
            <section id="house" css={css`margin-bottom: 3em;`}>
                <h2 css={css`
                border-bottom: 2px solid var(--gray3);
                padding-bottom: 0.5em;
                margin-bottom: 1em;
            `}>🏠 House</h2>

                {/* House Hearings */}
                <section id="house-hearings">
                    <h3>Committee Hearings</h3>
                    <div className="note">
                        Bill hearings allow the sponsor to explain a bill and enable public testimony.
                    </div>
                    {dateData.hearings.filter(h => getCommitteeChamber(h.data.committee, committees) === 'house').length === 0 ? (
                        <p>No House committee hearings scheduled for this date.</p>
                    ) : (
                        // Filter committees by House chamber
                        Object.entries({
                            amPolicyCommittees: committeesWithHearings
                                .filter(d => d.cat === "morning-policy" && getCommitteeChamber(d.name, committees) === 'house'),
                            pmPolicyCommittees: committeesWithHearings
                                .filter(d => d.cat === "afternoon-policy" && getCommitteeChamber(d.name, committees) === 'house'),
                            appropsCommittees: committeesWithHearings
                                .filter(d => ["morning-fiscal-sub", "varies-fiscal"].includes(d.cat) &&
                                    getCommitteeChamber(d.name, committees) === 'house'),
                            otherCommittees: committeesWithHearings
                                .filter(d => !["morning-policy", "afternoon-policy", "morning-fiscal-sub", "varies-fiscal"].includes(d.cat) &&
                                    getCommitteeChamber(d.name, committees) === 'house')
                        }).map(([key, categoryCommittees]) => {
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

                {/* House Floor Debates */}
                <section id="house-debates">
                    <h3>Floor Debates</h3>
                    {!dateData.floorDebates?.some(debate => debate.data.billHolder?.toLowerCase() === "house") ? (
                        <p>No House floor debates scheduled for this date.</p>
                    ) : (
                        <>
                            <div className="note">
                                Debates are followed by Second Reading votes.
                            </div>
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
                        </>
                    )}
                </section>

                {/* House Final Votes */}
                <section id="house-votes">
                    <h3>Final Votes</h3>
                    {!dateData.finalVotes?.some(vote => vote.data.billHolder?.toLowerCase() === "house") ? (
                        <p>No House final votes scheduled for this date.</p>
                    ) : (
                        <>
                            <div className="note">
                                Final votes determine if a bill advances to the next chamber or to the governor.
                            </div>
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
                        </>
                    )}
                </section>
            </section>

            {/* SENATE SECTION */}
            <section id="senate" css={css`margin-bottom: 3em;`}>
                <h2 css={css`
                border-bottom: 2px solid var(--gray3);
                padding-bottom: 0.5em;
                margin-bottom: 1em;
            `}>🏛 Senate</h2>

                {/* Senate Hearings */}
                <section id="senate-hearings">
                    <h3>Committee Hearings</h3>
                    <div className="note">
                        Bill hearings allow the sponsor to explain a bill and enable public testimony.
                    </div>
                    {dateData.hearings.filter(h => getCommitteeChamber(h.data.committee, committees) === 'senate').length === 0 ? (
                        <p>No Senate committee hearings scheduled for this date.</p>
                    ) : (
                        // Filter committees by Senate chamber
                        Object.entries({
                            amPolicyCommittees: committeesWithHearings
                                .filter(d => d.cat === "morning-policy" && getCommitteeChamber(d.name, committees) === 'senate'),
                            pmPolicyCommittees: committeesWithHearings
                                .filter(d => d.cat === "afternoon-policy" && getCommitteeChamber(d.name, committees) === 'senate'),
                            appropsCommittees: committeesWithHearings
                                .filter(d => ["morning-fiscal-sub", "varies-fiscal"].includes(d.cat) &&
                                    getCommitteeChamber(d.name, committees) === 'senate'),
                            otherCommittees: committeesWithHearings
                                .filter(d => !["morning-policy", "afternoon-policy", "morning-fiscal-sub", "varies-fiscal"].includes(d.cat) &&
                                    getCommitteeChamber(d.name, committees) === 'senate')
                        }).map(([key, categoryCommittees]) => {
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

                {/* Senate Floor Debates */}
                <section id="senate-debates">
                    <h3>Floor Debates</h3>
                    {!dateData.floorDebates?.some(debate => debate.data.billHolder?.toLowerCase() === "senate") ? (
                        <p>No Senate floor debates scheduled for this date.</p>
                    ) : (
                        <>
                            <div className="note">
                                Debates are followed by Second Reading votes.
                            </div>
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
                        </>
                    )}
                </section>

                {/* Senate Final Votes */}
                <section id="senate-votes">
                    <h3>Final Votes</h3>
                    {!dateData.finalVotes?.some(vote => vote.data.billHolder?.toLowerCase() === "senate") ? (
                        <p>No Senate final votes scheduled for this date.</p>
                    ) : (
                        <>
                            <div className="note">
                                Final votes determine if a bill advances to the next chamber or to the governor.
                            </div>
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
                        </>
                    )}
                </section>
            </section>

            {/* OTHER SECTION (for items without a clear chamber) */}
            {(dateData.hearings.some(h => getCommitteeChamber(h.data.committee, committees) === 'other') ||
                dateData.floorDebates.some(d => !d.data.billHolder ||
                    (d.data.billHolder.toLowerCase() !== "house" && d.data.billHolder.toLowerCase() !== "senate")) ||
                dateData.finalVotes.some(v => !v.data.billHolder ||
                    (v.data.billHolder.toLowerCase() !== "house" && v.data.billHolder.toLowerCase() !== "senate"))) && (
                    <section id="other" css={css`margin-bottom: 3em;`}>
                        <h2 css={css`
                    border-bottom: 2px solid var(--gray3);
                    padding-bottom: 0.5em;
                    margin-bottom: 1em;
                `}>Other Events</h2>

                        {/* Other hearings */}
                        {dateData.hearings.some(h => getCommitteeChamber(h.data.committee, committees) === 'other') && (
                            <section id="other-hearings">
                                <h3>Committee Hearings</h3>
                                {/* Similar structure to the committees above, but for 'other' chamber */}
                            </section>
                        )}

                        {/* Other floor debates */}
                        {dateData.floorDebates.some(d => !d.data.billHolder ||
                            (d.data.billHolder.toLowerCase() !== "house" && d.data.billHolder.toLowerCase() !== "senate")) && (
                                <section id="other-debates">
                                    <h3>Floor Debates</h3>
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
                                </section>
                            )}

                        {/* Other final votes */}
                        {dateData.finalVotes.some(v => !v.data.billHolder ||
                            (v.data.billHolder.toLowerCase() !== "house" && v.data.billHolder.toLowerCase() !== "senate")) && (
                                <section id="other-votes">
                                    <h3>Final Votes</h3>
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
                                </section>
                            )}
                    </section>
                )}
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