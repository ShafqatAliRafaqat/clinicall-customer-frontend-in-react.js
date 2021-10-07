import React, { Suspense, lazy } from "react";
import { Router, Switch, Route, Redirect } from "react-router-dom";
import { history } from "./history";
import { connect } from "react-redux";
import Spinner from "./components/@vuexy/spinner/Loading-spinner";
import { ContextLayout } from "./utility/context/Layout";
import shortid from "shortid";
import { login } from "./redux/actions/auth/loginActions";

//cliniCall Routes

const cliniCallLogin = lazy(() =>
  import("./cliniCall_pages/authentication/login/Login")
);
const doctorLogin = lazy(() =>
  import("./cliniCall_pages/authentication/doctor_login/Login")
);
const patientLogin = lazy(() =>
  import("./cliniCall_pages/authentication/patient_login/Login")
);
const cliniCallforgotPassword = lazy(() =>
  import("./cliniCall_pages/authentication/ForgotPassword")
);
const cliniCalllockScreen = lazy(() =>
  import("./cliniCall_pages/authentication/LockScreen")
);
const cliniCallresetPassword = lazy(() =>
  import("./cliniCall_pages/authentication/ResetPassword")
);
const cliniCallregister = lazy(() =>
  import("./cliniCall_pages/authentication/register/Register")
);
const otp = lazy(() => import("./cliniCall_pages/authentication/OTP"));
const doctors = lazy(() => import("./cliniCall_pages/doctor"));
const doctorsProfileSettings = lazy(() =>
  import("./cliniCall_pages/doctor/Profile Settings")
);
const doctorsArchive = lazy(() =>
  import("./cliniCall_pages/doctor/Doctor Archive")
);
const organizations = lazy(() => import("./cliniCall_pages/organization"));
const organizationsArchive = lazy(() =>
  import("./cliniCall_pages/organization/Organization Archive")
);
const assignPersmissions = lazy(() =>
  import("./cliniCall_pages/assign_permissions")
);
const permissions = lazy(() => import("./cliniCall_pages/permission"));
const permissionsArchive = lazy(() =>
  import("./cliniCall_pages/permission/Permission Archive")
);
const medicines = lazy(() => import("./cliniCall_pages/medicine"));
const medicinesArchive = lazy(() =>
  import("./cliniCall_pages/medicine/Medicine Archive")
);
const treatments = lazy(() => import("./cliniCall_pages/treatment"));
const treatmentsArchive = lazy(() =>
  import("./cliniCall_pages/treatment/Treatment Archive")
);
const users = lazy(() => import("./cliniCall_pages/user"));
const usersView = lazy(() => import("./cliniCall_pages/user/UserViewPage"));
const usersArchive = lazy(() => import("./cliniCall_pages/user/User Archive"));
const patients = lazy(() => import("./cliniCall_pages/patients"));
const roles = lazy(() => import("./cliniCall_pages/role"));
const rolesArchive = lazy(() => import("./cliniCall_pages/role/Role Archive"));
const error404 = lazy(() => import("./cliniCall_pages/misc/error/404"));
const dashboard = lazy(() => import("./cliniCall_pages/dashboard"));
const drLandingPage = lazy(() => import("./cliniCall_pages/profile/index"));

// Set Layout and Component Using App Route
const RouteConfig = ({ component: Component, fullLayout, ...rest }) => (
  <Route
    {...rest}
    render={(props) => {
      return (
        <ContextLayout.Consumer>
          {(context) => {
            let LayoutTag =
              fullLayout === true
                ? context.fullLayout
                : context.state.activeLayout === "horizontal"
                ? context.horizontalLayout
                : context.VerticalLayout;
            return (
              <LayoutTag {...props} permission={props.user}>
                <Suspense fallback={<Spinner />}>
                  <Component {...props} />
                </Suspense>
              </LayoutTag>
            );
          }}
        </ContextLayout.Consumer>
      );
    }}
  />
);
const mapStateToProps = (state) => {
  return {
    user: state.auth.login,
  };
};

const AppRoute = connect(mapStateToProps)(RouteConfig);

