/* Uses the copy saved by the admin dashboard in this browser, when it is newer than data.js.
   Visitors never have that copy, so they always see data.js. */
(function () {
  try {
    var s = localStorage.getItem("kp-data");
    if (!s) return;
    var local = JSON.parse(s);
    if (!window.KP.updated || (local.updated || "") >= window.KP.updated) window.KP = local;
  } catch (e) {}
})();
