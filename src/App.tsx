import { hot } from 'react-hot-loader/root';
import React from "react"
import Counter from "Components/Counter";

const App = () => {
    return (
        <div>
            <Counter/>
        </div>
    )
}

export default hot(App);