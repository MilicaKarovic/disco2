const data = {
  type: 'pop', // pop, rock, other
  allArtists: null,
  filteredArtists: null,
  loading: true,
  error: null,
  genres: [],
  filterGenre: 'All',
};

const types = [
  'pop',
  'rock',
  'other',
  'narodnjaci',
];

const app = document.querySelector('.App');

function getData() {
  data.loading = true;
  data.error = null;
  data.filterGenre = 'All';

  render();

  fetch('http://rocketlaunch.me/tmp/kara-api/' + data.type + '.json')
    .then(function(response) {
      return response.json();
    })
    .then(function(json) {
      data.loading = false;
      data.allArtists = json;
      data.filteredArtists = data.allArtists;

      // TODO filter genres and set them to data.genres
      const filteredGenres = [];

      json.forEach(artist => {
        if (filteredGenres.indexOf(artist.genre) === -1) {
          filteredGenres.push(artist.genre);
        }
      });

      data.genres = filteredGenres;

      render();
    })
    .catch(e => {
      data.error = e;
      data.loading = false;

      render();
    });
}

function handleTypeButtonClick(newType) {
  data.type = newType;

  getData();
}

// TODO napisi hendler
// koji prodje kroz sve artiste filtrira po poslatom parametru
// setuje ih u filtrirane artiste
// pozovemo render
function handleGenreButtonClick(genre) {
  const filteredArtists = [];
  const filterGenre = unescape(genre);

  data.allArtists.forEach((artist) => {
    if (filterGenre === artist.genre) {
      filteredArtists.push(artist);
    }
  });

  data.filteredArtists = filteredArtists;
  data.filterGenre = filterGenre;

  render();
}

function handleAllButtonClick() {

  data.filteredArtists = data.allArtists;
  data.filterGenre = 'All';

  render();
}

function search(){

  filter=document.getElementById('myInput').value.toUpperCase();

  const searchArtist = [];

  data.allArtists.forEach((artist) => {
    if ((data.filterGenre==='All' && artist.name.toUpperCase().indexOf(filter)>-1)  || (data.filterGenre === artist.genre && artist.name.toUpperCase().indexOf(filter)>-1)) {

      searchArtist.push (artist);
    }
  });

  data.filteredArtists = searchArtist;

  render();
}

// map -> [1,2,3] => [2,4,6]
// filter
// reduce

function renderTypes() {
  const typesComponents = types.map(singleType => {
    const cssClass = data.type === singleType ? 'active' : '';
    return `
      <button
        class='${ cssClass }'
        onclick='handleTypeButtonClick("${ singleType }")'>
        ${ singleType }
      </button>
    `;
  });

  return typesComponents.join('');
}

function renderArtists() {
  const artistsComponents = data.filteredArtists.map((artist, index) => {
    return `
    <div class="content">
    <div class="name">${ artist.name }</div>
    <div class="genre">${ artist.genre }</div>
    </div>
    `;
  });

  return artistsComponents.join('');
}

function renderGenres() {
  const uniqueGenresComponents = data.genres.map((genre) => {
    const cssClass = data.filterGenre === genre ? 'active' : '';

    return `
      <button
        class='${ cssClass }'
        onclick='handleGenreButtonClick("${ escape(genre) }")'>
        ${ genre }
      </button>
    `;
  });

  return uniqueGenresComponents.join('');
}

function render() {
  console.log('-------------------------------');
  console.log(data);
  let bottomPartHTML = null;

  if (data.error) {
    bottomPartHTML = data.error
  } else if (data.loading) {
    bottomPartHTML = 'Loading...';
  } else {
    const cssClass = data.filterGenre === 'All' ? 'active' : '';

    bottomPartHTML = `
      <div>
        <h3>Filter by genre:</h3>
        ${ renderGenres() }
        <button
          class='${ cssClass }'
          onclick='handleAllButtonClick()'>All</button>
      </div>
      <h3>Artists: </h3>
      <div class="container">
        ${ renderArtists() }
      </div>
    `;
  }

  const html = `
    <div>
      <div>
        <h3>Load new type:</h3>
        ${ renderTypes() }
      </div>
      ${ bottomPartHTML }
    </div>
  `;

  app.innerHTML = html;
}

getData();
