import { React, memo } from 'react';
import { RotatingLines } from 'react-loader-spinner';

const RotateLine = () => {
    return (
        <RotatingLines
            strokeColor='black'
            strokeWidth="5"
            animationDuration="0.75"
            width="20"
            visible={true}
        />
    )
}

export default memo(RotateLine);