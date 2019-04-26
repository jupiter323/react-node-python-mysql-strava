import Pages from "layouts/Pages.jsx";
import Dashboard from "layouts/Dashboard.jsx";
import Notifications from "views/Pages/Notifications.jsx";
// localStorage.clear()
var indexRoutes =
  localStorage.token ?
    JSON.parse(localStorage.profile).verified ?
      [
        { path: "/pages", name: "Pages", component: Pages },
        { path: "/notifications", name: "Notifications", mini: "N", component: Notifications },
        { path: "/", name: "Home", component: Dashboard }
      ] :
      [
        { path: "/", name: "Notifications", mini: "N", component: Notifications },
      ]
    :
    [
      { path: "/", name: "Login", component: Pages }

    ];

export default indexRoutes;
