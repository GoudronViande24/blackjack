const fullscreenToggle = document.getElementById("fullscreen");
const icon = fullscreenToggle.querySelector("i");

fullscreenToggle.addEventListener("click", () => {
	if (isFullscreen()) {
		closeFullscreen();
		icon.classList.add("bi-fullscreen");
		icon.classList.remove("bi-fullscreen-exit");
	} else {
		openFullscreen();
		icon.classList.remove("bi-fullscreen");
		icon.classList.add("bi-fullscreen-exit");
	}
});

/** Request for fullscreen */
function openFullscreen() {
	const elem = document.documentElement;
	if (elem.requestFullscreen) {
		elem.requestFullscreen();
	} else if (elem.webkitRequestFullscreen) { /* Safari */
		elem.webkitRequestFullscreen();
	} else if (elem.msRequestFullscreen) { /* IE11 */
		elem.msRequestFullscreen();
	}
}

/** Close fullscreen */
function closeFullscreen() {
	if (document.exitFullscreen) {
		document.exitFullscreen();
	} else if (document.webkitExitFullscreen) { /* Safari */
		document.webkitExitFullscreen();
	} else if (document.msExitFullscreen) { /* IE11 */
		document.msExitFullscreen();
	}
}

/**
 * Check if fullscreen
 * @returns {boolean}
 */
function isFullscreen() {
	return 1 >= outerHeight - innerHeight;
}