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
  Typography,
  Alert,
  Snackbar,
  CircularProgress
} from '@mui/material';
import React, { useState, useRef, useEffect } from 'react';
import PageLayout from '../layout/PageLayout';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { emailTemplate, qrSection } from '../util/templates/emai-template';
import { useNavigate } from 'react-router-dom';
import { CONFIG_TYPES, ENV } from '../util/constants';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { getEmails } from '../api/api';
import { Sync } from '@mui/icons-material';

const Mail = () => {
  const { isLoggedIn, config, city } = useSelector((state: RootState) => state.auth)
  // const { currentCity, config } = useAuth();
  const [excelData, setExcelData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [selectedEmailColumn, setSelectedEmailColumn] = useState('');
  const [subject, setSubject] = useState(`YOU MADE IT TO ${city?.toUpperCase()?.replace(/\s*\(.*?\)\s*/g, '').trim()} BOOKIES`);
  const [embedQr, setEmbedQr] = useState(false);
  const [senderEmailConfig, setSenderEmailConfig] = useState({
    senderEmail: '',
    senderAppPassword: ''
  });
  const [body, setBody] = useState(`
    <p>Hi,</p><br>
    <p>Welcome to the ${city?.replace(/\s*\(.*?\)\s*/g, '').trim()} Bookies community</p><br>
    <p>I'm glad that you're going to join us this time. We're super excited to read with you!</p><br>
    <p>Whether you're here to dive into the depths of literature, discover hidden gems, or simply enjoy the company of fellow book lovers, this community is going to be a space where we read, and we can belong!</p><br>
    <p>Please join the WhatsApp group below for location and other updates (don't forget to check the group description)</p><br>
    <p><a href="https://chat.whatsapp.com/I4ga8C0mZC6II49RhxgHGg">Click here to join the Whatsapp group</a></p><br>
    <p><strong>Please only join if you intend to actually come this Sunday :)</strong></p><br>
    <p>SEE YOU ON SUNDAY</p><br>
    <p>Love,<br><strong>${city?.replace(/\s*\(.*?\)\s*/g, '').trim()} Bookies</strong><br></p><br>
    <img src="https://c2w85ig2lt.ufs.sh/f/elHNGJqHN4xJTWcXzJYP3H8yawieBN79GIJUZRmd526qgOfY" style="max-width: 100%;"/>
  `);
  const navigate = useNavigate();

  // New state variables for handling API responses
  const [isSending, setIsSending] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [loadingEmails, setLoadingEmails] = useState(false);  // new loading state

  const quillRef = useRef(null);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn]);

  const fetchEmailData = async () => {
    setLoadingEmails(true);
    try {
      const data = await getEmails(city)
      if (data?.length > 0) {
        const keys = Object.keys(data[0]);
        setColumns(keys);
        setExcelData(data);
      }
    } catch (err) {
      console.error('Failed to fetch email data', err);
      setSnackbar({
        open: true,
        message: 'Failed to fetch email data from API',
        severity: 'error',
      });
    } finally {
      setLoadingEmails(false);
    }
  };

  useEffect(() => {
    fetchEmailData();
  }, []);

  const totalEmailsToSend = React.useMemo(() => {
    if (!selectedEmailColumn || excelData.length === 0) return 0;

    return excelData.filter((row) => row[selectedEmailColumn]?.toString().trim()).length;
  }, [selectedEmailColumn, excelData]);

  const handleEmailColumnChange = (event) => {
    setSelectedEmailColumn(event.target.value);
  };

  const insertFieldToken = (field) => {
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

  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };

  // Function to send emails through the API
  const handleSendEmails = async () => {
    // Validation
    if (!selectedEmailColumn) {
      setSnackbar({
        open: true,
        message: 'Please select an email column',
        severity: 'error'
      });
      return;
    }

    if (!senderEmailConfig.senderEmail || !senderEmailConfig.senderAppPassword) {
      setSnackbar({
        open: true,
        message: 'Please select a sender email',
        severity: 'error'
      });
      return;
    }

    if (excelData.length === 0) {
      setSnackbar({
        open: true,
        message: 'Please upload an Excel file with data',
        severity: 'error'
      });
      return;
    }

    try {
      setIsSending(true);

      // Prepare the request payload according to the API schema
      const payload = {
        senderEmail: senderEmailConfig.senderEmail,
        senderAppPassword: senderEmailConfig.senderAppPassword,
        subject,
        body: (emailTemplate(city?.replace(/\s*\(.*?\)\s*/g, '').trim()))?.replace(
          '{{body}}',
          embedQr ? (body + qrSection) : body
        ),
        embedQr,
        emailColumn: selectedEmailColumn,
        excelData
      };

      // Make the API call using axios with a 15-minute timeout
      const response = await axios.post(
        `${ENV.EMAIL_BASEURL}/api/send-mails`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 15 * 60 * 1000, // 15 minutes
        }
      );

      setSnackbar({
        open: true,
        message: response.data.message,
        severity: 'success',
      });

    } catch (error) {
      console.error('Error sending emails:', error);
      setSnackbar({
        open: true,
        message:
          error.response?.data?.message || error.message || 'An error occurred while sending emails',
        severity: 'error',
      });
    } finally {
      setIsSending(false);
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
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
                <FormControl size="small" sx={{ flex: 1 }}>
                  <InputLabel id="email-col-label">
                    {loadingEmails ? "Loading..." : "Select Email Column"}
                  </InputLabel>
                  <Select
                    labelId="email-col-label"
                    id="email-col"
                    value={selectedEmailColumn}
                    label="Select Email Column"
                    onChange={handleEmailColumnChange}
                    disabled={loadingEmails}
                    fullWidth
                  >
                    {columns.map((col) => (
                      <MenuItem key={col} value={col}>
                        {col}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Button
                  disabled={loadingEmails}
                  onClick={fetchEmailData}
                  variant="outlined"
                  sx={{ aspectRatio: '1 / 1', p: 0, minWidth: 0, height: 40 }}
                >
                  <Sync />
                </Button>
              </Box>

              {selectedEmailColumn && (
                <Box px="16px">
                  <Typography variant='subtitle2' color="#58551E">
                    Total: <strong>{totalEmailsToSend}</strong>
                  </Typography>
                </Box>
              )}
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
                <InputLabel id="sender-email-label">Select Sender Email</InputLabel>
                <Select
                  labelId="sender-email-label"
                  id="sender-email"
                  label="Select Sender Email"
                  value={senderEmailConfig.senderEmail}
                  onChange={(e) => {
                    const selectedKey = e.target.value;
                    const matched = config?.find(
                      (item) => item.Type === CONFIG_TYPES.Email && item.Key === selectedKey
                    );

                    if (matched) {
                      setSenderEmailConfig({
                        senderEmail: matched.Key,
                        senderAppPassword: matched.Value
                      });
                    }
                  }}
                >
                  {config?.map((e) => {
                    if (e.Type === CONFIG_TYPES.Email) {
                      return (
                        <MenuItem key={e.Key} value={e.Key}>
                          {e.Key}
                        </MenuItem>
                      );
                    }
                    return null;
                  })}
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

              {/* <Box>
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
              </Box> */}

            </Box>

            <Button
              variant="contained"
              sx={{ width: 'fit-content', px: 6, bgcolor: '#403d14', boxShadow: 'none' }}
              onClick={handleSendEmails}
              disabled={isSending}
            >
              {isSending ? (
                <>
                  <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                  Sending...
                </>
              ) : 'Send'}
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
                __html: (emailTemplate(city?.replace(/\s*\(.*?\)\s*/g, '').trim()))?.replace('{{body}}', embedQr ? (body + qrSection) : body)
              }}
            />
          </Box>
        </Box>
      </Box>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </PageLayout>
  );
};

export default Mail;