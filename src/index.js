import React from 'react'
import ReactDOM from 'react-dom'
import {renderToString} from "react-dom/server"
import App from '@App';

// prerender-loader utiliza JSDOM para generar el contenido
const isJSDOM = navigator.userAgent.includes("Node.js") || navigator.userAgent.includes("jsdom");

ReactDOM.render(<App/> , document.getElementById('root'));
// Registro de Service Worker, los assets emitidos son registrados
// como variable global para ser consumido por service worker
if (
    // @ts-ignore
    PRODUCTION && // Este valor viene desde webpack.DefinePlugin
    isJSDOM === false &&
    'serviceWorker' in navigator &&
    ( // Ubicaciónes válidas para SW
        window.location.protocol === 'https:' ||
        window.location.hostname === 'localhost'
    )
) {
    const runtime = require("serviceworker-webpack-plugin/lib/runtime");
    runtime.register();
}

// Prerender para HTML
export default () => {
    return renderToString(<App/>)
}
