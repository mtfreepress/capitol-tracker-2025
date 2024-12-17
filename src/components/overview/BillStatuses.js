import React from 'react'
import { css } from '@emotion/react'

import { numberFormat } from '../../config/utils'

const containerCss = css`
    border: 1px solid red;
    /* background-color: #EAE3DA; */
    border: 1px solid #806F47;
    padding: 1em;
`
const rowCss = css`
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    justify-content: space-between;
    border-top: 1px solid #CEBC9F;
    padding: 0.75em 0.5em;

    :first-of-type {
        border-top: none;
    }
   
`
const subColCss = css`
    flex: 1 0 4em;
    margin-right: 0.5em;
`
const bigKeyNumCss = css`
    text-align: center;
    font-size: 1.8em;
    font-weight: bold;
    color: var(--tan5);
`
const keyNumCss = css`
    font-size: 1.5em;
    font-weight: bold;
    color: var(--tan5);
    text-align: center;
`
const numCss = css`
    font-size: 1.2em;
    font-weight: bold;
    text-align: right;
    color: #473D29;
`
const bigKeyLabelCss = css`
    font-style: italic;
    text-align: center;
`
const keyLabelCss = css`
    font-style:italic;
    text-align: center;
`
const labelCss = css`
    font-style: italic;
    text-align: right;
`

// TODO: Figure out if we are even using this? seems like the one usage is commented out in cap-track-23

const BillStatusOverview = ({ summary, mostRecentActionDate }) => {
    const { senateBills, houseBills, resolutions, referendumProposals, numBillsAndResolutions } = summary
    return <div css={containerCss}>
        <div css={rowCss}>
            <div css={subColCss}>
                <div css={bigKeyNumCss}>{numberFormat(numBillsAndResolutions)}</div>
                {/* Using total vs. introduced here b/c of LAWS status bug */}
                <div css={bigKeyLabelCss}>Measures introduced</div>
            </div>


        </div>

        <div css={rowCss}>
            <div css={subColCss}>
                <div css={keyNumCss}>{numberFormat(houseBills.total + senateBills.total)}</div>
                <div css={keyLabelCss}>Bills introduced</div>
            </div>

            <div css={subColCss}>
                <div css={keyNumCss}>{numberFormat(houseBills.passed + senateBills.passed)}</div>
                <div css={keyLabelCss}>Became law</div>
            </div>


        </div>

        <div css={rowCss}>
            <div css={subColCss}>
                <div css={keyNumCss}>{numberFormat(resolutions.introduced)}</div>
                <div css={keyLabelCss}>Resolutions introduced</div>
            </div>

            <div css={subColCss}>
                <div css={keyNumCss}>{numberFormat(resolutions.passed)}</div>
                <div css={keyLabelCss}>Passed</div>
            </div>
        </div>

        <div css={rowCss}>
            <div css={subColCss}>
                <div css={keyNumCss}>{numberFormat(referendumProposals.introduced)}</div>
                <div css={keyLabelCss}>Ballot measure proposals introduced</div>
            </div>

            <div css={subColCss}>
                <div css={keyNumCss}>{numberFormat(referendumProposals.passed)}</div>
                <div css={keyLabelCss}>Passed</div>
            </div>
        </div>


    </div >
}

export default BillStatusOverview