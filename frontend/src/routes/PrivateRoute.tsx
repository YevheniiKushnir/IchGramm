import { ReactNode, useEffect, useState } from "react";
import { Navigate } from "react-router";
import { checkJWTToken } from "../utils/apiCalls/authApi.ts";
import { Spinner } from "../components/ui";

const PrivateRoute = ({ children }: { children: ReactNode }) => {
  const [isNotAuthenticated, setIsNotAuthenticated] = useState<boolean | null>(
    null
  );

  useEffect(() => {
    const handleCheck = async () => {
      const response = await checkJWTToken();
      setIsNotAuthenticated(!response);
    };
    handleCheck();
  }, []);

  if (isNotAuthenticated === null) {
    return <Spinner />;
  }

  return isNotAuthenticated ? <Navigate to="/login" replace /> : children;
};

export default PrivateRoute;
