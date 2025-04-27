import {
  Box,
  Button,
  Chip,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography
} from '@mui/material';
import React, { useState, useRef } from 'react';
import PageLayout from '../layout/PageLayout';
import { Upload } from '@mui/icons-material';
import * as XLSX from 'xlsx';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { emailTemplate, qrSection } from '../util/templates/emai-template';

const Mail = () => {
  const [excelData, setExcelData] = useState<any[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [selectedEmailColumn, setSelectedEmailColumn] = useState('');
  const [subject, setSubject] = useState('YOU MADE IT TO MUMBAI BOOKIES');
  const [embedQr, setEmbedQr] = useState(true);
  const [body, setBody] = useState(`
    <p>Hi,</p><br>
    <p>Welcome to the Mumbai Bookies community</p><br>
    <p>I'm glad that you're going to join us this time. We're super excited to read with you!</p><br>
    <p>Whether you’re here to dive into the depths of literature, discover hidden gems, or simply enjoy the company of fellow book lovers, this community is going to be a space where we read, and we can belong!</p><br>
    <p>Please join the WhatsApp group below for location and other updates (don't forget to check the group description)</p><br>
    <p><a href="https://chat.whatsapp.com/I4ga8C0mZC6II49RhxgHGg">Click here to join the Whatsapp group</a></p><br>
    <p><strong>Please only join if you intend to actually come this Sunday :)</strong></p><br>
    <p>SEE YOU ON SUNDAY</p><br>
    <p>Love,<br><strong>Mumbai Bookies</strong><br></p><br>
    <img src="https://c2w85ig2lt.ufs.sh/f/elHNGJqHN4xJTWcXzJYP3H8yawieBN79GIJUZRmd526qgOfY" style="max-width: 100%;"/>
  `);

  const quillRef = useRef<any>(null);

  const handleExcelUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target?.result;
      const workbook = XLSX.read(data, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      const cols = jsonData.length > 0 ? Object.keys(jsonData[0]) : [];

      setExcelData(jsonData);
      setColumns(cols);
    };
    reader.readAsBinaryString(file);
  };

  const handleEmailColumnChange = (event: any) => {
    setSelectedEmailColumn(event.target.value);
  };

  const insertFieldToken = (field: string) => {
    const editor = quillRef.current?.getEditor();
    if (editor) {
      const range = editor.getSelection();
      if (range) {
        editor.insertText(range.index, `{${field}}`);
      } else {
        editor.insertText(0, `{${field}}`);
      }
    }
  };


  return (
    <PageLayout title="Mass Mail">
      <Box>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '1.5fr 1fr',
            gap: 2
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box>
              <Button
                component="label"
                startIcon={<Upload />}
                variant="outlined"
              >
                Upload Excel Sheet
                <input
                  type="file"
                  hidden
                  accept=".xlsx, .xls"
                  onChange={handleExcelUpload}
                />
              </Button>
            </Box>

            <Box
              sx={{
                border: '1px solid rgba(0,0,0,0.15)',
                borderRadius: 2,
                p: 2,
                display: 'grid',
                gap: 2
              }}
            >
              <FormControl sx={{ minWidth: 220 }} size="small">
                <InputLabel id="email-col-label">Select Email Column</InputLabel>
                <Select
                  labelId="email-col-label"
                  id="email-col"
                  value={selectedEmailColumn}
                  label="Select Email Column"
                  onChange={handleEmailColumnChange}
                >
                  {columns.map((col) => (
                    <MenuItem key={col} value={col}>
                      {col}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl sx={{ minWidth: 220 }} size="small">
                <InputLabel id="sender-email-label">Select Sender Email</InputLabel>
                <Select
                  labelId="sender-email-label"
                  id="sender-email"
                  label="Select Sender Email"
                >
                  <MenuItem value="">
                    example@gmail.com
                  </MenuItem>
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="Subject"
                variant="outlined"
                size="small"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />

              <Box>
                <Box
                  sx={{
                    '& .ql-editor': {
                      maxHeight: 410,
                      '& img': {
                        maxWidth: '200px',
                        height: 'auto'
                      }
                    }
                  }}
                >
                  <ReactQuill
                    ref={quillRef}
                    theme="snow"
                    value={body}
                    onChange={setBody}
                    modules={{
                      toolbar: [
                        [{ header: [1, 2, 3, false] }],
                        ['bold', 'italic', 'underline', 'strike'],
                        [{ list: 'ordered' }, { list: 'bullet' }],
                        ['link', 'image'],
                        [{ color: [] }, { background: [] }],
                        [{ align: [] }],
                        ['clean']
                      ]
                    }}
                  />
                </Box>

                {columns.length > 0 && (
                  <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {columns.map((col) => (
                      <Chip
                        key={col}
                        label={`{${col}}`}
                        onClick={() => insertFieldToken(col)}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                )}
              </Box>

              <Box>
                <FormControl component="fieldset">
                  <Typography variant="subtitle2" gutterBottom>Embed QR Code?</Typography>
                  <RadioGroup
                    row
                    value={embedQr ? 'yes' : 'no'}
                    onChange={(e) => setEmbedQr(e.target.value === 'yes')}
                  >
                    <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                    <FormControlLabel value="no" control={<Radio />} label="No" />
                  </RadioGroup>
                </FormControl>
              </Box>

            </Box>

            <Button variant="contained" sx={{ width: 'fit-content', px: 6, bgcolor: '#403d14', boxShadow: 'none' }}>
              Send
            </Button>
          </Box>

          <Box
            sx={{
              border: '1px solid rgba(0,0,0,0.15)',
              borderRadius: 2,
              p: 2,
              overflowY: 'auto',
              maxHeight: '90vh'
            }}
          >
            <Box sx={{ mb: 2 }}>
              <Typography>
                <strong>Subject:</strong> {subject}
              </Typography>
            </Box>

            <div
              dangerouslySetInnerHTML={{
                __html: emailTemplate.replace('{{body}}', embedQr ? (body + qrSection) : body)
              }}
            />
          </Box>
        </Box>
      </Box>
    </PageLayout>
  );
};

export default Mail;
