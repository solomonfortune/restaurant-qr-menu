import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import QRCodeCard from '../../components/QRCodeCard';
import api from '../../api/axios';
import { useToast } from '../../components/ToastContainer';

/**
 * TablesPage Component
 * Grid of dining tables with QR codes
 * Features: Add/delete tables, print all QR codes on A4 sheet (4x2 layout)
 */

const TablesPage = () => {
  const [tables, setTables] = useState([]);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [tableNum, setTableNum] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const fetchTables = async () => {
    try {
      const { data } = await api.get('/tables');
      setTables(data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load tables.');
    }
  };

  useEffect(() => {
    fetchTables();
  }, []);

  const handleAddTable = async (e) => {
    e.preventDefault();
    if (!tableNum.trim()) {
      setError('Please enter a table number');
      toast.warning('⚠ Please enter a table number');
      return;
    }

    setLoading(true);
    try {
      await api.post('/tables', { tableNumber: parseInt(tableNum) });
      setTableNum('');
      setShowModal(false);
      setError('');
      toast.success('✓ Table added successfully!');
      await fetchTables();
    } catch (err) {
      const message = err.response?.data?.message || 'Could not add table.';
      setError(message);
      toast.error('✕ ' + message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTable = async (tableId) => {
    if (!window.confirm('Are you sure you want to delete this table?')) return;

    try {
      await api.delete(`/tables/${tableId}`);
      setError('');
      toast.success('✓ Table deleted');
      await fetchTables();
    } catch (err) {
      const message = err.response?.data?.message || 'Could not delete table.';
      setError(message);
      toast.error('✕ ' + message);
    }
  };

  const handlePrintAllQRs = () => {
    if (tables.length === 0) {
      alert('No tables to print');
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8" />
        <title>Restaurant QR Codes</title>
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Dancing+Script:wght@400;600&family=Lato:wght@400&display=swap" rel="stylesheet" />
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: 'Lato', sans-serif;
            background: #FDF6EC;
            padding: 20px;
          }
          .a4-page {
            width: 210mm;
            height: 297mm;
            background: white;
            margin: 0 auto 20px;
            padding: 20mm;
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20mm;
            align-items: center;
            align-content: center;
          }
          .qr-block {
            text-align: center;
            padding: 15mm;
            border: 2px solid #C9A84C;
            border-radius: 8px;
            background: #FDF6EC;
          }
          .qr-block svg {
            width: 80mm;
            height: 80mm;
            margin: 10mm 0;
            display: block;
          }
          .restaurant-name {
            font-family: 'Playfair Display', serif;
            font-size: 16px;
            font-weight: 700;
            color: #8B1A1A;
            margin-bottom: 8px;
          }
          .divider {
            height: 1px;
            background: #C9A84C;
            opacity: 0.4;
            margin: 8px 0;
          }
          .table-label {
            font-family: 'Dancing Script', cursive;
            font-size: 24px;
            font-weight: 600;
            color: #C9A84C;
            margin: 8px 0;
          }
          .table-number {
            font-family: 'Playfair Display', serif;
            font-size: 42px;
            font-weight: 700;
            color: #8B1A1A;
            margin: 8px 0;
          }
          .tagline {
            font-family: 'Dancing Script', cursive;
            font-size: 12px;
            font-style: italic;
            color: #8C7B6B;
            margin-top: 8px;
          }
          @media print {
            body { background: white; padding: 0; }
            .a4-page { margin: 0; break-after: page; }
          }
        </style>
      </head>
      <body>
        ${tables
          .map((table, idx) => {
            // New page every 4 tables (2 rows × 2 cols)
            if (idx % 4 === 0) {
              return '<div class="a4-page">';
            }
            return '';
          })
          .join('')}

        ${tables
          .map((table) => {
            return `
              <div class="qr-block">
                <div class="restaurant-name">Digital Diner</div>
                <div class="divider"></div>
                <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                  <rect width="100" height="100" fill="white"/>
                  <text x="50" y="50" font-size="40" text-anchor="middle" dy=".3em" fill="#8B1A1A">📱</text>
                </svg>
                <div class="table-label">Table</div>
                <div class="table-number">${table.tableNumber}</div>
                <div class="tagline">Scan to order</div>
              </div>
            `;
          })
          .join('')}

        </div>
      </body>
      </html>
    `;

    const printWindow = window.open('', '', 'height=600,width=800');
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  return (
    <AdminLayout
      title="Tables"
      subtitle="Manage dining tables and generate QR codes"
    >
      {error && (
        <div
          className="rounded-lg px-6 py-4 text-sm mb-6"
          style={{
            backgroundColor: '#FEE2E2',
            color: '#991B1B',
          }}
        >
          {error}
        </div>
      )}

      {/* Action Bar */}
      <div className="flex flex-col gap-4 mb-8 sm:flex-row sm:items-center sm:justify-between">
        <h2 style={{ color: 'var(--color-espresso)', fontSize: '18px', fontWeight: '600' }}>
          Total Tables: <span style={{ color: 'var(--color-primary)' }}>{tables.length}</span>
        </h2>
        <div className="flex gap-3">
          <button
            onClick={handlePrintAllQRs}
            disabled={tables.length === 0}
            className="px-4 py-2 rounded-lg font-semibold text-sm transition-all"
            style={{
              backgroundColor: 'var(--color-accent)',
              color: 'var(--color-white)',
              opacity: tables.length === 0 ? 0.5 : 1,
              cursor: tables.length === 0 ? 'not-allowed' : 'pointer',
            }}
          >
            🖨️ Print All QRs
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 rounded-lg font-semibold text-sm text-white transition-all"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            ➕ Add Table
          </button>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          onClick={() => setShowModal(false)}
        >
          <div
            className="w-full max-w-md rounded-xl p-6 shadow-lg"
            style={{
              backgroundColor: 'var(--color-cream-light)',
              animation: 'popIn 0.3s cubic-bezier(0.25,0.46,0.45,0.94)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3
              className="font-display text-2xl font-bold mb-4"
              style={{ color: 'var(--color-espresso)' }}
            >
              Add New Table
            </h3>
            <form onSubmit={handleAddTable} className="space-y-4">
              <div>
                <label
                  className="block text-sm font-semibold mb-2"
                  style={{ color: 'var(--color-charcoal)' }}
                >
                  Table Number
                </label>
                <input
                  type="number"
                  min="1"
                  value={tableNum}
                  onChange={(e) => setTableNum(e.target.value)}
                  placeholder="e.g., 1, 2, 3..."
                  className="w-full px-4 py-2 rounded-lg border-b-2 focus:outline-none transition-all"
                  style={{
                    borderColor: 'transparent',
                    borderBottomColor: 'var(--color-accent)',
                    backgroundColor: 'var(--color-white)',
                  }}
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2 rounded-lg font-semibold text-white transition-all"
                  style={{
                    backgroundColor: 'var(--color-primary)',
                    opacity: loading ? 0.7 : 1,
                  }}
                >
                  {loading ? '⏳ Adding...' : '✓ Add Table'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2 rounded-lg font-semibold transition-all"
                  style={{
                    backgroundColor: 'var(--color-cream-dark)',
                    color: 'var(--color-espresso)',
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tables Grid */}
      {tables.length === 0 ? (
        <div
          className="rounded-xl p-12 text-center"
          style={{ backgroundColor: 'var(--color-cream-dark)' }}
        >
          <p
            className="text-lg font-semibold mb-2"
            style={{ color: 'var(--color-espresso)' }}
          >
            No tables yet
          </p>
          <p style={{ color: 'var(--color-muted)', marginBottom: '20px' }}>
            Get started by adding your first dining table
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="px-6 py-2 rounded-lg font-semibold text-white"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            ➕ Add First Table
          </button>
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {tables.map((table) => (
            <QRCodeCard
              key={table._id}
              table={table}
              onDelete={handleDeleteTable}
            />
          ))}
        </div>
      )}
    </AdminLayout>
  );
};

export default TablesPage;
