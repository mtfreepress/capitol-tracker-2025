import React from 'react';
import { css } from '@emotion/react';
import Link from 'next/link';

import { partyColors } from '../config/config';
import { lawmakerUrl } from '../config/utils';

const lawmakerInlineStyle = css`
  display: inline-block;
  margin-right: 0.5em;
  .name {
    padding: 3px 0.2em;
    height: 18px;
    display: inline-block;
  }
  .info {
    display: inline-block;
    font-size: 0.8em;
  }
  .info .party {
    color: white;
    padding: 0 0.5em;
  }
  .info .district {
    font-weight: bold; 
    color: #444;
    padding: 0 0.2em;
  }
`;

const LawmakerInline = ({ lawmaker }) => {
  const { name, party, district, locale } = lawmaker;
  const partyColor = partyColors(party);
  return (
    <div css={lawmakerInlineStyle}>
      <Link href={`/lawmakers/${lawmakerUrl(name)}`} passHref>
        <span className="name">{name} </span>
        <span className="info">
          <span className="party" style={{ backgroundColor: partyColor, border: `1px solid ${partyColor}` }}>
            {party}
          </span>
          <span className="district" style={{ border: `1px solid ${partyColor}` }}>
            {locale} / {district}
          </span>
        </span>
      </Link>
    </div>
  );
};

export default LawmakerInline;
