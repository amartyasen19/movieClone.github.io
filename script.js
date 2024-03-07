let searchInput = document.getElementById("Input");
let displaySearchList = document.getElementsByClassName("fav-container");
const key = "841a45a9";

fetch("http://www.omdbapi.com/?i=tt3896198&apikey=841a45a9")
  .then((res) => res.json())
  .then((data) => console.log(data));

// Upon keypress
searchInput.addEventListener("input", searchMovies);

async function singleMovie() {
  // Finding ID of the movie from the URL
  var urlQueryParams = new URLSearchParams(window.location.search);
  var id = urlQueryParams.get("id");
  console.log(id);
  const url = `https://www.omdbapi.com/?i=${id}&apikey=${key}`;
  const res = await fetch(`${url}`);
  const data = await res.json();
  console.log(data);
  console.log(url);

  let ans = `
 <div class="movie-poster">
        <img src=${data.Poster} alt="Movie Poster">
    </div>
    <div class="movie-details">
        <div class="details-header">
            <div class="dh-ls">
                <h2>${data.Title}</h2>
            </div>
            <div class="dh-rs">
                <button id="btn" onClick=addTofavorites('${id}') >ADD</button>
            </div>
        </div>
        <span class="italics-text"><i>${data.Year} &#x2022; ${data.Country} &#x2022; Rating - <span
                    style="font-size: 18px; font-weight: 600;">${data.imdbRating}</span>/10 </i></span>
        <ul class="details-ul">
            <li><b>Actors: </b>${data.Actors}</li>
            <li><b>Director: </b>${data.Director}</li>
            <li><b>Writers: </b>${data.Writer}</li>
        </ul>
        <ul class="details-ul">
            <li><b>Genre: </b>${data.Genre}</li>
            <li><b>Release Date: </b>${data.DVD}</li>
            <li><b>Box Office: </b>${data.BoxOffice}</li>
            <li><b>Movie Runtime: </b>${data.Runtime}</li>
        </ul>
        <p  class="p1">${data.Plot}</p>
        <h2>Award:</h2>
        <p class="p2" > &thinsp; ${data.Awards}</p>
    </div> 
    `;
  // Appending the output
  document.querySelector(".movie-container").innerHTML = ans;
}

async function addTofavorites(id) {
  console.log("fav-item", id);

  localStorage.setItem(Math.random().toString(36).slice(2, 7), id);
  alert("Movie Added to Watchlist!");
}

//Removing movie from favorites list andlocalstorage
async function removeFromfavorites(id) {
  console.log(id);
  for (i in localStorage) {
    if (localStorage[i] == id) {
      localStorage.removeItem(i);
      break;
    }
  }
  //call alerte when movie removed
  alert("Movie Remove from Watchlist");
  window.location.replace("favMovie.html");
}

//Displaying movie list in search input
async function displayMovieList(movies) {
  let ans = "";
  //Traversing the movies list
  for (i of movies) {
    var img = "";
    if (i.Poster != "N/A") {
      img = i.Poster;
    }

    var id = i.imdbID;

    ans += `

        <div class="fav-item">
            <div class="fav-poster">
            <a href="movie.html?id=${id}"><img src=${img} alt="Favourites Poster"></a>
            </div>
            <div class="fav-details">
                <div class="fav-details-box">
                    <div>
                        <p class="fav-movie-name"><a href="movie.html?id=${id}">${i.Title}</a></p>
                        <p class="fav-movie-rating"><a href="movie.html?id=${id}">${i.Year}</a></p>
                    </div>
                    <div>
                        <button id="btn" onClick=addTofavorites('${id}')>ADD</button>
                    </div>
                </div>
            </div>
        </div>

       `;
  }
  //Appending the movie-display
  document.querySelector(".fav-container").innerHTML = ans;
  console.log("here is movie list ..", movies);
}

// search the movie then a list of the related movie will be displayed
async function searchMovies() {
  const url = `https://www.omdbapi.com/?s=${searchInput.value.trim()}&page=1&apikey=${key}`;
  const res = await fetch(`${url}`);
  const data = await res.json();

  if (data.Search) {
    //Calling the function to displaymovielist
    displayMovieList(data.Search);
  }
}

//Favorites movies are loaded on to the fav page from localstorage
async function favoritesMovieList() {
  let ans = "";
  //Traversing over all the movies in the localstorage
  for (i in localStorage) {
    var id = localStorage.getItem(i);
    if (id != null) {
      //Fetching the movie through id
      const url = `https://www.omdbapi.com/?i=${id}&plot=full&apikey=${key}`;
      const res = await fetch(`${url}`);
      const data = await res.json();
      console.log(data);

      var img = "";
      if (data.Poster) {
        img = data.Poster;
      } else {
        img = data.Title;
      }
      var Id = data.imdbID;
      //Adding all the movie html
      ans += `

        <div class="fav-item">
            <div class="fav-poster">
                <a href="movie.html?id=${id}"><img src=${img} alt="Favourites Poster"></a>
            </div>
            <div class="fav-details">
                <div class="fav-details-box">
                    <div>
                        <p class="fav-movie-name">${data.Title}</p>
                        <p class="fav-movie-rating">${data.Year} &middot; <span
                                style="font-size: 15px; font-weight: 600;">${data.imdbRating}</span>/10</p>
                    </div>
                    <div style="color: maroon">
                        <button id="btn" onClick=removeFromfavorites('${Id}')>Remove</button>
                    </div>
                </div>
            </div>
        </div>

       `;
    }
  }
  //Appending the html to the movie-display class in favorites page
  document.querySelector(".fav-container").innerHTML = ans;
}
