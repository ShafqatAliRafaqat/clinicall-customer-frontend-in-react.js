import * as firebase from "firebase/app";
import { history } from "../../../history";
import "firebase/auth";
import "firebase/database";
import axios from "axios";
import { BASE_URL_API } from "../../../configs/constants";
import { config } from "../../../authServices/firebase/firebaseConfig";
import { getCountries } from "../countries";

// Init firebase if not already initialized
if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

let firebaseAuth = firebase.auth();

// const initAuth0 = new auth0.WebAuth(configAuth)

export const submitLoginWithFireBase = (email, password, remember) => {
  return (dispatch) => {
    let userEmail = null,
      loggedIn = false;
    firebaseAuth
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
        firebaseAuth.onAuthStateChanged((user) => {
          result.user.updateProfile({
            displayName: "Admin",
          });
          let name = result.user.displayName;
          if (user) {
            userEmail = user.email;
            loggedIn = true;
            dispatch({
              type: "LOGIN_WITH_EMAIL",
              payload: {
                email: userEmail,
                name,
                isSignedIn: loggedIn,
                loggedInWith: "firebase",
              },
            });
          }
          if (user && remember) {
            firebase
              .auth()
              .setPersistence(firebase.auth.Auth.Persistence.SESSION)
              .then(() => {
                dispatch({
                  type: "LOGIN_WITH_EMAIL",
                  payload: {
                    email: userEmail,
                    name,
                    isSignedIn: loggedIn,
                    remember: true,
                    loggedInWith: "firebase",
                  },
                });
              });
          }
          history.push("/");
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };
};

export const loginWithFB = () => {
  return (dispatch) => {
    let provider = new firebase.auth.FacebookAuthProvider();
    provider.setCustomParameters({
      display: "popup",
    });
    firebaseAuth
      .signInWithPopup(provider)
      .then((result) => {
        // This gives you a Facebook Access Token. You can use it to access the Facebook API.
        let token = result.credential.accessToken,
          // The signed-in user info.
          user = result.user.email;
        dispatch({
          type: "LOGIN_WITH_FB",
          payload: {
            user,
            token,
            loggedInWith: "firebase",
          },
        });
        if (user) history.push("/");
      })
      .catch((error) => {
        console.log(error);
      });
  };
};

export const loginWithTwitter = () => {
  return (dispatch) => {
    let provider = new firebase.auth.TwitterAuthProvider();
    firebaseAuth
      .signInWithPopup(provider)
      .then(function (result) {
        let token = result.credential.accessToken,
          user = result.user.email,
          name = result.user.displayName,
          photoUrl = result.user.photoURL;
        dispatch({
          type: "LOGIN_WITH_TWITTER",
          payload: {
            user,
            name,
            photoUrl,
            token,
            loggedInWith: "firebase",
          },
        });
        history.push("/");
      })
      .catch(function (error) {
        console.log(error);
      });
  };
};

export const loginWithGoogle = () => {
  return (dispatch) => {
    let provider = new firebase.auth.GoogleAuthProvider();
    firebaseAuth
      .signInWithPopup(provider)
      .then(function (result) {
        let token = result.credential.accessToken,
          user = result.user.email,
          name = result.user.displayName,
          photoUrl = result.user.photoURL;
        dispatch({
          type: "LOGIN_WITH_GOOGLE",
          payload: {
            email: user,
            name: name,
            photoUrl,
            token,
            loggedInWith: "firebase",
          },
        });
        history.push("/");
      })
      .catch(function (error) {
        console.log(error);
      });
  };
};

export const loginWithGithub = () => {
  return (dispatch) => {
    let provider = new firebase.auth.GithubAuthProvider();
    firebaseAuth
      .signInWithPopup(provider)
      .then(function (result) {
        let token = result.credential.accessToken,
          user = result.user.email,
          name = result.additionalUserInfo.username,
          photoUrl = result.user.photoURL;

        dispatch({
          type: "LOGIN_WITH_GITHUB",
          payload: {
            user,
            name,
            photoUrl,
            token,
            loggedInWith: "firebase",
          },
        });
        history.push("/");
      })
      .catch(function (error) {
        console.log(error);
      });
  };
};
export const login = (loginCrediantials) => async (dispatch) => {
  try {
    const response = await axios.post(
      `${BASE_URL_API}login`,
      loginCrediantials
    );
    getCountries();
    dispatch({ type: "LOGIN", payload: response.data.data });
    history.push("/");
  } catch (err) {
    if (err.response) {
      return err.response.data.message;
    }
    return "Something went wrong!";
  }
};
export const loginAction = (user) => {
  return (dispatch) => {
    try {
      axios
        .post("http://5158e6cffa6b.ngrok.io/api/login", user)
        .then((response) => {
          const res = response.data.data;
          if (res.success) {
            console.log("logged in");
            dispatch({
              type: "LOGIN",
              payload: res,
            });
            history.push("/login");
          }
        });
    } catch (err) {
      console.log(err);
    }
  };
};

export const logout = (token, actor) => async (dispatch) => {
  try {
    const response = await axios.post(`${BASE_URL_API}logout`, undefined, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    dispatch({ type: "LOGOUT", payload: response.data.data });
    if (actor === "DOCTOR") {
      history.push("/doctor/login");
    } else {
      history.push("/login");
    }
    return response.data.message;
  } catch (err) {
    if (err.response && err.response.data.message === "Unauthenticated")
      dispatch({ type: "LOGOUT" });
    if (err.response) {
      return err.response.data.message;
    }
  }
};

export const logoutWithFirebase = (user) => {
  return (dispatch) => {
    dispatch({ type: "LOGOUT_WITH_FIREBASE", payload: {} });
    history.push("/login/drn");
  };
};

export const changeRole = (role) => {
  return (dispatch) => dispatch({ type: "CHANGE_ROLE", userRole: role });
};
