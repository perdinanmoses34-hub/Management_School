import React, { useState } from 'react';
import {
  CreditCard,
  QrCode,
  CheckCircle2,
  Clock,
  Download,
  Printer,
  Copy,
  AlertCircle,
  ShieldCheck,
  Receipt,
  X,
  Sparkles,
  ArrowUpRight,
  Wallet,
  Building,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SPPBill } from '../../types';
import confetti from 'canvas-confetti';

export const PaymentSPPView: React.FC = () => {
  const { sppBills, paySPPBill, activeSchool, currentUser, t, open2FAModal } = useApp();

  const [selectedBill, setSelectedBill] = useState<SPPBill | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'qris' | 'va_bca' | 'va_mandiri' | 'va_bri' | 'gopay'>('qris');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState<SPPBill | null>(null);
  const [copiedVA, setCopiedVA] = useState(false);

  // VA Numbers mapped to student NISN
  const virtualAccounts = {
    va_bca: '82109' + (currentUser.nipOrNisn || '0084592812'),
    va_mandiri: '89012' + (currentUser.nipOrNisn || '0084592812'),
    va_bri: '10294' + (currentUser.nipOrNisn || '0084592812'),
  };

  const totalPaid = sppBills
    .filter((b) => b.status === 'Lunas')
    .reduce((acc, b) => acc + b.amount, 0);

  const pendingBills = sppBills.filter((b) => b.status !== 'Lunas');
  const totalUnpaid = pendingBills.reduce((acc, b) => acc + b.amount, 0);

  const handleOpenPayment = (bill: SPPBill) => {
    setSelectedBill(bill);
  };

  const handleExecutePayment = async () => {
    if (!selectedBill) return;

    setIsProcessing(true);
    setTimeout(async () => {
      await paySPPBill(selectedBill.id, paymentMethod);
      setIsProcessing(false);
      const paidBill = {
        ...selectedBill,
        status: 'Lunas' as const,
        paymentMethod,
        transactionRef: 'TRX-' + paymentMethod.toUpperCase() + '-' + Date.now().toString().slice(-6),
        receiptNumber: 'INV/BM/2026/09/' + Math.floor(1000 + Math.random() * 9000),
        paidAt: 'Hari ini, Baru Saja',
      };
      setSelectedBill(null);
      setShowReceiptModal(paidBill);

      try {
        confetti({
          particleCount: 70,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // ignore
      }
    }, 1200);
  };

  const handleCopyVA = (text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedVA(true);
    setTimeout(() => setCopiedVA(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">{t.spp.title}</h1>
              <p className="text-xs sm:text-sm text-slate-500">
                Portal tagihan biaya pendidikan online terintegrasi perbankan nasional & QRIS
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            <span>Rekening Resmi Sekolah Terverifikasi</span>
          </span>
        </div>
      </div>

      {/* Financial Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-400 block mb-1">Total Tagihan Belum Dibayar</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-rose-600">
              Rp {totalUnpaid.toLocaleString('id-ID')}
            </span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            {pendingBills.length > 0 ? `${pendingBills.length} Bulan Tagihan Terbuka` : 'Semua Tagihan Lunas'}
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-400 block mb-1">Total Terbayar Semester Ini</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-emerald-600">
              Rp {totalPaid.toLocaleString('id-ID')}
            </span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">T.A 2026/2027 (Juli - September)</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-400 block mb-1">Status Keuangan Siswa</span>
          <div className="flex items-baseline gap-2">
            <span
              className={`text-xl sm:text-2xl font-black ${
                totalUnpaid === 0 ? 'text-emerald-600' : 'text-amber-600'
              }`}
            >
              {totalUnpaid === 0 ? 'Tertib Pembayaran' : 'Menunggu Pelunasan'}
            </span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Jatuh Tempo: Tanggal 15 Setiap Bulan</span>
        </div>
      </div>

      {/* Bills Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Daftar Tagihan SPP Bulanan (Siswa: {currentUser.name})</h3>
            <p className="text-xs text-slate-500">Nomor Induk Siswa Nasional: {currentUser.nipOrNisn}</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3.5 sm:p-4">Bulan & Tahun Ajaran</th>
                <th className="p-3.5 sm:p-4">Nominal Tagihan</th>
                <th className="p-3.5 sm:p-4">Batas Jatuh Tempo</th>
                <th className="p-3.5 sm:p-4 text-center">Status Pembayaran</th>
                <th className="p-3.5 sm:p-4">Keterangan Transaksi</th>
                <th className="p-3.5 sm:p-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sppBills.map((bill) => (
                <tr key={bill.id} className="hover:bg-slate-50/70 transition">
                  <td className="p-3.5 sm:p-4">
                    <div className="font-bold text-slate-900">{bill.month}</div>
                    <div className="text-[11px] text-slate-400">T.A {bill.academicYear}</div>
                  </td>
                  <td className="p-3.5 sm:p-4 font-mono font-bold text-slate-800 text-base">
                    Rp {bill.amount.toLocaleString('id-ID')}
                  </td>
                  <td className="p-3.5 sm:p-4 whitespace-nowrap text-slate-600 font-medium">
                    {bill.dueDate}
                  </td>
                  <td className="p-3.5 sm:p-4 text-center whitespace-nowrap">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                        bill.status === 'Lunas'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : 'bg-rose-100 text-rose-800 border border-rose-200 animate-pulse'
                      }`}
                    >
                      {bill.status === 'Lunas' ? 'Lunas' : 'Belum Dibayar'}
                    </span>
                  </td>
                  <td className="p-3.5 sm:p-4 whitespace-nowrap text-xs">
                    {bill.status === 'Lunas' ? (
                      <div>
                        <div className="text-slate-800 font-medium">{bill.paidAt}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{bill.transactionRef}</div>
                      </div>
                    ) : (
                      <span className="text-slate-400 italic">Menunggu Pembayaran</span>
                    )}
                  </td>
                  <td className="p-3.5 sm:p-4 text-right whitespace-nowrap">
                    {bill.status === 'Lunas' ? (
                      <button
                        id={`btn-view-receipt-${bill.id}`}
                        onClick={() => setShowReceiptModal(bill)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition cursor-pointer border border-slate-200"
                      >
                        <Receipt className="w-3.5 h-3.5 text-blue-600" />
                        <span>Kuitansi Resmi</span>
                      </button>
                    ) : (
                      <button
                        id={`btn-pay-spp-${bill.id}`}
                        onClick={() => handleOpenPayment(bill)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition cursor-pointer"
                      >
                        <CreditCard className="w-4 h-4" />
                        <span>Bayar Sekarang</span>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Processing Modal Dialog */}
      {selectedBill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-100 relative">
            <button
              onClick={() => setSelectedBill(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-5">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
                Checkout Pembayaran SPP
              </span>
              <h3 className="text-xl font-bold text-slate-900 mt-2">
                Tagihan {selectedBill.month}
              </h3>
              <div className="text-3xl font-black font-mono text-slate-900 mt-1">
                Rp {selectedBill.amount.toLocaleString('id-ID')}
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2.5 mb-5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                Pilih Kanal Pembayaran Resmi
              </label>

              {/* QRIS Option */}
              <div
                onClick={() => setPaymentMethod('qris')}
                className={`p-3.5 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                  paymentMethod === 'qris'
                    ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-100'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                    <QrCode className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-sm">QRIS Standar Nasional</div>
                    <div className="text-xs text-slate-500">Scan via BCA Mobile, GoPay, Dana, OVO, ShopeePay</div>
                  </div>
                </div>
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    paymentMethod === 'qris' ? 'border-blue-600 bg-blue-600' : 'border-slate-300'
                  }`}
                >
                  {paymentMethod === 'qris' && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}
                </div>
              </div>

              {/* BCA VA */}
              <div
                onClick={() => setPaymentMethod('va_bca')}
                className={`p-3.5 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                  paymentMethod === 'va_bca'
                    ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-100'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                    BCA
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-sm">BCA Virtual Account</div>
                    <div className="text-xs text-slate-500">Verifikasi otomatis tanpa konfirmasi manual</div>
                  </div>
                </div>
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    paymentMethod === 'va_bca' ? 'border-blue-600 bg-blue-600' : 'border-slate-300'
                  }`}
                >
                  {paymentMethod === 'va_bca' && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}
                </div>
              </div>

              {/* Mandiri VA */}
              <div
                onClick={() => setPaymentMethod('va_mandiri')}
                className={`p-3.5 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                  paymentMethod === 'va_mandiri'
                    ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-100'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold text-xs">
                    MANDIRI
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-sm">Mandiri Virtual Account (Livin')</div>
                    <div className="text-xs text-slate-500">Bayar via ATM atau Livin' by Mandiri</div>
                  </div>
                </div>
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    paymentMethod === 'va_mandiri' ? 'border-blue-600 bg-blue-600' : 'border-slate-300'
                  }`}
                >
                  {paymentMethod === 'va_mandiri' && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}
                </div>
              </div>
            </div>

            {/* Active Payment Details Preview (e.g. QR code or VA number) */}
            {paymentMethod === 'qris' ? (
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center mb-6">
                <div className="w-40 h-40 bg-white p-3 rounded-2xl mx-auto border border-slate-200 shadow-xs flex items-center justify-center mb-2">
                  <div className="w-full h-full bg-slate-900 text-white rounded-xl flex flex-col items-center justify-center p-2 relative overflow-hidden">
                    <QrCode className="w-28 h-28" />
                    <span className="text-[8px] font-bold tracking-widest text-slate-300 uppercase mt-0.5">
                      QRIS SMPTK BUDI MULIA
                    </span>
                  </div>
                </div>
                <p className="text-xs text-slate-600">Scan QRIS ini menggunakan aplikasi m-Banking atau Dompet Digital apa pun.</p>
              </div>
            ) : (
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-6">
                <span className="text-[11px] text-slate-500 font-semibold block uppercase">Nomor Virtual Account</span>
                <div className="flex items-center justify-between mt-1">
                  <span className="font-mono text-xl font-extrabold text-blue-900">
                    {virtualAccounts[paymentMethod as keyof typeof virtualAccounts] || '821090084592812'}
                  </span>
                  <button
                    onClick={() =>
                      handleCopyVA(virtualAccounts[paymentMethod as keyof typeof virtualAccounts] || '821090084592812')
                    }
                    className="text-xs font-bold text-blue-600 hover:text-blue-800 bg-white px-3 py-1.5 rounded-lg border border-slate-200 flex items-center gap-1 cursor-pointer shadow-xs"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedVA ? 'Disalin!' : 'Salin'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Submit Action */}
            <button
              id="btn-confirm-pay-now"
              onClick={handleExecutePayment}
              disabled={isProcessing}
              className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-500/25 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Memproses Transaksi Perbankan...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Bayar Sekarang (Simulasi Lunas Otomatis)</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Official Receipt / Bukti Pembayaran Modal */}
      {showReceiptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative">
            <button
              onClick={() => setShowReceiptModal(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Receipt Card Style */}
            <div className="border border-slate-200 rounded-2xl p-5 bg-gradient-to-b from-slate-50 to-white shadow-xs">
              <div className="text-center pb-4 border-b border-dashed border-slate-300 mb-4">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto mb-2 shadow-xs">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block">
                  Pembayaran Berhasil Diverifikasi
                </span>
                <h3 className="font-extrabold text-slate-900 text-lg mt-0.5">{activeSchool.name}</h3>
                <span className="text-[11px] font-mono text-slate-400">{showReceiptModal.receiptNumber}</span>
              </div>

              <div className="space-y-2.5 text-xs text-slate-600 mb-5">
                <div className="flex justify-between">
                  <span>Nama Siswa:</span>
                  <strong className="text-slate-900">{showReceiptModal.studentName}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Kelas / NISN:</span>
                  <strong className="text-slate-900">{showReceiptModal.class} / {showReceiptModal.nisn}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Uraian:</span>
                  <strong className="text-slate-900">SPP Bulan {showReceiptModal.month}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Metode:</span>
                  <strong className="text-slate-900 uppercase">{showReceiptModal.paymentMethod || 'QRIS'}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Waktu Bayar:</span>
                  <strong className="text-slate-900">{showReceiptModal.paidAt}</strong>
                </div>
                <div className="flex justify-between">
                  <span>No. Referensi:</span>
                  <strong className="text-slate-900 font-mono text-[11px]">{showReceiptModal.transactionRef}</strong>
                </div>
              </div>

              <div className="p-3.5 bg-blue-50/80 rounded-xl border border-blue-100 flex items-center justify-between">
                <span className="text-xs font-semibold text-blue-900">Total Dibayar:</span>
                <span className="text-xl font-black font-mono text-blue-800">
                  Rp {showReceiptModal.amount.toLocaleString('id-ID')}
                </span>
              </div>

              <div className="mt-4 pt-3 border-t border-dashed border-slate-200 flex items-center justify-between text-[10px] text-slate-400">
                <span>Tanda Terima Resmi Elektronik Sah</span>
                <span className="font-mono">SHA256_HASH_VERIFIED</span>
              </div>
            </div>

            <div className="mt-5 flex gap-2">
              <button
                onClick={() => setShowReceiptModal(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition cursor-pointer"
              >
                Tutup
              </button>
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak Tanda Terima</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
