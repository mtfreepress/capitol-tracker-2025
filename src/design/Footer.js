import { css } from '@emotion/react'
import Image from 'next/image'

import { footerMenus, footerLogoUrl } from '../config/config.js'

const footerStyle = css`

    font-size: 13px;

    display: block;

    font-family: futura-pt, Arial, Helvetica, sans-serif;
    background: #171818;
    color: #fff;

    @media (min-width: 782px) {
        padding-top: 2em;
    }
    
    .footer-wrapper {
        max-width: 1200px;
        margin: auto;
    }
    
    .footer-column {
        text-transform: uppercase;
        overflow-wrap: break-word;

        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;

        margin-left: 39px;
        margin-right: 39px;
        max-width: 90%;
    }
    
    .footer-menu {
        margin-right: 40px;
    }
    .footer-menu-item {
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

    }
    .menu-item-list {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        flex-wrap: wrap;
        
    }
    .footer-info {
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
    }
    .footer-image {
        max-width: 100%;
        height: auto;
    }
`

const Footer = (props) => {
    const menusRendered = footerMenus.map((menu, i) => {
        const itemsRendered = menu.items.map((item, i) => <li key={String(i)}><a href={item.url}>{item.label}</a></li>)
        return <section className="footer-menu" key={String(i)}>
            <h2>{menu.label}</h2>
            <ul class="footer-menu-item">{itemsRendered}</ul>
        </section>
    })

    return <footer css={footerStyle}>
        <div className="footer-wrapper">
            <div className="footer-column">
                {menusRendered}
            </div>

            <div className="footer-info">
                <span>© {new Date().getFullYear()} Montana Free Press. </span>
                <a href="https://montanafreepress.org/about-mtfp/privacy-policy/">Privacy Policy</a>
                <Image alt="MTFP logo" width={121} height={47} className="footer-image" src={footerLogoUrl} />
            </div>
        </div>

    </footer>
}

export default Footer