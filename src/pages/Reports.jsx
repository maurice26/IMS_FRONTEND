import { useQuery } from "@apollo/client";
import AssessmentIcon from "@mui/icons-material/Assessment";
import DownloadIcon from "@mui/icons-material/Download";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import TableChartIcon from "@mui/icons-material/TableChart";
import { Alert, Box, Card, CardContent, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import { useState } from "react";
import {
  GET_PRODUCTS, GET_PURCHASES, GET_SALES, GET_USERS,
} from "../graphql/queries";
import {
  downloadCSV,
  downloadPDF,
  generatePurchasesPDF,
  generateSalesPDF,
  generateSystemPDF,
  generateSystemReport,
} from "../utils/download";

const Reports = () => {
  const { data: usersData } = useQuery(GET_USERS);
  const { data: productsData } = useQuery(GET_PRODUCTS);
  const { data: salesData } = useQuery(GET_SALES);
  const { data: purchasesData } = useQuery(GET_PURCHASES);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const users = usersData?.users || [];
  const products = productsData?.products || [];
  const sales = salesData?.sales || [];
  const purchases = purchasesData?.purchases || [];

  const run = (label, fn) => {
    setError("");
    setSuccess("");
    try {
      fn();
      setSuccess(`${label} downloaded successfully.`);
    } catch (err) {
      console.error(err);
      setError(`Failed to generate ${label}. Please try again.`);
    }
  };

  const handleSalesCSV = () =>
    run("Sales CSV", () => {
      if (sales.length === 0) throw new Error("No data");
      const headers = "Sale ID,Product ID,Quantity,Total Price,Date";
      const rows = sales.map((s) =>
        `${s.saleId},${s.productId},${s.quantity},${s.totalPrice},${s.saleDate || ""}`
      ).join("\n");
      downloadCSV(`${headers}\n${rows}`, "sales_report.csv");
    });

  const handleSalesPDF = () =>
    run("Sales PDF", () => {
      if (sales.length === 0) throw new Error("No data");
      generateSalesPDF(sales);
    });

  const handlePurchasesPDF = () =>
    run("Purchases PDF", () => {
      if (purchases.length === 0) throw new Error("No data");
      generatePurchasesPDF(purchases);
    });

  const handleReceiptPDF = async () => {
    setError("");
    setSuccess("");
    try {
      await downloadPDF(1);
      setSuccess("Receipt downloaded.");
    } catch (err) {
      setError("Could not download receipt.");
    }
  };

  const handleSystemCSV = () =>
    run("System Report CSV", () => generateSystemReport(users, products, sales, purchases));

  const handleSystemPDF = () =>
    run("System Report PDF", () => generateSystemPDF(users, products, sales, purchases));

  const ReportButton = ({ label, icon, onClick, disabled }) => (
    <Button
      variant="contained"
      size="large"
      onClick={onClick}
      disabled={disabled}
      startIcon={icon}
      sx={{ mr: 2, mb: 2, px: 4, minWidth: 200 }}
    >
      {label}
    </Button>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h3" sx={{ mb: 1 }}>
        Reports Center
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Export your data as PDF or CSV files
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess("")}>{success}</Alert>}

      <Card sx={{ background: "#1a1a1a", mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Sales Reports
          </Typography>
          <ReportButton
            label="Sales — PDF"
            icon={<PictureAsPdfIcon />}
            onClick={handleSalesPDF}
            disabled={sales.length === 0}
          />
          <ReportButton
            label="Sales — CSV"
            icon={<TableChartIcon />}
            onClick={handleSalesCSV}
            disabled={sales.length === 0}
          />
        </CardContent>
      </Card>

      <Card sx={{ background: "#1a1a1a", mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Purchases Reports
          </Typography>
          <ReportButton
            label="Purchases — PDF"
            icon={<PictureAsPdfIcon />}
            onClick={handlePurchasesPDF}
            disabled={purchases.length === 0}
          />
        </CardContent>
      </Card>

      <Card sx={{ background: "#1a1a1a", mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Receipt
          </Typography>
          <ReportButton
            label="Download Receipt PDF"
            icon={<DownloadIcon />}
            onClick={handleReceiptPDF}
          />
        </CardContent>
      </Card>

      <Card sx={{ background: "#1a1a1a" }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Full System Report
          </Typography>
          <ReportButton
            label="System Report — PDF"
            icon={<PictureAsPdfIcon />}
            onClick={handleSystemPDF}
            disabled={users.length === 0}
          />
          <ReportButton
            label="System Report — CSV"
            icon={<AssessmentIcon />}
            onClick={handleSystemCSV}
            disabled={users.length === 0}
          />
        </CardContent>
      </Card>
    </Box>
  );
};

export default Reports;