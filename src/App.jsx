
import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import logo from './logo.svg';
import { db } from './firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import './App.css';

function HomeScreen() {
  return (
    <div className="container">
      <img src={logo} alt="ADHD Pad" className="logo" />
      <div className="domain-name">ADHDPad.com</div>
      <h1 className="title">Turn Your Ideas into Action</h1>
      <p className="subtitle">Capture, organize, and complete tasks with ADHD Pad</p>
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
  const [isRecording, setIsRecording] = React.useState(false);
  const [audioURL, setAudioURL] = React.useState('');
  const [transcribedText, setTranscribedText] = React.useState('');
  const [savedTranscriptions, setSavedTranscriptions] = React.useState([]);
  const [error, setError] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    const fetchTranscriptions = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'transcriptions'));
        const transcriptionsList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setSavedTranscriptions(transcriptionsList);
      } catch (error) {
        setError('Error fetching transcriptions: ' + error.message);
      }
    };
    fetchTranscriptions();
  }, []);
  const mediaRecorder = React.useRef(null);
  const audioChunks = React.useRef([]);
  const recognition = React.useRef(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      audioChunks.current = [];

      mediaRecorder.current.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };

      mediaRecorder.current.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
        audioChunks.current = [];
      };

      mediaRecorder.current.start();
      setIsRecording(true);

      try {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
          recognition.current = new SpeechRecognition();
          recognition.current.continuous = true;
          recognition.current.interimResults = true;
          recognition.current.lang = 'en-US';

          recognition.current.onstart = () => {
            console.log('Speech recognition started');
          };

          recognition.current.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            setTranscribedText(prev => prev + `\nError: ${event.error}. Please try again.`);
            if (event.error === 'network') {
              setTranscribedText(prev => prev + '\nPlease check your internet connection.');
            } else if (event.error === 'audio-capture') {
              setTranscribedText(prev => prev + '\nNo microphone was found or permission was denied.');
            }
            stopRecording();
          };

          recognition.current.onend = () => {
            console.log('Speech recognition ended');
          };

          recognition.current.onresult = (event) => {
            const transcript = event.results[event.results.length - 1][0].transcript;
            setTranscribedText(prev => prev + ' ' + transcript);
          };

          recognition.current.start();
        }
      } catch (speechError) {
        console.error('Speech recognition error:', speechError);
      }
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Error accessing microphone. Please ensure you've granted permission.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      if (recognition.current) {
        recognition.current.stop();
      }
      setIsRecording(false);
      mediaRecorder.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const saveTranscription = async () => {
    if (!transcribedText.trim()) {
      setError("Please record some text before saving.");
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      if (!db) {
        throw new Error("Firebase database is not initialized");
      }

      const transcriptionsRef = collection(db, 'transcriptions');
      // Extract title (first sentence or first X words)
      const sentences = transcribedText.split(/[.!?]+/);
      const firstSentence = sentences[0].trim();
      const title = firstSentence.length > 50 ? 
        firstSentence.split(' ').slice(0, 5).join(' ') + '...' : 
        firstSentence;

      // Extract description (next few sentences or remaining text)
      const description = sentences.slice(1, 3)
        .join('. ')
        .trim() || firstSentence;

      const docRef = await addDoc(transcriptionsRef, {
        title,
        description,
        text: transcribedText,
        timestamp: new Date().toLocaleString(),
        createdAt: new Date()
      });

      const newTranscription = {
        id: docRef.id,
        title,
        description,
        text: transcribedText,
        timestamp: new Date().toLocaleString()
      };

      setSavedTranscriptions(prev => [...prev, newTranscription]);
      setTranscribedText('');
      setAudioURL('');
      
      if (isRecording) {
        stopRecording();
      }

      alert("Transcription saved successfully!");
    } catch (error) {
      console.error("Error saving transcription:", error);
      setError(`Failed to save: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <Link to="/" className="back-button">← Back</Link>
      <h1 className="title">Voice Recorder</h1>
      <div className="recorder-controls">
        {!isRecording ? (
          <button className="button" onClick={startRecording}>
            Start Recording
          </button>
        ) : (
          <button className="button recording" onClick={stopRecording}>
            Stop Recording
          </button>
        )}
        {audioURL && (
          <div className="audio-player">
            <audio controls src={audioURL} />
          </div>
        )}
        <div className="transcription">
          <h3>Transcription:</h3>
          <p>{transcribedText || "Transcription will appear here when you record and speak..."}</p>
          {error && <div className="error-message">{error}</div>}
          <button 
            className="button" 
            onClick={saveTranscription} 
            disabled={!transcribedText.trim() || isLoading}
          >
            {isLoading ? 'Saving...' : 'Save Transcription'}
          </button>
        </div>
        <div className="saved-transcriptions">
          <h3>Saved Transcriptions</h3>
          {savedTranscriptions.map(item => (
            <div key={item.id} className="transcription-item">
              <h4>{item.title}</h4>
              <p>{item.description}</p>
              <small>{item.timestamp}</small>
              <button 
                className="convert-task-button"
                onClick={async () => {
                  try {
                    const sentences = item.text.split(/[.!?]+/);
                    const title = sentences[0].length > 50 ? 
                      sentences[0].substring(0, 50) + '...' : 
                      sentences[0];
                    const description = sentences.slice(1).join('. ').trim() || title;

                    const newTask = {
                      title,
                      description,
                      text: item.text,
                      completed: false,
                      createdAt: new Date().toLocaleString()
                    };

                    // Add to Firestore tasks collection
                    await addDoc(collection(db, 'tasks'), newTask);
                    
                    // Delete from transcriptions
                    const transcriptionsRef = collection(db, 'transcriptions');
                    await deleteDoc(doc(transcriptionsRef, item.id));
                    setSavedTranscriptions(prev => prev.filter(t => t.id !== item.id));
                    alert('Task created! Check the Task List.');
                  } catch (error) {
                    console.error("Error converting task:", error);
                    alert('Error creating task. Please try again.');
                  }
                }}
              >
                Convert to Task
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TaskListScreen() {
  const [tasks, setTasks] = React.useState([]);
  const [newTask, setNewTask] = React.useState('');
  const [searchQuery, setSearchQuery] = React.useState('');
  
  const filteredTasks = tasks.filter(task => 
    task.text?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  React.useEffect(() => {
    const fetchTasks = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'tasks'));
        const tasksList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setTasks(tasksList);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };
    fetchTasks();
  }, []);

  const addTask = async (e) => {
    e.preventDefault();
    if (newTask.trim()) {
      try {
        const sentences = newTask.split(/[.!?]+/);
        const title = sentences[0].length > 50 ? 
          sentences[0].substring(0, 50) + '...' : 
          sentences[0];
        const description = sentences.slice(1).join('. ').trim() || title;
        
        const taskRef = await addDoc(collection(db, 'tasks'), {
          title,
          description,
          text: newTask,
          completed: false,
          createdAt: new Date().toLocaleString()
        });
        
        setTasks([...tasks, {
          id: taskRef.id,
          title,
          description,
          text: newTask,
          completed: false,
          createdAt: new Date().toLocaleString()
        }]);
        setNewTask('');
      } catch (error) {
        console.error("Error adding task:", error);
      }
    }
  };

  const toggleTask = async (taskId) => {
    try {
      const taskRef = doc(db, 'tasks', taskId);
      const task = tasks.find(t => t.id === taskId);
      await updateDoc(taskRef, {
        completed: !task.completed
      });
      setTasks(tasks.map(task => 
        task.id === taskId ? { ...task, completed: !task.completed } : task
      ));
    } catch (error) {
      console.error("Error toggling task:", error);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await deleteDoc(doc(db, 'tasks', taskId));
      setTasks(tasks.filter(task => task.id !== taskId));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <div className="container">
      <Link to="/" className="back-button">← Back</Link>
      <h1 className="title">Task List</h1>
      <div className="task-container">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search tasks..."
          className="task-input"
          style={{ marginBottom: '10px' }}
        />
        <form onSubmit={addTask} className="task-form">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Enter a new task..."
            className="task-input"
          />
          <button type="submit" className="button">Add Task</button>
        </form>
        <div className="task-list">
          {filteredTasks.map(task => (
            <div key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task.id)}
              />
              <div className="task-content">
                <h4 className="task-title">{task.title}</h4>
                {task.description && <p className="task-description">{task.description}</p>}
              </div>
              <small>{task.createdAt}</small>
              <button onClick={() => deleteTask(task.id)} className="delete-button">
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
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
