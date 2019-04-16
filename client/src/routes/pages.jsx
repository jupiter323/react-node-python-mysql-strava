/**
 * Description: Page style view routes
 * Date: 12/25/2018
 */

import LoginPage from "views/Login/LoginPage.jsx";
import RegisterPage from "views/Register/RegisterPage.jsx";
import ResetPasswordPage from "views/ResetPassword/ResetPasswordPage.jsx";
import ForgotPasswordPage from "views/ForgotPassword/ForgotPasswordPage.jsx";

// @material-ui/icons
import PersonAdd from "@material-ui/icons/PersonAdd";
import Fingerprint from "@material-ui/icons/Fingerprint";

const pagesRoutes = [
  {
    path: "/login",
    name: "Login",
    short: "Login",
    mini: "L",
    icon: Fingerprint,
    component: LoginPage
  },
  {
    path: "/register",
    name: "Register",
    short: "Register",
    mini: "R",
    icon: PersonAdd,
    component: RegisterPage
  },
  {
    path: "/resetpassword/:token",
    name: "ResetPassword",
    short: "ResetPassword",
    mini: "RP",
    icon: PersonAdd,
    component: ResetPasswordPage
  },
  {
    path: "/forgotpassword",
    name: "ForgotPassword",
    short: "ForgotPassword",
    mini: "FP",
    icon: PersonAdd,
    component: ForgotPasswordPage
  },
];

export default pagesRoutes;
