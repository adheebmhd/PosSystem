import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { Login, Menu, Bills, Payment, Report, Stock, User } from "./pages";
import { Header } from "./components/shared";

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

function App() {
  const location = useLocation();

  const hideHeader =
    location.pathname === "/" || location.pathname === "/user";

  return (
    <>
      {!hideHeader && <Header />}

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/meanu" element={<Menu />} />
        <Route path="/bills" element={<Bills />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/report" element={<Report />} />
        <Route path="/stock" element={<Stock />} />
        <Route path="/user" element={<User />} />
      </Routes>
    </>
  );
}

export default AppWrapper;