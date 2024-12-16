import React from 'react'
import { css } from '@emotion/react'

import { scaleLinear } from 'd3-scale'

import {
    numberFormat,
    percentFormat,
    capitalize
} from '../../config/utils'
import { partyColors } from '../../config/config'

const sectionCss = css`
    background-color: #eae3da;
    padding: 0.5em;
    border: 1px solid #806f47;

    h4 {
        margin-top: 0.2em;
        margin-bottom: 0.2em;
    }
`

const electionContainerCss = css`
    margin-bottom: 0.5em;
`
const containerCss = css`
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
`

const LawmakerElectionHistory = ({ lawmaker }) => {
    const {
        party,
        chamber,
        districtElexHistory
    } = lawmaker

    const { last_election, replacementNote } = districtElexHistory
    const govGenElex = districtElexHistory.gen_elex.gov
    const legGenElex = districtElexHistory.gen_elex.leg
    const legPriElex = districtElexHistory.pri_elex.leg.filter(d => d.party === party)

    return <div css={sectionCss}>
        <div className="note">Last in-cycle for {capitalize(chamber)} election in {last_election}. House seats are elected every two years, Senate seats every four.</div>
        {
            replacementNote && <div>{replacementNote}</div>
        }
        <div css={containerCss}>
            <div>
                <h4>General election vote, {last_election}</h4>
                <Election candidates={legGenElex} />
            </div>
            <div>
                <h4>Party primary vote, {last_election}</h4>
                <Election candidates={legPriElex} />
            </div>
            <div>
                <h4>Governor vote in district, 2020</h4>
                <Election candidates={govGenElex} />
            </div>
        </div>

    </div>
}

export default LawmakerElectionHistory

const candidateLabelsCss = css`
    font-size: 0.8em;
`

const Election = ({ candidates }) => {
    const totalVotes = candidates.reduce((acc, obj) => acc + obj.votes, 0)
    const xScale = scaleLinear().range([0, 240]).domain([0, totalVotes])
    let x = 1
    const opponents = candidates.map((candidate, i) => {
        const width = xScale(candidate.votes)

        const text = {
            x: x,
            y: 14,
            dx: -1,
            textAnchor: 'start',
            fill: '#222',
            text: (i === 0) ? `(${candidate.party}) ${candidate.name.toUpperCase()}` : '',
        }
        x += width

        return text
    })
    x = 1
    const bars = candidates.map((candidate) => {
        const width = xScale(candidate.votes)
        const rect = {
            width,
            height: 20,
            x,
            y: 20,
            fill: partyColors(candidate.party),
            // stroke: partyColors(candidate.party, 'lighter'),
            stroke: '#ddd',
        }
        x += width
        return rect
    })
    x = 1
    const barLabels = candidates.map((candidate) => {
        const width = xScale(candidate.votes)
        x += width
        let text
        if (width > 20) {
            text = {
                x: x,
                y: 35,
                dx: -3,
                textAnchor: 'end',
                fill: '#fff',
                fontSize: '0.8em',
                text: `(${candidate.party}) ${percentFormat(candidate.votes / totalVotes)}`,
            }
        } else {
            text = {}
        }

        return text
    })
    return <div css={electionContainerCss}>
        {
            (true) && <svg width={260} height={42}>
                <g css={candidateLabelsCss}>{opponents.map((args, i) => <text key={String(i)} {...args}>{args.text}</text>)}</g>
                <g>{bars.map((args, i) => <rect key={String(i)} {...args} />)}</g>
                <g>{barLabels.map((args, i) => <text key={String(i)}  {...args}>{args.text}</text>)}</g>
            </svg>
        }
        {
            (candidates.length > 1) ?
                <div>Won by {percentFormat((candidates[0].votes - candidates[1].votes) / totalVotes)} ({numberFormat(candidates[0].votes - candidates[1].votes)} votes)</div> :
                <div>Ran unopposed</div>
        }

    </div>
}