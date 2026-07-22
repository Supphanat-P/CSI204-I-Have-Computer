import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAlert } from "../../context/AlertContext";

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

export default function ManageUser() {
  const navigate = useNavigate();
  const [currentUser] = useState(() => JSON.parse(localStorage.getItem("currentUser") || "null"));
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const { showAlert } = useAlert();

  useEffect(() => {
    const tokenRole = getRoleFromToken(currentUser?.token);
    if (!currentUser || currentUser.role !== "admin" || tokenRole !== "admin") {
      navigate("/", { replace: true });
      return;
    }

    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/users", {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "ไม่สามารถโหลดผู้ใช้ได้");
        setUsers(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message || "เกิดข้อผิดพลาด");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [currentUser, navigate]);

  const filteredUsers = useMemo(() => {
    const query = search.toLowerCase();
    return users.filter((user) => {
      return (
        user.name?.toLowerCase().includes(query) ||
        user.email?.toLowerCase().includes(query) ||
        user.role?.toLowerCase().includes(query)
      );
    });
  }, [users, search]);

  const updateRole = async (userId, role) => {
    if (userId === currentUser?.id) {
      setError("ไม่สามารถเปลี่ยน role ของตัวเองได้");
      return;
    }
    const confirmed = await showAlert({
      title: "เปลียนสิทธิ์ผู้ใช้",
      message: "คุณต้องการเปลียนสิทธิ์ผู้ใช้นี้ใช่หรือไม่",
      showCancel: true,
      confirmText: "ใช่",
      cancelText: "ยกเลิก",
    });

    if (confirmed) {
      try {
        const res = await fetch("/api/users/role", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${currentUser.token}`,
          },
          body: JSON.stringify({ id: userId, role }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "เปลี่ยน role ไม่สำเร็จ");
        setUsers((prev) => prev.map((user) => (user.id === userId ? { ...user, role } : user)));
      } catch (err) {
        setError(err.message || "เกิดข้อผิดพลาด");
      }
    }
  };

  const deleteUser = async (userId, userName) => {
    const targetUser = users.find((u) => u.id === userId);
    if (targetUser?.role === "admin" || userId === currentUser?.id) {
      setError("ไม่สามารถลบบัญชีผู้ดูแลระบบ (Admin) ได้");
      return;
    }

    const confirmed = await showAlert({
      title: "ลบผู้ใช้งาน",
      message: `คุณต้องการลบผู้ใช้ "${userName}" ใช่หรือไม่`,
      showCancel: true,
      confirmText: "ลบ",
      cancelText: "ยกเลิก",
    });

    if (confirmed) {
      try {
        const res = await fetch(`/api/users/${userId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "ลบผู้ใช้ไม่สำเร็จ");
        setUsers((prev) => prev.filter((user) => user.id !== userId));
      } catch (err) {
        setError(err.message || "เกิดข้อผิดพลาด");
      }
    }
  };

  const getRoleBadge = (role) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return "bg-purple-100 text-purple-700 border border-purple-200";
      case "manager":
        return "bg-blue-100 text-blue-700 border border-blue-200";
      default:
        return "bg-gray-100 text-gray-700 border border-gray-200";
    }
  };

  if (!currentUser || currentUser.role !== "admin") return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-secondary to-primary px-margin-desktop py-10 shadow-sm">
        <div className="max-w-container-max mx-auto">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="material-symbols-outlined text-white text-3xl">admin_panel_settings</span>
                <h1 className="text-white text-3xl font-bold tracking-tight" style={{ margin: 0 }}>
                  ระบบจัดการผู้ใช้ (User Management)
                </h1>
              </div>
              <p className="text-white/70 text-sm mt-1">
                เข้าสู่ระบบในฐานะ <span className="text-white font-semibold">{currentUser?.name}</span> ({currentUser?.role})
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-container-max mx-auto px-margin-desktop py-8 space-y-6">
        {/* Search Toolbar */}
        <div className="bg-white rounded-2xl border border-outline-variant p-4 flex flex-wrap gap-3 items-center shadow-sm">
          <div className="relative flex-1 min-w-[200px]">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">
              search
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ค้นหาโดยชื่อ อีเมล หรือบทบาท..."
              className="w-full pl-10 pr-4 py-2 bg-surface-container-low border border-outline-variant rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
            />
          </div>
          <span className="text-sm text-on-surface-variant ml-auto">
            แสดง <strong>{filteredUsers.length}</strong> รายการ
          </span>
        </div>

        {/* Error alert */}
        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium">
            <span className="material-symbols-outlined text-lg">error</span>
            {error}
          </div>
        )}

        {/* User Table */}
        <div className="bg-white rounded-2xl border border-outline-variant shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20 gap-3 text-on-surface-variant">
              <svg className="animate-spin h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <span>กำลังโหลดข้อมูล...</span>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-on-surface-variant gap-3">
              <span className="material-symbols-outlined text-5xl text-outline-variant">group_off</span>
              <p>ไม่พบผู้ใช้ที่ค้นหา</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-surface-container-low border-b border-outline-variant">
                    <th className="text-left px-5 py-3.5 text-on-surface-variant font-semibold uppercase tracking-wider text-xs">
                      ผู้ใช้งาน
                    </th>
                    <th className="text-left px-5 py-3.5 text-on-surface-variant font-semibold uppercase tracking-wider text-xs">
                      อีเมล
                    </th>
                    <th className="text-center px-5 py-3.5 text-on-surface-variant font-semibold uppercase tracking-wider text-xs">
                      บทบาท (Role)
                    </th>
                    <th className="text-center px-5 py-3.5 text-on-surface-variant font-semibold uppercase tracking-wider text-xs">
                      จัดการ
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/50">
                  {filteredUsers.map((user) => {
                    const isSelf = user.id === currentUser?.id;
                    const isAdmin = user.role === "admin";
                    return (
                      <tr key={user.id} className="hover:bg-surface-container-low/50 transition-colors">
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-sm shrink-0">
                              {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                            </div>
                            <div>
                              <p className="font-semibold text-on-surface flex items-center gap-1.5">
                                {user.name}
                                {isSelf && (
                                  <span className="text-[10px] bg-primary/10 text-primary font-bold px-2 py-0.5 rounded-full">
                                    คุณ
                                  </span>
                                )}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-on-surface-variant font-mono text-xs">
                          {user.email}
                        </td>
                        <td className="px-5 py-3.5 text-center">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize inline-block ${getRoleBadge(user.role)}`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <select
                              value={user.role}
                              onChange={(e) => updateRole(user.id, e.target.value)}
                              disabled={isSelf || isAdmin}
                              className="px-3 py-1.5 bg-surface-container-low border border-outline-variant rounded-xl text-xs font-semibold outline-none focus:ring-2 focus:ring-primary cursor-pointer disabled:bg-gray-100 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                            >
                              {isAdmin && <option value="admin">Admin</option>}
                              <option value="user">User</option>
                              <option value="manager">Manager</option>
                            </select>
                            <button
                              type="button"
                              onClick={() => deleteUser(user.id, user.name)}
                              disabled={isSelf || isAdmin}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 rounded-xl text-xs font-semibold hover:bg-red-100 active:scale-95 transition-all cursor-pointer border-none disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                              title={isAdmin ? "ไม่สามารถลบบัญชีผู้ดูแลระบบ (Admin) ได้" : isSelf ? "ไม่สามารถลบบัญชีตัวเองได้" : "ลบผู้ใช้งาน"}
                            >
                              <span className="material-symbols-outlined text-sm">delete</span>
                              ลบ
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}