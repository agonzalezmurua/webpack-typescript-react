import React, { useState, useEffect } from "react"

const Greetings: React.FunctionComponent = () => {
    const [counter, setCounter] = useState(0)

    setTimeout(() => {
        setCounter(counter + 1)
    }, 1000)
    return (
        <div>
            <div>Hello world!</div>
            <span>{counter}</span>
        </div>
    )
}

export default Greetings
