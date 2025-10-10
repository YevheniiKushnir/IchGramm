import { useLocation, Routes, Route } from "react-router";
import {
  EditProfilePage,
  NotFoundPage,
  ExplorePage,
  HomePage,
  LoginPage,
  PostPage,
  ProfilePage,
  RegisterPage,
  ResetPassPage,
  MessagesPage,
  ResetConfirmPage
} from "../pages";
import { Messages } from "../components/Messages.tsx";
import { PostModal } from "../components/Posts";

const MainRouter = () => {
  const location = useLocation();
  const state = location.state as { backgroundLocation?: Location };

  return (
    <>
      <Routes location={state?.backgroundLocation || location}>
        {/* Public Routes */}
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/reset" element={<ResetPassPage />} />
        <Route path="/reset-password/:token" element={<ResetConfirmPage />} />

        {/* Protected Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/profile/:username" element={<ProfilePage />} />
        <Route path="/profile/:username/edit" element={<EditProfilePage />} />
        <Route path="/messages" element={<MessagesPage />}>
          <Route path=":username" element={<Messages />} />
        </Route>
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/post/:postId" element={<PostPage />} />

        {/* Fallback Route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      {/* Modal for Posts */}
      {state?.backgroundLocation && (
        <Routes>
          <Route path="/post/:postId" element={<PostModal />} />
        </Routes>
      )}
    </>
  );
};

export default MainRouter;