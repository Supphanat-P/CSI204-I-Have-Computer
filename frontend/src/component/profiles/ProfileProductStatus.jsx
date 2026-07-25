export default function ProfileProductStatus({ orders, handleConfirmDelivery }) {
    const renderItemsList = (items) => {
        if (Array.isArray(items)) {
            return (
                <div className="space-y-2 mt-2">
                    {items.map((item, index) => (
                        <div key={index} className="flex items-center gap-3 bg-surface-container-lowest p-3 rounded-xl border border-outline-variant/60">
                            {item.image ? (
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-12 h-12 object-contain bg-white border border-outline-variant/30 rounded-lg shrink-0 p-1"
                                />
                            ) : (
                                <div className="w-12 h-12 bg-surface-container rounded-lg flex items-center justify-center text-on-surface-variant shrink-0">
                                    <span className="material-symbols-outlined text-xl">image</span>
                                </div>
                            )}
                            <div className="flex-1 min-w-0">
                                <p className="text-body-sm font-bold text-on-surface truncate">{item.name}</p>
                                <p className="text-xs text-on-surface-variant">
                                    {item.brand && <span>แบรนด์: {item.brand} | </span>}
                                    จำนวน: <span className="font-semibold text-primary">{item.quantity}</span> ชิ้น | ราคา: {item.price?.toLocaleString()}฿
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            );
        }
        return (
            <div className="bg-surface-container-lowest p-3 rounded-xl border border-outline-variant/60 mt-2">
                <p className="text-body-sm text-on-surface-variant">{items}</p>
            </div>
        );
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2.5 pb-4 border-b border-outline-variant">
                <span className="material-symbols-outlined text-primary text-3xl">local_shipping</span>
                <h2 className="text-2xl font-bold text-on-surface">ตรวจสอบการจัดส่ง</h2>
            </div>

            {orders.length > 0 ? (
                orders.map((ord) => {
                    const isPending = ord.status === "รอดำเนินการ";
                    const isShipped = ord.status === "จัดส่งแล้ว";
                    const isCompleted = ord.status === "เสร็จสิ้น";

                    return (
                        <div key={ord.id} className="border border-outline-variant rounded-2xl p-6 bg-white space-y-4 mb-5 shadow-sm">
                            {/* Card Header */}
                            <div className="flex items-center justify-between border-b border-outline-variant pb-3 flex-wrap gap-2">
                                <div>
                                    <span className="text-xs text-outline block">พัสดุสำหรับสั่งซื้อ</span>
                                    <span className="font-bold text-on-surface text-base">#{ord.id}</span>
                                </div>
                                <div className="text-right">
                                    <span className="text-xs text-outline block">ผู้ให้บริการจัดส่ง</span>
                                    <span className="font-bold text-primary text-sm">
                                        {ord.courier || "ยังไม่ระบุ"}
                                    </span>
                                    {ord.trackingNumber && (
                                        <span className="block text-[11px] font-mono bg-surface-container px-2 py-0.5 rounded text-on-surface mt-0.5 select-all">
                                            เลขพัสดุ: {ord.trackingNumber}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Items & Address */}
                            <div className="py-1 space-y-3">
                                <div className="text-body-sm text-on-surface-variant block">
                                    <b>รายการสินค้า:</b>
                                    {renderItemsList(ord.items)}
                                </div>
                                {ord.shippingAddress && (
                                    <div className="text-body-sm text-on-surface-variant leading-relaxed">
                                        <b>ที่อยู่จัดส่ง:</b> {ord.shippingAddress}
                                    </div>
                                )}
                                <div className="flex items-center gap-2 text-body-sm pt-1 font-semibold">
                                    <span className="material-symbols-outlined text-xl text-primary">local_shipping</span>
                                    <span className={isCompleted ? "text-green-600 font-bold" : "text-primary font-bold"}>
                                        {isCompleted
                                            ? "จัดส่งสินค้าสำเร็จเรียบร้อยแล้ว"
                                            : isPending
                                            ? "กำลังจัดเตรียมสินค้าเพื่อจัดส่ง"
                                            : "อยู่ระหว่างนำส่งพัสดุ (พัสดุอยู่ระหว่างการขนส่ง)"}
                                    </span>
                                </div>
                            </div>

                            {/* Timeline Tracker */}
                            <div className="border-t border-outline-variant pt-5 space-y-4">
                                {isCompleted ? (
                                    <>
                                        <div className="flex gap-3">
                                            <div className="flex flex-col items-center">
                                                <div className="w-3 h-3 rounded-full bg-emerald-500 z-10"></div>
                                                <div className="w-0.5 h-10 bg-emerald-300"></div>
                                            </div>
                                            <div>
                                                <span className="text-xs text-emerald-600 font-bold block">คลังสินค้าเตรียมและจัดส่งพัสดุ</span>
                                                <span className="text-xs text-on-surface-variant">จัดส่งพัสดุออกจากคลังสินค้าเข้าระบบ</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-3">
                                            <div className="flex flex-col items-center">
                                                <div className="w-3 h-3 rounded-full bg-emerald-500 z-10"></div>
                                                <div className="w-0.5 h-10 bg-emerald-300"></div>
                                            </div>
                                            <div>
                                                <span className="text-xs text-emerald-600 font-bold block">ส่งมอบบริษัทขนส่งเรียบร้อย ({ord.courier || "ขนส่ง"})</span>
                                                <span className="text-xs text-on-surface-variant">เลขพัสดุ: {ord.trackingNumber || "ยืนยันพัสดุแล้ว"}</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-3">
                                            <div className="flex flex-col items-center">
                                                <div className="w-3 h-3 rounded-full bg-emerald-500 z-10"></div>
                                            </div>
                                            <div>
                                                <span className="text-xs text-emerald-600 font-bold block">จัดส่งสำเร็จ</span>
                                                <span className="text-xs text-on-surface-variant">พัสดุได้รับการเซ็นรับและตรวจสอบความเรียบร้อยเสร็จสิ้น</span>
                                            </div>
                                        </div>
                                    </>
                                ) : isPending ? (
                                    <>
                                        <div className="flex gap-3">
                                            <div className="flex flex-col items-center">
                                                <div className="w-3 h-3 rounded-full bg-emerald-500 z-10"></div>
                                                <div className="w-0.5 h-10 bg-outline-variant"></div>
                                            </div>
                                            <div>
                                                <span className="text-xs text-emerald-600 font-bold block">อยู่ระหว่างเตรียมจัดส่ง</span>
                                                <span className="text-xs text-on-surface-variant">คลังสินค้าได้รับการชำระเงินและกำลังจัดเตรียมบรรจุสินค้าลงกล่อง</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-3 opacity-60">
                                            <div className="flex flex-col items-center">
                                                <div className="w-3 h-3 rounded-full bg-outline-variant z-10"></div>
                                            </div>
                                            <div>
                                                <span className="text-xs text-outline font-bold block">รอส่งมอบบริษัทขนส่ง</span>
                                                <span className="text-xs text-on-surface-variant">เตรียมส่งมอบพัสดุให้กับเจ้าหน้าที่ขนส่ง</span>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="flex gap-3">
                                            <div className="flex flex-col items-center">
                                                <div className="w-3 h-3 rounded-full bg-emerald-500 z-10"></div>
                                                <div className="w-0.5 h-10 bg-emerald-300"></div>
                                            </div>
                                            <div>
                                                <span className="text-xs text-emerald-600 font-bold block">เตรียมสินค้าและจัดส่งออกจากคลัง</span>
                                                <span className="text-xs text-on-surface-variant">คลังสินค้าได้จัดเตรียมสินค้าเรียบร้อย</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-3">
                                            <div className="flex flex-col items-center">
                                                <div className="w-3 h-3 rounded-full bg-emerald-500 z-10"></div>
                                                <div className="w-0.5 h-10 bg-emerald-300"></div>
                                            </div>
                                            <div>
                                                <span className="text-xs text-emerald-600 font-bold block">ส่งมอบบริษัทขนส่ง ({ord.courier || "ขนส่ง"})</span>
                                                <span className="text-xs text-on-surface-variant">
                                                    เลขพัสดุ: <span className="font-mono font-bold text-on-surface select-all">{ord.trackingNumber || "กำลังออกเลขพัสดุ"}</span>
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex gap-3">
                                            <div className="flex flex-col items-center">
                                                <div className="w-3 h-3 rounded-full bg-emerald-500 z-10"></div>
                                            </div>
                                            <div>
                                                <span className="text-xs text-emerald-600 font-bold block">นำส่งพัสดุไปยังปลายทาง</span>
                                                <span className="text-xs text-on-surface-variant">พนักงานส่งพัสดุกำลังนำส่งพัสดุไปยังที่อยู่ของคุณ</span>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Complete order receipt action button */}
                            {!isCompleted && (
                                <div className="border-t border-outline-variant pt-4 flex justify-end">
                                    <button
                                        type="button"
                                        onClick={() => handleConfirmDelivery(ord.id)}
                                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-5 py-2.5 rounded-xl font-bold transition-all active:scale-95 cursor-pointer flex items-center gap-1.5 border-none shadow-sm shadow-emerald-600/20"
                                    >
                                        <span className="material-symbols-outlined text-sm font-bold">check_circle</span>
                                        <span>ยืนยันได้รับสินค้าเรียบร้อย</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    );
                })
            ) : (
                <div className="bg-surface-container-low border border-outline-variant rounded-2xl p-12 text-center flex flex-col items-center">
                    <span className="material-symbols-outlined text-6xl text-outline mb-4">local_shipping</span>
                    <h3 className="font-bold text-lg text-on-surface mb-1">ไม่มีข้อมูลคำสั่งซื้อ</h3>
                    <p className="text-body-sm text-on-surface-variant">
                        คุณยังไม่มีคำสั่งซื้อใดๆ ในบัญชีนี้เพื่อใช้ตรวจสอบการจัดส่ง
                    </p>
                </div>
            )}
        </div>
    );
}