import Pages from "layouts/Pages.jsx";
import Dashboard from "layouts/Dashboard.jsx";

console.log("token", localStorage.getItem("token"))
var indexRoutes = localStorage.token ? [
  { path: "/pages", name: "Pages", component: Pages },
  { path: "/", name: "Home", component: Dashboard }
] : [
    { path: "/", name: "Login", component: Pages }
  ];

export default indexRoutes;
