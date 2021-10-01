const queryString = new URLSearchParams(window.location.search);
// const q = queryString.get('q');
// document.getElementsByName('q')[0].value = q;
const orderbyName = queryString.get('orderbyName') || 'expire';
const orderbyType = queryString.get('orderbyType') || 'asc';
document.getElementById(orderbyName + '-' + orderbyType).classList.add('active');

let groceries = [];

const promises = [];
promises[0] = new Promise(function(resolve, reject) {
  axios.get('https://red-javascript-default-rtdb.firebaseio.com/items.json').then(function(response) {
    resolve(response.data);
  }).catch(function(error) {
    reject(error);
  })
})

const groceriesCreate = function(form) {
  const groceryNameObject = form['name'];
  const grocery = {
    name: groceryNameObject.value,
    enter: moment().format('YYYY-MM-DD'),
    expire: moment().add(14, 'days').format('YYYY-MM-DD')
  };
   axios.post('https://red-javascript-default-rtdb.firebaseio.com/groceries.json', grocery)
  .then(function(reponse) {
    groceryNameObject.value = '';
    groceriesRead();
  })
  .catch(function (error) {
    console.log(error);
  });

};


const groceriesRead = function() {
  const successFunction = function(data) {
    groceries = data;
    const tagDivParent = document.getElementById('tag-tbody-parent');
    const tagDivChild = document.getElementById('tag-tbody-child');
    tagDivParent.innerHTML = '';

    let index = 0;
    for (let key in groceries) {
      groceries[key].key = key;
    }
    const groceriesOrdered = _.orderBy(groceries, [orderbyName], [orderbyType]);
    for (let index in groceriesOrdered) {
      const key = groceriesOrdered[index].key;
      // const condition = !q || groceries[key].name.indexOf(q) >= 0;
      // if (!condition) {
      //   continue;
      // }
      const newDivChild = tagDivChild.cloneNode(true);
      tagDivParent.appendChild(newDivChild);
      const groceriesMoveObject = document.getElementsByName('groceries-move')[index];
      const groceriesNameObject = document.getElementsByName('groceries-name')[index];
      const groceriesEnterObject = document.getElementsByClassName('groceries-enter')[index];
      const groceriesExpireObject = document.getElementsByName('groceries-expire')[index];
      const groceriesDeleteObject = document.getElementsByName('groceries-delete')[index];
      groceriesNameObject.innerHTML = groceries[key].name;
      groceriesEnterObject.innerHTML = groceries[key].enter;
      groceriesExpireObject.value = groceries[key].expire;
      groceriesMoveObject.key = key;
      groceriesExpireObject.key = key;
      groceriesDeleteObject.key = key;
      if (groceries[key].hasItem) {
        groceriesMoveObject.checked = true;
      }
    }
    console.log('Readed', groceries);
  };

  promises[1] = new Promise(function(resolve, reject) {
    axios.get('https://red-javascript-default-rtdb.firebaseio.com/groceries.json').then(function(response) {
      resolve(response.data);
    }).catch(function(error) {
      reject(error);
    })
  })
  Promise.all(promises).then(function(result) {
    const groceries = result[1];
    const items = result[0];
    for (let key1 in groceries) {
      const grocery = groceries[key1];
      for (let key0 in items) {
        // const item = items[key0];
        if (key1 === key0) {
          grocery.hasItem = true;
        }
      }
    }
    console.log(result);
    successFunction(groceries);
  }).catch(function(error) {
    console.error(error);
  })
};


const groceriesDelete = function(key) {
  if (!window.confirm('삭제하시겠습니까?')) {
    return;
  }
  const url = 'https://red-javascript-default-rtdb.firebaseio.com/groceries/' + key + '.json';

  axios.delete(url)
  .then(groceriesRead)
  .catch(function (error) {
    console.log(error);
  });
};


const groceriesUpdate = function(event, key) {
  const url = 'https://red-javascript-default-rtdb.firebaseio.com/groceries.json';
  const grocery = {
    [key]: {
      name: groceries[key].name,
      enter: groceries[key].enter,
      expire: event.target.value
    }
  }

  axios.patch(url, grocery)
  .then(groceriesRead)
  .catch(function (error) {
    console.log(error);
  });
};


const groceriesSet = function() {
  const groceriesSet = JSON.stringify(groceries);
  sessionStorage.setItem('groceries', groceriesSet);
};

const itemsCreateDelete = function(event, key){
  if (event.target.checked) {
    const url = 'https://red-javascript-default-rtdb.firebaseio.com/items.json';
    const grocery = {
      [key]: {
        name: groceries[key].name,
        enter: groceries[key].enter,
        expire: groceries[key].expire
      }
    }

    axios.patch(url, grocery)
    .catch(function (error) {
      console.log(error);
    });
  } else {
    const url = 'https://red-javascript-default-rtdb.firebaseio.com/items/' + key + '.json';

    axios.delete(url)
    .catch(function (error) {
      console.log(error);
    });
  }
};

groceriesRead();