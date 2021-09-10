const groceriesGet = sessionStorage.getItem('groceries');
const groceriesLogical = groceriesGet || '[]';
const groceries = JSON.parse(groceriesLogical);

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
  const successFunction = function(reponse) {
    const groceries = reponse.data.groceries;
    const tagDivParent = document.getElementById('tag-div-parent');
    const tagDivChild = document.getElementById('tag-div-child');
    tagDivParent.innerHTML = '';
    for (let index in groceries) {
      const newDivChild = tagDivChild.cloneNode(true);
      tagDivParent.appendChild(newDivChild);
      const groceriesNameObject = document.getElementsByName('groceries-name')[index];
      const groceriesAgeObject = document.getElementsByName('groceries-age')[index];
      const groceriesUpdateObject = document.getElementsByName('groceries-update')[index];
      const groceriesDeleteObject = document.getElementsByName('groceries-delete')[index];
      groceriesNameObject.value = groceries[index].name;
      groceriesAgeObject.value = groceries[index].age;
      groceriesUpdateObject.index = index;
      groceriesDeleteObject.index = index;
    }
    console.log('Readed', groceries);
  };


  axios.get('http://localhost:3100/api/v1/groceries')
  .then(successFunction)
  .catch(function (error) {
    console.log(error);
  });
};


const groceriesDelete = function(index) {
  const url = 'http://localhost:3100/api/v1/groceries/' + index;

  axios.delete(url)
  .then(groceriesRead)
  .catch(function (error) {
    console.log(error);
  });
};


const groceriesUpdate = function(index) {
  const url = 'http://localhost:3100/api/v1/groceries/' + index;
  const name = document.getElementsByName('groceries-name')[index].value;
  const age = document.getElementsByName('groceries-age')[index].value;
  const grocery = {
    name: name,
    age: age
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

groceriesRead();