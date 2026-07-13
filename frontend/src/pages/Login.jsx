import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("กรุณากรอกอีเมลและรหัสผ่านให้ครบถ้วน");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setIsLoading(false);
        setError(data.message || "อีเมลหรือรหัสผ่านไม่ถูกต้อง");
        return;
      }

      // Save user session in localStorage with JWT token included
      localStorage.setItem(
        "currentUser",
        JSON.stringify({
          ...data.user,
          token: data.token,
        })
      );

      // Sync user to localStorage users list to maintain full compatibility with address/order pages
      let existingUsers = JSON.parse(localStorage.getItem("users") || "[]");
      const userIndex = existingUsers.findIndex((u) => u.id === data.user.id);
      const userObj = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        phone: data.user.phone || "-",
        birthDate: data.user.birthDate || "-",
        lineId: data.user.lineId || "-",
        facebook: data.user.facebook || "-",
      };

      if (userIndex === -1) {
        existingUsers.push(userObj);
      } else {
        existingUsers[userIndex] = {
          ...existingUsers[userIndex],
          ...userObj,
        };
      }
      localStorage.setItem("users", JSON.stringify(existingUsers));

      setIsLoading(false);
      navigate("/profile");
    } catch (err) {
      console.error(err);
      setIsLoading(false);
      setError("ไม่สามารถติดต่อเซิร์ฟเวอร์ได้ กรุณาลองใหม่อีกครั้ง");
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-background flex items-center justify-center p-4 md:p-8">
      <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-lg overflow-hidden max-w-4xl w-full flex flex-col md:flex-row">
        {/* Left Side: Brand Promo / Hero Panel (Hidden on mobile) */}
        <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-primary to-surface-tint p-12 text-white flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/[0.05] pointer-events-none" />
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary-container/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-secondary-container/10 rounded-full blur-3xl" />

          <div className="relative z-10">
            <Link
              to="/"
              className="font-display text-2xl font-bold tracking-tighter text-white hover:opacity-90"
            >
              IHaveComputer
            </Link>
            <div className="mt-16 space-y-6">
              <h2 className="text-3xl font-bold leading-tight text-white">
                ค้นพบคอมพิวเตอร์และอุปกรณ์เกมมิ่งที่ดีที่สุดสำหรับคุณ
              </h2>
              <p className="text-primary-fixed-dim text-body-md">
                เข้าสู่ระบบเพื่อรับสิทธิพิเศษ ส่วนลดสมาชิก
                และบริการหลังการขายระดับพรีเมียม
              </p>
            </div>
          </div>

          <div className="relative z-10 border-t border-white/20 pt-8 mt-12">
            <div className="flex items-center gap-4">
              <span className="material-symbols-outlined text-4xl text-primary-fixed-dim">
                verified_user
              </span>
              <div>
                <p className="font-semibold text-label-md text-white">
                  ปลอดภัย 100%
                </p>
                <p className="text-xs text-white/70">
                  การันตีความปลอดภัยของข้อมูลและบัญชีของคุณ
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="w-full md:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
          <div className="max-w-md w-full mx-auto">
            <h1 className="text-2xl md:text-3xl font-bold text-on-background mb-2">
              เข้าสู่ระบบ
            </h1>
            <p className="text-on-surface-variant text-body-sm mb-6">
              กรอกข้อมูลเพื่อเข้าใช้งานบัญชีของคุณ
            </p>

            {error && (
              <div className="bg-error-container text-error px-4 py-3 rounded-lg text-sm mb-4 flex items-center gap-2 border border-error/20">
                <span className="material-symbols-outlined text-lg">error</span>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Input */}
              <div>
                <label
                  className="block text-sm font-medium text-on-surface-variant mb-1"
                  htmlFor="email"
                >
                  อีเมล
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg">
                    mail
                  </span>
                  <input
                    id="email"
                    type="email"
                    placeholder="example@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-surface-container-low border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-on-surface text-sm"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label
                  className="block text-sm font-medium text-on-surface-variant mb-1"
                  htmlFor="password"
                >
                  รหัสผ่าน
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg">
                    lock
                  </span>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 bg-surface-container-low border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-on-surface text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-primary transition-colors"
                  >
                    <span className="material-symbols-outlined text-lg select-none">
                      {showPassword ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-on-surface-variant">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-outline-variant text-primary focus:ring-primary h-4 w-4"
                  />
                  <span>จดจำฉันในระบบ</span>
                </label>
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="text-primary font-medium hover:underline"
                >
                  ลืมรหัสผ่าน?
                </a>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary hover:bg-primary-fixed-dim hover:text-primary-fixed text-white font-semibold py-3 rounded-xl shadow-lg shadow-primary/10 transition-all duration-200 active:scale-98 flex items-center justify-center gap-2 mt-6 disabled:opacity-50 disabled:pointer-events-none"
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span>กำลังเข้าสู่ระบบ...</span>
                  </>
                ) : (
                  <span>เข้าสู่ระบบ</span>
                )}
              </button>
            </form>

            {/* Sign Up Link */}
            <p className="text-center text-xs text-on-surface-variant mt-8">
              ยังไม่มีบัญชีผู้ใช้?{" "}
              <Link
                to="/register"
                className="text-primary font-semibold hover:underline"
              >
                สมัครสมาชิก
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
