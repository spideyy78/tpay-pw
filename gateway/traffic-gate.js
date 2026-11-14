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

  if (!window.tpayMaySeeOffer()) return;

  var path = window.location.pathname;
  if (path.indexOf("/offer") !== -1) return;

  var params = new URLSearchParams(window.location.search);
  params.delete("fast");
  var q = params.toString();
  var dest = typeof tpayPath === "function" ? tpayPath("/offer/") : "/offer/";
  window.location.replace(dest + (q ? "?" + q : ""));
})();