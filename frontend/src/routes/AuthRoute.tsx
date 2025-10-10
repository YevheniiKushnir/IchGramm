import { ReactNode, useEffect, useState } from "react";
import { Navigate } from "react-router";
import { checkJWTToken } from "../utils/apiCalls/authApi.ts";
import { Spinner } from "../components/ui";

const AuthRoute = ({ children }: { children: ReactNode }) => {
  const [isNotAuthenticated, setIsNotAuthenticated] = useState<boolean | null>(
    null
  );

  useEffect(() => {
    const checkAuth = async () => {
      const response = await checkJWTToken();
      setIsNotAuthenticated(!response);
    };
    checkAuth();
  }, []);

  if (isNotAuthenticated === null) {
    return <Spinner />;
  }

  return isNotAuthenticated ? children : <Navigate to="/" replace />;
};

export default AuthRoute;
