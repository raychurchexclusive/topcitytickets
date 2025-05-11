// src/context/AuthContext.js

import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase'; // Corrected import path for firebase.js

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // Store user and role together
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // To track any error during user data fetching

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true); // Set loading true until we fetch the user data

      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            // Set the user with their role
            setUser({ ...firebaseUser, role: userDoc.data().role });
          } else {
            // If the user doesn't exist in the Firestore, handle it explicitly
            setUser({ ...firebaseUser, role: null });
          }
        } catch (error) {
          console.error('Error fetching user role:', error);
          setError(error); // Capture error and display later
          setUser(null);
        }
      } else {
        setUser(null); // No user signed in, reset state
      }

      setLoading(false); // Set loading to false once the user state is set
    });

    return unsubscribe; // Cleanup the subscription on unmount
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, error }}>
      {!loading && !error && children} {/* Render children if not loading and no error */}
      {error && <div>Error loading user data: {error.message}</div>} {/* Show error message if there's an error */}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}