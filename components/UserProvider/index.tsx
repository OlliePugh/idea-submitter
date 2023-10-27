"use client";
import { useState, createContext, useEffect, ReactNode } from "react";
import {
  GoogleAuthProvider,
  User,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { auth } from "@/utils/firebase";

interface UserContextContent {
  user?: User;
  signIn: () => void;
  signOut: () => void;
}

const notInitialisedMethod = () => {
  throw new Error("Auth Not Initialised");
};

export const UserContext = createContext<UserContextContent>({
  signIn: notInitialisedMethod,
  signOut: notInitialisedMethod,
});

const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userData, setUserData] = useState<User | undefined>();
  const provider = new GoogleAuthProvider();

  const signInWrapper = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      setUserData(result.user);
    } catch (e) {
      console.error(e);
    }
  };

  const signOutWrapper = () => {
    signOut(auth).then((_) => {
      setUserData(undefined);
    });
  };

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setUserData(user);
      }
    });
  }, [userData]);

  return (
    <UserContext.Provider
      value={{ signIn: signInWrapper, signOut: signOutWrapper, user: userData }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
