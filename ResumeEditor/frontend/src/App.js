import React from 'react';
import ResumeEditor from './ResumeEditor';
import './App.css';

function App() {
  return (
    <div className="App">
      <h1>Resume Editor</h1>
      <div className="welcome-banner">
        <span role="img" aria-label="sparkles" style={{fontSize: '24px', marginRight: '10px'}}>✨</span>
        <p style={{color: '#007bff', fontWeight: 'bold', fontSize: '18px', marginBottom: '20px', display: 'inline'}}>
          Welcome! Upload your resume to start editing and enhancing your professional profile.
        </p>
      </div>
      <ResumeEditor />
    </div>
  );
}

export default App;
