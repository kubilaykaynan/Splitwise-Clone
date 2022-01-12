import React from "react";
import AuthContextProvider from "./src/components/Contex";
import UserLogin from "./userLogin";

export default function App() {
  return (
    <AuthContextProvider>
      <UserLogin />
    </AuthContextProvider>
  );
}
