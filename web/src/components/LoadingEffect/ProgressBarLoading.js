import React from 'react'
import { ProgressBar } from 'react-loader-spinner'

const ProgressBarLoading = () => {
    return (
        <ProgressBar
            height="80"
            width="80"
            ariaLabel="progress-bar-loading"
            wrapperStyle={{}}
            wrapperClass="progress-bar-wrapper"
            borderColor='#9431C6'
            barColor='#9431C6'
        />
    )
}

export default ProgressBarLoading