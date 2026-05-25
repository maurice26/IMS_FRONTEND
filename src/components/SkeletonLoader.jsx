import { Box, Grid, Skeleton } from "@mui/material";

const SkeletonLoader = ({ cards = 5, charts = true, rows = 3 }) => (
  <Box sx={{ p: 3 }}>
    {/* Header skeleton */}
    <Skeleton
      variant="text"
      sx={{
        fontSize: "2.5rem",
        width: 320,
        mb: 1,
        bgcolor: "rgba(142, 36, 170, 0.1)",
      }}
    />
    <Skeleton
      variant="text"
      sx={{
        fontSize: "1rem",
        width: 240,
        mb: 4,
        bgcolor: "rgba(255, 255, 255, 0.05)",
      }}
    />

    {/* KPI Cards skeleton */}
    <Grid container spacing={2} sx={{ mb: 4 }}>
      {Array.from({ length: cards }).map((_, i) => (
        <Grid item xs={12} sm={6} md={12 / cards} key={i}>
          <Box
            className="shimmer"
            sx={{
              height: 140,
              borderRadius: 3,
              bgcolor: "rgba(20, 20, 30, 0.5)",
              border: "1px solid rgba(255,255,255,0.04)",
            }}
          />
        </Grid>
      ))}
    </Grid>

    {/* Charts skeleton */}
    {charts && (
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Box
            className="shimmer"
            sx={{
              height: 360,
              borderRadius: 3,
              bgcolor: "rgba(20, 20, 30, 0.5)",
              border: "1px solid rgba(255,255,255,0.04)",
            }}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <Box
            className="shimmer"
            sx={{
              height: 360,
              borderRadius: 3,
              bgcolor: "rgba(20, 20, 30, 0.5)",
              border: "1px solid rgba(255,255,255,0.04)",
            }}
          />
        </Grid>
      </Grid>
    )}

    {/* Table rows skeleton */}
    <Box sx={{ mt: 4 }}>
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton
          key={i}
          variant="rectangular"
          height={52}
          sx={{
            mb: 1,
            borderRadius: 1,
            bgcolor: "rgba(255, 255, 255, 0.03)",
          }}
        />
      ))}
    </Box>
  </Box>
);

export default SkeletonLoader;