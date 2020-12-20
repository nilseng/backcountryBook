import { useAuth0 } from "@auth0/auth0-react";
import React from "react";

const Profile = () => {
  const { isLoading, user } = useAuth0();

  if (isLoading || !user) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <img src={user.picture} alt="Profile" />
      <h2 className="text-light">{user.name}</h2>
      <p className="text-light">{user.email}</p>
      <code>{JSON.stringify(user, null, 2)}</code>
    </>
  );
};

export default Profile;
