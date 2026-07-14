import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password || !confirmPassword) {
      setError("กรุณากรอกข้อมูลให้ครบทุกช่อง");
      return;
    }

    if (password !== confirmPassword) {
      setError("รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกัน");
      return;
    }

    if (!agreeTerms) {
      setError("กรุณายอมรับเงื่อนไขการใช้บริการและนโยบายความเป็นส่วนตัว");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setIsLoading(false);
        setError(data.message || "สมัครสมาชิกไม่สำเร็จ");
        return;
      }

      // Sync new user to localStorage users list to maintain full frontend compatibility
      const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");
      if (!existingUsers.some((u) => u.id === data.user.id)) {
        existingUsers.push({
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          password: password || "-", // Store password locally for compatibility
          phone: "-",
          birthDate: "-",
          lineId: "-",
          facebook: "-",
        });
        localStorage.setItem("users", JSON.stringify(existingUsers));
      }

      setIsLoading(false);
      navigate("/login");
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
            <Link to="/" className="font-display text-2xl font-bold tracking-tighter text-white hover:opacity-90">
              IHaveComputer
            </Link>
            <div className="mt-16 space-y-6">
              <h2 className="text-3xl font-bold leading-tight text-white">
                เข้าร่วมคอมมูนิตี้คนรักคอมพิวเตอร์กับเรา
              </h2>
              <p className="text-primary-fixed-dim text-body-md">
                สมัครสมาชิกฟรีวันนี้ เพื่อสะสมคะแนน แลกของรางวัล และติดตามสถานะคำสั่งซื้อแบบเรียลไทม์
              </p>
            </div>
          </div>
          
          <div className="relative z-10 border-t border-white/20 pt-8 mt-12">
            <div className="flex items-center gap-4">
              <span className="material-symbols-outlined text-4xl text-primary-fixed-dim">
                local_shipping
              </span>
              <div>
                <p className="font-semibold text-label-md text-white">ส่งฟรีทั่วไทย</p>
                <p className="text-xs text-white/70">รับสิทธิประโยชน์ส่งสินค้าฟรีเมื่อมียอดสั่งซื้อถึงกำหนด</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Register Form */}
        <div className="w-full md:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
          <div className="max-w-md w-full mx-auto">
            <h1 className="text-2xl md:text-3xl font-bold text-on-background mb-2">
              สมัครสมาชิก
            </h1>
            <p className="text-on-surface-variant text-body-sm mb-6">
              กรอกข้อมูลเพื่อสร้างบัญชีผู้ใช้ใหม่
            </p>

            {error && (
              <div className="bg-error-container text-error px-4 py-3 rounded-lg text-sm mb-4 flex items-center gap-2 border border-error/20">
                <span className="material-symbols-outlined text-lg">error</span>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name Input */}
              <div>
                <label className="block text-sm font-medium text-on-surface-variant mb-1" htmlFor="name">
                  ชื่อ-นามสกุล
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg">
                    person
                  </span>
                  <input
                    id="name"
                    type="text"
                    placeholder="สมชาย ใจดี"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-surface-container-low border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-on-surface text-sm"
                  />
                </div>
              </div>

              {/* Email Input */}
              <div>
                <label className="block text-sm font-medium text-on-surface-variant mb-1" htmlFor="email">
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
                    className="w-full pl-10 pr-4 py-2 bg-surface-container-low border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-on-surface text-sm"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-sm font-medium text-on-surface-variant mb-1" htmlFor="password">
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
                    className="w-full pl-10 pr-10 py-2 bg-surface-container-low border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-on-surface text-sm"
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

              {/* Confirm Password Input */}
              <div>
                <label className="block text-sm font-medium text-on-surface-variant mb-1" htmlFor="confirmPassword">
                  ยืนยันรหัสผ่าน
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg">
                    lock
                  </span>
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2 bg-surface-container-low border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-on-surface text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-primary transition-colors"
                  >
                    <span className="material-symbols-outlined text-lg select-none">
                      {showConfirmPassword ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-start gap-2 text-xs pt-1">
                <input
                  type="checkbox"
                  id="agreeTerms"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="rounded border-outline-variant text-primary focus:ring-primary h-4 w-4 mt-0.5"
                />
                <label htmlFor="agreeTerms" className="text-on-surface-variant leading-tight cursor-pointer">
                  ฉันยอมรับ{" "}
                  <a href="#" onClick={(e) => e.preventDefault()} className="text-primary font-medium hover:underline">
                    เงื่อนไขการใช้บริการ
                  </a>{" "}
                  และ{" "}
                  <a href="#" onClick={(e) => e.preventDefault()} className="text-primary font-medium hover:underline">
                    นโยบายความเป็นส่วนตัว
                  </a>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary hover:bg-primary-fixed-dim hover:text-primary-fixed text-white font-semibold py-2.5 rounded-xl shadow-lg shadow-primary/10 transition-all duration-200 active:scale-98 flex items-center justify-center gap-2 mt-6 disabled:opacity-50 disabled:pointer-events-none"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>กำลังสมัครสมาชิก...</span>
                  </>
                ) : (
                  <span>สมัครสมาชิก</span>
                )}
              </button>
            </form>

  

            {/* Login Link */}
            <p className="text-center text-xs text-on-surface-variant mt-8">
              มีบัญชีผู้ใช้อยู่แล้ว?{" "}
              <Link to="/login" className="text-primary font-semibold hover:underline">
                เข้าสู่ระบบที่นี่
              </Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
