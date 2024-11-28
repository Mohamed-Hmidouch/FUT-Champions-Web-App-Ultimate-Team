let playersList = [];
let response;
let gK_fildes = document.getElementById('goalkeeper-fields');
let player_fileds = document.getElementById('player-fields');
let container_fildes = document.getElementById('player-form-container');

async function fetchDataPlayers() {
    try {
        response = await fetch("../src/players.json");
        const jsonPlayers = await response.json();
        const storedPlayers = localStorage.getItem("Playerslist");

        if (storedPlayers) {
            playersList = JSON.parse(storedPlayers);
        } else {
            playersList = jsonPlayers.players;
            localStorage.setItem("Playerslist", JSON.stringify(playersList));
        }

        console.log('Players stored in localStorage:', playersList);
    } catch (error) {
        console.error('Error fetching players data:', error);
    }
}

fetchDataPlayers();

function savePlayerToLocalStorage(player) {
    if (Array.isArray(playersList)) {
        playersList.push(player);
        localStorage.setItem("Playerslist", JSON.stringify(playersList));
    } else {
        console.error('playersList is not an array!');
        playersList = [];
    }
}

function addPlayer(position) {
    container_fildes.classList.remove('hidden');
    if (position === 'GK') {
        gK_fildes.classList.remove('hidden');
        player_fileds.classList.add('hidden');
    } else {
        player_fileds.classList.remove('hidden');
        gK_fildes.classList.add('hidden');
    }
}

function validateForm(event) {
    let valid = true;

    const fields = [
        { id: 'name', errorMessage: 'Player Name is required' },
        { id: 'photo', errorMessage: 'Player Photo URL is required' },
        { id: 'position', errorMessage: 'Position is required' },
        { id: 'nationality', errorMessage: 'Nationality is required' },
        { id: 'flag', errorMessage: 'Flag URL is required' },
        { id: 'club', errorMessage: 'Club is required' },
        { id: 'logo', errorMessage: 'Club Logo URL is required' },
        { id: 'rating', errorMessage: 'Rating is required and must be between 10 and 100', type: 'number', min: 10, max: 100 },
        { id: 'pace', errorMessage: 'Pace is required and must be between 10 and 100', type: 'number', min: 10, max: 100 },
        { id: 'shooting', errorMessage: 'Shooting is required and must be between 10 and 100', type: 'number', min: 10, max: 100 },
        { id: 'passing', errorMessage: 'Passing is required and must be between 10 and 100', type: 'number', min: 10, max: 100 },
        { id: 'dribbling', errorMessage: 'Dribbling is required and must be between 10 and 100', type: 'number', min: 10, max: 100 },
        { id: 'defending', errorMessage: 'Defending is required and must be between 10 and 100', type: 'number', min: 10, max: 100 },
        { id: 'physical', errorMessage: 'Physical is required and must be between 10 and 100', type: 'number', min: 10, max: 100 }
    ];

    fields.forEach(field => {
        const input = document.getElementById(field.id);
        const errorElement = document.getElementById(`${field.id}Error`);
        if (!input || input.value.trim() === '') {
            if (errorElement) {
                errorElement.classList.remove('hidden');
                errorElement.classList.add('text-red-500');
                errorElement.textContent = field.errorMessage;
            }
            valid = false;
        } else if (field.type === 'number' && (input.value < field.min || input.value > field.max)) {
            if (errorElement) {
                errorElement.classList.remove('hidden');
                errorElement.classList.add('text-red-500');
                errorElement.textContent = field.errorMessage;
            }
            valid = false;
        } else {
            if (errorElement) {
                errorElement.classList.remove('hidden');
                errorElement.classList.add('text-green-500');
                errorElement.textContent = 'Complete';
            }
        }
    });

    if (valid) {
        const player = {
            name: document.getElementById('name').value,
            photo: document.getElementById('photo').value,
            position: document.getElementById('position').value,
            nationality: document.getElementById('nationality').value,
            flag: document.getElementById('flag').value,
            club: document.getElementById('club').value,
            logo: document.getElementById('logo').value,
            rating: parseInt(document.getElementById('rating').value),
            pace: parseInt(document.getElementById('pace').value),
            shooting: parseInt(document.getElementById('shooting').value),
            passing: parseInt(document.getElementById('passing').value),
            dribbling: parseInt(document.getElementById('dribbling').value),
            defending: parseInt(document.getElementById('defending').value),
            physical: parseInt(document.getElementById('physical').value)
        };

        savePlayerToLocalStorage(player);
        alert('Player added successfully!');
        event.preventDefault();
    }
}

function createPlayerCard(player) {
    return `
      <div class="bg-gray-800 text-white p-4 rounded-lg shadow-md">
        <img src="${player.photo}" alt="Player Photo" class="h-32 w-full bg-cover bg-center rounded-lg">
        <div class="mt-4 text-lg font-bold text-center">${player.name}</div>
        <div class="flex justify-between items-center mt-2">
          <img src="${player.logo}" alt="Club Logo" class="h-8 w-8 rounded-full">
          <img src="${player.flag}" alt="Country Flag" class="h-8 w-12 rounded">
        </div>
        <div class="text-sm mt-2 text-center">
          <span>${player.nationality}</span> | 
          <span>${player.position}</span>
        </div>
        <div class="grid grid-cols-2 gap-2 text-xs mt-4">
          <div>Rating: ${player.rating}</div>
          <div>Pace: ${player.pace}</div>
          <div>Shooting: ${player.shooting}</div>
          <div>Dribbling: ${player.dribbling}</div>
          <div>Defending: ${player.defending}</div>
          <div>Physical: ${player.physical}</div>
          <div>Passing: ${player.passing}</div>
        </div>
      </div>
    `;
  }

function loadPlayersFromLocalStorage() {
    const playersList = JSON.parse(localStorage.getItem("Playerslist"));
    const replacementSection = document.getElementById("replacement-section");
  

    if (!playersList || playersList.length === 0) {
      replacementSection.innerHTML = "<p>No players found.</p>";
      return;
    }
  
    playersList.forEach((player) => {

      const card = createPlayerCard(player);
      replacementSection.innerHTML += card;
    });
  }



document.addEventListener("DOMContentLoaded", loadPlayersFromLocalStorage);

window.onload = function() {
    container_fildes.classList.add('hidden');
    gK_fildes.classList.add('hidden');
    player_fileds.classList.add('hidden');
};
