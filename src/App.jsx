import { BrowserRouter,Route, Routes } from "react-router-dom";
import Login from "./pages/auth/login"



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
