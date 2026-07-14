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

  if (!currentUser || currentUser.role !== "admin") return null;

  return (
    <div className="min-h-screen bg-background">

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
      <div className="max-w-container-max mx-auto space-y-6 mt-5">
        <div className="bg-white rounded-2xl border border-outline-variant p-4 shadow-sm">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ค้นหาโดยชื่อหรืออีเมล"
            className="w-full rounded-xl border border-outline-variant px-4 py-3 outline-none focus:border-primary"
          />
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
            {error}
          </div>
        )}

        <div className="bg-white rounded-2xl border border-outline-variant overflow-hidden shadow-sm">
          {loading ? (
            <div className="p-8 text-center text-on-surface-variant">กำลังโหลด...</div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-8 text-center text-on-surface-variant">ไม่พบผู้ใช้</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-surface-container-low">
                  <tr className="bg-surface-container-low border-b border-outline-variant">
                    <th className="px-4 py-3 text-left font-semibold">ชื่อ</th>
                    <th className="px-4 py-3 text-left font-semibold">อีเมล</th>
                    <th className="px-4 py-3 text-left font-semibold">Role</th>
                    <th className="px-4 py-3 text-left font-semibold">จัดการ</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="border-t border-outline-variant">
                      <td className="px-4 py-3">{user.name}</td>
                      <td className="px-4 py-3">{user.email}</td>
                      <td className="px-4 py-3 capitalize">{user.role}</td>
                      <td className="px-4 py-3">
                        <select
                          value={user.role}
                          onChange={(e) => updateRole(user.id, e.target.value)}
                          className="rounded-lg border border-outline-variant px-3 py-2 w-full"
                        >
                          <option value="user">User</option>
                          <option value="manager">Manager</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}