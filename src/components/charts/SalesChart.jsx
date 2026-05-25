import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, Typography } from "@mui/material";

const SalesChart = ({ data }) => {
  return (
    <Card sx={{ background: "#1a1a1a" }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Sales Overview
        </Typography>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="total" stroke="#8e24aa" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default SalesChart;