import { useState, useEffect } from "react";

export default function ProfileOrders({
    orders }
) {
    const [selectedOrder, setSelectedOrder] = useState(null);

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
                                    จำนวน: <span className="font-semibold text-primary">{item.quantity}</span> ชิ้น | ราคา: {item.price.toLocaleString()}฿
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            );
        }
    }

    return (
    <>
        <div className="space-y-6">
            <div className="flex items-center gap-2.5 pb-4 border-b border-outline-variant">
                <span className="material-symbols-outlined text-primary text-3xl">shopping_bag</span>
                <h2 className="text-2xl font-bold text-on-surface">คำสั่งซื้อของฉัน</h2>
            </div>

            <div className="space-y-4">
                {orders.length > 0 ? (
                    orders.map((ord) => (
                        <div
                            key={ord.id}
                            className="border border-outline-variant rounded-2xl p-5 bg-white flex flex-col md:flex-row md:items-center justify-between gap-4"
                        >
                            <div className="space-y-2 flex-1">
                                <div className="flex items-center gap-3 flex-wrap">
                                    <span className="font-bold text-on-surface text-body-lg">
                                        หมายเลขสั่งซื้อ: {ord.id}
                                    </span>

                                    <span
                                        className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${ord.status === "เสร็จสิ้น"
                                            ? "bg-green-100 text-green-700"
                                            : ord.status === "จัดส่งแล้ว"
                                                ? "bg-blue-100 text-blue-700"
                                                : "bg-amber-100 text-amber-700"
                                            }`}
                                    >
                                        {ord.status}
                                    </span>
                                </div>

                                {renderItemsList(ord.items)}

                                <p className="text-xs text-outline pt-1">
                                    วันที่ทำรายการ: {ord.date}
                                </p>
                            </div>

                            <div className="text-right shrink-0">
                                <p className="text-xs text-on-surface-variant">
                                    ยอดรวมสุทธิ
                                </p>

                                <p className="text-xl font-bold text-primary">
                                    {ord.total.toLocaleString()}฿
                                </p>

                                <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3 mt-2 justify-end">
                                    <button
                                        onClick={() => setSelectedOrder(ord)}
                                        className="text-xs font-semibold text-primary hover:underline cursor-pointer bg-transparent border-none"
                                    >
                                        ดูรายละเอียดคำสั่งซื้อ
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="bg-surface-container-low border border-outline-variant rounded-2xl p-12 text-center flex flex-col items-center">
                        <span className="material-symbols-outlined text-6xl text-outline mb-4">shopping_bag</span>
                        <h3 className="font-bold text-lg text-on-surface mb-1">ไม่มีข้อมูลคำสั่งซื้อ</h3>
                        <p className="text-body-sm text-on-surface-variant">
                            คุณยังไม่มีคำสั่งซื้อใดๆ ในบัญชีนี้เพื่อใช้ตรวจสอบคำสั่งซื้อ
                        </p>
                    </div>
                )}
            </div>
        </div>
        {selectedOrder && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
                <div className="bg-white border border-outline-variant rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden p-6 md:p-8 space-y-6 relative z-10">
                    <div className="flex justify-between items-center border-b border-outline-variant pb-4">
                        <div>
                            <h3 className="text-xl font-bold text-on-surface">รายละเอียดคำสั่งซื้อ</h3>
                            <p className="text-xs text-outline mt-0.5">หมายเลข: #{selectedOrder.id}</p>
                        </div>
                        <button
                            onClick={() => setSelectedOrder(null)}
                            className="p-1.5 hover:bg-surface-container rounded-full text-on-surface-variant cursor-pointer transition-colors border-none bg-transparent"
                        >
                            <span className="material-symbols-outlined text-2xl">close</span>
                        </button>
                    </div>

                    <div className="space-y-4 text-body-sm text-on-surface-variant max-h-[60vh] overflow-y-auto pr-1">
                        <div className="flex justify-between items-center bg-surface-container-low p-3.5 rounded-xl border border-outline-variant/40">
                            <div>
                                <span className="text-xs text-outline block">วันที่สั่งซื้อ</span>
                                <span className="font-bold text-on-surface">{selectedOrder.date}</span>
                            </div>
                            <div className="text-right">
                                <span className="text-xs text-outline block mb-0.5">สถานะการชำระเงิน/จัดส่ง</span>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${selectedOrder.status === "เสร็จสิ้น" ? "bg-green-100 text-green-700" :
                                    selectedOrder.status === "จัดส่งแล้ว" ? "bg-blue-100 text-blue-700" :
                                        "bg-amber-100 text-amber-700"
                                    }`}>
                                    {selectedOrder.status}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <span className="text-xs font-bold text-on-surface uppercase tracking-wider block">รายการสินค้า</span>
                            {renderItemsList(selectedOrder.items)}
                        </div>

                        {selectedOrder.recipientName && (
                            <div className="space-y-3 pt-2">
                                <div className="border-t border-outline-variant/40 pt-3">
                                    <span className="text-xs font-bold text-on-surface uppercase tracking-wider block mb-1">ข้อมูลผู้รับสินค้า</span>
                                    <p className="font-medium text-on-surface">{selectedOrder.recipientName} ({selectedOrder.recipientPhone})</p>
                                </div>
                                <div>
                                    <span className="text-xs font-bold text-on-surface uppercase tracking-wider block mb-1">ที่อยู่จัดส่ง</span>
                                    <p className="leading-relaxed">{selectedOrder.shippingAddress}</p>
                                </div>
                            </div>
                        )}

                        {selectedOrder.paymentMethod && (
                            <div className="border-t border-outline-variant/40 pt-3 flex justify-between">
                                <span className="text-xs font-bold text-on-surface uppercase tracking-wider">ช่องทางการชำระเงิน</span>
                                <span className="font-semibold text-on-surface">{selectedOrder.paymentMethod}</span>
                            </div>
                        )}

                        <div className="border-t border-outline-variant pt-4 flex justify-between items-center text-on-surface">
                            <span className="font-bold text-body-md">ยอดชำระเงินทั้งหมด</span>
                            <span className="text-primary font-bold text-xl">{selectedOrder.total.toLocaleString()}฿</span>
                        </div>
                    </div>

                    {/* Modal Actions */}
                    <div className="flex gap-2.5 justify-end pt-4 border-t border-outline-variant">
                        <button
                            type="button"
                            onClick={() => {
                                window.print();
                            }}
                            className="border border-outline-variant px-5 py-2.5 rounded-xl font-semibold text-on-surface-variant hover:bg-surface-container-low hover:text-primary transition-all cursor-pointer flex items-center gap-1 bg-transparent"
                        >
                            <span className="material-symbols-outlined text-sm">print</span>
                            <span>พิมพ์ใบสั่งซื้อ</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setSelectedOrder(null)}
                            className="bg-primary text-white hover:brightness-110 px-6 py-2.5 rounded-xl font-bold transition-all active:scale-95 cursor-pointer border-none"
                        >
                            ปิดหน้าต่าง
                        </button>
                    </div>
                </div>
            </div>
        )}
    </>
    )
}