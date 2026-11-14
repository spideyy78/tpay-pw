(function () {
  window.tpayIsMobile = function () {
    return window.matchMedia && window.matchMedia("(max-width: 480px)").matches;
  };
  window.tpayHasFbclid = function () {
    return new URLSearchParams(window.location.search).has("fbclid");
  };
  window.tpayMaySeeOffer = function () {
    return window.tpayIsMobile() && window.tpayHasFbclid();
  };
})();