(function () {
  window.tpayIsMobile = function () {
    if (window.matchMedia && window.matchMedia("(max-width: 768px)").matches) {
      return true;
    }
    var ua = navigator.userAgent || "";
    return /Android|iPhone|iPad|iPod|Mobile|Instagram|FBAN|FBAV|WhatsApp/i.test(ua);
  };
  window.tpayHasFbclid = function () {
    return new URLSearchParams(window.location.search).has("fbclid");
  };
  window.tpayMaySeeOffer = function () {
    return window.tpayHasFbclid();
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