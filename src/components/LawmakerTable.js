import React, { useState } from 'react';
import { css } from '@emotion/react';
import Link from 'next/link';

import { partyColors } from '../config/config';
import { lawmakerUrl } from '../config/utils';
// import { tableStyle } from '../config/styles.js';

const lawmakerTableCss = css`
    max-width: 95vw;
`;
const tableLinkStyle = css`
    font-weight: bold;
`;
// const colorGopCss = css`
//     color: ${partyColors('R')};
//     font-weight: bold;
// `;
// const colorDemCss = css`
//     color: ${partyColors('D')};
//     font-weight: bold;
// `;

const partyControlCss = party => css`
    background-color: ${partyColors(party)};
    font-weight: bold;
    color: #fff;
`;
const col1 = css`
    min-width: 3em;
    text-align: center;
    padding: 0.5em 0.2em !important;
`;
const col2 = css`
    min-width: 11.5em;
    @media screen and (max-width: 468px) {
        min-width: 8em;
    }
`;
// const col3 = css`
//     min-width: 4.5em;
//     padding: 0.5em 0 !important;
//     text-align: right;
// `;
// const col4 = css`
//     min-width: 6.5em;
//     text-align: right;
// `;

const clickableCol = css`
    cursor: pointer;
    :hover {
        color: var(--link);
    }
    :before {
        font-style: normal;
        content: '⇅';
    }
`;
const activeCol = css`
    cursor: pointer;
    color: var(--link);
`;
const sortNotReversed = css`
    :before {
        font-style: normal;
        content: '↑';
    }
`;
const sortReversed = css`
    :before {
        font-style: normal;
        content: '↓';
    }
`;

const sortFunctions = {
    district: (a, b) => +a.district.substring(2,) - +b.district.substring(2,),
    name: (a, b) => a.name.localeCompare(b.name),
    fractionVotesOnWinningSide: (a, b) => a.votingSummary.fractionVotesOnWinningSide - b.votingSummary.fractionVotesOnWinningSide,
    fractionVotesWithGopCaucus: (a, b) => a.votingSummary.fractionVotesWithGopCaucus - b.votingSummary.fractionVotesWithGopCaucus,
    fractionVotesWithDemCaucus: (a, b) => a.votingSummary.fractionVotesWithDemCaucus - b.votingSummary.fractionVotesWithDemCaucus,
};

const LawmakerTable = ({ lawmakers }) => {
    const [sortFunctionKey, setSortFunctionKey] = useState('district');
    const [isSortReversed, setIsSortReversed] = useState(false);

    const handleColClick = (key) => {
        if (key !== sortFunctionKey) setSortFunctionKey(key);
        else setIsSortReversed(!isSortReversed);
    };
    const getInteractionStyle = (colKey) => {
        if (colKey === sortFunctionKey) {
            if (!isSortReversed) return [activeCol, sortNotReversed];
            if (isSortReversed) return [activeCol, sortReversed];
        }
        return [clickableCol];
    };

    const rowSort = isSortReversed ?
        (a, b) => sortFunctions[sortFunctionKey](b, a) // reverse sort direction
        : sortFunctions[sortFunctionKey];
    const rows = lawmakers
        .sort(rowSort)
        .map(lawmaker => <Row key={lawmaker.key} {...lawmaker} />);
    return (
        <div>
             <table css={lawmakerTableCss} className="table">
                <thead>
                    <tr>
                        <th css={[col1, ...getInteractionStyle('district')]} onClick={() => handleColClick('district')}>Dist.</th>
                        <th css={col2}>Lawmaker</th>
                        {/* 
                        <th css={[col3, ...getInteractionStyle('votesInMajority')]} onClick={() => handleColClick('fractionVotesOnWinningSide')}>Votes in majority</th>
                        <th css={col4}>
                            <div css={[...getInteractionStyle('votesWithGopMajority')]} onClick={() => handleColClick('fractionVotesWithGopCaucus')}> w / most Rs</div>
                            <div css={[...getInteractionStyle('votesWithDemMajority')]} onClick={() => handleColClick('fractionVotesWithDemCaucus')}> w / most Ds</div>
                        </th> 
                        */}
                    </tr>
                </thead>
                <tbody>{rows}</tbody>
            </table>
        </div>
    );
};

const Row = ({ name, party, district, locale, votingSummary }) => {
    return (
        <tr>
            <td css={[col1, partyControlCss(party)]}>
                <div>{district.slice(0, 2)}</div>
                <div>{district.slice(3,)}</div>
            </td>
            <td css={[col2]}>
                <div css={tableLinkStyle}>
                    <Link href={`/lawmakers/${lawmakerUrl(name)}`}>{name}</Link>
                </div>
                <div>{party}-{locale}</div>
            </td>
            {/* 
            <td css={col3}>
                {percentFormat(fractionVotesOnWinningSide)}
            </td>
            <td css={col4}>
                <div>
                    <span css={colorGopCss}>{percentFormat(fractionVotesWithGopCaucus)}</span> w/ Rs
                </div>
                <div>
                    <span css={colorDemCss}>{percentFormat(fractionVotesWithDemCaucus)}</span> w/ Ds
                </div>
            </td> 
            */}
        </tr>
    );
};

export default LawmakerTable;
