// Shows player: videos play in place. Without JavaScript, and for modified
// clicks (new tab, new window), every entry is still a plain YouTube link.
(function () {
  var stage = document.querySelector(".shows-stage");
  var screen = document.getElementById("showsScreen");
  var poster = document.getElementById("showsPoster");
  var videos = Array.from(document.querySelectorAll(".shows-video"));
  var current = videos.find((video) => video.getAttribute("aria-current")) || videos[0];

  function isPlainClick(e) {
    return e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey;
  }

  function select(video) {
    current = video;
    videos.forEach((other) => other.removeAttribute("aria-current"));
    video.setAttribute("aria-current", "true");

    document.getElementById("showsTitle").textContent = video.dataset.title;
    document.getElementById("showsDescription").textContent = video.dataset.description;
    document.getElementById("showsLink").href = video.href;

    setExpanded(video.closest(".shows-group"), true);
  }

  // Groups only fold on phones. Elsewhere, the stylesheet keeps them all open.
  function setExpanded(group, isExpanded) {
    group.classList.toggle("shows-group--folded", !isExpanded);
    group.querySelector(".shows-expand").setAttribute("aria-expanded", isExpanded);
  }

  document.querySelectorAll(".shows-group").forEach((group) => {
    setExpanded(group, group.contains(current));
    group.querySelector(".shows-expand").addEventListener("click", () => {
      setExpanded(group, group.classList.contains("shows-group--folded"));
    });
  });

  function play() {
    var player = document.createElement("iframe");
    player.className = "shows-player";
    player.title = current.dataset.title;
    player.allow = "autoplay; encrypted-media; fullscreen; picture-in-picture";
    player.allowFullscreen = true;
    player.referrerPolicy = "strict-origin-when-cross-origin";
    player.src = "https://www.youtube-nocookie.com/embed/" + current.dataset.video + "?autoplay=1&rel=0&playsinline=1";
    screen.replaceChildren(player);
    return player;
  }

  poster.addEventListener("click", (e) => {
    if (!isPlainClick(e)) {
      return;
    }
    e.preventDefault();
    play().focus();
  });

  videos.forEach((video) => {
    video.addEventListener("click", (e) => {
      if (!isPlainClick(e)) {
        return;
      }
      e.preventDefault();
      select(video);
      play();

      // The list sits below the screen, so make sure that the screen is in view.
      var reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
      stage.scrollIntoView({ block: "nearest", behavior: reduceMotion ? "auto" : "smooth" });
    });
  });

  // Links elsewhere on the page that play an episode in the shows player.
  document.querySelectorAll("[data-play]").forEach((link) => {
    link.addEventListener("click", (e) => {
      var video = videos.find((video) => video.dataset.video === link.dataset.play);
      if (!isPlainClick(e) || !video) {
        return;
      }
      e.preventDefault();
      select(video);
      play().focus({ preventScroll: true });

      var reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
      stage.scrollIntoView({ block: "start", behavior: reduceMotion ? "auto" : "smooth" });
    });
  });
})();
