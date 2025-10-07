import React, { useState } from 'react';
import { Button, TextField, Typography, CircularProgress, Box } from '@mui/material';
import QRCode from 'qrcode';
import jsPDF from 'jspdf';
import PageLayout from '../layout/PageLayout';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { CONFIG_HEADERS } from '../util/constants';

const cellSize = 56.7; // 2cm 
const qrSize = 46;
const margin = 10;
const fontSize = 5;
const textMargin = 2;
const gridLineColor = '#cccccc';
const gridLineWidth = 0.5;

const GenerateQR: React.FC = () => {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const { city, config } = useSelector((state: RootState) => state.auth)
  const [startNumber, setStartNumber] = useState(1);
  const [endNumber, setEndNumber] = useState(100);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const generateSequentialID = (counter: number): string => {
    return counter.toString().padStart(6, '0');
  };

  const generatePDF = async () => {
    setIsGeneratingPDF(true);

    await new Promise(resolve => setTimeout(resolve, 100));

    const idPrefix = config.find(cfg => cfg?.Key === city)?.[CONFIG_HEADERS.QR_PREFIX]
    const prefix = `qr-checkin.thebookies.org/${city.toLowerCase()}/${idPrefix}`;
    const cityCode = prefix.split('/').pop() || '';
    const pdf = new jsPDF({ unit: 'pt', format: 'a4' });
    const fullPageWidth = 595.28;
    const fullPageHeight = 841.89;

    const columns = 10;
    const totalGridWidth = columns * cellSize;
    const horizontalOffset = (fullPageWidth - totalGridWidth) / 2;

    const rows = Math.floor((fullPageHeight - 2 * margin) / cellSize);
    const totalGridHeight = rows * cellSize;
    const verticalOffset = (fullPageHeight - totalGridHeight) / 2;

    let current = startNumber;
    let page = 0;

    while (current <= endNumber) {
      if (page > 0) pdf.addPage();
      page++;

      // Draw grid
      pdf.setDrawColor(gridLineColor);
      pdf.setLineWidth(gridLineWidth);
      pdf.setLineDashPattern([3, 2], 0);

      for (let i = 0; i <= columns; i++) {
        const x = horizontalOffset + i * cellSize;
        pdf.line(x, verticalOffset, x, verticalOffset + rows * cellSize);
      }

      for (let i = 0; i <= rows; i++) {
        const y = verticalOffset + i * cellSize;
        pdf.line(horizontalOffset, y, horizontalOffset + columns * cellSize, y);
      }

      pdf.setLineDashPattern([], 0);

      for (let i = 0; i < columns * rows && current <= endNumber; i++, current++) {
        const row = Math.floor(i / columns);
        const col = i % columns;

        const cellX = horizontalOffset + col * cellSize;
        const cellY = verticalOffset + row * cellSize;

        const id = generateSequentialID(current);
        const fullId = `${prefix}${id}`;
        const qrDataURL = await QRCode.toDataURL(fullId, {
          errorCorrectionLevel: 'low',
          margin: 1
        });

        const qrX = cellX + (cellSize - qrSize) / 2;
        const qrY = cellY + (cellSize - qrSize - fontSize - textMargin) / 2;
        pdf.addImage(qrDataURL, 'PNG', qrX, qrY, qrSize, qrSize);

        pdf.setFontSize(fontSize);
        const label = `${cityCode}${id}`;
        const textWidth = pdf.getTextWidth(label);
        const textX = cellX + (cellSize - textWidth) / 2;
        const textY = qrY + qrSize + textMargin + fontSize - 2;

        pdf.text(label, textX, textY);
      }
    }

    const pdfBlob = pdf.output('blob');
    const blobUrl = URL.createObjectURL(pdfBlob);
    setPdfUrl(blobUrl);

    setIsGeneratingPDF(false);
  };

  return (
    <PageLayout title='Generate QR Codes'>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: 'calc(100vh - 100px)',
        }}
      >
        {/* Controls */}
        <Box sx={{ paddingBottom: 2, display: 'flex', gap: 1 }}>
          <TextField
            label="Start Number"
            type="number"
            size='small'
            value={startNumber}
            onChange={(e) => setStartNumber(Number(e.target.value))}
          />
          <TextField
            label="End Number"
            type="number"
            size='small'
            value={endNumber}
            onChange={(e) => setEndNumber(Number(e.target.value))}
          />
          <Button variant="contained" onClick={generatePDF} disabled={isGeneratingPDF} sx={{ boxShadow: 'none' }}>
            {isGeneratingPDF ? <CircularProgress sx={{ color: 'white' }} disableShrink size={28} /> : 'Generate'}
          </Button>
        </Box>

        {/* PDF Preview */}
        <Box
          sx={{
            flexGrow: 1,
            border: '1px solid rgba(0,0,0,0.15)',
            borderRadius: '5px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
          }}
        >
          {pdfUrl ? (
            <iframe
              src={pdfUrl}
              style={{ border: 'none', width: '100%', height: '100%' }}
            />
          ) : (
            <Typography
              variant='h5'
              sx={{
                textTransform: 'uppercase',
                fontWeight: 900,
                color: 'gray',
                letterSpacing: 2,
              }}
            >
              Preview
            </Typography>
          )}
        </Box>
      </Box>
    </PageLayout>
  );
};

export default GenerateQR;
