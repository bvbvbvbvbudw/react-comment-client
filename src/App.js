import './App.css';
import { BrowserRouter, Route, Routes, useParams } from "react-router-dom";
import Main from "./Pages/Main";
import Form from "./Components/content/Form";

import './styles/style.css'

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Main />} />
                    <Route path="/create/:parent_id" element={<CreateCommentForm />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

function CreateCommentForm() {
    const params = useParams();
    const parentId = params.parent_id;
    return <Form parentId={parentId} />;
}

export default App;
