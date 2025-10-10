import { useLocation } from "react-router";
import Navigation from "./components/Layout/Navigation.tsx";
import Footer from "./components/Layout/Footer.tsx";
import { useMediaQuery, useScrollToTop } from "./utils/customHooks.ts";
import { PrivateRoute, AuthRoute, MainRouter } from "./routes";

const App = () => {
  const location = useLocation();
  const isTablet = useMediaQuery("(min-width: 768px)");
  useScrollToTop();

  // Auth routes
  if (
    ["/login", "/register", "/reset"].includes(location.pathname) ||
    location.pathname.startsWith("/reset-password/")
  ) {
    return (
      <AuthRoute>
        <MainRouter />
      </AuthRoute>
    );
  }

  // Private routes
  return (
    <PrivateRoute>
      <div className="flex flex-col min-h-screen">
        {isTablet ? (
          // Desktop/Tablet layout
          <>
            <div className="flex flex-col md:flex-row">
              <Navigation />
              <div className="w-full min-h-[calc(100vh-176px)]">
                <MainRouter />
              </div>
            </div>
            <Footer />
          </>
        ) : (
          // Mobile layout
          <>
            <div className="flex flex-col md:flex-row overflow-y-scroll h-[calc(100vh-81px)]">
              <MainRouter />
            </div>
            <Navigation />
          </>
        )}
      </div>
    </PrivateRoute>
  );
};

export default App;
