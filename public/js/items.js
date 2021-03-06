const queryString = new URLSearchParams(window.location.search);
const q = queryString.get('q');
document.getElementsByName('q')[0].value = q;
// const inputHiddens = queryString.getAll('input-hidden');
// const inputHidden = inputHiddens[0];

// const inputTextObjects = document.getElementsByName('input-text');
// const inputTextObject = inputTextObjects[0];
const orderbyName = queryString.get('orderbyName') || 'expire';
const orderbyType = queryString.get('orderbyType') || 'asc';
document.getElementById(orderbyName + '-' + orderbyType).classList.add('active');

let items = [];

const ajax = function(method, url, data, callback){
  const xhrObject = new XMLHttpRequest();
  xhrObject.onreadystatechange = function() {
    if (xhrObject.readyState !== 4) return;
    if (xhrObject.status === 200) {
      callback(xhrObject);
    } else {
      const error = {
        status: xhrObject.status,
        statusText: xhrObject.statusText,
        responseText: xhrObject.responseText
      }
      console.error(error);
    }
  };
  xhrObject.open(method, url);
  xhrObject.setRequestHeader('Content-Type', 'application/json');
  xhrObject.send(JSON.stringify(data));
};

const itemsCreate = function(form) {
  const itemNameObject = form['name'];
  const item = {
    name: itemNameObject.value,
    enter: moment().format('YYYY-MM-DD'),
    expire: moment().add(14, 'days').format('YYYY-MM-DD')
  };
   axios.post('https://red-javascript-default-rtdb.firebaseio.com/' + firebaseUser.uid + '/items.json', item)
  .then(function(reponse) {
    itemNameObject.value = '';
    itemsRead();
  })
  .catch(function (error) {
    console.log(error);
  });

};


const itemsRead = function() {
  const successFunction = function(response) {
    items = response.data;
    const tagDivParent = document.getElementById('tag-tbody-parent');
    const tagDivChild = document.getElementById('tag-tbody-child');
    tagDivParent.innerHTML = '';
    for (let key in items) {
      items[key].key = key;
    }
    const itemsOrdered = _.orderBy(items, [orderbyName], [orderbyType]);
    for (let index in itemsOrdered) {
      const key = itemsOrdered[index].key;
      const condition = !q || items[key].name.indexOf(q) >= 0;
      if (!condition) {
        continue;
      }
      const newDivChild = tagDivChild.cloneNode(true);
      tagDivParent.appendChild(newDivChild);
      const itemsNumberObject = document.getElementsByName('items-number')[index];
      const itemsNameObject = document.getElementsByName('items-name')[index];
      const itemsEnterObject = document.getElementsByClassName('items-enter')[index];
      const itemsExpireObject = document.getElementsByClassName('items-expire')[index];
      const itemsDeleteObject = document.getElementsByName('items-delete')[index];
      const itemsUpdateObject = document.getElementsByClassName('button-update')[index];
      itemsNumberObject.innerHTML = Number(index)+1;
      itemsNameObject.innerHTML = items[key].name;
      itemsEnterObject.innerHTML = items[key].enter;
      itemsExpireObject.innerHTML = items[key].expire;
      itemsExpireObject.key = key;
      itemsDeleteObject.key = key;
      itemsUpdateObject.key = key;
    }
    console.log('Readed', items);
  };


  axios.get('https://red-javascript-default-rtdb.firebaseio.com/' + firebaseUser.uid + '/items.json')
  .then(successFunction)
  .catch(function (error) {
    console.log(error);
  });
};


const itemsDelete = function(key) {
  if (!window.confirm('?????????????????????????')) {
    return;
  }
  const url = 'https://red-javascript-default-rtdb.firebaseio.com/' + firebaseUser.uid + '/items/' + key + '.json';

  axios.delete(url)
  .then(itemsRead)
  .catch(function (error) {
    console.log(error);
  });
};


const itemsUpdate = function(key) {
  const url = 'https://red-javascript-default-rtdb.firebaseio.com/' + firebaseUser.uid + '/items.json';
  const item = {
    [key]: {
      name: document.getElementsByName('item-name')[0].value,
      enter: document.getElementsByName('item-enter')[0].value,
      expire: document.getElementsByName('item-expire')[0].value
    }
  }

  axios.patch(url, item)
  .then(itemsRead)
  .catch(function (error) {
    console.log(error);
  }).finally(function () {
    modalToggle();
    itemsExpiredCount();
  }) 
};


const itemsSet = function() {
  const itemsSet = JSON.stringify(items);
  sessionStorage.setItem('items', itemsSet);
};

const itemsModalUpdate = function(key){
  document.getElementsByName('item-name')[0].value = items[key].name;
  document.getElementsByName('item-enter')[0].value = items[key].enter;
  document.getElementsByName('item-expire')[0].value = items[key].expire;
  const itemsUpdateObjects = document.getElementsByClassName('button-update');
  itemsUpdateObjects[itemsUpdateObjects.length-1].key = key;
};

// itemsRead();