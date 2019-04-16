/**
 * Description: App routes
 * Date: 12/25/2018
 */

import Pages from "../layout/Pages.jsx";
import Dashboard from "../layout/Dashboard.jsx";

var indexRoutes = [
  { path: "/pages", name: "Pages", component: Pages },
  { path: "/login", name: "Pages", component: Pages },
  { path: "/register", name: "Pages", component: Pages },
  { path: "/resetpassword/:token", name: "Pages", component: Pages },
  { path: "/forgotpassword", name: "Pages", component: Pages },
  { path: "/dashboard", name: "Home", component: Dashboard },
  // { path: "/", name: "Pages", component: Pages }
  { path: "/", name: "Home", component: Dashboard },
];

export default indexRoutes;
