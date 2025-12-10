import { createHashRouter } from "react-router-dom"

import BlankLayout from "@/components/layout/blank-layout"
import blankRoutes from "./blank.routes"
import NotFoundPage from "@/pages/misc/not-found"
import ErrorPage from "@/pages/misc/error-found"

const router = createHashRouter([
  {
    element: <BlankLayout />,
    children: [
      ...blankRoutes,
      // Catch-all 404 route for client-side navigation
      { path: "*", element: <NotFoundPage /> },
    ],
    // Global route-level error handling for route load/runtime errors
    errorElement: <ErrorPage />,
  },
])

export default router
