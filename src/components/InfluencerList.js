import React from 'react';
import { List, Box } from '@mui/material';
import InfluencerCard from './InfluencerCard';

function InfluencerList({ influencers }) {
  return (
    <List>
      {influencers.map((influencer, index) => (
        <Box key={influencer.id} sx={{ mb: 2 }}>
          <InfluencerCard influencer={influencer} rank={index + 1} />
        </Box>
      ))}
    </List>
  );
}

export default InfluencerList;