import React from 'react';
import Signup from "./Components/Signup";
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
