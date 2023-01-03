import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";

import { useAuth } from "data/state/auth.state";
import { setAuthHeader } from "client/utils/axios.utils";
import { AppRoutes } from "client/routes/app";

import { Contact } from "components/contact";
import { LayoutApp } from "components/layout";
import { Login } from "components/login";
import { NewPassword } from "components/new-password";
import { Dashboard } from "components/dashboard";
import { Profile } from "components/profile";
import { NewOrganization } from "components/organizations-new";
import { Users } from "components/users";
import { CreateUser } from "components/users-create";
import { Organization } from "components/organization";

import { AdminRoute, PrivateRoute, SuperUserRoute } from "components/routes";

const queryClient = new QueryClient();

function App() {
  const { idToken } = useAuth();

  if (idToken) {
    setAuthHeader(idToken);
  }

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path={AppRoutes.Contact} element={<Contact />} />
          <Route path={AppRoutes.Login} element={<Login />} />
          <Route path={AppRoutes.NewPassword} element={<NewPassword />} />

          <Route path="/app" element={<LayoutApp />}>
            {/* User Routes */}
            <Route path="/app" element={<PrivateRoute />}>
              <Route path={AppRoutes.Dashboard} element={<Dashboard />} />
              <Route path={AppRoutes.Profile} element={<Profile />} />
            </Route>

            {/* Admin Routes */}
            <Route path="/app" element={<AdminRoute />}>
              <Route path={AppRoutes.Users} element={<Users />} />
              <Route path={AppRoutes.NewUser} element={<CreateUser />} />
              <Route path={AppRoutes.Organization} element={<Organization />} />
            </Route>

            {/* Super User Routes */}
            <Route path="/app" element={<SuperUserRoute />}>
              <Route
                path={AppRoutes.NewOrganization}
                element={<NewOrganization />}
              />
            </Route>

            {/* <Route
              path="/app/*"
              element={
                <Error override={{ code: 404, message: "Page Not Found" }} />
              }
            /> */}
          </Route>
        </Routes>
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
    </QueryClientProvider>
  );
}

export default App;
