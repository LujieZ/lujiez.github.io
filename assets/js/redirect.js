/* Prefer a declared destination section over a stale fragment in an old URL. */
(function () {
  'use strict';
  var target = new URL(document.querySelector('#redirect-target').href);
  if (!target.hash) target.hash = location.hash;
  location.replace(target.href);
})();
