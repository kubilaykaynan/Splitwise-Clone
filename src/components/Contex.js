import React, { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useState } from "react";
import axios from "axios";
import { ENDPOINT_URL } from "../lib/config";

export const AuthContext = createContext({
  user: undefined,
  setUser: undefined,
});

const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState();

  useEffect(() => {
    const isUser = async () => {
      AsyncStorage.getItem("user")
        .then((data) => {
          setUser(JSON.parse(data));
        })
        .catch((err) => {
          setUser(null);
        });
    };
    isUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login: async (username, password) => {
          const { data } = await axios.post(`${ENDPOINT_URL}/login`, {
            kullaniciAdi: username,
            sifre: password,
          });
          await AsyncStorage.setItem("user", JSON.stringify(data));
          setUser(data);
        },
        register: async ({ username, password, name, email, surname }) => {
          axios.post(`${ENDPOINT_URL}/register`, {
            kullaniciAdi: username,
            sifre: password,
            email,
            soyadi: surname,
            adi: name,
          });
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
