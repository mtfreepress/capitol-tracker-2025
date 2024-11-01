// Central storage point for reused styles
import { css } from '@emotion/react'

export const embedInputContainerStyle = css`
    margin: 1em 2em;

    textarea {
        font-family: Courier New;
    }
`

export const containerStyle = css`
    max-width: 1200px;
    width: 100%;
    padding: 0.5em 0;
`

export const noteStyle = css`
    font-style: italic;
    font-size: 0.9em;
    margin-bottom: 0.3em;
    margin-top: 0.3em;
`

export const tableStyle = css`
    width: 100%;
    margin-top: 0.5em;
    thead {
        
    }
    tbody {
        border-top: 1px solid #ddd;
        background-color: #eae3da;
    }
    tr {
        /* border-bottom: 1px solid #ddd; */
        border-bottom: 1px solid #473d29;
        margin: 0 0.2em;

        :first-of-type {
            border-top: 1px solid #473d29;
        }
    }
    td {
        padding: 0.5em 0.5em;
    }
    th {
        font-weight: normal;
        font-style: italic;
        vertical-align: bottom;
        padding: 0.3em 0.5em;
    }
`
export const cellCenteredStyle = css`
    text-align: center;
`


export const bottomFadeCss = css`
    position: relative;
    :after {
        content: '';
        position: absolute;
        z-index: 10;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 4em;
        background-image : linear-gradient(to bottom, 
                    rgba(255,255,255, 0), 
                    rgba(255,255,255, 1) 70%);

    }
`
export const inlineButtonCss = css`
  display: inline-block;
  border: none;
  padding: 0.2em 0.5em;
  border: 1px solid var(--tan6);
  /* color: #ce5a00; */
  color: var(--tan6);
  background-color: rgba(256, 256, 256, 0);
  text-align: left;
  font-size: 1em;
  text-transform: none;
  letter-spacing: normal;
  font-weight: normal;

  :hover {
    background-color: rgba(256, 256, 256, 0);
    border: 1px solid #ce5a00;
    color: #ce5a00;
    text-decoration: none;
  }
`