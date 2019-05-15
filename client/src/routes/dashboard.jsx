import ExtendedTables from "views/Tables/ExtendedTables.jsx";
import UserProfile from "views/Profile/UserProfile.jsx";
import TimelinePage from "views/Pages/Timeline.jsx";
// @material-ui/icons
import AccessibilityNew from "@material-ui/icons/AccessibilityNew";
// import ContentPaste from "@material-ui/icons/ContentPaste";
import Hotel from "@material-ui/icons/Hotel";
import Fastfood from "@material-ui/icons/Fastfood";

var dashRoutes = [
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
  { redirect: true, path: "/", pathTo: "/profile", name: "Profile" }
];
export default dashRoutes;
