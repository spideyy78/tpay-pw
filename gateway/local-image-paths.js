(function () {
  var OFFER = "/offer";
  function fix(u) {
    if (typeof u !== "string") return u;
    if (u.startsWith(OFFER + "/")) return u;
    if (u.startsWith("/trust-assets/")) return OFFER + u;
    if (u.startsWith("/assets/") && /\.(png|jpe?g|webp|svg|woff2?|css)(\?|$)/i.test(u)) {
      return OFFER + u;
    }
    return u;
  }

  var desc = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, "src");
  if (desc && desc.set) {
    Object.defineProperty(HTMLImageElement.prototype, "src", {
      set: function (v) {
        desc.set.call(this, fix(v));
      },
      get: function () {
        return desc.get.call(this);
      },
    });
  }
})();