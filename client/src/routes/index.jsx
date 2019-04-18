import Pages from "layouts/Pages.jsx";
import RTL from "layouts/RTL.jsx";
import Dashboard from "layouts/Dashboard.jsx";

console.log("token", localStorage.getItem("token"))
var indexRoutes = localStorage.token ? [
  { path: "/rtl", name: "RTL", component: RTL },
  { path: "/pages", name: "Pages", component: Pages },
  { path: "/", name: "Home", component: Dashboard }
] : [
    { path: "/", name: "Login", component: Pages }
  ];

export default indexRoutes;
