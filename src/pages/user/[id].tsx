import React from "react";
import { useParams } from "react-router-dom";

const User = () => {
  const params = useParams();
  return <div>User with id {params.id}</div>;
};

export default User;
