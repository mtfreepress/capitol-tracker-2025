import React from 'react';
import { css } from '@emotion/react';
import Link from 'next/link';
import { shortDateWithWeekday, billUrl } from '../lib/utils';

import Layout from '../design/Layout';
import ContactUs from '../components/ContactUs';
import NewsletterSignup from '../components/NewsletterSignup';

import recap from '../data/recap.json';

const actionsDayStyle = css`
  h2 {
    color: white;
    background-color: var(--gray5);
    padding: 0.5em 0.5em;
    position: sticky;
    top: 130px;
    z-index: 10;
  }
`;

const cleanDescription = text => text.replace('Committee Executive Action--', 'Committee Action: ');

const Actions = () => {
  const { actionsByDate } = recap;

  const actions = actionsByDate.map((day, i) => {
    const committeesWithActions = Array.from(new Set(day.actions.map(a => a.committee)));
    if (committeesWithActions.length === 0) return null;

    const displayCommittees = committeesWithActions.filter(d => d !== null).sort((a, b) => a - b);
    const nonCommitteeActions = day.actions.filter(d => d.committee === null);
    const governorActions = nonCommitteeActions.filter(d => d.posession === 'governor');
    const houseActions = nonCommitteeActions.filter(d => d.posession === 'house');
    const senateActions = nonCommitteeActions.filter(d => d.posession === 'senate');

    const governorActionTypes = Array.from(new Set(governorActions.map(d => d.description))).sort();
    const houseActionTypes = Array.from(new Set(houseActions.map(d => d.description))).sort();
    const senateActionTypes = Array.from(new Set(senateActions.map(d => d.description))).sort();

    return (
      <div css={actionsDayStyle} key={day.date}>
        <h2>📅 {shortDateWithWeekday(new Date(day.date))}</h2>
        <div>
          {governorActionTypes.length > 0 && (
            <div>
              <h3>🖋️ GOVERNOR</h3>
              {governorActionTypes.map(description => {
                const actionsOfType = governorActions.filter(d => d.description === description);
                return (
                  <div key={`governor-${description}`}>
                    <h4>{description} ({actionsOfType.length})</h4>
                    <ul>{actionsOfType.map(action => <Action key={action.id} data={action} />)}</ul>
                  </div>
                );
              })}
            </div>
          )}

          {houseActionTypes.length > 0 && (
            <div>
              <h3>🏛️ HOUSE</h3>
              {houseActionTypes.map(description => {
                const actionsOfType = houseActions.filter(d => d.description === description);
                return (
                  <div key={`house-${description}`}>
                    <h4>{description} ({actionsOfType.length})</h4>
                    <ul>{actionsOfType.map(action => <Action key={action.id} data={action} />)}</ul>
                  </div>
                );
              })}
            </div>
          )}

          {senateActionTypes.length > 0 && (
            <div>
              <h3>🏛️ SENATE</h3>
              {senateActionTypes.map(description => {
                const actionsOfType = senateActions.filter(d => d.description === description);
                return (
                  <div key={`senate-${description}`}>
                    <h4>{description} ({actionsOfType.length})</h4>
                    <ul>{actionsOfType.map(action => <Action key={action.id} data={action} />)}</ul>
                  </div>
                );
              })}
            </div>
          )}

          {displayCommittees.map(committee => {
            const committeeActions = day.actions.filter(d => d.committee === committee);
            const committeeActionTypes = Array.from(new Set(committeeActions.map(d => d.description))).sort();

            return (
              <div key={committee}>
                <h3>👥 {committee}</h3>
                {committeeActionTypes.map(description => {
                  const actionsOfType = committeeActions.filter(d => d.description === description);
                  return (
                    <div key={`${committee}-${description}`}>
                      <h4>{cleanDescription(description)} ({actionsOfType.length})</h4>
                      <ul>{actionsOfType.map(action => <Action key={action.id} data={action} />)}</ul>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
        {i === 0 && <NewsletterSignup />}
      </div>
    );
  });

  return (
    <Layout
      relativePath='/recap'
      pageTitle={"What's happened | 2025 MTFP Capitol Tracker"}
      pageDescription={"The lawmakers, bills and votes making Montana's laws at the 2025 Legislature."}
      socialTitle={"What's happened | 2025 MTFP Capitol Tracker"}
      socialDescription={"The lawmakers, bills and votes making Montana's laws at the 2025 Legislature."}
    >
      <h1>What lawmakers have done so far</h1>
      <p>Procedural action on bills under consideration by the 2023 Legislature.</p>

      {actions}

      <ContactUs />
    </Layout>
  );
};

export default Actions;

const Action = ({ data }) => {
  const { bill, title, explanation } = data;
  const url = billUrl(bill);

  return (
    <li>
      <div>
        📋 <Link href={`/bills/${url}`}><strong>{bill}</strong>: {title}</Link>
      </div>
      <div className="note">{explanation}</div>
    </li>
  );
};
