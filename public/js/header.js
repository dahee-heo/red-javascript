let firebaseUser
firebase.auth().onAuthStateChanged(function(_firebaseUser) {
  console.log(_firebaseUser);
  if (_firebaseUser) {
    firebaseUser = _firebaseUser
    document.getElementById('login-guest').style.display = 'none';
    document.getElementById('login-login').style.display = 'none';
    const loginName = document.getElementById('login-name');
    loginName.style.display = 'block';
    loginName.innerHTML = 'Hello ' + (_firebaseUser.displayName || _firebaseUser.email) + '!';
    document.getElementById('login-logout').style.display = 'block';
    if (document.location.pathname === '/groceries.html') {
      promisesItems();
      groceriesRead();
    } else if (document.location.pathname === '/items.html') {
      itemsRead();
    }
    itemsExpiredCount();
  } else {
    firebaseUser = null
    document.getElementById('login-guest').style.display = 'block';
    document.getElementById('login-login').style.display = 'block';
    document.getElementById('login-name').style.display = 'none';
    document.getElementById('login-logout').style.display = 'none';
  }
});

const itemsExpiredCount = function(){
  axios.get('https://red-javascript-default-rtdb.firebaseio.com/' + firebaseUser.uid + '/items.json')
  .then(function(response) {
    items = response.data;
    let count = 0;
    for (let key in items) {
      if (items[key].expire <= moment().add(-1, 'days').format('YYYY-MM-DD')) {
        count++;
      }
    }
    document.getElementById('menu-items-counter').innerHTML = count;
  })
  .catch(function (error) {
    console.log(error);
  });
}

const googleLogout = function() {
  firebase.auth().signOut();
}

const googleLogin = function() {
  const provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider);
};

const guestLogin = function(){
  firebase.auth().signInWithEmailAndPassword('guest@red-javascript.web.app', 'guestguest').catch(function(error) {
    console.error(error);
    alert(error.message);
  });
};
