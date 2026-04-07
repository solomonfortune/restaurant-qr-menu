import QRCode from 'react-qr-code';

const QRCodeCard = ({ table, onDelete }) => {
  const printQRCode = () => {
    const popup = window.open('', '_blank', 'width=500,height=700');
    if (!popup) return;

    const qrMarkup = document.getElementById(`qr-${table._id}`)?.outerHTML || '';

    popup.document.write(`
      <html>
        <head><title>Print Table ${table.tableNumber}</title></head>
        <body style="font-family: Arial, sans-serif; text-align: center; padding: 40px;">
          <h1>Table ${table.tableNumber}</h1>
          <p>${table.label || 'Scan to browse the menu and place an order.'}</p>
          <div style="margin: 30px auto; width: 220px;">${qrMarkup}</div>
          <p style="margin-top: 24px; color: #666; word-break: break-word;">${table.qrCodeUrl}</p>
        </body>
      </html>
    `);
    popup.document.close();
    popup.focus();
    popup.print();
  };

  return (
    <article className="rounded-[28px] border border-stone-200 bg-white p-5 shadow-sm">
      <div className="rounded-[24px] bg-brand-soft p-4">
        <div className="rounded-[18px] bg-white p-4">
          <QRCode id={`qr-${table._id}`} value={table.qrCodeUrl} size={180} className="h-auto w-full" />
        </div>
      </div>
      <div className="mt-4">
        <h3 className="font-display text-xl text-stone-900">Table {table.tableNumber}</h3>
        <p className="mt-1 text-sm text-stone-500">{table.label || 'No label added'}</p>
      </div>
      <div className="mt-5 flex gap-3">
        <button type="button" onClick={printQRCode} className="flex-1 rounded-2xl bg-stone-900 px-4 py-3 text-sm font-semibold text-white">Print QR Code</button>
        <button type="button" onClick={() => onDelete(table._id)} className="rounded-2xl border border-red-200 px-4 py-3 text-sm font-semibold text-red-600">Delete</button>
      </div>
    </article>
  );
};

export default QRCodeCard;
