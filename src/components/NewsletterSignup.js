import React from 'react'
import { css } from '@emotion/react'

import Image from 'next/image';
import wideCapitolizedLogo from "../images/Capitolized400x147.png"

const style = css`
    background: #191919;
    color: white;
    padding: 1em;
    margin-top: 2em;
    margin-bottom: 2em;

    .row {
        display: flex;
        flex-wrap: wrap;

        .img-col {
            flex: 1 1 300px;
            margin-bottom: 0.5em;
        }
        .img-col img {
            width: 100%;
        }
        .words-col {
            flex: 1 1 300px;
            padding: 0 1em;

            .message {
                font-size: 1.2em;
                font-weight: bold;
                margin-bottom: 0.5em;
            }
            .message-2 {
                font-size: 1.1em;
                margin-bottom: 0.5em;
            }
        }
    }

    .signup {
        margin: 0.5em 0;
    }

    .signupGroup {
        display: flex;        
    }

    .textInput {
        flex: 1 1 40rem;
        margin: -1px;
        height: 2.5rem;
        padding-left: 0.5rem;
    }
    .submitButton {
        flex: 0 1 10rem;
        margin: -1px;
        background-color: #F85028;
        border: 1px solid #F85028;
        color: #fff;
        /* height: 1.2em; */
    }

    .submitButton:hover{
        background-color: #BA892D;
        border: 1px solid #BA892D;
        /* color: #222; */

    }
`
const imgCss = css`
    width: 100%;
`

const NewsletterSignup = props => {
    return <div css={style}>
        <div className="row">
            <div className="img-col" style={{ position: 'relative', width: '100%', height: 'auto' }}>
                <Image
                    src={wideCapitolizedLogo}
                    alt="Capitolized newsletter"
                    css={imgCss}
                    fill
                    sizes="(max-width: 768px) 100vw, 700px"
                />
            </div>
            <div className="words-col">
                <div className="message">Sign up for CAPITOLIZED</div>
                <div className="message-2">Expert reporting and insight from the Montana Capitol, emailed Tuesdays and Fridays.</div>
                <div className="signup">
                    <form action="https://montanafreepress.us12.list-manage.com/subscribe/post?u=488e8508eb4796685ba32c7a7&amp;id=8a3ae13501&amp;f_id=005abbe0f0" method="post" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" className="validate" target="_blank" noValidate>
                        <div className="signupGroup" id="mc_embed_signup_scroll">
                            <div>
                                <input className="textInput" type="email" placeholder="Email address" name="EMAIL" id="mce-EMAIL" />
                                <span id="mce-EMAIL-HELPERTEXT" className="helper_text"></span>
                            </div>
                            <div hidden={true}><input type="hidden" name="tags" value="10502557" /></div>
                            <div id="mce-responses" className="clear">
                                <div className="response" id="mce-error-response" style={{ display: "none" }}></div>
                                <div className="response" id="mce-success-response" style={{ display: "none" }}></div>
                            </div>
                            {/* <!-- real people should not fill this in and expect good things - do not remove this or risk form bot signups--> */}
                            <div style={{ position: "absolute", left: "-5000px" }} aria-hidden={true}><input type="text" name="b_488e8508eb4796685ba32c7a7_8a3ae13501" tabIndex="-1" value="" readOnly /></div>
                            <button className="submitButton" type="submit" name="subscribe" id="mc-embedded-subscribe">Subscribe</button>
                        </div>
                    </form>
                </div >
            </div>

        </div>


    </div >
}

export default NewsletterSignup


