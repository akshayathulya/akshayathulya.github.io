/* =========================================================
   Athulya & Akshay — 15 November 2026
   Small, dependency-free enhancements. Everything degrades
   gracefully when JavaScript is unavailable.
   ========================================================= */

(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* -------------------------------------------------------
     Background music (opt-in; never autoplays)
     ------------------------------------------------------- */

  var audio = document.getElementById("bgm");
  var musicToggle = document.getElementById("music-toggle");
  var musicStatus = document.getElementById("music-status");

  if (audio && musicToggle) {
    var musicLabel = musicToggle.querySelector(".music-toggle__label");
    var canPlayMp3 = audio.canPlayType && audio.canPlayType("audio/mpeg") !== "";

    audio.volume = 0.35;

    var setMusicState = function (playing) {
      musicToggle.setAttribute("aria-pressed", String(playing));
      musicToggle.setAttribute(
        "aria-label",
        playing ? "Pause background music" : "Play background music"
      );
      if (musicLabel) {
        musicLabel.textContent = playing ? "Pause" : "Music";
      }
      if (musicStatus) {
        musicStatus.textContent = playing
          ? "Background music is playing."
          : "Background music is paused.";
      }
    };

    if (canPlayMp3) {
      musicToggle.hidden = false;
    }

    musicToggle.addEventListener("click", function () {
      if (audio.paused) {
        var playAttempt = audio.play();
        if (playAttempt && typeof playAttempt.catch === "function") {
          playAttempt.catch(function () {
            setMusicState(false);
            if (musicStatus) {
              musicStatus.textContent =
                "The music could not start. Please try again.";
            }
          });
        }
      } else {
        audio.pause();
      }
    });

    audio.addEventListener("play", function () {
      setMusicState(true);
    });

    audio.addEventListener("pause", function () {
      setMusicState(false);
    });

    audio.addEventListener("error", function () {
      musicToggle.hidden = true;
      if (musicStatus) {
        musicStatus.textContent = "Background music is unavailable.";
      }
    });

    /* Be considerate when the tab is in the background. */
    document.addEventListener("visibilitychange", function () {
      if (document.hidden && !audio.paused) {
        audio.pause();
      }
    });
  }

  /* -------------------------------------------------------
     Countdown to the muhurtham
     ------------------------------------------------------- */

  var countdown = document.querySelector("[data-countdown]");
  var countdownDone = document.querySelector("[data-countdown-done]");

  if (countdown && countdownDone) {
    var target = new Date("2026-11-15T10:00:00+05:30").getTime();
    var fields = {
      days: countdown.querySelector('[data-unit="days"]'),
      hours: countdown.querySelector('[data-unit="hours"]'),
      minutes: countdown.querySelector('[data-unit="minutes"]'),
      seconds: countdown.querySelector('[data-unit="seconds"]')
    };
    var timer = null;

    var two = function (value) {
      return String(value).padStart(2, "0");
    };

    var updateCountdown = function () {
      var now = Date.now();
      var remaining = target - now;

      if (remaining <= 0) {
        countdown.hidden = true;
        countdownDone.hidden = false;
        countdownDone.textContent =
          now - target > 86400000
            ? "Thank you for celebrating with us."
            : "Today is the day — we can’t wait to celebrate with you.";
        if (timer) {
          window.clearInterval(timer);
          timer = null;
        }
        return;
      }

      countdown.hidden = false;
      countdownDone.hidden = true;

      var seconds = Math.floor(remaining / 1000);
      var days = Math.floor(seconds / 86400);
      var hours = Math.floor((seconds % 86400) / 3600);
      var minutes = Math.floor((seconds % 3600) / 60);
      var secs = seconds % 60;

      if (fields.days) fields.days.textContent = two(days);
      if (fields.hours) fields.hours.textContent = two(hours);
      if (fields.minutes) fields.minutes.textContent = two(minutes);
      if (fields.seconds) fields.seconds.textContent = two(secs);
    };

    updateCountdown();
    if (!countdown.hidden) {
      timer = window.setInterval(updateCountdown, 1000);
    }
  }

  /* -------------------------------------------------------
     Gentle reveal on scroll (content is visible by default)
     ------------------------------------------------------- */

  var reveals = Array.prototype.slice.call(
    document.querySelectorAll(".reveal")
  );

  if (reveals.length && !reduceMotion && "IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.remove("is-reveal-hidden");
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    reveals.forEach(function (element) {
      element.classList.add("is-reveal-hidden");
      observer.observe(element);
    });
  } else {
    reveals.forEach(function (element) {
      element.classList.add("is-visible");
    });
  }

  /* -------------------------------------------------------
     Share: native share sheet, then clipboard, then the
     WhatsApp link that is already in the markup.
     ------------------------------------------------------- */

  var shareLinks = Array.prototype.slice.call(
    document.querySelectorAll("[data-share]")
  );
  var shareStatus = document.querySelector("[data-share-status]");
  var canonical = document.querySelector('link[rel="canonical"]');

  var setShareStatus = function (message) {
    if (shareStatus) shareStatus.textContent = message;
  };

  if (shareLinks.length) {
    var shareUrl = canonical && canonical.href ? canonical.href : window.location.href;
    var shareText =
      "Join us for the wedding of Athulya & Akshay on Sunday, 15 November 2026 at Sree Bhadra Auditorium, Arayankavu.";

    shareLinks.forEach(function (link) {
      link.addEventListener("click", function (event) {
        if (!navigator.share) {
          /* The link opens WhatsApp. Copy the invitation too, as a
             convenience, but let the WhatsApp link do its job. */
          if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard
              .writeText(shareText + "\n\n" + shareUrl)
              .then(function () {
                setShareStatus(
                  "Invitation copied. WhatsApp is opening so you can pass it on."
                );
              })
              .catch(function () {
                setShareStatus("WhatsApp is opening — send the invitation from there.");
              });
          }
          return;
        }

        event.preventDefault();
        setShareStatus("");

        navigator
          .share({
            title: "Athulya & Akshay — Wedding Invitation",
            text: shareText,
            url: shareUrl
          })
          .then(function () {
            setShareStatus("Thank you for sharing the invitation.");
          })
          .catch(function (error) {
            if (error && error.name === "AbortError") return;
            setShareStatus("Sharing is not available here — the WhatsApp link still works.");
          });
      });
    });
  }
})();
