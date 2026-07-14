import { Outlet, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

// Helper to decode JWT token payload on client side
const getRoleFromToken = (token) => {
  if (!token) return null;
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    const decoded = JSON.parse(jsonPayload);
    return decoded.role;
  } catch (e) {
    return null;
  }
};

export default function AdminLayout() {
  const navigate = useNavigate();
  const [currentUser] = useState(() =>
    JSON.parse(localStorage.getItem("currentUser") || "null")
  );

  // Protect route: redirect non-admin users
  useEffect(() => {
    const tokenRole = getRoleFromToken(currentUser?.token);
    if (!currentUser) {
      navigate("/login", { replace: true });
    } else if (currentUser.role !== "admin" || tokenRole !== "admin") {
      navigate("/", { replace: true });
    }
  }, [currentUser, navigate]);

  if (!currentUser || currentUser.role !== "admin" || getRoleFromToken(currentUser?.token) !== "admin") return null;

  return (
    <>
      <nav className="flex w-full sticky top-0 z-50 px-8 py-4 bg-white/90 border-b border-outline-variant backdrop-blur-md shadow-sm">
        <div className="max-w-container-max mx-auto w-full flex items-center justify-between gap-6">
          {/* Brand */}
          <Link
            to="/"
            className="font-bold text-xl text-primary tracking-tighter shrink-0"
          >
            IhaveComputer
          </Link>

          {/* Admin label */}
          <span className="flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-wider">
            <span className="material-symbols-outlined text-sm">admin_panel_settings</span>
            Admin Panel
          </span>

          {/* Nav Links */}
          <div className="flex items-center gap-4 ml-auto">
            <Link
              to="/manager/shipping"
              className="flex items-center gap-1.5 text-sm font-medium text-on-surface-variant hover:text-secondary transition-colors"
            >
              <span className="material-symbols-outlined text-sm">local_shipping</span>
              จัดการสถานะการขนส่ง
            </Link>
            <Link
              to="/admin/manageProduct"
              className="flex items-center gap-1.5 text-sm font-medium text-on-surface-variant hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined text-sm">inventory_2</span>
              จัดการสินค้า
            </Link>
            <Link
              to="/admin/manageUser"
              className="flex items-center gap-1.5 text-sm font-medium text-on-surface-variant hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined text-sm">inventory_2</span>
              จัดการผู้ใช้
            </Link>
            <Link
              to="/"
              className="flex items-center gap-1.5 text-sm font-medium text-on-surface-variant hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined text-sm">storefront</span>
              กลับหน้าหลัก
            </Link>
            <Link
              to="/profile"
              className="flex items-center gap-1.5 text-sm font-medium text-on-surface-variant hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined text-sm">person</span>
              โปรไฟล์
            </Link>
          </div>
        </div>
      </nav>

      <Outlet />
    </>
  );
}
