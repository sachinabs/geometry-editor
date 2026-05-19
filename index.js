import { jsxs as L, jsx as f } from "react/jsx-runtime";
import xt, { useState as dt, useRef as tt, useEffect as pt, forwardRef as Yt, useCallback as ot, useImperativeHandle as Vt } from "react";
const Xt = {}, Pt = (t) => {
  let a;
  const e = /* @__PURE__ */ new Set(), s = (l, m) => {
    const S = typeof l == "function" ? l(a) : l;
    if (!Object.is(S, a)) {
      const v = a;
      a = m ?? (typeof S != "object" || S === null) ? S : Object.assign({}, a, S), e.forEach((h) => h(a, v));
    }
  }, r = () => a, i = { setState: s, getState: r, getInitialState: () => d, subscribe: (l) => (e.add(l), () => e.delete(l)), destroy: () => {
    (Xt ? "production" : void 0) !== "production" && console.warn(
      "[DEPRECATED] The `destroy` method will be unsupported in a future version. Instead use unsubscribe function returned by subscribe. Everything will be garbage-collected if store is garbage-collected."
    ), e.clear();
  } }, d = a = t(s, r, i);
  return i;
}, Ut = (t) => t ? Pt(t) : Pt;
function Kt(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
var _t = { exports: {} }, Mt = {}, gt = { exports: {} }, At = {};
/**
 * @license React
 * use-sync-external-store-shim.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Lt;
function Ft() {
  if (Lt) return At;
  Lt = 1;
  var t = xt;
  function a(m, S) {
    return m === S && (m !== 0 || 1 / m === 1 / S) || m !== m && S !== S;
  }
  var e = typeof Object.is == "function" ? Object.is : a, s = t.useState, r = t.useEffect, u = t.useLayoutEffect, n = t.useDebugValue;
  function o(m, S) {
    var v = S(), h = s({ inst: { value: v, getSnapshot: S } }), g = h[0].inst, B = h[1];
    return u(
      function() {
        g.value = v, g.getSnapshot = S, i(g) && B({ inst: g });
      },
      [m, v, S]
    ), r(
      function() {
        return i(g) && B({ inst: g }), m(function() {
          i(g) && B({ inst: g });
        });
      },
      [m]
    ), n(v), v;
  }
  function i(m) {
    var S = m.getSnapshot;
    m = m.value;
    try {
      var v = S();
      return !e(m, v);
    } catch {
      return !0;
    }
  }
  function d(m, S) {
    return S();
  }
  var l = typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u" ? d : o;
  return At.useSyncExternalStore = t.useSyncExternalStore !== void 0 ? t.useSyncExternalStore : l, At;
}
var Et = {};
/**
 * @license React
 * use-sync-external-store-shim.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Rt;
function qt() {
  return Rt || (Rt = 1, process.env.NODE_ENV !== "production" && function() {
    function t(v, h) {
      return v === h && (v !== 0 || 1 / v === 1 / h) || v !== v && h !== h;
    }
    function a(v, h) {
      l || r.startTransition === void 0 || (l = !0, console.error(
        "You are using an outdated, pre-release alpha of React 18 that does not support useSyncExternalStore. The use-sync-external-store shim will not work correctly. Upgrade to a newer pre-release."
      ));
      var g = h();
      if (!m) {
        var B = h();
        u(g, B) || (console.error(
          "The result of getSnapshot should be cached to avoid an infinite loop"
        ), m = !0);
      }
      B = n({
        inst: { value: g, getSnapshot: h }
      });
      var G = B[0].inst, U = B[1];
      return i(
        function() {
          G.value = g, G.getSnapshot = h, e(G) && U({ inst: G });
        },
        [v, g, h]
      ), o(
        function() {
          return e(G) && U({ inst: G }), v(function() {
            e(G) && U({ inst: G });
          });
        },
        [v]
      ), d(g), g;
    }
    function e(v) {
      var h = v.getSnapshot;
      v = v.value;
      try {
        var g = h();
        return !u(v, g);
      } catch {
        return !0;
      }
    }
    function s(v, h) {
      return h();
    }
    typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(Error());
    var r = xt, u = typeof Object.is == "function" ? Object.is : t, n = r.useState, o = r.useEffect, i = r.useLayoutEffect, d = r.useDebugValue, l = !1, m = !1, S = typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u" ? s : a;
    Et.useSyncExternalStore = r.useSyncExternalStore !== void 0 ? r.useSyncExternalStore : S, typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(Error());
  }()), Et;
}
var Dt;
function jt() {
  return Dt || (Dt = 1, process.env.NODE_ENV === "production" ? gt.exports = Ft() : gt.exports = qt()), gt.exports;
}
/**
 * @license React
 * use-sync-external-store-shim/with-selector.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Nt;
function Zt() {
  if (Nt) return Mt;
  Nt = 1;
  var t = xt, a = jt();
  function e(d, l) {
    return d === l && (d !== 0 || 1 / d === 1 / l) || d !== d && l !== l;
  }
  var s = typeof Object.is == "function" ? Object.is : e, r = a.useSyncExternalStore, u = t.useRef, n = t.useEffect, o = t.useMemo, i = t.useDebugValue;
  return Mt.useSyncExternalStoreWithSelector = function(d, l, m, S, v) {
    var h = u(null);
    if (h.current === null) {
      var g = { hasValue: !1, value: null };
      h.current = g;
    } else g = h.current;
    h = o(
      function() {
        function G(W) {
          if (!U) {
            if (U = !0, Y = W, W = S(W), v !== void 0 && g.hasValue) {
              var M = g.value;
              if (v(M, W))
                return K = M;
            }
            return K = W;
          }
          if (M = K, s(Y, W)) return M;
          var J = S(W);
          return v !== void 0 && v(M, J) ? (Y = W, M) : (Y = W, K = J);
        }
        var U = !1, Y, K, V = m === void 0 ? null : m;
        return [
          function() {
            return G(l());
          },
          V === null ? void 0 : function() {
            return G(V());
          }
        ];
      },
      [l, m, S, v]
    );
    var B = r(d, h[0], h[1]);
    return n(
      function() {
        g.hasValue = !0, g.value = B;
      },
      [B]
    ), i(B), B;
  }, Mt;
}
var Ct = {};
/**
 * @license React
 * use-sync-external-store-shim/with-selector.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var $t;
function Qt() {
  return $t || ($t = 1, process.env.NODE_ENV !== "production" && function() {
    function t(d, l) {
      return d === l && (d !== 0 || 1 / d === 1 / l) || d !== d && l !== l;
    }
    typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(Error());
    var a = xt, e = jt(), s = typeof Object.is == "function" ? Object.is : t, r = e.useSyncExternalStore, u = a.useRef, n = a.useEffect, o = a.useMemo, i = a.useDebugValue;
    Ct.useSyncExternalStoreWithSelector = function(d, l, m, S, v) {
      var h = u(null);
      if (h.current === null) {
        var g = { hasValue: !1, value: null };
        h.current = g;
      } else g = h.current;
      h = o(
        function() {
          function G(W) {
            if (!U) {
              if (U = !0, Y = W, W = S(W), v !== void 0 && g.hasValue) {
                var M = g.value;
                if (v(M, W))
                  return K = M;
              }
              return K = W;
            }
            if (M = K, s(Y, W))
              return M;
            var J = S(W);
            return v !== void 0 && v(M, J) ? (Y = W, M) : (Y = W, K = J);
          }
          var U = !1, Y, K, V = m === void 0 ? null : m;
          return [
            function() {
              return G(l());
            },
            V === null ? void 0 : function() {
              return G(V());
            }
          ];
        },
        [l, m, S, v]
      );
      var B = r(d, h[0], h[1]);
      return n(
        function() {
          g.hasValue = !0, g.value = B;
        },
        [B]
      ), i(B), B;
    }, typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(Error());
  }()), Ct;
}
process.env.NODE_ENV === "production" ? _t.exports = Zt() : _t.exports = Qt();
var te = _t.exports;
const ee = /* @__PURE__ */ Kt(te), Gt = {}, { useDebugValue: ne } = xt, { useSyncExternalStoreWithSelector: se } = ee;
let zt = !1;
const re = (t) => t;
function oe(t, a = re, e) {
  (Gt ? "production" : void 0) !== "production" && e && !zt && (console.warn(
    "[DEPRECATED] Use `createWithEqualityFn` instead of `create` or use `useStoreWithEqualityFn` instead of `useStore`. They can be imported from 'zustand/traditional'. https://github.com/pmndrs/zustand/discussions/1937"
  ), zt = !0);
  const s = se(
    t.subscribe,
    t.getState,
    t.getServerState || t.getInitialState,
    a,
    e
  );
  return ne(s), s;
}
const Bt = (t) => {
  (Gt ? "production" : void 0) !== "production" && typeof t != "function" && console.warn(
    "[DEPRECATED] Passing a vanilla store will be unsupported in a future version. Instead use `import { useStore } from 'zustand'`."
  );
  const a = typeof t == "function" ? Ut(t) : t, e = (s, r) => oe(a, s, r);
  return Object.assign(e, a), e;
}, ie = (t) => t ? Bt(t) : Bt, ae = 20, Wt = 10, ce = [0, 45, 90, 135, 180, 225, 270, 315, 360];
function ut(t) {
  return (t / ae).toFixed(1);
}
function Ot(t, a, e) {
  return a.find((s) => Math.hypot(s.x - t.x, s.y - t.y) <= e) ?? null;
}
function bt(t, a) {
  const e = a.x - t.x, s = a.y - t.y;
  let r = Math.atan2(s, e) * (180 / Math.PI);
  r < 0 && (r += 360);
  let u = r, n = Wt;
  for (const o of ce) {
    let i = Math.abs(r - o);
    i > 180 && (i = 360 - i), i < n && (n = i, u = o);
  }
  if (n < Wt) {
    const o = Math.hypot(e, s), i = u * Math.PI / 180;
    return {
      x: t.x + o * Math.cos(i),
      y: t.y + o * Math.sin(i),
      snapped: !0
    };
  }
  return { x: a.x, y: a.y, snapped: !1 };
}
function mt(t, a) {
  const e = a.x - t.x, s = a.y - t.y;
  return Math.abs(e) > Math.abs(s) ? { x: t.x + e, y: t.y } : { x: t.x, y: t.y + s };
}
function Tt(t, a, e, s) {
  const r = (t.x - a.x) * (e.y - s.y) - (t.y - a.y) * (e.x - s.x);
  if (Math.abs(r) < 1e-4) return null;
  const u = ((t.x - e.x) * (e.y - s.y) - (t.y - e.y) * (e.x - s.x)) / r, n = -((t.x - a.x) * (t.y - e.y) - (t.y - a.y) * (t.x - e.x)) / r;
  return u >= 0 && u <= 1 && n >= 0 && n <= 1 ? {
    x: t.x + u * (a.x - t.x),
    y: t.y + u * (a.y - t.y)
  } : null;
}
function Jt(t, a, e, s) {
  const r = [], u = a.x - t.x, n = a.y - t.y, o = t.x - e.x, i = t.y - e.y, d = u * u + n * n, l = 2 * (o * u + i * n), m = o * o + i * i - s * s;
  let S = l * l - 4 * d * m;
  if (S < 0) return r;
  S = Math.sqrt(S);
  const v = (-l - S) / (2 * d), h = (-l + S) / (2 * d);
  return v >= 0 && v <= 1 && r.push({ x: t.x + v * u, y: t.y + v * n }), h >= 0 && h <= 1 && Math.abs(v - h) > 1e-3 && r.push({ x: t.x + h * u, y: t.y + h * n }), r;
}
function le(t, a, e, s) {
  const r = [], u = e.x - t.x, n = e.y - t.y, o = Math.sqrt(u * u + n * n);
  if (o > a + s || o < Math.abs(a - s) || o === 0) return r;
  const i = (a * a - s * s + o * o) / (2 * o), d = Math.sqrt(a * a - i * i), l = t.x + i * u / o, m = t.y + i * n / o;
  return r.push({ x: l + d * n / o, y: m - d * u / o }), o !== a + s && o !== Math.abs(a - s) && r.push({ x: l - d * n / o, y: m + d * u / o }), r;
}
function ft(t, a) {
  let e = Math.atan2(
    -(t.y - a.center.y),
    t.x - a.center.x
  ) * (180 / Math.PI);
  e < 0 && (e += 360);
  let s = a.startAngle, r = a.endAngle;
  return s < 0 && (s += 360), r < 0 && (r += 360), r < s && (r += 360), e >= s && e <= r;
}
function de(t, a, e, s) {
  const r = Math.hypot(e.x - a.x, e.y - a.y), u = ut(r), n = (a.x + e.x) / 2, o = (a.y + e.y) / 2 - 18, i = s[t.id] ?? { x: n, y: o };
  return { x: i.x, y: i.y, text: `${u} cm` };
}
function ue(t, a, e, s) {
  const r = (a.x + e.x) / 2, u = (a.y + e.y) / 2, n = Math.atan2(-(e.y - a.y), e.x - a.x) * (180 / Math.PI), o = n < 0 ? n + 360 : n, i = s[t.id] ?? { x: r, y: u - 18 };
  return { x: i.x, y: i.y, text: `${o.toFixed(0)}°` };
}
function pe(t, a) {
  const e = ut(t.radius);
  let s, r;
  if (t.type === "circle")
    s = t.center.x + t.radius + 8, r = t.center.y - 8;
  else {
    const n = (t.startAngle + t.endAngle) / 2 * (Math.PI / 180);
    s = t.center.x + (t.radius + 15) * Math.cos(n), r = t.center.y - (t.radius + 15) * Math.sin(n);
  }
  const u = a[t.id] ?? { x: s, y: r };
  return { x: u.x, y: u.y, text: `r = ${e} cm` };
}
function fe(t) {
  if (t.type === "circle") return "";
  const a = t.startAngle * Math.PI / 180, e = t.endAngle * Math.PI / 180, s = t.center.x + t.radius * Math.cos(a), r = t.center.y - t.radius * Math.sin(a), u = t.center.x + t.radius * Math.cos(e), n = t.center.y - t.radius * Math.sin(e);
  let o = t.endAngle - t.startAngle;
  o < 0 && (o += 360);
  const i = o > 180 ? 1 : 0;
  return `M ${s} ${r} A ${t.radius} ${t.radius} 0 ${i} 0 ${u} ${n}`;
}
function he(t, a, e, s) {
  const r = e.x - a.x, u = e.y - a.y, n = r * r + u * u;
  if (n === 0) return Math.hypot(t.x - a.x, t.y - a.y) <= s;
  const o = ((t.x - a.x) * r + (t.y - a.y) * u) / n;
  if (o < 0 || o > 1) return !1;
  const i = a.x + o * r, d = a.y + o * u;
  return Math.hypot(t.x - i, t.y - d) <= s;
}
function ye(t, a, e, s) {
  const r = e.x - a.x, u = e.y - a.y, n = r * r + u * u;
  if (n === 0) return Math.hypot(t.x - a.x, t.y - a.y) <= s;
  const o = ((t.x - a.x) * r + (t.y - a.y) * u) / n;
  if (o < 0) return !1;
  const i = a.x + o * r, d = a.y + o * u;
  return Math.hypot(t.x - i, t.y - d) <= s;
}
function it(t, a) {
  for (const s of t)
    if (Math.abs(s.x - a.x) < 1 && Math.abs(s.y - a.y) < 1) return;
  t.push({ x: a.x, y: a.y });
}
function xe(t, a, e, s) {
  const r = [];
  for (let n = 0; n < t.length; n++)
    for (let o = n + 1; o < t.length; o++) {
      const i = t[n], d = t[o], l = s.find((g) => g.id === i.a), m = s.find((g) => g.id === i.b), S = s.find((g) => g.id === d.a), v = s.find((g) => g.id === d.b);
      if (!l || !m || !S || !v) continue;
      const h = Tt(l, m, S, v);
      h && it(r, h);
    }
  for (let n = 0; n < a.length; n++)
    for (let o = n + 1; o < a.length; o++) {
      const i = a[n], d = a[o], l = s.find((g) => g.id === i.from), m = s.find((g) => g.id === i.to), S = s.find((g) => g.id === d.from), v = s.find((g) => g.id === d.to);
      if (!l || !m || !S || !v) continue;
      const h = Tt(l, m, S, v);
      h && it(r, h);
    }
  for (let n = 0; n < a.length; n++)
    for (let o = 0; o < t.length; o++) {
      const i = a[n], d = t[o], l = s.find((g) => g.id === i.from), m = s.find((g) => g.id === i.to), S = s.find((g) => g.id === d.a), v = s.find((g) => g.id === d.b);
      if (!l || !m || !S || !v) continue;
      const h = Tt(l, m, S, v);
      h && it(r, h);
    }
  for (let n = 0; n < t.length; n++)
    for (let o = 0; o < e.length; o++) {
      const i = t[n], d = e[o], l = s.find((v) => v.id === i.a), m = s.find((v) => v.id === i.b);
      if (!l || !m) continue;
      const S = Jt(l, m, d.center, d.radius);
      for (const v of S)
        d.type === "arc" && !ft(v, d) || it(r, v);
    }
  for (let n = 0; n < a.length; n++)
    for (let o = 0; o < e.length; o++) {
      const i = a[n], d = e[o], l = s.find((v) => v.id === i.from), m = s.find((v) => v.id === i.to);
      if (!l || !m) continue;
      const S = Jt(l, m, d.center, d.radius);
      for (const v of S) {
        if (d.type === "arc" && !ft(v, d)) continue;
        const h = m.x - l.x, g = m.y - l.y;
        ((v.x - l.x) * h + (v.y - l.y) * g) / (h * h + g * g) >= 0 && it(r, v);
      }
    }
  for (let n = 0; n < e.length; n++)
    for (let o = n + 1; o < e.length; o++) {
      const i = le(
        e[n].center,
        e[n].radius,
        e[o].center,
        e[o].radius
      );
      for (const d of i) {
        const l = e[n].type === "circle" || ft(d, e[n]), m = e[o].type === "circle" || ft(d, e[o]);
        l && m && it(r, d);
      }
    }
  for (const n of s) {
    for (const o of t) {
      if (o.a === n.id || o.b === n.id) continue;
      const i = s.find((l) => l.id === o.a), d = s.find((l) => l.id === o.b);
      if (!(!i || !d) && he(n, i, d, 2)) {
        it(r, n);
        break;
      }
    }
    for (const o of a) {
      if (o.from === n.id || o.to === n.id) continue;
      const i = s.find((l) => l.id === o.from), d = s.find((l) => l.id === o.to);
      if (!(!i || !d) && ye(n, i, d, 2)) {
        it(r, n);
        break;
      }
    }
    for (const o of e) {
      if (o.center.id === n.id) continue;
      const i = n.x - o.center.x, d = n.y - o.center.y, l = Math.hypot(i, d);
      Math.abs(l - o.radius) > 2 || o.type === "arc" && !ft(n, o) || it(r, n);
    }
  }
  return r;
}
function Ht(t, a, e, s) {
  const r = a.map((i) => {
    const d = t.find((m) => m.id === i.a), l = t.find((m) => m.id === i.b);
    return !d || !l ? "" : `<line x1="${d.x}" y1="${d.y}" x2="${l.x}" y2="${l.y}" stroke="#60a5fa" stroke-width="2.5"/>`;
  }).join(`
`), u = e.map((i) => {
    const d = t.find((m) => m.id === i.from), l = t.find((m) => m.id === i.to);
    return !d || !l ? "" : `<line x1="${d.x}" y1="${d.y}" x2="${l.x}" y2="${l.y}" stroke="#f59e0b" stroke-width="2.5"/>`;
  }).join(`
`), n = s.map((i) => {
    if (i.type === "circle")
      return `<circle cx="${i.center.x}" cy="${i.center.y}" r="${i.radius}" fill="none" stroke="#f472b6" stroke-width="2" stroke-dasharray="8 4"/>`;
    const d = i.startAngle * Math.PI / 180, l = i.endAngle * Math.PI / 180, m = i.center.x + i.radius * Math.cos(d), S = i.center.y - i.radius * Math.sin(d), v = i.center.x + i.radius * Math.cos(l), h = i.center.y - i.radius * Math.sin(l);
    let g = i.endAngle - i.startAngle;
    g < 0 && (g += 360);
    const B = g > 180 ? 1 : 0;
    return `<path d="M ${m} ${S} A ${i.radius} ${i.radius} 0 ${B} 0 ${v} ${h}" fill="none" stroke="#f472b6" stroke-width="2"/>`;
  }).join(`
`), o = t.map(
    (i) => `<circle cx="${i.x}" cy="${i.y}" r="5" fill="#34d399"/><text x="${i.x + 12}" y="${i.y - 8}" font-size="13" fill="#e2e8f0" font-family="Georgia">${i.label}</text>`
  ).join(`
`);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="600" viewBox="0 0 1000 600">
  <rect width="100%" height="100%" fill="#0d1117"/>
  ${r}
  ${u}
  ${n}
  ${o}
</svg>`;
}
function ge(t) {
  return t.map((a, e) => ({ ...a, num: e + 1 }));
}
const be = 50, p = ie((t, a) => ({
  currentTool: "ruler",
  points: [],
  lines: [],
  rays: [],
  arcs: [],
  texts: [],
  intersections: [],
  steps: [],
  selection: [],
  selectedIds: /* @__PURE__ */ new Set(),
  labelCounter: 0,
  stepCounter: 0,
  labelPositions: {},
  undoHistory: [],
  historyIndex: -1,
  playbackActive: !1,
  playbackStep: -1,
  statusMessage: "Ready to draw",
  statusIsError: !1,
  setTool: (e) => {
    t({
      currentTool: e,
      selection: [],
      selectedIds: /* @__PURE__ */ new Set(),
      statusMessage: `Selected: ${e.charAt(0).toUpperCase() + e.slice(1)}`,
      statusIsError: !1
    });
  },
  addPoint: (e) => t((s) => ({ points: [...s.points, e] })),
  addLine: (e) => t((s) => ({ lines: [...s.lines, e] })),
  addRay: (e) => t((s) => ({ rays: [...s.rays, e] })),
  addArc: (e) => t((s) => ({ arcs: [...s.arcs, e] })),
  addText: (e) => t((s) => ({ texts: [...s.texts, e] })),
  setSelection: (e) => t({ selection: e }),
  clearSelection: () => t({ selection: [] }),
  addToSelectedIds: (e) => t((s) => {
    const r = new Set(s.selectedIds);
    return r.add(e), { selectedIds: r };
  }),
  toggleSelectedId: (e) => t((s) => {
    const r = new Set(s.selectedIds);
    return r.has(e) ? r.delete(e) : r.add(e), { selectedIds: r };
  }),
  clearSelectedIds: () => t({ selectedIds: /* @__PURE__ */ new Set() }),
  setSelectedIds: (e) => t({ selectedIds: e }),
  addStep: (e, s) => {
    const r = a();
    if (e.toLowerCase().startsWith("erased")) return -1;
    const u = r.stepCounter + 1, n = r.steps.length;
    return t({ stepCounter: u, steps: [...r.steps, { num: u, text: e, elementIds: s }] }), n;
  },
  pushSnapshot: () => {
    const e = a(), s = {
      points: JSON.parse(JSON.stringify(e.points)),
      lines: JSON.parse(JSON.stringify(e.lines)),
      rays: JSON.parse(JSON.stringify(e.rays)),
      arcs: JSON.parse(JSON.stringify(e.arcs)),
      texts: JSON.parse(JSON.stringify(e.texts)),
      steps: JSON.parse(JSON.stringify(e.steps)),
      labelPositions: JSON.parse(JSON.stringify(e.labelPositions)),
      labelCounter: e.labelCounter,
      stepCounter: e.stepCounter
    };
    t((r) => {
      const u = r.undoHistory.slice(0, r.historyIndex + 1);
      return u.push(s), u.length > be && u.shift(), { undoHistory: u, historyIndex: u.length - 1 };
    });
  },
  undo: () => {
    const e = a();
    if (e.historyIndex <= 0) return;
    const s = e.historyIndex - 1, r = e.undoHistory[s];
    r && t({
      points: JSON.parse(JSON.stringify(r.points)),
      lines: JSON.parse(JSON.stringify(r.lines)),
      rays: JSON.parse(JSON.stringify(r.rays)),
      arcs: JSON.parse(JSON.stringify(r.arcs)),
      texts: JSON.parse(JSON.stringify(r.texts)),
      steps: JSON.parse(JSON.stringify(r.steps)),
      labelPositions: JSON.parse(JSON.stringify(r.labelPositions)),
      labelCounter: r.labelCounter,
      stepCounter: r.stepCounter,
      selectedIds: /* @__PURE__ */ new Set(),
      historyIndex: s,
      statusMessage: "Undo",
      statusIsError: !1
    });
  },
  redo: () => {
    const e = a();
    if (e.historyIndex >= e.undoHistory.length - 1) return;
    const s = e.historyIndex + 1, r = e.undoHistory[s];
    r && t({
      points: JSON.parse(JSON.stringify(r.points)),
      lines: JSON.parse(JSON.stringify(r.lines)),
      rays: JSON.parse(JSON.stringify(r.rays)),
      arcs: JSON.parse(JSON.stringify(r.arcs)),
      texts: JSON.parse(JSON.stringify(r.texts)),
      steps: JSON.parse(JSON.stringify(r.steps)),
      labelPositions: JSON.parse(JSON.stringify(r.labelPositions)),
      labelCounter: r.labelCounter,
      stepCounter: r.stepCounter,
      selectedIds: /* @__PURE__ */ new Set(),
      historyIndex: s,
      statusMessage: "Redo",
      statusIsError: !1
    });
  },
  deleteSelected: () => {
    const e = a();
    if (e.selectedIds.size === 0) return;
    const s = new Set(e.selectedIds), r = /* @__PURE__ */ new Set();
    e.lines.filter((h) => s.has(h.id)).forEach((h) => {
      r.add(h.a), r.add(h.b);
    }), e.rays.filter((h) => s.has(h.id)).forEach((h) => {
      r.add(h.from), r.add(h.to);
    }), e.arcs.filter((h) => s.has(h.id)).forEach((h) => {
      h.center && h.center.id && r.add(h.center.id);
    });
    const u = /* @__PURE__ */ new Set([...s, ...r]), n = s.size, o = ge(
      e.steps.filter((h) => !h.elementIds || !h.elementIds.some((g) => u.has(g)))
    ), i = e.points.filter((h) => !u.has(h.id)), d = e.lines.filter((h) => !s.has(h.id) && !s.has(h.a) && !s.has(h.b)), l = e.rays.filter((h) => !s.has(h.id) && !s.has(h.from) && !s.has(h.to)), m = e.arcs.filter((h) => !s.has(h.id) && !(h.center && s.has(h.center.id))), S = e.texts.filter((h) => !s.has(h.id)), v = o.some((h) => h.elementIds && h.elementIds.length > 0);
    t({
      points: i,
      lines: d,
      rays: l,
      arcs: m,
      texts: S,
      steps: o,
      stepCounter: o.length,
      ...v ? (() => {
        const h = /* @__PURE__ */ new Map();
        return o.forEach((g, B) => {
          g.elementIds && g.elementIds.forEach((G) => h.set(G, B));
        }), {
          points: i.map((g) => ({ ...g, stepIndex: h.get(g.id) })),
          lines: d.map((g) => ({ ...g, stepIndex: h.get(g.id) })),
          rays: l.map((g) => ({ ...g, stepIndex: h.get(g.id) })),
          arcs: m.map((g) => ({ ...g, stepIndex: h.get(g.id) })),
          texts: S.map((g) => ({ ...g, stepIndex: h.get(g.id) }))
        };
      })() : {},
      selectedIds: /* @__PURE__ */ new Set(),
      statusMessage: `Deleted ${n} element(s)`,
      statusIsError: !1
    }), a().pushSnapshot();
  },
  selectAll: () => {
    const e = a(), s = /* @__PURE__ */ new Set();
    e.points.forEach((r) => s.add(r.id)), e.lines.forEach((r) => s.add(r.id)), e.rays.forEach((r) => s.add(r.id)), e.arcs.forEach((r) => s.add(r.id)), e.texts.forEach((r) => s.add(r.id)), t({ selectedIds: s, statusMessage: `${s.size} elements selected`, statusIsError: !1 });
  },
  findIntersectionsAction: () => {
    const e = a(), s = new Set(e.intersections.map((n) => n.id));
    let r = e.steps;
    s.size > 0 && (r = r.filter(
      (n) => !n.elementIds || !n.elementIds.some((o) => s.has(o))
    ), t({ steps: r }));
    const u = xe(e.lines, e.rays, e.arcs, e.points);
    if (u.length > 0) {
      const n = u.map((i, d) => "int" + Date.now() + "_" + d), o = a().addStep(`Found ${u.length} intersection(s)`, n);
      t({
        intersections: u.map((i, d) => ({ ...i, stepIndex: o, id: n[d] })),
        statusMessage: `Found ${u.length} intersection(s)!`,
        statusIsError: !1
      });
    } else
      t({
        intersections: [],
        statusMessage: "No intersections found.",
        statusIsError: !0
      });
  },
  completeFullCircle: () => {
    const e = a();
    if (e.selection.length !== 2) return;
    const s = e.selection[0], r = e.selection[1];
    if (!r.radius) return;
    const u = "a" + Date.now(), n = a().addStep(
      `Full circle drawn at ${s.label} with radius ${(r.radius / 20).toFixed(1)} cm`,
      [u]
    ), o = {
      id: u,
      center: { ...s },
      radius: r.radius,
      startAngle: 0,
      endAngle: 360,
      type: "circle",
      stepIndex: n
    };
    t((i) => ({
      arcs: [...i.arcs, o],
      selection: []
    })), a().pushSnapshot();
  },
  updatePoint: (e, s, r) => t((u) => ({
    points: u.points.map((n) => n.id === e ? { ...n, x: s, y: r } : n)
  })),
  updateText: (e, s) => t((r) => ({
    texts: r.texts.map((u) => u.id === e ? { ...u, content: s } : u)
  })),
  updateTextPosition: (e, s, r) => t((u) => ({
    texts: u.texts.map((n) => n.id === e ? { ...n, x: s, y: r } : n)
  })),
  setLabelPosition: (e, s) => t((r) => ({
    labelPositions: { ...r.labelPositions, [e]: s }
  })),
  setStatus: (e, s = !1) => t({ statusMessage: e, statusIsError: s }),
  setPlaybackActive: (e) => t({ playbackActive: e }),
  setPlaybackStep: (e) => t({ playbackStep: e }),
  clearAll: () => t({
    points: [],
    lines: [],
    rays: [],
    arcs: [],
    texts: [],
    intersections: [],
    steps: [],
    selection: [],
    selectedIds: /* @__PURE__ */ new Set(),
    labelCounter: 0,
    stepCounter: 0,
    labelPositions: {},
    undoHistory: [],
    historyIndex: -1,
    playbackActive: !1,
    playbackStep: -1,
    statusMessage: "Cleared. Ready to draw!",
    statusIsError: !1
  }),
  loadExample: () => {
    t({
      points: [
        { id: "p1", x: 100, y: 300, label: "A" },
        { id: "p2", x: 300, y: 300, label: "B" },
        { id: "p3", x: 200, y: 127, label: "C" }
      ],
      lines: [{ id: "l1", a: "p1", b: "p2" }],
      rays: [{ id: "r1", from: "p1", to: "p3", angle: 60 }],
      arcs: [],
      texts: [],
      intersections: [],
      steps: [],
      selection: [],
      selectedIds: /* @__PURE__ */ new Set(),
      labelCounter: 3,
      stepCounter: 0,
      labelPositions: {},
      statusMessage: "Example loaded!",
      statusIsError: !1,
      historyIndex: -1,
      undoHistory: []
    });
  },
  exportSVGAction: () => {
    const e = a(), s = Ht(e.points, e.lines, e.rays, e.arcs), r = new Blob([s], { type: "image/svg+xml" }), u = document.createElement("a");
    u.href = URL.createObjectURL(r), u.download = "geometry.svg", u.click(), t({ statusMessage: "Exported!", statusIsError: !1 });
  },
  exportJSON: () => {
    const e = a();
    return JSON.stringify(
      {
        points: e.points,
        lines: e.lines,
        rays: e.rays,
        arcs: e.arcs,
        texts: e.texts,
        steps: e.steps,
        intersections: e.intersections,
        labelPositions: e.labelPositions
      },
      null,
      2
    );
  },
  importJSON: (e) => {
    try {
      const s = JSON.parse(e), r = (s.steps || []).map((u, n) => ({ ...u, num: n + 1 }));
      t({
        points: s.points || [],
        lines: s.lines || [],
        rays: s.rays || [],
        arcs: s.arcs || [],
        texts: s.texts || [],
        steps: r,
        labelPositions: s.labelPositions || {},
        labelCounter: (s.points || []).length,
        stepCounter: r.length,
        intersections: s.intersections || [],
        playbackActive: !1,
        playbackStep: -1,
        statusMessage: "Loaded!",
        statusIsError: !1
      }), a().pushSnapshot();
    } catch {
      t({ statusMessage: "Invalid file", statusIsError: !0 });
    }
  }
}));
function me() {
  const t = p((r) => r.undo), a = p((r) => r.redo), e = p((r) => r.loadExample), s = p((r) => r.clearAll);
  return /* @__PURE__ */ L(
    "div",
    {
      style: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "#16213e",
        padding: "10px 14px",
        borderBottom: "1px solid #0f3460",
        zIndex: 100,
        flexShrink: 0
      },
      children: [
        /* @__PURE__ */ L("div", { style: { display: "flex", alignItems: "center", gap: 10 }, children: [
          /* @__PURE__ */ f(
            "div",
            {
              style: {
                width: 32,
                height: 32,
                borderRadius: 8,
                background: "linear-gradient(135deg,#0ea5a9,#14b8a6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              },
              children: /* @__PURE__ */ L("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "white", strokeWidth: "2", children: [
                /* @__PURE__ */ f("circle", { cx: "12", cy: "12", r: "10" }),
                /* @__PURE__ */ f("path", { d: "M12 2v20M2 12h20" })
              ] })
            }
          ),
          /* @__PURE__ */ f("div", { children: /* @__PURE__ */ f("h1", { style: { fontSize: 16, color: "#e2e8f0", margin: 0 }, children: "Geometry Editor" }) })
        ] }),
        /* @__PURE__ */ L("div", { style: { display: "flex", gap: 6 }, children: [
          /* @__PURE__ */ f(St, { onClick: t, label: "Undo" }),
          /* @__PURE__ */ f(St, { onClick: a, label: "Redo" }),
          /* @__PURE__ */ f(St, { onClick: e, label: "Example" }),
          /* @__PURE__ */ f(St, { onClick: s, label: "Clear", danger: !0 })
        ] })
      ]
    }
  );
}
function St({ onClick: t, label: a, danger: e }) {
  return /* @__PURE__ */ f(
    "button",
    {
      onClick: t,
      style: {
        padding: "6px 12px",
        borderRadius: 6,
        border: "none",
        fontSize: 12,
        fontWeight: 500,
        cursor: "pointer",
        background: e ? "#3b1a1a" : "#1e3a5f",
        color: e ? "#f87171" : "#94a3b8"
      },
      children: a
    }
  );
}
const Se = [
  {
    id: "ruler",
    label: "Ruler",
    desc: "Draw straight lines",
    shortcut: "1",
    svg: /* @__PURE__ */ L("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "#94a3b8", strokeWidth: "2", children: [
      /* @__PURE__ */ f("path", { d: "M2 12h20M2 12l4-4M2 12l4 4M22 12l-4-4M22 12l-4 4" }),
      /* @__PURE__ */ f("path", { d: "M6 8v8M10 8v8M14 8v8M18 8v8", strokeWidth: "1.5" })
    ] })
  },
  {
    id: "protractor",
    label: "Protractor",
    desc: "Draw angles & rays",
    shortcut: "2",
    svg: /* @__PURE__ */ L("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "#94a3b8", strokeWidth: "2", children: [
      /* @__PURE__ */ f("path", { d: "M12 22C6.5 22 2 17.5 2 12h20c0 5.5-4.5 10-10 10z" }),
      /* @__PURE__ */ f("path", { d: "M12 12l7-7" }),
      /* @__PURE__ */ f("path", { d: "M12 12V2" }),
      /* @__PURE__ */ f("circle", { cx: "12", cy: "12", r: "2", fill: "#94a3b8" })
    ] })
  },
  {
    id: "compass",
    label: "Compass",
    desc: "Draw arcs & circles",
    shortcut: "3",
    svg: /* @__PURE__ */ L("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "#94a3b8", strokeWidth: "2", children: [
      /* @__PURE__ */ f("path", { d: "M12 2L8 22M12 2l4 20" }),
      /* @__PURE__ */ f("circle", { cx: "12", cy: "2", r: "2" })
    ] })
  },
  {
    id: "point",
    label: "Point",
    desc: "Mark a point",
    shortcut: "4",
    svg: /* @__PURE__ */ f("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "#94a3b8", strokeWidth: "2", children: /* @__PURE__ */ f("circle", { cx: "12", cy: "12", r: "4" }) })
  },
  {
    id: "text",
    label: "Text",
    desc: "Add text labels",
    shortcut: "5",
    svg: /* @__PURE__ */ f("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "#94a3b8", strokeWidth: "2", children: /* @__PURE__ */ f("path", { d: "M4 7V4h16v3M9 20h6M12 4v16" }) })
  },
  "divider",
  "section",
  {
    id: "intersect",
    label: "Intersection",
    desc: "Find crossing points",
    shortcut: "6",
    svg: /* @__PURE__ */ f("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "#94a3b8", strokeWidth: "2", children: /* @__PURE__ */ f("path", { d: "M4 4l16 16M20 4L4 20" }) })
  },
  "divider",
  "section",
  {
    id: "hand",
    label: "Hand",
    desc: "Pan the canvas",
    shortcut: "7",
    svg: /* @__PURE__ */ f("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "#94a3b8", strokeWidth: "2", children: /* @__PURE__ */ f("path", { d: "M18 11V6a2 2 0 00-4 0v1M14 10V4a2 2 0 00-4 0v6M10 10V6a2 2 0 00-4 0v8c0 4.418 3.582 8 8 8h.5a7.5 7.5 0 005.5-12.5L16 4" }) })
  },
  {
    id: "move",
    label: "Move",
    desc: "Drag points & labels",
    shortcut: "8",
    svg: /* @__PURE__ */ f("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "#94a3b8", strokeWidth: "2", children: /* @__PURE__ */ f("path", { d: "M5 9l-3 3 3 3M9 5l3-3 3 3M15 19l-3 3-3-3M19 9l3 3-3 3M2 12h20M12 2v20" }) })
  },
  {
    id: "eraser",
    label: "Eraser",
    desc: "Remove elements",
    shortcut: "9",
    svg: /* @__PURE__ */ f("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "#94a3b8", strokeWidth: "2", children: /* @__PURE__ */ f("path", { d: "M18 2l4 4-14 14H4v-4L18 2z" }) })
  }
], ve = {
  ruler: '<svg width="70" height="50" viewBox="0 0 70 50"><rect x="5" y="20" width="60" height="10" rx="2" fill="#94a3b8" opacity="0.6"/><line x1="15" y1="20" x2="15" y2="30" stroke="#1e293b" stroke-width="1"/><line x1="25" y1="20" x2="25" y2="30" stroke="#1e293b" stroke-width="1"/><line x1="35" y1="20" x2="35" y2="30" stroke="#1e293b" stroke-width="1"/><line x1="45" y1="20" x2="45" y2="30" stroke="#1e293b" stroke-width="1"/><line x1="55" y1="20" x2="55" y2="30" stroke="#1e293b" stroke-width="1"/></svg>',
  protractor: '<svg width="70" height="50" viewBox="0 0 70 50"><path d="M35 45 C10 45 5 25 5 25 L65 25 C65 25 60 45 35 45Z" fill="none" stroke="#94a3b8" stroke-width="2"/><line x1="35" y1="45" x2="35" y2="10" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="3 2"/><path d="M35 35 L50 20" stroke="#94a3b8" stroke-width="1.5"/><circle cx="35" cy="45" r="3" fill="#94a3b8"/></svg>',
  compass: '<svg width="70" height="50" viewBox="0 0 70 50"><path d="M35 5 L20 45" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/><path d="M35 5 L50 45" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/><circle cx="35" cy="5" r="3" fill="#94a3b8"/><circle cx="50" cy="45" r="2" fill="#64748b"/></svg>',
  point: '<svg width="70" height="50" viewBox="0 0 70 50"><circle cx="35" cy="25" r="10" fill="#94a3b8" opacity="0.3"/><circle cx="35" cy="25" r="5" fill="#94a3b8"/></svg>',
  text: '<svg width="70" height="50" viewBox="0 0 70 50"><text x="35" y="32" font-size="24" font-family="serif" font-weight="bold" fill="#94a3b8" text-anchor="middle">T</text></svg>',
  intersect: '<svg width="70" height="50" viewBox="0 0 70 50"><line x1="10" y1="10" x2="60" y2="40" stroke="#94a3b8" stroke-width="2"/><line x1="60" y1="10" x2="10" y2="40" stroke="#94a3b8" stroke-width="2"/><circle cx="35" cy="25" r="5" fill="#1e293b" stroke="#94a3b8" stroke-width="2"/></svg>',
  move: '<svg width="70" height="50" viewBox="0 0 70 50"><path d="M35 5 L35 45" stroke="#94a3b8" stroke-width="2.5" stroke-linecap="round"/><path d="M5 25 L65 25" stroke="#94a3b8" stroke-width="2.5" stroke-linecap="round"/><circle cx="35" cy="25" r="4" fill="#94a3b8" opacity="0.3"/></svg>',
  hand: '<svg width="70" height="50" viewBox="0 0 70 50"><path d="M35 10 L35 35" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/><path d="M25 15 L25 30" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/><path d="M45 15 L45 30" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/><path d="M20 25 Q20 40 35 42 Q50 40 50 25" fill="none" stroke="#94a3b8" stroke-width="2.5"/></svg>',
  eraser: '<svg width="70" height="50" viewBox="0 0 70 50"><path d="M15 40 L30 15 L55 30 L40 50 Z" fill="#94a3b8" opacity="0.3" stroke="#94a3b8" stroke-width="2"/></svg>'
};
function ke() {
  const t = p((n) => n.currentTool), a = p((n) => n.setTool), e = p((n) => n.undo), s = p((n) => n.redo), r = p((n) => n.historyIndex), u = p((n) => n.undoHistory);
  return /* @__PURE__ */ L(
    "div",
    {
      style: {
        width: 210,
        background: "#16213e",
        borderRight: "1px solid #0f3460",
        padding: 12,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        overflowY: "auto",
        flexShrink: 0,
        zIndex: 50
      },
      children: [
        Se.map((n, o) => {
          if (n === "divider")
            return /* @__PURE__ */ f("div", { style: { height: 1, background: "#1e3a5f", margin: "4px 0" } }, "d" + o);
          if (n === "section")
            return /* @__PURE__ */ f(
              "div",
              {
                style: {
                  fontSize: 10,
                  fontWeight: 700,
                  color: "#64748b",
                  textTransform: "uppercase",
                  letterSpacing: 1,
                  marginBottom: 6,
                  marginTop: 4
                },
                children: o < 10 ? "Drawing Tools" : o < 16 ? "Analysis" : "Navigation"
              },
              "s" + o
            );
          const i = n, d = t === i.id;
          return /* @__PURE__ */ L(
            "button",
            {
              onClick: () => a(i.id),
              style: {
                display: "grid",
                gridTemplateColumns: "32px 1fr auto",
                alignItems: "center",
                gap: 6,
                padding: "7px 8px",
                borderRadius: 8,
                border: `1px solid ${d ? "#0ea5a9" : "#1e3a5f"}`,
                background: d ? "#0d3030" : "#1a2744",
                cursor: "pointer",
                transition: "all 0.15s",
                textAlign: "left"
              },
              children: [
                /* @__PURE__ */ f(
                  "div",
                  {
                    style: {
                      width: 32,
                      height: 32,
                      borderRadius: 6,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "#1e293b"
                    },
                    children: i.svg
                  }
                ),
                /* @__PURE__ */ L("div", { children: [
                  /* @__PURE__ */ f("div", { style: { fontSize: 12, fontWeight: 500, color: "#e2e8f0" }, children: i.label }),
                  /* @__PURE__ */ f("div", { style: { fontSize: 10, color: "#64748b", marginTop: 1 }, children: i.desc })
                ] }),
                /* @__PURE__ */ f(
                  "span",
                  {
                    style: {
                      fontSize: 9,
                      color: d ? "#0ea5a9" : "#475569",
                      background: "#0d1117",
                      padding: "1px 5px",
                      borderRadius: 3,
                      fontFamily: "monospace",
                      justifySelf: "end"
                    },
                    children: i.shortcut
                  }
                )
              ]
            },
            i.id
          );
        }),
        /* @__PURE__ */ f("div", { style: { height: 1, background: "#1e3a5f", margin: "4px 0" } }),
        /* @__PURE__ */ L("div", { style: { display: "flex", gap: 6, marginTop: 4 }, children: [
          /* @__PURE__ */ L(
            "button",
            {
              onClick: e,
              disabled: r <= 0,
              style: {
                flex: 1,
                padding: "8px",
                borderRadius: 8,
                border: "1px solid #1e3a5f",
                background: r <= 0 ? "#1a2744" : "#0d3030",
                color: r <= 0 ? "#475569" : "#e2e8f0",
                cursor: r <= 0 ? "not-allowed" : "pointer",
                fontSize: 11,
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 5
              },
              children: [
                /* @__PURE__ */ L("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", children: [
                  /* @__PURE__ */ f("path", { d: "M3 10h13a4 4 0 010 8H7" }),
                  /* @__PURE__ */ f("path", { d: "M7 6l-4 4 4 4" })
                ] }),
                "Undo"
              ]
            }
          ),
          /* @__PURE__ */ L(
            "button",
            {
              onClick: s,
              disabled: r >= u.length - 1,
              style: {
                flex: 1,
                padding: "8px",
                borderRadius: 8,
                border: "1px solid #1e3a5f",
                background: r >= u.length - 1 ? "#1a2744" : "#0d3030",
                color: r >= u.length - 1 ? "#475569" : "#e2e8f0",
                cursor: r >= u.length - 1 ? "not-allowed" : "pointer",
                fontSize: 11,
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 5
              },
              children: [
                /* @__PURE__ */ L("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", children: [
                  /* @__PURE__ */ f("path", { d: "M21 10H8a4 4 0 000 8h9" }),
                  /* @__PURE__ */ f("path", { d: "M17 6l4 4-4 4" })
                ] }),
                "Redo"
              ]
            }
          )
        ] })
      ]
    }
  );
}
function we() {
  const t = p((a) => a.currentTool);
  return /* @__PURE__ */ f(
    "div",
    {
      style: {
        padding: 10,
        background: "#0d1117",
        borderRadius: 7,
        textAlign: "center",
        minHeight: 70,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      },
      dangerouslySetInnerHTML: { __html: ve[t] || "" }
    }
  );
}
function Ie() {
  var n, o, i, d;
  const t = p((l) => l.currentTool), a = p((l) => l.selection), s = {
    ruler: { idle: { step: 1, text: "Click to place the starting point" }, one: { step: 2, text: "Click to place the end point (Shift for straight)" } },
    protractor: { idle: { step: 1, text: "Click to place the protractor center" }, one: { step: 2, text: "Move mouse to set angle, click Draw Ray" } },
    compass: { idle: { step: 1, text: "Click to place compass center" }, one: { step: 2, text: "Click to set radius" }, two: { step: 3, text: "Click to mark arc START or Full Circle" }, three: { step: 4, text: "Click to mark arc END" } },
    point: { step: 1, text: "Click to place a point" },
    text: { step: 1, text: "Click to place text · Double-click to edit" },
    hand: { step: 1, text: "Click and drag to pan (or hold Space)" },
    intersect: { step: 1, text: "Click to find intersections" },
    move: { step: 1, text: "Drag points/labels · Ctrl+A select all · Arrows to nudge" },
    eraser: { step: 1, text: "Click to erase" }
  }[t];
  let r = 1, u = "";
  if ("idle" in s) {
    const l = a.length;
    t === "compass" && l === 2 ? (r = ((n = s.two) == null ? void 0 : n.step) ?? 3, u = ((o = s.two) == null ? void 0 : o.text) ?? "") : t === "compass" && l === 3 ? (r = ((i = s.three) == null ? void 0 : i.step) ?? 4, u = ((d = s.three) == null ? void 0 : d.text) ?? "") : l === 0 ? (r = s.idle.step, u = s.idle.text) : (r = s.one.step, u = s.one.text);
  } else
    r = s.step, u = s.text;
  return /* @__PURE__ */ L(
    "div",
    {
      style: {
        position: "absolute",
        bottom: 16,
        left: "50%",
        transform: "translateX(-50%)",
        background: "rgba(14, 165, 169, 0.95)",
        color: "white",
        padding: "10px 20px",
        borderRadius: 10,
        fontSize: 13,
        display: "flex",
        alignItems: "center",
        gap: 10,
        backdropFilter: "blur(8px)",
        boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
        zIndex: 50
      },
      children: [
        /* @__PURE__ */ f(
          "div",
          {
            style: {
              width: 24,
              height: 24,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              fontSize: 12
            },
            children: r
          }
        ),
        /* @__PURE__ */ f("span", { children: u })
      ]
    }
  );
}
function Me({ position: t, editId: a, onSubmit: e, onCancel: s }) {
  const [r, u] = dt(""), n = tt(null);
  if (pt(() => {
    t && (u(""), setTimeout(() => {
      var i;
      return (i = n.current) == null ? void 0 : i.focus();
    }, 50));
  }, [t]), !t) return null;
  const o = (i) => {
    i.key === "Enter" && (i.preventDefault(), e(r)), i.key === "Escape" && s();
  };
  return /* @__PURE__ */ L(
    "div",
    {
      style: {
        position: "absolute",
        left: t.x - 110,
        top: t.y - 50,
        background: "#16213e",
        border: "2px solid #38bdf8",
        borderRadius: 10,
        padding: 14,
        zIndex: 200,
        boxShadow: "0 8px 32px rgba(0,0,0,0.5)"
      },
      children: [
        /* @__PURE__ */ f("div", { style: { fontSize: 12, color: "#64748b", marginBottom: 6 }, children: a ? "Edit text" : "Enter text" }),
        /* @__PURE__ */ f(
          "input",
          {
            ref: n,
            type: "text",
            value: r,
            onChange: (i) => u(i.target.value),
            onKeyDown: o,
            placeholder: "Type here...",
            style: {
              width: 200,
              padding: "8px 12px",
              borderRadius: 6,
              border: "1px solid #1e3a5f",
              background: "#0d1117",
              color: "#e2e8f0",
              fontSize: 14,
              outline: "none"
            }
          }
        ),
        /* @__PURE__ */ L("div", { style: { display: "flex", gap: 6, marginTop: 10 }, children: [
          /* @__PURE__ */ f(
            "button",
            {
              onClick: () => e(r),
              style: {
                flex: 1,
                padding: "7px",
                borderRadius: 6,
                border: "none",
                background: "#0ea5a9",
                color: "white",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer"
              },
              children: "Add"
            }
          ),
          /* @__PURE__ */ f(
            "button",
            {
              onClick: s,
              style: {
                flex: 1,
                padding: "7px",
                borderRadius: 6,
                border: "1px solid #1e3a5f",
                background: "transparent",
                color: "#94a3b8",
                fontSize: 12,
                cursor: "pointer"
              },
              children: "Cancel"
            }
          )
        ] })
      ]
    }
  );
}
const nt = "http://www.w3.org/2000/svg";
function ht(t) {
  return t.map((a, e) => ({ ...a, num: e + 1 }));
}
function yt(t, a, e, s, r, u) {
  if (!u.some((i) => i.elementIds && i.elementIds.length > 0))
    return { points: t, lines: a, rays: e, arcs: s, texts: r };
  const o = /* @__PURE__ */ new Map();
  return u.forEach((i, d) => {
    i.elementIds && i.elementIds.forEach((l) => o.set(l, d));
  }), {
    points: t.map((i) => ({ ...i, stepIndex: o.get(i.id) })),
    lines: a.map((i) => ({ ...i, stepIndex: o.get(i.id) })),
    rays: e.map((i) => ({ ...i, stepIndex: o.get(i.id) })),
    arcs: s.map((i) => ({ ...i, stepIndex: o.get(i.id) })),
    texts: r.map((i) => ({ ...i, stepIndex: o.get(i.id) }))
  };
}
function Ae({ showInstructionBar: t = !0 }) {
  const a = tt(null), e = tt(null), [s, r] = dt(0), [u, n] = dt(0), [o, i] = dt(1), d = tt({ panX: 0, panY: 0, zoom: 1 }), l = tt({ x: 0, y: 0 }), m = tt(!1), [S, v] = dt(null), [h, g] = dt(null), B = tt(null), G = tt(null), U = tt(null), Y = tt(null), K = tt(!1), V = tt(null), W = tt({}), M = tt(!1);
  p();
  const J = () => {
    const x = e.current;
    x && x.setAttribute("transform", `translate(${d.current.panX}, ${d.current.panY}) scale(${d.current.zoom})`);
  }, Q = () => {
    const x = p.getState(), _ = "ABCDEFGHIJKLMNOPQRSTUVWXYZ", P = x.labelCounter;
    return p.setState({ labelCounter: P + 1 }), _[P % 26] + (P >= 26 ? Math.floor(P / 26) : "");
  }, Z = (x, _) => {
    var j;
    const P = (j = a.current) == null ? void 0 : j.getBoundingClientRect();
    return P ? {
      x: (x - P.left - d.current.panX) / d.current.zoom,
      y: (_ - P.top - d.current.panY) / d.current.zoom
    } : { x: 0, y: 0 };
  }, st = (x, _) => {
    const P = document.getElementById("previewGroup");
    if (!P) return;
    P.innerHTML = "";
    const j = Math.hypot(_.x - x.x, _.y - x.y), z = ut(j), F = (x.x + _.x) / 2, A = (x.y + _.y) / 2, c = document.createElementNS(nt, "line");
    c.setAttribute("x1", String(x.x)), c.setAttribute("y1", String(x.y)), c.setAttribute("x2", String(_.x)), c.setAttribute("y2", String(_.y)), c.setAttribute("stroke", "#60a5fa"), c.setAttribute("stroke-width", "2"), c.setAttribute("stroke-dasharray", "6 4"), c.setAttribute("opacity", "0.6"), P.appendChild(c);
    const b = document.createElementNS(nt, "text");
    b.setAttribute("x", String(F)), b.setAttribute("y", String(A - 8)), b.setAttribute("font-size", "12"), b.setAttribute("font-family", "system-ui, sans-serif"), b.setAttribute("font-weight", "600"), b.setAttribute("fill", "#60a5fa"), b.setAttribute("text-anchor", "middle"), b.setAttribute("pointer-events", "none"), b.textContent = `${z} cm`, P.appendChild(b);
  }, at = (x, _) => {
    const P = document.getElementById("previewGroup");
    if (!P) return;
    P.innerHTML = "";
    const j = Math.atan2(-(_.y - x.y), _.x - x.x) * (180 / Math.PI), z = j < 0 ? j + 360 : j, F = z * Math.PI / 180, A = x.x + 200 * Math.cos(F), c = x.y - 200 * Math.sin(F), b = document.createElementNS(nt, "line");
    b.setAttribute("x1", String(x.x)), b.setAttribute("y1", String(x.y)), b.setAttribute("x2", String(A)), b.setAttribute("y2", String(c)), b.setAttribute("stroke", "#f59e0b"), b.setAttribute("stroke-width", "2"), b.setAttribute("stroke-dasharray", "6 4"), b.setAttribute("opacity", "0.5"), P.appendChild(b);
    const D = document.createElementNS(nt, "text");
    D.setAttribute("x", String(x.x + 55 * Math.cos(F / 2))), D.setAttribute("y", String(x.y - 55 * Math.sin(F / 2))), D.setAttribute("font-size", "12"), D.setAttribute("font-weight", "600"), D.setAttribute("fill", "#f59e0b"), D.setAttribute("text-anchor", "middle"), D.setAttribute("pointer-events", "none"), D.textContent = `${z.toFixed(0)}°`, P.appendChild(D);
  }, rt = (x, _) => {
    const P = document.getElementById("previewGroup");
    if (!P) return;
    P.innerHTML = "";
    const j = Math.hypot(_.x - x.x, _.y - x.y), z = document.createElementNS(nt, "circle");
    z.setAttribute("cx", String(x.x)), z.setAttribute("cy", String(x.y)), z.setAttribute("r", String(j)), z.setAttribute("fill", "none"), z.setAttribute("stroke", "#f472b6"), z.setAttribute("stroke-width", "2"), z.setAttribute("stroke-dasharray", "6 4"), z.setAttribute("opacity", "0.6"), P.appendChild(z);
    const F = ut(j), A = document.createElementNS(nt, "text");
    A.setAttribute("x", String(x.x + j + 8)), A.setAttribute("y", String(x.y - 8)), A.setAttribute("font-size", "12"), A.setAttribute("font-weight", "600"), A.setAttribute("fill", "#f472b6"), A.setAttribute("pointer-events", "none"), A.textContent = `r = ${F} cm`, P.appendChild(A);
  }, kt = (x, _, P) => {
    const j = document.getElementById("previewGroup");
    if (!j) return;
    j.innerHTML = "";
    const z = document.createElementNS(nt, "circle");
    z.setAttribute("cx", String(x.x)), z.setAttribute("cy", String(x.y)), z.setAttribute("r", String(_)), z.setAttribute("fill", "none"), z.setAttribute("stroke", "#f472b6"), z.setAttribute("stroke-width", "1.5"), z.setAttribute("stroke-dasharray", "4 4"), z.setAttribute("opacity", "0.4"), j.appendChild(z);
    const F = Math.atan2(-(P.y - x.y), P.x - x.x) * (180 / Math.PI), c = (F < 0 ? F + 360 : F) * Math.PI / 180, b = x.x + _ * Math.cos(c), D = x.y - _ * Math.sin(c), y = document.createElementNS(nt, "circle");
    y.setAttribute("cx", String(b)), y.setAttribute("cy", String(D)), y.setAttribute("r", "6"), y.setAttribute("fill", "#f472b6"), y.setAttribute("opacity", "0.8"), j.appendChild(y);
  }, wt = (x, _, P, j) => {
    const z = document.getElementById("previewGroup");
    if (!z) return;
    z.innerHTML = "";
    const F = Math.atan2(-(j.y - x.y), j.x - x.x) * (180 / Math.PI), A = F < 0 ? F + 360 : F, c = P * Math.PI / 180, b = A * Math.PI / 180, D = x.x + _ * Math.cos(c), y = x.y - _ * Math.sin(c), k = x.x + _ * Math.cos(b), E = x.y - _ * Math.sin(b);
    let N = A - P;
    N < 0 && (N += 360);
    const C = N > 180 ? 1 : 0, O = document.createElementNS(nt, "path");
    O.setAttribute("d", `M ${D} ${y} A ${_} ${_} 0 ${C} 0 ${k} ${E}`), O.setAttribute("fill", "none"), O.setAttribute("stroke", "#f472b6"), O.setAttribute("stroke-width", "3"), O.setAttribute("stroke-linecap", "round"), O.setAttribute("opacity", "0.7"), z.appendChild(O);
    const w = document.createElementNS(nt, "circle");
    w.setAttribute("cx", String(k)), w.setAttribute("cy", String(E)), w.setAttribute("r", "6"), w.setAttribute("fill", "#f472b6"), w.setAttribute("opacity", "0.8"), z.appendChild(w);
  };
  pt(() => {
    const x = a.current;
    if (!x) return;
    const _ = (A) => {
      A.preventDefault();
      const c = x.getBoundingClientRect(), b = A.clientX - c.left, D = A.clientY - c.top;
      if (Math.abs(A.deltaY) < 8) return;
      const y = A.deltaY > 0 ? -0.05 : 0.05, { panX: k, panY: E, zoom: N } = d.current, C = Math.max(0.1, Math.min(5, N + y)), O = b - (b - k) * (C / N), w = D - (D - E) * (C / N);
      d.current = { panX: O, panY: w, zoom: C }, r(O), n(w), i(C), J();
    }, P = (A) => {
      var b, D;
      const c = p.getState();
      if (A.button === 1 || A.button === 0 && A.altKey || c.currentTool === "hand") {
        A.preventDefault(), m.current = !0, l.current = { x: A.clientX - d.current.panX, y: A.clientY - d.current.panY }, x.style.cursor = "grabbing";
        return;
      }
      if (c.currentTool === "move" && !c.playbackActive) {
        const y = (D = (b = A.target).closest) == null ? void 0 : D.call(b, ".measure-label");
        if (y) {
          A.preventDefault(), A.stopPropagation(), B.current = y.getAttribute("data-id"), x.style.cursor = "grabbing";
          return;
        }
        const k = Z(A.clientX, A.clientY), E = Ot(k, c.points, 12 / d.current.zoom);
        if (c.selectedIds.size > 0 && E && c.selectedIds.has(E.id)) {
          A.preventDefault(), A.stopPropagation(), K.current = !0, V.current = { x: k.x, y: k.y }, W.current = {}, c.points.filter((C) => c.selectedIds.has(C.id)).forEach((C) => {
            W.current[C.id] = { x: C.x, y: C.y };
          }), c.texts.filter((C) => c.selectedIds.has(C.id)).forEach((C) => {
            W.current[C.id] = { x: C.x, y: C.y };
          }), x.style.cursor = "grabbing";
          return;
        }
        if (E) {
          A.preventDefault(), A.stopPropagation(), G.current = E, U.current = { x: E.x, y: E.y }, x.style.cursor = "grabbing";
          return;
        }
        const N = c.texts.find(
          (C) => Math.abs(k.x - C.x) < 30 && Math.abs(k.y - C.y) < 15
        );
        N && (A.preventDefault(), A.stopPropagation(), Y.current = { id: N.id, origX: N.x, origY: N.y, startWorldX: k.x, startWorldY: k.y }, x.style.cursor = "grabbing");
      }
    }, j = (A) => {
      if (m.current) {
        d.current.panX = A.clientX - l.current.x, d.current.panY = A.clientY - l.current.y, r(d.current.panX), n(d.current.panY), J();
        return;
      }
      if (B.current) {
        const y = Z(A.clientX, A.clientY);
        p.getState().setLabelPosition(B.current, { x: y.x, y: y.y });
        return;
      }
      if (G.current) {
        const y = Z(A.clientX, A.clientY), k = G.current;
        (Math.abs(y.x - U.current.x) > 2 || Math.abs(y.y - U.current.y) > 2) && (M.current = !0), p.getState().updatePoint(k.id, y.x, y.y);
        return;
      }
      if (Y.current) {
        const y = Z(A.clientX, A.clientY);
        M.current = !0;
        const k = Y.current;
        p.getState().updateTextPosition(k.id, k.origX + (y.x - k.startWorldX), k.origY + (y.y - k.startWorldY));
        return;
      }
      if (K.current && V.current) {
        const y = Z(A.clientX, A.clientY), k = y.x - V.current.x, E = y.y - V.current.y;
        (Math.abs(k) > 2 || Math.abs(E) > 2) && (M.current = !0);
        const N = p.getState(), C = W.current;
        N.points.filter((w) => N.selectedIds.has(w.id) && C[w.id]).forEach((w) => {
          p.getState().updatePoint(w.id, C[w.id].x + k, C[w.id].y + E);
        }), N.texts.filter((w) => N.selectedIds.has(w.id) && C[w.id]).forEach((w) => {
          p.getState().updateTextPosition(w.id, C[w.id].x + k, C[w.id].y + E);
        });
        const O = document.getElementById("previewGroup");
        if (O) {
          O.innerHTML = "";
          const w = N.points.filter((R) => N.selectedIds.has(R.id) && C[R.id]);
          if (w.length > 0) {
            let R = 1 / 0, $ = 1 / 0, I = -1 / 0, H = -1 / 0;
            w.forEach((X) => {
              R = Math.min(R, X.x + k), $ = Math.min($, X.y + E), I = Math.max(I, X.x + k), H = Math.max(H, X.y + E);
            }), N.texts.filter((X) => N.selectedIds.has(X.id) && C[X.id]).forEach((X) => {
              R = Math.min(R, C[X.id].x + k), $ = Math.min($, C[X.id].y + E - 14), I = Math.max(I, C[X.id].x + k + 100), H = Math.max(H, C[X.id].y + E + 4);
            });
            const q = document.createElementNS(nt, "rect");
            q.setAttribute("x", String(R - 20)), q.setAttribute("y", String($ - 20)), q.setAttribute("width", String(I - R + 40)), q.setAttribute("height", String(H - $ + 40)), q.setAttribute("fill", "none"), q.setAttribute("stroke", "#0ea5a9"), q.setAttribute("stroke-width", "2"), q.setAttribute("stroke-dasharray", "6 4"), q.setAttribute("rx", "6"), q.setAttribute("opacity", "0.5"), O.appendChild(q);
          }
        }
        return;
      }
      const c = document.getElementById("previewGroup");
      c && (c.innerHTML = "");
      const b = p.getState(), D = Z(A.clientX, A.clientY);
      if (Math.round(D.x / 20) * 20, Math.round(D.y / 20) * 20, b.currentTool === "ruler" && b.selection.length === 1) {
        const y = b.selection[0];
        let k = { x: D.x, y: D.y };
        if (A.shiftKey)
          k = mt(y, k);
        else {
          const E = bt(y, k);
          E.snapped && (k = { x: E.x, y: E.y });
        }
        st(y, k);
      } else if (b.currentTool === "protractor" && b.selection.length === 1)
        at(b.selection[0], D);
      else if (b.currentTool === "compass") {
        if (b.selection.length === 1) {
          const y = b.selection[0];
          let k = { x: D.x, y: D.y };
          if (A.shiftKey)
            k = mt(y, k);
          else {
            const E = bt(y, k);
            E.snapped && (k = { x: E.x, y: E.y });
          }
          rt(y, k);
        } else if (b.selection.length === 2) {
          const y = b.selection[0], k = b.selection[1].radius;
          kt(y, k, D);
        } else if (b.selection.length === 3) {
          const y = b.selection[0], k = b.selection[1].radius, E = b.selection[2].startAngle;
          wt(y, k, E, D);
        }
      }
    }, z = () => {
      if (m.current) {
        m.current = !1;
        const A = p.getState();
        x.style.cursor = A.currentTool === "move" ? "move" : A.currentTool === "hand" ? "grab" : "crosshair";
        return;
      }
      if (B.current) {
        B.current = null, p.getState().pushSnapshot(), x.style.cursor = "move";
        return;
      }
      if (Y.current) {
        M.current && p.getState().pushSnapshot(), Y.current = null, x.style.cursor = "move", setTimeout(() => {
          M.current = !1;
        }, 50);
        return;
      }
      if (G.current) {
        M.current && p.getState().pushSnapshot(), G.current = null, U.current = null, x.style.cursor = "move", setTimeout(() => {
          M.current = !1;
        }, 50);
        return;
      }
      if (K.current) {
        M.current && p.getState().pushSnapshot(), K.current = !1, V.current = null, W.current = {};
        const A = document.getElementById("previewGroup");
        A && (A.innerHTML = ""), x.style.cursor = "move", setTimeout(() => {
          M.current = !1;
        }, 50);
      }
    }, F = (A) => {
      const c = p.getState();
      if (m.current || c.currentTool === "hand" || M.current) return;
      const b = Z(A.clientX, A.clientY), D = Ot(b, c.points, 12 / d.current.zoom);
      switch (c.currentTool) {
        case "ruler": {
          if (c.selection.length === 0) {
            const y = D ?? {
              id: "p" + Date.now(),
              x: b.x,
              y: b.y,
              label: Q(),
              stepIndex: c.steps.length
            };
            if (!D) {
              const k = { num: c.stepCounter + 1, text: `Placed point ${y.label}`, elementIds: [y.id] };
              p.setState({
                points: [...c.points, y],
                steps: [...c.steps, k],
                stepCounter: c.stepCounter + 1
              });
            }
            p.setState({ selection: [y] });
          } else {
            let y;
            if (D)
              y = D;
            else {
              let R = { x: b.x, y: b.y };
              if (A.shiftKey) R = mt(c.selection[0], R);
              else {
                const $ = bt(c.selection[0], R);
                $.snapped && (R = { x: $.x, y: $.y });
              }
              y = { id: "p" + Date.now(), x: R.x, y: R.y, label: Q(), stepIndex: c.steps.length };
            }
            const k = Math.hypot(y.x - c.selection[0].x, y.y - c.selection[0].y), E = ut(k), N = "l" + Date.now(), C = c.stepCounter + 1, O = { num: C, text: `Line drawn from ${c.selection[0].label} to ${y.label} = ${E} cm`, elementIds: [N] }, w = D ? c.points : [...c.points, y];
            p.setState({
              points: w,
              lines: [...c.lines, { id: N, a: c.selection[0].id, b: y.id, stepIndex: c.steps.length }],
              steps: [...c.steps, O],
              stepCounter: C,
              selection: [],
              statusMessage: "Line drawn! Click to start another.",
              statusIsError: !1
            }), p.getState().pushSnapshot();
          }
          break;
        }
        case "protractor": {
          if (c.selection.length === 0) {
            const y = D ?? { id: "p" + Date.now(), x: b.x, y: b.y, label: Q() };
            if (!D) {
              const k = c.steps.length;
              y.stepIndex = k;
              const E = { num: c.stepCounter + 1, text: `Placed point ${y.label}`, elementIds: [y.id] };
              p.setState({
                points: [...c.points, y],
                steps: [...c.steps, E],
                stepCounter: c.stepCounter + 1
              });
            }
            p.setState({ selection: [y] });
          } else {
            const y = c.selection[0], k = Math.atan2(-(b.y - y.y), b.x - y.x) * (180 / Math.PI), E = k < 0 ? k + 360 : k, N = {
              id: "p" + Date.now(),
              x: y.x + 200 * Math.cos(E * Math.PI / 180),
              y: y.y - 200 * Math.sin(E * Math.PI / 180),
              label: Q()
            }, C = "r" + Date.now(), O = c.steps.length;
            N.stepIndex = O;
            const w = c.steps.length + 1, R = { num: c.stepCounter + 1, text: `Placed point ${N.label}`, elementIds: [N.id] }, $ = { num: c.stepCounter + 2, text: `Ray drawn from ${y.label} at ${E.toFixed(0)}°`, elementIds: [C] };
            p.setState({
              points: [...c.points, N],
              rays: [...c.rays, { id: C, from: y.id, to: N.id, angle: E, stepIndex: w }],
              steps: [...c.steps, R, $],
              stepCounter: c.stepCounter + 2,
              selection: [],
              statusMessage: "Ray drawn! Click to place another protractor center.",
              statusIsError: !1
            }), p.getState().pushSnapshot();
          }
          break;
        }
        case "compass": {
          if (c.selection.length === 0) {
            const y = D ?? { id: "p" + Date.now(), x: b.x, y: b.y, label: Q() };
            if (!D) {
              const k = c.steps.length;
              y.stepIndex = k;
              const E = { num: c.stepCounter + 1, text: `Placed compass center at ${y.label}`, elementIds: [y.id] };
              p.setState({
                points: [...c.points, y],
                steps: [...c.steps, E],
                stepCounter: c.stepCounter + 1
              });
            }
            p.setState({ selection: [y] });
          } else if (c.selection.length === 1) {
            let y = { x: b.x, y: b.y };
            if (A.shiftKey)
              y = mt(c.selection[0], y);
            else {
              const E = bt(c.selection[0], y);
              E.snapped && (y = { x: E.x, y: E.y });
            }
            const k = Math.hypot(y.x - c.selection[0].x, y.y - c.selection[0].y);
            p.setState({ selection: [...c.selection, { radius: k }] });
          } else if (c.selection.length === 2) {
            const y = Math.atan2(-(b.y - c.selection[0].y), b.x - c.selection[0].x) * (180 / Math.PI);
            p.setState({ selection: [...c.selection, { startAngle: y < 0 ? y + 360 : y }] });
          } else if (c.selection.length === 3) {
            const y = Math.atan2(-(b.y - c.selection[0].y), b.x - c.selection[0].x) * (180 / Math.PI), k = y < 0 ? y + 360 : y, E = c.selection[2].startAngle, N = ut(c.selection[1].radius), C = "a" + Date.now(), O = { num: c.stepCounter + 1, text: `Arc drawn from ${E.toFixed(0)}° to ${k.toFixed(0)}° with radius ${N} cm`, elementIds: [C] };
            p.setState({
              arcs: [...c.arcs, { id: C, center: { ...c.selection[0] }, radius: c.selection[1].radius, startAngle: E, endAngle: k, type: "arc", stepIndex: c.steps.length }],
              steps: [...c.steps, O],
              stepCounter: c.stepCounter + 1,
              selection: [],
              statusMessage: "Arc drawn!",
              statusIsError: !1
            }), p.getState().pushSnapshot();
          }
          break;
        }
        case "point": {
          if (!D) {
            const y = { id: "p" + Date.now(), x: b.x, y: b.y, label: Q(), stepIndex: c.steps.length }, k = { num: c.stepCounter + 1, text: `Placed point ${y.label}`, elementIds: [y.id] };
            p.setState({
              points: [...c.points, y],
              steps: [...c.steps, k],
              stepCounter: c.stepCounter + 1,
              statusMessage: `Point ${y.label} placed`,
              statusIsError: !1
            }), p.getState().pushSnapshot();
          }
          break;
        }
        case "text": {
          c.playbackActive || (v({ x: b.x, y: b.y }), g(null));
          break;
        }
        case "move": {
          if (!c.playbackActive) {
            const y = c.lines.find((O) => {
              const w = c.points.find((et) => et.id === O.a), R = c.points.find((et) => et.id === O.b);
              if (!w || !R) return !1;
              const $ = R.x - w.x, I = R.y - w.y, H = ((b.x - w.x) * $ + (b.y - w.y) * I) / ($ * $ + I * I), q = w.x + Math.max(0, Math.min(1, H)) * $, X = w.y + Math.max(0, Math.min(1, H)) * I;
              return Math.hypot(b.x - q, b.y - X) <= 8 / d.current.zoom;
            }), k = c.rays.find((O) => {
              const w = c.points.find((et) => et.id === O.from), R = c.points.find((et) => et.id === O.to);
              if (!w || !R) return !1;
              const $ = R.x - w.x, I = R.y - w.y, H = ((b.x - w.x) * $ + (b.y - w.y) * I) / ($ * $ + I * I), q = w.x + Math.max(0, Math.min(1, H)) * $, X = w.y + Math.max(0, Math.min(1, H)) * I;
              return Math.hypot(b.x - q, b.y - X) <= 8 / d.current.zoom;
            }), E = c.arcs.find((O) => {
              const w = Math.hypot(b.x - O.center.x, b.y - O.center.y);
              return Math.abs(w - O.radius) <= 8 / d.current.zoom;
            }), N = c.texts.find((O) => Math.abs(b.x - O.x) < 30 && Math.abs(b.y - O.y) < 15);
            if (!D && !y && !k && !E && !N) {
              p.setState({ selectedIds: /* @__PURE__ */ new Set() });
              break;
            }
            const C = /* @__PURE__ */ new Set();
            D ? C.add(D.id) : y ? C.add(y.id) : k ? C.add(k.id) : E ? C.add(E.id) : N && C.add(N.id), p.setState({ selectedIds: C });
          }
          break;
        }
        case "eraser": {
          const y = Ot(b, c.points, 12 / d.current.zoom);
          if (y) {
            const k = /* @__PURE__ */ new Set([y.id]);
            c.lines.filter((I) => I.a === y.id || I.b === y.id).forEach((I) => k.add(I.id)), c.rays.filter((I) => I.from === y.id || I.to === y.id).forEach((I) => k.add(I.id)), c.arcs.filter((I) => I.center.id === y.id).forEach((I) => k.add(I.id));
            const E = ht(c.steps.filter((I) => !I.elementIds || !I.elementIds.some((H) => k.has(H)))), N = c.points.filter((I) => !k.has(I.id)), C = c.lines.filter((I) => !k.has(I.id) && !k.has(I.a) && !k.has(I.b)), O = c.rays.filter((I) => !k.has(I.id) && !k.has(I.from) && !k.has(I.to)), w = c.arcs.filter((I) => !k.has(I.id) && !(I.center && k.has(I.center.id))), R = c.texts.filter((I) => !k.has(I.id)), $ = yt(N, C, O, w, R, E);
            p.setState({
              ...$,
              steps: E,
              stepCounter: E.length,
              statusMessage: `Erased point ${y.label}`,
              statusIsError: !1
            }), p.getState().pushSnapshot();
          } else {
            const k = c.lines.find((O) => {
              const w = c.points.find((et) => et.id === O.a), R = c.points.find((et) => et.id === O.b);
              if (!w || !R) return !1;
              const $ = R.x - w.x, I = R.y - w.y, H = ((b.x - w.x) * $ + (b.y - w.y) * I) / ($ * $ + I * I), q = w.x + Math.max(0, Math.min(1, H)) * $, X = w.y + Math.max(0, Math.min(1, H)) * I;
              return Math.hypot(b.x - q, b.y - X) <= 8 / d.current.zoom;
            });
            if (k) {
              const O = /* @__PURE__ */ new Set([k.id]), w = ht(c.steps.filter((I) => !I.elementIds || !I.elementIds.some((H) => O.has(H)))), R = c.lines.filter((I) => I.id !== k.id), $ = yt(c.points, R, c.rays, c.arcs, c.texts, w);
              p.setState({ ...$, steps: w, stepCounter: w.length, statusMessage: "Erased line", statusIsError: !1 }), p.getState().pushSnapshot();
              break;
            }
            const E = c.rays.find((O) => {
              const w = c.points.find((et) => et.id === O.from), R = c.points.find((et) => et.id === O.to);
              if (!w || !R) return !1;
              const $ = R.x - w.x, I = R.y - w.y, H = ((b.x - w.x) * $ + (b.y - w.y) * I) / ($ * $ + I * I), q = w.x + Math.max(0, Math.min(1, H)) * $, X = w.y + Math.max(0, Math.min(1, H)) * I;
              return Math.hypot(b.x - q, b.y - X) <= 8 / d.current.zoom;
            });
            if (E) {
              const O = /* @__PURE__ */ new Set([E.id]), w = ht(c.steps.filter((I) => !I.elementIds || !I.elementIds.some((H) => O.has(H)))), R = c.rays.filter((I) => I.id !== E.id), $ = yt(c.points, c.lines, R, c.arcs, c.texts, w);
              p.setState({ ...$, steps: w, stepCounter: w.length, statusMessage: "Erased ray", statusIsError: !1 }), p.getState().pushSnapshot();
              break;
            }
            const N = c.arcs.find((O) => {
              const w = Math.hypot(b.x - O.center.x, b.y - O.center.y);
              return Math.abs(w - O.radius) <= 8 / d.current.zoom;
            });
            if (N) {
              const O = /* @__PURE__ */ new Set([N.id]), w = ht(c.steps.filter((I) => !I.elementIds || !I.elementIds.some((H) => O.has(H)))), R = c.arcs.filter((I) => I.id !== N.id), $ = yt(c.points, c.lines, c.rays, R, c.texts, w);
              p.setState({ ...$, steps: w, stepCounter: w.length, statusMessage: "Erased arc", statusIsError: !1 }), p.getState().pushSnapshot();
              break;
            }
            const C = c.texts.find(
              (O) => Math.abs(b.x - O.x) < 30 && Math.abs(b.y - O.y) < 15
            );
            if (C) {
              const O = /* @__PURE__ */ new Set([C.id]), w = ht(c.steps.filter((I) => !I.elementIds || !I.elementIds.some((H) => O.has(H)))), R = c.texts.filter((I) => I.id !== C.id), $ = yt(c.points, c.lines, c.rays, c.arcs, R, w);
              p.setState({ ...$, steps: w, stepCounter: w.length, statusMessage: "Erased text", statusIsError: !1 }), p.getState().pushSnapshot();
            }
          }
          break;
        }
        case "intersect": {
          p.getState().findIntersectionsAction();
          break;
        }
      }
    };
    return x.addEventListener("wheel", _, { passive: !1 }), x.addEventListener("mousedown", P), window.addEventListener("mousemove", j), window.addEventListener("mouseup", z), x.addEventListener("click", F), () => {
      x.removeEventListener("wheel", _), x.removeEventListener("mousedown", P), window.removeEventListener("mousemove", j), window.removeEventListener("mouseup", z), x.removeEventListener("click", F);
    };
  }, []), pt(() => {
    J();
  });
  const It = (x) => {
    if (!x.trim()) return;
    const _ = p.getState();
    if (h)
      p.setState({ texts: _.texts.map((P) => P.id === h ? { ...P, content: x.trim() } : P) });
    else if (S) {
      const P = { id: "t" + Date.now(), x: S.x, y: S.y, content: x.trim(), fontSize: 14 }, j = { num: _.stepCounter + 1, text: `Added text "${x.trim().substring(0, 20)}${x.trim().length > 20 ? "..." : ""}"`, elementIds: [P.id] };
      p.setState({
        texts: [..._.texts, P],
        steps: [..._.steps, j],
        stepCounter: _.stepCounter + 1
      }), p.getState().pushSnapshot();
    }
    v(null), g(null);
  }, T = p((x) => x.currentTool);
  return /* @__PURE__ */ f("div", { style: { flex: 1, position: "relative", overflow: "hidden", background: "#0d1117" }, children: /* @__PURE__ */ L("div", { style: { width: "100%", height: "100%", position: "relative" }, children: [
    /* @__PURE__ */ L(
      "svg",
      {
        ref: a,
        style: { width: "100%", height: "100%", cursor: T === "move" ? "move" : T === "hand" ? "grab" : "crosshair" },
        children: [
          /* @__PURE__ */ L("defs", { children: [
            /* @__PURE__ */ f("pattern", { id: "smallGrid", width: "20", height: "20", patternUnits: "userSpaceOnUse", children: /* @__PURE__ */ f("path", { d: "M 20 0 L 0 0 0 20", fill: "none", stroke: "#1e293b", strokeWidth: "0.5" }) }),
            /* @__PURE__ */ L("pattern", { id: "grid", width: "100", height: "100", patternUnits: "userSpaceOnUse", children: [
              /* @__PURE__ */ f("rect", { width: "100", height: "100", fill: "url(#smallGrid)" }),
              /* @__PURE__ */ f("path", { d: "M 100 0 L 0 0 0 100", fill: "none", stroke: "#334155", strokeWidth: "1" })
            ] })
          ] }),
          /* @__PURE__ */ L("g", { ref: e, children: [
            /* @__PURE__ */ f("rect", { x: "-5000", y: "-5000", width: "10000", height: "10000", fill: "url(#grid)" }),
            /* @__PURE__ */ f(Ee, {}),
            /* @__PURE__ */ f(Ce, {}),
            /* @__PURE__ */ f(Oe, {}),
            /* @__PURE__ */ f(Te, {}),
            /* @__PURE__ */ f(_e, {}),
            /* @__PURE__ */ f(Pe, {}),
            /* @__PURE__ */ f(Le, {}),
            /* @__PURE__ */ f("g", { id: "previewGroup" })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ f(Me, { position: S, editId: h, onSubmit: It, onCancel: () => {
      v(null), g(null);
    } }),
    t && /* @__PURE__ */ f(Ie, {})
  ] }) });
}
function Ee() {
  const t = p((n) => n.points), a = p((n) => n.selectedIds), e = p((n) => n.playbackActive), s = p((n) => n.playbackStep), r = e ? s : -1, u = e && r >= 0;
  return /* @__PURE__ */ f("g", { id: "pointsGroup", children: t.map((n) => {
    const o = a.has(n.id), i = u && n.stepIndex !== void 0 && n.stepIndex > r ? 0 : 1;
    return /* @__PURE__ */ L("g", { opacity: i, children: [
      o && /* @__PURE__ */ f("circle", { cx: n.x, cy: n.y, r: "14", fill: "none", stroke: "#0ea5a9", strokeWidth: "2", strokeDasharray: "4 3" }),
      /* @__PURE__ */ f("circle", { cx: n.x, cy: n.y, r: "8", fill: "#0d1117", stroke: o ? "#0ea5a9" : "#34d399", strokeWidth: "2" }),
      /* @__PURE__ */ f("circle", { cx: n.x, cy: n.y, r: "3", fill: "#34d399" }),
      /* @__PURE__ */ f("text", { x: n.x + 12, y: n.y - 8, fontSize: "13", fontFamily: "Georgia", fontWeight: "bold", fill: "#e2e8f0", children: n.label })
    ] }, n.id);
  }) });
}
function Ce() {
  const t = p((o) => o.rays), a = p((o) => o.points), e = p((o) => o.selectedIds), s = p((o) => o.playbackActive), r = p((o) => o.playbackStep), u = s ? r : -1, n = s && u >= 0;
  return /* @__PURE__ */ f("g", { id: "raysGroup", children: t.map((o) => {
    const i = a.find((S) => S.id === o.from), d = a.find((S) => S.id === o.to);
    if (!i || !d) return null;
    const l = e.has(o.id), m = n && o.stepIndex !== void 0 && o.stepIndex > u ? 0 : 1;
    return /* @__PURE__ */ L("g", { opacity: m, children: [
      l && /* @__PURE__ */ f("line", { x1: i.x, y1: i.y, x2: d.x, y2: d.y, stroke: "#0ea5a9", strokeWidth: "6", strokeLinecap: "round", opacity: "0.3" }),
      /* @__PURE__ */ f("line", { x1: i.x, y1: i.y, x2: d.x, y2: d.y, stroke: l ? "#0ea5a9" : "#f59e0b", strokeWidth: "2.5", strokeLinecap: "round" })
    ] }, o.id);
  }) });
}
function Oe() {
  const t = p((o) => o.lines), a = p((o) => o.points), e = p((o) => o.selectedIds), s = p((o) => o.playbackActive), r = p((o) => o.playbackStep), u = s ? r : -1, n = s && u >= 0;
  return /* @__PURE__ */ f("g", { id: "linesGroup", children: t.map((o) => {
    const i = a.find((S) => S.id === o.a), d = a.find((S) => S.id === o.b);
    if (!i || !d) return null;
    const l = e.has(o.id), m = n && o.stepIndex !== void 0 && o.stepIndex > u ? 0 : 1;
    return /* @__PURE__ */ L("g", { opacity: m, children: [
      l && /* @__PURE__ */ f("line", { x1: i.x, y1: i.y, x2: d.x, y2: d.y, stroke: "#0ea5a9", strokeWidth: "6", strokeLinecap: "round", opacity: "0.3" }),
      /* @__PURE__ */ f("line", { x1: i.x, y1: i.y, x2: d.x, y2: d.y, stroke: l ? "#0ea5a9" : "#60a5fa", strokeWidth: "2.5", strokeLinecap: "round" })
    ] }, o.id);
  }) });
}
function Te() {
  const t = p((n) => n.arcs), a = p((n) => n.selectedIds), e = p((n) => n.playbackActive), s = p((n) => n.playbackStep), r = e ? s : -1, u = e && r >= 0;
  return /* @__PURE__ */ f("g", { id: "arcsGroup", children: t.map((n) => {
    const o = a.has(n.id), i = u && n.stepIndex !== void 0 && n.stepIndex > r ? 0 : 1;
    if (n.type === "circle")
      return /* @__PURE__ */ L("g", { opacity: i, children: [
        o && /* @__PURE__ */ f("circle", { cx: n.center.x, cy: n.center.y, r: n.radius, fill: "none", stroke: "#0ea5a9", strokeWidth: "6", opacity: "0.3" }),
        /* @__PURE__ */ f("circle", { cx: n.center.x, cy: n.center.y, r: n.radius, fill: "none", stroke: o ? "#0ea5a9" : "#f472b6", strokeWidth: o ? "3" : "2", strokeDasharray: "8 4" })
      ] }, n.id);
    const d = fe(n);
    return /* @__PURE__ */ f("g", { opacity: i, children: /* @__PURE__ */ f("path", { d, fill: "none", stroke: o ? "#0ea5a9" : "#f472b6", strokeWidth: o ? "3" : "2", strokeLinecap: "round" }) }, n.id);
  }) });
}
function _e() {
  const t = p((n) => n.texts), a = p((n) => n.selectedIds), e = p((n) => n.playbackActive), s = p((n) => n.playbackStep), r = e ? s : -1, u = e && r >= 0;
  return /* @__PURE__ */ f("g", { id: "textsGroup", children: t.map((n) => {
    const o = a.has(n.id), i = u && n.stepIndex !== void 0 && n.stepIndex > r ? 0 : 1;
    return /* @__PURE__ */ L("g", { opacity: i, children: [
      o && /* @__PURE__ */ f("rect", { x: n.x - 6, y: n.y - n.fontSize - 4, width: n.content.length * n.fontSize * 0.6 + 12, height: n.fontSize + 10, fill: "none", stroke: "#0ea5a9", strokeWidth: "1.5", strokeDasharray: "4 3", rx: "4" }),
      /* @__PURE__ */ f("text", { x: n.x, y: n.y, fontSize: n.fontSize || 14, fontFamily: "system-ui, sans-serif", fill: o ? "#0ea5a9" : "#e2e8f0", fontWeight: "500", children: n.content })
    ] }, n.id);
  }) });
}
function Pe() {
  const t = p((l) => l.lines), a = p((l) => l.rays), e = p((l) => l.arcs), s = p((l) => l.points), r = p((l) => l.labelPositions), u = p((l) => l.playbackActive), n = p((l) => l.playbackStep), o = u ? n : -1, i = u && o >= 0, d = (l, m, S) => /* @__PURE__ */ L(
    "g",
    {
      className: "measure-label",
      "data-id": l.id,
      opacity: S,
      transform: `translate(${l.x}, ${l.y})`,
      style: { cursor: "grab" },
      children: [
        /* @__PURE__ */ f("rect", { x: "-20", y: "-10", width: "40", height: "20", fill: "#1a2744", stroke: "#1e3a5f", strokeWidth: "1", rx: "4" }),
        /* @__PURE__ */ f("text", { x: "0", y: "0", fontSize: "10", fontFamily: "system-ui", fontWeight: "600", fill: "#94a3b8", textAnchor: "middle", dominantBaseline: "middle", children: l.text })
      ]
    },
    m
  );
  return /* @__PURE__ */ L("g", { id: "labelsGroup", children: [
    t.map((l) => {
      const m = s.find((g) => g.id === l.a), S = s.find((g) => g.id === l.b);
      if (!m || !S) return null;
      const v = de(l, m, S, r), h = i && l.stepIndex !== void 0 && l.stepIndex > o ? 0 : 1;
      return d({ ...v, id: l.id }, "ll-" + l.id, h);
    }),
    a.map((l) => {
      const m = s.find((g) => g.id === l.from), S = s.find((g) => g.id === l.to);
      if (!m || !S) return null;
      const v = ue(l, m, S, r), h = i && l.stepIndex !== void 0 && l.stepIndex > o ? 0 : 1;
      return d({ ...v, id: l.id }, "rl-" + l.id, h);
    }),
    e.map((l) => {
      const m = pe(l, r), S = i && l.stepIndex !== void 0 && l.stepIndex > o ? 0 : 1;
      return d({ ...m, id: l.id }, "al-" + l.id, S);
    })
  ] });
}
function Le() {
  const t = p((u) => u.intersections), a = p((u) => u.playbackActive), e = p((u) => u.playbackStep), s = a ? e : -1, r = a && s >= 0;
  return /* @__PURE__ */ f("g", { id: "intersectionsGroup", children: t.map((u, n) => {
    const o = r && u.stepIndex !== void 0 && u.stepIndex > s ? 0 : 1;
    return /* @__PURE__ */ L("g", { opacity: o, children: [
      /* @__PURE__ */ f("circle", { cx: u.x, cy: u.y, r: "10", fill: "#3b3510", stroke: "#fbbf24", strokeWidth: "2", strokeDasharray: "3 2" }),
      /* @__PURE__ */ f("circle", { cx: u.x, cy: u.y, r: "3", fill: "#fbbf24" }),
      /* @__PURE__ */ L("text", { x: u.x + 14, y: u.y - 10, fontSize: "13", fontFamily: "Georgia", fontWeight: "bold", fill: "#fbbf24", children: [
        "I",
        n + 1
      ] })
    ] }, "i" + n);
  }) });
}
const Re = {
  ruler: "Ruler",
  protractor: "Protractor",
  compass: "Compass",
  point: "Point",
  text: "Text",
  intersect: "Intersection",
  hand: "Hand",
  move: "Move",
  eraser: "Eraser"
};
function De({ onExportSVG: t, onExportJSON: a, onExportPNG: e, keyBindings: s }) {
  const r = p((M) => M.findIntersectionsAction), u = p((M) => M.completeFullCircle), n = p((M) => M.importJSON), o = p((M) => M.statusMessage), i = p((M) => M.statusIsError), d = p((M) => M.steps), l = p((M) => M.selection), m = p((M) => M.currentTool), S = p((M) => M.playbackActive), v = p((M) => M.playbackStep), h = p((M) => M.setPlaybackActive), g = p((M) => M.setPlaybackStep), B = p((M) => M.setStatus), G = tt(null), U = () => {
    if (d.length === 0) return;
    h(!0), g(-1);
    let M = -1;
    const J = () => {
      if (M++, M >= d.length) {
        Y();
        return;
      }
      g(M), B(`Step ${M + 1}: ${d[M].text}`), setTimeout(J, 1800);
    };
    setTimeout(J, 800);
  }, Y = () => {
    h(!1), g(-1), B("Stopped");
  }, K = (M) => {
    var Z;
    const J = (Z = M.target.files) == null ? void 0 : Z[0];
    if (!J) return;
    const Q = new FileReader();
    Q.onload = (st) => {
      var rt;
      const at = (rt = st.target) == null ? void 0 : rt.result;
      n(at);
    }, Q.readAsText(J), M.target.value = "";
  }, V = [], W = /* @__PURE__ */ new Set();
  for (const [M, J] of Object.entries(s)) {
    if (W.has(J)) continue;
    W.add(J);
    const Q = Object.entries(s).filter(([, Z]) => Z === J).map(([Z]) => Z);
    V.push({ action: J, keys: Q });
  }
  return /* @__PURE__ */ L(
    "div",
    {
      style: {
        width: 260,
        background: "#16213e",
        borderLeft: "1px solid #0f3460",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        padding: 12,
        overflowY: "auto",
        flexShrink: 0,
        zIndex: 50
      },
      children: [
        /* @__PURE__ */ f(vt, { title: "Actions", children: /* @__PURE__ */ L("div", { style: { display: "flex", flexDirection: "column", gap: 6 }, children: [
          /* @__PURE__ */ f(lt, { label: "Find Intersections", primary: !0, onClick: r }),
          m === "compass" && l.length === 2 && /* @__PURE__ */ f(lt, { label: "Draw Full Circle", onClick: u }),
          /* @__PURE__ */ f(lt, { label: "Export SVG", onClick: t }),
          /* @__PURE__ */ f(lt, { label: "Export PNG", onClick: e }),
          /* @__PURE__ */ f(lt, { label: "Save JSON", onClick: a }),
          /* @__PURE__ */ f(lt, { label: "Load JSON", onClick: () => {
            var M;
            return (M = G.current) == null ? void 0 : M.click();
          } }),
          /* @__PURE__ */ f(
            "input",
            {
              ref: G,
              type: "file",
              accept: ".json",
              style: { display: "none" },
              onChange: K
            }
          )
        ] }) }),
        /* @__PURE__ */ L(vt, { title: "Current Tool", children: [
          /* @__PURE__ */ f(we, {}),
          /* @__PURE__ */ f(
            "div",
            {
              style: {
                padding: 8,
                borderRadius: 7,
                fontSize: 11,
                marginTop: 10,
                background: i ? "#3b1a1a" : "#0d3030",
                color: i ? "#f87171" : "#5eead4",
                textAlign: "center"
              },
              children: o
            }
          )
        ] }),
        /* @__PURE__ */ L(vt, { title: "Keyboard Shortcuts", children: [
          V.map(({ action: M, keys: J }) => {
            const Q = Re[M] || M.charAt(0).toUpperCase() + M.slice(1);
            return /* @__PURE__ */ f(ct, { label: Q, value: J.join(" / ") }, M);
          }),
          /* @__PURE__ */ f(ct, { label: "Hand (temp)", value: "Space" }),
          /* @__PURE__ */ f(ct, { label: "Undo", value: "Ctrl+Z" }),
          /* @__PURE__ */ f(ct, { label: "Redo", value: "Ctrl+Shift+Z / Ctrl+Y" }),
          /* @__PURE__ */ f(ct, { label: "Select All", value: "Ctrl+A" }),
          /* @__PURE__ */ f(ct, { label: "Nudge", value: "Arrows (Shift=10x)" }),
          /* @__PURE__ */ f(ct, { label: "Constrain", value: "Shift" }),
          /* @__PURE__ */ f(ct, { label: "Pan", value: "Middle-click / Alt+drag" })
        ] }),
        d.length > 0 && /* @__PURE__ */ L(vt, { title: "Construction Steps", children: [
          /* @__PURE__ */ L("div", { style: { display: "flex", gap: 5, marginBottom: 10 }, children: [
            !S && /* @__PURE__ */ L(
              "button",
              {
                onClick: U,
                style: {
                  flex: 1,
                  padding: "7px",
                  borderRadius: 6,
                  border: "none",
                  background: "#3b3510",
                  color: "#fbbf24",
                  fontSize: 12,
                  fontWeight: 500,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6
                },
                children: [
                  /* @__PURE__ */ f("svg", { width: "12", height: "12", viewBox: "0 0 24 24", fill: "currentColor", children: /* @__PURE__ */ f("path", { d: "M8 5v14l11-7z" }) }),
                  "Play"
                ]
              }
            ),
            S && /* @__PURE__ */ L(
              "button",
              {
                onClick: Y,
                style: {
                  flex: 1,
                  padding: "7px",
                  borderRadius: 6,
                  border: "none",
                  background: "#1e3a5f",
                  color: "#94a3b8",
                  fontSize: 12,
                  fontWeight: 500,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6
                },
                children: [
                  /* @__PURE__ */ f("svg", { width: "12", height: "12", viewBox: "0 0 24 24", fill: "currentColor", children: /* @__PURE__ */ f("path", { d: "M6 6h12v12H6z" }) }),
                  "Stop"
                ]
              }
            )
          ] }),
          /* @__PURE__ */ f(
            "div",
            {
              style: {
                display: "flex",
                flexDirection: "column",
                gap: 6,
                maxHeight: 250,
                overflowY: "auto"
              },
              children: d.map((M, J) => /* @__PURE__ */ L(
                "div",
                {
                  style: {
                    display: "flex",
                    gap: 8,
                    padding: 7,
                    borderRadius: 5,
                    background: S && J === v ? "#0d3030" : "#0d1117",
                    border: S && J === v ? "1px solid #0ea5a9" : "none",
                    color: S && J <= v ? "#e2e8f0" : "#94a3b8",
                    opacity: S && J > v ? 0.3 : 1,
                    fontSize: 11,
                    transition: "all 0.2s"
                  },
                  children: [
                    /* @__PURE__ */ f(
                      "div",
                      {
                        style: {
                          width: 20,
                          height: 20,
                          borderRadius: "50%",
                          background: S && J === v ? "#10b981" : "#0ea5a9",
                          color: "white",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 10,
                          fontWeight: 700,
                          flexShrink: 0
                        },
                        children: M.num
                      }
                    ),
                    /* @__PURE__ */ f("div", { children: M.text })
                  ]
                },
                J
              ))
            }
          )
        ] })
      ]
    }
  );
}
function vt({ title: t, children: a }) {
  return /* @__PURE__ */ L(
    "div",
    {
      style: {
        background: "#1a2744",
        borderRadius: 10,
        border: "1px solid #1e3a5f",
        padding: 14
      },
      children: [
        /* @__PURE__ */ f("h3", { style: { fontSize: 13, fontWeight: 600, color: "#e2e8f0", margin: 0, marginBottom: 10 }, children: t }),
        a
      ]
    }
  );
}
function lt({
  label: t,
  primary: a,
  onClick: e
}) {
  return /* @__PURE__ */ f(
    "button",
    {
      onClick: e,
      style: {
        width: "100%",
        padding: 9,
        borderRadius: 7,
        border: "none",
        fontSize: 12,
        fontWeight: 500,
        cursor: "pointer",
        background: a ? "#0ea5a9" : "#1e3a5f",
        color: a ? "white" : "#94a3b8",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 6
      },
      children: t
    }
  );
}
function ct({ label: t, value: a }) {
  return /* @__PURE__ */ L(
    "div",
    {
      style: {
        display: "flex",
        justifyContent: "space-between",
        fontSize: 11,
        color: "#94a3b8",
        gap: 4
      },
      children: [
        /* @__PURE__ */ f("span", { children: t }),
        /* @__PURE__ */ f("span", { style: { color: "#64748b" }, children: a })
      ]
    }
  );
}
const Ne = ["ruler", "protractor", "compass", "point", "text", "intersect", "hand", "move", "eraser"], $e = {
  1: "ruler",
  2: "protractor",
  3: "compass",
  4: "point",
  5: "text",
  6: "intersect",
  7: "hand",
  8: "move",
  9: "eraser",
  "=": "zoomIn",
  "+": "zoomIn",
  "-": "zoomOut",
  _: "zoomOut",
  0: "zoomReset",
  Delete: "delete",
  Backspace: "delete",
  Escape: "clearSelection"
}, We = Yt(function({
  className: a,
  style: e,
  showHeader: s = !0,
  showToolPanel: r = !0,
  showRightPanel: u = !0,
  showInstructionBar: n = !0,
  keyBindings: o,
  onExportSVG: i,
  onExportJSON: d,
  onExportPNG: l,
  onStepsChange: m,
  onDataChange: S
}, v) {
  const h = p((T) => T.setTool), g = p((T) => T.undo), B = p((T) => T.redo), G = p((T) => T.selectAll), U = p((T) => T.deleteSelected), Y = p((T) => T.clearSelectedIds), K = p((T) => T.clearSelection), V = tt(!1), W = tt(null), M = { ...$e, ...o }, J = ot(
    (T) => {
      const x = T.key;
      return T.ctrlKey || T.metaKey ? (x === "z" || x === "Z") && !T.shiftKey ? "undo" : (x === "z" || x === "Z") && T.shiftKey || x === "y" || x === "Y" ? "redo" : x === "a" || x === "A" ? "selectAll" : null : M[x] || null;
    },
    [M]
  ), Q = ot(
    (T) => {
      if (T.key === "Shift") return;
      if (T.key === " " && !V.current) {
        T.preventDefault(), V.current = !0, W.current = p.getState().currentTool, p.setState({ currentTool: "hand" });
        return;
      }
      const x = J(T);
      if (x)
        switch (T.preventDefault(), x) {
          case "undo":
            g();
            break;
          case "redo":
            B();
            break;
          case "selectAll":
            G();
            break;
          case "delete":
            U();
            break;
          case "clearSelection":
            Y(), K();
            break;
          case "zoomIn":
            break;
          case "zoomOut":
            break;
          case "zoomReset":
            break;
          case "hand":
            V.current || (V.current = !0, W.current = p.getState().currentTool, p.setState({ currentTool: "hand" }));
            break;
          default:
            Ne.includes(x) && h(x);
        }
    },
    [J, h, g, B, G, U, Y, K]
  ), Z = ot((T) => {
    T.key === " " && V.current && (V.current = !1, W.current && (p.setState({ currentTool: W.current }), W.current = null));
  }, []);
  pt(() => (window.addEventListener("keydown", Q), window.addEventListener("keyup", Z), () => {
    window.removeEventListener("keydown", Q), window.removeEventListener("keyup", Z);
  }), [Q, Z]), pt(() => {
    p.getState().pushSnapshot();
  }, []), pt(() => p.subscribe((x) => {
    m == null || m(x.steps), S == null || S({ points: x.points, lines: x.lines, rays: x.rays, arcs: x.arcs, texts: x.texts, steps: x.steps });
  }), [m, S]);
  const st = ot(() => {
    const T = p.getState();
    return Ht(T.points, T.lines, T.rays, T.arcs);
  }, []), at = ot(() => p.getState().exportJSON(), []), rt = ot(async () => {
    const T = st();
    return new Promise((x, _) => {
      const P = new Image();
      P.onload = () => {
        const j = document.createElement("canvas");
        j.width = P.width, j.height = P.height;
        const z = j.getContext("2d");
        if (!z) {
          _(new Error("No canvas context"));
          return;
        }
        z.fillStyle = "#0d1117", z.fillRect(0, 0, j.width, j.height), z.drawImage(P, 0, 0), x(j.toDataURL("image/png"));
      }, P.onerror = _, P.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(T)));
    });
  }, [st]);
  Vt(v, () => ({
    toSVG: st,
    toJSON: at,
    toPNG: rt
  }), [st, at, rt]);
  const kt = ot(() => {
    const T = st();
    i == null || i(T);
    const x = new Blob([T], { type: "image/svg+xml" }), _ = document.createElement("a");
    _.href = URL.createObjectURL(x), _.download = "geometry.svg", _.click(), p.getState().setStatus("SVG exported!");
  }, [st, i]), wt = ot(() => {
    const T = at();
    d == null || d(T);
    const x = new Blob([T], { type: "application/json" }), _ = document.createElement("a");
    _.href = URL.createObjectURL(x), _.download = "geometry.json", _.click(), p.getState().setStatus("JSON saved!");
  }, [at, d]), It = ot(async () => {
    try {
      const T = await rt();
      l == null || l(T);
      const x = document.createElement("a");
      x.href = T, x.download = "geometry.png", x.click(), p.getState().setStatus("PNG exported!");
    } catch {
      p.getState().setStatus("PNG export failed", !0);
    }
  }, [rt, l]);
  return /* @__PURE__ */ L(
    "div",
    {
      className: a,
      style: {
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        fontFamily: "'Segoe UI', system-ui, sans-serif",
        background: "#1a1a2e",
        overflow: "hidden",
        ...e
      },
      children: [
        s && /* @__PURE__ */ f(me, {}),
        /* @__PURE__ */ L("div", { style: { display: "flex", flex: 1, overflow: "hidden" }, children: [
          r && /* @__PURE__ */ f(ke, {}),
          /* @__PURE__ */ f(Ae, { showInstructionBar: n }),
          u && /* @__PURE__ */ f(
            De,
            {
              onExportSVG: kt,
              onExportJSON: wt,
              onExportPNG: It,
              keyBindings: M
            }
          )
        ] })
      ]
    }
  );
});
export {
  We as GeometryEditor,
  p as useGeometryStore
};
