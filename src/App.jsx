import React from 'react';
import Landing from './components/LandingPage';
import StudentManager from './components/StudentCard';
import './App.css';

function App() {
  return (
    <div className="main-container">
      {/* Hero section with landing content */}
      <Landing />
      
      {/* Main dashboard area */}
      <div id="dashboard-section" className="py-16 bg-[#fdfdf6]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-4xl md:text-5xl font-bold text-[#203021]">
              Dashboard
            </h2>
          </div>
          
          <StudentManager />
        </div>
      </div>

    </div>
  );
}

export default App;
