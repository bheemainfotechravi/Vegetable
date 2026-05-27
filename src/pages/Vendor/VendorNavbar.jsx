import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { CgProfile } from "react-icons/cg";
import { IoIosLogOut } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { logoutVendor } from "../../features/vendorSlice";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const VendorNavbar = () => {
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const dropdownRef = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { vendor } = useSelector((state) => state.vendor);
  const avatarLetter = vendor?.name ? vendor.name.charAt(0).toUpperCase() : "V";

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await dispatch(logoutVendor()).unwrap();
      localStorage.removeItem("vendorToken");
      sessionStorage.removeItem("vendorToken");
      toast.success("Logged out successfully!", {
        position: "top-right",
        autoClose: 1000,
      });
      setTimeout(() => navigate("/vendor/login"), 2000);
    } catch (err) {
      toast.error(err || "Logout failed. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoggingOut(false);
      setOpen(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Syne:wght@700&display=swap');

        .vendor-nav {
          font-family: 'DM Sans', sans-serif;
          position: sticky;
          top: 0;
          z-index: 100;
          background: rgba(10, 25, 41, 0.92);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(20, 184, 166, 0.15);
          padding: 0 2rem;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .nav-logo {
          font-family: 'Syne', sans-serif;
          font-size: 1.25rem;
          font-weight: 700;
          color: #f0fdf4;
          letter-spacing: -0.03em;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .nav-logo-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: linear-gradient(135deg, #14b8a6, #6366f1);
          display: inline-block;
          animation: pulse-dot 2s ease-in-out infinite;
        }

        @keyframes pulse-dot {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.4); opacity: 0.7; }
        }

        .nav-avatar {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: linear-gradient(135deg, #14b8a6 0%, #6366f1 100%);
          color: #fff;
          font-weight: 600;
          font-size: 0.95rem;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          border: 2px solid rgba(20, 184, 166, 0.4);
          transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
          box-shadow: 0 0 0 0 rgba(20, 184, 166, 0.3);
          position: relative;
        }

        .nav-avatar:hover {
          transform: scale(1.06);
          border-color: rgba(20, 184, 166, 0.8);
          box-shadow: 0 0 16px rgba(20, 184, 166, 0.35);
        }

        .nav-avatar.open {
          border-color: #14b8a6;
          box-shadow: 0 0 20px rgba(20, 184, 166, 0.4);
        }

        .nav-dropdown {
          position: absolute;
          right: 0;
          top: calc(100% + 10px);
          width: 240px;
          background: rgba(12, 28, 44, 0.97);
          border: 1px solid rgba(20, 184, 166, 0.2);
          border-radius: 16px;
          box-shadow: 0 24px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.03);
          overflow: hidden;
          animation: dropdown-in 0.18s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          transform-origin: top right;
        }

        @keyframes dropdown-in {
          from { opacity: 0; transform: scale(0.92) translateY(-6px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }

        .dropdown-header {
          padding: 14px 16px;
          border-bottom: 1px solid rgba(20, 184, 166, 0.12);
          background: linear-gradient(135deg, rgba(20,184,166,0.08) 0%, rgba(99,102,241,0.06) 100%);
        }

        .dropdown-name {
          font-weight: 600;
          font-size: 0.9rem;
          color: #f0fdf4;
          margin: 0 0 2px;
          line-height: 1.3;
        }

        .dropdown-email {
          font-size: 0.75rem;
          color: rgba(148, 163, 184, 0.8);
          margin: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .dropdown-btn {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 11px 16px;
          background: none;
          border: none;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.85rem;
          font-weight: 500;
          color: rgba(203, 213, 225, 0.9);
          transition: background 0.15s ease, color 0.15s ease, padding-left 0.15s ease;
          text-align: left;
        }

        .dropdown-btn:hover {
          background: rgba(20, 184, 166, 0.08);
          color: #14b8a6;
          padding-left: 20px;
        }

        .dropdown-btn.logout:hover {
          background: rgba(239, 68, 68, 0.07);
          color: #f87171;
        }

        .dropdown-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          padding-left: 16px;
        }

        .dropdown-divider {
          height: 1px;
          background: rgba(20, 184, 166, 0.1);
          margin: 2px 0;
        }

        .btn-icon {
          font-size: 1.1rem;
          flex-shrink: 0;
          transition: transform 0.15s ease;
        }

        .dropdown-btn:hover .btn-icon {
          transform: scale(1.15);
        }

        .spin {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(248, 113, 113, 0.3);
          border-top-color: #f87171;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          flex-shrink: 0;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>

      <nav className="vendor-nav">
        <div className="nav-logo">
          <span className="nav-logo-dot" />
          VendorHub
        </div>

        <div style={{ position: "relative" }} ref={dropdownRef}>
          <div
            className={`nav-avatar ${open ? "open" : ""}`}
            onClick={() => setOpen(!open)}
            title={vendor?.name || "Profile"}
          >
            {avatarLetter}
          </div>

          {open && (
            <div className="nav-dropdown">
              <div className="dropdown-header">
                <p className="dropdown-name">{vendor?.name || "Guest"}</p>
                <p className="dropdown-email">{vendor?.email || "No email"}</p>
              </div>

              <button
                className="dropdown-btn"
                onClick={() => { navigate("/vendor/profile"); setOpen(false); }}
              >
                <CgProfile className="btn-icon" style={{ color: "#14b8a6" }} />
                Profile
              </button>

              <div className="dropdown-divider" />

              <button
                className="dropdown-btn logout"
                onClick={handleLogout}
                disabled={loggingOut}
              >
                {loggingOut ? (
                  <>
                    <span className="spin" />
                    Logging out…
                  </>
                ) : (
                  <>
                    <IoIosLogOut className="btn-icon" style={{ color: "#f87171" }} />
                    Logout
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default VendorNavbar;