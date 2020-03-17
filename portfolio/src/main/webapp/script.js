// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.


function addRandomFact() {
  const facts =
      ['I am currently 20 years old!', 
      'I love to hike, bike, and camp!', 
      'I am an eagle scout!', 
      'I was the valedictorian of my high school!', 
      'I love traveling to other countries! I\'ve been to about 10.', 
      'I love talking to others and socializing with others!'];

  // Pick a random fact.
  const factNum = Math.floor(Math.random() * facts.length);
  const factNumDisplay = factNum + 1; //We want to add 1 to display 1-based index due to 0-based indexing of arrays
  const fact = facts[factNum];
  // Add it to the page.

  const factContainer = document.getElementById('fact-container');
  factContainer.innerText = fact;
  const factNumContainer = document.getElementById('factNum-container');
  factNumContainer.innerText = "This is fact number " + factNumDisplay + "!";
}

//Gets the number of times a person views the website
async function getGreetAsyncAwait() {
  const response = await fetch('/index');
  const greet = await response.text();
  document.getElementById('greet-container').innerText = greet;
}

/*Creates a new list element*/
function createListElement(text) {
  const liElement = document.createElement('li');
  liElement.innerText = text;
  return liElement;
}

//Gets the list of greetings
function getGreetList() {
  fetch('/data').then(response => response.json()).then((greets) => {
        const listElement = document.getElementById('list-container');
        listElement.innerHTML = '';
        for(i in greets){
            greets[i];
            console.log(greets[i] +" " +i +" "+ greets.length);
            listElement.append(createListElement( greets[i]));
        }
    });
}



function getComments() {

    const TRUTH_LENGTH = 4;
  fetch('/list-comment').then(response => response.json()).then((comments) => {
    const imgURL = comments.shift().title;
    console.log(imgURL);
    const messageForm = document.getElementById('create-container');
    messageForm.action = imgURL;

    const comElement = document.getElementById('comment-container');
    comments.forEach((comment) =>{
        comElement.appendChild(createComElement(comment));
    })
  });
  fetch('/create-comment').then(response => response.text()).then((create) => {
    console.log(create);
    if(create.length  == TRUTH_LENGTH){ //returned true
        document.getElementById('create-container').style.display = "block";
    } else { //returned false
        console.log("Should hide");
        document.getElementById('create-container').style.display = "none";
    }
    
    
  });
}

/** Creates an <li> element containing text. */
function createComElement(comment) {
  const comElement = document.createElement('li');
  comElement.className = 'comClass';

  const titleElement = document.createElement('span');
  titleElement.innerText = comment.email + ": " + comment.title;
  var img = document.createElement('img'); 
  img.src = comment.imageUrl;
  const deleteButtonElement = document.createElement('button');
  deleteButtonElement.innerText = 'Delete Comment';
  deleteButtonElement.id = "delete-button";
  deleteButtonElement.addEventListener('click', () => {
    deleteComment(comment);

    // Removes comments
    comElement.remove();
  });
  const breakLine = document.createElement('br');
  comElement.appendChild(titleElement);
  comElement.appendChild(deleteButtonElement);
  if(comment.imageUrl){
    comElement.appendChild(breakLine);
    comElement.appendChild(img);
  }

  return comElement;
}



/** Tells the server to delete the comment */
function deleteComment(comment) {
  const params = new URLSearchParams();
  params.append('id', comment.id);
  fetch('/delete-comment', {method: 'POST', body: params});
}
