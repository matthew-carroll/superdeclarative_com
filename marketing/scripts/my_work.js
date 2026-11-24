// My Work: widgets run while they're on screen, unless the visitor paused them
// or asked their system for less motion.
(function () {
  var reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

  var observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      var video = entry.target;
      if (!entry.isIntersecting) {
        video.pause();
      } else if (!video.dataset.paused) {
        video.play().catch(() => {});
      }
    });
  }, { threshold: 0.25 });

  document.querySelectorAll(".work-tile").forEach((tile) => {
    var video = tile.querySelector(".work-video");
    var toggle = tile.querySelector(".work-toggle");
    var name = toggle.getAttribute("aria-label").replace("Play ", "");

    function update() {
      tile.classList.toggle("work-tile--playing", !video.paused);
      toggle.setAttribute("aria-label", (video.paused ? "Play " : "Pause ") + name);
    }
    video.addEventListener("play", update);
    video.addEventListener("pause", update);

    toggle.addEventListener("click", () => {
      if (video.paused) {
        delete video.dataset.paused;
        video.play().catch(() => {});
      } else {
        video.dataset.paused = "true";
        video.pause();
      }
    });

    if (reduceMotion) {
      video.dataset.paused = "true";
    }
    observer.observe(video);
  });
})();
