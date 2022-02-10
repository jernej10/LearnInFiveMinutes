import "./App.css";
import Home from "./components/Home";
import Navigation from "./components/Navigation";
import Login from "./components/Login";
import Registration from "./components/Registration";
import Videos from "./components/Videos";
import Video from "./components/Video";
import Footer from "./components/Footer";
import SearchedVideos from "./components/SearchedVideos";
import UserProfile from "./components/UserProfile";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TokenProvider } from "./context/TokenContext";

function App() {
  return (
    <TokenProvider>
      <BrowserRouter>
        <div className="App">
          <Navigation></Navigation>

          <Routes>
            <Route path="/" element={<Home></Home>} />
            <Route path="videos/:zvrst" element={<Videos></Videos>} />
            <Route path="video/:id" element={<Video></Video>} />
            <Route path="login" element={<Login></Login>} />
            <Route
              path="registration"
              element={<Registration></Registration>}
            />
            <Route
              path="videos/search/:iskanNiz"
              element={<SearchedVideos></SearchedVideos>}
            />
            <Route path="userProfile" element={<UserProfile></UserProfile>} />
          </Routes>
          <Footer></Footer>
        </div>
      </BrowserRouter>
    </TokenProvider>
  );
}

export default App;
