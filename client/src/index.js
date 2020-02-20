import "bootstrap/dist/css/bootstrap.css";
import firebase from "firebase";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { getFirebase, reactReduxFirebase } from "react-redux-firebase";
import { applyMiddleware, compose, createStore } from "redux";
import { getFirestore, reduxFirestore } from "redux-firestore";
import thunk from "redux-thunk";
import App from "./components/App/App";
import { FirebaseConfig } from "./config/keys";
import "./index.css";
import registerServiceWorker, * as serviceWorker from "./registerServiceWorker";
import rootreducer from "./store/reducers/rootReducer";

firebase.initializeApp(FirebaseConfig);
firebase.firestore();

const store = createStore(
  rootreducer,
  compose(
    applyMiddleware(thunk.withExtraArgument({ getFirebase, getFirestore })),
    reactReduxFirebase(firebase, {
      userProfile: "users",
      useFirestoreForProfile: true,
      attachAuthIsReady: true
    }),
    reduxFirestore(firebase)
  )
);

store.firebaseAuthIsReady.then(() => {
  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById("root")
  );
  registerServiceWorker();
});

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
