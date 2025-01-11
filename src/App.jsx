import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import './App.css';

function HomeScreen() {
  return (
    <div className="container">
      <h1 className="title">Welcome to ADHD Pad!</h1>
      <div className="buttonContainer">
        <Link to="/voice-recorder" className="button">
          <span className="buttonText">Voice Recorder</span>
        </Link>
        <Link to="/task-list" className="button">
          <span className="buttonText">Task List</span>
        </Link>
      </div>
    </div>
  );
}

function VoiceRecorderScreen() {
  return (
    <div className="container">
      <h1 className="title">Voice Recorder</h1>
    </div>
  );
}

function TaskListScreen() {
  return (
    <div className="container">
      <h1 className="title">Task List</h1>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/voice-recorder" element={<VoiceRecorderScreen />} />
        <Route path="/task-list" element={<TaskListScreen />} />
      </Routes>
    </BrowserRouter>
  );
}