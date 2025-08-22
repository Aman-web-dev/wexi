import React, { useState, useEffect, createContext, useContext } from "react";
import axios from "axios";
import Cookies from "js-cookie";

type User = {
  name: string;
  email: string;
  token: string;
  role: string;
};

const defaultUser = {
  name: "",
  email: "",
  token: "",
  role: "",
};



type AuthContextType = {
  user: User;
  isAuthenticated: boolean;
  login: any;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User>(defaultUser);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Logout function
  const logout = () => {
    setUser(defaultUser);
    setIsAuthenticated(false);
    Cookies.remove("user");
    Cookies.remove("token");
  };

  // Check cookies for user and token on mount
  useEffect(() => {
    const allCookies = Cookies.get();
    console.log("Running use Effect in use Auth");
    const userCookie = allCookies.user;
    const token = allCookies.token;
    console.log(userCookie, token, allCookies);
    if (userCookie && token) {
      try {
        const parsedUser = JSON.parse(userCookie);
        const payload = JSON.parse(atob(token.split(".")[1]));
        console.log(payload);
        const now = Math.floor(Date.now() / 1000);
        if (payload.exp && payload.exp > now) {
          setUser({...parsedUser,token:token});
          setIsAuthenticated(true);
          console.log(parsedUser, true, "Current User in AuthProvider");
        } else {
          logout();
        }
      } catch {
        logout();
      }
    }
  }, []);


  const login = async (email: string, password: string) => {
    const userCookie = Cookies.get("user");
    const token = Cookies.get("token");
    if (userCookie && token) {
      setUser({...JSON.parse(userCookie),token:token});
      setIsAuthenticated(true);
      return { user: JSON.parse(userCookie), token };
    }
    try {
      const res = await axios.post("http://localhost:9000/api/v1/auth/login", {
        email,
        password,
      });
      const { user: userData } = res.data.data;
      const { token: jwt } = res.data;
      Cookies.set("user", JSON.stringify(userData));
      Cookies.set("token", jwt);
      setUser({...userData,token:jwt});
      setIsAuthenticated(true);
      return true;
    } catch (err) {
      console.log(err);
      return false
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
