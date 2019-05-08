import ConvertGPX from "views/ConvertGPX/ConvertGPX.jsx";
import Dashboard from "views/Dashboard/Dashboard.jsx";
import ExtendedTables from "views/Tables/ExtendedTables.jsx";
import ReactTables from "views/Tables/ReactTables.jsx";
import UserProfile from "views/Profile/UserProfile.jsx";
import TimelinePage from "views/Pages/Timeline.jsx";
// @material-ui/icons
import DashboardIcon from "@material-ui/icons/Dashboard";
import AccessibilityNew from "@material-ui/icons/AccessibilityNew";
import AssignmentInd from "@material-ui/icons/AssignmentInd";
// import ContentPaste from "@material-ui/icons/ContentPaste";
import Hotel from "@material-ui/icons/Hotel";
import Fastfood from "@material-ui/icons/Fastfood";
import Build from "@material-ui/icons/Build";
var dashRoutes = [
  // {
  //   path: "/dashboard",
  //   name: "Dashboard",
  //   icon: DashboardIcon,
  //   component: Dashboard
  // },
  {
    path: "/convertgpx",
    name: "Convert gpx",
    icon: Build,
    component: ConvertGPX
  },
  {
    path: "/profile",
    name: "Profile",
    icon: AccessibilityNew,
    component: UserProfile
  },  
  {
    path: "/food",
    name: "Food list",
    icon: Fastfood,
    component: ExtendedTables
  },  
  {
    path: "/planfood",
    name: "Food Plan",
    icon: Hotel,
    component: TimelinePage
  },     
  // {
  //   path: "/users",
  //   name: "User list",
  //   icon: AssignmentInd,
  //   component: ReactTables
  // },  
  { redirect: true, path: "/", pathTo: "/profile", name: "Profile" }
];
export default dashRoutes;
