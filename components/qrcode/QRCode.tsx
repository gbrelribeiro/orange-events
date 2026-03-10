/* _components/qrcode/QRCode.tsx */

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import QRCode from "qrcode";

export default function QRCodeGenerator({ value }: { value: string }) {
  const [qrCodeURL, setQRCodeURL] = useState("");

  useEffect(() => {
    QRCode.toDataURL(value, { width: 256, margin: 1 }).then(setQRCodeURL);
  }, [value]);

  return (
    <div className="qrcode-section">
      {qrCodeURL && (
        <Image 
          src={qrCodeURL} 
          alt="QR Code" 
          width={256} 
          height={256} 
          className="qrcode-image" 
          priority 
        />
      )}
    </div>
  );
};