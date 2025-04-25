import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import {
  Box,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  Chip,
  Stack,
  Tooltip,
  IconButton
} from '@mui/material';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import SettingsIcon from '@mui/icons-material/Settings';
import FileUploadIcon from '@mui/icons-material/FileUpload';

const Mail = () => {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [selectedColumn, setSelectedColumn] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [emails, setEmails] = useState([]);
  const [quillRef, setQuillRef] = useState(null);

  // Handle Excel file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const ab = e.target.result;
        const wb = XLSX.read(ab, { type: 'array' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json(ws);

        if (json.length > 0) {
          setData(json);
          setColumns(Object.keys(json[0]));
        } else {
          alert('No data found in the Excel sheet');
        }
      } catch (error) {
        console.error('Error parsing Excel file:', error);
        alert('Error parsing Excel file. Please try again with a valid file.');
      }
    };
    reader.readAsArrayBuffer(file);
  };

  // Handle HTML template upload
  const handleTemplateUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const htmlContent = e.target.result;
        setBody(htmlContent);
      } catch (error) {
        console.error('Error reading HTML template:', error);
        alert('Error reading HTML template. Please try again with a valid file.');
      }
    };
    reader.readAsText(file);
  };

  // Handle column selection
  const handleColumnSelect = (event) => {
    setSelectedColumn(event.target.value);
  };

  // Extract emails when column is selected
  useEffect(() => {
    if (selectedColumn && data.length > 0) {
      const extractedEmails = data
        .map(row => row[selectedColumn])
        .filter(email => email && typeof email === 'string');
      setEmails(extractedEmails);
    } else {
      setEmails([]);
    }
  }, [selectedColumn, data]);

  // Insert column placeholder into editor
  const insertColumnPlaceholder = (column) => {
    if (quillRef) {
      const quill = quillRef.getEditor();
      const range = quill.getSelection(true);
      quill.insertText(range.index, `{${column}}`, 'user');
      quill.setSelection(range.index + column.length + 2);
    }
  };

  // Quill modules configuration
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link', 'image'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'align': [] }],
      ['clean']
    ],
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 'medium', mb: 3 }}>Bulk Mail</Typography>

      <Box sx={{ display: 'flex', gap: 3 }}>
        {/* Left Panel - Email Creation */}
        <Box sx={{ flex: 2 }}>
          {/* Upload Excel Button */}
          <Paper
            sx={{
              mb: 2,
              p: 2,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              bgcolor: '#f5f5f5'
            }}
          >
            <Typography>Upload Excel Sheet</Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                component="label"
                sx={{ bgcolor: '#fff', color: '#000', '&:hover': { bgcolor: '#eee' } }}
              >
                Choose File
                <input
                  type="file"
                  accept=".xlsx, .xls"
                  hidden
                  onChange={handleFileUpload}
                />
              </Button>
              <Button sx={{ minWidth: 'auto', p: 1 }}>
                <SettingsIcon />
              </Button>
            </Box>
          </Paper>

          {/* Email Column Selection */}
          <Paper sx={{ mb: 2, p: 2, bgcolor: '#f5f5f5' }}>
            <FormControl fullWidth>
              <InputLabel id="email-column-label">Select Email Column</InputLabel>
              <Select
                labelId="email-column-label"
                id="email-column-select"
                value={selectedColumn}
                label="Select Email Column"
                onChange={handleColumnSelect}
                disabled={columns.length === 0}
              >
                {columns.map((column) => (
                  <MenuItem key={column} value={column}>
                    {column}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Paper>

          {/* Subject Field */}
          <TextField
            fullWidth
            label="Subject"
            variant="outlined"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            sx={{ mb: 2, bgcolor: '#f5f5f5' }}
          />

          {/* Mail Body - Rich Text Editor with Template Upload */}
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography>Mail Body</Typography>
              <Tooltip title="Upload HTML Template">
                <Button
                  variant="outlined"
                  component="label"
                  size="small"
                  startIcon={<FileUploadIcon />}
                  sx={{ bgcolor: '#fff' }}
                >
                  Template
                  <input
                    type="file"
                    accept=".html,.htm"
                    hidden
                    onChange={handleTemplateUpload}
                  />
                </Button>
              </Tooltip>
            </Box>
            <ReactQuill
              ref={(el) => setQuillRef(el)}
              theme="snow"
              value={body}
              onChange={setBody}
              modules={modules}
              style={{
                backgroundColor: '#f5f5f5',
                borderRadius: '4px',
                height: '300px',
                marginBottom: '50px'
              }}
            />
          </Box>

          {/* Column Variables */}
          {columns.length > 0 && (
            <Box sx={{ mt: 8 }}>
              <Typography sx={{ mb: 1 }}>Insert Column Variables:</Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                {columns.map((column) => (
                  <Chip
                    key={column}
                    label={column}
                    onClick={() => insertColumnPlaceholder(column)}
                    sx={{
                      bgcolor: '#f0f0f0',
                      '&:hover': { bgcolor: '#e0e0e0' }
                    }}
                  />
                ))}
              </Stack>
            </Box>
          )}

          {/* Send Button */}
          <Button
            variant="contained"
            sx={{
              mt: 3,
              bgcolor: '#58551E',
              color: 'white',
              '&:hover': { bgcolor: '#403d14' },
              px: 4,
              py: 1
            }}
          >
            Send Emails
          </Button>
        </Box>

        {/* Right Panel - Preview */}
        <Paper sx={{ flex: 1, p: 3, bgcolor: 'white' }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Preview</Typography>

          {/* Subject Preview */}
          {subject && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" sx={{ color: '#666' }}>Subject:</Typography>
              <Typography>{subject}</Typography>
            </Box>
          )}

          {/* Body Preview */}
          {body && (
            <Box>
              <Typography variant="subtitle2" sx={{ color: '#666' }}>Body:</Typography>
              <Box
                sx={{ mt: 1 }}
                dangerouslySetInnerHTML={{ __html: body }}
              />
            </Box>
          )}

          {/* Empty State */}
          {!subject && !body && (
            <Typography sx={{ color: '#999', fontStyle: 'italic' }}>
              Email preview will appear here
            </Typography>
          )}
        </Paper>
      </Box>
    </Box>
  );
};

export default Mail;/