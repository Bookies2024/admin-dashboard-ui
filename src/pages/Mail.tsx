/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import {
  Box,
  Button,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Alert,
  Snackbar,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText
} from '@mui/material';
import { Sync } from '@mui/icons-material';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

import PageLayout from '../layout/PageLayout';
import { emailTemplate, qrSection } from '../util/templates/emai-template';
import { CONFIG_TYPES, ENV } from '../util/constants';
import { getEmails } from '../api/api';
import { RootState } from '../store/store';

// Types
interface EmailData {
  [key: string]: string | number;
}

interface SenderEmailConfig {
  senderEmail: string;
  senderAppPassword: string;
}

interface SnackbarState {
  open: boolean;
  message: string;
  severity: 'success' | 'error' | 'info' | 'warning';
}

// Constants
const QUILL_MODULES = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link', 'image'],
    [{ color: [] }, { background: [] }],
    [{ align: [] }],
    ['clean']
  ]
};

const TIMEOUT_DURATION = 15 * 60 * 1000; // 15 minutes

const Mail: React.FC = () => {
  // Redux state
  const { config, city } = useSelector((state: RootState) => state.auth);

  const quillRef = useRef<any>(null);

  // State
  const [emailData, setEmailData] = useState<EmailData[]>([]);
  const [dataColumns, setDataColumns] = useState<string[]>([]);
  const [selectedEmailColumn, setSelectedEmailColumn] = useState('');
  const [subject, setSubject] = useState('');
  const [embedQr] = useState(false);
  const [senderEmailConfig, setSenderEmailConfig] = useState<SenderEmailConfig>({
    senderEmail: '',
    senderAppPassword: ''
  });
  const [body, setBody] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: '',
    severity: 'success'
  });

  // Helper functions
  const getCityName = useCallback(() => {
    return city?.replace(/\s*\(.*?\)\s*/g, '').trim() || '';
  }, [city]);

  const getDefaultSubject = useCallback(() => {
    return `YOU MADE IT TO ${getCityName().toUpperCase()} BOOKIES`;
  }, [getCityName]);

  const getDefaultBody = useCallback(() => {
    const cityName = getCityName();
    const footerImage = config?.find(cfg => cfg?.Key === city)?.["Footer Image"] ||
      "https://c2w85ig2lt.ufs.sh/f/elHNGJqHN4xJTWcXzJYP3H8yawieBN79GIJUZRmd526qgOfY";

    return `
      <p>Dearest Readers,</p><br>
      <p>Welcome to the ${cityName} Bookies community</p><br>
      <p>Whether you're here to dive into the depths of literature, discover hidden gems, or simply enjoy the company of fellow book lovers, this community is going to be a space where we read, and we can belong!</p><br>
      <p>Please join the WhatsApp group below for location and other updates (don't forget to check the Group Description)</p><br>
      <p><a href="https://chat.whatsapp.com/I4ga8C0mZC6II49RhxgHGg">https://chat.whatsapp.com/I4ga8C0mZC6II49RhxgHGg</a></p><br>
      <p>SEE YOU ON SUNDAY</p><br>
      <p>Love,<br><strong>${cityName} Bookies</strong><br></p><br>
      <img src="${footerImage}" style="max-width: 100%;" />
    `;
  }, [getCityName, config, city]);

  const showSnackbar = useCallback((message: string, severity: SnackbarState['severity']) => {
    setSnackbar({ open: true, message, severity });
  }, []);

  const handleCloseSnackbar = useCallback(() => {
    setSnackbar(prev => ({ ...prev, open: false }));
  }, []);

  // Computed values
  const totalEmailsToSend = useMemo(() => {
    if (!selectedEmailColumn || emailData.length === 0) return 0;
    return emailData.filter((row) => row[selectedEmailColumn]?.toString().trim()).length;
  }, [selectedEmailColumn, emailData]);

  const emailConfigs = useMemo(() => {
    return config?.filter(item => item.Type === CONFIG_TYPES.Email) || [];
  }, [config]);

  // API calls
  const fetchEmailData = useCallback(async () => {
    setIsLoadingData(true);
    try {
      const data = await getEmails(city);
      if (data?.length > 0) {
        const columns = Object.keys(data[0]);
        setDataColumns(columns);
        setEmailData(data);
        showSnackbar('Email data loaded successfully', 'success');
      } else {
        showSnackbar('No email data found', 'warning');
      }
    } catch (error) {
      console.error('Failed to fetch email data:', error);
      showSnackbar('Failed to fetch email data from API', 'error');
    } finally {
      setIsLoadingData(false);
    }
  }, [city, showSnackbar]);

  // Validation
  const validateInputs = useCallback(() => {
    if (!selectedEmailColumn) {
      showSnackbar('Please select the email column', 'error');
      return false;
    }
    if (!senderEmailConfig.senderEmail || !senderEmailConfig.senderAppPassword) {
      showSnackbar('Please select the sender email', 'error');
      return false;
    }
    if (emailData.length === 0) {
      showSnackbar('No email data available. Please refresh the data.', 'error');
      return false;
    }
    if (!subject.trim()) {
      showSnackbar('Please enter the email subject', 'error');
      return false;
    }
    if (!body.trim()) {
      showSnackbar('Please enter email content', 'error');
      return false;
    }
    return true;
  }, [selectedEmailColumn, senderEmailConfig, emailData.length, subject, body, showSnackbar]);

  // Event handlers
  const handleEmailColumnChange = useCallback((event: any) => {
    setSelectedEmailColumn(event.target.value);
  }, []);

  const handleSenderEmailChange = useCallback((event: any) => {
    const selectedKey = event.target.value;
    const matchedConfig = emailConfigs.find(item => item.Key === selectedKey);

    if (matchedConfig) {
      setSenderEmailConfig({
        senderEmail: matchedConfig.Key,
        senderAppPassword: matchedConfig.Value
      });
    }
  }, [emailConfigs]);

  const insertFieldToken = useCallback((field: string) => {
    const editor = quillRef.current?.getEditor();
    if (editor) {
      const range = editor.getSelection();
      const insertIndex = range ? range.index : 0;
      editor.insertText(insertIndex, `{${field}}`);
    }
  }, []);

  const handleSendEmailsClick = useCallback(() => {
    if (validateInputs()) {
      setShowConfirmDialog(true);
    }
  }, [validateInputs]);

  const handleConfirmSend = useCallback(async () => {
    setShowConfirmDialog(false);
    setIsSending(true);

    try {
      const emailPayload = {
        senderEmail: senderEmailConfig.senderEmail,
        senderAppPassword: senderEmailConfig.senderAppPassword,
        from: `${getCityName()} Bookies`,
        subject,
        body: emailTemplate(getCityName())?.replace(
          '{{body}}',
          embedQr ? (body + qrSection) : body
        ),
        embedQr,
        emailColumn: selectedEmailColumn,
        excelData: emailData
      };

      const response = await axios.post(
        `${ENV.EMAIL_BASEURL}/api/send-mails`,
        emailPayload,
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: TIMEOUT_DURATION
        }
      );

      showSnackbar(response.data.message || 'Emails sent successfully!', 'success');
    } catch (error: any) {
      console.error('Error sending emails:', error);
      const errorMessage = error.response?.data?.message || error.message || 'An error occurred while sending emails';
      showSnackbar(errorMessage, 'error');
    } finally {
      setIsSending(false);
    }
  }, [
    senderEmailConfig,
    subject,
    getCityName,
    embedQr,
    body,
    selectedEmailColumn,
    emailData,
    showSnackbar
  ]);

  const handleCancelSend = useCallback(() => {
    setShowConfirmDialog(false);
  }, []);

  useEffect(() => {
    if (emailConfigs.length > 0) {
      const firstEmail = emailConfigs[0];
      setSenderEmailConfig({
        senderEmail: firstEmail.Key,
        senderAppPassword: firstEmail.Value
      });
    }
  }, [emailConfigs]);

  useEffect(() => {
    setSubject(getDefaultSubject());
    setBody(getDefaultBody());
  }, [getDefaultSubject, getDefaultBody]);

  useEffect(() => {
    fetchEmailData();
  }, [fetchEmailData]);

  // Render helpers
  const renderEmailColumnSelector = () => (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
        <FormControl size="small" sx={{ flex: 1 }}>
          <InputLabel id="email-col-label">
            {isLoadingData ? "Loading..." : "Select Email Column"}
          </InputLabel>
          <Select
            labelId="email-col-label"
            value={selectedEmailColumn}
            label="Select Email Column"
            onChange={handleEmailColumnChange}
            disabled={isLoadingData}
            fullWidth
          >
            {dataColumns.map((column) => (
              <MenuItem key={column} value={column}>
                {column}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          disabled={isLoadingData}
          onClick={fetchEmailData}
          variant="outlined"
          sx={{ aspectRatio: '1 / 1', p: 0, minWidth: 0, height: 40 }}
          title="Refresh email data"
        >
          <Sync />
        </Button>
      </Box>

      {selectedEmailColumn && (
        <Box px="16px">
          <Typography variant='subtitle2' color="#58551E">
            Total Recipients: <strong>{totalEmailsToSend}</strong>
          </Typography>
        </Box>
      )}
    </Box>
  );

  const renderEmailConfiguration = () => (
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
          label="Select Sender Email"
          value={senderEmailConfig.senderEmail}
          onChange={handleSenderEmailChange}
        >
          {emailConfigs.map((configItem) => (
            <MenuItem key={configItem.Key} value={configItem.Key}>
              {configItem.Key}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        fullWidth
        label="Subject"
        variant="outlined"
        size="small"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        placeholder="Enter email subject"
      />

      {renderEmailEditor()}
    </Box>
  );

  const renderEmailEditor = () => (
    <Box>
      <Box
        sx={{
          '& .ql-editor': {
            minHeight: 420,
            maxHeight: 420,
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
          modules={QUILL_MODULES}
          placeholder="Enter your email content here..."
        />
      </Box>

      {dataColumns.length > 0 && (
        <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Typography variant="caption" sx={{ width: '100%' }}>
            Click to insert field tokens:
          </Typography>
          {dataColumns.map((column) => (
            <Chip
              key={column}
              label={`{${column}}`}
              onClick={() => insertFieldToken(column)}
              size="small"
              color="primary"
              variant="outlined"
              sx={{ cursor: 'pointer' }}
            />
          ))}
        </Box>
      )}
    </Box>
  );

  const renderEmailPreview = () => (
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
        <Typography fontSize={18} gutterBottom fontWeight='bold' color='#403d14'>
          Preview
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Subject:</strong> {subject || 'No subject'}
        </Typography>
      </Box>

      <Box
        sx={{
          border: '1px solid #e0e0e0',
          borderRadius: 1,
          p: 2,
        }}
      >
        <div
          dangerouslySetInnerHTML={{
            __html: emailTemplate(getCityName())?.replace(
              '{{body}}',
              embedQr ? (body + qrSection) : body
            )
          }}
        />
      </Box>
    </Box>
  );

  const renderConfirmationDialog = () => (
    <Dialog open={showConfirmDialog} onClose={handleCancelSend}>
      <DialogTitle sx={{ p: 4 }}>
        Confirm Email Send
      </DialogTitle>
      <DialogContent sx={{ px: 6 }}>
        <DialogContentText>
          Are you sure you want to send emails to <strong>{totalEmailsToSend}</strong> recipients?<br />
          This action cannot be undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ pb: 4, pr: 4, gap: 1 }}>
        <Button onClick={handleCancelSend} color="inherit">
          Cancel
        </Button>
        <Button
          onClick={handleConfirmSend}
          variant="contained"
          sx={{ bgcolor: '#403d14', boxShadow: 'none' }}
          autoFocus
        >
          Send Emails
        </Button>
      </DialogActions>
    </Dialog>
  );

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
          {/* Left Panel - Email Configuration */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {renderEmailColumnSelector()}
            {renderEmailConfiguration()}

            {/* Send Button */}
            <Button
              variant="contained"
              sx={{
                width: 'fit-content',
                px: 6,
                bgcolor: '#403d14',
                boxShadow: 'none',
                '&:hover': {
                  bgcolor: '#555229'
                }
              }}
              onClick={handleSendEmailsClick}
              disabled={isSending || isLoadingData}
            >
              {isSending ? (
                <>
                  <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                  Sending Emails...
                </>
              ) : 'Send'}
            </Button>
          </Box>

          {/* Right Panel - Email Preview */}
          {renderEmailPreview()}
        </Box>
      </Box>

      {renderConfirmationDialog()}

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </PageLayout>
  );
};

export default Mail;