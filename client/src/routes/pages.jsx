import LoginPage from "views/Pages/LoginPage.jsx";
import RegisterPage from "views/Pages/RegisterPage.jsx";
// @material-ui/icons

import Fingerprint from "@material-ui/icons/Fingerprint";
import PersonAdd from "@material-ui/icons/PersonAdd";

const pagesRoutes = [
  {
    path: "/pages/login-page",
    name: "Login Page",
    short: "Login",
    mini: "LP",
    icon: Fingerprint,
    component: LoginPage
  },
  {
    path: "/pages/register-page",
    name: "Register Page",
    short: "Register",
    mini: "RP",
    icon: PersonAdd,
    component: RegisterPage
  },
  {
    redirect: true,
    path: "/",
    pathTo: "/pages/login-page",
    name: "Login Page"
  }
];

export default pagesRoutes;
