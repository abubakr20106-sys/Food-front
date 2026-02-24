"use client";

import React, {
  useState,
  useCallback,
  useMemo,
  useEffect,
  useRef,
} from "react";
import {
  IconPencil,
  IconTrash,
  IconPlus,
  IconCategory,
  IconLayoutDashboard,
  IconArrowLeft,
  IconUpload,
  IconCheck,
  IconX,
  IconShoppingBag,
  IconChefHat,
  IconMenu2,
  IconLock,
  IconEye,
  IconEyeOff,
  IconLogout,
  IconSearch,
} from "@tabler/icons-react";
import useSWR from "swr";
import Link from "next/link";

const fetcher = (url) => fetch(url).then((r) => r.json());
const API = "https://food-api-7a58.onrender.com/api";
const ADMIN_LOGIN = "admin";
const ADMIN_PASSWORD = "admin2026";
const SESSION_KEY = "almashriq_admin_auth";
const REMEMBER_KEY = "almashriq_remembered_login";

const fmtPrice = (n) => Number(n).toLocaleString("ru-RU") + " so'm";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --red:#dc2626;--red-h:#b91c1c;--red-light:#fee2e2;
  --bg:#f9fafb;--white:#fff;--border:#e5e7eb;
  --text:#111827;--muted:#6b7280;--sidebar:#111827;
  --sidebar-active:#dc2626;--sidebar-text:#9ca3af;--font:'Inter',sans-serif;
}
*,input,button,textarea,select{font-family:var(--font)}

