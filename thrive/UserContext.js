import React, { createContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { FIREBASE_AUTH, FIRESTORE } from './FirebaseConfig';

// Create a context
export const UserContext = createContext();

// Create a provider component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, async (user) => {
      if (user) {
        setUser(user);

        const userDoc = await getDoc(doc(FIRESTORE, 'users', user.uid));
        if (userDoc.exists()) {
          setUserType(userDoc.data().userType);
        } else {
          console.log("No such document!");
        }
      } else {
        setUserType(null);
        setUser(null);
      }
    });
    return unsubscribe;
  }, []);

  return (
    <UserContext.Provider value={{ user, userType, setUser, setUserType }}>
      {children}
    </UserContext.Provider>
  );
};
