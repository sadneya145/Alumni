import "./App.css";
import { Route, Routes, useLocation } from "react-router-dom";
import { useState } from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./Admin/theme";
import AddEvent from "./Admin/AdminComponents/Event/AddEvent";
import EventList from "./Admin/AdminComponents/Event/EventList";
import AdminLogin from "./Admin/AdminLogin";
import ProtectedAdminRoute from "./Admin/ProtectedAdminRoute";
import Sidebar from "./Admin/AdminComponents/global/Sidebar";
import Topbar from "./Admin/AdminComponents/global/Topbar";
import AdminDashboard from "./Admin/AdminComponents/dashboard/Dashboard";
import Team from "./Admin/AdminComponents/team/team";
import Contacts from "./Admin/AdminComponents/contacts/contacts";
import Invoices from "./Admin/AdminComponents/invoices/invoices";
import Form from "./Admin/AdminComponents/form/userForms";
import Bar from "./Admin/AdminComponents/bar/bar";
import Pie from "./Admin/AdminComponents/pie/pie";
import Line from "./Admin/AdminComponents/line/line";
import FAQ from "./Admin/AdminComponents/faq/faq";
import Calendar from "./Admin/AdminComponents/calendar/calendar";
import Geography from "./Admin/AdminComponents/geography/geography";
import ShowUsers from "./Admin/AdminComponents/ShowUsers/ShowUsers";

import Login from "./Main/LoginSignup/Login";
import Signup from "./Main/LoginSignup/Signup";
import Home from "./Main/Home/Home";
import FundRaising from "./Main/Components/FundRaising/FundRaising";
import EventParticipation from "./Main/Components/Event/EventParticipation";
import Chatbot from "./Main/Chatbot/Chatbot";
import SearchPeople from "./Main/Components/SearchPeople/SearchPeople";
import DiscussionPage from "./Main/Components/DiscussionPage/DiscussionPage";
import PeopleProfile from "./Main/Components/SearchPeople/PeopleProfile"
import ChatBox from "./Main/Components/SearchPeople/ChatBox";
import Profile from "./Main/Components/Profile/Profile";
import JobBoard from "./Main/Components/JobBoard/JobBoard";
import VideoCall from "./Main/Components/VideoCall/Screens/Lobby";
import Room from "./Main/Components/VideoCall/Screens/Room";
import Message from "./Main/Components/Message/Message";
import StaffProfiles from "./Main/Components/SearchPeople/staffSpy";
import NewJobs from "./Main/Components/JobBoard/NewJobs"

function App() {
  const location = useLocation();
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);

  // Check if the current path is an admin route
  const isAdminPage = location.pathname.startsWith("/admin");

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="App">
          {isAdminPage ? (
            // Admin Layout with Sidebar & Topbar
            <div style={{ display: "flex" }}>
              <Sidebar isSidebar={isSidebar} />
              <div style={{ flexGrow: 1 }}>
                <Topbar setIsSidebar={setIsSidebar} />
                <Routes>
                  <Route path="/admin-login" element={<AdminLogin />} />
                  <Route element={<ProtectedAdminRoute />}>
                    <Route path="/admin-dashboard" element={<AdminDashboard />} />
                    <Route path="/admin-team" element={<Team />} />
                    <Route path="/admin-contacts" element={<Contacts />} />
                    <Route path="/admin-invoices" element={<Invoices />} />
                    <Route path="/admin-form" element={<Form />} />
                    <Route path="/admin-addevent" element={<AddEvent />} />
                    <Route path="/admin-listevent" element={<EventList />} />
                    <Route path="/admin-bar" element={<Bar />} />
                    <Route path="/admin-pie" element={<Pie />} />
                    <Route path="/admin-line" element={<Line />} />
                    <Route path="/admin-faq" element={<FAQ />} />
                    <Route path="/admin-calendar" element={<Calendar />} />
                    <Route path="/admin-geography" element={<Geography />} />
                    <Route path="/admin/show-users" element={<ShowUsers />} />
                  </Route>
                </Routes>
              </div>
            </div>
          ) : (
            // Public User Routes (No Sidebar)
            <>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/" element={<Home />} />
                <Route path="/home/fundRaising" element={<FundRaising />} />
                <Route path="/home/events" element={<EventParticipation/>} />
                <Route path="/home/search-people" element={<SearchPeople/>} />
                <Route path="/home/discussionPage" element={<DiscussionPage/>} />
                <Route path="/profile/:email" element={<PeopleProfile/>} />
                <Route path="/home/message" element={<ChatBox />} />
                <Route path="/home/profile" element={<Profile />} />
                <Route path="/home/career-support/jobboard" element={<JobBoard />} />
                <Route path="/home/career-support/profiles" element={<StaffProfiles/>}/>
                <Route path="/home/career-support/newJobsPosted" element={<NewJobs/>}/>
                <Route path="/video_call" element={<VideoCall />} />
                <Route path="/video_call/room/:roomId" element={<Room />} />
                <Route path="/messages" element={<Message />} />
              </Routes>
              <Chatbot/>
            </>
          )}
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
