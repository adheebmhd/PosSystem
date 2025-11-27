import { BrowserRouter as Router,Routes,Route } from "react-router-dom"
import{Login,Menu,Bills,Payment,Report,Stock,User} from "./pages";
import { Header } from "./components/shared";


function App() {
  const hideHeader = location.pathname === "/" ;
  const hideHeade = location.pathname ===  "/user";

  

  return (
    <>
      <Router>
        {!hideHeader && !hideHeade && <Header />}
        
        <Routes>
          <Route path="/" element={<Login />}  />
          <Route path="/meanu" element={<Menu />} />
          <Route path="/bills" element={<Bills />} />
          <Route path="/payment" element={<Payment />}/>
          <Route path="/report" element={<Report />}/>
          <Route path="/stock" element={<Stock />}/>
          <Route path="/user" element={<User />}/>
        </Routes>
      </Router>
      
    </>
  )
}

export default App
