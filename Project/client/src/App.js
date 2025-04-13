import { Route, Routes, Navigate } from "react-router-dom";
import Main from "./components/Main";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Home from "./components/Home";
import OrdersPage from "./components/OrdersPage";
import Combined from "./components/Combined";

function App() {
    const user = localStorage.getItem("token");  

    return (
        <Routes>
            {user && <Route path="/" exact element={<Main />} />}
            <Route path="/signup" exact element={<Signup />} />
            <Route path="/login" exact element={<Login />} />
            <Route path="/home" exact element={<Home />} />
            {user && <Route path="/orders" element={<OrdersPage />} />}  {/* Tylko dla zalogowanych użytkowników */}
            {user && <Route path="/combinations" element={<Combined />} />}  {/* Tylko dla zalogowanych użytkowników */}
            <Route path="/" element={<Navigate replace to="/home" />} />
        </Routes>
    );
}

export default App;