class AppRouter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      publicRoutes: [
        //cliniCall route object
        // {
        //   id: shortid.generate(),
        //   path: "/",
        //   component: dashboard,
        //   isPublic: true,
        // },
        {
          id: shortid.generate(),
          exact: true,
          path: "/login/:dr",
          component: drLandingPage,
          fullLayout: true,
        },
        {
          id: shortid.generate(),
          exact: true,
          path: "/login",
          component: cliniCallLogin,
          fullLayout: true,
        },
        {
          id: shortid.generate(),
          exact: true,
          path: "/doctor/login",
          component: doctorLogin,
          fullLayout: true,
        },
        {
          id: shortid.generate(),
          path: "/register",
          component: cliniCallregister,
          fullLayout: true,
        },
        {
          id: shortid.generate(),
          path: "/forgot-password",
          component: cliniCallforgotPassword,
          fullLayout: true,
        },
        {
          id: shortid.generate(),
          path: "/otp",
          component: otp,
          fullLayout: true,
        },
        {
          id: shortid.generate(),
          path: "/lock-screen",
          component: cliniCalllockScreen,
          fullLayout: true,
        },
        {
          id: shortid.generate(),
          path: "/reset-password/:filter/:fil",
          component: cliniCallresetPassword,
          fullLayout: true,
        },
        //   {
        //     id: shortid.generate(),
        //     path: "/organizations",
        //     component: organizations,
        //   },
        //   {
        //     id: shortid.generate(),
        //     path: "/archive/organizations",
        //     component: organizationsArchive,
        //   },
      ],
      privateRoutes: [
        //cliniCall route object
        {
          id: shortid.generate(),
          path: "/",
          component: dashboard,
          isPublic: true,
        },
        {
          id: shortid.generate(),
          path: "/doctors",
          component: doctors,
        },
        {
          id: shortid.generate(),
          path: "/patients",
          component: patients,
        },
        {
          id: shortid.generate(),
          path: "/profile_settings",
          component: doctorsProfileSettings,
        },
        {
          id: shortid.generate(),
          path: "/archive/doctors",
          component: doctorsArchive,
        },
        {
          id: shortid.generate(),
          path: "/medicines",
          component: medicines,
        },
        {
          id: shortid.generate(),
          path: "/archive/medicines",
          component: medicinesArchive,
        },
        {
          id: shortid.generate(),
          path: "/treatments",
          component: treatments,
        },
        {
          id: shortid.generate(),
          path: "/archive/treatments",
          component: treatmentsArchive,
        },
        {
          id: shortid.generate(),
          path: "/organizations",
          component: organizations,
        },
        {
          id: shortid.generate(),
          path: "/archive/organizations",
          component: organizationsArchive,
        },
        {
          id: shortid.generate(),
          path: "/roles/assign-persmissions",
          component: assignPersmissions,
        },
        {
          id: shortid.generate(),
          path: "/permissions",
          component: permissions,
        },
        {
          id: shortid.generate(),
          path: "/archive/permissions",
          component: permissionsArchive,
        },
        {
          id: shortid.generate(),
          path: "/roles",
          component: roles,
        },
        {
          id: shortid.generate(),
          path: "/archive/roles",
          component: rolesArchive,
        },
        {
          id: shortid.generate(),
          path: "/users",
          component: users,
        },
        {
          id: shortid.generate(),
          path: "/archive/users",
          component: usersArchive,
        },
        {
          id: shortid.generate(),
          path: "/users/view",
          component: usersView,
        },
      ],
    };
  }

  render() {
    return (
      // Set the directory path if you are deploying in sub-folder
      <Router history={history}>
        <Switch>
          {this.props.user.userData
            ? this.state.privateRoutes.map((route) => (
                <AppRoute
                  key={route.id}
                  exact
                  path={route.path}
                  component={route.component}
                  fullLayout={route.fullLayout}
                />
              ))
            : this.state.publicRoutes.map((route) => (
                <AppRoute
                  key={route.id}
                  exact
                  path={route.path}
                  component={route.component}
                  fullLayout={route.fullLayout}
                />
              ))}
          <AppRoute component={error404} fullLayout />
        </Switch>
      </Router>
    );
  }
}

// export default AppRouter;
// const mapStateToProps = (state) => {
//   return {
//     values: state.auth.login,
//   };
// };
export default connect(mapStateToProps, {
  login,
})(AppRouter);
