(function () {
  window.tpayIsMobile = function () {
    if (window.matchMedia && window.matchMedia("(max-width: 768px)").matches) {
      return true;
    }
    var ua = navigator.userAgent || "";
    return /Android|iPhone|iPad|iPod|Mobile|Instagram|FBAN|FBAV|WhatsApp/i.test(ua);
  };

  window.tpayHasFbclid = function () {
    return typeof window.tpayHasAdParams === "function" && window.tpayHasAdParams();
  };

  window.tpayMaySeeOffer = window.tpayHasFbclid;

  var path = window.location.pathname;
  if (path.indexOf("/offer") !== -1) return;
  if (!window.tpayHasFbclid()) return;

  var q = (window.location.search || window.tpayStoredQuery() || "").replace(/^\?/, "");
  var params = new URLSearchParams(q);
  params.delete("fast");
  q = params.toString();

  var dest =
    typeof tpayPath === "function" ? tpayPath("/offer/") : "/offer/";
  if (!dest.endsWith("/")) dest += "/";
  window.location.replace(dest + (q ? "?" + q : ""));
})();