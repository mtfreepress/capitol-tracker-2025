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


    const headerStyle = css`
        display: flex;
        justify-content: center;
        
        h1 {
            color: white;
            background-color: var(--gray5);
            padding: 0.5em 0.5em;
            padding-right: 120px;  /* Make space for the button */
            border-radius: 4px;
            margin: 0 0 0.5em 0;
            display: flex;
            align-items: center;
            width: 100%;
            max-width: 768px;
            position: relative;  /* To position the button absolutely inside */
            
            &::before {
                content: "📅";
                margin-right: 0.5em;
            }
            
            .back-to-top {
                position: absolute;
                right: 10px;
                top: 50%;
                transform: translateY(-50%);
                background-color: var(--link);
                color: white;
                border: none;
                padding: 0.3em 0.8em;
                border-radius: 4px;
                cursor: pointer;
                font-size: 0.8em;
                font-weight: normal;
                text-transform: none;
                letter-spacing: normal;
                
                /* Desktop-specific smaller size */
                @media (min-width: 768px) {
                    font-size: 0.7em; /* 20% smaller font */
                    padding: 0.25em 0.7em; /* Smaller padding */
                }
                
                &:hover {
                    background-color: var(--link);
                    text-decoration: underline;
                    color: white;
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
                        <span css={css`color: var(--text);`}>
                            <a href="#hearings" 
                                onClick={(e) => handleAnchorClick(e, 'hearings')}
                                css={css`
                                    text-decoration: none;
                                    &:hover { color: #ce5a00; }
                                `}
                            >
                                <b>{dateData.hearings.length}</b> {dateData.hearings.length === 1 ? 'hearing' : 'hearings'}
                            </a>{' '}
                            <span css={css`color: #ce5a00;`}>•</span>{' '}
                            <a href="#debates" 
                                onClick={(e) => handleAnchorClick(e, 'debates')}
                                css={css`
                                    text-decoration: none;
                                    &:hover { color: #ce5a00; }
                                `}>
                                <b>{dateData.floorDebates.length}</b> floor {dateData.floorDebates.length === 1 ? 'debate' : 'debates'}
                            </a>{' '}
                            <span css={css`color: #ce5a00;`}>•</span>{' '}
                            <a href="#votes" 
                            onClick={(e) => handleAnchorClick(e, 'votes')}
                                css={css`
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

            <section id="hearings">
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


            <section id="debates">
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

            <section id="votes">
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