import { useContext } from "react";
import { UserContext } from "../UserProvider";
import LoggedInButton from "../LoggedInButton";

const LoginButton = () => {
  const { user, signIn, signOut } = useContext(UserContext);

  return (
    <>
      {user == null ? (
        <button
          onClick={signIn}
          className="text-white bg-slate-400 hover:bg-slate-500 transition-colors relative min-w-[5rem] rounded-sm p-2"
        >
          Log In
        </button>
      ) : (
        <LoggedInButton user={user} signOut={signOut}></LoggedInButton>
      )}
    </>
  );
};

export default LoginButton;
