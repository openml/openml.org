import React, { useEffect } from "react";
import { useRouter } from "next/router";

import useAuth from "../../hooks/useAuth";

// For routes that can only be accessed by authenticated users
function AuthGuard({ children }) {
  const { isAuthenticated, isInitialized } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      router.push("/auth/sign-in");
    }
  }, [isInitialized, isAuthenticated, router]);

  return isInitialized && isAuthenticated ? (
    <React.Fragment>{children}</React.Fragment>
  ) : (
    <React.Fragment />
  );
}

export default AuthGuard;
