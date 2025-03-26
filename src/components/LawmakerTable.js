import React, { useState } from 'react';
import { css } from '@emotion/react';
import Link from 'next/link';

import { partyColors } from '../config/config';
import { lawmakerUrl } from '../config/utils';
import { fetchPortraitImage } from '@/lib/lawmaker';

const lawmakerTableCss = css`
    max-width: 95vw;
`;
const tableLinkStyle = css`
    font-weight: bold;
`;

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
        .map(lawmaker => <Row key={lawmaker.key} lawmakers={lawmakers} {...lawmaker} />);

    return (
        <div>
            <table css={lawmakerTableCss} className="table">
                <thead>
                    <tr>
                        <th css={[col1, ...getInteractionStyle('district')]} onClick={() => handleColClick('district')}>Dist.</th>
                        <th css={col2}>Lawmaker</th>
                    </tr>
                </thead>
                <tbody>{rows}</tbody>
            </table>
        </div>
    );
};

const Row = ({ name, party, district, locale, portrait, lawmakers }) => {
    const lawmakerData = lawmakers.find(lawmaker => lawmaker.name === name);

    const imageSlug = lawmakerData.imageSlug; 
    const imageUrl = imageSlug ? fetchPortraitImage(imageSlug) : null; 

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
            <td>
                {imageUrl && (
                    <Link href={`/lawmakers/${lawmakerUrl(name)}`}>
                        <div css={{ width: '80px', height: '80px', overflow: 'hidden', position: 'relative' }}>
                            <img src={imageUrl} alt={`Portrait of ${name}`} css={{ width: '100%', height: 'auto', position: 'absolute', top: '0' }} />
                        </div>
                    </Link>
                )}
            </td>
        </tr>
    );
};

export default LawmakerTable;

