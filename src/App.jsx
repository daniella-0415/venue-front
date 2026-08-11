import { useState } from 'react';
// Changed "../" to "./" because Components is in the same src folder as App.jsx
import Signup from "./Components/Signup";
import Login from "./Components/Login";
import "./index.css"; 

function App() {
  const [currentView, setCurrentView] = useState('login'); 

  return (
    <div className="App">
      {currentView === 'login' ? (
        <Login onNavigate={() => setCurrentView('signup')} />
      ) : (
        <Signup onNavigate={() => setCurrentView('login')} />
      )}
    </div>
  );
}

export default App;
