import { React, memo } from 'react'
import { Triangle } from  'react-loader-spinner';

const TriangleLoading = () => {
    return (
        <Triangle
            height="80"
            width="80"
            color="#9431C6"
            ariaLabel="triangle-loading"
            wrapperStyle={{}}
            wrapperClassName=""
            visible={true}
        />
    )
}

export default memo(TriangleLoading);