import React from "react";

const page = () => {
  const frineds = [
    { id: 1, name: "김개똥" },
    { id: 2, name: "이개똥" },
    { id: 3, name: "박개똥" },
  ];
  return (
    <div>
      {frineds.map((friend) => (
        <div key={friend.id}>{friend.name}</div>
      ))}
    </div>
  );
};

export default page;
