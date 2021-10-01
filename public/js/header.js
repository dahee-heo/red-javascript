firebase.auth().onAuthStateChanged(function(firebaseUser) {
  console.log(firebaseUser);
  if (firebaseUser) {
    document.getElementById('login-guest').style.display = 'none';
    document.getElementById('login-login').style.display = 'none';
    const loginName = document.getElementById('login-name');
    loginName.style.display = 'block';
    loginName.innerHTML = 'Hello ' + firebaseUser.displayName + '!';

    document.getElementById('login-logout').style.display = 'block';
  } else {
    document.getElementById('login-guest').style.display = 'block';
    document.getElementById('login-login').style.display = 'block';
    document.getElementById('login-name').style.display = 'none';
    document.getElementById('login-logout').style.display = 'none';
  }
});

const googleLogout = function() {
  firebase.auth().signOut();
}

const googleLogin = function() {
  const provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider);
};