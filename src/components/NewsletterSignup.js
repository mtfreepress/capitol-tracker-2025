import React from 'react'
import { useState } from 'react'
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
            position: relative;
            flex: 1 1 300px;
            margin-bottom: 0.5em;
            min-height: 100px;

            a:hover {
                opacity: 0.8
            }
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
    
    .message-below {
        font-size: 0.9em;
        margin-top: 0.5em;
        font-style: italic;
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

// Temporary link approach
const NewsletterSignup = props => {
    return <div css={style}>
        <div className="row">
            <div className="img-col">
            <a href="https://montanafreepress.org/newsletters-sign-up/"><Image
                    src={wideCapitolizedLogo}
                    alt="Capitolized newsletter"
                    fill
                    style={{objectFit: "cover"}}
                /></a>
            </div>
            <div className="words-col">
                {/* <div className="message">Sign up for CAPITOLIZED</div> */}
                <div className="message-2">Expert reporting and insight from the Montana Capitol, emailed Thursdays.</div>
                <div className="signup">
                    👉 <a href="https://montanafreepress.org/newsletters-sign-up/"> SIGN UP HERE</a>
                </div >
            </div>
        </div>
    </div >
}

// Old Mailchimp-based approach
// const NewsletterSignup = props => {
//     return <div css={style}>
//         <div className="row">
//             <div className="img-col" style={{ position: 'relative', width: '100%', height: 'auto' }}>
//                 <Image
//                     src={wideCapitolizedLogo}
//                     alt="Capitolized newsletter"
//                     css={imgCss}
//                     fill
//                     sizes="(max-width: 768px) 100vw, 700px"
//                 />
//             </div>
//             <div className="words-col">
//                 <div className="message">Sign up for CAPITOLIZED</div>
//                 <div className="message-2">Expert reporting and insight from the Montana Capitol, emailed Tuesdays and Fridays.</div>
//                 <div className="signup">
//                     <form action="https://montanafreepress.us12.list-manage.com/subscribe/post?u=488e8508eb4796685ba32c7a7&amp;id=8a3ae13501&amp;f_id=005abbe0f0" method="post" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" className="validate" target="_blank" noValidate>
//                         <div className="signupGroup" id="mc_embed_signup_scroll">
//                             <div>
//                                 <input className="textInput" type="email" placeholder="Email address" name="EMAIL" id="mce-EMAIL" />
//                                 <span id="mce-EMAIL-HELPERTEXT" className="helper_text"></span>
//                             </div>
//                             <div hidden={true}><input type="hidden" name="tags" value="10502557" /></div>
//                             <div id="mce-responses" className="clear">
//                                 <div className="response" id="mce-error-response" style={{ display: "none" }}></div>
//                                 <div className="response" id="mce-success-response" style={{ display: "none" }}></div>
//                             </div>
//                             {/* <!-- real people should not fill this in and expect good things - do not remove this or risk form bot signups--> */}
//                             <div style={{ position: "absolute", left: "-5000px" }} aria-hidden={true}><input type="text" name="b_488e8508eb4796685ba32c7a7_8a3ae13501" tabIndex="-1" value="" readOnly /></div>
//                             <button className="submitButton" type="submit" name="subscribe" id="mc-embedded-subscribe">Subscribe</button>
//                         </div>
//                     </form>
//                 </div >
//             </div>

//         </div>


//     </div >
// }


// // Partially implemented Active Campaign form
// const NewsletterSignup = props => {

//     const [state, setState] = useState({
//         email: "",
//         message: "",
//         formSubmitted: false
//     })

//     const handleInputChange = (event) => {
//         const { name, value } = event.target;
//         setState((prevProps) => ({
//             ...prevProps,
//             [name]: value,
//             message: "",
//         }))
//     }

//     const handleSubmit = (event) => {
//         event.preventDefault();
//         const data = new FormData(event.target);

//         fetch('https://montanafreepress.activehosted.com/proc.php', {
//             method: 'POST',
//             body: data,
//             mode: 'no-cors',
//         })
//         .then(response => {
//             this.setState({
//                 formSubmitted: true,
//                 message: "X SUBMITTED"
//             });
//             setTimeout(() => {
//                 this.setState({
//                     formSubmitted: false,
//                     message: "X FAILED"
//                 });
//             }, 5000);
//         })
//         .catch(error => console.log('Request failed', error));
//     }

//     return <div css={style}>
//         <div className="img-col" style={{ position: 'relative', width: '100%', height: 'auto' }}>
//             <Image
//                 src={wideCapitolizedLogo}
//                 alt="Capitolized newsletter"
//                 css={imgCss}
//                 fill
//                 sizes="(max-width: 768px) 100vw, 700px"
//             />
//         </div>
//         <div className="words-col">
//             <div className="message">Sign up for CAPITOLIZED</div>
//             <div className="message-2">Expert reporting and insight from the Montana Capitol, emailed Thursdays.</div>
//             <div className="signup">
//                 <form
//                     method="POST"
//                     // action=""
//                     onSubmit={handleSubmit}
//                 >
//                     <input type="hidden" name="u" value="14" />
//                     <input type="hidden" name="f" value="14" />
//                     <input type="hidden" name="s" />
//                     <input type="hidden" name="c" value="0" />
//                     <input type="hidden" name="m" value="0" />
//                     <input type="hidden" name="act" value="sub" />
//                     <input type="hidden" name="v" value="2" />
//                     <input type="hidden" name="or" value="46338e2dc1caf805a8993c443ea99967" />
//                     <div className="_form-content">
//                         <div className="signupGroup" >
//                             <div className="_field-wrapper">
//                                 <input
//                                     type="text"
//                                     id="email"
//                                     name="email"
//                                     className="textInput"
//                                     placeholder="Enter your email"
//                                     value={state.email}
//                                     onChange={handleInputChange}
//                                     required />
//                             </div>
//                             <button
//                                 id="_form_14_submit"
//                                 className="submitButton"
//                                 type="submit"
//                             >
//                                 Submit
//                             </button>
//                         </div>

//                     </div>
//                     <div className="message-below">{state.message}</div>
//                 </form>
//             </div >
//         </div>


//     </div>
// }

export default NewsletterSignup
