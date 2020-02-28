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
      ['I am currently 20 years old!', 'I love to hike, bike, and camp!', 'I am an eagle scout!', 'I was the valedictorian of my high school!', 'I love traveling to other countries! I\'ve been to about 10.', 'I love talking to others and socializing with others!'];

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
