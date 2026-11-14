(function () {
  function root() {
    if (location.hostname.endsWith("github.io")) {
      var seg = location.pathname.split("/").filter(Boolean)[0];
      return seg ? "/" + seg : "";
    }
    return "";
  }
  window.tpayRoot = root;
  window.tpayPath = function (path) {
    var p = path.charAt(0) === "/" ? path : "/" + path;
    return root() + p;
  };
})();