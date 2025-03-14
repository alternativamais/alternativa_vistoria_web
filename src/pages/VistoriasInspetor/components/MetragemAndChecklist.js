/* eslint-disable react/prop-types */
import React from 'react';
import { Box, TextField } from '@mui/material';
import Checklist from './Checklist';

const MetragemAndChecklist = ({ formData, handleChange, checklistData, checklistSelections, handleSituacaoChange, vistoria }) => {
  return (
    <Box>
      <TextField
        label="Metragem do Cabo"
        name="metragemCabo"
        type="number"
        value={formData.metragemCabo || ''}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <Checklist
        checklistData={checklistData}
        checklistSelections={checklistSelections}
        handleSituacaoChange={handleSituacaoChange}
        vistoria={vistoria}
      />
    </Box>
  );
};

export default MetragemAndChecklist;
