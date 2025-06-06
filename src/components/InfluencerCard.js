import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info'; // 情報アイコン

function InfluencerCard({ influencer, rank }) {
  return (
    <Card variant="outlined">
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Typography variant="h5" component="div" sx={{ mr: 2 }}>
            {rank}
          </Typography>
          <Box>
            <Typography variant="body1" component="div">
              @{influencer.username}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
              <InfoIcon fontSize="small" sx={{ mr: 0.5 }} />
              <Typography variant="body2" color="text.secondary">
                フォロワー {influencer.followers.toLocaleString()}人
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              店舗名, 人気度_{influencer.popularity} / 地域 {influencer.region}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export default InfluencerCard;