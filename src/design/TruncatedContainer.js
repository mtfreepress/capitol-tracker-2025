import React, { useState } from 'react'
import { css } from '@emotion/react'

const style = css`
    /* border: 1px solid gray; */
`

const bottomFadeCss = css`
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
const inlineButtonCss = css`
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

const centeredButtonCss = css`
    display: block;
    margin: 0 auto;
    margin-top: 0.2em;
    font-size: 1.1em;
`

const TruncatedContainer = (props) => {
    const { children } = props
    const truncateHeight = props.height || 500
    const openedText = props.openedText || 'See fewer'
    const closedText = props.closedText || 'See all'
    const defaultState = props.defaultState || true
    const buttonPlacement = props.buttonPlacement || 'below'

    const [isClosed, setClosedState] = useState(defaultState)
    const toggleClosedState = () => isClosed ? setClosedState(false) : setClosedState(true)

    const truncateCss = css`
        height: ${truncateHeight}px;
        overflow: hidden;
    `
    return <div css={style}>
        {
            (buttonPlacement === 'above') && <button css={[inlineButtonCss, centeredButtonCss]} onClick={toggleClosedState}>
                {
                    isClosed ? closedText : openedText
                }
            </button>
        }
        <div css={isClosed ? [truncateCss, bottomFadeCss] : []}>{children}</div>
        {
            (buttonPlacement === 'below') && <button css={[inlineButtonCss, centeredButtonCss]} onClick={toggleClosedState}>
                {
                    isClosed ? closedText : openedText
                }
            </button>
        }
    </div >
}
export default TruncatedContainer