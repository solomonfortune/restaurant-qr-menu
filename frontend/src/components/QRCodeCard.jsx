import { useState } from 'react';
import QRCode from 'react-qr-code';
import api from '../api/axios';

function QRCodeCard({ table, onDelete }) {
  const [deleting, setDeleting] = useState(false);

  const handlePrint = () => {
    const printWindow = window.open('', '', 'width=400,height=500');
    printWindow.document.write(`
      <html>
        <head>
          <title>QR Code - Table ${table.tableNumber}</title>
          <style>
            body {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              margin: 0;
              font-family: Arial, sans-serif;
            }
            .qr-code svg {
              width: 250px !important;
              height: 250px !important;
            }
            h2 { margin: 20px 0 5px; }
            p { margin: 0; color: #666; }
          </style>
        </head>
        <body>
          <div class="qr-code">
            ${document.querySelector(`[data-qr-id="${table._id}"] svg`).outerHTML}
          </div>
          <h2>Table ${table.tableNumber}</h2>
          <p>${table.label || 'No label'}</p>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete Table ${table.tableNumber}?`)) return;
    
    setDeleting(true);
    try {
      await api.delete(`/tables/${table._id}`);
      if (onDelete) onDelete();
    } catch (error) {
      console.error('Failed to delete table:', error);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-4">
      <div className="bg-white p-4 rounded-lg flex justify-center mb-4" data-qr-id={table._id}>
        <QRCode value={table.qrCodeUrl} size={150} />
      </div>
      <div className="text-center mb-4">
        <h3 className="font-bold text-lg">Table {table.tableNumber}</h3>
        <p className="text-gray-500 text-sm">{table.label || 'No label'}</p>
      </div>
      <div className="flex gap-2">
        <button
          onClick={handlePrint}
          className="flex-1 bg-primary text-white py-2 rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors"
        >
          Print QR
        </button>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="px-4 py-2 bg-red-100 text-red-600 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors disabled:opacity-50"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

export default QRCodeCard;
