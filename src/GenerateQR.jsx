import { QRCodeCanvas } from "qrcode.react";

function GenerateQR() {

  const url =
    `${window.location.origin}/registration`;
// const url =
// `${window.location.origin}/registration?locationId=${location._id}`;
  return (
    <QRCodeCanvas
      value={url}
      size={220}
      includeMargin
    />
  );
}

export default GenerateQR;