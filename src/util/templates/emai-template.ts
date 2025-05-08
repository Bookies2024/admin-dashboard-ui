export const emailTemplate = (currentCity: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    body { font-family: Arial, sans-serif; }
    .container { max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 6px; }
    .header { background-color: #FFE6D5; padding: 20px; text-align: center; border-top-left-radius: 6px; border-top-right-radius: 6px; }
    .header img { display: block; margin: 0 auto; }
    .header h2 { color: #58551E; margin: 10px 0 0; }
    .header p { color: #58551E; margin: 5px 0 0; }
    .content { padding: 30px; }
    .content h3 { color: #333; }
    .content p { font-size: 14px; color: #555;  line-height: 1.6; margin: 0; padding: 0;}
    .content img { max-width: 100%; }
    .qr-container { text-align: center; margin-bottom: 20px }
    .qr-container img { border-radius: 8px }
    .footer p { color: #333; }
    .footer a { color: #333; text-decoration: none; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="https://c2w85ig2lt.ufs.sh/f/elHNGJqHN4xJjDk65sGr25gqFBStewTny4XvmPMYZkRpN6WL" alt="Logo" width="60" height="60" />
      <h2>${currentCity} Bookies</h2>
      <p>Reading Community</p>
    </div>
    <div class="content">
      {{body}}
    </div>
  </div>
</body>
</html>
`;

export const qrSection = `
  <hr style="margin-top: 25px; margin-bottom: 20px;">
  <div>
    <p style="text-align: center; font-size: 14px;">
      Show us the following QR code when you join for your first session.
    </p>
    <div class="qr-container">
      <img src="cid:qr-code" alt="QR Code" width="180" height="180" />
    </div>
  </div>
`;