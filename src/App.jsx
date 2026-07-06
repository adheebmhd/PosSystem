import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { Login, Menu, Bills, Payment, Report, Stock, User } from "./pages";
import { Header } from "./components/shared";
import ProtectedRoute from "./components/shared";


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

  <Route
    path="/meanu"
    element={
      <ProtectedRoute>
        <Menu />
      </ProtectedRoute>
    }
  />

  <Route
    path="/bills"
    element={
      <ProtectedRoute>
        <Bills />
      </ProtectedRoute>
    }
  />

  <Route
    path="/payment"
    element={
      <ProtectedRoute>
        <Payment />
      </ProtectedRoute>
    }
  />

  <Route
    path="/report"
    element={
      <ProtectedRoute>
        <Report />
      </ProtectedRoute>
    }
  />

  <Route
    path="/stock"
    element={
      <ProtectedRoute>
        <Stock />
      </ProtectedRoute>
    }
  />

  <Route
    path="/user"
    element={
      <ProtectedRoute>
        <User />
      </ProtectedRoute>
    }
  />
</Routes>
    </>
  );
}

export default AppWrapper;