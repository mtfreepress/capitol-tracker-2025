import React, { Component } from 'react';
import { css } from '@emotion/react';
import TextInput from './TextInput';
import Link from 'next/link';

const standardize = string => string.toUpperCase().replace(/ /g, '');

class BillLookup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            billsFound: []
        };

        this.refIdInput = React.createRef();
        this.refTitleInput = React.createRef();

        this.searchByIdentifier = this.searchByIdentifier.bind(this);
        this.searchByTitle = this.searchByTitle.bind(this);
    }

    searchByIdentifier(input) {
        const { bills } = this.props;
        const minSearchLength = 1;
        const resultLimit = 10;

        this.refTitleInput.current.reset();
        if (input.length < minSearchLength) {
            this.setState({
                billsFound: []
            });
        } else {
            const filterKey = standardize(input);
            const billsFound = bills
                .filter(d => standardize(d.identifier).includes(filterKey))
                .sort((a, b) => a.identifier.length - b.identifier.length)
                .slice(0, resultLimit);
            this.setState({
                billsFound
            });
        }
    }

    searchByTitle(input) {
        const { bills } = this.props;
        const minSearchLength = 3;
        const resultLimit = 10;

        this.refIdInput.current.reset();
        if (input.length < minSearchLength) {
            this.setState({
                billsFound: []
            });
        } else {
            const filterKey = standardize(input);
            const billsFound = bills.filter(d => {
                return standardize(d.title).includes(filterKey);
            }).slice(0, resultLimit);
            this.setState({
                billsFound
            });
        }
    }

    render() {
        const { billsFound } = this.state;
        return (
            <div>
                <div css={labelCss}>Type to search by number</div>
                <TextInput
                    handleInput={this.searchByIdentifier}
                    placeholder='e.g., "100" or "HB 100"'
                    ref={this.refIdInput}
                />

                <div css={labelCss}>Type to search by words in bill title</div>
                <TextInput
                    handleInput={this.searchByTitle}
                    placeholder='e.g., "budget," "tax," or "coal"'
                    ref={this.refTitleInput}
                />

                <div css={resultContainer}>
                    {billsFound.length > 0 ? (
                        billsFound.map(bill => <BillEntry key={bill.key} bill={bill} />)
                    ) : (
                        <div css={placeholderCss}>Search results</div>
                    )}
                </div>
            </div>
        );
    }
}

const resultContainer = css`
    padding-top: 1px;
    padding-bottom: 1px;
    min-height: 8em;
    background-color: #eee;
`;

const placeholderCss = css`
    display: flex;
    height: 8em;
    color: #aaa;
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

const labelCss = css`
    margin-bottom: 0.2em;
`;

const BillEntry = ({ bill }) => {
    const { key, identifier, title } = bill;
    return (
        <div css={resultItem}>
            <div>
                <Link href={`/bills/${key}`}>{identifier}:</Link> {title}
            </div>
        </div>
    );
};

export default BillLookup;
