import axios from "axios";
import { useEffect, useState } from "react";
import { ENDPOINT_URL } from "../lib/config";

const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(undefined);

  useEffect(() => {
    try {
      const getUsers = async () => {
        setLoading(true);
        const users = await axios.get(`${ENDPOINT_URL}/users`);
        setUsers(users.data?.users);
      };
      getUsers();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    data: users,
    loading,
    error,
  };
};

export default useUsers;
