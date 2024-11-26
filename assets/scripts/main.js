let players = localStorage.setItem('players', JSON.stringify([]));
let gK_fildes = document.getElementById('goalkeeper-fields');
let player_fileds = document.getElementById('player-fields');
let container_fildes = document.getElementById('player-form-container');
// function addPlayer() {
// document.getElementById('goalkeeper-fields').classList.remove('hidden');
// document.getElementById('player-fields').classList.remove('hidden');
// }

function addPlayer(position) {
    // إظهار حاوية النموذج
    container_fildes.classList.remove('hidden');

    // التحقق من نوع اللاعب
    if (position === 'GK') {

        gK_fildes.classList.remove('hidden');
        player_fileds.classList.add('hidden');
    } else {

        player_fileds.classList.remove('hidden');
        gK_fildes.classList.add('hidden');
    }
}


window.onload = function() {
    container_fildes.classList.add('hidden');
    gK_fildes.classList.add('hidden');
   player_fileds.classList.add('hidden');
};