import ConvertGPX from "views/ConvertGPX/ConvertGPX.jsx";
import Dashboard from "views/Dashboard/Dashboard.jsx";
import ExtendedTables from "views/Tables/ExtendedTables.jsx";
import ReactTables from "views/Tables/ReactTables.jsx";
import UserProfile from "views/Pages/UserProfile.jsx";

// @material-ui/icons
import DashboardIcon from "@material-ui/icons/Dashboard";
import Image from "@material-ui/icons/Image";
import Apps from "@material-ui/icons/Apps";
// import ContentPaste from "@material-ui/icons/ContentPaste";
import GridOn from "@material-ui/icons/GridOn";


var dashRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: DashboardIcon,
    component: Dashboard
  },
  {
    path: "/convertgpx",
    name: "Convert gpx",
    icon: Apps,
    component: ConvertGPX
  },
  {
    path: "/profile",
    name: "Profile",
    icon: Image,
    component: UserProfile
  },
  
  {
    path: "/food",
    name: "Food list",
    icon: GridOn,
    component: ExtendedTables
  },  
   
  {
    path: "/users",
    name: "User list",
    icon: GridOn,
    component: ReactTables
  },  
  { redirect: true, path: "/", pathTo: "/dashboard", name: "Dashboard" }
];
export default dashRoutes;
