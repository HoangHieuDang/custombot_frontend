import { Users } from "./api/usersApi";
import { Parts } from "./api/partsApi";

import { useState } from "react";
import { useEffect } from "react";

const TestApi = () => {
  const dbApi = new Users();
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    dbApi.getUser({ id: 1 }).then((data) => {
      setUserInfo(data);
    });
  }, []);

  function userInfoHandler() {
    if (!userInfo) return "userInfo empty";

    return userInfo.map((user) => (
      <div key={user.id}>
        <h2>Username: {user.username}</h2>
        <p>user_id: {user.id}</p>
        <p>Email: {user.email}</p>
      </div>
    ));
  }

  function createUser(newUserData) {
    console.log(newUserData.get("username"));
  }

  return (
    <>
      <h1>User {userInfo?userInfo.map((user) => user.id):""} info</h1>
      <div>{userInfoHandler()}</div>
      <h1>Add an user</h1>
      <form action={createUser}>
        <label htmlFor="email">Email:</label>
        <input
          id="email"
          type="email"
          name="email"
          placeholder="joe@schmoe.com"
        />

        <label htmlFor="username">Username:</label>
        <input id="username" name="username" placeholder="joeSchmoe1234!" />

        <label htmlFor="password">Password:</label>
        <input id="password" type="password" name="password" />

        <button type="submit">Submit</button>
      </form>
    </>
  );
};

export default TestApi;
