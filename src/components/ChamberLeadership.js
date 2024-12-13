import React from "react";
import Link from 'next/link';
import { css } from '@emotion/react';

const leadershipCss = css`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin: -0.5em;
`;

const leadershipItemCss = css`
  flex: 1 0 200px; /* Changed from flex-grow to flex for proper flex behavior */
  margin: 0.5em;
`;

const roleCss = css`
  font-weight: bold;
  color: #806f47;
`;

const nameCss = css`
  color: #444;
`;

const ChamberLeadership = ({ leadership }) => {
  return (
    <div>
      <div css={leadershipCss}>
        {leadership.map((d) => (
          <div key={d.key} css={leadershipItemCss}> {/* Changed key to d.key */}
            <div css={roleCss}>{d.role}</div>
            <div css={nameCss}>
              <Link href={`/lawmakers/${d.key}`}>
                {d.name}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChamberLeadership;
