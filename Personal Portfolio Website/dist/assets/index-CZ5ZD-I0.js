import { a as e } from "./rolldown-runtime-COnpUsM8.js"
import {
  a as t,
  c as n,
  i as r,
  l as i,
  n as a,
  o,
  r as s,
  s as c,
  t as l,
  u,
} from "./vendor-react-CN_N__g3.js"
;(function () {
  let e = document.createElement(`link`).relList
  if (e && e.supports && e.supports(`modulepreload`)) return
  for (let e of document.querySelectorAll(`link[rel="modulepreload"]`)) n(e)
  new MutationObserver((e) => {
    for (let t of e)
      if (t.type === `childList`)
        for (let e of t.addedNodes)
          e.tagName === `LINK` && e.rel === `modulepreload` && n(e)
  }).observe(document, { childList: !0, subtree: !0 })
  function t(e) {
    let t = {}
    return (
      e.integrity && (t.integrity = e.integrity),
      e.referrerPolicy && (t.referrerPolicy = e.referrerPolicy),
      e.crossOrigin === `use-credentials`
        ? (t.credentials = `include`)
        : e.crossOrigin === `anonymous`
          ? (t.credentials = `omit`)
          : (t.credentials = `same-origin`),
      t
    )
  }
  function n(e) {
    if (e.ep) return
    e.ep = !0
    let n = t(e)
    fetch(e.href, n)
  }
})()
var d = e(u(), 1),
  f = e(i(), 1),
  p = class {
    constructor(e = 0, t = `Network Error`) {
      ;(this.status = e), (this.text = t)
    }
  },
  m = {
    origin: `https://api.emailjs.com`,
    blockHeadless: !1,
    storageProvider: (() => {
      if (!(typeof localStorage > `u`))
        return {
          get: (e) => Promise.resolve(localStorage.getItem(e)),
          set: (e, t) => Promise.resolve(localStorage.setItem(e, t)),
          remove: (e) => Promise.resolve(localStorage.removeItem(e)),
        }
    })(),
  },
  h = (e) =>
    e
      ? typeof e == `string`
        ? { publicKey: e }
        : e.toString() === `[object Object]`
          ? e
          : {}
      : {},
  g = (e, t = `https://api.emailjs.com`) => {
    if (!e) return
    let n = h(e)
    ;(m.publicKey = n.publicKey),
      (m.blockHeadless = n.blockHeadless),
      (m.storageProvider = n.storageProvider),
      (m.blockList = n.blockList),
      (m.limitRate = n.limitRate),
      (m.origin = n.origin || t)
  },
  _ = async (e, t, n = {}) => {
    let r = await fetch(m.origin + e, { method: `POST`, headers: n, body: t }),
      i = await r.text(),
      a = new p(r.status, i)
    if (r.ok) return a
    throw a
  },
  v = (e, t, n) => {
    if (!e || typeof e != `string`)
      throw `The public key is required. Visit https://dashboard.emailjs.com/admin/account`
    if (!t || typeof t != `string`)
      throw `The service ID is required. Visit https://dashboard.emailjs.com/admin`
    if (!n || typeof n != `string`)
      throw `The template ID is required. Visit https://dashboard.emailjs.com/admin/templates`
  },
  y = (e) => {
    if (e && e.toString() !== `[object Object]`)
      throw `The template params have to be the object. Visit https://www.emailjs.com/docs/sdk/send/`
  },
  b = (e) => e.webdriver || !e.languages || e.languages.length === 0,
  x = () => new p(451, `Unavailable For Headless Browser`),
  S = (e, t) => {
    if (!Array.isArray(e)) throw `The BlockList list has to be an array`
    if (typeof t != `string`)
      throw `The BlockList watchVariable has to be a string`
  },
  C = (e) => !e.list?.length || !e.watchVariable,
  w = (e, t) => (e instanceof FormData ? e.get(t) : e[t]),
  T = (e, t) => {
    if (C(e)) return !1
    S(e.list, e.watchVariable)
    let n = w(t, e.watchVariable)
    return typeof n == `string` ? e.list.includes(n) : !1
  },
  E = () => new p(403, `Forbidden`),
  D = (e, t) => {
    if (typeof e != `number` || e < 0)
      throw `The LimitRate throttle has to be a positive number`
    if (t && typeof t != `string`)
      throw `The LimitRate ID has to be a non-empty string`
  },
  O = async (e, t, n) => {
    let r = Number((await n.get(e)) || 0)
    return t - Date.now() + r
  },
  k = async (e, t, n) => {
    if (!t.throttle || !n) return !1
    D(t.throttle, t.id)
    let r = t.id || e
    return (await O(r, t.throttle, n)) > 0
      ? !0
      : (await n.set(r, Date.now().toString()), !1)
  },
  A = () => new p(429, `Too Many Requests`),
  j = async (e, t, n, r) => {
    let i = h(r),
      a = i.publicKey || m.publicKey,
      o = i.blockHeadless || m.blockHeadless,
      s = i.storageProvider || m.storageProvider,
      c = { ...m.blockList, ...i.blockList },
      l = { ...m.limitRate, ...i.limitRate }
    return o && b(navigator)
      ? Promise.reject(x())
      : (v(a, e, t),
        y(n),
        n && T(c, n)
          ? Promise.reject(E())
          : (await k(location.pathname, l, s))
            ? Promise.reject(A())
            : _(
                `/api/v1.0/email/send`,
                JSON.stringify({
                  lib_version: `4.4.1`,
                  user_id: a,
                  service_id: e,
                  template_id: t,
                  template_params: n,
                }),
                { "Content-type": `application/json` },
              ))
  },
  M = (e) => {
    if (!e || e.nodeName !== `FORM`)
      throw `The 3rd parameter is expected to be the HTML form element or the style selector of the form`
  },
  ee = (e) => (typeof e == `string` ? document.querySelector(e) : e),
  te = {
    init: g,
    send: j,
    sendForm: async (e, t, n, r) => {
      let i = h(r),
        a = i.publicKey || m.publicKey,
        o = i.blockHeadless || m.blockHeadless,
        s = m.storageProvider || i.storageProvider,
        c = { ...m.blockList, ...i.blockList },
        l = { ...m.limitRate, ...i.limitRate }
      if (o && b(navigator)) return Promise.reject(x())
      let u = ee(n)
      v(a, e, t), M(u)
      let d = new FormData(u)
      return T(c, d)
        ? Promise.reject(E())
        : (await k(location.pathname, l, s))
          ? Promise.reject(A())
          : (d.append(`lib_version`, `4.4.1`),
            d.append(`service_id`, e),
            d.append(`template_id`, t),
            d.append(`user_id`, a),
            _(`/api/v1.0/email/send-form`, d))
    },
    EmailJSResponseStatus: p,
  },
  N = n()
function P({ size: e = 36, style: t }) {
  return (0, N.jsxs)(`svg`, {
    width: e,
    height: e,
    viewBox: `0 0 100 100`,
    fill: `none`,
    xmlns: `http://www.w3.org/2000/svg`,
    style: { display: `block`, flexShrink: 0, ...t },
    children: [
      (0, N.jsxs)(`defs`, {
        children: [
          (0, N.jsxs)(`linearGradient`, {
            id: `ka-grad-1`,
            x1: `0%`,
            y1: `0%`,
            x2: `100%`,
            y2: `100%`,
            children: [
              (0, N.jsx)(`stop`, { offset: `0%`, stopColor: `#8b4fe8` }),
              (0, N.jsx)(`stop`, { offset: `50%`, stopColor: `#c9a7ff` }),
              (0, N.jsx)(`stop`, { offset: `100%`, stopColor: `#5b21b6` }),
            ],
          }),
          (0, N.jsxs)(`linearGradient`, {
            id: `ka-grad-2`,
            x1: `100%`,
            y1: `0%`,
            x2: `0%`,
            y2: `100%`,
            children: [
              (0, N.jsx)(`stop`, { offset: `0%`, stopColor: `#ffffff` }),
              (0, N.jsx)(`stop`, { offset: `100%`, stopColor: `#c9a7ff` }),
            ],
          }),
          (0, N.jsxs)(`filter`, {
            id: `ka-glow`,
            x: `-20%`,
            y: `-20%`,
            width: `140%`,
            height: `140%`,
            children: [
              (0, N.jsx)(`feGaussianBlur`, {
                stdDeviation: `3.5`,
                result: `blur`,
              }),
              (0, N.jsx)(`feComposite`, {
                in: `SourceGraphic`,
                in2: `blur`,
                operator: `over`,
              }),
            ],
          }),
        ],
      }),
      (0, N.jsx)(`circle`, {
        cx: `50`,
        cy: `50`,
        r: `45`,
        stroke: `url(#ka-grad-1)`,
        strokeWidth: `3.5`,
        fill: `rgba(13,2,33,0.75)`,
        filter: `url(#ka-glow)`,
      }),
      (0, N.jsx)(`circle`, {
        cx: `50`,
        cy: `50`,
        r: `37`,
        stroke: `rgba(201,167,255,0.3)`,
        strokeWidth: `1`,
        strokeDasharray: `3 3`,
      }),
      (0, N.jsx)(`path`, {
        d: `M 35 25 L 35 75 M 35 50 L 65 25 M 35 50 L 65 75`,
        stroke: `url(#ka-grad-2)`,
        strokeWidth: `6`,
        strokeLinecap: `round`,
        strokeLinejoin: `round`,
        filter: `url(#ka-glow)`,
      }),
      (0, N.jsx)(`circle`, { cx: `65`, cy: `25`, r: `3`, fill: `#ffffff` }),
      (0, N.jsx)(`circle`, { cx: `65`, cy: `75`, r: `3`, fill: `#c9a7ff` }),
    ],
  })
}
var ne = [
    `Job Opportunity`,
    `Collaboration`,
    `Freelance Inquiry`,
    `Just Saying Hi`,
    `Question`,
    `Other`,
  ],
  F = [
    {
      label: `GitHub`,
      href: `https://github.com/Lander2007`,
      svg: (0, N.jsx)(`svg`, {
        width: `18`,
        height: `18`,
        viewBox: `0 0 24 24`,
        fill: `currentColor`,
        children: (0, N.jsx)(`path`, {
          d: `M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12`,
        }),
      }),
    },
    {
      label: `Twitter`,
      href: `https://x.com/KhaledA33912144`,
      svg: (0, N.jsx)(`svg`, {
        width: `17`,
        height: `17`,
        viewBox: `0 0 24 24`,
        fill: `currentColor`,
        children: (0, N.jsx)(`path`, {
          d: `M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z`,
        }),
      }),
    },
    {
      label: `LinkedIn`,
      href: `https://www.linkedin.com/in/kh%E1%A5%B2%E1%A5%A3%E1%A5%B1d-amr-263334343/`,
      svg: (0, N.jsx)(`svg`, {
        width: `17`,
        height: `17`,
        viewBox: `0 0 24 24`,
        fill: `currentColor`,
        children: (0, N.jsx)(`path`, {
          d: `M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z`,
        }),
      }),
    },
  ],
  re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  I = 10,
  L = 500
