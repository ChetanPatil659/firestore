import { useEffect, useState } from 'react';
import { db } from './firebase'; // Your Firebase setup
import { collection, doc, setDoc, onSnapshot } from 'firebase/firestore';

function App() {
  const allowedUsers = ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15']; // List of users with unique boxes
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

  console.log(clickedUsers)

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
      console.log('first')
      if (username) {
        const userData = { clicked: clickedUsers[username] ? false : true };
        await setDoc(doc(db, 'users', username), userData);
        console.log('sent')
      }
    } catch (error) {
      console.error('Error writing document:', error.message); // Log detailed error message
    }
  };
  
  return (
    <div style={{height: '100vh', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', }}>
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

      {/* <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
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
      </div> */}

      <div style={{ height: '70%', aspectRatio: '16/9', background: 'red', display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gridTemplateRows: 'repeat(3, 1fr)', gap: '3px', backgroundImage: 'url(https://res.cloudinary.com/dk-find-out/image/upload/q_80,w_1920,f_auto/A-Getty-135226346_mu216z.jpg)', }}>
            {allowedUsers.map((user, index) => (
                <div 
                  key={index} 
                  style={{ background: clickedUsers[user] ? 'transparent' : 'gray', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: isAuthorized && user == username ? 'pointer' : 'not-allowed',}}
                  onClick={isAuthorized && user == username ? handleClick : null}
                >
                  <h1 style={{ color: 'white' }}>

                    {user}
                  </h1>
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


// import React from 'react'
// import Rangoli from './Rangoli'

// function App() {
//   return (
//     <div style={{height: '100vh', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', }}>
//       <Rangoli/>
//     </div>
//   )
// }

// export default App