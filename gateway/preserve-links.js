(function () {
  var q = window.location.search;
  if (!q) return;
  document.querySelectorAll("a[href]").forEach(function (a) {
    var href = a.getAttribute("href");
    if (!href || href.startsWith("http") || href.startsWith("#")) return;
    a.setAttribute("href", href.split("?")[0] + q);
  });
})();