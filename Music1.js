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
// const playlistEl = document.getElementById('playlist'); // Removed: playlist is now handled by static HTML links

// 2. Define your songs data (Ensuring correct filenames ONLY)
const songs = [
    {
        title: 'Die With A Smile',
        artist: 'Lady Gaga, Bruno Mars',
        src: 'Die_With_A_Smile.mp3',
        cover: 'diewithsmile.jpg'
    },
    {
        title: 'Jhol Song',
        artist: 'Maanu x Annural Khalid, Coke Studio',
        src: 'Jhol.mp3',
        cover: 'Jhol.jpg'
    },
    {
        title: 'Shiddat Song',
        artist: 'Shiddat | Sunny Kaushal, Radhika Madan, Mohit Raina, Diana Penty',
        src: 'Shiddat.mp3',
        cover: 'Shiddat.jpg'
    }
];

// Initialize the current song index and playback state
// The songIndex is now determined by a global variable defined in each HTML page
let songIndex = typeof pageSongIndex !== 'undefined' ? pageSongIndex : 0;
let isPlaying = false;

// --- Functions to control the music player ---

// 3. Load a specific song's details into the player UI
function loadSong(index) {
    const song = songs[index];
    title.innerText = song.title;
    artist.innerText = song.artist;
    audio.src = `Musics/${song.src}`;
    cover.src = `Images/${song.cover}`;

    // Note: updatePlaylistActive is no longer needed for dynamically building the list,
    // as navigation is handled via static HTML links.
    // If you want to visually indicate the current page, that's done via `active-nav` class in HTML.
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

// 6. Navigate to the previous song's page
function prevSong() {
    // This will reload the page to the previous song's dedicated HTML file
    let newIndex = songIndex - 1;
    if (newIndex < 0) {
        newIndex = songs.length - 1; // Loop back to the last song
    }
    navigateToSongPage(newIndex);
}

// 7. Navigate to the next song's page
function nextSong() {
    // This will reload the page to the next song's dedicated HTML file
    let newIndex = songIndex + 1;
    if (newIndex > songs.length - 1) {
        newIndex = 0; // Loop back to the first song
    }
    navigateToSongPage(newIndex);
}

// Helper function to navigate to the correct song page
function navigateToSongPage(index) {
    let pageName = '';
    if (index === 0) {
        pageName = 'index.html';
    } else if (index === 1) {
        pageName = 'song2.html';
    } else if (index === 2) {
        pageName = 'song3.html';
    }
    // You would add more else if statements for more songs
    window.location.href = pageName;
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
    if (!isNaN(duration)) {
        audio.currentTime = (clickX / width) * duration;
    }
}

// 10. Control the volume using the slider
function setVolume() {
    audio.volume = volumeControl.value;
}

// --- Event Listeners ---

playBtn.addEventListener('click', () => {
    if (isPlaying) {
        pauseSong();
    } else {
        playSong();
    }
});

prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);

audio.addEventListener('timeupdate', updateProgress);
progressContainer.addEventListener('click', setProgress);
// Note: audio 'ended' event will trigger a full page reload now
audio.addEventListener('ended', nextSong);

volumeControl.addEventListener('input', setVolume);

audio.addEventListener('loadedmetadata', () => {
    let durationMinutes = Math.floor(audio.duration / 60);
    let durationSeconds = Math.floor(audio.duration % 60);
    if (durationSeconds < 10) durationSeconds = '0' + durationSeconds;
    durationEl.innerText = `${durationMinutes}:${durationSeconds}`;
});

// --- Initial Setup when the page loads ---
loadSong(songIndex); // Load the specific song for this page
// buildPlaylist() is removed as playlist navigation is now static HTML links