function R(e) {
  return e.trim().length < 2 ? `Name must be at least 2 characters.` : ``
}
function z(e) {
  return re.test(e.trim())
    ? ``
    : `Please enter a valid email (e.g., name@domain.com).`
}
function B(e) {
  return e.trim().length < I ? `Message must be at least ${I} characters.` : ``
}
function ie({ children: e }) {
  return (0, N.jsxs)(`div`, {
    style: {
      fontFamily: `Syne`,
      fontSize: `0.72rem`,
      letterSpacing: `0.24em`,
      textTransform: `uppercase`,
      color: `#8b4fe8`,
      marginBottom: `1rem`,
      display: `inline-flex`,
      alignItems: `center`,
      gap: `0.75rem`,
    },
    children: [
      (0, N.jsx)(`span`, {
        style: {
          display: `inline-block`,
          width: `28px`,
          height: `1px`,
          background: `#6c2bd9`,
          flexShrink: 0,
        },
      }),
      e,
    ],
  })
}
function V({ children: e, delay: t = 0, direction: n = `up` }) {
  let r = n === `up` ? 48 : n === `down` ? -48 : 0,
    i = n === `scale` ? 0.86 : 0.96
  return (0, N.jsx)(o.div, {
    initial: { opacity: 0, y: r, scale: i, filter: `blur(6px)` },
    whileInView: { opacity: 1, y: 0, scale: 1, filter: `blur(0px)` },
    viewport: { once: !0, amount: 0.2, margin: `0px 0px -100px 0px` },
    transition: { duration: 0.8, delay: t, ease: [0.22, 1, 0.36, 1] },
    style: { willChange: `opacity, transform, filter` },
    children: e,
  })
}
function H({ message: e }) {
  return (0, N.jsx)(c, {
    children:
      e &&
      (0, N.jsx)(
        o.div,
        {
          initial: { opacity: 0, height: 0, y: -4 },
          animate: { opacity: 1, height: `auto`, y: 0 },
          exit: { opacity: 0, height: 0, y: -4 },
          transition: { duration: 0.2 },
          style: { overflow: `hidden` },
          children: (0, N.jsxs)(`div`, {
            style: {
              display: `flex`,
              alignItems: `center`,
              gap: `0.4rem`,
              marginTop: `0.45rem`,
              fontFamily: `Plus Jakarta Sans`,
              fontSize: `0.78rem`,
              fontWeight: 500,
              color: `#fb7185`,
            },
            children: [
              (0, N.jsx)(`svg`, {
                width: `13`,
                height: `13`,
                viewBox: `0 0 20 20`,
                fill: `currentColor`,
                style: { flexShrink: 0 },
                children: (0, N.jsx)(`path`, {
                  fillRule: `evenodd`,
                  d: `M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z`,
                  clipRule: `evenodd`,
                }),
              }),
              e,
            ],
          }),
        },
        e,
      ),
  })
}
function U() {
  return (0, N.jsx)(`svg`, {
    width: `16`,
    height: `16`,
    viewBox: `0 0 20 20`,
    fill: `none`,
    stroke: `#34d399`,
    strokeWidth: `2.2`,
    strokeLinecap: `round`,
    strokeLinejoin: `round`,
    children: (0, N.jsx)(`polyline`, { points: `4 10 8 14 16 6` }),
  })
}
function W() {
  return (0, N.jsx)(`svg`, {
    width: `15`,
    height: `15`,
    viewBox: `0 0 20 20`,
    fill: `#fb7185`,
    children: (0, N.jsx)(`path`, {
      fillRule: `evenodd`,
      d: `M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z`,
      clipRule: `evenodd`,
    }),
  })
}
function G(e, t, n) {
  return e ? (t ? `error` : n.trim().length > 0 ? `valid` : `idle`) : `idle`
}
function K(e, t) {
  return e === `valid`
    ? `rgba(52, 211, 153, 0.6)`
    : e === `error`
      ? `rgba(251, 113, 133, 0.8)`
      : t
        ? `#c9a7ff`
        : `rgba(108, 43, 217, 0.35)`
}
function q(e, t) {
  return e === `valid`
    ? t
      ? `0 0 0 3px rgba(52,211,153,0.12), 0 2px 20px rgba(52,211,153,0.15)`
      : `none`
    : e === `error`
      ? t
        ? `0 0 0 3px rgba(251,113,133,0.12), 0 2px 20px rgba(251,113,133,0.15)`
        : `none`
      : t
        ? `0 2px 20px rgba(201, 167, 255, 0.25)`
        : `none`
}
function J() {
  let [e, t] = (0, d.useState)({
      name: ``,
      email: ``,
      reason: ``,
      message: ``,
    }),
    [n, r] = (0, d.useState)({ name: !1, email: !1, message: !1 }),
    [i, a] = (0, d.useState)({ name: !1, email: !1, message: !1 }),
    [s, l] = (0, d.useState)({ name: ``, email: ``, message: `` }),
    [u, f] = (0, d.useState)(!1),
    [p, m] = (0, d.useState)(!1),
    [h, g] = (0, d.useState)({ x: 0, y: 0 }),
    _ = (0, d.useRef)(null)
  ;(0, d.useEffect)(() => {
    let e = (e) => {
      if (_.current) {
        let t = _.current.getBoundingClientRect()
        g({ x: e.clientX - t.left, y: e.clientY - t.top })
      }
    }
    return (
      window.addEventListener(`mousemove`, e),
      () => window.removeEventListener(`mousemove`, e)
    )
  }, [])
  let v = (e, t) => {
      let n = ``
      return (
        e === `name` && (n = R(t)),
        e === `email` && (n = z(t)),
        e === `message` && (n = B(t)),
        l((t) => ({ ...t, [e]: n })),
        n
      )
    },
    y = (e) => {
      r((t) => ({ ...t, [e]: !0 }))
    },
    b = (t) => {
      r((e) => ({ ...e, [t]: !1 })), a((e) => ({ ...e, [t]: !0 })), v(t, e[t])
    },
    x = (e) => {
      let { name: n, value: r } = e.target
      t((e) => ({ ...e, [n]: r })), i[n] && v(n, r)
    },
    S = s.name !== `` || s.email !== `` || s.message !== ``,
    C =
      e.name.trim() === `` || e.email.trim() === `` || e.message.trim() === ``,
    w = p || u || S || C,
    T = G(i.name, s.name, e.name),
    E = G(i.email, s.email, e.email),
    D = G(i.message, s.message, e.message),
    O = e.message.trim().length >= I,
    k = async (n) => {
      n.preventDefault()
      let r = R(e.name),
        i = z(e.email),
        o = B(e.message)
      if (
        (l({ name: r, email: i, message: o }),
        a({ name: !0, email: !0, message: !0 }),
        !(r || i || o))
      ) {
        m(!0)
        try {
          await te.send(
            `service_t7cvpvk`,
            `template_a3mitgu`,
            {
              from_name: e.name,
              user_email: e.email,
              reason: e.reason,
              message: e.message,
            },
            `nc-ws_AZd65JDBg4a`,
          ),
            m(!1),
            f(!0),
            setTimeout(() => {
              f(!1),
                t({ name: ``, email: ``, reason: ``, message: `` }),
                a({ name: !1, email: !1, message: !1 }),
                l({ name: ``, email: ``, message: `` })
            }, 4e3)
        } catch (e) {
          console.error(`Failed to send email:`, e),
            m(!1),
            alert(`Failed to send message. Please try again.`)
        }
      }
    },
    A = {
      position: `relative`,
      borderRadius: `12px`,
      border: `1px solid`,
      background: `rgba(13, 7, 34, 0.80)`,
      transition: `border-color 0.25s, box-shadow 0.25s`,
      overflow: `hidden`,
    },
    j = {
      width: `100%`,
      padding: `14px 44px 14px 16px`,
      background: `transparent`,
      border: `none`,
      outline: `none`,
      fontFamily: `Plus Jakarta Sans`,
      fontSize: `1rem`,
      color: `#f0e8ff`,
      transition: `all 0.25s`,
    }
  function M({ status: e }) {
    return e === `idle`
      ? null
      : (0, N.jsx)(`div`, {
          style: {
            position: `absolute`,
            right: `14px`,
            top: `50%`,
            transform: `translateY(-50%)`,
            pointerEvents: `none`,
            display: `flex`,
            alignItems: `center`,
          },
          children: (0, N.jsx)(c, {
            mode: `wait`,
            children:
              e === `valid`
                ? (0, N.jsx)(
                    o.span,
                    {
                      initial: { opacity: 0, scale: 0.5 },
                      animate: { opacity: 1, scale: 1 },
                      exit: { opacity: 0, scale: 0.5 },
                      transition: { duration: 0.18 },
                      children: (0, N.jsx)(U, {}),
                    },
                    `check`,
                  )
                : (0, N.jsx)(
                    o.span,
                    {
                      initial: { opacity: 0, scale: 0.5 },
                      animate: { opacity: 1, scale: 1 },
                      exit: { opacity: 0, scale: 0.5 },
                      transition: { duration: 0.18 },
                      children: (0, N.jsx)(W, {}),
                    },
                    `warn`,
                  ),
          }),
        })
  }
  return (0, N.jsx)(`section`, {
    id: `contact`,
    className: `section-transition-bleed`,
    style: { padding: `10rem 2rem 5rem`, position: `relative`, zIndex: 2 },
    children: (0, N.jsxs)(`div`, {
      style: {
        maxWidth: `820px`,
        margin: `0 auto`,
        position: `relative`,
        zIndex: 1,
      },
      children: [
        (0, N.jsx)(V, {
          direction: `down`,
          delay: 0.05,
          children: (0, N.jsx)(ie, { children: `06 / Contact & Inquiries` }),
        }),
        (0, N.jsx)(V, {
          direction: `up`,
          delay: 0.15,
          children: (0, N.jsx)(`h2`, {
            className: `text-glow-bright`,
            style: {
              fontFamily: `Syne`,
              fontWeight: 700,
              fontSize: `clamp(2.5rem, 5.8vw, 4.5rem)`,
              color: `#f0e8ff`,
              letterSpacing: `-0.03em`,
              marginBottom: `1rem`,
              lineHeight: 1.05,
              textAlign: `center`,
            },
            children: `Let's connect.`,
          }),
        }),
        (0, N.jsx)(V, {
          direction: `up`,
          delay: 0.25,
          children: (0, N.jsx)(`p`, {
            style: {
              fontFamily: `Plus Jakarta Sans`,
              fontSize: `1.08rem`,
              lineHeight: 1.8,
              color: `rgba(201,167,255,0.72)`,
              marginBottom: `4rem`,
              fontWeight: 300,
              textAlign: `center`,
            },
            children: `Whether you have a question, want to collaborate, or just want to say hello — I'd love to hear from you. Drop me a message and I'll get back to you soon.`,
          }),
        }),
        (0, N.jsx)(V, {
          direction: `scale`,
          delay: 0.35,
          children: (0, N.jsxs)(`div`, {
            style: { position: `relative` },
            children: [
              (0, N.jsx)(c, {
                children:
                  u &&
                  (0, N.jsxs)(o.div, {
                    initial: { opacity: 0, scale: 0.92, y: 12 },
                    animate: { opacity: 1, scale: 1, y: 0 },
                    exit: { opacity: 0, scale: 0.92, y: 12 },
                    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
                    style: {
                      position: `absolute`,
                      inset: 0,
                      zIndex: 20,
                      borderRadius: `32px`,
                      display: `flex`,
                      flexDirection: `column`,
                      alignItems: `center`,
                      justifyContent: `center`,
                      background: `rgba(13, 2, 33, 0.92)`,
                      backdropFilter: `blur(16px)`,
                      border: `1px solid rgba(52,211,153,0.45)`,
                      boxShadow: `0 0 80px rgba(52,211,153,0.25), inset 0 1px 0 rgba(52,211,153,0.1)`,
                      gap: `1rem`,
                    },
                    children: [
                      (0, N.jsx)(o.div, {
                        initial: { scale: 0 },
                        animate: { scale: 1 },
                        transition: {
                          delay: 0.1,
                          type: `spring`,
                          stiffness: 260,
                          damping: 18,
                        },
                        style: {
                          width: `64px`,
                          height: `64px`,
                          borderRadius: `50%`,
                          background: `rgba(52,211,153,0.15)`,
                          border: `2px solid rgba(52,211,153,0.7)`,
                          display: `flex`,
                          alignItems: `center`,
                          justifyContent: `center`,
                          fontSize: `1.8rem`,
                          boxShadow: `0 0 30px rgba(52,211,153,0.4)`,
                        },
                        children: `✓`,
                      }),
                      (0, N.jsx)(`p`, {
                        style: {
                          fontFamily: `Syne`,
                          fontWeight: 700,
                          fontSize: `1.35rem`,
                          color: `#34d399`,
                          letterSpacing: `-0.01em`,
                        },
                        children: `Message sent successfully!`,
                      }),
                      (0, N.jsx)(`p`, {
                        style: {
                          fontFamily: `Plus Jakarta Sans`,
                          fontSize: `0.9rem`,
                          color: `rgba(201,167,255,0.6)`,
                          fontWeight: 300,
                        },
                        children: `I'll get back to you soon.`,
                      }),
                    ],
                  }),
              }),
              (0, N.jsxs)(`form`, {
                ref: _,
                onSubmit: k,
                noValidate: !0,
                style: {
                  position: `relative`,
                  padding: `3.5rem 3rem`,
                  borderRadius: `32px`,
                  background: `rgba(13, 2, 33, 0.65)`,
                  backdropFilter: `blur(28px) saturate(1.8)`,
                  border: `1px solid rgba(108, 43, 217, 0.35)`,
                  boxShadow: `0 30px 90px rgba(0,0,0,0.6), inset 0 1px 0 rgba(201,167,255,0.08)`,
                  overflow: `hidden`,
                },
                children: [
                  (0, N.jsx)(`div`, {
                    style: {
                      position: `absolute`,
                      width: `300px`,
                      height: `300px`,
                      borderRadius: `50%`,
                      background: `radial-gradient(circle, rgba(108,43,217,0.15) 0%, transparent 70%)`,
                      pointerEvents: `none`,
                      transform: `translate(${h.x - 150}px, ${h.y - 150}px)`,
                      transition: `transform 0.15s ease-out`,
                      zIndex: 0,
                    },
                  }),
                  (0, N.jsxs)(`div`, {
                    style: { position: `relative`, zIndex: 1 },
                    children: [
                      (0, N.jsxs)(`div`, {
                        style: { marginBottom: `1.75rem` },
                        children: [
                          (0, N.jsx)(`label`, {
                            htmlFor: `name`,
                            style: {
                              display: `block`,
                              fontFamily: `Syne`,
                              fontSize: `0.78rem`,
                              fontWeight: 600,
                              color: `rgba(201,167,255,0.65)`,
                              marginBottom: `0.55rem`,
                              letterSpacing: `0.04em`,
                              textTransform: `uppercase`,
                            },
                            children: `Full Name`,
                          }),
                          (0, N.jsxs)(`div`, {
                            style: {
                              ...A,
                              borderColor: K(T, n.name),
                              boxShadow: q(T, n.name),
                            },
                            children: [
                              (0, N.jsx)(`input`, {
                                id: `name`,
                                name: `name`,
                                type: `text`,
                                autoComplete: `name`,
                                value: e.name,
                                onChange: x,
                                onFocus: () => y(`name`),
                                onBlur: () => b(`name`),
                                placeholder: `e.g. Jane Smith`,
                                style: {
                                  ...j,
                                  caretColor:
                                    T === `error` ? `#fb7185` : `#c9a7ff`,
                                },
                              }),
                              (0, N.jsx)(M, { status: T }),
                            ],
                          }),
                          (0, N.jsx)(H, { message: s.name }),
                        ],
                      }),
                      (0, N.jsxs)(`div`, {
                        style: { marginBottom: `1.75rem` },
                        children: [
                          (0, N.jsx)(`label`, {
                            htmlFor: `email`,
                            style: {
                              display: `block`,
                              fontFamily: `Syne`,
                              fontSize: `0.78rem`,
                              fontWeight: 600,
                              color: `rgba(201,167,255,0.65)`,
                              marginBottom: `0.55rem`,
                              letterSpacing: `0.04em`,
                              textTransform: `uppercase`,
                            },
                            children: `Email Address`,
                          }),
                          (0, N.jsxs)(`div`, {
                            style: {
                              ...A,
                              borderColor: K(E, n.email),
                              boxShadow: q(E, n.email),
                            },
                            children: [
                              (0, N.jsx)(`input`, {
                                id: `email`,
                                name: `email`,
                                type: `email`,
                                autoComplete: `email`,
                                value: e.email,
                                onChange: x,
                                onFocus: () => y(`email`),
                                onBlur: () => b(`email`),
                                placeholder: `name@domain.com`,
                                style: {
                                  ...j,
                                  caretColor:
                                    E === `error` ? `#fb7185` : `#c9a7ff`,
                                },
                              }),
                              (0, N.jsx)(M, { status: E }),
                            ],
                          }),
                          (0, N.jsx)(H, { message: s.email }),
                        ],
                      }),
                      (0, N.jsxs)(`div`, {
                        style: { marginBottom: `1.75rem` },
                        children: [
                          (0, N.jsx)(`label`, {
                            style: {
                              display: `block`,
                              fontFamily: `Syne`,
                              fontSize: `0.78rem`,
                              fontWeight: 600,
                              color: `rgba(201,167,255,0.65)`,
                              marginBottom: `0.85rem`,
                              letterSpacing: `0.04em`,
                              textTransform: `uppercase`,
                            },
                            children: `What's this about?`,
                          }),
                          (0, N.jsx)(`div`, {
                            style: {
                              display: `flex`,
                              flexWrap: `wrap`,
                              gap: `0.65rem`,
                            },
                            children: ne.map((n) =>
                              (0, N.jsx)(
                                `button`,
                                {
                                  type: `button`,
                                  onClick: () =>
                                    t((e) => ({ ...e, reason: n })),
                                  style: {
                                    padding: `0.6rem 1.2rem`,
                                    borderRadius: `9999px`,
                                    border: `1px solid ${
                                      e.reason === n
                                        ? `rgba(139,79,232,0.75)`
                                        : `rgba(108,43,217,0.35)`
                                    }`,
                                    background:
                                      e.reason === n
                                        ? `rgba(108,43,217,0.3)`
                                        : `rgba(108,43,217,0.08)`,
                                    color:
                                      e.reason === n
                                        ? `#f0e8ff`
                                        : `rgba(201,167,255,0.6)`,
                                    fontFamily: `Syne`,
                                    fontSize: `0.8rem`,
                                    fontWeight: 600,
                                    cursor: `pointer`,
                                    transition: `all 0.25s cubic-bezier(0.16, 1, 0.3, 1)`,
                                    boxShadow:
                                      e.reason === n
                                        ? `0 0 20px rgba(108,43,217,0.4)`
                                        : `none`,
                                    outline: `none`,
                                  },
                                  onMouseEnter: (t) => {
                                    e.reason !== n &&
                                      ((t.currentTarget.style.borderColor = `rgba(108,43,217,0.55)`),
                                      (t.currentTarget.style.background = `rgba(108,43,217,0.15)`))
                                  },
                                  onMouseLeave: (t) => {
                                    e.reason !== n &&
                                      ((t.currentTarget.style.borderColor = `rgba(108,43,217,0.35)`),
                                      (t.currentTarget.style.background = `rgba(108,43,217,0.08)`))
                                  },
                                  children: n,
                                },
                                n,
                              ),
                            ),
                          }),
                        ],
                      }),
                      (0, N.jsxs)(`div`, {
                        style: { marginBottom: `2.5rem` },
                        children: [
                          (0, N.jsx)(`label`, {
                            htmlFor: `message`,
                            style: {
                              display: `block`,
                              fontFamily: `Syne`,
                              fontSize: `0.78rem`,
                              fontWeight: 600,
                              color: `rgba(201,167,255,0.65)`,
                              marginBottom: `0.55rem`,
                              letterSpacing: `0.04em`,
                              textTransform: `uppercase`,
                            },
                            children: `Message`,
                          }),
                          (0, N.jsxs)(`div`, {
                            style: {
                              ...A,
                              borderColor: K(D, n.message),
                              boxShadow: q(D, n.message),
                            },
                            children: [
                              (0, N.jsx)(`textarea`, {
                                id: `message`,
                                name: `message`,
                                value: e.message,
                                onChange: x,
                                onFocus: () => y(`message`),
                                onBlur: () => b(`message`),
                                rows: 5,
                                placeholder: `Tell me what's on your mind…`,
                                style: {
                                  ...j,
                                  padding: `14px 44px 14px 16px`,
                                  resize: `vertical`,
                                  minHeight: `130px`,
                                  caretColor:
                                    D === `error` ? `#fb7185` : `#c9a7ff`,
                                },
                              }),
                              D !== `idle` &&
                                (0, N.jsx)(`div`, {
                                  style: {
                                    position: `absolute`,
                                    right: `14px`,
                                    top: `16px`,
                                    pointerEvents: `none`,
                                    display: `flex`,
                                    alignItems: `center`,
                                  },
                                  children: (0, N.jsx)(c, {
                                    mode: `wait`,
                                    children:
                                      D === `valid`
                                        ? (0, N.jsx)(
                                            o.span,
                                            {
                                              initial: {
                                                opacity: 0,
                                                scale: 0.5,
                                              },
                                              animate: { opacity: 1, scale: 1 },
                                              exit: { opacity: 0, scale: 0.5 },
                                              transition: { duration: 0.18 },
                                              children: (0, N.jsx)(U, {}),
                                            },
                                            `check`,
                                          )
                                        : (0, N.jsx)(
                                            o.span,
                                            {
                                              initial: {
                                                opacity: 0,
                                                scale: 0.5,
                                              },
                                              animate: { opacity: 1, scale: 1 },
                                              exit: { opacity: 0, scale: 0.5 },
                                              transition: { duration: 0.18 },
                                              children: (0, N.jsx)(W, {}),
                                            },
                                            `warn`,
                                          ),
                                  }),
                                }),
                            ],
                          }),
                          (0, N.jsxs)(`div`, {
                            style: {
                              display: `flex`,
                              justifyContent: `space-between`,
                              alignItems: `center`,
                              marginTop: `0.4rem`,
                            },
                            children: [
                              (0, N.jsx)(H, { message: s.message }),
                              (0, N.jsxs)(`span`, {
                                style: {
                                  fontFamily: `Plus Jakarta Sans`,
                                  fontSize: `0.75rem`,
                                  fontWeight: 500,
                                  marginLeft: `auto`,
                                  color: O
                                    ? `rgba(52,211,153,0.85)`
                                    : e.message.length > 0
                                      ? `rgba(251,113,133,0.8)`
                                      : `rgba(201,167,255,0.35)`,
                                  transition: `color 0.2s`,
                                },
                                children: [
                                  e.message.length,
                                  `/`,
                                  I,
                                  ` characters minimum`,
                                  e.message.length > L &&
                                    (0, N.jsxs)(`span`, {
                                      style: { color: `#fb7185` },
                                      children: [` `, `(max `, L, `)`],
                                    }),
                                ],
                              }),
                            ],
                          }),
                        ],
                      }),
                      (0, N.jsx)(`div`, {
                        style: { textAlign: `center` },
                        children: (0, N.jsx)(`button`, {
                          type: `submit`,
                          disabled: w,
                          style: {
                            position: `relative`,
                            padding: `1rem 3rem`,
                            borderRadius: `9999px`,
                            border: `none`,
                            background: `linear-gradient(135deg, #6c2bd9 0%, #8b4fe8 100%)`,
                            color: `#ffffff`,
                            fontFamily: `Syne`,
                            fontSize: `1rem`,
                            fontWeight: 700,
                            cursor: w ? `not-allowed` : `pointer`,
                            transition: `all 0.3s cubic-bezier(0.16, 1, 0.3, 1)`,
                            boxShadow: w
                              ? `none`
                              : `0 0 40px rgba(108,43,217,0.6)`,
                            outline: `none`,
                            overflow: `hidden`,
                            opacity: w ? 0.5 : 1,
                          },
                          onMouseEnter: (e) => {
                            w ||
                              ((e.currentTarget.style.transform = `translateY(-2px)`),
                              (e.currentTarget.style.boxShadow = `0 0 60px rgba(108,43,217,0.9)`))
                          },
                          onMouseLeave: (e) => {
                            w ||
                              ((e.currentTarget.style.transform = `translateY(0)`),
                              (e.currentTarget.style.boxShadow = `0 0 40px rgba(108,43,217,0.6)`))
                          },
                          children: p
                            ? (0, N.jsxs)(`span`, {
                                style: {
                                  display: `inline-flex`,
                                  alignItems: `center`,
                                  gap: `0.75rem`,
                                },
                                children: [
                                  (0, N.jsx)(`span`, {
                                    style: {
                                      display: `inline-block`,
                                      width: `16px`,
                                      height: `16px`,
                                      border: `2px solid rgba(255,255,255,0.3)`,
                                      borderTopColor: `#ffffff`,
                                      borderRadius: `50%`,
                                      animation: `spin 0.6s linear infinite`,
                                    },
                                  }),
                                  `Launching...`,
                                ],
                              })
                            : (0, N.jsxs)(N.Fragment, {
                                children: [
                                  `Send Message`,
                                  (0, N.jsx)(`span`, {
                                    style: {
                                      marginLeft: `0.5rem`,
                                      display: `inline-block`,
                                      transform: `rotate(-45deg)`,
                                    },
                                    children: `→`,
                                  }),
                                ],
                              }),
                        }),
                      }),
                    ],
                  }),
                ],
              }),
              u &&
                (0, N.jsx)(`div`, {
                  style: {
                    position: `absolute`,
                    top: `50%`,
                    left: `50%`,
                    transform: `translate(-50%, -50%)`,
                    pointerEvents: `none`,
                    zIndex: 10,
                  },
                  children: [...Array(12)].map((e, t) =>
                    (0, N.jsx)(
                      `div`,
                      {
                        style: {
                          position: `absolute`,
                          width: `8px`,
                          height: `8px`,
                          borderRadius: `50%`,
                          background: `rgba(52,211,153,0.9)`,
                          boxShadow: `0 0 10px rgba(52,211,153,0.8)`,
                          animation: `particle-burst-${t} 1.2s ease-out forwards`,
                        },
                      },
                      t,
                    ),
                  ),
                }),
            ],
          }),
        }),
        (0, N.jsx)(V, {
          direction: `up`,
          delay: 0.45,
          children: (0, N.jsx)(`div`, {
            style: {
              display: `flex`,
              gap: `1.25rem`,
              justifyContent: `center`,
              flexWrap: `wrap`,
              marginTop: `3rem`,
              marginBottom: `3rem`,
            },
            children: (0, N.jsx)(`a`, {
              href: `mailto:kaled.amr0210@gmail.com`,
              style: {
                fontFamily: `Syne`,
                fontSize: `0.9rem`,
                fontWeight: 600,
                color: `rgba(201,167,255,0.7)`,
                textDecoration: `none`,
                transition: `color 0.25s`,
              },
              onMouseEnter: (e) => (e.currentTarget.style.color = `#c9a7ff`),
              onMouseLeave: (e) =>
                (e.currentTarget.style.color = `rgba(201,167,255,0.7)`),
              children: `kaled.amr0210@gmail.com`,
            }),
          }),
        }),
        (0, N.jsx)(V, {
          direction: `up`,
          delay: 0.5,
          children: (0, N.jsx)(`div`, {
            style: {
              display: `flex`,
              justifyContent: `center`,
              gap: `1.35rem`,
              marginBottom: `5rem`,
            },
            children: F.map((e) =>
              (0, N.jsx)(
                `a`,
                {
                  href: e.href,
                  "aria-label": e.label,
                  style: {
                    width: `48px`,
                    height: `48px`,
                    borderRadius: `50%`,
                    border: `1px solid rgba(108,43,217,0.38)`,
                    display: `flex`,
                    alignItems: `center`,
                    justifyContent: `center`,
                    color: `rgba(201,167,255,0.6)`,
                    textDecoration: `none`,
                    background: `rgba(108,43,217,0.08)`,
                    transition: `all 0.28s cubic-bezier(0.16, 1, 0.3, 1)`,
                  },
                  onMouseEnter: (e) => {
                    ;(e.currentTarget.style.borderColor = `rgba(139,79,232,0.85)`),
                      (e.currentTarget.style.color = `#f0e8ff`),
                      (e.currentTarget.style.boxShadow = `0 0 25px rgba(108,43,217,0.7)`),
                      (e.currentTarget.style.background = `rgba(108,43,217,0.25)`)
                  },
                  onMouseLeave: (e) => {
                    ;(e.currentTarget.style.borderColor = `rgba(108,43,217,0.38)`),
                      (e.currentTarget.style.color = `rgba(201,167,255,0.6)`),
                      (e.currentTarget.style.boxShadow = `none`),
                      (e.currentTarget.style.background = `rgba(108,43,217,0.08)`)
                  },
                  children: e.svg,
                },
                e.label,
              ),
            ),
          }),
        }),
        (0, N.jsx)(V, {
          direction: `up`,
          delay: 0.55,
          children: (0, N.jsxs)(`div`, {
            style: {
              borderTop: `1px solid rgba(108,43,217,0.18)`,
              paddingTop: `2.5rem`,
              fontFamily: `Plus Jakarta Sans`,
              fontSize: `0.825rem`,
              color: `rgba(201,167,255,0.35)`,
            },
            children: [
              (0, N.jsxs)(`div`, {
                style: {
                  display: `flex`,
                  alignItems: `center`,
                  justifyContent: `center`,
                  gap: `0.75rem`,
                  marginBottom: `1.5rem`,
                },
                children: [
                  (0, N.jsx)(P, { size: 32 }),
                  (0, N.jsx)(`div`, {
                    style: {
                      fontFamily: `Syne`,
                      fontSize: `1.1rem`,
                      fontWeight: 700,
                      color: `#f0e8ff`,
                      letterSpacing: `-0.01em`,
                    },
                    children: `Khaled Amr`,
                  }),
                ],
              }),
              (0, N.jsxs)(`div`, {
                style: {
                  display: `flex`,
                  justifyContent: `space-between`,
                  alignItems: `center`,
                  flexWrap: `wrap`,
                  gap: `0.875rem`,
                },
                children: [
                  (0, N.jsx)(`span`, {
                    children: `© 2026 Khaled Amr · Web Developer @ WaveDev. All rights reserved.`,
                  }),
                  (0, N.jsx)(`span`, {
                    children: `Crafted with precision & intention`,
                  }),
                ],
              }),
            ],
          }),
        }),
      ],
    }),
  })
}
function ae() {
  let [e, n] = (0, d.useState)(!1),
    [r, i] = (0, d.useState)(`hero`),
    [s, l] = (0, d.useState)(!1),
    { scrollYProgress: u } = t(),
    f = a(u, { stiffness: 300, damping: 40, mass: 0.5 })
  ;(0, d.useEffect)(() => {
    let e = () => {
      n(window.scrollY > 50)
      let e = [
          `hero`,
          `about`,
          `projects`,
          `certificates`,
          `process`,
          `contact`,
        ],
        t = window.scrollY + window.innerHeight * 0.35
      for (let n = e.length - 1; n >= 0; n--) {
        let r = document.getElementById(e[n])
        if (r && t >= r.offsetTop) {
          i(e[n])
          break
        }
      }
    }
    return (
      window.addEventListener(`scroll`, e, { passive: !0 }),
      e(),
      () => window.removeEventListener(`scroll`, e)
    )
  }, [])
  let p = [
    { id: `about`, label: `About`, num: `01` },
    { id: `projects`, label: `Projects`, num: `02` },
    { id: `certificates`, label: `Certs`, num: `03` },
    { id: `process`, label: `Process`, num: `04` },
    { id: `contact`, label: `Contact`, num: `05` },
  ]
  return (0, N.jsxs)(N.Fragment, {
    children: [
      (0, N.jsxs)(o.nav, {
        initial: { opacity: 0, y: -28, x: `-50%` },
        animate: { opacity: 1, y: 0, x: `-50%` },
        transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
        style: {
          position: `fixed`,
          top: e ? `12px` : `20px`,
          left: `50%`,
          zIndex: 100,
          transition: `top 0.4s cubic-bezier(0.16,1,0.3,1)`,
        },
        className: `relative flex items-center gap-2 md:gap-3 py-2 pl-2 pr-2 rounded-full overflow-hidden w-max max-w-[95%] sm:max-w-none`,
        children: [
          (0, N.jsx)(`div`, {
            className: `absolute inset-0 rounded-full`,
            style: {
              background: e ? `rgba(6, 1, 18, 0.88)` : `rgba(13, 7, 34, 0.72)`,
              backdropFilter: `blur(22px) saturate(1.9)`,
              boxShadow: e
                ? `0 0 0 1px rgba(139,79,232,0.38), 0 0 50px rgba(108,43,217,0.2), 0 8px 36px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.06)`
                : `0 0 0 1px rgba(108,43,217,0.24), 0 0 22px rgba(108,43,217,0.1), 0 4px 24px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.04)`,
              transition: `all 0.45s cubic-bezier(0.16,1,0.3,1)`,
            },
          }),
          (0, N.jsx)(o.div, {
            style: {
              position: `absolute`,
              bottom: 0,
              left: 0,
              right: 0,
              height: `2px`,
              scaleX: f,
              transformOrigin: `left`,
              background: `linear-gradient(90deg, #6c2bd9 0%, #a855f7 50%, #06b6d4 100%)`,
              boxShadow: `0 0 10px rgba(168,85,247,0.85)`,
              borderRadius: `0 0 9999px 9999px`,
            },
          }),
          (0, N.jsxs)(`a`, {
            href: `#hero`,
            "aria-label": `Home`,
            className: `relative flex items-center justify-center p-1.5 rounded-full shrink-0 z-10 group`,
            style: {
              border: `1px solid rgba(108,43,217,0.38)`,
              background: `rgba(108,43,217,0.12)`,
              boxShadow: `0 0 18px rgba(108,43,217,0.18)`,
              transition: `all 0.3s cubic-bezier(0.16,1,0.3,1)`,
            },
            onMouseEnter: (e) => {
              ;(e.currentTarget.style.boxShadow = `0 0 32px rgba(139,79,232,0.55)`),
                (e.currentTarget.style.borderColor = `rgba(139,79,232,0.7)`),
                (e.currentTarget.style.background = `rgba(108,43,217,0.22)`)
            },
            onMouseLeave: (e) => {
              ;(e.currentTarget.style.boxShadow = `0 0 18px rgba(108,43,217,0.18)`),
                (e.currentTarget.style.borderColor = `rgba(108,43,217,0.38)`),
                (e.currentTarget.style.background = `rgba(108,43,217,0.12)`)
            },
            children: [
              (0, N.jsx)(P, { size: e ? 24 : 28 }),
              (0, N.jsx)(`span`, {
                className: `absolute inset-0 rounded-full border border-dashed border-purple-400/20 group-hover:border-purple-400/40`,
                style: {
                  transition: `transform 1.3s ease-in-out, border-color 0.3s`,
                  transform: `rotate(0deg)`,
                },
                onMouseEnter: (e) =>
                  (e.currentTarget.style.transform = `rotate(180deg)`),
                onMouseLeave: (e) =>
                  (e.currentTarget.style.transform = `rotate(0deg)`),
              }),
            ],
          }),
          (0, N.jsx)(`div`, {
            className: `w-px h-5 shrink-0 z-10`,
            style: {
              background: `linear-gradient(to bottom, transparent, rgba(108,43,217,0.45), transparent)`,
            },
          }),
          (0, N.jsx)(`div`, {
            className: `hidden md:flex items-center gap-0 z-10`,
            children: p.map((e) => {
              let t = r === e.id
              return (0, N.jsxs)(
                `a`,
                {
                  href: `#${e.id}`,
                  className: `relative px-3 py-1.5 rounded-full text-xs font-medium tracking-wide transition-colors duration-250`,
                  style: { color: t ? `#f0e8ff` : `rgba(201,167,255,0.5)` },
                  onMouseEnter: (e) => {
                    t || (e.currentTarget.style.color = `#c9a7ff`)
                  },
                  onMouseLeave: (e) => {
                    t || (e.currentTarget.style.color = `rgba(201,167,255,0.5)`)
                  },
                  children: [
                    t &&
                      (0, N.jsx)(o.span, {
                        layoutId: `nav-active-pill`,
                        className: `absolute inset-0 rounded-full`,
                        style: {
                          background: `rgba(108,43,217,0.24)`,
                          border: `1px solid rgba(139,79,232,0.52)`,
                          boxShadow: `0 0 22px rgba(108,43,217,0.45), inset 0 1px 0 rgba(255,255,255,0.07)`,
                        },
                        transition: {
                          type: `spring`,
                          stiffness: 400,
                          damping: 34,
                        },
                      }),
                    (0, N.jsxs)(`span`, {
                      className: `relative z-10 flex items-center gap-1.5`,
                      children: [
                        (0, N.jsx)(`span`, {
                          style: {
                            fontFamily: `'Plus Jakarta Sans', monospace`,
                            fontSize: `0.58rem`,
                            fontWeight: 500,
                            color: t
                              ? `rgba(168,85,247,0.9)`
                              : `rgba(108,43,217,0.48)`,
                            letterSpacing: `0.04em`,
                            transition: `color 0.3s`,
                          },
                          children: e.num,
                        }),
                        e.label,
                      ],
                    }),
                  ],
                },
                e.id,
              )
            }),
          }),
          (0, N.jsxs)(`div`, {
            className: `flex items-center gap-2 z-10`,
            children: [
              (0, N.jsxs)(`a`, {
                href: `#contact`,
                className: `hidden sm:inline-flex items-center gap-1.5 shrink-0 relative overflow-hidden rounded-full px-5 py-2 text-white font-semibold text-xs tracking-wide`,
                style: {
                  background: `linear-gradient(135deg, #5b21b6 0%, #7c3aed 45%, #a855f7 100%)`,
                  boxShadow: `0 0 22px rgba(124,58,237,0.55), inset 0 1px 0 rgba(255,255,255,0.18)`,
                  transition: `box-shadow 0.3s, transform 0.2s`,
                },
                onMouseEnter: (e) => {
                  ;(e.currentTarget.style.boxShadow = `0 0 38px rgba(139,79,232,0.8), inset 0 1px 0 rgba(255,255,255,0.22)`),
                    (e.currentTarget.style.transform = `translateY(-1px) scale(1.04)`)
                },
                onMouseLeave: (e) => {
                  ;(e.currentTarget.style.boxShadow = `0 0 22px rgba(124,58,237,0.55), inset 0 1px 0 rgba(255,255,255,0.18)`),
                    (e.currentTarget.style.transform = `translateY(0) scale(1)`)
                },
                children: [
                  (0, N.jsx)(`span`, { className: `hire-me-shimmer` }),
                  (0, N.jsx)(`span`, {
                    className: `relative z-10`,
                    children: `Hire Me`,
                  }),
                  (0, N.jsx)(`svg`, {
                    className: `relative z-10`,
                    width: `9`,
                    height: `9`,
                    viewBox: `0 0 12 12`,
                    fill: `none`,
                    children: (0, N.jsx)(`path`, {
                      d: `M2.5 9.5L9.5 2.5M9.5 2.5H4M9.5 2.5V8`,
                      stroke: `currentColor`,
                      strokeWidth: `1.8`,
                      strokeLinecap: `round`,
                      strokeLinejoin: `round`,
                    }),
                  }),
                ],
              }),
              (0, N.jsx)(`button`, {
                onClick: () => l(!s),
                "aria-label": `Toggle Navigation`,
                className: `flex md:hidden p-2 rounded-full cursor-pointer shrink-0`,
                style: {
                  background: s
                    ? `rgba(139,79,232,0.28)`
                    : `rgba(108,43,217,0.1)`,
                  border: `1px solid ${
                    s ? `rgba(139,79,232,0.55)` : `rgba(108,43,217,0.3)`
                  }`,
                  color: s ? `#f0e8ff` : `#c9a7ff`,
                  transition: `all 0.25s cubic-bezier(0.16,1,0.3,1)`,
                },
                children: (0, N.jsx)(o.svg, {
                  width: `16`,
                  height: `16`,
                  viewBox: `0 0 24 24`,
                  fill: `none`,
                  stroke: `currentColor`,
                  strokeWidth: `2.2`,
                  strokeLinecap: `round`,
                  animate: { rotate: s ? 90 : 0 },
                  transition: { duration: 0.28, ease: [0.16, 1, 0.3, 1] },
                  children: s
                    ? (0, N.jsx)(`path`, { d: `M18 6L6 18M6 6l12 12` })
                    : (0, N.jsxs)(N.Fragment, {
                        children: [
                          (0, N.jsx)(`line`, {
                            x1: `4`,
                            y1: `6`,
                            x2: `20`,
                            y2: `6`,
                          }),
                          (0, N.jsx)(`line`, {
                            x1: `4`,
                            y1: `12`,
                            x2: `14`,
                            y2: `12`,
                          }),
                          (0, N.jsx)(`line`, {
                            x1: `4`,
                            y1: `18`,
                            x2: `20`,
                            y2: `18`,
                          }),
                        ],
                      }),
                }),
              }),
            ],
          }),
        ],
      }),
      (0, N.jsx)(c, {
        children:
          s &&
          (0, N.jsxs)(o.div, {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            exit: { opacity: 0 },
            transition: { duration: 0.28 },
            className: `fixed inset-0 z-40 flex flex-col justify-center items-center`,
            style: {
              background: `rgba(4, 1, 13, 0.97)`,
              backdropFilter: `blur(28px)`,
            },
            children: [
              (0, N.jsx)(`div`, {
                className: `absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none`,
                style: {
                  background: `radial-gradient(circle, rgba(108,43,217,0.18) 0%, rgba(139,79,232,0.06) 50%, transparent 70%)`,
                  filter: `blur(50px)`,
                },
              }),
              (0, N.jsx)(o.div, {
                initial: { scale: 0.75, opacity: 0 },
                animate: { scale: 1, opacity: 1 },
                transition: {
                  delay: 0.04,
                  duration: 0.55,
                  ease: [0.16, 1, 0.3, 1],
                },
                className: `mb-10 relative z-10`,
                children: (0, N.jsx)(P, { size: 54 }),
              }),
              (0, N.jsx)(`div`, {
                className: `flex flex-col items-stretch gap-2 relative z-10 w-full max-w-[280px] px-4`,
                children: p.map((e, t) => {
                  let n = r === e.id
                  return (0, N.jsxs)(
                    o.a,
                    {
                      href: `#${e.id}`,
                      onClick: () => l(!1),
                      initial: { opacity: 0, y: 18, filter: `blur(6px)` },
                      animate: { opacity: 1, y: 0, filter: `blur(0px)` },
                      transition: {
                        delay: 0.07 + t * 0.055,
                        duration: 0.5,
                        ease: [0.16, 1, 0.3, 1],
                      },
                      className: `flex items-center justify-between px-5 py-3.5 rounded-2xl`,
                      style: {
                        background: n
                          ? `rgba(108,43,217,0.24)`
                          : `rgba(108,43,217,0.07)`,
                        border: `1px solid ${
                          n ? `rgba(139,79,232,0.5)` : `rgba(108,43,217,0.2)`
                        }`,
                        boxShadow: n
                          ? `0 0 28px rgba(108,43,217,0.28)`
                          : `none`,
                        transition: `all 0.25s cubic-bezier(0.16,1,0.3,1)`,
                      },
                      children: [
                        (0, N.jsx)(`span`, {
                          style: {
                            fontFamily: `Syne`,
                            fontWeight: 600,
                            fontSize: `1.05rem`,
                            color: n ? `#f0e8ff` : `rgba(201,167,255,0.6)`,
                          },
                          children: e.label,
                        }),
                        (0, N.jsx)(`span`, {
                          style: {
                            fontFamily: `monospace`,
                            fontSize: `0.62rem`,
                            color: n
                              ? `rgba(168,85,247,0.85)`
                              : `rgba(108,43,217,0.45)`,
                            letterSpacing: `0.1em`,
                          },
                          children: e.num,
                        }),
                      ],
                    },
                    e.id,
                  )
                }),
              }),
              (0, N.jsxs)(o.a, {
                href: `#contact`,
                onClick: () => l(!1),
                initial: { opacity: 0, y: 18 },
                animate: { opacity: 1, y: 0 },
                transition: {
                  delay: 0.07 + p.length * 0.055,
                  duration: 0.5,
                  ease: [0.16, 1, 0.3, 1],
                },
                className: `mt-8 relative overflow-hidden px-10 py-3.5 rounded-full text-white font-semibold text-sm tracking-wide z-10 flex items-center gap-2`,
                style: {
                  background: `linear-gradient(135deg, #5b21b6 0%, #7c3aed 45%, #a855f7 100%)`,
                  boxShadow: `0 0 36px rgba(108,43,217,0.6)`,
                },
                children: [
                  (0, N.jsx)(`span`, { className: `hire-me-shimmer` }),
                  (0, N.jsx)(`span`, {
                    className: `relative z-10`,
                    children: `Hire Me`,
                  }),
                  (0, N.jsx)(`svg`, {
                    className: `relative z-10`,
                    width: `10`,
                    height: `10`,
                    viewBox: `0 0 12 12`,
                    fill: `none`,
                    children: (0, N.jsx)(`path`, {
                      d: `M2.5 9.5L9.5 2.5M9.5 2.5H4M9.5 2.5V8`,
                      stroke: `currentColor`,
                      strokeWidth: `1.8`,
                      strokeLinecap: `round`,
                      strokeLinejoin: `round`,
                    }),
                  }),
                ],
              }),
            ],
          }),
      }),
    ],
  })
}
function oe() {
  let e = (0, d.useRef)(null),
    [n, i] = (0, d.useState)({ x: 0, y: 0 }),
    c = l(),
    { scrollYProgress: u } = t({
      target: e,
      offset: [`start start`, `end start`],
    }),
    f = r(0),
    p = r(0),
    m = { stiffness: 150, damping: 40, mass: 0.3 },
    h = a(f, m),
    g = a(p, m)
  ;(0, d.useEffect)(() => {
    if (c) return
    let t = !1,
      n = (n) => {
        t ||=
          (requestAnimationFrame(() => {
            if (!e.current) return
            let r = e.current.getBoundingClientRect()
            i({ x: n.clientX - r.left, y: n.clientY - r.top })
            let a = (n.clientX / window.innerWidth - 0.5) * 2,
              o = (n.clientY / window.innerHeight - 0.5) * 2
            f.set(a * 40), p.set(o * 40), (t = !1)
          }),
          !0)
      }
    return (
      window.addEventListener(`mousemove`, n, { passive: !0 }),
      () => window.removeEventListener(`mousemove`, n)
    )
  }, [f, p, c])
  let _ = s(u, [0, 0.5, 1], [1, 1.15, 1.3]),
    v = s(u, [0, 0.3, 0.7], [0.9, 0.5, 0]),
    y = c ? 0 : s(g, [-40, 40], [8, -8]),
    b = c ? 0 : s(h, [-40, 40], [-8, 8])
  return (0, N.jsx)(`div`, {
    ref: e,
    className: `absolute inset-0 overflow-hidden pointer-events-none z-0`,
    children: (0, N.jsxs)(o.div, {
      style: {
        position: `absolute`,
        top: `50%`,
        left: `50%`,
        x: `-50%`,
        y: `-50%`,
        display: `flex`,
        alignItems: `center`,
        justifyContent: `center`,
        width: `100%`,
        height: `100%`,
        scale: _,
        opacity: v,
        rotateX: y,
        rotateY: b,
        transformStyle: `preserve-3d`,
        perspective: 1400,
        willChange: `transform, opacity`,
      },
      children: [
        (0, N.jsxs)(o.svg, {
          className: `absolute`,
          style: {
            width: `clamp(500px, 55vw, 850px)`,
            height: `clamp(500px, 55vw, 850px)`,
            willChange: `transform`,
          },
          animate: c ? {} : { rotate: [0, 360] },
          transition: {
            rotate: { duration: 25, repeat: 1 / 0, ease: `linear` },
          },
          children: [
            (0, N.jsx)(`circle`, {
              cx: `50%`,
              cy: `50%`,
              r: `47%`,
              fill: `none`,
              stroke: `url(#hudGradient1)`,
              strokeWidth: `1.5`,
              strokeDasharray: `8 12`,
              opacity: `0.4`,
            }),
            [0, 90, 180, 270].map((e) =>
              (0, N.jsx)(
                `line`,
                {
                  x1: `50%`,
                  y1: `3%`,
                  x2: `50%`,
                  y2: `8%`,
                  stroke: `rgba(6, 182, 212, 0.6)`,
                  strokeWidth: `2`,
                  transform: `rotate(${e} 50% 50%)`,
                },
                e,
              ),
            ),
            (0, N.jsx)(`defs`, {
              children: (0, N.jsxs)(`linearGradient`, {
                id: `hudGradient1`,
                x1: `0%`,
                y1: `0%`,
                x2: `100%`,
                y2: `100%`,
                children: [
                  (0, N.jsx)(`stop`, {
                    offset: `0%`,
                    stopColor: `rgba(6, 182, 212, 0.7)`,
                  }),
                  (0, N.jsx)(`stop`, {
                    offset: `50%`,
                    stopColor: `rgba(217, 70, 239, 0.6)`,
                  }),
                  (0, N.jsx)(`stop`, {
                    offset: `100%`,
                    stopColor: `rgba(6, 182, 212, 0.7)`,
                  }),
                ],
              }),
            }),
          ],
        }),
        (0, N.jsxs)(o.svg, {
          className: `absolute`,
          style: {
            width: `clamp(400px, 45vw, 700px)`,
            height: `clamp(400px, 45vw, 700px)`,
            willChange: `transform`,
          },
          animate: c ? {} : { rotate: [0, -360] },
          transition: {
            rotate: { duration: 30, repeat: 1 / 0, ease: `linear` },
          },
          children: [
            (0, N.jsx)(`circle`, {
              cx: `50%`,
              cy: `50%`,
              r: `47%`,
              fill: `none`,
              stroke: `url(#hudGradient2)`,
              strokeWidth: `1`,
              strokeDasharray: `4 8`,
              opacity: `0.3`,
            }),
            [45, 135, 225, 315].map((e) =>
              (0, N.jsx)(
                `circle`,
                {
                  cx: `50%`,
                  cy: `5%`,
                  r: `2`,
                  fill: `rgba(217, 70, 239, 0.8)`,
                  transform: `rotate(${e} 50% 50%)`,
                },
                e,
              ),
            ),
            (0, N.jsx)(`defs`, {
              children: (0, N.jsxs)(`linearGradient`, {
                id: `hudGradient2`,
                x1: `0%`,
                y1: `0%`,
                x2: `0%`,
                y2: `100%`,
                children: [
                  (0, N.jsx)(`stop`, {
                    offset: `0%`,
                    stopColor: `rgba(217, 70, 239, 0.6)`,
                  }),
                  (0, N.jsx)(`stop`, {
                    offset: `50%`,
                    stopColor: `rgba(139, 92, 246, 0.5)`,
                  }),
                  (0, N.jsx)(`stop`, {
                    offset: `100%`,
                    stopColor: `rgba(217, 70, 239, 0.6)`,
                  }),
                ],
              }),
            }),
          ],
        }),
        (0, N.jsx)(`div`, {
          className: `absolute top-[5%] left-1/2 -translate-x-1/2 text-cyan-400 text-[10px] font-mono tracking-wider opacity-50`,
          children: `K-01 // FRONTEND PROTOCOL`,
        }),
        (0, N.jsx)(`div`, {
          className: `absolute bottom-[12%] left-1/2 -translate-x-1/2 text-fuchsia-400 text-[10px] font-mono tracking-wider opacity-50`,
          children: `HOLOGRAPHIC INTERFACE`,
        }),
        (0, N.jsxs)(`svg`, {
          className: `absolute`,
          style: {
            width: `clamp(350px, 40vw, 600px)`,
            height: `clamp(350px, 40vw, 600px)`,
          },
          viewBox: `0 0 200 200`,
          fill: `none`,
          xmlns: `http://www.w3.org/2000/svg`,
          children: [
            (0, N.jsxs)(`defs`, {
              children: [
                (0, N.jsx)(`pattern`, {
                  id: `cyberGrid`,
                  x: `0`,
                  y: `0`,
                  width: `20`,
                  height: `20`,
                  patternUnits: `userSpaceOnUse`,
                  children: (0, N.jsx)(`path`, {
                    d: `M 20 0 L 0 0 0 20`,
                    fill: `none`,
                    stroke: `rgba(139, 92, 246, 0.15)`,
                    strokeWidth: `0.5`,
                  }),
                }),
                (0, N.jsxs)(`linearGradient`, {
                  id: `kGradient`,
                  x1: `0%`,
                  y1: `0%`,
                  x2: `100%`,
                  y2: `100%`,
                  children: [
                    (0, N.jsx)(`stop`, { offset: `0%`, stopColor: `#4c1d95` }),
                    (0, N.jsx)(`stop`, { offset: `40%`, stopColor: `#6c2bd9` }),
                    (0, N.jsx)(`stop`, { offset: `70%`, stopColor: `#d946ef` }),
                    (0, N.jsx)(`stop`, {
                      offset: `100%`,
                      stopColor: `#06b6d4`,
                    }),
                  ],
                }),
                (0, N.jsxs)(`filter`, {
                  id: `glow`,
                  children: [
                    (0, N.jsx)(`feGaussianBlur`, {
                      stdDeviation: `4`,
                      result: `coloredBlur`,
                    }),
                    (0, N.jsxs)(`feMerge`, {
                      children: [
                        (0, N.jsx)(`feMergeNode`, { in: `coloredBlur` }),
                        (0, N.jsx)(`feMergeNode`, { in: `SourceGraphic` }),
                      ],
                    }),
                  ],
                }),
                (0, N.jsxs)(`radialGradient`, {
                  id: `spotlight`,
                  children: [
                    (0, N.jsx)(`stop`, {
                      offset: `0%`,
                      stopColor: `white`,
                      stopOpacity: `1`,
                    }),
                    (0, N.jsx)(`stop`, {
                      offset: `50%`,
                      stopColor: `white`,
                      stopOpacity: `0.6`,
                    }),
                    (0, N.jsx)(`stop`, {
                      offset: `100%`,
                      stopColor: `white`,
                      stopOpacity: `0.2`,
                    }),
                  ],
                }),
              ],
            }),
            (0, N.jsx)(o.path, {
              d: `M 60 40 L 60 160 M 60 100 L 140 40 M 60 100 L 140 160`,
              stroke: `url(#kGradient)`,
              strokeWidth: `8`,
              strokeLinecap: `round`,
              strokeLinejoin: `round`,
              fill: `none`,
              filter: `url(#glow)`,
              initial: { pathLength: 0, opacity: 0 },
              animate: { pathLength: 1, opacity: 1 },
              transition: {
                pathLength: { duration: 2, ease: `easeInOut` },
                opacity: { duration: 0.5 },
              },
            }),
            (0, N.jsx)(`path`, {
              d: `M 60 40 L 60 160 M 60 100 L 140 40 M 60 100 L 140 160`,
              stroke: `url(#cyberGrid)`,
              strokeWidth: `6`,
              strokeLinecap: `round`,
              strokeLinejoin: `round`,
              fill: `none`,
              opacity: `0.4`,
            }),
            (0, N.jsx)(o.path, {
              d: `M 60 40 L 60 160 M 60 100 L 140 40 M 60 100 L 140 160`,
              stroke: `rgba(6, 182, 212, 0.4)`,
              strokeWidth: `8`,
              strokeLinecap: `round`,
              strokeLinejoin: `round`,
              fill: `none`,
              style: { transform: `translate(-2px, -2px)` },
              animate: c ? {} : { opacity: [0.4, 0.6, 0.4] },
              transition: { duration: 2.5, repeat: 1 / 0, ease: `easeInOut` },
            }),
            (0, N.jsx)(o.path, {
              d: `M 60 40 L 60 160 M 60 100 L 140 40 M 60 100 L 140 160`,
              stroke: `rgba(217, 70, 239, 0.4)`,
              strokeWidth: `8`,
              strokeLinecap: `round`,
              strokeLinejoin: `round`,
              fill: `none`,
              style: { transform: `translate(2px, 2px)` },
              animate: c ? {} : { opacity: [0.4, 0.6, 0.4] },
              transition: {
                duration: 2.5,
                repeat: 1 / 0,
                ease: `easeInOut`,
                delay: 0.3,
              },
            }),
            (0, N.jsx)(o.circle, {
              cx: n.x || 100,
              cy: n.y || 100,
              r: `120`,
              fill: `url(#spotlight)`,
              opacity: `0`,
              animate: c ? {} : { opacity: [0, 0.15, 0] },
              transition: { duration: 1.5, repeat: 1 / 0, ease: `easeInOut` },
              style: { mixBlendMode: `screen` },
            }),
          ],
        }),
        (0, N.jsx)(o.div, {
          className: `absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none`,
          style: {
            width: `clamp(400px, 50vw, 750px)`,
            height: `clamp(400px, 50vw, 750px)`,
            background: `radial-gradient(circle, rgba(108, 43, 217, 0.3) 0%, rgba(139, 79, 232, 0.15) 30%, transparent 70%)`,
            filter: `blur(70px)`,
            willChange: `transform, opacity`,
          },
          animate: c ? {} : { scale: [1, 1.2, 1], opacity: [0.4, 0.6, 0.4] },
          transition: { duration: 5, repeat: 1 / 0, ease: `easeInOut` },
        }),
        (0, N.jsx)(o.div, {
          className: `absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none`,
          style: {
            width: `clamp(300px, 40vw, 600px)`,
            height: `clamp(300px, 40vw, 600px)`,
            background: `radial-gradient(circle, rgba(6, 182, 212, 0.25) 0%, rgba(217, 70, 239, 0.2) 40%, transparent 70%)`,
            filter: `blur(60px)`,
            willChange: `transform, opacity`,
            mixBlendMode: `screen`,
          },
          animate: c
            ? {}
            : { scale: [1.1, 1.35, 1.1], opacity: [0.3, 0.5, 0.3] },
          transition: {
            duration: 6,
            repeat: 1 / 0,
            ease: `easeInOut`,
            delay: 0.8,
          },
        }),
      ],
    }),
  })
}
var se = (0, d.memo)(oe),
  ce = [
    {
      id: `python-essentials-1`,
      title: `Python Essentials 1`,
      issuer: `Cisco Networking Academy & Python Institute`,
      date: `09 Aug 2025`,
      image: `/certificates/python-essentials.png`,
      skills: [
        `Python`,
        `Object-Oriented Programming`,
        `Algorithm Design`,
        `Data Structures`,
      ],
    },
    {
      id: `javascript-essentials-1`,
      title: `JavaScript Essentials 1`,
      issuer: `Cisco Networking Academy & JS Institute`,
      date: `22 Jan 2026`,
      image: `/certificates/javascript-essentials.png`,
      skills: [
        `JavaScript (ES6+)`,
        `Control Flow`,
        `Functions & Scope`,
        `Web Logic`,
      ],
    },
  ]
