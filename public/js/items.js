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
   axios.post('https://red-javascript-default-rtdb.firebaseio.com/items.json', item)
  .then(function(reponse) {
    itemNameObject.value = '';
    itemsRead();
  })
  .catch(function (error) {
    console.log(error);
  });

};


const itemsRead = function() {
  const successFunction = function(reponse) {
    items = reponse.data;
    const tagDivParent = document.getElementById('tag-tbody-parent');
    const tagDivChild = document.getElementById('tag-tbody-child');
    tagDivParent.innerHTML = '';
    let index = 0;
    for (let key in items) {
      const newDivChild = tagDivChild.cloneNode(true);
      tagDivParent.appendChild(newDivChild);
      const itemsNumberObject = document.getElementsByName('items-number')[index];
      const itemsNameObject = document.getElementsByName('items-name')[index];
      const itemsEnterObject = document.getElementsByClassName('items-enter')[index];
      const itemsExpireObject = document.getElementsByClassName('items-expire')[index];
      const itemsDeleteObject = document.getElementsByName('items-delete')[index];
      itemsNumberObject.innerHTML = index+1;
      itemsNameObject.innerHTML = items[key].name;
      itemsEnterObject.innerHTML = items[key].enter;
      itemsExpireObject.innerHTML = items[key].expire;
      itemsExpireObject.key = key;
      itemsDeleteObject.key = key;
      index += 1;
    }
    console.log('Readed', items);
  };


  axios.get('https://red-javascript-default-rtdb.firebaseio.com/items.json')
  .then(successFunction)
  .catch(function (error) {
    console.log(error);
  });
};


const itemsDelete = function(key) {
  if (!window.confirm('삭제하시겠습니까?')) {
    return;
  }
  const url = 'https://red-javascript-default-rtdb.firebaseio.com/items/' + key + '.json';

  axios.delete(url)
  .then(itemsRead)
  .catch(function (error) {
    console.log(error);
  });
};


const itemsUpdate = function(event, key) {
  const url = 'https://red-javascript-default-rtdb.firebaseio.com/items.json';
  const item = {
    [key]: {
      name: items[key].name,
      enter: items[key].enter,
      expire: event.target.value
    }
  }

  axios.patch(url, item)
  .then(itemsRead)
  .catch(function (error) {
    console.log(error);
  });
};


const itemsSet = function() {
  const itemsSet = JSON.stringify(items);
  sessionStorage.setItem('items', itemsSet);
};

itemsRead();