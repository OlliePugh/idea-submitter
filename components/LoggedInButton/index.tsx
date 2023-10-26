import { User } from "firebase/auth";
import { useState } from "react";

const LoggedInButton = ({
  user,
  signOut,
}: {
  user: User;
  signOut: () => void;
}) => {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <button
      onMouseOver={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onClick={signOut}
      className="bg-slate-400 text-white hover:bg-slate-500 transition-colors relative min-w-[5rem] rounded-sm p-2"
    >
      <p
        className={`${
          isHovering ? "opacity-0" : "opacity-100"
        } transition-opacity`}
      >
        {user.displayName}
      </p>
      <div
        className={`${
          isHovering ? "opacity-100" : "opacity-0"
        } transition-opacity absolute left-0 right-0 top-0 bottom-0 z-10 flex items-center justify-center`}
      >
        <p className="relative">Sign Out</p>
      </div>
    </button>
  );
};

export default LoggedInButton;
