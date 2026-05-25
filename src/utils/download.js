import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// ─── HELPERS ────────────────────────────────────────────────
const triggerDownload = (url, filename) => {
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
};

const addPageHeader = (doc, title) => {
  // Purple header bar
  doc.setFillColor(74, 20, 140);
  doc.rect(0, 0, 210, 28, "F");

  // App name
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.text("Inventory Management System", 14, 10);

  // Report title
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text(title, 14, 22);

  // Generated date (right side)
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text(`Generated: ${new Date().toLocaleString()}`, 140, 22);

  // Reset text color
  doc.setTextColor(30, 30, 30);

  return 38; // y position after header
};

const tableStyles = {
  headStyles: { fillColor: [74, 20, 140], textColor: 255, fontStyle: "bold" },
  alternateRowStyles: { fillColor: [245, 240, 255] },
  styles: { fontSize: 9, cellPadding: 3 },
  theme: "grid",
};

// ─── CSV ─────────────────────────────────────────────────────
export const downloadCSV = (content, filename = "report.csv") => {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = window.URL.createObjectURL(blob);
  triggerDownload(url, filename);
};

// ─── RECEIPT PDF (from backend) ───────────────────────────────
export const downloadPDF = async (saleId) => {
  try {
    const apiBase = import.meta.env.VITE_API_URL || "https://localhost:7189";
    const res = await fetch(`${apiBase}/api/receipt/${saleId}`);
    if (!res.ok) throw new Error(`Server returned ${res.status}`);
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    triggerDownload(url, `receipt_${saleId}.pdf`);
  } catch (err) {
    console.error("Receipt download failed:", err);
    alert("Could not download receipt. The server may be unavailable.");
  }
};

