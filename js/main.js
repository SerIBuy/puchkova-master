(function () {
  "use strict";

  /* ---------- Mobile menu ---------- */
  var burger = document.getElementById("burgerBtn");
  var burgerSpan = burger ? burger.querySelector(".burger-span") : null;
  var mobilePanel = document.getElementById("mobile-nav");

  function setMenu(open) {
    if (!burger || !mobilePanel || !burgerSpan) return;
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Закрыть меню" : "Открыть меню");
    burgerSpan.classList.toggle("burger-open", open);
    mobilePanel.classList.toggle("mobile-panel-open", open);
    document.body.style.overflow = open ? "hidden" : "";
  }

  if (burger) {
    burger.addEventListener("click", function () {
      setMenu(burger.getAttribute("aria-expanded") !== "true");
    });
  }

  Array.prototype.forEach.call(document.querySelectorAll(".mobile-link"), function (link) {
    link.addEventListener("click", function () {
      setMenu(false);
    });
  });

  /* ---------- Lightbox ---------- */
  var galleryButtons = document.querySelectorAll(".gallery-item");
  var lightbox = document.getElementById("lightbox");
  var lightboxImage = document.getElementById("lightboxImage");
  var lightboxCounter = document.getElementById("lightboxCounter");
  var closeBtn = document.getElementById("lightboxClose");
  var prevBtn = document.getElementById("lightboxPrev");
  var nextBtn = document.getElementById("lightboxNext");

  var items = Array.prototype.map.call(galleryButtons, function (btn) {
    var img = btn.querySelector("img");
    return { src: img.getAttribute("src"), alt: img.getAttribute("alt") };
  });

  var activeIndex = null;
  var touchStartX = null;

  function render() {
    if (activeIndex === null) return;
    var item = items[activeIndex];
    lightboxImage.src = item.src;
    lightboxImage.alt = item.alt;
    lightboxCounter.textContent = activeIndex + 1 + " / " + items.length;
  }

  function openLightbox(index) {
    activeIndex = index;
    render();
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
    lightbox.focus();
  }

  function closeLightbox() {
    activeIndex = null;
    lightbox.hidden = true;
    document.body.style.overflow = "";
  }

  function goPrev() {
    if (activeIndex === null) return;
    activeIndex = (activeIndex - 1 + items.length) % items.length;
    render();
  }

  function goNext() {
    if (activeIndex === null) return;
    activeIndex = (activeIndex + 1) % items.length;
    render();
  }

  Array.prototype.forEach.call(galleryButtons, function (btn) {
    btn.addEventListener("click", function () {
      openLightbox(Number(btn.getAttribute("data-index")));
    });
  });

  if (closeBtn) closeBtn.addEventListener("click", closeLightbox);
  if (prevBtn) {
    prevBtn.addEventListener("click", function (event) {
      event.stopPropagation();
      goPrev();
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener("click", function (event) {
      event.stopPropagation();
      goNext();
    });
  }

  if (lightbox) {
    lightbox.addEventListener("click", closeLightbox);
    lightboxImage.addEventListener("click", function (event) {
      event.stopPropagation();
    });

    lightbox.addEventListener("touchstart", function (event) {
      touchStartX = event.touches[0].clientX;
    });

    lightbox.addEventListener("touchend", function (event) {
      if (touchStartX === null) return;
      var delta = event.changedTouches[0].clientX - touchStartX;
      if (delta > 50) goPrev();
      if (delta < -50) goNext();
      touchStartX = null;
    });

    document.addEventListener("keydown", function (event) {
      if (activeIndex === null) return;
      if (event.key === "Escape") closeLightbox();
      if (event.key === "ArrowLeft") goPrev();
      if (event.key === "ArrowRight") goNext();
    });
  }

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();
