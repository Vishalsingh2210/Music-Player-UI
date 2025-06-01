// 1. Get references to HTML elements
const musicContainer = document.querySelector('.music-player-container');
const playBtn = document.getElementById('play');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');

const audio = document.getElementById('audio');
const progress = document.getElementById('progress');
const progressContainer = document.getElementById('progress-container');
const title = document.getElementById('title');
const artist = document.getElementById('artist');
const cover = document.getElementById('cover');
const currentTimeEl = document.getElementById('currentTime');
const durationEl = document.getElementById('duration');
const volumeControl = document.getElementById('volume');
const playlistEl = document.getElementById('playlist');

// 2. Define your songs data (***CRUCIAL FIXES HERE***)
// Each 'src' and 'cover' property MUST ONLY contain the filename.
// The folder path will be added in the loadSong function.
const songs = [
    {
        title: 'Die With A Smile', // Simplified title for display
        artist: 'Lady Gaga, Bruno Mars',
        src: 'Die_With_A_Smile.mp3', // ONLY the filename
        cover: 'diewithsmile.jpg'   // ONLY the filename
    },
    {
        title: 'Jhol Song',
        artist: 'Maanu x Annural Khalid, Coke Studio',
        src: 'Jhol.mp3', // ONLY the filename
        cover: 'Jhol.jpg'   // ONLY the filename
    },
    {
        title: 'Shiddat Song',
        artist: 'Shiddat | Sunny Kaushal, Radhika Madan, Mohit Raina, Diana Penty',
        src: 'Shiddat.mp3', // ONLY the filename
        cover: 'Shiddat.jpg'   // ONLY the filename
    }
    // Add more song objects here if needed, following the same filename-only format for src/cover
];

// Initialize the current song index and playback state
let songIndex = 0;
let isPlaying = false; // Define this variable at the top level

// --- Functions to control the music player ---

// 3. Load a specific song's details into the player UI
function loadSong(index) {
    const song = songs[index];
    title.innerText = song.title;
    artist.innerText = song.artist;
    // ***CRUCIAL FIX HERE: Correct relative paths with folder names***
    audio.src = `Musics/${song.src}`; // Correctly points to files in the 'Musics' folder
    cover.src = `Images/${song.cover}`; // Correctly points to files in the 'Images' folder

    updatePlaylistActive(index); // Highlight current song in playlist
}

// 4. Play the current song
function playSong() {
    isPlaying = true;
    musicContainer.classList.add('play');
    playBtn.querySelector('i.fas').classList.remove('fa-play');
    playBtn.querySelector('i.fas').classList.add('fa-pause');
    audio.play();
}

// 5. Pause the current song
function pauseSong() {
    isPlaying = false;
    musicContainer.classList.remove('play');
    playBtn.querySelector('i.fas').classList.add('fa-play');
    playBtn.querySelector('i.fas').classList.remove('fa-pause');
    audio.pause();
}

// 6. Go to the previous song
function prevSong() {
    songIndex--;
    if (songIndex < 0) {
        songIndex = songs.length - 1; // Loop back to the last song
    }
    loadSong(songIndex);
    playSong();
}

// 7. Go to the next song
function nextSong() {
    songIndex++;
    if (songIndex > songs.length - 1) {
        songIndex = 0; // Loop back to the first song
    }
    loadSong(songIndex);
    playSong();
}

// 8. Update the progress bar and time displays
function updateProgress(e) {
    const { duration, currentTime } = e.srcElement;
    const progressPercent = (currentTime / duration) * 100;
    progress.style.width = `${progressPercent}%`;

    let currentMinutes = Math.floor(currentTime / 60);
    let currentSeconds = Math.floor(currentTime % 60);
    if (currentSeconds < 10) currentSeconds = '0' + currentSeconds;
    currentTimeEl.innerText = `${currentMinutes}:${currentSeconds}`;

    // Ensure duration is a valid number before attempting to format it
    if (duration && !isNaN(duration)) {
        let durationMinutes = Math.floor(duration / 60);
        let durationSeconds = Math.floor(duration % 60);
        if (durationSeconds < 10) durationSeconds = '0' + durationSeconds;
        durationEl.innerText = `${durationMinutes}:${durationSeconds}`;
    }
}

// 9. Allow user to seek (jump) to a specific point in the song
function setProgress(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;
    // Only allow seeking if duration is valid
    if (!isNaN(duration)) {
        audio.currentTime = (clickX / width) * duration;
    }
}

// 10. Control the volume using the slider
function setVolume() {
    audio.volume = volumeControl.value;
}

// 11. Dynamically build the playlist from the 'songs' array
function buildPlaylist() {
    playlistEl.innerHTML = '';
    songs.forEach((song, index) => {
        const li = document.createElement('li');
        li.innerText = `${song.title} - ${song.artist}`;
        li.setAttribute('data-index', index);
        li.addEventListener('click', () => {
            songIndex = index;
            loadSong(songIndex);
            playSong();
        });
        playlistEl.appendChild(li);
    });
}

// 12. Update the 'active' class on the current song in the playlist
function updatePlaylistActive(index) {
    const playlistItems = playlistEl.querySelectorAll('li');
    playlistItems.forEach((item, idx) => {
        if (idx === index) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

// --- Event Listeners ---

// Play/Pause button click
playBtn.addEventListener('click', () => {
    // Use the `isPlaying` variable declared globally
    if (isPlaying) {
        pauseSong();
    } else {
        playSong();
    }
});

// Previous button click
prevBtn.addEventListener('click', prevSong);

// Next button click
nextBtn.addEventListener('click', nextSong);

// Audio 'timeupdate' event (fires frequently as audio plays)
audio.addEventListener('timeupdate', updateProgress);

// Progress bar container click (for seeking)
progressContainer.addEventListener('click', setProgress);

// Audio 'ended' event (when a song finishes)
audio.addEventListener('ended', nextSong);

// Volume slider 'input' event (fires as the slider is dragged)
volumeControl.addEventListener('input', setVolume);

// Audio 'loadedmetadata' event (fires when browser loads enough info about the audio)
audio.addEventListener('loadedmetadata', () => {
    let durationMinutes = Math.floor(audio.duration / 60);
    let durationSeconds = Math.floor(audio.duration % 60);
    if (durationSeconds < 10) durationSeconds = '0' + durationSeconds;
    durationEl.innerText = `${durationMinutes}:${durationSeconds}`;
});

// --- Initial Setup when the page loads ---
loadSong(songIndex); // Load the first song when the page loads
buildPlaylist();    // Populate the playlist with all songs