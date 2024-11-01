import React, { Component } from 'react'
import { css } from '@emotion/react'

const searchFormCss = css`
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 1em;
`
const inputCss = css`
    height: 2em;
    flex: 4 1 100%;
`

// Simple text input form with self-contained state management
class TextInput extends Component {
    
    constructor(props) {
        super(props)
        this.state = {
            value: '',
        }
        this.handleChange = this.handleChange.bind(this)
    }

    handleChange(event) {
        const input = event.target.value
        this.props.handleInput(input)
        this.setState({ value: input })
    }
    
    reset() {
        this.setState({value: ''})
    }

    render() {
        // ID Param allows external manipulation of value
        const { placeholder } = this.props
        const { value } = this.state
        return <div css={searchFormCss}>
            <input css={inputCss} type="text"
                value={value}
                onChange={this.handleChange}
                placeholder={placeholder}
            />
        </div>
    }

}

export default TextInput