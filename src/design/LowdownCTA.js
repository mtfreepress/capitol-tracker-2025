import { css } from '@emotion/react'
// import Image from 'next/image'

// import lowdownLogo from "../../public/mt-lowdown-banner.png"

const ctaStyle = css`
    display: block;
    background-color: var(--gray5);
    border: 1px solid black;
    color: white;
    padding: 1em;
    margin: 0 -5px;
    text-align: center;

    .message {
        font-size: 1.2em;
        margin-bottom: 1em;
        
    }
    a  {
        display: block;
        border: 2px solid var(--link);
        color: var(--highlight);
        /* text-transform: uppercase; */
        font-weight: bold;
        margin: 0.5em auto;
        padding: 0.5em 1em;
        font-size: 1.3em;
        max-width: 22em;
    }
    a:hover {
        color: white;
        text-decoration: none;
        border: 2px solid var(--highlight);
    }
    .outro {
        color: #eee;
        font-style: italic;
    }
`
const CTA_LINK = 'https://montanafreepress.org/mt-lowdown/'

export default function LowdownCTA() {
    return <div css={ctaStyle}>
        <div className="message">Want original Montana Free Press reporting and analysis sent to your inbox each week?</div>
        <a href={CTA_LINK}>
            <div className="button">Sign up for the free MT LOWDOWN newsletter</div>
            {/* <Image src={lowdownLogo} alt="Montana Lowdown newsletter" width={300} /> */}
        </a>
        <div className="outro">Delivered Friday afternoons</div>
    </div>
}