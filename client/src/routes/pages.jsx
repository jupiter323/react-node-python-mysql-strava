import LoginPage from "views/Pages/LoginPage.jsx";
import RegisterPage from "views/Pages/RegisterPage.jsx";
import Forgotpassword from "views/Pages/Forgotpassword";
import ForgotpasswordRequest from "views/Pages/ForgotpasswordRequest";

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
    path: "/pages/forgotpassword",
    name: "Forgot Password Page",
    short: "Forgot",
    mini: "LP",
    icon: Fingerprint,
    component: Forgotpassword
  },
  {
    path: "/pages/forgotpasswordrequest",
    name: "Forgot Password Page",
    short: "Forgot",
    mini: "LP",
    icon: Fingerprint,
    component: ForgotpasswordRequest
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
