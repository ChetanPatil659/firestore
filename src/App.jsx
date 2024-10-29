import { useEffect, useState } from 'react';
import { db } from './firebase'; // Your Firebase setup
import { collection, doc, setDoc, onSnapshot } from 'firebase/firestore';

function App() {
  const allowedUsers =  
  [
    'Pratibha',
    'Amarjeet',
    'Ayushi',
    'Jyoti',
    'Keziah',
    'Yash',
    'Rudranil',
    'Gaurav',
    'Sutithi',
    'Harish',
    'Kiran',
    'Maheer',
    'Margish',
    'Preeti',
    'Raviraj'
  ];
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
    <div style={{height: '100vh', width: '100vw', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'black'}}>
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

      <div style={{ height: '80%', width: '80%', borderRadius: '10px', background: 'red', display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gridTemplateRows: 'repeat(3, 1fr)', gap: '1.5px',   backgroundImage: 'url(https://th.bing.com/th/id/OIG4.f4RIurjqEnX4jFE6tvzH?w=1792&h=1024&rs=1&pid=ImgDetMain)', backgroundRepeat: 'no-repeat', backgroundPosition: 'center', backgroundSize: 'cover' }}>
            {allowedUsers.map((user, index) => (
                <div 
                  key={index} 
                  style={{ background: clickedUsers[user] ? 'transparent' : '#414770', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: isAuthorized && user == username ? 'pointer' : 'not-allowed', transition: 'background ease-in 0.6s, transform ease-in-out 0.6s', borderRadius: '5px' }}
                  onClick={isAuthorized && user == username ? handleClick : null}
                >
                  <p style={{ color: 'white', fontFamily: 'Mr Bedfort', fontSize: '26px' }}>

                    {user}
                  </p>
                </div>
            ))}
        </div>

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










