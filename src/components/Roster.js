import React from 'react'
import { css } from '@emotion/react'
import LawmakerTable from '../components/LawmakerTable'
import lawmakers from '../data/data-nodes/lawmakers.json' 


const sideBySideTableCss = css`
  display: flex;
  flex-wrap: wrap;
  margin: -0.5em;
`
const tableContainerCss = css`
  flex: 1 0 300px;
  min-width: 380px;
  margin: 0.5em;
`

const Roster = () => {
  return (
    <div>
      <div css={sideBySideTableCss}>
        <div css={tableContainerCss}>
          <h4>Republicans</h4>
          <LawmakerTable lawmakers={lawmakers.filter(d => d.party === 'R')} />
        </div>
        <div css={tableContainerCss}>
          <h4>Democrats</h4>
          <LawmakerTable lawmakers={lawmakers.filter(d => d.party === 'D')} />
        </div>
      </div>
    </div>
  )
}

export default Roster