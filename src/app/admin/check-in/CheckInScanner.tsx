"use client";

import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

type CheckInResult = {
  result: "success" | "used" | "invalid" | "unpaid";
  message: string;
  full_name?: string;
  checked_in_at?: string;
};

export function CheckInScanner() {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [scanning, setScanning] = useState(false);
  const [lastResult, setLastResult] = useState<CheckInResult | null>(null);
  const [loading, setLoading] = useState(false);
  const processingRef = useRef(false);

  useEffect(() => {
    return () => {
      if (scannerRef.current?.isScanning) {
        scannerRef.current.stop();
      }
    };
  }, []);

  async function startScanner() {
    setLastResult(null);
    const scanner = new Html5Qrcode("qr-reader");
    scannerRef.current = scanner;

    await scanner.start(
      { facingMode: "environment" },
      { fps: 10, qrbox: { width: 250, height: 250 } },
      onScanSuccess,
      () => {}
    );
    setScanning(true);
  }

  async function stopScanner() {
    if (scannerRef.current?.isScanning) {
      await scannerRef.current.stop();
    }
    setScanning(false);
  }

  async function onScanSuccess(decodedText: string) {
    if (processingRef.current) return;
    processingRef.current = true;

    // Extract order code from URL or raw text
    let orderCode = decodedText;
    const match = decodedText.match(/check-in\/(CRWS\d+)/i);
    if (match) orderCode = match[1];

    await stopScanner();
    await doCheckIn(orderCode);
    processingRef.current = false;
  }

  async function doCheckIn(orderCode: string) {
    setLoading(true);
    try {
      const res = await fetch("/api/check-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_code: orderCode }),
      });
      const data: CheckInResult = await res.json();
      setLastResult(data);
    } catch {
      setLastResult({ result: "invalid", message: "Lỗi kết nối" });
    }
    setLoading(false);
  }

  const resultClass =
    lastResult?.result === "success"
      ? "ci-success"
      : lastResult?.result === "used"
        ? "ci-used"
        : "ci-error";

  return (
    <div className="ci-page">
      <div className="ci-card">
        <h1 className="ci-title">Check-in</h1>
        <p className="ci-sub">Quét mã QR trên vé của người tham dự</p>

        <div id="qr-reader" className="ci-reader" />

        {!scanning && !loading && (
          <button className="btn ci-btn" onClick={startScanner}>
            {lastResult ? "Quét tiếp" : "Bật camera"}
          </button>
        )}

        {loading && (
          <div className="ci-loading">
            <div className="pay-spinner" />
            <span>Đang xác nhận...</span>
          </div>
        )}

        {lastResult && !loading && (
          <div className={`ci-result ${resultClass}`}>
            <p className="ci-msg">{lastResult.message}</p>
            {lastResult.full_name && (
              <p className="ci-name">{lastResult.full_name}</p>
            )}
            {lastResult.result === "used" && lastResult.checked_in_at && (
              <p className="ci-time">
                Check-in lúc{" "}
                {new Date(lastResult.checked_in_at).toLocaleTimeString("vi-VN")}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
