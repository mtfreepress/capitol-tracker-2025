import { css } from '@emotion/react'
import Image from 'next/image'

import mtfpLogo from "../../public/mtfp-logo.png"

const containerCss = css`
    display: inline-block;
    position: relative;

    text-transform: uppercase;
    font-style: normal;
    font-weight: bold;

    a {
        color: #AE9864;
    }
    
`
const imgCss = css`
    position: relative;
    top: 5px;
    margin: 0 5px;

    :hover {
      opacity: 0.7;
    }
`

const MTFPLogo = (props) => (
  <div css={containerCss}>
    <a href="https://montanafreepress.org">
      <Image src={mtfpLogo} alt="MTFP logo" width={50} css={imgCss} />
    </a>
  </div>
)
export default MTFPLogo