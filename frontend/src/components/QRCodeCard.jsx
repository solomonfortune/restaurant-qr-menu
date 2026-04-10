import React from 'react';
import QRCode from 'react-qr-code';

/**
 * QRCodeCard Component
 * Displays QR code with ornamental styling for admin tables page
 * Print, edit, and delete functionality
 */
const QRCodeCard = ({ table, onDelete }) => {
  const printQRCode = () => {
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    if (!printWindow) return;

    const qrElement = document.getElementById(`qr-${table._id}`);
    const qrSvg = qrElement?.innerHTML || '';

    const printHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Print QR - Table ${table.tableNumber}</title>
          <style>
            body { font-family: 'Playfair Display', serif; text-align: center; padding: 40px; background: #FDF6EC; }
            .container { max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 12px; }
            h1 { font-size: 36px; color: #2C1A0E; margin: 0; }
            .tagline { color: #C9A84C; font-style: italic; margin: 12px 0 24px; font-size: 16px; }
            .qr-box { 
              background: #F5E6D0; 
              padding: 24px; 
              border-radius: 8px; 
              margin: 30px 0;
              border: 2px solid #C9A84C;
            }
            .divider { 
              border-top: 1px solid #C9A84C; 
              margin: 20px 0; 
              opacity: 0.4;
            }
            .label { color: #8C7B6B; font-size: 14px; margin-top: 20px; }
            @media print { body { padding: 0; } .container { box-shadow: none; } }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>TABLE ${table.tableNumber}</h1>
            <div class="tagline">Scan to browse our menu & place your order</div>
            <div class="divider"></div>
            <div class="qr-box">${qrSvg}</div>
            <div class="divider"></div>
            ${table.label ? `<p class="label">${table.label}</p>` : ''}
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(printHTML);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => printWindow.print(), 250);
  };

  const handleDelete = () => {
    if (window.confirm(`Delete Table ${table.tableNumber}? This cannot be undone.`)) {
      onDelete(table._id);
    }
  };

  return (
    <article
      className="rounded-2xl p-6 space-y-4 transition hover:shadow-lg"
      style={{
        backgroundColor: 'var(--color-white)',
        border: '2px solid var(--color-gold)',
        boxShadow: 'var(--shadow-card)',
        animation: 'fadeUp 0.6s ease-out',
      }}
    >
      {/* QR Code Container with Ornaments */}
      <div
        className="rounded-xl p-6 relative"
        style={{
          backgroundColor: 'var(--color-cream-dark)',
        }}
      >
        {/* Corner Ornaments */}
        <div
          className="absolute top-2 left-2 text-xs opacity-60"
          style={{ color: 'var(--color-gold)' }}
        >
          ◈
        </div>
        <div
          className="absolute top-2 right-2 text-xs opacity-60"
          style={{ color: 'var(--color-gold)' }}
        >
          ◈
        </div>
        <div
          className="absolute bottom-2 left-2 text-xs opacity-60"
          style={{ color: 'var(--color-gold)' }}
        >
          ◈
        </div>
        <div
          className="absolute bottom-2 right-2 text-xs opacity-60"
          style={{ color: 'var(--color-gold)' }}
        >
          ◈
        </div>

        {/* QR Code */}
        <div
          id={`qr-${table._id}`}
          className="flex justify-center"
        >
          <QRCode
            value={table.qrCodeUrl}
            size={150}
            level="H"
            includeMargin={true}
            bgColor="var(--color-white)"
            fgColor="var(--color-espresso)"
          />
        </div>
      </div>

      {/* Table Number */}
      <div>
        <h3
          className="font-display text-2xl font-bold"
          style={{ color: 'var(--color-espresso)' }}
        >
          Table {table.tableNumber}
        </h3>
        {table.label && (
          <p
            className="text-sm mt-1"
            style={{
              color: 'var(--color-muted)',
              fontFamily: 'var(--font-accent)',
              fontStyle: 'italic',
            }}
          >
            "{table.label}"
          </p>
        )}
      </div>

      {/* Divider */}
      <div
        className="h-px"
        style={{ backgroundColor: 'var(--color-gold)', opacity: 0.3 }}
      />

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={printQRCode}
          className="flex-1 px-4 py-3 rounded-lg text-sm font-semibold transition hover:opacity-90"
          style={{
            backgroundColor: 'var(--color-primary)',
            color: 'var(--color-gold)',
          }}
          aria-label={`Print QR code for table ${table.tableNumber}`}
        >
          🖨️ Print
        </button>
        <button
          type="button"
          onClick={handleDelete}
          className="flex-1 px-4 py-3 rounded-lg text-sm font-semibold transition hover:opacity-90 border-2"
          style={{
            borderColor: '#DC2626',
            color: '#DC2626',
            backgroundColor: 'transparent',
          }}
          aria-label={`Delete table ${table.tableNumber}`}
        >
          🗑️ Delete
        </button>
      </div>
    </article>
  );
};

export default QRCodeCard;
