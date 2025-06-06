import React from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
} from '@mui/material';

const regions = ['すべて', '福岡', '東京', '大阪', '北海道'];

function RegionFilter({ selectedRegion, onRegionChange }) {
  return (
    <Box sx={{ minWidth: 120, mb: 3 }}>
      <FormControl fullWidth>
        <InputLabel id="region-select-label">地域</InputLabel>
        <Select
          labelId="region-select-label"
          id="region-select"
          value={selectedRegion}
          label="地域"
          onChange={onRegionChange}
        >
          {regions.map((region) => (
            <MenuItem key={region} value={region}>
              {region}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}

export default RegionFilter;