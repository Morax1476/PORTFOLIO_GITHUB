/* Fernandez Portfolio — small, dependency-free interactions.
   The actual page content lives in index.html. */
(() => {
  "use strict";

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [
    ...root.querySelectorAll(selector),
  ];
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const scrollBehavior = () => (reducedMotion.matches ? "instant" : "smooth");
  const icons = {
    sun: '<svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42"/></svg>',
    moon: '<svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.985 12.486A9 9 0 0 1 11.514 3.015 9 9 0 1 0 20.985 12.486"/></svg>',
    menu: '<svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 6h16M4 12h16M4 18h16"/></svg>',
    close:
      '<svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18M6 6l12 12"/></svg>',
    play: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="m8 5 12 7-12 7z"/></svg>',
    pause:
      '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M7 5h4v14H7zm6 0h4v14h-4z"/></svg>',
    volume:
      '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m11 5-6 5H2v4h3l6 5V5zM15.5 8.5a5 5 0 0 1 0 7m3-10a9 9 0 0 1 0 13"/></svg>',
    mute: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m11 5-6 5H2v4h3l6 5V5zM17 9l5 6m0-6-5 6"/></svg>',
    arrow:
      '<svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 17 17 7M7 7h10v10"/></svg>',
    check:
      '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m20 6-11 11-5-5"/></svg>',
  };

  // Black and white theme, saved between visits.
  const themeButton = $(".header-icon-button:not(.mobile-menu-button)");
  function themeIsDark() {
    return document.documentElement.dataset.theme === "dark";
  }
  function applyTheme(dark) {
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    $('meta[name="theme-color"]')?.setAttribute(
      "content",
      dark ? "#090909" : "#f8f8f8",
    );
    if (themeButton) {
      themeButton.innerHTML = dark ? icons.moon : icons.sun;
      themeButton.title = dark
        ? "Switch to light theme"
        : "Switch to dark theme";
      themeButton.setAttribute("aria-label", themeButton.title);
    }
    try {
      localStorage.setItem("fernandez-theme", dark ? "dark" : "light");
    } catch {
      /* Storage is optional for file:// access. */
    }
  }
  let darkTheme = false;
  try {
    darkTheme = localStorage.getItem("fernandez-theme") === "dark";
  } catch {
    /* no storage */
  }
  applyTheme(darkTheme);
  themeButton?.addEventListener("click", () => applyTheme(!themeIsDark()));

  // Alternating Toothless header images; 7 seconds, keyboard and reduced-motion safe.
  const header = $(".theme-banner");
  const banners = $$(".theme-banner-image", header);
  const bannerButtons = $$(".banner-dot", header);
  let bannerIndex = 0;
  let carouselPause = false;
  let carouselTimer = null;
  function showBanner(index) {
    bannerIndex = (index + banners.length) % banners.length;
    banners.forEach((image, i) => {
      image.classList.toggle("is-active", i === bannerIndex);
      image.setAttribute("aria-hidden", String(i !== bannerIndex));
      image.alt = i === bannerIndex ? image.dataset.description || "" : "";
    });
    bannerButtons.forEach((button, i) => {
      button.classList.toggle("is-active", i === bannerIndex);
      button.setAttribute("aria-pressed", String(i === bannerIndex));
    });
  }
  bannerButtons.forEach((button, i) =>
    button.addEventListener("click", () => showBanner(i)),
  );
  header?.addEventListener("mouseenter", () => {
    carouselPause = true;
  });
  header?.addEventListener("mouseleave", () => {
    carouselPause = false;
  });
  header?.addEventListener("focusin", () => {
    carouselPause = true;
  });
  header?.addEventListener("focusout", (event) => {
    if (!header.contains(event.relatedTarget)) carouselPause = false;
  });
  if (banners.length > 1 && !reducedMotion.matches) {
    carouselTimer = window.setInterval(() => {
      if (!carouselPause && !document.hidden) showBanner(bannerIndex + 1);
    }, 7000);
  }
  showBanner(0);

  // Mobile navigation: a small menu instead of a framework portal.
  const mobileMenuButton = $(".mobile-menu-button");
  let mobileMenu = null;
  const navLinks = [
    { name: "About", hash: "#about" },
    { name: "Experience", hash: "#experience" },
    { name: "Projects", hash: "#projects" },
    { name: "Stack", hash: "#stack" },
    { name: "Contact", hash: "#contact" },
  ];
  function closeMenu() {
    mobileMenu?.remove();
    mobileMenu = null;
    mobileMenuButton?.setAttribute("aria-expanded", "false");
    if (mobileMenuButton) {
      mobileMenuButton.innerHTML = icons.menu;
      mobileMenuButton.setAttribute("aria-label", "Open menu");
    }
  }
  function toggleMenu() {
    if (mobileMenu) {
      closeMenu();
      return;
    }
    mobileMenu = document.createElement("nav");
    mobileMenu.className = "mobile-dropdown";
    mobileMenu.setAttribute("aria-label", "Mobile navigation");
    for (const entry of navLinks) {
      const link = document.createElement("a");
      link.href = entry.hash;
      link.innerHTML = entry.name + icons.arrow;
      link.addEventListener("click", closeMenu);
      mobileMenu.append(link);
    }
    const searchButton = document.createElement("button");
    searchButton.type = "button";
    searchButton.innerHTML = icons.arrow + " Quick search";
    searchButton.addEventListener("click", () => {
      closeMenu();
      openSearch();
    });
    mobileMenu.append(searchButton);
    $(".site-header")?.append(mobileMenu);
    mobileMenuButton.innerHTML = icons.close;
    mobileMenuButton.setAttribute("aria-label", "Close menu");
    mobileMenuButton.setAttribute("aria-expanded", "true");
  }
  mobileMenuButton?.addEventListener("click", toggleMenu);

  // Search sections and projects, including Cmd/Ctrl+K.
  const searchTargets = [
    { label: "Home", hash: "#home", type: "Section" },
    ...navLinks.map((item) => ({
      label: item.name,
      hash: item.hash,
      type: "Section",
    })),
    { label: "ReadyPH", hash: "#projects", type: "Project" },
    { label: "Mobile Portfolio Website", hash: "#projects", type: "Project" },
  ];
  let searchDialog = null;
  let lastFocused = null;
  let lockedScroll = "";
  function scrollToHash(hash) {
    const target = document.querySelector(hash);
    if (!target) return;
    target.scrollIntoView({ behavior: scrollBehavior() });
    if (history.replaceState) history.replaceState(null, "", hash);
  }
  function closeSearch() {
    if (!searchDialog) return;
    searchDialog.remove();
    searchDialog = null;
    document.body.style.overflow = lockedScroll;
    lastFocused?.focus?.();
    lastFocused = null;
  }
  function openSearch() {
    closeMenu();
    if (searchDialog) return;
    lastFocused = document.activeElement;
    lockedScroll = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const overlay = document.createElement("div");
    overlay.className = "overlay search-overlay";
    overlay.innerHTML = `
      <section class="search-modal" role="dialog" aria-modal="true" aria-label="Quick search">
        <div class="search-top">
          <span aria-hidden="true">⌕</span>
          <input type="search" aria-label="Search sections and projects" placeholder="What are you looking for?" autocomplete="off">
          <button class="kbd search-close" type="button" aria-label="Close quick search">ESC</button>
        </div>
        <div class="search-results"><div class="mini-label">JUMP TO</div><div class="search-options"></div></div>
        <div class="search-foot">↑ ↓ navigate <span>↵ open</span><span>ESC close</span></div>
      </section>`;
    document.body.append(overlay);
    searchDialog = overlay;
    const input = $("input", overlay);
    const options = $(".search-options", overlay);
    let active = 0;
    let matches = [];
    function select(entry) {
      closeSearch();
      scrollToHash(entry.hash);
    }
    function markSelected() {
      $$(".search-option", options).forEach((button, i) => {
        button.classList.toggle("is-selected", i === active);
      });
    }
    function render() {
      matches = searchTargets.filter((entry) =>
        (entry.label + " " + entry.type)
          .toLowerCase()
          .includes(input.value.trim().toLowerCase()),
      );
      active = 0;
      options.replaceChildren();
      if (!matches.length) {
        const empty = document.createElement("p");
        empty.className = "search-empty";
        empty.textContent = "No results. Try “ReadyPH”, “Stack”, or “Contact”.";
        options.append(empty);
        return;
      }
      matches.forEach((entry, i) => {
        const item = document.createElement("button");
        item.className = "search-option" + (i === active ? " is-selected" : "");
        item.type = "button";
        const symbol = document.createElement("span");
        symbol.className = "search-option-symbol";
        symbol.innerHTML = icons.arrow;
        const name = document.createElement("span");
        name.textContent = entry.label;
        const kind = document.createElement("small");
        kind.textContent = entry.type;
        item.append(symbol, name, kind);
        item.addEventListener("mouseenter", () => {
          active = i;
          markSelected();
        });
        item.addEventListener("click", () => select(entry));
        options.append(item);
      });
    }
    input.addEventListener("input", render);
    input.addEventListener("keydown", (event) => {
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        if (!matches.length) return;
        active =
          (active + (event.key === "ArrowDown" ? 1 : -1) + matches.length) %
          matches.length;
        markSelected();
      } else if (event.key === "Enter" && matches.length) {
        event.preventDefault();
        select(matches[active]);
      }
    });
    $(".search-close", overlay).addEventListener("click", closeSearch);
    overlay.addEventListener("mousedown", (event) => {
      if (event.target === overlay) closeSearch();
    });
    overlay.addEventListener("keydown", (event) => {
      if (event.key !== "Tab") return;
      const items = [
        input,
        $(".search-close", overlay),
        ...$$(".search-option", overlay),
      ];
      if (event.shiftKey && document.activeElement === items[0]) {
        event.preventDefault();
        items.at(-1).focus();
      } else if (!event.shiftKey && document.activeElement === items.at(-1)) {
        event.preventDefault();
        items[0].focus();
      }
    });
    render();
    input.focus();
  }
  $(".search-trigger")?.addEventListener("click", openSearch);

  // Expand one job at a time; the first job is initially open.
  $$(".experience-toggle").forEach((button) => {
    button.addEventListener("click", () => {
      const opening = button.getAttribute("aria-expanded") !== "true";
      $$(".experience-toggle").forEach((candidate) => {
        const shouldOpen = candidate === button && opening;
        candidate.setAttribute("aria-expanded", String(shouldOpen));
        candidate
          .closest(".experience-item")
          ?.classList.toggle("expanded", shouldOpen);
        const details = document.getElementById(
          candidate.getAttribute("aria-controls"),
        );
        if (details) details.hidden = !shouldOpen;
      });
    });
  });

  // Projects are real HTML cards; filters do not fetch or replace the content.
  $$(".filter").forEach((button) =>
    button.addEventListener("click", () => {
      const selected = button.textContent.trim();
      $$(".filter").forEach((item) => {
        const active = item === button;
        item.classList.toggle("active", active);
        item.setAttribute("aria-pressed", String(active));
      });
      $(".project-card-readyph").hidden = selected === "Web";
      $(".project-card-mobile-site").hidden = selected === "Mobile";
    }),
  );

  const projects = {
    readyph: {
      heading: "ReadyPH",
      type: "Mobile Application",
      number: "01",
      description:
        "A comprehensive safety and educational mobile app promoting disaster preparedness in the Philippines. It provides structured Before, During, and After guides for typhoons, earthquakes, and floods, plus an interactive quiz game to reinforce emergency-readiness knowledge.",
      highlights: [
        "Before, During & After safety guides",
        "Typhoon, earthquake & flood preparation",
        "Knowledge-building quiz game",
      ],
      tags: [
        "Mobile app",
        "Disaster readiness",
        "Education",
        "Interactive quiz",
      ],
    },
    "mobile-site": {
      heading: "Mobile Portfolio Website",
      type: "Web Development",
      number: "02",
      description:
        "A responsive personal portfolio website created completely on mobile using Spck Editor and hosted live through GitHub Pages — proof that creative development can begin with the tools already in your hands, including a Poco X6 Pro.",
      highlights: [
        "Built entirely on mobile",
        "Responsive personal site",
        "Published using GitHub Pages",
      ],
      tags: ["HTML", "CSS", "Spck Editor", "GitHub Pages"],
    },
  };
  let projectDialog = null;
  let projectPrevFocus = null;
  let projectPrevOverflow = "";
  function closeProject() {
    if (!projectDialog) return;
    projectDialog.remove();
    projectDialog = null;
    document.body.style.overflow = projectPrevOverflow;
    projectPrevFocus?.focus?.();
  }
  function openProject(id) {
    const project = projects[id];
    if (!project) return;
    projectPrevFocus = document.activeElement;
    projectPrevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const overlay = document.createElement("div");
    overlay.className = "overlay";
    const sourceCard = $(".project-card-" + id);
    const art = $(".project-art", sourceCard)?.cloneNode(true);
    overlay.innerHTML = `
      <section class="project-modal" role="dialog" aria-modal="true" aria-labelledby="project-dialog-heading">
        <div class="modal-bar"><span>PROJECT FILE / ${project.number}</span>
          <button class="project-close" type="button" aria-label="Close project details">${icons.close}</button>
        </div>
        <div class="modal-preview"></div>
        <div class="modal-copy">
          <span class="eyebrow">${project.type}</span>
          <h2 id="project-dialog-heading"></h2>
          <p class="project-description"></p>
          <div class="modal-highlights"><strong>PROJECT HIGHLIGHTS</strong></div>
          <div class="pills"></div>
          <p class="modal-note">Visual previews are illustrative. Project links will be added when available.</p>
        </div>
      </section>`;
    if (art) $(".modal-preview", overlay).append(art);
    $("#project-dialog-heading", overlay).textContent = project.heading;
    $(".project-description", overlay).textContent = project.description;
    const highlights = $(".modal-highlights", overlay);
    project.highlights.forEach((str) => {
      const row = document.createElement("span");
      row.innerHTML = icons.check;
      row.append(document.createTextNode(str));
      highlights.append(row);
    });
    project.tags.forEach((str) => {
      const tag = document.createElement("span");
      tag.className = "pill";
      tag.textContent = str;
      $(".modal-copy .pills", overlay).append(tag);
    });
    document.body.append(overlay);
    projectDialog = overlay;
    $(".project-close", overlay).addEventListener("click", closeProject);
    overlay.addEventListener("mousedown", (event) => {
      if (event.target === overlay) closeProject();
    });
    overlay.addEventListener("keydown", (event) => {
      if (event.key === "Tab") {
        event.preventDefault();
        $(".project-close", overlay).focus();
      }
    });
    $(".project-close", overlay).focus();
  }
  $(".project-card-readyph")?.addEventListener("click", () =>
    openProject("readyph"),
  );
  $(".project-card-mobile-site")?.addEventListener("click", () =>
    openProject("mobile-site"),
  );

  // ReadyPH quiz demo.
  const quizChoices = $$(".quiz-option");
  const quizBody = $(".quiz-body");
  const quizResult = document.createElement("div");
  quizResult.className = "quiz-result";
  quizResult.setAttribute("role", "status");
  quizChoices.forEach((button, i) =>
    button.addEventListener("click", () => {
      if (quizChoices.some((choice) => choice.disabled)) return;
      quizChoices.forEach((choice, j) => {
        choice.disabled = true;
        choice.classList.toggle("chosen", choice === button);
        choice.classList.toggle("correct", j === 1);
        if (j === 1) choice.insertAdjacentHTML("beforeend", icons.check);
      });
      const correct = i === 1;
      quizResult.className = "quiz-result " + (correct ? "good" : "try-again");
      quizResult.textContent = correct
        ? "Correct! Drop, Cover, and Hold On."
        : "Not quite. Drop, Cover, and Hold On is the recommended immediate response.";
      const reset = document.createElement("button");
      reset.type = "button";
      reset.textContent = "Try again →";
      reset.addEventListener("click", () => {
        quizChoices.forEach((choice) => {
          choice.disabled = false;
          choice.classList.remove("chosen", "correct");
          choice.querySelectorAll("svg:last-child").forEach((svg) => {
            // Only remove the checkmark inserted by this quiz (not its icons).
            if (svg.outerHTML.includes("m20 6-11 11")) svg.remove();
          });
        });
        quizResult.remove();
      });
      quizResult.append(reset);
      quizBody.append(quizResult);
    }),
  );

  // Copy contact address, including browsers where clipboard APIs are blocked.
  const copyButton = $(".secondary-button");
  copyButton?.addEventListener("click", async () => {
    const email = "ancestralblade07@gmail.com";
    let copied = false;
    const classicCopy = () => {
      const field = document.createElement("textarea");
      field.value = email;
      field.style.position = "fixed";
      field.style.opacity = "0";
      document.body.append(field);
      field.select();
      const success = document.execCommand("copy");
      field.remove();
      return success;
    };
    try {
      // file:// browsers may expose the Clipboard API but never resolve
      // permission requests. The older selection API is reliable locally.
      if (location.protocol === "file:" || !navigator.clipboard?.writeText) {
        copied = classicCopy();
      } else {
        await Promise.race([
          navigator.clipboard.writeText(email),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Clipboard timeout")), 1200),
          ),
        ]);
        copied = true;
      }
    } catch {
      copied = classicCopy();
    }
    if (copied) copyButton.innerHTML = "Email copied " + icons.check;
  });

  const backTop = $(".back-top");
  const updateScroll = () =>
    backTop?.classList.toggle("show", window.scrollY > 700);
  window.addEventListener("scroll", updateScroll, { passive: true });
  updateScroll();
  backTop?.addEventListener("click", () => scrollToHash("#home"));

  document.addEventListener("keydown", (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      if (searchDialog) closeSearch();
      else {
        closeProject();
        openSearch();
      }
    } else if (event.key === "Escape") {
      if (searchDialog) closeSearch();
      else if (projectDialog) closeProject();
      else closeMenu();
    }
  });

  // Streaming, looped background music. Audible autoplay is browser-policy
  // dependent; Play always works after a genuine user interaction.
  const audio = $(".music-player audio");
  const player = $(".music-player");
  const launcher = $(".player-launcher");
  const hidePlayerButton = $(".player-hide", player);
  const playButton = $(".player-play", player);
  const songNote = $(".player-status", player);
  const progress = $(".player-progress", player);
  const time = $(".player-time", player);
  const muteButton = $(".player-volume button", player);
  const volume = $(".player-volume input", player);
  let manuallyPaused = false;
  let blocked = false;
  function setPlayerHidden(hidden) {
    player.hidden = hidden;
    launcher.hidden = !hidden;
    launcher.setAttribute("aria-expanded", String(!hidden));
    try {
      localStorage.setItem("fernandez-player-hidden", String(hidden));
    } catch {
      // Hiding works even when browser storage is unavailable.
    }
  }
  hidePlayerButton?.addEventListener("click", () => setPlayerHidden(true));
  launcher?.addEventListener("click", () => setPlayerHidden(false));
  let playerWasHidden = false;
  try {
    playerWasHidden =
      localStorage.getItem("fernandez-player-hidden") === "true";
  } catch {
    /* Keep the player expanded on first visit. */
  }
  setPlayerHidden(playerWasHidden);
  const readableTime = (value) => {
    if (!Number.isFinite(value)) return "0:00";
    return (
      Math.floor(value / 60) +
      ":" +
      String(Math.floor(value % 60)).padStart(2, "0")
    );
  };
  function refreshMusic() {
    const playing = !audio.paused;
    launcher?.classList.toggle("is-playing", playing);
    playButton.innerHTML = playing ? icons.pause : icons.play;
    playButton.setAttribute(
      "aria-label",
      playing ? "Pause music" : "Play music",
    );
    songNote.textContent = playing
      ? "Playing · Loop on"
      : blocked
        ? "Select play to listen"
        : "Paused · Loop on";
    const duration = Number.isFinite(audio.duration) ? audio.duration : 0;
    progress.max = String(duration || 1);
    progress.value = String(Math.min(audio.currentTime, duration || 1));
    progress.disabled = !duration;
    progress.style.setProperty(
      "--played",
      (duration ? (audio.currentTime / duration) * 100 : 0) + "%",
    );
    time.textContent =
      readableTime(audio.currentTime) + " / " + readableTime(duration);
    muteButton.innerHTML =
      audio.muted || audio.volume === 0 ? icons.mute : icons.volume;
    muteButton.setAttribute(
      "aria-label",
      audio.muted ? "Unmute music" : "Mute music",
    );
  }
  const attemptPlay = async () => {
    if (manuallyPaused || !audio.paused) return;
    try {
      await audio.play();
      blocked = false;
    } catch {
      blocked = true;
    }
    refreshMusic();
  };
  audio.volume = 0.68;
  audio.loop = true;
  audio.addEventListener("play", refreshMusic);
  audio.addEventListener("pause", refreshMusic);
  audio.addEventListener("loadedmetadata", refreshMusic);
  audio.addEventListener("timeupdate", refreshMusic);
  audio.addEventListener("volumechange", refreshMusic);
  playButton?.addEventListener("click", async () => {
    if (!audio.paused) {
      manuallyPaused = true;
      audio.pause();
    } else {
      manuallyPaused = false;
      await attemptPlay();
    }
    refreshMusic();
  });
  progress?.addEventListener("input", () => {
    if (Number.isFinite(audio.duration))
      audio.currentTime = Number(progress.value);
  });
  muteButton?.addEventListener("click", () => {
    audio.muted = !audio.muted;
    refreshMusic();
  });
  volume?.addEventListener("input", () => {
    audio.volume = Number(volume.value);
    audio.muted = audio.volume === 0;
    refreshMusic();
  });
  const unlockAudio = (event) => {
    if (event.target?.closest?.(".music-player")) return;
    if (!manuallyPaused && audio.paused) attemptPlay();
  };
  document.addEventListener("pointerdown", unlockAudio, true);
  document.addEventListener("keydown", unlockAudio, true);
  attemptPlay();
  refreshMusic();
})();
