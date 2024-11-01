import { css } from '@emotion/react'
import Image from 'next/image'

import { footerMenus, footerLogoUrl } from '../config'

const footerStyle = css`

    font-size: 13px;

    display: block;

    font-family: futura-pt, Arial, Helvetica, sans-serif;
    background: #171818;
    color: #fff;

    @media (min-width: 782px) {
        padding-top: 2em;
    }
`
const footerWrapperStyle = css`
    max-width: 1200px;
    margin: auto;
`
const footerColumnsStyle = css`
    text-transform: uppercase;
    overflow-wrap: break-word;

    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;

    margin-left: 39px;
    margin-right: 39px;
    max-width: 90%;
`

const menuStyle = css`
    margin-right: 40px;
`

const menuListStyle = css`
    list-style-image: none;
    list-style-type: none;
    list-style-position: outside;
    padding-inline-start: 0px;
    font-weight: 400px;
    letter-spacing: 2px;
    line-height: 20.48px;

    li {
        margin-bottom: 12.8px;
    }

    a {
        color: #fff;
        text-decoration: none;
    }
`

const footerInfoStyle = css`
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    flex-wrap: wrap;

    padding-bottom: 20px;
    margin-left: 39px;
    margin-right: 39px;
    color: #aa986a;

    a {
        color: #aa986a;
        text-decoration: none;
    }
`
const footerImgStyle = css`
    max-width: 100%;
    height: auto;
`

const Footer = (props) => {
    const menusRendered = footerMenus.map((menu, i) => {
        const itemsRendered = menu.items.map((item, i) => <li key={String(i)}><a href={item.url}>{item.label}</a></li>)
        return <section css={menuStyle} key={String(i)}>
            <h2>{menu.label}</h2>
            <ul css={menuListStyle}>{itemsRendered}</ul>
        </section>
    })

    return <footer css={footerStyle}>
        <div css={footerWrapperStyle}>
            <div css={footerColumnsStyle}>
                {menusRendered}
            </div>

            <div css={footerInfoStyle}>
                <span>© {new Date().getFullYear()} Montana Free Press. </span>
                <a href="https://montanafreepress.org/about-mtfp/privacy-policy/">Privacy Policy</a>
                <Image alt="MTFP logo" width={121} height={47} css={footerImgStyle} src={footerLogoUrl} />
            </div>
        </div>

    </footer>
}

export default Footer