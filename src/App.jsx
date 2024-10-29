import { useEffect, useState } from 'react';
import { db } from './firebase'; // Your Firebase setup
import { collection, doc, setDoc, onSnapshot } from 'firebase/firestore';

function App() {
  const allowedUsers = ['Alice', 'Bob', 'Charlie']; // List of users with unique boxes
  const [username, setUsername] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [showModal, setShowModal] = useState(true); // Control modal visibility
  const [clickedUsers, setClickedUsers] = useState({}); // Track all users' click statuses

  useEffect(() => {
    // Listen for real-time updates of all users' click statuses
    const unsubscribe = onSnapshot(collection(db, 'users'), (snapshot) => {
      const usersData = {};
      snapshot.forEach((doc) => {
        usersData[doc.id] = doc.data().clicked;
      });
      setClickedUsers(usersData);
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = () => {
    if (allowedUsers.includes(username)) {
      setIsAuthorized(true);
    }
    setShowModal(false); // Close the modal
  };

  const handleCancel = () => {
    setShowModal(false); // Close the modal without authorization
  };

  const handleClick = async () => {
    try {
      if (username) {
        const userData = { clicked: clickedUsers[username] ? false : true };
        await setDoc(doc(db, 'users', username), userData);
      }
    } catch (error) {
      console.error('Error writing document:', error.message); // Log detailed error message
    }
  };
  

  return (
    <div>
      {showModal && (
        <div style={modalStyles.overlay}>
          <div style={modalStyles.modal}>
            <h2>Enter Your Username</h2>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              style={modalStyles.input}
            />
            <div style={modalStyles.buttonContainer}>
              <button onClick={handleSubmit} style={modalStyles.button}>Submit</button>
              <button onClick={handleCancel} style={modalStyles.cancelButton}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
        {allowedUsers.map((user) => (
          <div
            key={user}
            onClick={isAuthorized && user === username ? handleClick : null} // Clickable only for authorized user's own box
            style={{
              width: '50px',
              height: '50px',
              backgroundColor: clickedUsers[user] ? 'blue' : 'gray',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              cursor: isAuthorized && user === username ? 'pointer' : 'not-allowed',
              borderRadius: '5px',
            }}
          >
            {user}
          </div>
        ))}
      </div>
      {!isAuthorized && !showModal && <p>You are viewing as a guest. Boxes are not clickable.</p>}
    </div>
  );
}

// Basic modal styling
const modalStyles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modal: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '5px',
    textAlign: 'center',
  },
  input: {
    width: '80%',
    padding: '8px',
    marginBottom: '10px',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  cancelButton: {
    padding: '10px 20px',
    backgroundColor: '#ccc',
    color: 'black',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default App;