function le() {
  return (0, N.jsxs)(`section`, {
    id: `certificates`,
    className: `relative py-24 px-6 overflow-hidden`,
    children: [
      (0, N.jsx)(`div`, {
        className: `absolute inset-0 bg-gradient-to-b from-transparent via-purple-950/10 to-transparent pointer-events-none`,
      }),
      (0, N.jsxs)(`div`, {
        className: `relative max-w-6xl mx-auto`,
        children: [
          (0, N.jsxs)(o.div, {
            initial: { opacity: 0, y: 30 },
            whileInView: { opacity: 1, y: 0 },
            viewport: { once: !0, margin: `-100px` },
            transition: { duration: 0.6 },
            className: `text-center mb-16`,
            children: [
              (0, N.jsx)(o.div, {
                initial: { opacity: 0, scale: 0.9 },
                whileInView: { opacity: 1, scale: 1 },
                viewport: { once: !0 },
                transition: { duration: 0.5 },
                className: `inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-purple-500/10 border border-purple-500/20`,
                children: (0, N.jsx)(`span`, {
                  className: `text-sm font-mono text-purple-300 tracking-wide`,
                  children: `OFFICIAL CERTIFICATIONS`,
                }),
              }),
              (0, N.jsx)(`h2`, {
                className: `text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-200 via-purple-400 to-cyan-400 bg-clip-text text-transparent`,
                children: `Certified Skills`,
              }),
            ],
          }),
          (0, N.jsx)(`div`, {
            className: `grid md:grid-cols-2 gap-8 max-w-5xl mx-auto`,
            children: ce.map((e, t) =>
              (0, N.jsx)(ue, { cert: e, index: t }, e.id),
            ),
          }),
        ],
      }),
    ],
  })
}
function ue({ cert: e, index: t }) {
  let [n, r] = (0, d.useState)(!1)
  return (0, N.jsx)(o.div, {
    initial: { opacity: 0, y: 50 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: !0, margin: `-100px` },
    transition: { duration: 0.6, delay: t * 0.2 },
    children: (0, N.jsx)(`div`, {
      className: `group relative h-full`,
      children: (0, N.jsx)(`div`, {
        className: `relative h-full bg-gradient-to-br from-purple-950/40 via-purple-900/30 to-cyan-950/30 backdrop-blur-sm rounded-2xl border border-purple-500/20 hover:border-purple-500/40 overflow-hidden transition-all duration-300`,
        children: (0, N.jsxs)(`div`, {
          className: `relative p-6 flex flex-col justify-between h-full`,
          children: [
            (0, N.jsx)(`div`, {
              className: `relative mb-6 aspect-[4/3] border border-purple-500/20 bg-purple-950/30 rounded-2xl overflow-hidden`,
              children: n
                ? (0, N.jsxs)(`div`, {
                    className: `w-full h-full flex flex-col items-center justify-center bg-[#080415] rounded-2xl`,
                    children: [
                      (0, N.jsx)(`svg`, {
                        className: `w-16 h-16 text-purple-400/40 mb-3`,
                        fill: `none`,
                        stroke: `currentColor`,
                        viewBox: `0 0 24 24`,
                        children: (0, N.jsx)(`path`, {
                          strokeLinecap: `round`,
                          strokeLinejoin: `round`,
                          strokeWidth: 1.5,
                          d: `M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z`,
                        }),
                      }),
                      (0, N.jsx)(`span`, {
                        className: `text-sm text-purple-400/60 font-mono`,
                        children: `Certificate Preview`,
                      }),
                    ],
                  })
                : (0, N.jsx)(`img`, {
                    src: e.image,
                    alt: e.title,
                    className: `w-full h-full object-contain p-2 rounded-2xl bg-[#080415] transition-transform duration-300`,
                    onError: () => r(!0),
                  }),
            }),
            (0, N.jsxs)(`div`, {
              className: `flex flex-col flex-1`,
              children: [
                (0, N.jsxs)(`div`, {
                  className: `flex items-center justify-between gap-3 mb-2`,
                  children: [
                    (0, N.jsx)(`h3`, {
                      className: `text-xl font-bold text-white leading-tight`,
                      children: e.title,
                    }),
                    (0, N.jsxs)(o.div, {
                      className: `flex-shrink-0 bg-green-500/20 backdrop-blur-sm px-2.5 py-1 rounded-full border border-green-400/30 flex items-center gap-1.5`,
                      initial: { opacity: 0, scale: 0 },
                      whileInView: { opacity: 1, scale: 1 },
                      viewport: { once: !0 },
                      transition: { delay: t * 0.2 + 0.3, type: `spring` },
                      children: [
                        (0, N.jsx)(`span`, {
                          className: `text-green-400 text-xs`,
                          children: `✓`,
                        }),
                        (0, N.jsx)(`span`, {
                          className: `text-[10px] font-mono text-green-300`,
                          children: `Verified`,
                        }),
                      ],
                    }),
                  ],
                }),
                (0, N.jsxs)(`div`, {
                  className: `flex flex-wrap items-center gap-2 text-xs text-purple-300/80 mb-4 font-mono`,
                  children: [
                    (0, N.jsx)(`span`, { children: e.issuer }),
                    (0, N.jsx)(`span`, {
                      className: `opacity-40`,
                      children: `•`,
                    }),
                    (0, N.jsx)(`span`, {
                      className: `px-2 py-0.5 rounded bg-purple-900/40 text-purple-200`,
                      children: e.date,
                    }),
                  ],
                }),
                (0, N.jsxs)(`div`, {
                  className: `mt-auto`,
                  children: [
                    (0, N.jsx)(`span`, {
                      className: `text-[10px] uppercase tracking-wider text-purple-400 font-mono font-semibold block mb-2.5`,
                      children: `Skills Covered`,
                    }),
                    (0, N.jsx)(`div`, {
                      className: `flex flex-wrap gap-2`,
                      children: e.skills.map((e, n) =>
                        (0, N.jsx)(
                          o.span,
                          {
                            initial: { opacity: 0, scale: 0.8 },
                            whileInView: { opacity: 1, scale: 1 },
                            viewport: { once: !0 },
                            transition: { delay: t * 0.2 + n * 0.1 },
                            className: `text-xs px-3 py-1 rounded-lg bg-purple-950/60 border border-purple-500/20 text-purple-200 font-medium transition-colors duration-200`,
                            children: e,
                          },
                          n,
                        ),
                      ),
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      }),
    }),
  })
}
var de = [
    {
      id: `el3almialeather`,
      title: `El Almia Leather (العالمية)`,
      subtitle: `Production E-Commerce Platform`,
      description: `A production genuine leather e-commerce platform featuring Arabic bilingual support, dynamic product filtering, and real-time inventory management.`,
      longDescription: `A production genuine leather e-commerce platform featuring Arabic bilingual support, dynamic product filtering, real-time inventory management, and a high-converting mobile checkout flow. Built with modern web technologies to deliver a seamless shopping experience.`,
      tools: [`React`, `Next.js`, `Tailwind CSS`, `REST API`],
      metrics: `Live Production Platform`,
      year: `2026`,
      image: `/projects/el3almialeather.png`,
      githubUrl: `#`,
      liveUrl: `https://el3almialeather.com/ar`,
    },
    {
      id: `spaceedu`,
      title: `SpaceEdu`,
      subtitle: `3D Web & EduTech Experience`,
      description: `An interactive 3D space education web platform featuring real-time orbital visualizations and astronomical data modules.`,
      longDescription: `An interactive 3D space education web platform featuring real-time orbital visualizations and astronomical data modules built with a futuristic glassmorphic aesthetic. Transforms astrophysics and planetary models into interactive 3D experiences with high-performance graphics and fluid user controls.`,
      tools: [`React`, `Three.js`, `Tailwind CSS`, `Vite`],
      metrics: `Interactive 3D Experience`,
      year: `2026`,
      image: `/projects/spaceedu.png`,
      githubUrl: `https://github.com/Lander2007/SpaceEdu`,
      liveUrl: `https://space-edu-drab.vercel.app/`,
    },
    {
      id: `aura`,
      title: `AURA SaaS Platform`,
      subtitle: `AI & Web App UI`,
      description: `A sleek, high-performance AI SaaS interface complete with real-time analytics dashboards and dark-mode visualizers.`,
      longDescription: `A sleek, high-performance AI SaaS interface complete with real-time analytics dashboards, dark-mode visualizers, and responsive component architecture. Engineered for optimal user experience with modern design patterns and seamless data visualization.`,
      tools: [`Next.js`, `TypeScript`, `Tailwind CSS`, `Lucide Icons`],
      metrics: `Real-Time Analytics Dashboard`,
      year: `2026`,
      image: `/projects/aura.png`,
      githubUrl: `https://github.com/Lander2007/AURA`,
      liveUrl: `https://aura-brown-mu.vercel.app/`,
    },
    {
      id: `el-king1`,
      title: `King Store`,
      subtitle: `E-Commerce & Accessories`,
      description: `A modern mobile accessories store interface featuring dynamic search indexing, category filters, and custom promotional banner layouts.`,
      longDescription: `A modern mobile accessories store interface featuring dynamic search indexing, category filters, and custom promotional banner layouts. High-fidelity dark-mode design with glassmorphic UI components, bilingual search interface, responsive product filters, and intuitive control panels.`,
      tools: [`React`, `TypeScript`, `Tailwind CSS`, `Figma`],
      metrics: `Dynamic Search & Filtering`,
      year: `2026`,
      image: `/projects/el-king1.png`,
      githubUrl: `https://github.com/Lander2007/el-king1`,
      liveUrl: `https://el-king1.vercel.app/`,
    },
    {
      id: `maison`,
      title: `Maison Design Showcase`,
      subtitle: `Luxury Interior & UI`,
      description: `An elegant home decor showcase highlighting editorial layouts, smooth scroll reveals, and high-end aesthetic typography.`,
      longDescription: `An elegant home decor showcase highlighting editorial layouts, smooth scroll reveals, and high-end aesthetic typography for modern interiors. Features sophisticated animations, immersive visual storytelling, and a refined user experience tailored for luxury brands.`,
      tools: [`React`, `Tailwind CSS`, `Framer Motion`, `Vite`],
      metrics: `Editorial Layout Experience`,
      year: `2026`,
      image: `/projects/maison.png`,
      githubUrl: `https://github.com/Lander2007/Maison`,
      liveUrl: `https://maison-nine-wheat.vercel.app/`,
    },
    {
      id: `pharoh-view`,
      title: `Pharaoh View`,
      subtitle: `Cultural Tourism Web`,
      description: `An interactive web experience exploring ancient Egyptian landmarks and historical monuments through rich media galleries.`,
      longDescription: `An interactive web experience exploring ancient Egyptian landmarks and historical monuments through rich media galleries and immersive visual storytelling. Combines cultural heritage with modern web design to create an engaging educational journey through ancient Egypt.`,
      tools: [`React`, `Tailwind CSS`, `JavaScript`, `Vite`],
      metrics: `Interactive Cultural Experience`,
      year: `2025`,
      image: `/projects/pharoh-view.png`,
      githubUrl: `https://github.com/Lander2007/Pharoh-view`,
      liveUrl: `https://pharoh-view.vercel.app/`,
    },
    {
      id: `02health`,
      title: `O2 Health`,
      subtitle: `HealthTech Platform`,
      description: `A digital healthcare portal facilitating patient appointment booking, doctor directory searches, and wellness tracking tools.`,
      longDescription: `A digital healthcare portal facilitating patient appointment booking, doctor directory searches, and wellness tracking tools. Built with a focus on accessibility, patient privacy, and seamless integration with healthcare workflows to improve patient-provider communication.`,
      tools: [`React`, `Tailwind CSS`, `TypeScript`, `Chart.js`],
      metrics: `Healthcare Portal System`,
      year: `2025`,
      image: `/projects/02health.png`,
      githubUrl: `https://github.com/Lander2007/02Health`,
      liveUrl: `https://02-health.vercel.app/`,
    },
    {
      id: `savior`,
      title: `Savior Emergency App`,
      subtitle: `Healthcare & Aid`,
      description: `A fast-response emergency support web application engineered with accessible, high-contrast UI for rapid navigation.`,
      longDescription: `A fast-response emergency support web application engineered with accessible, high-contrast UI for rapid navigation during urgent situations. Prioritizes speed, clarity, and ease of use to deliver critical assistance when every second counts.`,
      tools: [`React`, `Tailwind CSS`, `JavaScript`, `REST API`],
      metrics: `Emergency Response System`,
      year: `2026`,
      image: `/projects/savior.png`,
      githubUrl: `https://github.com/Lander2007/Savior`,
      liveUrl: `https://savior-rosy.vercel.app/`,
    },
    {
      id: `furni`,
      title: `Furni Living Store`,
      subtitle: `Interior E-Commerce`,
      description: `A lightweight, responsive furniture catalog featuring interactive cart states, user ratings, and effortless grid filtering.`,
      longDescription: `A lightweight, responsive furniture catalog featuring interactive cart states, user ratings, and effortless grid filtering across all viewport sizes. Delivers a smooth shopping experience with optimized performance and intuitive product discovery features.`,
      tools: [`HTML5`, `CSS3`, `JavaScript`, `Tailwind CSS`],
      metrics: `Responsive Catalog System`,
      year: `2026`,
      image: `/projects/furni.png`,
      githubUrl: `https://github.com/Lander2007/Furni`,
      liveUrl: `https://lander2007.github.io/Furni/`,
    },
    {
      id: `appexy`,
      title: `Appexy Landing Page`,
      subtitle: `SaaS Product Showcase`,
      description: `A conversion-focused landing page designed for SaaS products with feature comparison matrices and interactive pricing sliders.`,
      longDescription: `A conversion-focused landing page designed for SaaS products with feature comparison matrices, interactive pricing sliders, and user review carousels. Optimized for maximum conversion rates with strategic CTAs, social proof elements, and responsive design.`,
      tools: [`React`, `Tailwind CSS`, `Framer Motion`, `Vite`],
      metrics: `Conversion-Optimized Landing`,
      year: `2023`,
      image: `/projects/appexy.png`,
      githubUrl: `https://github.com/Lander2007/Appexy`,
      liveUrl: `https://lander2007.github.io/Appexy/`,
    },
  ],
  fe = [
    `React 19`,
    `Next.js`,
    `Vite`,
    `TypeScript`,
    `JavaScript`,
    `HTML5 & CSS3`,
    `Tailwind CSS v4`,
    `UI/UX & Figma`,
    `Three.js & 3D Web`,
    `Glassmorphic UI`,
    `Custom Dark Modes`,
    `Responsive Layouts`,
    `Electron UI`,
    `Git & GitHub`,
  ],
  Y = [
    {
      step: `01`,
      title: `Discover & Align`,
      desc: `Deep-diving into your vision, audience, and market through structured interview probes and architectural mapping.`,
      icon: (0, N.jsxs)(`svg`, {
        width: `22`,
        height: `22`,
        viewBox: `0 0 24 24`,
        fill: `none`,
        stroke: `currentColor`,
        strokeWidth: `1.75`,
        strokeLinecap: `round`,
        children: [
          (0, N.jsx)(`circle`, { cx: `11`, cy: `11`, r: `8` }),
          (0, N.jsx)(`path`, { d: `M21 21l-4.35-4.35` }),
        ],
      }),
    },
    {
      step: `02`,
      title: `Design & Prototype`,
      desc: `Crafting fluid design systems, interactive prototypes, and spatial motion dynamics that make products feel inevitable.`,
      icon: (0, N.jsxs)(`svg`, {
        width: `22`,
        height: `22`,
        viewBox: `0 0 24 24`,
        fill: `none`,
        stroke: `currentColor`,
        strokeWidth: `1.75`,
        strokeLinecap: `round`,
        children: [
          (0, N.jsx)(`path`, { d: `M12 19l7-7 3 3-7 7-3-3z` }),
          (0, N.jsx)(`path`, { d: `M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z` }),
          (0, N.jsx)(`path`, { d: `M2 2l7.586 7.586` }),
          (0, N.jsx)(`circle`, { cx: `11`, cy: `11`, r: `2` }),
        ],
      }),
    },
    {
      step: `03`,
      title: `Build & Polish`,
      desc: `Translating designs into clean, resilient, production-ready code with weighted physics and frame-perfect micro-interactions.`,
      icon: (0, N.jsxs)(`svg`, {
        width: `22`,
        height: `22`,
        viewBox: `0 0 24 24`,
        fill: `none`,
        stroke: `currentColor`,
        strokeWidth: `1.75`,
        strokeLinecap: `round`,
        children: [
          (0, N.jsx)(`polyline`, { points: `16 18 22 12 16 6` }),
          (0, N.jsx)(`polyline`, { points: `8 6 2 12 8 18` }),
        ],
      }),
    },
    {
      step: `04`,
      title: `Launch & Orbit`,
      desc: `Deploying with precision monitoring, optimizing real-world telemetry, and scaling your brand into higher orbits.`,
      icon: (0, N.jsxs)(`svg`, {
        width: `22`,
        height: `22`,
        viewBox: `0 0 24 24`,
        fill: `none`,
        stroke: `currentColor`,
        strokeWidth: `1.75`,
        strokeLinecap: `round`,
        children: [
          (0, N.jsx)(`path`, {
            d: `M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z`,
          }),
          (0, N.jsx)(`path`, {
            d: `M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z`,
          }),
          (0, N.jsx)(`path`, { d: `M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0` }),
          (0, N.jsx)(`path`, { d: `M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5` }),
        ],
      }),
    },
  ]
function pe() {
  let [e, t] = (0, d.useState)(0)
  return (
    (0, d.useEffect)(() => {
      let e = !1,
        n = () => {
          e ||=
            (requestAnimationFrame(() => {
              let n = document.documentElement.scrollHeight - window.innerHeight
              t(n > 0 ? Math.min(1, Math.max(0, window.scrollY / n)) : 0),
                (e = !1)
            }),
            !0)
        }
      return (
        window.addEventListener(`scroll`, n, { passive: !0 }),
        n(),
        () => window.removeEventListener(`scroll`, n)
      )
    }, []),
    e
  )
}
var X = [
  { id: `hero`, label: `Hero`, num: `01` },
  { id: `about`, label: `About`, num: `02` },
  { id: `projects`, label: `Projects`, num: `03` },
  { id: `certificates`, label: `Certificates`, num: `04` },
  { id: `process`, label: `Process`, num: `05` },
  { id: `contact`, label: `Contact`, num: `06` },
]
function me() {
  let e = pe(),
    [t, n] = (0, d.useState)(`hero`),
    [r, i] = (0, d.useState)(null)
  ;(0, d.useEffect)(() => {
    let e = () => {
      let e = window.scrollY + window.innerHeight * 0.35
      for (let t = X.length - 1; t >= 0; t--) {
        let r = document.getElementById(X[t].id)
        if (r && e >= r.offsetTop) {
          n(X[t].id)
          break
        }
      }
    }
    return (
      window.addEventListener(`scroll`, e, { passive: !0 }),
      e(),
      () => window.removeEventListener(`scroll`, e)
    )
  }, [])
  let a = (e) => {
    let t = document.getElementById(e)
    t && t.scrollIntoView({ behavior: `smooth` })
  }
  return (0, N.jsxs)(`div`, {
    style: {
      position: `fixed`,
      right: `28px`,
      top: `50%`,
      transform: `translateY(-50%)`,
      zIndex: 90,
      display: `flex`,
      flexDirection: `column`,
      alignItems: `center`,
      gap: `1.25rem`,
    },
    className: `hidden sm:flex`,
    children: [
      (0, N.jsxs)(`div`, {
        style: {
          fontFamily: `Syne`,
          fontSize: `0.68rem`,
          fontWeight: 600,
          color: `#c9a7ff`,
          letterSpacing: `0.05em`,
          textShadow: `0 0 10px rgba(108,43,217,0.8)`,
          marginBottom: `0.25rem`,
        },
        children: [Math.round(e * 100), `%`],
      }),
      (0, N.jsx)(`div`, {
        style: {
          position: `relative`,
          width: `2px`,
          height: `180px`,
          background: `rgba(108, 43, 217, 0.22)`,
          borderRadius: `9999px`,
          overflow: `visible`,
        },
        children: (0, N.jsx)(`div`, {
          style: {
            position: `absolute`,
            top: 0,
            left: 0,
            width: `100%`,
            height: `${e * 100}%`,
            background: `linear-gradient(to bottom, #6c2bd9, #c9a7ff, #ffffff)`,
            boxShadow: `0 0 12px #c9a7ff, 0 0 24px rgba(108, 43, 217, 0.9)`,
            borderRadius: `9999px`,
            transition: `height 0.1s linear`,
          },
        }),
      }),
      (0, N.jsx)(`div`, {
        style: {
          display: `flex`,
          flexDirection: `column`,
          gap: `1rem`,
          marginTop: `0.25rem`,
          position: `relative`,
        },
        children: X.map((e) => {
          let n = t === e.id,
            o = r === e.id
          return (0, N.jsxs)(
            `div`,
            {
              style: {
                position: `relative`,
                display: `flex`,
                alignItems: `center`,
              },
              onMouseEnter: () => i(e.id),
              onMouseLeave: () => i(null),
              children: [
                (0, N.jsx)(`button`, {
                  onClick: () => a(e.id),
                  "aria-label": `Scroll to ${e.label}`,
                  style: {
                    width: n ? `12px` : `8px`,
                    height: n ? `12px` : `8px`,
                    borderRadius: `50%`,
                    border: n
                      ? `2px solid #ffffff`
                      : `1px solid rgba(201,167,255,0.4)`,
                    background: n ? `#6c2bd9` : `rgba(13,2,33,0.8)`,
                    cursor: `pointer`,
                    transition: `all 0.3s cubic-bezier(0.22, 1, 0.36, 1)`,
                    boxShadow: n
                      ? `0 0 14px #c9a7ff, 0 0 28px rgba(108,43,217,0.9)`
                      : `none`,
                    outline: `none`,
                    padding: 0,
                  },
                }),
                (o || n) &&
                  (0, N.jsxs)(`div`, {
                    style: {
                      position: `absolute`,
                      right: `24px`,
                      whiteSpace: `nowrap`,
                      fontFamily: `Syne`,
                      fontSize: `0.72rem`,
                      fontWeight: 600,
                      color: n ? `#f0e8ff` : `#c9a7ff`,
                      padding: `0.3rem 0.75rem`,
                      borderRadius: `8px`,
                      background: `rgba(13, 2, 33, 0.9)`,
                      border: `1px solid rgba(108, 43, 217, 0.45)`,
                      backdropFilter: `blur(12px)`,
                      boxShadow: `0 4px 20px rgba(0, 0, 0, 0.5), 0 0 15px rgba(108,43,217,0.3)`,
                      pointerEvents: `none`,
                      animation: `hero-in 0.25s ease-out forwards`,
                      display: `flex`,
                      alignItems: `center`,
                      gap: `0.4rem`,
                    },
                    children: [
                      (0, N.jsx)(`span`, {
                        style: { color: `#6c2bd9`, fontSize: `0.65rem` },
                        children: e.num,
                      }),
                      (0, N.jsx)(`span`, { children: e.label }),
                    ],
                  }),
              ],
            },
            e.id,
          )
        }),
      }),
    ],
  })
}
function he() {
  let e = (0, d.useRef)(null)
  return (
    (0, d.useEffect)(() => {
      let t = e.current
      if (!t) return
      let n = t.getContext(`2d`)
      if (!n) return
      let r = (t.width = window.innerWidth),
        i = (t.height = window.innerHeight),
        a = () => {
          t &&
            ((r = t.width = window.innerWidth),
            (i = t.height = window.innerHeight))
        }
      window.addEventListener(`resize`, a)
      let o = Array.from({ length: 240 }, () => ({
          x: Math.random() * r,
          y: Math.random() * i,
          size: Math.random() * 2 + 0.3,
          alpha: Math.random() * 0.7 + 0.2,
          baseAlpha: Math.random() * 0.7 + 0.2,
          speed: Math.random() * 0.4 + 0.1,
          layer: Math.floor(Math.random() * 3) + 1,
          color:
            Math.random() > 0.85
              ? `#c9a7ff`
              : Math.random() > 0.7
                ? `#a78bfa`
                : `#ffffff`,
          twinkleSpeed: Math.random() * 0.03 + 0.01,
        })),
        s = r / 2,
        c = i / 2,
        l = (e) => {
          ;(s = e.clientX), (c = e.clientY)
        }
      window.addEventListener(`mousemove`, l)
      let u,
        d = 0,
        f = [],
        p = 0,
        m = () => {
          let e = 4.5 + Math.random() * 3,
            t = Math.PI / 6 + (Math.PI / 8) * Math.random()
          f.push({
            x: Math.random() * r * 0.75,
            y: Math.random() * i * 0.45,
            vx: Math.cos(t) * e,
            vy: Math.sin(t) * e,
            len: 90 + Math.random() * 110,
            life: 0,
            maxLife: 38 + Math.random() * 22,
            color: Math.random() > 0.5 ? `#c9a7ff` : `#ffffff`,
          })
        },
        h = () => {
          d += 0.01
          let e = window.scrollY,
            t = Math.max(
              1,
              document.documentElement.scrollHeight - window.innerHeight,
            ),
            a = Math.min(1, Math.max(0, e / t))
          n.clearRect(0, 0, r, i)
          let l = n.createLinearGradient(0, 0, 0, i),
            g = 260 + a * 20,
            _ = 270 + a * 35
          l.addColorStop(0, `hsl(${g}, 80%, ${5 + a * 4}%)`),
            l.addColorStop(1, `hsl(${_}, 85%, ${3 + a * 3}%)`),
            (n.fillStyle = l),
            n.fillRect(0, 0, r, i)
          for (let e = 0; e < 3; e++) {
            let t = d * 0.15 + (e * Math.PI * 2) / 3,
              o =
                r * (0.3 + 0.4 * Math.sin(t + a * Math.PI)) +
                (s - r / 2) * 0.05,
              l =
                i * (0.3 + 0.4 * Math.cos(t * 0.8 + a * Math.PI * 1.5)) +
                (c - i / 2) * 0.05,
              u =
                Math.min(r, i) *
                (0.4 + 0.25 * Math.sin(d * 0.2 + e)) *
                (1 + a * 0.5),
              f = n.createRadialGradient(o, l, 0, o, l, u),
              p = 0.12 + a * 0.14
            e === 0
              ? (f.addColorStop(0, `rgba(108, 43, 217, ${p})`),
                f.addColorStop(0.5, `rgba(139, 79, 232, ${p * 0.4})`),
                f.addColorStop(1, `transparent`))
              : e === 1
                ? (f.addColorStop(0, `rgba(139, 79, 232, ${p * 0.85})`),
                  f.addColorStop(0.6, `rgba(201, 167, 255, ${p * 0.25})`),
                  f.addColorStop(1, `transparent`))
                : (f.addColorStop(0, `rgba(76, 29, 149, ${p * 1.1})`),
                  f.addColorStop(0.5, `rgba(108, 43, 217, ${p * 0.3})`),
                  f.addColorStop(1, `transparent`)),
              (n.fillStyle = f),
              n.beginPath(),
              n.arc(o, l, u, 0, Math.PI * 2),
              n.fill()
          }
          let v = 1 + a * 2.2
          o.forEach((t) => {
            ;(t.alpha = t.baseAlpha + Math.sin(d * 10 * t.twinkleSpeed) * 0.25),
              (t.alpha = Math.max(0.1, Math.min(1, t.alpha + a * 0.2)))
            let o = (e * t.layer * 0.12 * v) % i,
              l = (t.y - o + i) % i,
              u = (s - r / 2) * 0.01 * t.layer,
              f = (c - i / 2) * 0.01 * t.layer,
              p = (t.x + u + r) % r
            ;(n.fillStyle = t.color),
              (n.globalAlpha = t.alpha),
              n.beginPath(),
              n.arc(p, l + f, t.size * (1 + a * 0.3), 0, Math.PI * 2),
              n.fill(),
              t.layer === 3 && t.size > 1.4
                ? ((n.shadowBlur = 8 + a * 10), (n.shadowColor = t.color))
                : (n.shadowBlur = 0)
          }),
            (n.shadowBlur = 0),
            p++,
            p > 200 + Math.random() * 160 && ((p = 0), m())
          for (let e = f.length - 1; e >= 0; e--) {
            let t = f[e],
              r = t.life / t.maxLife,
              i = Math.sin(r * Math.PI) * 0.85,
              a = Math.hypot(t.vx, t.vy),
              o = t.x - (t.vx / a) * t.len,
              s = t.y - (t.vy / a) * t.len,
              c = n.createLinearGradient(t.x, t.y, o, s)
            c.addColorStop(0, t.color),
              c.addColorStop(
                0.6,
                t.color === `#c9a7ff`
                  ? `rgba(201,167,255,0.3)`
                  : `rgba(255,255,255,0.25)`,
              ),
              c.addColorStop(1, `transparent`),
              (n.globalAlpha = i),
              (n.strokeStyle = c),
              (n.lineWidth = 1.5),
              (n.lineCap = `round`),
              n.beginPath(),
              n.moveTo(t.x, t.y),
              n.lineTo(o, s),
              n.stroke(),
              (n.globalAlpha = i * 0.6),
              (n.fillStyle = t.color),
              n.beginPath(),
              n.arc(t.x, t.y, 1.8, 0, Math.PI * 2),
              n.fill(),
              (t.x += t.vx),
              (t.y += t.vy),
              t.life++,
              t.life >= t.maxLife && f.splice(e, 1)
          }
          ;(n.globalAlpha = 1), (u = requestAnimationFrame(h))
        }
      return (
        h(),
        () => {
          window.removeEventListener(`resize`, a),
            window.removeEventListener(`mousemove`, l),
            cancelAnimationFrame(u)
        }
      )
    }, []),
    (0, N.jsx)(`canvas`, {
      ref: e,
      style: {
        position: `fixed`,
        top: 0,
        left: 0,
        width: `100vw`,
        height: `100vh`,
        pointerEvents: `none`,
        zIndex: 0,
      },
    })
  )
}
function ge() {
  let e = (0, d.useRef)(null),
    t = (0, d.useRef)(null),
    n = (0, d.useRef)([null, null, null, null]),
    r = (0, d.useRef)({ x: -200, y: -200 }),
    i = (0, d.useRef)({ x: -200, y: -200 }),
    a = (0, d.useRef)([
      { x: -200, y: -200 },
      { x: -200, y: -200 },
      { x: -200, y: -200 },
      { x: -200, y: -200 },
    ]),
    o = (0, d.useRef)(!1)
  ;(0, d.useEffect)(() => {
    let s = (e) => {
        r.current = { x: e.clientX, y: e.clientY }
      },
      c = (e) => {
        o.current = !!(
          e.target instanceof Element &&
          e.target.closest(`a, button, [role="button"]`)
        )
      }
    document.addEventListener(`mousemove`, s),
      document.addEventListener(`mouseover`, c)
    let l,
      u = () => {
        let { x: s, y: c } = r.current,
          d = o.current
        if (e.current) {
          let t = d ? 1.6 : 1
          ;(e.current.style.transform = `translate(${s - 6}px, ${c - 6}px) scale(${t})`),
            (e.current.style.boxShadow = d
              ? `0 0 16px rgba(201,167,255,1), 0 0 32px rgba(108,43,217,0.9)`
              : `0 0 10px rgba(201,167,255,0.85), 0 0 20px rgba(108,43,217,0.7)`)
        }
        if (
          ((i.current.x += (s - i.current.x) * 0.12),
          (i.current.y += (c - i.current.y) * 0.12),
          t.current)
        ) {
          let e = d ? 1.75 : 1
          ;(t.current.style.transform = `translate(${i.current.x - 20}px, ${i.current.y - 20}px) scale(${e})`),
            (t.current.style.opacity = d ? `0.55` : `0.32`),
            (t.current.style.borderColor = d
              ? `rgba(201,167,255,0.75)`
              : `rgba(108,43,217,0.65)`)
        }
        let f = [0.28, 0.21, 0.16, 0.12]
        a.current.forEach((e, t) => {
          let i = t === 0 ? r.current : a.current[t - 1]
          ;(e.x += (i.x - e.x) * f[t]), (e.y += (i.y - e.y) * f[t])
          let o = n.current[t]
          if (o) {
            let n = 3.2 - t * 0.5
            ;(o.style.transform = `translate(${e.x - n / 2}px, ${e.y - n / 2}px)`),
              (o.style.opacity = d ? `0` : `${0.4 - t * 0.08}`)
          }
        }),
          (l = requestAnimationFrame(u))
      }
    return (
      (l = requestAnimationFrame(u)),
      () => {
        document.removeEventListener(`mousemove`, s),
          document.removeEventListener(`mouseover`, c),
          cancelAnimationFrame(l)
      }
    )
  }, [])
  let s = {
    position: `fixed`,
    top: 0,
    left: 0,
    pointerEvents: `none`,
    willChange: `transform`,
  }
  return (0, N.jsxs)(N.Fragment, {
    children: [
      (0, N.jsx)(`div`, {
        ref: e,
        className: `custom-cursor`,
        style: {
          ...s,
          zIndex: 10001,
          width: 12,
          height: 12,
          borderRadius: `50%`,
          background: `rgba(201,167,255,0.95)`,
          transition: `box-shadow 0.15s, transform 0.1s`,
        },
      }),
      (0, N.jsx)(`div`, {
        ref: t,
        className: `custom-cursor`,
        style: {
          ...s,
          zIndex: 1e4,
          width: 40,
          height: 40,
          borderRadius: `50%`,
          border: `1px solid rgba(108,43,217,0.65)`,
          transition: `opacity 0.2s, border-color 0.2s, transform 0.05s linear`,
        },
      }),
      [0, 1, 2, 3].map((e) =>
        (0, N.jsx)(
          `div`,
          {
            ref: (t) => {
              n.current[e] = t
            },
            className: `custom-cursor`,
            style: {
              ...s,
              zIndex: 9999,
              width: `${3.2 - e * 0.5}px`,
              height: `${3.2 - e * 0.5}px`,
              borderRadius: `50%`,
              background: `rgba(108,43,217,${0.72 - e * 0.12})`,
              boxShadow: `0 0 ${5 - e}px rgba(108,43,217,${0.48 - e * 0.09})`,
              transition: `opacity 0.15s`,
            },
          },
          e,
        ),
      ),
    ],
  })
}
function Z({
  children: e,
  delay: t = 0,
  direction: n = `up`,
  blur: r = !0,
  style: i,
  className: a,
}) {
  let s = 0,
    c = 0,
    l = 1
  switch (n) {
    case `up`:
      ;(s = 48), (l = 0.96)
      break
    case `down`:
      ;(s = -48), (l = 0.96)
      break
    case `left`:
      ;(c = -48), (l = 0.96)
      break
    case `right`:
      ;(c = 48), (l = 0.96)
      break
    case `scale`:
      l = 0.86
      break
  }
  return (0, N.jsx)(o.div, {
    className: a,
    initial: {
      opacity: 0,
      y: s,
      x: c,
      scale: l,
      filter: r ? `blur(6px)` : `blur(0px)`,
    },
    whileInView: { opacity: 1, y: 0, x: 0, scale: 1, filter: `blur(0px)` },
    viewport: { once: !0, amount: 0.2, margin: `0px 0px -100px 0px` },
    transition: { duration: 0.8, delay: t, ease: [0.22, 1, 0.36, 1] },
    style: { willChange: `opacity, transform, filter`, ...i },
    children: e,
  })
}
;(0, d.memo)(Z)
function _e({ href: e, children: t, variant: n = `primary` }) {
  let r = (0, d.useRef)(null),
    [i, a] = (0, d.useState)({ x: 0, y: 0 }),
    [o, s] = (0, d.useState)(!1),
    c = (0, d.useCallback)((e) => {
      if (!r.current) return
      let t = r.current.getBoundingClientRect()
      a({
        x: (e.clientX - (t.left + t.width / 2)) * 0.28,
        y: (e.clientY - (t.top + t.height / 2)) * 0.28,
      })
    }, []),
    l = (0, d.useCallback)(() => s(!0), []),
    u = (0, d.useCallback)(() => {
      s(!1), a({ x: 0, y: 0 })
    }, []),
    f = o
      ? `transform 0.12s ease, box-shadow 0.25s, background 0.25s, border-color 0.25s`
      : `transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s, background 0.3s, border-color 0.3s`,
    p = {
      display: `inline-flex`,
      alignItems: `center`,
      justifyContent: `center`,
      textDecoration: `none`,
      fontFamily: `Syne`,
      fontWeight: 600,
      fontSize: `0.9375rem`,
      letterSpacing: `0.01em`,
      padding: `0.875rem 2.625rem`,
      borderRadius: `9999px`,
      transform: `translate(${i.x}px, ${i.y}px)`,
      transition: f,
      cursor: `pointer`,
      willChange: `transform`,
    }
  return n === `primary`
    ? (0, N.jsx)(`a`, {
        ref: r,
        href: e,
        onMouseMove: c,
        onMouseEnter: l,
        onMouseLeave: u,
        style: {
          ...p,
          color: `#f0e8ff`,
          background: `linear-gradient(135deg, #5b21b6 0%, #7c3aed 50%, #6c2bd9 100%)`,
          boxShadow: o
            ? `0 0 50px rgba(108,43,217,0.85), 0 0 100px rgba(108,43,217,0.45)`
            : `0 0 32px rgba(108,43,217,0.55), 0 0 64px rgba(108,43,217,0.2)`,
        },
        children: t,
      })
    : (0, N.jsx)(`a`, {
        ref: r,
        href: e,
        onMouseMove: c,
        onMouseEnter: l,
        onMouseLeave: u,
        style: {
          ...p,
          color: `#c9a7ff`,
          border: `1px solid ${
            o ? `rgba(201,167,255,0.55)` : `rgba(201,167,255,0.28)`
          }`,
          background: o ? `rgba(201,167,255,0.12)` : `rgba(201,167,255,0.05)`,
        },
        children: t,
      })
}
var Q = (0, d.memo)(_e)
function $({ children: e }) {
  return (0, N.jsxs)(`div`, {
    style: {
      fontFamily: `Syne`,
      fontSize: `0.72rem`,
      letterSpacing: `0.24em`,
      textTransform: `uppercase`,
      color: `#8b4fe8`,
      marginBottom: `1rem`,
      display: `inline-flex`,
      alignItems: `center`,
      gap: `0.75rem`,
    },
    children: [
      (0, N.jsx)(`span`, {
        style: {
          display: `inline-block`,
          width: `28px`,
          height: `1px`,
          background: `#6c2bd9`,
          flexShrink: 0,
        },
      }),
      e,
    ],
  })
}
function ve({ phrases: e, onFirstTypeComplete: t }) {
  let [n, r] = (0, d.useState)(0),
    [i, a] = (0, d.useState)(``),
    [o, s] = (0, d.useState)(!1),
    c = (0, d.useRef)(!1)
  return (
    (0, d.useEffect)(() => {
      let l = e[n],
        u
      return (
        !o && i === l
          ? (c.current || ((c.current = !0), t?.()),
            (u = setTimeout(() => s(!0), 2400)))
          : o && i === ``
            ? (s(!1), r((t) => (t + 1) % e.length))
            : (u = setTimeout(
                () => {
                  a(
                    o
                      ? l.substring(0, i.length - 1)
                      : l.substring(0, i.length + 1),
                  )
                },
                o ? 38 : 75,
              )),
        () => clearTimeout(u)
      )
    }, [i, o, n, e, t]),
    (0, N.jsxs)(`span`, {
      style: {
        fontFamily: `'Syne', 'Plus Jakarta Sans', monospace`,
        fontWeight: 600,
        color: `#f0e8ff`,
        textShadow: `0 0 20px rgba(201, 167, 255, 0.9), 0 0 40px rgba(108, 43, 217, 0.8)`,
        letterSpacing: `-0.015em`,
        display: `inline-flex`,
        alignItems: `center`,
      },
      children: [
        i,
        (0, N.jsx)(`span`, {
          style: {
            display: `inline-block`,
            width: `3px`,
            height: `0.85em`,
            backgroundColor: `#c9a7ff`,
            marginLeft: `6px`,
            borderRadius: `2px`,
            boxShadow: `0 0 10px #c9a7ff, 0 0 20px rgba(108,43,217,0.9)`,
            animation: `cursor-pulse 1.3s ease-in-out infinite`,
          },
        }),
      ],
    })
  )
}
function ye() {
  let e = (0, d.useRef)(null),
    [t, n] = (0, d.useState)({ opacity: 1, scale: 1, translateY: 0 }),
    [r, i] = (0, d.useState)(!1)
  return (
    (0, d.useEffect)(() => {
      let e = setTimeout(() => i(!0), 1800)
      return () => clearTimeout(e)
    }, []),
    (0, d.useEffect)(() => {
      let t = !1,
        r = () => {
          t ||=
            (requestAnimationFrame(() => {
              if (!e.current) return
              let r = e.current.getBoundingClientRect(),
                i = e.current.clientHeight - window.innerHeight
              if (i > 0) {
                let e = Math.min(1, Math.max(0, -r.top / i)),
                  t = e > 0.45 ? 1 - (e - 0.45) / 0.55 : 1,
                  a = 1 - e * 0.08,
                  o = -e * 60
                n({ opacity: Math.max(0, t), scale: a, translateY: o })
              }
              t = !1
            }),
            !0)
        }
      return (
        window.addEventListener(`scroll`, r, { passive: !0 }),
        () => window.removeEventListener(`scroll`, r)
      )
    }, []),
    (0, N.jsxs)(`section`, {
      id: `hero`,
      ref: e,
      style: { height: `180vh`, position: `relative`, zIndex: 1 },
      children: [
        (0, N.jsx)(se, {}),
        (0, N.jsxs)(`div`, {
          style: {
            position: `absolute`,
            inset: 0,
            overflow: `hidden`,
            pointerEvents: `none`,
            zIndex: 1,
          },
          children: [
            (0, N.jsx)(`div`, {
              style: {
                position: `absolute`,
                top: `12%`,
                left: `6%`,
                width: `340px`,
                height: `340px`,
                borderRadius: `50%`,
                background: `radial-gradient(circle, rgba(108,43,217,0.25) 0%, transparent 70%)`,
                filter: `blur(55px)`,
                animation: `float-orb-a 13s ease-in-out infinite`,
              },
            }),
            (0, N.jsx)(`div`, {
              style: {
                position: `absolute`,
                top: `38%`,
                right: `4%`,
                width: `280px`,
                height: `280px`,
                borderRadius: `50%`,
                background: `radial-gradient(circle, rgba(6,182,212,0.18) 0%, transparent 70%)`,
                filter: `blur(48px)`,
                animation: `float-orb-b 16s ease-in-out infinite 2.5s`,
              },
            }),
            (0, N.jsx)(`div`, {
              style: {
                position: `absolute`,
                bottom: `18%`,
                left: `22%`,
                width: `220px`,
                height: `220px`,
                borderRadius: `50%`,
                background: `radial-gradient(circle, rgba(217,70,239,0.14) 0%, transparent 70%)`,
                filter: `blur(38px)`,
                animation: `float-orb-c 11s ease-in-out infinite 1.2s`,
              },
            }),
          ],
        }),
        (0, N.jsxs)(`div`, {
          style: {
            position: `sticky`,
            top: 0,
            height: `100vh`,
            display: `flex`,
            alignItems: `flex-start`,
            justifyContent: `center`,
            overflow: `hidden`,
            paddingTop: `clamp(5rem, 12vh, 8rem)`,
          },
          children: [
            (0, N.jsxs)(`div`, {
              style: {
                textAlign: `center`,
                position: `relative`,
                zIndex: 2,
                padding: `1rem 2rem`,
                maxWidth: `880px`,
                opacity: t.opacity,
                transform: `translateY(${t.translateY}px) scale(${t.scale})`,
                transition: `transform 0.1s ease-out, opacity 0.1s ease-out`,
                willChange: `transform, opacity`,
              },
              children: [
                (0, N.jsx)(`div`, {
                  style: {
                    marginBottom: `1rem`,
                    display: `inline-block`,
                    opacity: r ? 1 : 0,
                    transform: r ? `scale(1)` : `scale(0.8)`,
                    transition: `opacity 1.1s cubic-bezier(0.16, 1, 0.3, 1), transform 1.1s cubic-bezier(0.16, 1, 0.3, 1)`,
                  },
                  children: (0, N.jsx)(P, { size: 72 }),
                }),
                (0, N.jsxs)(`div`, {
                  style: {
                    display: `inline-flex`,
                    alignItems: `center`,
                    gap: `0.5rem`,
                    fontFamily: `Syne`,
                    fontSize: `0.72rem`,
                    letterSpacing: `0.18em`,
                    textTransform: `uppercase`,
                    color: `rgba(201,167,255,0.85)`,
                    marginBottom: `1.5rem`,
                    border: `1px solid rgba(108,43,217,0.42)`,
                    padding: `0.45rem 1.25rem 0.45rem 0.95rem`,
                    borderRadius: `9999px`,
                    background: `rgba(108,43,217,0.12)`,
                    backdropFilter: `blur(12px)`,
                    opacity: r ? 1 : 0,
                    transform: r ? `translateY(0)` : `translateY(16px)`,
                    transition: `opacity 1.1s 0.2s cubic-bezier(0.16, 1, 0.3, 1), transform 1.1s 0.2s cubic-bezier(0.16, 1, 0.3, 1)`,
                  },
                  children: [
                    (0, N.jsx)(`span`, {
                      style: {
                        width: `6px`,
                        height: `6px`,
                        borderRadius: `50%`,
                        background: `#8b4fe8`,
                        display: `inline-block`,
                        animation: `glow-pulse-dot 2.2s ease-in-out infinite`,
                      },
                    }),
                    `Web Developer @ WaveDev · Available for Custom Frontend Projects`,
                  ],
                }),
                (0, N.jsx)(`h1`, {
                  className: `text-glow-bright`,
                  style: {
                    fontFamily: `Syne`,
                    fontWeight: 700,
                    fontSize: `clamp(3.5rem, 8.5vw, 7.5rem)`,
                    color: `#f0e8ff`,
                    lineHeight: 0.98,
                    letterSpacing: `-0.035em`,
                    marginBottom: `1rem`,
                  },
                  children: `Khaled Amr`,
                }),
                (0, N.jsx)(`div`, {
                  style: {
                    fontSize: `clamp(1.25rem, 3.2vw, 2.15rem)`,
                    marginBottom: `1.75rem`,
                    minHeight: `3rem`,
                    display: `flex`,
                    justifyContent: `center`,
                    alignItems: `center`,
                  },
                  children: (0, N.jsx)(ve, {
                    phrases: [
                      `Frontend Web Developer`,
                      `UI/UX Designer`,
                      `Web Developer @ WaveDev`,
                    ],
                    onFirstTypeComplete: () => i(!0),
                  }),
                }),
                (0, N.jsx)(`p`, {
                  style: {
                    fontFamily: `Plus Jakarta Sans`,
                    fontSize: `clamp(1.0625rem, 2.2vw, 1.25rem)`,
                    color: `rgba(201,167,255,0.78)`,
                    lineHeight: 1.65,
                    maxWidth: `640px`,
                    margin: `0 auto 2.5rem`,
                    fontWeight: 300,
                    letterSpacing: `0.005em`,
                    opacity: r ? 1 : 0,
                    transform: r ? `translateY(0)` : `translateY(24px)`,
                    transition: `opacity 1.1s 0.4s cubic-bezier(0.16, 1, 0.3, 1), transform 1.1s 0.4s cubic-bezier(0.16, 1, 0.3, 1)`,
                  },
                  children: `I build high-performance, interactive web interfaces, custom 3D web experiences, and pixel-perfect dark mode applications.`,
                }),
                (0, N.jsxs)(`div`, {
                  style: {
                    display: `flex`,
                    gap: `1.25rem`,
                    justifyContent: `center`,
                    flexWrap: `wrap`,
                    opacity: r ? 1 : 0,
                    transform: r ? `translateY(0)` : `translateY(28px)`,
                    transition: `opacity 1.1s 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 1.1s 0.6s cubic-bezier(0.16, 1, 0.3, 1)`,
                  },
                  children: [
                    (0, N.jsx)(Q, {
                      href: `#projects`,
                      variant: `primary`,
                      children: `Explore Featured Work`,
                    }),
                    (0, N.jsx)(Q, {
                      href: `#contact`,
                      variant: `secondary`,
                      children: `Get In Touch`,
                    }),
                  ],
                }),
              ],
            }),
            (0, N.jsxs)(`div`, {
              className: `hero-scroll-indicator`,
              style: {
                position: `absolute`,
                bottom: `2.5rem`,
                left: `50%`,
                transform: `translateX(-50%)`,
                display: `flex`,
                flexDirection: `column`,
                alignItems: `center`,
                gap: `0.5rem`,
                opacity: t.opacity * 0.7,
                pointerEvents: `none`,
                zIndex: 3,
              },
              children: [
                (0, N.jsx)(`span`, {
                  style: {
                    fontFamily: `Syne`,
                    fontSize: `0.6rem`,
                    letterSpacing: `0.22em`,
                    textTransform: `uppercase`,
                    color: `rgba(201,167,255,0.45)`,
                  },
                  children: `Scroll`,
                }),
                (0, N.jsx)(`div`, {
                  style: {
                    width: `1px`,
                    height: `36px`,
                    background: `linear-gradient(to bottom, rgba(139,79,232,0.8), transparent)`,
                  },
                }),
              ],
            }),
          ],
        }),
      ],
    })
  )
}
function be({ value: e, label: t }) {
  let n = (0, d.useRef)(null),
    [r, i] = (0, d.useState)(0),
    [a, o] = (0, d.useState)(!1),
    s = e.match(/^(\d+)(.*)$/),
    c = s ? parseInt(s[1]) : 0,
    l = s ? s[2] : e
  return (
    (0, d.useEffect)(() => {
      let e = n.current
      if (!e) return
      let t = new IntersectionObserver(
        ([e]) => {
          e.isIntersecting && o(!0)
        },
        { threshold: 0.5 },
      )
      return t.observe(e), () => t.disconnect()
    }, []),
    (0, d.useEffect)(() => {
      if (!a || c === 0) return
      let e = Date.now(),
        t = setInterval(() => {
          let n = Math.min(1, (Date.now() - e) / 1100),
            r = 1 - (1 - n) ** 3
          i(Math.round(r * c)), n >= 1 && clearInterval(t)
        }, 16)
      return () => clearInterval(t)
    }, [a, c]),
    (0, N.jsxs)(`div`, {
      ref: n,
      children: [
        (0, N.jsxs)(`div`, {
          className: `stat-number-in`,
          style: {
            fontFamily: `Syne`,
            fontWeight: 700,
            fontSize: `2.25rem`,
            lineHeight: 1,
            letterSpacing: `-0.03em`,
            marginBottom: `0.375rem`,
            background: `linear-gradient(135deg, #f0e8ff 0%, #c9a7ff 60%, #a855f7 100%)`,
            WebkitBackgroundClip: `text`,
            WebkitTextFillColor: `transparent`,
            backgroundClip: `text`,
            filter: `drop-shadow(0 0 16px rgba(201,167,255,0.45))`,
          },
          children: [a ? r : 0, l],
        }),
        (0, N.jsx)(`div`, {
          style: {
            fontFamily: `Plus Jakarta Sans`,
            fontSize: `0.825rem`,
            color: `rgba(201,167,255,0.52)`,
            letterSpacing: `0.02em`,
          },
          children: t,
        }),
      ],
    })
  )
}
function xe({ label: e }) {
  let [t, n] = (0, d.useState)(!1)
  return (0, N.jsx)(`span`, {
    onMouseEnter: () => n(!0),
    onMouseLeave: () => n(!1),
    style: {
      fontFamily: `Syne`,
      fontWeight: 500,
      fontSize: `0.8rem`,
      color: t ? `#f0e8ff` : `#c9a7ff`,
      padding: `0.5rem 1.15rem`,
      borderRadius: `9999px`,
      border: `1px solid ${
        t ? `rgba(139,79,232,0.85)` : `rgba(108,43,217,0.32)`
      }`,
      background: t ? `rgba(108,43,217,0.25)` : `rgba(108,43,217,0.08)`,
      boxShadow: t
        ? `0 0 20px rgba(108,43,217,0.6), 0 0 40px rgba(108,43,217,0.2)`
        : `none`,
      transition: `all 0.25s cubic-bezier(0.16, 1, 0.3, 1)`,
      cursor: `default`,
      display: `inline-block`,
      letterSpacing: `0.01em`,
    },
    children: e,
  })
}
var Se = (0, d.memo)(xe)
function Ce() {
  return (0, N.jsx)(`section`, {
    id: `about`,
    className: `section-transition-bleed`,
    style: {
      padding: `11rem 2rem 9rem`,
      maxWidth: `1240px`,
      margin: `0 auto`,
      position: `relative`,
      zIndex: 2,
    },
    children: (0, N.jsxs)(`div`, {
      className: `grid-about`,
      children: [
        (0, N.jsxs)(Z, {
          direction: `left`,
          children: [
            (0, N.jsx)($, { children: `02 / Philosophy & Background` }),
            (0, N.jsx)(`h2`, {
              style: {
                fontFamily: `Syne`,
                fontWeight: 700,
                fontSize: `clamp(2.25rem, 4.2vw, 3.5rem)`,
                color: `#f0e8ff`,
                lineHeight: 1.06,
                letterSpacing: `-0.028em`,
                marginBottom: `2.25rem`,
              },
              children: `Frontend Craft meets High-Performance UI/UX.`,
            }),
            (0, N.jsx)(`p`, {
              style: {
                fontFamily: `Plus Jakarta Sans`,
                fontSize: `1.08rem`,
                lineHeight: 1.82,
                color: `rgba(201,167,255,0.75)`,
                marginBottom: `1.625rem`,
                fontWeight: 300,
              },
              children: `I'm Khaled Amr, a Frontend Developer and UI/UX Designer at WaveDev. I build high-performance, interactive web interfaces, custom 3D web experiences, and pixel-perfect dark mode applications.`,
            }),
            (0, N.jsx)(`p`, {
              style: {
                fontFamily: `Plus Jakarta Sans`,
                fontSize: `1.08rem`,
                lineHeight: 1.82,
                color: `rgba(201,167,255,0.75)`,
                marginBottom: `3rem`,
                fontWeight: 300,
              },
              children: `Dedicated to modern CSS architectures, glassmorphic UI design, responsive layouts, and seamless client-side performance.`,
            }),
            (0, N.jsx)(`div`, {
              style: { display: `flex`, gap: `3.5rem`, flexWrap: `wrap` },
              children: [
                [`5+`, `Years experience`],
                [`30+`, `Projects shipped`],
                [`100%`, `Custom delivery`],
              ].map(([e, t], n) =>
                (0, N.jsx)(
                  Z,
                  {
                    delay: n * 0.12,
                    direction: `up`,
                    children: (0, N.jsx)(be, { value: e, label: t }),
                  },
                  t,
                ),
              ),
            }),
          ],
        }),
        (0, N.jsx)(Z, {
          direction: `right`,
          delay: 0.15,
          children: (0, N.jsxs)(`div`, {
            id: `tech-stack`,
            style: {
              padding: `2.5rem`,
              borderRadius: `24px`,
              border: `1px solid rgba(108,43,217,0.28)`,
              background: `rgba(13,2,33,0.75)`,
              backdropFilter: `blur(20px)`,
              boxShadow: `0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(201,167,255,0.08)`,
            },
            children: [
              (0, N.jsx)($, { children: `Core Capabilities` }),
              (0, N.jsx)(`h3`, {
                style: {
                  fontFamily: `Syne`,
                  fontSize: `1.35rem`,
                  fontWeight: 600,
                  color: `#f0e8ff`,
                  marginBottom: `1.5rem`,
                },
                children: `Toolkit & Architecture`,
              }),
              (0, N.jsx)(`div`, {
                style: { display: `flex`, flexWrap: `wrap`, gap: `0.65rem` },
                children: fe.map((e) => (0, N.jsx)(Se, { label: e }, e)),
              }),
            ],
          }),
        }),
      ],
    }),
  })
}
function we({ children: e, className: t, style: n }) {
  let r = (0, d.useRef)(null),
    [i, a] = (0, d.useState)(
      `perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)`,
    )
  return (0, N.jsx)(`div`, {
    ref: r,
    onMouseMove: (e) => {
      let t = r.current
      if (!t) return
      let n = t.getBoundingClientRect(),
        i = e.clientX - n.left,
        o = e.clientY - n.top,
        s = n.width / 2,
        c = n.height / 2,
        l = ((i - s) / s) * 8
      a(
        `perspective(1000px) rotateX(${-((o - c) / c) * 8}deg) rotateY(${l}deg) scale(1.02)`,
      )
    },
    onMouseLeave: () => {
      a(`perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)`)
    },
    className: t,
    style: {
      ...n,
      transform: i,
      transition: `transform 0.15s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.3s ease`,
      willChange: `transform`,
    },
    children: e,
  })
}
function Te() {
  let [e, t] = (0, d.useState)(`All`),
    [n, r] = (0, d.useState)(0),
    [i, a] = (0, d.useState)(1),
    [s, l] = (0, d.useState)(0),
    [u, f] = (0, d.useState)(0),
    p = de.filter((t) =>
      e === `All`
        ? !0
        : e === `E-Commerce`
          ? t.subtitle.toLowerCase().includes(`e-commerce`) ||
            t.id === `el-king1` ||
            t.id === `furni` ||
            t.id === `el3almialeather`
          : e === `3D & Interactive`
            ? t.tools.includes(`Three.js`) ||
              t.tools.includes(`Framer Motion`) ||
              t.id === `pharoh-view` ||
              t.id === `maison` ||
              t.id === `spaceedu`
            : e === `SaaS & Dashboards`
              ? t.id === `aura` ||
                t.id === `appexy` ||
                t.id === `02health` ||
                t.id === `savior`
              : !0,
    ),
    m = p[n] || p[0]
  ;(0, d.useEffect)(() => {
    r(0)
  }, [e])
  let h = (0, d.useCallback)(
    (e) => {
      if (p.length === 0) return
      let t = (e + p.length) % p.length
      a(
        t === (n + 1) % p.length
          ? 1
          : t === (n - 1 + p.length) % p.length
            ? -1
            : t > n
              ? 1
              : -1,
      ),
        r(t)
    },
    [n, p.length],
  )
  return (
    (0, d.useEffect)(() => {
      let e = (e) => {
        if (p.length === 0) return
        let t = document.getElementById(`projects`)
        if (!t) return
        let n = t.getBoundingClientRect()
        n.top < window.innerHeight * 0.75 &&
          n.bottom > 0 &&
          (e.key === `ArrowDown` || e.key === `ArrowRight`
            ? (e.preventDefault(), r((e) => (e + 1) % p.length))
            : (e.key === `ArrowUp` || e.key === `ArrowLeft`) &&
              (e.preventDefault(), r((e) => (e - 1 + p.length) % p.length)))
      }
      return (
        window.addEventListener(`keydown`, e),
        () => window.removeEventListener(`keydown`, e)
      )
    }, [p.length]),
    (0, N.jsx)(`section`, {
      id: `projects`,
      className: `section-transition-bleed overflow-hidden`,
      style: {
        padding: `6rem 1rem md:9rem 2rem`,
        position: `relative`,
        zIndex: 2,
      },
      children: (0, N.jsxs)(`div`, {
        style: { maxWidth: `1200px`, margin: `0 auto` },
        children: [
          (0, N.jsx)(Z, {
            style: { marginBottom: `2rem` },
            children: (0, N.jsxs)(`div`, {
              className: `text-center md:text-left`,
              children: [
                (0, N.jsx)($, { children: `03 / Featured Work` }),
                (0, N.jsx)(`h2`, {
                  className: `text-3xl sm:text-4xl md:text-5xl font-bold`,
                  style: {
                    fontFamily: `Syne`,
                    color: `#f0e8ff`,
                    letterSpacing: `-0.028em`,
                  },
                  children: `Featured Projects`,
                }),
              ],
            }),
          }),
          (0, N.jsx)(Z, {
            delay: 0.05,
            style: { marginBottom: `3rem` },
            children: (0, N.jsx)(`div`, {
              className: `flex flex-wrap justify-center md:justify-start gap-3`,
              children: [
                `All`,
                `E-Commerce`,
                `3D & Interactive`,
                `SaaS & Dashboards`,
              ].map((n) => {
                let r = e === n
                return (0, N.jsx)(
                  `button`,
                  {
                    onClick: () => t(n),
                    style: {
                      fontFamily: `Syne`,
                      fontWeight: 600,
                      fontSize: `0.85rem`,
                      padding: `0.55rem 1.25rem`,
                      borderRadius: `9999px`,
                      border: `1px solid ${
                        r
                          ? `rgba(139, 79, 232, 0.85)`
                          : `rgba(108, 43, 217, 0.22)`
                      }`,
                      background: r
                        ? `rgba(108, 43, 217, 0.25)`
                        : `rgba(108, 43, 217, 0.05)`,
                      color: r ? `#f0e8ff` : `#c9a7ff`,
                      cursor: `pointer`,
                      boxShadow: r
                        ? `0 0 24px rgba(108, 43, 217, 0.45)`
                        : `none`,
                      backdropFilter: `blur(12px)`,
                      transition: `all 0.3s cubic-bezier(0.16, 1, 0.3, 1)`,
                    },
                    className: `hover:bg-purple-900/25 active:scale-95`,
                    children: n,
                  },
                  n,
                )
              }),
            }),
          }),
          (0, N.jsx)(Z, {
            delay: 0.1,
            children: (0, N.jsxs)(`div`, {
              className: `relative`,
              children: [
                (0, N.jsx)(`div`, {
                  className: `block lg:hidden md:hidden`,
                  children: (0, N.jsxs)(`div`, {
                    onTouchStart: (e) => {
                      l(e.targetTouches[0].clientX)
                    },
                    onTouchMove: (e) => {
                      f(e.targetTouches[0].clientX)
                    },
                    onTouchEnd: () => {
                      if (!s || !u) return
                      let e = s - u,
                        t = e > 50,
                        r = e < -50
                      t && h(n + 1), r && h(n - 1), l(0), f(0)
                    },
                    className: `relative`,
                    children: [
                      (0, N.jsxs)(`div`, {
                        className: `flex justify-between items-center px-2 mb-3`,
                        children: [
                          (0, N.jsxs)(`span`, {
                            className: `text-xs font-mono text-purple-400 font-semibold`,
                            children: [
                              String(n + 1).padStart(2, `0`),
                              ` / `,
                              String(p.length).padStart(2, `0`),
                            ],
                          }),
                          (0, N.jsx)(`span`, {
                            className: `text-xs font-mono text-purple-400/60 flex items-center gap-1.5`,
                            children: `Swipe or tap arrows to explore`,
                          }),
                        ],
                      }),
                      (0, N.jsx)(`div`, {
                        className: `relative min-h-[480px] overflow-hidden rounded-3xl`,
                        children: (0, N.jsx)(c, {
                          mode: `wait`,
                          custom: i,
                          children: (0, N.jsxs)(
                            o.div,
                            {
                              custom: i,
                              variants: {
                                enter: (e) => ({
                                  x: e > 0 ? `100%` : `-100%`,
                                  opacity: 0,
                                  scale: 0.92,
                                  filter: `blur(4px)`,
                                }),
                                center: {
                                  x: 0,
                                  opacity: 1,
                                  scale: 1,
                                  filter: `blur(0px)`,
                                  transition: {
                                    x: {
                                      type: `spring`,
                                      stiffness: 300,
                                      damping: 30,
                                    },
                                    opacity: { duration: 0.2 },
                                    scale: { duration: 0.3 },
                                  },
                                },
                                exit: (e) => ({
                                  x: e > 0 ? `-100%` : `100%`,
                                  opacity: 0,
                                  scale: 0.92,
                                  filter: `blur(4px)`,
                                  transition: {
                                    x: {
                                      type: `spring`,
                                      stiffness: 300,
                                      damping: 30,
                                    },
                                    opacity: { duration: 0.2 },
                                    scale: { duration: 0.3 },
                                  },
                                }),
                              },
                              initial: `enter`,
                              animate: `center`,
                              exit: `exit`,
                              className: `bg-gradient-to-br from-purple-950/40 via-purple-900/30 to-cyan-950/30
                                 rounded-3xl border border-purple-500/20 overflow-hidden
                                 shadow-[0_20px_60px_rgba(0,0,0,0.6)] w-full`,
                              children: [
                                (0, N.jsxs)(`div`, {
                                  className: `relative aspect-[16/10] overflow-hidden`,
                                  children: [
                                    (0, N.jsx)(`img`, {
                                      src: m.image,
                                      alt: m.title,
                                      className: `w-full h-full object-cover`,
                                      loading: `lazy`,
                                    }),
                                    (0, N.jsx)(`div`, {
                                      className: `absolute inset-0 bg-gradient-to-t from-[#0d0221] via-[#0d0221]/40 to-transparent`,
                                    }),
                                    (0, N.jsx)(`div`, {
                                      className: `absolute top-4 right-4 px-3 py-1.5 rounded-full bg-[#0d0221]/90 backdrop-blur-sm border border-purple-500/30`,
                                      children: (0, N.jsx)(`span`, {
                                        className: `text-xs font-mono text-purple-300`,
                                        children: m.year,
                                      }),
                                    }),
                                  ],
                                }),
                                (0, N.jsxs)(`div`, {
                                  className: `p-5`,
                                  children: [
                                    (0, N.jsx)(`p`, {
                                      className: `text-xs font-mono text-purple-400 mb-2 uppercase tracking-wider`,
                                      children: m.subtitle,
                                    }),
                                    (0, N.jsx)(`h3`, {
                                      className: `text-2xl font-bold text-white mb-3`,
                                      style: { fontFamily: `Syne` },
                                      children: m.title,
                                    }),
                                    (0, N.jsx)(`p`, {
                                      className: `text-sm text-purple-200/80 leading-relaxed mb-4`,
                                      children: m.description,
                                    }),
                                    (0, N.jsx)(`div`, {
                                      className: `flex flex-wrap gap-2 mb-5`,
                                      children: m.tools
                                        .slice(0, 4)
                                        .map((e) =>
                                          (0, N.jsx)(
                                            `span`,
                                            {
                                              className: `text-xs px-3 py-1 rounded-full bg-purple-900/40 border border-purple-500/20 text-purple-200`,
                                              children: e,
                                            },
                                            e,
                                          ),
                                        ),
                                    }),
                                    (0, N.jsxs)(`div`, {
                                      className: `flex gap-3`,
                                      children: [
                                        m.liveUrl &&
                                          m.liveUrl !== `#` &&
                                          (0, N.jsx)(`a`, {
                                            href: m.liveUrl,
                                            target: `_blank`,
                                            rel: `noopener noreferrer`,
                                            className: `flex-1 text-center bg-gradient-to-r from-purple-600 to-violet-600
                                       text-white font-semibold text-sm px-5 py-3 rounded-full
                                       shadow-[0_0_30px_rgba(108,43,217,0.4)]
                                       active:scale-95 transition-transform`,
                                            children: `Visit Site →`,
                                          }),
                                        m.githubUrl &&
                                          m.githubUrl !== `#` &&
                                          (0, N.jsx)(`a`, {
                                            href: m.githubUrl,
                                            target: `_blank`,
                                            rel: `noopener noreferrer`,
                                            className: `px-5 py-3 rounded-full border border-purple-500/30
                                       text-purple-300 text-sm font-semibold
                                       active:scale-95 transition-transform`,
                                            children: `Code`,
                                          }),
                                      ],
                                    }),
                                  ],
                                }),
                              ],
                            },
                            m.id,
                          ),
                        }),
                      }),
                      (0, N.jsx)(`div`, {
                        className: `flex justify-center gap-2 mt-5 mb-1`,
                        children: p.map((e, t) => {
                          let r = t === n
                          return (0, N.jsx)(
                            `button`,
                            {
                              onClick: () => h(t),
                              "aria-label": `Go to project ${t + 1}`,
                              style: {
                                width: r ? `24px` : `8px`,
                                height: `8px`,
                                borderRadius: `9999px`,
                                background: r
                                  ? `linear-gradient(90deg, #8b4fe8, #c9a7ff)`
                                  : `rgba(108, 43, 217, 0.32)`,
                                border: r
                                  ? `1px solid rgba(255, 255, 255, 0.3)`
                                  : `1px solid transparent`,
                                cursor: `pointer`,
                                transition: `all 0.3s cubic-bezier(0.16, 1, 0.3, 1)`,
                                boxShadow: r
                                  ? `0 0 12px rgba(139, 79, 232, 0.7)`
                                  : `none`,
                                padding: 0,
                                outline: `none`,
                              },
                              className: `active:scale-90`,
                            },
                            t,
                          )
                        }),
                      }),
                      (0, N.jsxs)(`div`, {
                        className: `flex justify-center gap-8 mt-6`,
                        children: [
                          (0, N.jsx)(`button`, {
                            onClick: () => h(n - 1),
                            className: `w-14 h-14 rounded-full bg-purple-900/30 border border-purple-500/30
                             text-purple-300 flex items-center justify-center text-2xl
                             active:scale-95 transition-transform`,
                            "aria-label": `Previous project`,
                            children: `←`,
                          }),
                          (0, N.jsx)(`button`, {
                            onClick: () => h(n + 1),
                            className: `w-14 h-14 rounded-full bg-purple-900/30 border border-purple-500/30
                             text-purple-300 flex items-center justify-center text-2xl
                             active:scale-95 transition-transform`,
                            "aria-label": `Next project`,
                            children: `→`,
                          }),
                        ],
                      }),
                    ],
                  }),
                }),
                (0, N.jsxs)(`div`, {
                  className: `hidden md:block projects-orbit`,
                  children: [
                    (0, N.jsxs)(`nav`, {
                      className: `projects-orbit-nav`,
                      "aria-label": `Project orbit navigation`,
                      children: [
                        (0, N.jsx)(`div`, {
                          className: `projects-orbit-beam`,
                          "aria-hidden": `true`,
                        }),
                        p.map((e, t) => {
                          let i = t === n
                          return (0, N.jsxs)(
                            `button`,
                            {
                              type: `button`,
                              className: `projects-orbit-node${
                                i ? ` projects-orbit-node--active` : ``
                              }`,
                              onClick: () => r(t),
                              "aria-current": i ? `true` : void 0,
                              children: [
                                (0, N.jsx)(`span`, {
                                  className: `projects-orbit-node-orbit`,
                                  "aria-hidden": `true`,
                                  children: (0, N.jsx)(`span`, {
                                    className: `projects-orbit-node-core`,
                                  }),
                                }),
                                (0, N.jsxs)(`span`, {
                                  className: `projects-orbit-node-text`,
                                  children: [
                                    (0, N.jsx)(`span`, {
                                      className: `projects-orbit-node-num`,
                                      children: String(t + 1).padStart(2, `0`),
                                    }),
                                    (0, N.jsx)(`span`, {
                                      className: `projects-orbit-node-title`,
                                      children: e.title,
                                    }),
                                    (0, N.jsx)(`span`, {
                                      className: `projects-orbit-node-year`,
                                      children: e.year,
                                    }),
                                  ],
                                }),
                              ],
                            },
                            e.id,
                          )
                        }),
                      ],
                    }),
                    (0, N.jsxs)(`div`, {
                      className: `projects-orbit-stage`,
                      children: [
                        (0, N.jsxs)(`div`, {
                          className: `projects-orbit-preview-wrap`,
                          children: [
                            (0, N.jsx)(`div`, {
                              className: `projects-orbit-ring projects-orbit-ring--outer`,
                              "aria-hidden": `true`,
                            }),
                            (0, N.jsx)(`div`, {
                              className: `projects-orbit-ring projects-orbit-ring--inner`,
                              "aria-hidden": `true`,
                            }),
                            (0, N.jsx)(
                              we,
                              {
                                className: `projects-orbit-preview`,
                                children:
                                  m.liveUrl && m.liveUrl !== `#`
                                    ? (0, N.jsxs)(`a`, {
                                        href: m.liveUrl,
                                        target: `_blank`,
                                        rel: `noopener noreferrer`,
                                        style: {
                                          position: `relative`,
                                          display: `block`,
                                          width: `100%`,
                                          height: `100%`,
                                          textDecoration: `none`,
                                        },
                                        children: [
                                          (0, N.jsx)(`img`, {
                                            src: m.image,
                                            alt: m.title,
                                            className: `projects-orbit-preview-img`,
                                            loading: `lazy`,
                                            decoding: `async`,
                                            width: `1920`,
                                            height: `1080`,
                                          }),
                                          (0, N.jsx)(`div`, {
                                            style: {
                                              position: `absolute`,
                                              inset: 0,
                                              background: `linear-gradient(to top, rgba(108, 43, 217, 0.95) 0%, rgba(108, 43, 217, 0.75) 50%, rgba(108, 43, 217, 0.85) 100%)`,
                                              display: `flex`,
                                              alignItems: `center`,
                                              justifyContent: `center`,
                                              opacity: 0,
                                              transition: `opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1)`,
                                            },
                                            className: `projects-orbit-preview-overlay`,
                                            children: (0, N.jsxs)(`div`, {
                                              style: {
                                                fontFamily: `Syne`,
                                                fontSize: `1.25rem`,
                                                fontWeight: 700,
                                                color: `#ffffff`,
                                                textAlign: `center`,
                                                display: `flex`,
                                                alignItems: `center`,
                                                gap: `0.75rem`,
                                                padding: `1rem 2rem`,
                                                borderRadius: `9999px`,
                                                background: `rgba(255, 255, 255, 0.15)`,
                                                backdropFilter: `blur(8px)`,
                                                border: `2px solid rgba(255, 255, 255, 0.3)`,
                                                boxShadow: `0 8px 32px rgba(0, 0, 0, 0.3)`,
                                              },
                                              children: [
                                                `Visit Website`,
                                                (0, N.jsx)(`span`, {
                                                  style: {
                                                    display: `inline-block`,
                                                    fontSize: `1.1rem`,
                                                  },
                                                  children: `↗`,
                                                }),
                                              ],
                                            }),
                                          }),
                                          (0, N.jsx)(`div`, {
                                            className: `projects-orbit-preview-shade`,
                                          }),
                                          (0, N.jsx)(`span`, {
                                            className: `projects-orbit-preview-ghost`,
                                            "aria-hidden": `true`,
                                            children: String(n + 1).padStart(
                                              2,
                                              `0`,
                                            ),
                                          }),
                                          (0, N.jsx)(`span`, {
                                            className: `projects-orbit-preview-metric`,
                                            children: m.metrics,
                                          }),
                                        ],
                                      })
                                    : (0, N.jsxs)(N.Fragment, {
                                        children: [
                                          (0, N.jsx)(`img`, {
                                            src: m.image,
                                            alt: m.title,
                                            className: `projects-orbit-preview-img`,
                                            loading: `lazy`,
                                            decoding: `async`,
                                            width: `1920`,
                                            height: `1080`,
                                          }),
                                          (0, N.jsx)(`div`, {
                                            className: `projects-orbit-preview-shade`,
                                          }),
                                          (0, N.jsx)(`span`, {
                                            className: `projects-orbit-preview-ghost`,
                                            "aria-hidden": `true`,
                                            children: String(n + 1).padStart(
                                              2,
                                              `0`,
                                            ),
                                          }),
                                          (0, N.jsx)(`span`, {
                                            className: `projects-orbit-preview-metric`,
                                            children: m.metrics,
                                          }),
                                        ],
                                      }),
                              },
                              m.id,
                            ),
                          ],
                        }),
                        (0, N.jsxs)(
                          `div`,
                          {
                            className: `projects-orbit-details`,
                            children: [
                              (0, N.jsxs)(`p`, {
                                className: `projects-orbit-details-meta`,
                                children: [m.year, ` · `, m.subtitle],
                              }),
                              m.liveUrl && m.liveUrl !== `#`
                                ? (0, N.jsx)(`a`, {
                                    href: m.liveUrl,
                                    target: `_blank`,
                                    rel: `noopener noreferrer`,
                                    style: {
                                      textDecoration: `none`,
                                      color: `inherit`,
                                      display: `inline-block`,
                                    },
                                    onMouseEnter: (e) => {
                                      e.currentTarget.style.color = `#c9a7ff`
                                    },
                                    onMouseLeave: (e) => {
                                      e.currentTarget.style.color = `#f0e8ff`
                                    },
                                    children: (0, N.jsx)(`h3`, {
                                      className: `projects-orbit-details-title`,
                                      children: m.title,
                                    }),
                                  })
                                : (0, N.jsx)(`h3`, {
                                    className: `projects-orbit-details-title`,
                                    children: m.title,
                                  }),
                              (0, N.jsx)(`p`, {
                                className: `projects-orbit-details-desc`,
                                children: m.longDescription,
                              }),
                              (0, N.jsx)(`div`, {
                                className: `projects-orbit-tools`,
                                children: m.tools.map((e) =>
                                  (0, N.jsx)(
                                    `span`,
                                    {
                                      className: `projects-orbit-tool`,
                                      children: e,
                                    },
                                    e,
                                  ),
                                ),
                              }),
                              (0, N.jsxs)(`div`, {
                                className: `projects-orbit-actions`,
                                children: [
                                  (0, N.jsx)(`div`, {
                                    style: {
                                      display: `flex`,
                                      gap: `0.75rem`,
                                      flexWrap: `wrap`,
                                    },
                                    children:
                                      m.liveUrl &&
                                      m.liveUrl !== `#` &&
                                      (0, N.jsx)(`a`, {
                                        href: m.liveUrl,
                                        target: `_blank`,
                                        rel: `noopener noreferrer`,
                                        className: `projects-orbit-cta`,
                                        children: `Visit Website →`,
                                      }),
                                  }),
                                  (0, N.jsxs)(`div`, {
                                    className: `projects-orbit-arrows`,
                                    children: [
                                      (0, N.jsx)(`button`, {
                                        type: `button`,
                                        className: `projects-orbit-arrow-btn`,
                                        onClick: () => h(n - 1),
                                        "aria-label": `Previous project`,
                                        children: `←`,
                                      }),
                                      (0, N.jsx)(`button`, {
                                        type: `button`,
                                        className: `projects-orbit-arrow-btn`,
                                        onClick: () => h(n + 1),
                                        "aria-label": `Next project`,
                                        children: `→`,
                                      }),
                                    ],
                                  }),
                                ],
                              }),
                            ],
                          },
                          `details-${m.id}`,
                        ),
                      ],
                    }),
                  ],
                }),
              ],
            }),
          }),
        ],
      }),
    })
  )
}
function Ee({ step: e, title: t, desc: n, icon: r }) {
  let [i, a] = (0, d.useState)(!1)
  return (0, N.jsxs)(`div`, {
    onMouseEnter: () => a(!0),
    onMouseLeave: () => a(!1),
    style: { textAlign: `center`, cursor: `default`, padding: `0 0.5rem` },
    children: [
      (0, N.jsx)(`div`, {
        style: {
          width: `68px`,
          height: `68px`,
          borderRadius: `50%`,
          margin: `0 auto 2rem`,
          border: `1px solid ${
            i ? `rgba(139,79,232,0.95)` : `rgba(108,43,217,0.38)`
          }`,
          background: i ? `rgba(108,43,217,0.25)` : `rgba(108,43,217,0.08)`,
          display: `flex`,
          alignItems: `center`,
          justifyContent: `center`,
          color: i ? `#f0e8ff` : `#c9a7ff`,
          boxShadow: i
            ? `0 0 32px rgba(108,43,217,0.75), 0 0 64px rgba(108,43,217,0.3)`
            : `none`,
          transition: `all 0.35s cubic-bezier(0.16, 1, 0.3, 1)`,
          position: `relative`,
          zIndex: 1,
        },
        children: r,
      }),
      (0, N.jsx)(`div`, {
        style: {
          fontFamily: `Syne`,
          fontSize: `0.7rem`,
          fontWeight: 600,
          letterSpacing: `0.22em`,
          color: `#8b4fe8`,
          marginBottom: `0.625rem`,
          textTransform: `uppercase`,
        },
        children: e,
      }),
      (0, N.jsx)(`h3`, {
        style: {
          fontFamily: `Syne`,
          fontWeight: 700,
          fontSize: `1.25rem`,
          color: `#f0e8ff`,
          letterSpacing: `-0.018em`,
          marginBottom: `0.875rem`,
        },
        children: t,
      }),
      (0, N.jsx)(`p`, {
        style: {
          fontFamily: `Plus Jakarta Sans`,
          fontSize: `0.875rem`,
          lineHeight: 1.72,
          color: `rgba(201,167,255,0.65)`,
          fontWeight: 300,
        },
        children: n,
      }),
    ],
  })
}
function De() {
  return (0, N.jsx)(`section`, {
    id: `process`,
    className: `section-transition-bleed`,
    style: { padding: `9rem 2rem`, position: `relative`, zIndex: 2 },
    children: (0, N.jsxs)(`div`, {
      style: { maxWidth: `1140px`, margin: `0 auto` },
      children: [
        (0, N.jsxs)(Z, {
          style: { textAlign: `center`, marginBottom: `5.5rem` },
          children: [
            (0, N.jsx)($, { children: `05 / Methodology & Workflow` }),
            (0, N.jsx)(`h2`, {
              style: {
                fontFamily: `Syne`,
                fontWeight: 700,
                fontSize: `clamp(2.25rem, 4.2vw, 3.5rem)`,
                color: `#f0e8ff`,
                letterSpacing: `-0.028em`,
              },
              children: `The Mission Blueprint`,
            }),
          ],
        }),
        (0, N.jsxs)(`div`, {
          className: `grid-process`,
          children: [
            (0, N.jsx)(`div`, { className: `process-connector` }),
            Y.map((e, t) =>
              (0, N.jsx)(
                Z,
                {
                  delay: t * 0.12,
                  direction: `up`,
                  children: (0, N.jsx)(Ee, { ...e }),
                },
                e.title,
              ),
            ),
          ],
        }),
      ],
    }),
  })
}
function Oe() {
  return (0, N.jsxs)(`div`, {
    style: {
      background: `#0d0221`,
      minHeight: `100vh`,
      position: `relative`,
      overflowX: `hidden`,
    },
    children: [
      (0, N.jsx)(he, {}),
      (0, N.jsx)(ge, {}),
      (0, N.jsx)(ae, {}),
      (0, N.jsx)(me, {}),
      (0, N.jsxs)(`main`, {
        style: { position: `relative`, zIndex: 1, paddingTop: `5rem` },
        children: [
          (0, N.jsx)(ye, {}),
          (0, N.jsx)(Ce, {}),
          (0, N.jsx)(Te, {}),
          (0, N.jsx)(le, {}),
          (0, N.jsx)(De, {}),
          (0, N.jsx)(J, {}),
        ],
      }),
    ],
  })
}
f.createRoot(document.getElementById(`root`)).render(
  (0, N.jsx)(d.StrictMode, { children: (0, N.jsx)(Oe, {}) }),
)