/* LOGIN */
.login-page{min-height:100vh;display:flex;align-items:center;justify-content:center;background:var(--sidebar);padding:20px}
.login-card{background:var(--white);border-radius:24px;padding:36px 32px;width:100%;max-width:380px;box-shadow:0 24px 60px rgba(0,0,0,.35)}
.login-logo{display:flex;align-items:center;gap:12px;margin-bottom:28px}
.login-logo-ico{width:46px;height:46px;background:var(--red);border-radius:14px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.login-title{font-size:20px;font-weight:800;color:var(--text)}
.login-sub{font-size:12px;color:var(--muted);margin-top:2px}
.lfield{margin-bottom:14px}
.llbl{font-size:12px;font-weight:600;color:var(--muted);margin-bottom:5px;display:block}
.linp-wrap{position:relative}
.linp{width:100%;background:#f9fafb;border:1.5px solid var(--border);border-radius:12px;padding:11px 40px 11px 13px;font-size:14px;color:var(--text);outline:none;transition:border-color .15s}
.linp.has-clear{padding-right:68px}
.linp:focus{border-color:var(--red);background:#fff}
.linp.err-inp{border-color:#ef4444;background:#fff8f8}
.linp-icons{position:absolute;right:10px;top:50%;transform:translateY(-50%);display:flex;align-items:center;gap:2px}
.leye{background:none;border:none;cursor:pointer;color:var(--muted);display:flex;align-items:center;padding:3px}
.lclear{background:none;border:none;cursor:pointer;color:var(--muted);display:flex;align-items:center;padding:3px;border-radius:50%;transition:all .15s}
.lclear:hover{color:var(--red);background:var(--red-light)}
.lerr{color:#ef4444;font-size:11.5px;margin-top:5px;font-weight:500;display:flex;align-items:center;gap:4px}
.login-btn{width:100%;padding:13px;background:var(--red);color:#fff;border:none;border-radius:12px;font-size:14px;font-weight:700;cursor:pointer;margin-top:8px;transition:background .15s;box-shadow:0 4px 14px rgba(220,38,38,.35);display:flex;align-items:center;justify-content:center;gap:7px}
.login-btn:hover:not(:disabled){background:var(--red-h)}
.login-btn:disabled{opacity:.6;cursor:not-allowed}
.remember-row{display:flex;align-items:center;gap:8px;margin-top:4px;margin-bottom:2px}
.remember-cb{width:16px;height:16px;accent-color:var(--red);cursor:pointer;flex-shrink:0}
.remember-lbl{font-size:12px;color:var(--muted);cursor:pointer;user-select:none}
.shake{animation:shake .4s ease}
@keyframes shake{0%,100%{transform:none}20%{transform:translateX(-8px)}40%{transform:translateX(8px)}60%{transform:translateX(-5px)}80%{transform:translateX(5px)}}

/* LAYOUT */
.wrap{display:flex;min-height:100vh;background:var(--bg)}
.nav-overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:90}
.nav-overlay.open{display:block}
.sb{width:240px;background:var(--sidebar);min-height:100vh;display:flex;flex-direction:column;position:fixed;left:0;top:0;bottom:0;z-index:100;transition:transform .28s ease}
.sb-logo{padding:20px 18px 16px;border-bottom:1px solid rgba(255,255,255,.08);display:flex;align-items:center;gap:10px}
.sb-logo-icon{width:38px;height:38px;background:var(--red);border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.sb-name{font-size:16px;font-weight:800;color:#fff;letter-spacing:-.2px}
.sb-sub{font-size:11px;color:rgba(255,255,255,.3);margin-top:1px}
.sb-nav{padding:14px 10px;flex:1}
.sb-sec{font-size:10px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;color:rgba(255,255,255,.2);padding:0 8px;margin:12px 0 5px}
.sb-item{display:flex;align-items:center;gap:9px;width:100%;padding:10px;border-radius:10px;border:none;background:none;font-size:13.5px;font-weight:500;color:var(--sidebar-text);cursor:pointer;text-align:left;margin-bottom:2px;transition:all .15s}
.sb-item:hover{background:rgba(255,255,255,.06);color:#fff}
.sb-item.on{background:var(--sidebar-active);color:#fff;font-weight:600;box-shadow:0 4px 14px rgba(220,38,38,.35)}
.sb-item.out{color:rgba(255,255,255,.3)}
.sb-item.out:hover{background:rgba(220,38,38,.12);color:#fca5a5}
.sb-foot{padding:12px 10px;border-top:1px solid rgba(255,255,255,.08)}
.sb-back{display:flex;align-items:center;gap:8px;padding:9px 10px;border-radius:10px;color:rgba(255,255,255,.3);font-size:13px;font-weight:500;text-decoration:none;transition:all .15s}
.sb-back:hover{background:rgba(255,255,255,.06);color:rgba(255,255,255,.7)}
.main{margin-left:240px;flex:1;display:flex;flex-direction:column}
.topbar{background:var(--white);border-bottom:1px solid var(--border);padding:14px 20px;display:flex;align-items:center;gap:12px;position:sticky;top:0;z-index:50;box-shadow:0 1px 3px rgba(0,0,0,.05)}
.hamburger{display:none;width:36px;height:36px;background:var(--bg);border:1px solid var(--border);border-radius:9px;align-items:center;justify-content:center;cursor:pointer;color:var(--text);flex-shrink:0}
.pg-title{font-size:16px;font-weight:700;color:var(--text)}
.pg-sub{font-size:12px;color:var(--muted);margin-top:2px}
.out-btn{display:flex;align-items:center;gap:6px;padding:7px 12px;border-radius:9px;border:1px solid var(--border);background:none;color:var(--muted);font-size:13px;font-weight:600;cursor:pointer;transition:all .15s;margin-left:auto}
.out-btn:hover{background:var(--red-light);color:var(--red);border-color:#fca5a5}
.content{padding:20px;flex:1}

/* STATS */
.stat-row{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:18px}
.stat-card{background:var(--white);border:1px solid var(--border);border-radius:16px;padding:18px;transition:box-shadow .2s}
.stat-card:hover{box-shadow:0 4px 16px rgba(0,0,0,.06)}
.stat-ico{width:40px;height:40px;border-radius:10px;display:flex;align-items:center;justify-content:center;margin-bottom:12px}
.stat-n{font-size:30px;font-weight:800;color:var(--text);line-height:1}
.stat-l{font-size:11px;font-weight:600;letter-spacing:.5px;text-transform:uppercase;color:var(--muted);margin-top:4px}



/* BOX & TABLE */
.box{background:var(--white);border:1px solid var(--border);border-radius:16px;overflow:hidden}
.box-head{padding:14px 18px;border-bottom:1px solid var(--border);font-size:13.5px;font-weight:700;color:var(--text);display:flex;align-items:center;gap:10px}
.tbl{width:100%;border-collapse:collapse}
.tbl th{padding:10px 16px;font-size:10.5px;font-weight:700;letter-spacing:.6px;text-transform:uppercase;color:var(--muted);text-align:left;border-bottom:1px solid var(--border);background:#f9fafb}
.tbl td{padding:12px 16px;font-size:13.5px;color:var(--text);border-bottom:1px solid var(--border)}
.tbl tr:last-child td{border-bottom:none}
.tbl tbody tr:hover td{background:#fafafa}

/* FILTERS BAR */
.filters-bar{display:flex;align-items:center;gap:8px;padding:12px 16px;border-bottom:1px solid var(--border);flex-wrap:wrap;background:#fafafa}
.search-wrap{position:relative;flex:1;min-width:160px}
.search-ico{position:absolute;left:10px;top:50%;transform:translateY(-50%);color:var(--muted);pointer-events:none}
.search-inp{width:100%;background:#fff;border:1px solid var(--border);border-radius:10px;padding:8px 10px 8px 32px;font-size:13px;color:var(--text);outline:none;transition:border-color .15s}
.search-inp:focus{border-color:var(--red)}
.search-clear{position:absolute;right:8px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;color:var(--muted);display:flex;padding:2px;border-radius:50%}
.search-clear:hover{color:var(--red)}
.fsel{background:#fff;border:1px solid var(--border);border-radius:10px;padding:8px 10px;font-size:13px;color:var(--text);outline:none;cursor:pointer;transition:border-color .15s}
.fsel:focus{border-color:var(--red)}
.results-count{font-size:12px;color:var(--muted);white-space:nowrap}

/* PRODUCTS GRID */
.p-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:12px;padding:16px}
.p-card{background:var(--white);border:1px solid var(--border);border-radius:16px;overflow:hidden;transition:all .2s}
.p-card:hover{box-shadow:0 6px 20px rgba(0,0,0,.09);transform:translateY(-2px)}
.p-img{width:100%;aspect-ratio:1;object-fit:cover;background:#f3f4f6;display:block}
.p-body{padding:11px}
.p-name{font-size:13px;font-weight:700;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-bottom:3px}
.p-cat{display:inline-block;font-size:10px;font-weight:600;padding:2px 8px;border-radius:20px;background:var(--red-light);color:var(--red);margin-bottom:6px}
.p-desc{font-size:11.5px;color:var(--muted);line-height:1.4;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;min-height:32px;margin-bottom:7px}
.p-price{font-size:14px;font-weight:800;color:var(--red)}
.p-acts{display:flex;justify-content:flex-end;gap:6px;margin-top:9px;padding-top:9px;border-top:1px solid var(--border)}

/* BUTTONS */
.ibtn{width:30px;height:30px;border-radius:8px;border:1px solid var(--border);background:none;display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--muted);transition:all .15s}
.ibtn.e:hover{background:#eff6ff;border-color:#bfdbfe;color:#2563eb}
.ibtn.d:hover{background:var(--red-light);border-color:#fca5a5;color:var(--red)}
.ibtn:disabled{opacity:.4;cursor:not-allowed}
.pbtn{width:100%;padding:12px;background:var(--red);color:#fff;border:none;border-radius:12px;font-size:14px;font-weight:700;cursor:pointer;margin-top:16px;transition:background .15s;box-shadow:0 4px 14px rgba(220,38,38,.3);display:flex;align-items:center;justify-content:center;gap:7px}
.pbtn:hover:not(:disabled){background:var(--red-h)}
.pbtn:disabled{opacity:.6;cursor:not-allowed}
.sbtn{padding:9px 15px;background:var(--bg);color:var(--text);border:1px solid var(--border);border-radius:10px;font-size:13px;font-weight:600;cursor:pointer;transition:all .15s}
.sbtn:hover{background:var(--border)}
.dbtn{padding:9px 15px;background:var(--red-light);color:var(--red);border:1px solid #fca5a5;border-radius:10px;font-size:13px;font-weight:700;cursor:pointer;transition:all .15s;display:flex;align-items:center;gap:6px}
.dbtn:hover:not(:disabled){background:#fecaca}
.dbtn:disabled{opacity:.6;cursor:not-allowed}
.add-btn{padding:9px 14px;background:var(--red);color:#fff;border:none;border-radius:10px;font-size:13px;font-weight:700;cursor:pointer;display:flex;align-items:center;gap:5px;white-space:nowrap;transition:background .15s;box-shadow:0 3px 10px rgba(220,38,38,.25)}
.add-btn:hover:not(:disabled){background:var(--red-h)}
.add-btn:disabled{opacity:.6;cursor:not-allowed}

/* FORM */
.flbl{font-size:12px;font-weight:600;color:var(--muted);margin-bottom:5px;display:block}
.finput{width:100%;background:#f9fafb;border:1px solid var(--border);border-radius:12px;padding:10px 13px;font-size:13.5px;color:var(--text);outline:none;transition:border-color .15s}
.finput:focus{border-color:var(--red);background:#fff}
.finput::placeholder{color:#d1d5db}
textarea.finput{resize:vertical;min-height:75px}
select.finput{cursor:pointer}
.up-btn{display:flex;align-items:center;gap:7px;padding:9px 13px;background:#f9fafb;border:1px solid var(--border);border-radius:12px;color:var(--muted);font-size:13px;font-weight:600;cursor:pointer;transition:all .15s;white-space:nowrap}
.up-btn:hover{border-color:var(--red);color:var(--red);background:var(--red-light)}
.img-prev{width:64px;height:64px;border-radius:10px;object-fit:cover;border:1px solid var(--border);flex-shrink:0}
.clr-btn{font-size:12px;color:var(--red);background:none;border:none;cursor:pointer;font-weight:600;padding:2px 0}
.ferr{color:var(--red);font-size:11.5px;margin-top:3px;font-weight:500}
.fgrid{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.fgrid .full{grid-column:1/-1}
.cbadge{display:inline-flex;align-items:center;justify-content:center;min-width:22px;height:20px;padding:0 7px;border-radius:20px;font-size:11.5px;font-weight:700;background:var(--red-light);color:var(--red)}

/* MODAL */
.overlay{position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:200;display:flex;align-items:flex-end;justify-content:center}
@media(min-width:640px){.overlay{align-items:center;padding:16px}}
.mbox{background:var(--white);width:100%;max-width:520px;border-radius:24px 24px 0 0;max-height:92vh;overflow-y:auto;padding:24px;box-shadow:0 -8px 40px rgba(0,0,0,.12)}
@media(min-width:640px){.mbox{border-radius:24px;box-shadow:0 24px 60px rgba(0,0,0,.15)}}
.mbox.sm{max-width:380px}
.mhead{display:flex;align-items:center;justify-content:space-between;margin-bottom:20px}
.mtitle{font-size:18px;font-weight:800;color:var(--text)}
.mclose{width:30px;height:30px;border-radius:50%;background:#f3f4f6;border:none;color:var(--muted);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .15s}
.mclose:hover{background:var(--border);color:var(--text)}

/* NOTIF */
.notif{position:fixed;top:16px;right:16px;z-index:999;background:var(--white);border:1px solid var(--border);border-radius:14px;padding:12px 16px;display:flex;align-items:center;gap:10px;min-width:220px;max-width:320px;box-shadow:0 8px 30px rgba(0,0,0,.12);animation:nsl .25s ease}
.notif.s{border-left:3px solid #16a34a}
.notif.e{border-left:3px solid var(--red)}
.nicon{width:28px;height:28px;border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.nicon.s{background:#dcfce7;color:#16a34a}
.nicon.e{background:var(--red-light);color:var(--red)}
.ntit{font-size:13px;font-weight:700;color:var(--text)}
.nsub{font-size:11.5px;color:var(--muted);margin-top:1px;word-break:break-word}
@keyframes nsl{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:none}}

/* SPINNER */
.spin{width:32px;height:32px;border:3px solid var(--border);border-top-color:var(--red);border-radius:50%;animation:sp .75s linear infinite;margin:0 auto 10px}
@keyframes sp{to{transform:rotate(360deg)}}
.spin-sm{width:14px;height:14px;border:2px solid rgba(255,255,255,.4);border-top-color:#fff;border-radius:50%;animation:sp .75s linear infinite;flex-shrink:0}
.spin-sm.dark{border-color:rgba(0,0,0,.15);border-top-color:var(--red)}

/* EMPTY */
.empty{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:60px 20px;text-align:center}
.empty-ico{width:56px;height:56px;border-radius:16px;background:var(--bg);border:1px solid var(--border);display:flex;align-items:center;justify-content:center;margin-bottom:14px}
.empty-title{font-size:15px;font-weight:700;color:var(--text);margin-bottom:5px}
.empty-sub{font-size:13px;color:var(--muted)}

@media(max-width:700px){
  .sb{transform:translateX(-100%)}
  .sb.open{transform:none}
  .main{margin-left:0}
  .hamburger{display:flex}
  .fgrid{grid-template-columns:1fr}
  .p-grid{grid-template-columns:repeat(2,1fr)}
  .content{padding:14px}
  .topbar{padding:12px 14px}
  .filters-bar{gap:6px}
}
@media(max-width:380px){.p-grid{grid-template-columns:1fr}.stat-row{grid-template-columns:1fr}}
`;

const compressImage = (file) =>
  new Promise((resolve, reject) => {
    if (typeof window === "undefined") return reject("SSR");
    const r = new FileReader();
    r.readAsDataURL(file);
    r.onload = (ev) => {
      const img = new window.Image();
      img.src = ev.target.result;
      img.onload = () => {
        const MAX = 400;
        const scale = img.width > MAX ? MAX / img.width : 1;
        const c = document.createElement("canvas");
        c.width = Math.round(img.width * scale);
        c.height = Math.round(img.height * scale);
        c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
        resolve(c.toDataURL("image/jpeg", 0.5));
      };
      img.onerror = reject;
    };
    r.onerror = reject;
  });

// ===== LOGIN =====
function LoginScreen({ onLogin }) {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [err, setErr] = useState("");
  const [shake, setShake] = useState(false);
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(REMEMBER_KEY);
      if (saved) {
        setLogin(saved);
        setRemember(true);
      }
    } catch {}
  }, []);

  const submit = async (e) => {
    e?.preventDefault();
    if (loading) return;
    setErr("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    if (login.trim() === ADMIN_LOGIN && password === ADMIN_PASSWORD) {
      try {
        if (remember) localStorage.setItem(REMEMBER_KEY, login.trim());
        else localStorage.removeItem(REMEMBER_KEY);
      } catch {}
      sessionStorage.setItem(SESSION_KEY, "1");
      onLogin();
    } else {
      setShake(true);
      setErr("Login yoki parol noto'g'ri");
      setPassword("");
      setTimeout(() => setShake(false), 400);
    }
    setLoading(false);
  };

  return (
    <div className="login-page">
      <div className={`login-card ${shake ? "shake" : ""}`}>
        <div className="login-logo">
          <div className="login-logo-ico">
            <IconChefHat size={24} color="#fff" />
          </div>
          <div>
            <div className="login-title">Almashriq</div>
            <div className="login-sub">Admin Panel</div>
          </div>
        </div>
        <form onSubmit={submit}>
          <div className="lfield">
            <label className="llbl">Login</label>
            <div className="linp-wrap">
              <input
                className={`linp ${login ? "has-clear" : ""} ${err ? "err-inp" : ""}`}
                value={login}
                onChange={(e) => {
                  setLogin(e.target.value);
                  setErr("");
                }}
                placeholder="admin"
                autoComplete="username"
                autoFocus
              />
              {login && (
                <div className="linp-icons">
                  <button
                    type="button"
                    className="lclear"
                    onClick={() => {
                      setLogin("");
                      setErr("");
                    }}
                  >
                    <IconX size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="lfield">
            <label className="llbl">Parol</label>
            <div className="linp-wrap">
              <input
                className={`linp ${err ? "err-inp" : ""}`}
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErr("");
                }}
                placeholder="••••••••"
                autoComplete="current-password"
              />
              <div className="linp-icons">
                <button
                  type="button"
                  className="leye"
                  onClick={() => setShowPass((v) => !v)}
                >
                  {showPass ? <IconEyeOff size={16} /> : <IconEye size={16} />}
                </button>
              </div>
            </div>
          </div>
          <div className="remember-row">
            <input
              id="rem-cb"
              type="checkbox"
              className="remember-cb"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
            <label htmlFor="rem-cb" className="remember-lbl">
              Loginni eslab qol
            </label>
          </div>
          {err && (
            <div className="lerr" style={{ marginTop: 10 }}>
              <IconX size={12} /> {err}
            </div>
          )}
          <button className="login-btn" type="submit" disabled={loading}>
            {loading ? <span className="spin-sm" /> : <IconLock size={15} />}
            {loading ? "Tekshirilmoqda..." : "Kirish"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ===== FORM BODY =====
const FormBody = React.memo(
  ({ form, setForm, errs, setErrs, catOpts, onSave, saving, isEdit }) => {
    const F = (k) => (e) => {
      setForm((f) => ({ ...f, [k]: e.target.value }));
      if (errs[k]) setErrs((prev) => ({ ...prev, [k]: "" }));
    };
    const handleImg = async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      try {
        const base64 = await compressImage(file);
        setForm((f) => ({ ...f, image: base64 }));
        if (errs.image) setErrs((prev) => ({ ...prev, image: "" }));
      } catch {}
    };
    return (
      <div className="fgrid">
        <div>
          <label className="flbl">Mahsulot nomi *</label>
          <input
            className="finput"
            value={form.name}
            onChange={F("name")}
            placeholder="Osh, Lag'mon..."
          />
          {errs.name && <div className="ferr">{errs.name}</div>}
        </div>
        <div>
          <label className="flbl">Narxi (so'm) *</label>
          <input
            className="finput"
            type="number"
            value={form.price}
            onChange={F("price")}
            placeholder="25000"
            min="0"
          />
          {errs.price && <div className="ferr">{errs.price}</div>}
        </div>
        <div className="full">
          <label className="flbl">Rasm *</label>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              flexWrap: "wrap",
              marginBottom: 8,
            }}
          >
            {form.image && (
              <img
                src={form.image}
                className="img-prev"
                alt=""
                onError={(e) => (e.target.style.display = "none")}
              />
            )}
            <label className="up-btn">
              <IconUpload size={13} /> Galereyadan tanlash
              <input
                type="file"
                accept="image/*"
                onChange={handleImg}
                style={{ display: "none" }}
              />
            </label>
            {form.image && (
              <button
                className="clr-btn"
                onClick={() => setForm((f) => ({ ...f, image: "" }))}
              >
                O'chirish
              </button>
            )}
          </div>
          <input
            className="finput"
            value={form.image.startsWith("data:") ? "" : form.image}
            onChange={(e) => {
              setForm((f) => ({ ...f, image: e.target.value }));
              if (errs.image) setErrs((p) => ({ ...p, image: "" }));
            }}
            placeholder="Yoki rasm URL kiriting"
          />
          {errs.image && <div className="ferr">{errs.image}</div>}
        </div>
        <div className="full">
          <label className="flbl">Kategoriya *</label>
          <select
            className="finput"
            value={form.category}
            onChange={F("category")}
          >
            <option value="">Tanlang...</option>
            {catOpts.map((c) => (
              <option key={c.v} value={c.v}>
                {c.l}
              </option>
            ))}
          </select>
          {errs.category && <div className="ferr">{errs.category}</div>}
        </div>
        <div className="full">
          <label className="flbl">Tavsif</label>
          <textarea
            className="finput"
            value={form.description}
            onChange={F("description")}
            placeholder="Mahsulot haqida..."
          />
        </div>
        <div className="full">
          <button className="pbtn" onClick={onSave} disabled={saving}>
            {saving && <span className="spin-sm" />}
            {saving
              ? "Saqlanmoqda..."
              : isEdit
                ? "O'zgarishlarni saqlash"
                : "Mahsulotni saqlash"}
          </button>
        </div>
      </div>
    );
  },
);

// ===== ROOT =====
export default function AdminDashboard() {
  const [authed, setAuthed] = useState(false);
  const [checked, setChecked] = useState(false);
  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY) === "1") setAuthed(true);
    setChecked(true);
  }, []);
  const logout = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setAuthed(false);
  };
  if (!checked) return null;
  return (
    <>
      <style>{CSS}</style>
      {authed ? (
        <Dashboard onLogout={logout} />
      ) : (
        <LoginScreen onLogin={() => setAuthed(true)} />
      )}
    </>
  );
}

// ===== DASHBOARD =====
function Dashboard({ onLogout }) {
  const [tab, setTab] = useState("dashboard");
  const [sideOpen, setSideOpen] = useState(false);
  const [delOpen, setDelOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [catEditOpen, setCatEditOpen] = useState(false);
  const [catDelOpen, setCatDelOpen] = useState(false);
  const [selItem, setSelItem] = useState(null);
  const [selCat, setSelCat] = useState(null);
  const [notif, setNotif] = useState(null);

  // Filter & sort states
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("");
  const [savingProduct, setSavingProduct] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState(false);
  const [savingCat, setSavingCat] = useState(false);
  const [deletingCat, setDeletingCat] = useState(false);
  const [addingCat, setAddingCat] = useState(false);

  const {
    data: products = [],
    mutate: mutProds,
    isLoading: loadProds,
  } = useSWR(`${API}/products`, fetcher);
  const { data: categories = [], mutate: mutCats } = useSWR(
    `${API}/categories`,
    fetcher,
  );

  const toast = useCallback((msg, type = "s") => {
    setNotif({ msg, type });
    setTimeout(() => setNotif(null), 4000);
  }, []);

  const gl = useCallback((f) => {
    if (!f) return "";
    if (typeof f === "string") return f;
    return f.uzb || f.uz || f.rus || "";
  }, []);

  const [form, setForm] = useState({
    name: "",
    description: "",
    image: "",
    category: "",
    price: "",
  });
  const [errs, setErrs] = useState({});
  const [catName, setCatName] = useState("");
  const [editCatName, setEditCatName] = useState("");

  const valid = () => {
    const e = {};
    if (!form.name || form.name.length < 2) e.name = "Nomini to'liq kiriting";
    if (!form.image) e.image = "Rasm kiriting yoki URL yozing";
    if (!form.price || Number(form.price) <= 0)
      e.price = "To'g'ri narx kiriting";
    if (!form.category) e.category = "Kategoriya tanlang";
    setErrs(e);
    return !Object.keys(e).length;
  };

  const resetF = useCallback(() => {
    setForm({ name: "", description: "", image: "", category: "", price: "" });
    setErrs({});
  }, []);

  const getErrMsg = async (res) => {
    try {
      const d = await res.json();
      return d.message || d.error || `Server xatosi (${res.status})`;
    } catch {
      return `Server xatosi (${res.status})`;
    }
  };

  const saveProduct = async () => {
    if (!valid() || savingProduct) return;
    setSavingProduct(true);
    const url = selItem ? `${API}/products/${selItem._id}` : `${API}/products`;
    try {
      const res = await fetch(url, {
        method: selItem ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          image: form.image,
          category: form.category,
          price: Number(form.price),
        }),
      });
      if (res.ok) {
        await mutProds();
        resetF();
        setSelItem(null);
        setEditOpen(false);
        setTab("products");
        toast(selItem ? "Tahrirlandi!" : "Qo'shildi!");
      } else toast(await getErrMsg(res), "e");
    } catch (err) {
      toast("Aloqa uzildi: " + (err.message || ""), "e");
    } finally {
      setSavingProduct(false);
    }
  };

  const deleteProduct = async () => {
    if (!selItem || deletingProduct) return;
    setDeletingProduct(true);
    try {
      const res = await fetch(`${API}/products/${selItem._id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        await mutProds();
        setDelOpen(false);
        setSelItem(null);
        toast("Mahsulot o'chirildi!");
      } else toast(await getErrMsg(res), "e");
    } catch (err) {
      toast("Aloqa uzildi: " + (err.message || ""), "e");
    } finally {
      setDeletingProduct(false);
    }
  };

  const addCat = async () => {
    if (!catName.trim() || catName.trim().length < 2 || addingCat) return;
    setAddingCat(true);
    try {
      const res = await fetch(`${API}/categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: catName.trim() }),
      });
      if (res.ok) {
        setCatName("");
        await mutCats();
        toast("Kategoriya qo'shildi!");
      } else toast(await getErrMsg(res), "e");
    } catch (err) {
      toast("Aloqa uzildi: " + (err.message || ""), "e");
    } finally {
      setAddingCat(false);
    }
  };

  const saveCat = async () => {
    if (!editCatName.trim() || editCatName.trim().length < 2 || savingCat)
      return;
    setSavingCat(true);
    try {
      const res = await fetch(`${API}/categories/${selCat._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editCatName.trim() }),
      });
      if (res.ok) {
        await mutCats();
        setCatEditOpen(false);
        toast("Tahrirlandi!");
      } else toast(await getErrMsg(res), "e");
    } catch (err) {
      toast("Aloqa uzildi: " + (err.message || ""), "e");
    } finally {
      setSavingCat(false);
    }
  };

  const delCat = async () => {
    if (!selCat || deletingCat) return;
    setDeletingCat(true);
    try {
      const catRes = await fetch(`${API}/categories/${selCat._id}`, {
        method: "DELETE",
      });
      if (!catRes.ok) {
        toast(await getErrMsg(catRes), "e");
        return;
      }
      await fetch(`${API}/products/category/${selCat._id}`, {
        method: "DELETE",
      });
      await Promise.all([mutCats(), mutProds()]);
      setCatDelOpen(false);
      setSelCat(null);
      toast("O'chirildi!");
    } catch (err) {
      toast("Aloqa uzildi: " + (err.message || ""), "e");
    } finally {
      setDeletingCat(false);
    }
  };

  const catName_ = useMemo(
    () => (id) => {
      const c = categories.find((c) => c._id === id || c._id === id?._id);
      return c ? gl(c.name) : "—";
    },
    [categories, gl],
  );

  const catCount = useMemo(
    () => (id) =>
      products.filter((p) => (p.category?._id || p.category) === id).length ||
      0,
    [products],
  );

  const catOpts = useMemo(
    () => categories.map((c) => ({ v: String(c._id), l: gl(c.name) })),
    [categories, gl],
  );

  // Filtered & sorted products
  const filteredProducts = useMemo(() => {
    let list = [...products];
    // Search
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (p) =>
          gl(p.name).toLowerCase().includes(q) ||
          gl(p.description).toLowerCase().includes(q),
      );
    }
    // Category filter
    if (filterCat) {
      list = list.filter((p) => (p.category?._id || p.category) === filterCat);
    }
    return list;
  }, [products, search, filterCat, gl]);

  const navs = [
    {
      id: "dashboard",
      lbl: "Dashboard",
      ic: <IconLayoutDashboard size={15} />,
    },
    { id: "products", lbl: "Mahsulotlar", ic: <IconShoppingBag size={15} /> },
    { id: "add_product", lbl: "Yangi mahsulot", ic: <IconPlus size={15} /> },
    { id: "categories", lbl: "Kategoriyalar", ic: <IconCategory size={15} /> },
  ];

  const pgTitles = {
    dashboard: ["Dashboard", "Umumiy ko'rinish"],
    products: ["Mahsulotlar", `${products.length} ta mahsulot`],
    add_product: ["Yangi mahsulot", "Menuga qo'shish"],
    categories: ["Kategoriyalar", `${categories.length} ta kategoriya`],
  };

  const goTab = (id) => {
    setTab(id);
    setSideOpen(false);
  };

  return (
    <>
      {notif && (
        <div className={`notif ${notif.type}`}>
          <div className={`nicon ${notif.type}`}>
            {notif.type === "s" ? <IconCheck size={13} /> : <IconX size={13} />}
          </div>
          <div>
            <div className="ntit">
              {notif.type === "s" ? "Muvaffaqiyatli" : "Xatolik"}
            </div>
            <div className="nsub">{notif.msg}</div>
          </div>
        </div>
      )}

      <div className="wrap">
        <div
          className={`nav-overlay ${sideOpen ? "open" : ""}`}
          onClick={() => setSideOpen(false)}
        />

        <aside className={`sb ${sideOpen ? "open" : ""}`}>
          <div className="sb-logo">
            <div className="sb-logo-icon">
              <IconChefHat size={20} color="#fff" />
            </div>
            <div>
              <div className="sb-name">Almashriq</div>
              <div className="sb-sub">Admin Panel</div>
            </div>
          </div>
          <nav className="sb-nav">
            <div className="sb-sec">Boshqaruv</div>
            {navs.map((n) => (
              <button
                key={n.id}
                className={`sb-item ${tab === n.id ? "on" : ""}`}
                onClick={() => goTab(n.id)}
              >
                {n.ic} {n.lbl}
              </button>
            ))}
          </nav>
          <div className="sb-foot">
            <Link href="/" className="sb-back">
              <IconArrowLeft size={14} /> Saytga qaytish
            </Link>
            <button
              className="sb-item out"
              style={{ width: "100%", marginTop: 4 }}
              onClick={onLogout}
            >
              <IconLogout size={15} /> Chiqish
            </button>
          </div>
        </aside>

        <div className="main">
          <div className="topbar">
            <button
              className="hamburger"
              onClick={() => setSideOpen((v) => !v)}
            >
              <IconMenu2 size={18} />
            </button>
            <div>
              <div className="pg-title">{pgTitles[tab]?.[0]}</div>
              <div className="pg-sub">{pgTitles[tab]?.[1]}</div>
            </div>
            <button className="out-btn" onClick={onLogout}>
              <IconLogout size={14} /> Chiqish
            </button>
          </div>

          <div className="content">
            {/* ===== DASHBOARD ===== */}
            {tab === "dashboard" && (
              <>
                <div className="stat-row">
                  <div className="stat-card">
                    <div className="stat-ico" style={{ background: "#fee2e2" }}>
                      <IconShoppingBag size={18} color="#dc2626" />
                    </div>
                    <div className="stat-n">{products.length}</div>
                    <div className="stat-l">Mahsulotlar</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-ico" style={{ background: "#ede9fe" }}>
                      <IconCategory size={18} color="#7c3aed" />
                    </div>
                    <div className="stat-n">{categories.length}</div>
                    <div className="stat-l">Kategoriyalar</div>
                  </div>
                </div>
                <div className="box">
                  <div className="box-head">Kategoriyalar jadvali</div>
                  {categories.length === 0 ? (
                    <div className="empty">
                      <div className="empty-ico">
                        <IconCategory size={24} color="var(--muted)" />
                      </div>
                      <div className="empty-title">Kategoriyalar yo'q</div>
                      <div className="empty-sub">
                        Kategoriyalar tabidan qo'shing
                      </div>
                    </div>
                  ) : (
                    <table className="tbl">
                      <thead>
                        <tr>
                          <th>Kategoriya</th>
                          <th style={{ textAlign: "center" }}>Mahsulotlar</th>
                        </tr>
                      </thead>
                      <tbody>
                        {categories.map((c) => (
                          <tr key={c._id}>
                            <td style={{ fontWeight: 600 }}>{gl(c.name)}</td>
                            <td style={{ textAlign: "center" }}>
                              <span className="cbadge">{catCount(c._id)}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </>
            )}

            {/* ===== PRODUCTS ===== */}
            {tab === "products" &&
              (loadProds ? (
                <div style={{ textAlign: "center", padding: 60 }}>
                  <div className="spin" />
                  <div style={{ color: "var(--muted)", fontSize: 13 }}>
                    Yuklanmoqda...
                  </div>
                </div>
              ) : (
                <div className="box">
                  {/* FILTERS */}
                  <div className="filters-bar">
                    {/* Search */}
                    <div className="search-wrap">
                      <IconSearch
                        size={14}
                        className="search-ico"
                        style={{
                          position: "absolute",
                          left: 10,
                          top: "50%",
                          transform: "translateY(-50%)",
                          color: "var(--muted)",
                        }}
                      />
                      <input
                        className="search-inp"
                        placeholder="Mahsulot qidirish..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                      {search && (
                        <button
                          className="search-clear"
                          onClick={() => setSearch("")}
                        >
                          <IconX size={13} />
                        </button>
                      )}
                    </div>

                    {/* Category filter */}
                    <select
                      className="fsel"
                      value={filterCat}
                      onChange={(e) => setFilterCat(e.target.value)}
                    >
                      <option value="">Barcha kategoriyalar</option>
                      {catOpts.map((c) => (
                        <option key={c.v} value={c.v}>
                          {c.l}
                        </option>
                      ))}
                    </select>

                    <span className="results-count">
                      {filteredProducts.length} ta
                    </span>
                  </div>

                  {filteredProducts.length === 0 ? (
                    <div className="empty">
                      <div className="empty-ico">
                        <IconShoppingBag size={24} color="var(--muted)" />
                      </div>
                      <div className="empty-title">
                        {products.length === 0
                          ? "Mahsulotlar yo'q"
                          : "Hech narsa topilmadi"}
                      </div>
                      <div className="empty-sub">
                        {products.length === 0
                          ? '"Yangi mahsulot" tabiga o\'ting'
                          : "Qidiruvni o'zgartiring"}
                      </div>
                    </div>
                  ) : (
                    <div className="p-grid">
                      {filteredProducts.map((item) => (
                        <div key={item._id} className="p-card">
                          <img
                            src={item.image}
                            className="p-img"
                            alt={gl(item.name)}
                            onError={(e) => {
                              e.target.src =
                                "https://placehold.co/400x400/f3f4f6/9ca3af?text=Rasm+yo%27q";
                            }}
                          />
                          <div className="p-body">
                            <div className="p-name">{gl(item.name)}</div>
                            <div className="p-cat">
                              {catName_(item.category)}
                            </div>
                            <div className="p-desc">
                              {gl(item.description) || "\u00a0"}
                            </div>
                            <div className="p-price">
                              {fmtPrice(item.price)}
                            </div>
                            <div className="p-acts">
                              <button
                                className="ibtn e"
                                onClick={() => {
                                  setSelItem(item);
                                  setForm({
                                    name: gl(item.name),
                                    description: gl(item.description),
                                    image: item.image || "",
                                    category: String(
                                      item.category?._id || item.category || "",
                                    ),
                                    price: item.price || "",
                                  });
                                  setEditOpen(true);
                                }}
                              >
                                <IconPencil size={13} />
                              </button>
                              <button
                                className="ibtn d"
                                onClick={() => {
                                  setSelItem(item);
                                  setDelOpen(true);
                                }}
                              >
                                <IconTrash size={13} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}

            {/* ===== ADD PRODUCT ===== */}
            {tab === "add_product" && (
              <div className="box" style={{ padding: 20 }}>
                <FormBody
                  form={form}
                  setForm={setForm}
                  errs={errs}
                  setErrs={setErrs}
                  catOpts={catOpts}
                  onSave={saveProduct}
                  saving={savingProduct}
                  isEdit={false}
                />
              </div>
            )}

            {/* ===== CATEGORIES ===== */}
            {tab === "categories" && (
              <div className="box">
                <div className="box-head">
                  <input
                    className="finput"
                    style={{ flex: 1 }}
                    value={catName}
                    onChange={(e) => setCatName(e.target.value)}
                    placeholder="Yangi kategoriya nomi..."
                    onKeyDown={(e) => e.key === "Enter" && addCat()}
                  />
                  <button
                    className="add-btn"
                    onClick={addCat}
                    disabled={addingCat}
                  >
                    {addingCat ? (
                      <span className="spin-sm" />
                    ) : (
                      <IconPlus size={14} />
                    )}{" "}
                    Qo'shish
                  </button>
                </div>
                {categories.length === 0 ? (
                  <div className="empty">
                    <div className="empty-ico">
                      <IconCategory size={24} color="var(--muted)" />
                    </div>
                    <div className="empty-title">Kategoriyalar yo'q</div>
                    <div className="empty-sub">
                      Yuqoridagi maydonga nom kiriting
                    </div>
                  </div>
                ) : (
                  <table className="tbl">
                    <thead>
                      <tr>
                        <th>Nomi</th>
                        <th style={{ textAlign: "center" }}>Soni</th>
                        <th style={{ textAlign: "right" }}>Amallar</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categories.map((c) => (
                        <tr key={c._id}>
                          <td style={{ fontWeight: 600 }}>{gl(c.name)}</td>
                          <td style={{ textAlign: "center" }}>
                            <span className="cbadge">{catCount(c._id)}</span>
                          </td>
                          <td style={{ textAlign: "right" }}>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "flex-end",
                                gap: 6,
                              }}
                            >
                              <button
                                className="ibtn e"
                                onClick={() => {
                                  setSelCat(c);
                                  setEditCatName(gl(c.name));
                                  setCatEditOpen(true);
                                }}
                              >
                                <IconPencil size={13} />
                              </button>
                              <button
                                className="ibtn d"
                                onClick={() => {
                                  setSelCat(c);
                                  setCatDelOpen(true);
                                }}
                              >
                                <IconTrash size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* EDIT PRODUCT MODAL */}
      {editOpen && (
        <div
          className="overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget && !savingProduct) {
              setEditOpen(false);
              resetF();
              setSelItem(null);
            }
          }}
        >
          <div className="mbox">
            <div className="mhead">
              <div className="mtitle">Mahsulotni tahrirlash</div>
              <button
                className="mclose"
                onClick={() => {
                  if (!savingProduct) {
                    setEditOpen(false);
                    resetF();
                    setSelItem(null);
                  }
                }}
              >
                <IconX size={14} />
              </button>
            </div>
            <FormBody
              form={form}
              setForm={setForm}
              errs={errs}
              setErrs={setErrs}
              catOpts={catOpts}
              onSave={saveProduct}
              saving={savingProduct}
              isEdit={true}
            />
          </div>
        </div>
      )}

      {/* EDIT CAT MODAL */}
      {catEditOpen && (
        <div
          className="overlay"
          onClick={(e) =>
            e.target === e.currentTarget && !savingCat && setCatEditOpen(false)
          }
        >
          <div className="mbox sm">
            <div className="mhead">
              <div className="mtitle">Kategoriyani tahrirlash</div>
              <button
                className="mclose"
                onClick={() => !savingCat && setCatEditOpen(false)}
              >
                <IconX size={14} />
              </button>
            </div>
            <label className="flbl">Kategoriya nomi</label>
            <input
              className="finput"
              value={editCatName}
              onChange={(e) => setEditCatName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && saveCat()}
            />
            <button className="pbtn" onClick={saveCat} disabled={savingCat}>
              {savingCat && <span className="spin-sm" />}
              {savingCat ? "Saqlanmoqda..." : "Saqlash"}
            </button>
          </div>
        </div>
      )}

      {/* DELETE PRODUCT MODAL */}
      {delOpen && (
        <div
          className="overlay"
          onClick={(e) =>
            e.target === e.currentTarget &&
            !deletingProduct &&
            setDelOpen(false)
          }
        >
          <div className="mbox sm">
            <div className="mhead">
              <div className="mtitle">O'chirishni tasdiqlang</div>
              <button
                className="mclose"
                onClick={() => !deletingProduct && setDelOpen(false)}
              >
                <IconX size={14} />
              </button>
            </div>
            <p
              style={{
                fontSize: 14,
                color: "var(--muted)",
                lineHeight: 1.6,
                marginBottom: 20,
              }}
            >
              <strong style={{ color: "var(--text)" }}>
                {selItem && gl(selItem.name)}
              </strong>{" "}
              mahsulotini o'chirmoqchimisiz? Bu amalni qaytarib bo'lmaydi.
            </p>
            <div
              style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}
            >
              <button
                className="sbtn"
                onClick={() => setDelOpen(false)}
                disabled={deletingProduct}
              >
                Bekor qilish
              </button>
              <button
                className="dbtn"
                onClick={deleteProduct}
                disabled={deletingProduct}
              >
                {deletingProduct && <span className="spin-sm dark" />}
                {deletingProduct ? "O'chirilmoqda..." : "Ha, o'chirish"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CAT MODAL */}
      {catDelOpen && (
        <div
          className="overlay"
          onClick={(e) =>
            e.target === e.currentTarget && !deletingCat && setCatDelOpen(false)
          }
        >
          <div className="mbox sm">
            <div className="mhead">
              <div className="mtitle">Kategoriyani o'chirish</div>
              <button
                className="mclose"
                onClick={() => !deletingCat && setCatDelOpen(false)}
              >
                <IconX size={14} />
              </button>
            </div>
            <p
              style={{
                fontSize: 14,
                color: "var(--muted)",
                lineHeight: 1.6,
                marginBottom: 20,
              }}
            >
              <strong style={{ color: "var(--text)" }}>
                {selCat && gl(selCat.name)}
              </strong>{" "}
              kategoriyasi va unga tegishli{" "}
              <strong style={{ color: "var(--red)" }}>
                {selCat ? catCount(selCat._id) : 0} ta mahsulot
              </strong>{" "}
              ham o'chiriladi. Bu amalni qaytarib bo'lmaydi.
            </p>
            <div
              style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}
            >
              <button
                className="sbtn"
                onClick={() => setCatDelOpen(false)}
                disabled={deletingCat}
              >
                Bekor qilish
              </button>
              <button className="dbtn" onClick={delCat} disabled={deletingCat}>
                {deletingCat && <span className="spin-sm dark" />}
                {deletingCat ? "O'chirilmoqda..." : "Ha, o'chirish"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
