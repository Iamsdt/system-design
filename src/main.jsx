import moment from "moment-timezone"
import React from "react"
import ReactDOM from "react-dom/client"

import App from "./App"

import "./main.css"

import "./lib/i18n"

// setup timezone

const zone = Intl.DateTimeFormat().resolvedOptions().timeZone
moment.tz.setDefault(zone)

// Enable mocking in development

// enableMocking()
//   .then(() => {
//     if (typeof document !== "undefined") {
//       // eslint-disable-next-line no-undef
//       ReactDOM.createRoot(document.getElementById("root")).render(
//         <React.StrictMode>
//           <App />
//         </React.StrictMode>
//       )
//       return true
//     }
//     return false
//   })
//   .catch(() => {
//     // Handle or log the error as needed
//   })

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
