let playersList = [];
let response;
let playerIds = [];
let container_fields = document.getElementById('player-form-container');
let gK_fields = document.getElementById('goalkeeper-fields');
let player_fields = document.getElementById('player-fields');

document.addEventListener("DOMContentLoaded", () => {
    fetchDataPlayers();
    loadPlayersFromLocalStorage();
});

window.onload = function() {
    hideFormFields();
};

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
    } catch (error) {
        console.error('Error fetching players data:', error);
    }
}

function savePlayerToLocalStorage(player) {
    if (Array.isArray(playersList)) {
        playersList.push(player);
        localStorage.setItem("Playerslist", JSON.stringify(playersList));
    } else {
        console.error('playersList is not an array!');
        playersList = [];
    }
}

function toggleFormFields(position) {
    container_fields.classList.remove('hidden');
    if (position === 'GK') {
        gK_fields.classList.remove('hidden');
        player_fields.classList.add('hidden');
    } else {
        player_fields.classList.remove('hidden');
        gK_fields.classList.add('hidden');
    }
}

function hideFormFields() {
    if (container_fields) container_fields.classList.add('hidden');
    if (gK_fields) gK_fields.classList.add('hidden');
    if (player_fields) player_fields.classList.add('hidden');
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
        addPlayerToLocalStorage();
    } else {
        event.preventDefault();
    }
}

function addPlayerToLocalStorage() {
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
    swal("Player added successfully!", "Player added in localStorage", "success");
    
}

function createPlayerCard(player, index) {
    return `
    <div id="player-${index}" name="${player.position}" class="card flex flex-col justify-center items-center relative" style="background-image: url('../assets/images/fut21-icon.webp');" draggable="true" ondragstart="drag(event)">
      <div class="text-center p-2 rounded-lg w-full h-full flex flex-col justify-center items-center">
        <img src="${player.photo}" alt="Player Photo" class bg-cover bg-center rounded-full mb-2">
        <div class="text-sm font-bold">${player.name}</div>
        <div class="flex justify-between items-center mt-2 text-xs">
          <img src="${player.logo}" alt="Club Logo" class="h-6 w-6 rounded-full">
          <img src="${player.flag}" alt="Country Flag" class="h-6 w-8 rounded">
        </div>
        <div class="text-xs mt-2">
          <span>${player.nationality}</span> | 
          <span>${player.position}</span>
        </div>
        <div class="grid grid-cols-2 gap-1 text-xs mt-4">
          <div>Rating: ${player.rating}</div>
          <div>Pace: ${player.pace}</div>
          <div>Shooting: ${player.shooting}</div>
          <div>Dribbling: ${player.dribbling}</div>
          <div>Defending: ${player.defending}</div>
          <div>Physical: ${player.physical}</div>
          <div>Passing: ${player.passing}</div>
        </div>
      </div>
   
      <div class="flex justify-around items-center w-full mt-2 p-2 border-t border-gray-300">
       
        <i class="fa fa-edit text-blue-600 cursor-pointer" onclick="editPlayer(event, ${index})" title="Edit Player"></i>
      
        <i class="fa fa-trash text-red-600 cursor-pointer" onclick="deletePlayer(event, ${index})" title="Delete Player"></i>
      </div>
    </div>
    `;
    
}
function deletePlayer(event, index) {
    event.stopPropagation();


    const playersList = JSON.parse(localStorage.getItem("Playerslist")) || [];


    if (index >= 0 && index < playersList.length) {
  
        playersList.splice(index, 1);

  
        localStorage.setItem("Playerslist", JSON.stringify(playersList));


        loadPlayersFromLocalStorage();

        swal("Player delete with successfully!", "Player delete from localStorage", "info");
    } else {
        console.error("Invalid index for deletion:", index);
    }
}

