firebase.auth().onAuthStateChanged(function(firebaseUser) {
  console.log(firebaseUser);
  if (firebaseUser) {
    document.getElementById('login-display').innerHTML = firebaseUser.email + ' 반가워요!';
  } else {
    document.getElementById('login-display').innerHTML = '';
  }
});

const googleLogout = function() {
  firebase.auth().signOut();
}

const googleLogin = function() {
  const provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider);
};

const emailSignup = function(form) {
  const email = form['signup-email'].value
  const password = form['signup-password'].value
  firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
    console.error(error);
    alert(error.message);
  });
};

const emailSignin = function(form) {
  const email = form['signin-email'].value
  const password = form['signin-password'].value
  firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
    console.error(error);
    alert(error.message);
  });
};
