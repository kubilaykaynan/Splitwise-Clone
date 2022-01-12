import React from "react";
import { AuthContext } from "./src/components/Contex";
import AppNavigator from "./src/Navigators/AppNavigator";
import MainNavigator from "./src/Navigators/MainNavigator";

const UserLogin = () => {
  const { user } = React.useContext(AuthContext);

  return <>{!user ? <AppNavigator /> : <MainNavigator />}</>;
};

export default UserLogin;
