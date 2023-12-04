import { React, memo } from 'react';
import { RotatingLines } from 'react-loader-spinner';

const RotateLine = ({width}) => {
    return (
        <RotatingLines
            strokeColor='black'
            strokeWidth="5"
            animationDuration="0.75"
            width={width}
            visible={true}
        />
    )
}

export default memo(RotateLine);