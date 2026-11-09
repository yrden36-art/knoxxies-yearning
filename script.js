// This script creates the typed headline effect in the landing section.
(function () {
  var title = document.getElementById("title");
  var lines = Array.prototype.slice.call(title.querySelectorAll("span"));
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Skip the typing animation when the user prefers reduced motion.
  if (!reduce) {
    var texts = lines.map(function (line) {
      return line.textContent;
    });

    lines.forEach(function (line) {
      line.textContent = "";
    });

    var lineIndex = 0;
    var charIndex = 0;

    function type() {
      lines.forEach(function (line) {
        line.classList.remove("caret");
      });

      var currentLine = lines[lineIndex];
      currentLine.classList.add("caret");
      currentLine.textContent = texts[lineIndex].slice(0, ++charIndex);

      if (charIndex < texts[lineIndex].length) {
        setTimeout(type, 85);
      } else if (lineIndex < lines.length - 1) {
        lineIndex += 1;
        charIndex = 0;
        setTimeout(type, 350);
      } else {
        setTimeout(function () {
          currentLine.classList.remove("caret");
        }, 3000);
      }
    }

    setTimeout(type, 400);
  }

  function scrollToTop() {
    if (window.scrollY > 40) {
      window.scrollTo({
        top: 0,
        behavior: reduce ? "auto" : "smooth"
      });
    }
  }

  // This code makes the back-to-top link scroll smoothly without changing the URL hash.
  document.getElementById("toTop").addEventListener("click", function (event) {
    event.preventDefault();
    scrollToTop();
  });

  // Reveal each poem when it enters the viewport so the page feels more cinematic.
  var poemSections = document.querySelectorAll(".poem");
  if ("IntersectionObserver" in window) {
    var poemObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          poemObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.18,
      rootMargin: "0px 0px -8% 0px"
    });

    poemSections.forEach(function (poem) {
      poemObserver.observe(poem);
    });
  } else {
    poemSections.forEach(function (poem) {
      poem.classList.add("visible");
    });
  }

  // On touch devices, tapping the page sends the reader back to the top.
  document.addEventListener("touchstart", function (event) {
    var target = event.target;
    if (!target || target.closest("a, button, input, textarea, select, label")) {
      return;
    }

    if (window.innerWidth <= 980) {
      scrollToTop();
    }
  }, { passive: true });

  // On desktop, right-clicking the page returns the reader to the top.
  document.addEventListener("contextmenu", function (event) {
    if (window.innerWidth > 980) {
      event.preventDefault();
      scrollToTop();
    }
  });
})();
