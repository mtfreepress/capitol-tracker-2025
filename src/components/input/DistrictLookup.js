import React, { Component } from 'react';
import { css } from '@emotion/react';
import Link from 'next/link';
import { cleanPhoneString } from '../../config/utils';
import DistrictMatcher from '../../js/DistrictMatcher';

const addressForm = css`
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 1rem;
`;
const textInput = css`
    margin: -1px;
    flex: 4 1 15rem;
    height: 2em;
`;
const searchButton = css`
    margin: -1px;
    flex: 1 1 auto;
`;
const resultContainer = css`
    display: flex;
    flex-wrap: wrap;
    padding-bottom: 1px;
    min-height: 8em;
    background-color: #eee;
`;
const placeholderCss = css`
    display: flex;
    height: 8em;
    color: #aaa;
    width: 100%;
    text-transform: uppercase;
    justify-content: center;
    align-items: center;
`;
const resultItem = css`
    flex: 1 1 190px;
    margin: 0.5em;
    border: 1px solid #806F47;
    background-color: #eae3d4;
    padding: 0.5em;
`;
const resultLabel = css`
    font-weight: bold;
`;
const resultName = css`
    font-size: 1.3em;
    font-weight: bold;
`;
const labelCss = css`margin-bottom: 0.2em;`;
const messageLineCss = css`
    padding: 0.5em;
    padding-top: 0em;
    font-style: italic;
`;

const defaultAddress = 'e.g., 1301 E 6th Ave, Helena';

class DistrictLookup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
            matchedAddress: null,
            errorMessage: null,
            representative: null,
            senator: null,
        };

        this.districtMatcher = new DistrictMatcher();

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleFailedSubmit = this.handleFailedSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleResult = this.handleResult.bind(this);
    }

    handleChange(event) {
        this.setState({ value: event.target.value });
    }

    handleSubmit(event) {
        event.preventDefault();
        this.districtMatcher.matchAddressToLawmakers(this.state.value, this.handleResult, this.handleFailedSubmit);
    }

    handleResult({ hd, sd, location }) {
        const lawmakers = this.props.lawmakers;
        const representative = lawmakers.find(lawmaker => lawmaker.district.replace(' ', '') === hd);
        const senator = lawmakers.find(lawmaker => lawmaker.district.replace(' ', '') === sd);
        this.setState({
            matchedAddress: location,
            errorMessage: null,
            representative,
            senator,
        });
    }

    handleFailedSubmit() {
        this.setState({
            errorMessage: 'Address search failed',
            matchedAddress: null,
            representative: null,
            senator: null,
        });
    }

    render() {
        const { representative, senator, errorMessage, matchedAddress } = this.state;
        return (
            <div>
                <div css={labelCss}>Look up House and Senate representation by address</div>
                <div css={addressForm}>
                    <input
                        css={textInput}
                        type="text"
                        value={this.state.value}
                        onChange={this.handleChange}
                        placeholder={defaultAddress}
                    />
                    <button css={searchButton} onClick={this.handleSubmit}>Look up</button>
                </div>
                {errorMessage && <div css={messageLineCss}>{errorMessage}</div>}
                {matchedAddress && <div css={messageLineCss}>Districts for {matchedAddress}</div>}
                <div css={resultContainer}>
                    {representative && <LawmakerEntry lawmaker={representative} subtitle="House District" />}
                    {senator && <LawmakerEntry lawmaker={senator} subtitle="Senate District" />}
                    {!representative && !senator && <div css={placeholderCss}>Search results</div>}
                </div>
            </div>
        );
    }
}

const LawmakerEntry = ({ lawmaker, subtitle }) => {
    const { key, title, name, party, district, locale, phone, email } = lawmaker;
    return (
        <div css={resultItem}>
            <div css={resultLabel}>{district.replace('SD', 'Senate District').replace('HD', 'House District')}</div>
            <div css={resultName}>
                <Link href={`/lawmakers/${key}`}>{title} {name}</Link>
            </div>
            <div>({party} - {locale})</div>
            <div>
                <a href={`tel:${cleanPhoneString(phone)}`}>{phone}</a> • <a href={`mailto:${email}`}>{email}</a>
            </div>
        </div>
    );
};

export default DistrictLookup;
