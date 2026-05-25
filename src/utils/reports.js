// routes/reports.js
import express from "express";
import { Parser } from "json2csv";
import PDFDocument from "pdfkit";
import Sale from "../models/Sale.js";      // adjust to your actual model
import Order from "../models/Order.js";    // adjust to your actual model

const router = express.Router();

// GET /api/reports/sales  →  CSV download
router.get("/sales", async (req, res) => {
  try {
    const sales = await Sale.find().lean(); // adjust query to your model

    const parser = new Parser();
    const csv = parser.parse(sales);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=sales.csv");
    res.status(200).end(csv);
  } catch (err) {
    console.error("CSV export error:", err);
    res.status(500).json({ error: "Failed to generate CSV" });
  }
});

// GET /api/reports/receipt/:id  →  PDF view
router.get("/receipt/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).lean(); // adjust to your model

    if (!order) return res.status(404).json({ error: "Order not found" });

    const doc = new PDFDocument();
    res.setHeader("Content-Type", "application/pdf");
    doc.pipe(res);

    // Customize this receipt layout as needed
    doc.fontSize(20).text("Receipt", { align: "center" });
    doc.moveDown();
    doc.fontSize(12).text(`Order ID: ${order._id}`);
    doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`);
    doc.text(`Total: $${order.total}`);
    // add more fields from your order model here

    doc.end();
  } catch (err) {
    console.error("PDF export error:", err);
    res.status(500).json({ error: "Failed to generate PDF" });
  }
});

export default router;