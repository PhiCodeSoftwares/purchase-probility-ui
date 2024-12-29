import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Screen from "./Screen";

const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Screen />} />
          <Route path="/purchase-probility-ui" element={<Screen />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
