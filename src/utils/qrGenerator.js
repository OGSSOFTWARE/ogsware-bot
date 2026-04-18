const QRCode = require('qrcode');
const { AttachmentBuilder } = require('discord.js');

/**
 * Generate a QR code PNG buffer from a string (e.g. crypto address).
 * Returns a discord.js AttachmentBuilder ready to send.
 */
async function generateQRAttachment(data, filename = 'qrcode.png') {
  const buffer = await QRCode.toBuffer(data, {
    errorCorrectionLevel: 'H',
    width: 150,
    margin: 2,
    color: { dark: '#000000', light: '#ffffff' },
  });
  return new AttachmentBuilder(buffer, { name: filename });
}

module.exports = { generateQRAttachment };
