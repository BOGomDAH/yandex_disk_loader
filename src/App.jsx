import {BrowserRouter, Route, Routes} from "react-router-dom";
import Login from "./components/Login/Login.jsx";
import Main from "./components/Main/Main.jsx";

function App() {
    return (
        <BrowserRouter>
            <div className="App">
                <Routes>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/" element={<Main/>}/>
                </Routes>
            </div>
        </BrowserRouter>
    )
}

export default App
