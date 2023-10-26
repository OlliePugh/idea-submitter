import { initializeApp } from "firebase/app";
import config from "@/config";
import { getAuth } from "firebase/auth";

// Initialize Firebase
const app = initializeApp(config.firebase);
export const auth = getAuth(app);