// ─── SALES PDF ────────────────────────────────────────────────
export const generateSalesPDF = (sales) => {
  const doc = new jsPDF();
  let y = addPageHeader(doc, "Sales Report");

  // Summary box
  const totalRevenue = sales.reduce((acc, s) => acc + (s.totalPrice || 0), 0);
  doc.setFillColor(240, 240, 240);
  doc.rect(14, y, 182, 18, "F");
  doc.setFontSize(10);
  doc.text(`Total Sales: ${sales.length}`, 18, y + 7);
  doc.text(`Total Revenue: KES ${totalRevenue.toLocaleString()}`, 18, y + 14);
  y += 24;

  autoTable(doc, {
    ...tableStyles,
    startY: y,
    head: [["Sale ID", "Product ID", "Quantity", "Total (KES)", "Date"]],
    body: sales.map((s) => [
      s.saleId,
      s.productId,
      s.quantity,
      `KES ${(s.totalPrice || 0).toLocaleString()}`,
      s.saleDate ? new Date(s.saleDate).toLocaleDateString() : "—",
    ]),
  });

  doc.save(`Sales_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
};

// ─── PURCHASES PDF ────────────────────────────────────────────
export const generatePurchasesPDF = (purchases) => {
  const doc = new jsPDF();
  let y = addPageHeader(doc, "Purchases Report");

  const totalExpenses = purchases.reduce((acc, p) => acc + (p.totalPrice || 0), 0);
  doc.setFillColor(240, 240, 240);
  doc.rect(14, y, 182, 18, "F");
  doc.setFontSize(10);
  doc.text(`Total Purchases: ${purchases.length}`, 18, y + 7);
  doc.text(`Total Expenses: KES ${totalExpenses.toLocaleString()}`, 18, y + 14);
  y += 24;

  autoTable(doc, {
    ...tableStyles,
    startY: y,
    head: [["Purchase ID", "Product ID", "Quantity", "Total (KES)", "Date"]],
    body: purchases.map((p) => [
      p.purchaseId,
      p.productId || "—",
      p.quantity || "—",
      `KES ${(p.totalPrice || 0).toLocaleString()}`,
      p.purchaseDate ? new Date(p.purchaseDate).toLocaleDateString() : "—",
    ]),
  });

  doc.save(`Purchases_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
};

// ─── SYSTEM CSV ───────────────────────────────────────────────
export const generateSystemReport = (users, products, sales, purchases) => {
  let csv = "IMS System Report\n";
  csv += `Generated: ${new Date().toLocaleString()}\n\n`;

  csv += "SUMMARY\n";
  csv += `Total Users,${users.length}\n`;
  csv += `Total Products,${products.length}\n`;
  csv += `Total Sales,${sales.length},Revenue,KES ${sales.reduce((a, s) => a + (s.totalPrice || 0), 0).toLocaleString()}\n`;
  csv += `Total Purchases,${purchases.length},Expenses,KES ${purchases.reduce((a, p) => a + (p.totalPrice || 0), 0).toLocaleString()}\n\n`;

  csv += "USERS\nID,Name,Email,Role\n";
  users.forEach((u) => csv += `${u.userId},"${u.name || ""}","${u.email}",${u.role}\n`);
  csv += "\n";

  csv += "PRODUCTS\nID,Name,Price,Stock\n";
  products.forEach((p) => csv += `${p.productId},"${p.name}",${p.price},${p.stockQuantity || 0}\n`);
  csv += "\n";

  csv += "SALES\nID,Product ID,Qty,Total,Date\n";
  sales.forEach((s) => csv += `${s.saleId},${s.productId},${s.quantity},${s.totalPrice},${s.saleDate || ""}\n`);
  csv += "\n";

  csv += "PURCHASES\nID,Product ID,Qty,Total,Date\n";
  purchases.forEach((p) => csv += `${p.purchaseId},${p.productId || ""},${p.quantity || ""},${p.totalPrice || ""},${p.purchaseDate || ""}\n`);

  downloadCSV(csv, `IMS_System_Report_${new Date().toISOString().slice(0, 10)}.csv`);
};

// ─── SYSTEM PDF ───────────────────────────────────────────────
export const generateSystemPDF = (users, products, sales, purchases) => {
  const doc = new jsPDF();
  let y = addPageHeader(doc, "Full System Report");

  // ── Summary box ──
  const totalRevenue = sales.reduce((a, s) => a + (s.totalPrice || 0), 0);
  const totalExpenses = purchases.reduce((a, p) => a + (p.totalPrice || 0), 0);

  doc.setFillColor(240, 240, 240);
  doc.rect(14, y, 182, 30, "F");
  doc.setFontSize(10);
  doc.text(`Total Users: ${users.length}`, 18, y + 8);
  doc.text(`Total Products: ${products.length}`, 18, y + 16);
  doc.text(`Total Sales: ${sales.length}  |  Revenue: KES ${totalRevenue.toLocaleString()}`, 18, y + 24);
  doc.text(`Total Purchases: ${purchases.length}  |  Expenses: KES ${totalExpenses.toLocaleString()}`, 110, y + 24);
  y += 36;

  // ── Users table ──
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(74, 20, 140);
  doc.text("Users", 14, y);
  y += 4;
  doc.setTextColor(30, 30, 30);
  doc.setFont("helvetica", "normal");

  autoTable(doc, {
    ...tableStyles,
    startY: y,
    head: [["ID", "Name", "Email", "Role"]],
    body: users.map((u) => [u.userId, u.name || "—", u.email, u.role]),
  });
  y = doc.lastAutoTable.finalY + 10;

  // ── Products table ──
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(74, 20, 140);
  doc.text("Products", 14, y);
  y += 4;
  doc.setTextColor(30, 30, 30);
  doc.setFont("helvetica", "normal");

  autoTable(doc, {
    ...tableStyles,
    startY: y,
    head: [["ID", "Name", "Price (KES)", "Stock"]],
    body: products.map((p) => [p.productId, p.name, `KES ${p.price}`, p.stockQuantity || 0]),
  });
  y = doc.lastAutoTable.finalY + 10;

  // ── Sales table ──
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(74, 20, 140);
  doc.text("Sales", 14, y);
  y += 4;
  doc.setTextColor(30, 30, 30);
  doc.setFont("helvetica", "normal");

  autoTable(doc, {
    ...tableStyles,
    startY: y,
    head: [["Sale ID", "Product ID", "Qty", "Total (KES)", "Date"]],
    body: sales.map((s) => [
      s.saleId, s.productId, s.quantity,
      `KES ${(s.totalPrice || 0).toLocaleString()}`,
      s.saleDate ? new Date(s.saleDate).toLocaleDateString() : "—",
    ]),
  });
  y = doc.lastAutoTable.finalY + 10;

  // ── Purchases table ──
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(74, 20, 140);
  doc.text("Purchases", 14, y);
  y += 4;
  doc.setTextColor(30, 30, 30);
  doc.setFont("helvetica", "normal");

  autoTable(doc, {
    ...tableStyles,
    startY: y,
    head: [["Purchase ID", "Product ID", "Qty", "Total (KES)", "Date"]],
    body: purchases.map((p) => [
      p.purchaseId, p.productId || "—", p.quantity || "—",
      `KES ${(p.totalPrice || 0).toLocaleString()}`,
      p.purchaseDate ? new Date(p.purchaseDate).toLocaleDateString() : "—",
    ]),
  });

  doc.save(`IMS_Full_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
};