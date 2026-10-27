import React, { useState, useEffect } from "react";
import {
  Star,
  Radio,
  Store,
  MapPin,
  Gift,
  ExternalLink,
  CheckCircle2,
  Sparkles,
  QrCode,
  Share2,
  TrendingUp,
  MessageSquare,
  Loader2,
} from "lucide-react";

interface NfcStore {
  id: string;
  store_name: string;
  store_category: string;
  store_address: string;
  nfc_uid: string;
  google_maps_url: string;
  rating: number;
  total_reviews: number;
  reward_voucher: string;
}

export const NfcReviewHub: React.FC = () => {
  const [stores, setStores] = useState<NfcStore[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedStore, setSelectedStore] = useState<NfcStore | null>(null);

  // Review Form state
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [receivedVoucher, setReceivedVoucher] = useState<string | null>(null);

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/platform-hub/reviews/stores");
      if (res.ok) {
        const data = await res.json();
        setStores(Array.isArray(data) ? data : []);
        if (Array.isArray(data) && data.length > 0) {
          setSelectedStore(data[0]);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSimulateNfcTap = (store: NfcStore) => {
    setSelectedStore(store);
    setReceivedVoucher(null);
    setRating(5);
    setComment("");
    // Smooth scroll down to review card if mobile
  };

  const handleSubmitReview = async () => {
    if (!selectedStore) return;
    try {
      setSubmitting(true);
      const res = await fetch("/api/platform-hub/reviews/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storeId: selectedStore.id,
          rating,
          comment,
          customerName,
          customerPhone,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setReceivedVoucher(data.voucher || selectedStore.reward_voucher || "VIONE-VIP-PROMO");
        fetchStores();
      }
    } catch (err) {
      console.error(err);
      alert("Lỗi khi gửi đánh giá NFC.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="relative rounded-3xl border border-[#D8B282]/40 bg-gradient-to-br from-[#0F172A] via-[#0A101D] to-[#050C15] p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/40 bg-blue-500/10 px-3 py-0.5 text-xs font-bold text-blue-300">
              <Radio className="h-3.5 w-3.5 animate-pulse text-blue-400" />
              <span>VIONE REVIEW • CHẠM NFC TĂNG ĐÁNH GIÁ GOOGLE & NỀN TẢNG</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-black text-[#F6E1C3]">
              Chạm Thẻ NFC — Đánh Giá 5 Sao & Nhận Voucher Tức Thì
            </h2>
            <p className="text-xs text-muted-foreground max-w-2xl leading-relaxed">
              Giải pháp thông minh cho chuỗi cửa hàng, bảo tàng, điểm du lịch và nhà hàng: Khách hàng chỉ cần chạm nhẹ lưng điện thoại vào standee NFC để chấm sao đánh giá và tự động nhận mã ưu đãi giảm giá.
            </p>
          </div>

          <div className="rounded-2xl border border-[#D8B282]/30 bg-[#050C15]/80 p-4 text-center shrink-0">
            <div className="text-2xl font-black font-serif text-[#F6E1C3]">
              4.9 <Star className="inline h-5 w-5 text-amber-400 fill-amber-400 -mt-1" />
            </div>
            <div className="text-[11px] text-muted-foreground mt-0.5">Điểm hài lòng trung bình</div>
            <div className="mt-1 text-[10px] text-emerald-400 font-semibold">Tăng 300% lượng review thật</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Stores list & Interactive NFC Review Terminal */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: Partner Stores / Di Tích List */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#F6E1C3] flex items-center gap-2">
              <Store className="h-4 w-4 text-[#D8B282]" />
              <span>Điểm Chạm NFC Thực Tế ({stores.length})</span>
            </h3>
            <span className="text-[11px] text-muted-foreground">Chọn điểm để trải nghiệm</span>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12 text-[#D8B282]">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              <span className="text-xs">Đang tải danh sách điểm NFC...</span>
            </div>
          ) : (
            <div className="space-y-3">
              {stores.map((s) => {
                const isSelected = selectedStore?.id === s.id;
                return (
                  <div
                    key={s.id}
                    onClick={() => handleSimulateNfcTap(s)}
                    className={`cursor-pointer rounded-2xl border p-4 transition-all ${
                      isSelected
                        ? "border-[#D8B282] bg-gradient-to-r from-[#121A2A] to-[#0A101D] shadow-lg shadow-[#D8B282]/15 scale-[1.01]"
                        : "border-[#D8B282]/25 bg-[#0A101D] hover:border-[#D8B282]/50"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="rounded bg-blue-500/10 px-2 py-0.5 text-[9px] font-bold text-blue-300">
                            {s.store_category}
                          </span>
                          <span className="text-[10px] font-mono text-[#D8B282]">{s.nfc_uid}</span>
                        </div>
                        <h4 className="text-sm font-bold text-white">{s.store_name}</h4>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-[#D8B282]" />
                          {s.store_address}
                        </p>
                      </div>

                      <div className="text-right">
                        <div className="flex items-center gap-1 text-xs font-bold text-amber-400">
                          <Star className="h-3.5 w-3.5 fill-amber-400" />
                          <span>{s.rating}</span>
                        </div>
                        <div className="text-[10px] text-muted-foreground mt-0.5">
                          {s.total_reviews} lượt chạm
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-[#D8B282]/15 flex items-center justify-between text-xs">
                      <span className="text-emerald-400 text-[11px] font-semibold flex items-center gap-1">
                        <Gift className="h-3 w-3" />
                        Tặng mã: {s.reward_voucher}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSimulateNfcTap(s);
                        }}
                        className="flex items-center gap-1 rounded-lg bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#8C653B] px-3 py-1 text-[11px] font-bold text-[#050C15] hover:brightness-110 active:scale-95 transition-all"
                      >
                        <Radio className="h-3 w-3" />
                        <span>Mô phỏng Chạm NFC</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Col: Live NFC Tap & Review Terminal */}
        <div className="lg:col-span-7">
          {selectedStore ? (
            <div className="rounded-3xl border border-[#D8B282]/50 bg-gradient-to-b from-[#0F172A] to-[#070D18] p-6 shadow-2xl relative space-y-6">
              {/* Terminal Title */}
              <div className="flex items-center justify-between border-b border-[#D8B282]/20 pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#F6E1C3] via-[#D8B282] to-[#8C653B] text-[#050C15] shadow-lg shadow-[#D8B282]/25">
                    <Radio className="h-5 w-5 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-base font-serif font-black text-[#F6E1C3]">
                      GIAO DIỆN CHẠM THẺ NFC REVIEW
                    </h3>
                    <p className="text-[11px] text-muted-foreground">
                      Điểm chạm: <span className="font-bold text-white">{selectedStore.store_name}</span>
                    </p>
                  </div>
                </div>

                <a
                  href={selectedStore.google_maps_url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-[11px] text-[#D8B282] hover:underline"
                >
                  <span>Google Maps</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>

              {/* Reward Notification Banner */}
              {receivedVoucher ? (
                <div className="rounded-2xl border-2 border-emerald-500/60 bg-emerald-950/40 p-5 text-center space-y-2 animate-fadeIn">
                  <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <h4 className="text-sm font-bold text-emerald-300">
                    ĐÁNH GIÁ THÀNH CÔNG! BẠN NHẬN ĐƯỢC VOUCHER
                  </h4>
                  <div className="inline-block rounded-xl border border-dashed border-emerald-400 bg-black/60 px-5 py-2 font-mono text-base font-black text-emerald-400 tracking-wider">
                    {receivedVoucher}
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Xuất trình mã này tại quầy thanh toán để được giảm trực tiếp trên hóa đơn!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Star Rating Selector */}
                  <div className="text-center space-y-2">
                    <label className="text-xs text-muted-foreground font-semibold">
                      Chạm chọn mức độ hài lòng của bạn:
                    </label>
                    <div className="flex justify-center items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => {
                        const isFilled = star <= (hoverRating || rating);
                        return (
                          <button
                            key={star}
                            type="button"
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            onClick={() => setRating(star)}
                            className="p-1 text-2xl transition-transform hover:scale-125 focus:outline-none"
                          >
                            <Star
                              className={`h-8 w-8 transition-colors ${
                                isFilled
                                  ? "text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]"
                                  : "text-gray-600"
                              }`}
                            />
                          </button>
                        );
                      })}
                    </div>
                    <div className="text-xs font-bold text-[#F6E1C3]">
                      {rating === 5
                        ? "Tuyệt vời! Rất hài lòng ⭐⭐⭐⭐⭐"
                        : rating === 4
                        ? "Tốt! Dịch vụ chu đáo ⭐⭐⭐⭐"
                        : rating === 3
                        ? "Bình thường ⭐⭐⭐"
                        : "Cần cải thiện"}
                    </div>
                  </div>

                  {/* Comment & Info */}
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-semibold text-[#CBD5E1]">
                        Ý kiến nhận xét của bạn
                      </label>
                      <textarea
                        rows={3}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Hãy chia sẻ trải nghiệm của bạn (Không gian, thái độ nhân viên, hương vị ẩm thực...)"
                        className="w-full mt-1 rounded-xl border border-[#D8B282]/30 bg-[#050C15] p-3 text-xs text-white placeholder-gray-500 focus:border-[#D8B282] focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-semibold text-[#CBD5E1]">Họ và tên</label>
                        <input
                          type="text"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          placeholder="Nguyễn Văn An"
                          className="w-full mt-1 rounded-xl border border-[#D8B282]/30 bg-[#050C15] px-3 py-2 text-xs text-white placeholder-gray-500 focus:border-[#D8B282] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-[#CBD5E1]">
                          Số điện thoại (Nhận voucher)
                        </label>
                        <input
                          type="tel"
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                          placeholder="0912 345 678"
                          className="w-full mt-1 rounded-xl border border-[#D8B282]/30 bg-[#050C15] px-3 py-2 text-xs text-white placeholder-gray-500 focus:border-[#D8B282] focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Submit CTA */}
                  <button
                    type="button"
                    onClick={handleSubmitReview}
                    disabled={submitting}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#F6E1C3] via-[#D8B282] to-[#8C653B] py-3 text-xs font-bold text-[#050C15] shadow-lg shadow-[#D8B282]/25 hover:brightness-110 active:scale-95 transition-all"
                  >
                    {submitting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4" />
                    )}
                    <span>Gửi Đánh Giá & Nhận Voucher {selectedStore.reward_voucher}</span>
                  </button>
                </div>
              )}

              {/* Standee Preview Box */}
              <div className="rounded-2xl border border-dashed border-[#D8B282]/30 bg-black/40 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#D8B282]/10 text-[#F6E1C3]">
                    <QrCode className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#F6E1C3]">Mô Phỏng Thẻ Standee NFC Tại Quầy</div>
                    <div className="text-[10px] text-muted-foreground">
                      Standee mica mạ vàng khắc logo ViOne + Chip NFC NTAG213 chống nước
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => alert("Đang kết nối tạo lệnh in standee NFC cho điểm này!")}
                  className="shrink-0 flex items-center gap-1.5 rounded-xl border border-[#D8B282]/40 bg-[#0A101D] px-3.5 py-1.5 text-[11px] font-bold text-[#F6E1C3] hover:border-[#D8B282] active:scale-95 transition-all"
                >
                  <Share2 className="h-3.5 w-3.5" />
                  <span>Xuất File Standee</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-[#D8B282]/30 p-12 text-center text-muted-foreground">
              Vui lòng chọn một cửa hàng hoặc di tích bên trái để trải nghiệm chạm NFC Review.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