function editPlayer(event, index) {
    event.stopPropagation(); 


    const player = playersList[index];

    document.getElementById('name').value = player.name;
    document.getElementById('photo').value = player.photo;
    document.getElementById('position').value = player.position;
    document.getElementById('nationality').value = player.nationality;
    document.getElementById('flag').value = player.flag;
    document.getElementById('club').value = player.club;
    document.getElementById('logo').value = player.logo;
    document.getElementById('rating').value = player.rating;
    document.getElementById('pace').value = player.pace;
    document.getElementById('shooting').value = player.shooting;
    document.getElementById('passing').value = player.passing;
    document.getElementById('dribbling').value = player.dribbling;
    document.getElementById('defending').value = player.defending;
    document.getElementById('physical').value = player.physical;


    const submitBtn = document.getElementById('submit-btn');
    submitBtn.textContent = "Edit Player";
    submitBtn.setAttribute('onclick', `updatePlayer(${index})`); // تغيير حدث الضغط على الزر إلى تحديث اللاعب


    document.getElementById('player-fields').classList.remove('hidden');
}

function updatePlayer(index) {

    const updatedPlayer = {
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


    playersList[index] = updatedPlayer;


    localStorage.setItem("Playerslist", JSON.stringify(playersList));


    loadPlayersFromLocalStorage();


    document.getElementById('player-fields').classList.add('hidden');

    swal("Player edit with successfully!", "Player editer from localStorage", "info");
}



function loadPlayersFromLocalStorage() {
    const replacementSection = document.getElementById("replacement-section");
    replacementSection.innerHTML = '';

    const playersList = JSON.parse(localStorage.getItem("Playerslist"));
  
    playersList.forEach((player, index) => {
        const card = createPlayerCard(player, index);
        replacementSection.innerHTML += card;
        playerIds.push(`player-${index}`);
    });

    document.querySelectorAll('.card').forEach(card => {
        card.setAttribute('draggable', 'true');
        card.setAttribute('ondragstart', 'drag(event)');
    });
}

function allowDrop(event) {
    event.preventDefault();
}

function drag(event) {
    const draggedElement = event.target;

    if (draggedElement && draggedElement.id) {
        event.dataTransfer.setData("text", draggedElement.id);
        console.log("Dragging element ID:", draggedElement.id);
    } else {
        console.error("Dragged element does not have a valid ID");
    }
}

function drop(event) {
    event.preventDefault();

    const target = event.target.closest('[name]') || event.target;
    const data = event.dataTransfer.getData("text");
    const draggedElement = document.getElementById(data);

    if (!draggedElement) {
        console.error("Dragged element not found in the DOM");
        return;
    }

    const draggedPosition = draggedElement.getAttribute('name') || 
                             findParentWithAttribute(draggedElement, 'data-name')?.getAttribute('data-name');

    if (!draggedPosition) {
        console.error("Dragged element position could not be determined");
        return;
    }

    if (target.hasAttribute('name')) {
        const targetPosition = target.getAttribute('name');

        const playersList = JSON.parse(localStorage.getItem("Playerslist")) || [];
        const playerIndex = playerIds.indexOf(data);
        const playerInStorage = playersList[playerIndex];

        console.log('Debugging:', {
            draggedPosition: draggedPosition,
            targetPosition: targetPosition,
            playerStoragePosition: playerInStorage ? playerInStorage.position : 'No player found'
        });

        if (draggedPosition === targetPosition) {
            if (!target.classList.contains('filled')) {
                target.innerHTML = '';
                target.appendChild(draggedElement);
                target.classList.add('filled');
            } else {
                alert('Slot is already filled');
            }
        } else {
            alert('Position mismatch');
            console.log({
                draggedElement,
                draggedPosition,
                targetPosition
            });
        }
    } else {
        alert('Cannot drop here');
    }
}

function findParentWithAttribute(element, attributeName) {
    while (element && !element.hasAttribute(attributeName)) {
        element = element.parentElement;
    }
    return element;
}

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll('.hmed').forEach(slot => {
        slot.setAttribute('ondrop', 'drop(event)');
        slot.setAttribute('ondragover', 'allowDrop(event)');
    });
});