/* Historia — classement en ligne (top 10, quiz « Tous les thèmes »), Firebase Auth + Firestore.
   Chargé à la demande : aucun appel réseau tant que le joueur n'ouvre pas le classement. */
(function () {
  "use strict";
  var cfg = window.HISTORIA_FIREBASE || {};
  var ready = null, db = null, auth = null;
  function enabled() { return !!(cfg.apiKey && cfg.projectId); }
  function load(src) {
    return new Promise(function (ok, ko) { var s = document.createElement("script"); s.src = src; s.onload = ok; s.onerror = function () { ko(new Error("net")); }; document.head.appendChild(s); });
  }
  function init() {
    if (!enabled()) return Promise.reject(new Error("off"));
    if (ready) return ready;
    ready = load("vendor/firebase/firebase-app-compat.js")
      .then(function () { return Promise.all([load("vendor/firebase/firebase-auth-compat.js"), load("vendor/firebase/firebase-firestore-compat.js")]); })
      .then(function () { var app = firebase.initializeApp(cfg); auth = app.auth(); db = app.firestore(); return new Promise(function (ok) { var u = auth.onAuthStateChanged(function () { u(); ok(); }); }); })
      .catch(function (e) { ready = null; throw e; });
    return ready;
  }
  function user() { return auth && auth.currentUser ? { uid: auth.currentUser.uid, name: auth.currentUser.displayName || "" } : null; }
  function clean(n) { return String(n || "").replace(/[<>&"']/g, "").trim().slice(0, 16); }
  function signUp(email, pass, name) {
    name = clean(name); if (name.length < 3) return Promise.reject(new Error("name"));
    return init().then(function () { return auth.createUserWithEmailAndPassword(email, pass); })
      .then(function (c) { return c.user.updateProfile({ displayName: name }); });
  }
  function signIn(email, pass) { return init().then(function () { return auth.signInWithEmailAndPassword(email, pass); }); }
  function signOut() { return init().then(function () { return auth.signOut(); }); }
  function reset(email) { return init().then(function () { return auth.sendPasswordResetEmail(email); }); }
  function deleteAccount() {
    return init().then(function () {
      var u = auth.currentUser; if (!u) return;
      return db.collection("board").doc(u.uid).delete().catch(function () {}).then(function () { return u.delete(); });
    });
  }
  function submit(score) {
    if (!enabled() || !score) return Promise.resolve();
    return init().then(function () {
      var u = auth.currentUser; if (!u) return;
      var ref = db.collection("board").doc(u.uid);
      return ref.get().then(function (d) {
        if (d.exists && d.data().score >= score) return;
        return ref.set({ name: clean(u.displayName) || "Anonyme", score: score, ts: firebase.firestore.FieldValue.serverTimestamp() });
      });
    }).catch(function () {});
  }
  function top() {
    return init().then(function () { return db.collection("board").orderBy("score", "desc").limit(10).get(); })
      .then(function (q) { return q.docs.map(function (d) { var v = d.data(); return { uid: d.id, name: v.name, score: v.score }; }); });
  }
  window.HistoriaBoard = { enabled: enabled, init: init, user: user, signUp: signUp, signIn: signIn, signOut: signOut, reset: reset, deleteAccount: deleteAccount, submit: submit, top: top };
})();
