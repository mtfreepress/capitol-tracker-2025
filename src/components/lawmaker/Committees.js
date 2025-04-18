import React from 'react';
import { css } from '@emotion/react';
import Link from 'next/link';
import { committeeUrl } from '../../lib/utils';

const lawmakerCommitteesStyle = css`
  display: flex;
  flex-wrap: wrap;
  margin: -0.25em;

  .committee {
    border: 1px solid var(--tan5);
    border-left: 3px solid var(--tan5);
    background: var(--tan1);
    padding: 0.2em 0.5em;
    margin: 0.25em;
  }
`;

const LawmakerCommittees = ({ committees }) => {
  return (
    <div css={lawmakerCommitteesStyle}>
      {committees.map(c => (
        <div key={c.key} className="committee">
          <strong>{c.displayName}</strong>
          {/* <Link href={`/committees/${committeeUrl(c.key)}`}>
            <strong>{c.displayName}</strong>
          </Link> */}
          {c.role !== 'Member' ? ` - ${c.role} ${c.role === 'Chair' ? '🪑' : ''}` : null}
        </div>
      ))}
    </div>
  );
};

export default LawmakerCommittees;
