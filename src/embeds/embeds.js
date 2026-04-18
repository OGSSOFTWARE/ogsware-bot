const { EmbedBuilder } = require('discord.js');
const config = require('../../config/config');

const D = config.embedDefaults;

const base = () => {
  const embed = new EmbedBuilder()
    .setColor(D.color)
    .setFooter({ text: D.footerText, iconURL: D.footerIcon })
    .setTimestamp();
  if (D.bannerImage) embed.setImage(D.bannerImage);
  return embed;
};

const embeds = {
paypal: () =>
  base()
    .setTitle('Interested In Purchasing? - Pay With PayPal')
    .setDescription(
      'Thank you for your interest in our services, to start your **PayPal payment** please follow these instructions:\n\n' +
      '<:YellowDot:1381703990781415424> Send as Family & Friends\n' +
      '<:YellowDot:1381703990781415424> Send from PayPal balance\n' +
      '<:YellowDot:1381703990781415424> Do not provide a note\n\n' +
      '**PayPal Link:** https://www.paypal.com/paypalme/ogstools'
    )
    .setColor(0xFAD800),


  bitcoin: (address, qrAttachment) => {
    const e = base()
      .setTitle('Interested In Purchasing? - Pay With Bitcoin')
      .setDescription(
        'Thank you for your interest in our services, to start your **Bitcoin payment** please follow these instructions:\n\n' +
        '<:YellowDot:1381703990781415424> Send exact amount\n' +
        '<:YellowDot:1381703990781415424> Network must be correct\n' +
        '<:YellowDot:1381703990781415424> No memos or notes required\n\n' +
        '**Bitcoin Adress:** \n\`\`\`bc1qjge8gk4t3g4q83jg0dnx8qn795mu3l8twv8y6n\`\`\`\n'
      )
      .setColor(0xFAD800);
    if (qrAttachment) e.setImage(`attachment://${qrAttachment}`);
    return e;
  },

  litecoin: (address, qrAttachment) => {
    const e = base()
      .setTitle('Interested In Purchasing? - Pay With Litecoin')
      .setDescription(
        'Thank you for your interest in our services, to start your **Litecoin payment** please follow these instructions:\n\n' +
        '<:YellowDot:1381703990781415424> Send exact amount\n' +
        '<:YellowDot:1381703990781415424> Network must be correct\n' +
        '<:YellowDot:1381703990781415424> No memos or notes required\n\n' +
        '**Litecoin Adress:** \n\`\`\`LWmUEY659C6P6531TvMmgFkNihprER49Vi\`\`\`\n'
      )
      .setColor(0xFAD800);
    if (qrAttachment) e.setImage(`attachment://${qrAttachment}`);
    return e;
  },

  ethereum: (address, qrAttachment) => {
    const e = base()
      .setTitle('Interested In Purchasing? - Pay With Ethereum')
      .setDescription(
        'Thank you for your interest in our services, to start your **Ethereum payment** please follow these instructions:\n\n' +
        '<:YellowDot:1381703990781415424> Send exact amount\n' +
        '<:YellowDot:1381703990781415424> Network must be correct\n' +
        '<:YellowDot:1381703990781415424> No memos or notes required\n\n' +
        '**Ethereum Adress:** \n\`\`\`0xEf89499329eb78954B1d0D25121cA4dB46112587\`\`\`\n'
      )
      .setColor(0xFAD800);
    if (qrAttachment) e.setImage(`attachment://${qrAttachment}`);
    return e;
  },

  solana: (address, qrAttachment) => {
    const e = base()
      .setTitle('Interested In Purchasing? - Pay With Solana')
      .setDescription(
        'Thank you for your interest in our services, to start your **Solana payment** please follow these instructions:\n\n' +
        '<:YellowDot:1381703990781415424> Send exact amount\n' +
        '<:YellowDot:1381703990781415424> Network must be correct\n' +
        '<:YellowDot:1381703990781415424> No memos or notes required\n\n' +
        '**Solana Adress:** \n\`\`\`Bd7Z6DkjHNVaFvKtVg97CoLq6CrdMpD6jg2qBjVHKnEL\`\`\`\n'
      )
      .setColor(0xFAD800);
    if (qrAttachment) e.setImage(`attachment://${qrAttachment}`);
    return e;
  },

  card: () => 
    base()
      .setTitle('Interested In Purchasing? - Pay With Debit & Credit Cards')
      .setDescription(
        'Thank you for your interest in our services, to start your **Debit & Credit Card payment** please follow these instructions:\n\n' +
        '<:YellowDot:1381703990781415424> Send exact amount\n' +
        '<:YellowDot:1381703990781415424> Do not provide a note\n\n' +
        '**Stripe Link:** https://buy.stripe.com/9B69AT5JpgqG70n8QugQE00'
      )
      .setColor(0xFAD800),

  reselling: () =>
    base()
      .setTitle('🔄 Reselling Information')
      .setDescription(
        '> Interested in reselling OGSware products?\n\n' +
        '**Requirements:**\n' +
        '• Minimum purchase history\n' +
        '• Active Discord presence\n' +
        '• Agreement to reseller ToS\n\n' +
        '**Benefits:**\n' +
        '• Discounted bulk pricing\n' +
        '• Dedicated support\n' +
        '• Early access to new products\n\n' +
        'Open a ticket to apply.'
      )
      .setColor(0xE67E22),

  promoter: () =>
    base()
      .setTitle('📢 Promoter Program')
      .setDescription(
        '> Want to promote OGSware and earn rewards?\n\n' +
        '**Perks:**\n' +
        '• Commission on every sale\n' +
        '• Custom discount code\n' +
        '• Free product access\n\n' +
        '**Requirements:**\n' +
        '• 500+ followers on any platform\n' +
        '• Active posting schedule\n\n' +
        'Apply by opening a ticket!'
      )
      .setColor(0xE91E63),

  staff: () =>
    base()
      .setTitle('🛡️ Staff Application')
      .setDescription(
        '> We\'re looking for dedicated staff members!\n\n' +
        '**Open Positions:**\n' +
        '• Support Agent\n' +
        '• Moderator\n' +
        '• Content Creator\n\n' +
        '**Requirements:**\n' +
        '• 14+ years old\n' +
        '• Active in the server\n' +
        '• No active punishments\n\n' +
        'Open a ticket with the subject **"Staff Application"**.'
      )
      .setColor(0x3498DB),

  vouch: () =>
    base()
      .setTitle('⭐ Leave a Vouch')
      .setDescription(
        '> Had a great experience? Leave us a vouch!\n\n' +
        'Use the slash command `/createvouch` to submit your review.\n\n' +
        'Vouches help the community and are greatly appreciated! 🙏'
      )
      .setColor(0xF1C40F),

  downloads: () =>
    base()
      .setTitle('📥 Downloads')
      .setDescription(
        '> Access your purchased products below.\n\n' +
        '**How to download:**\n' +
        '1. Visit [ogsware.com](https://ogsware.com)\n' +
        '2. Log in to your account\n' +
        '3. Navigate to **My Products**\n' +
        '4. Download your file\n\n' +
        'Having trouble? Open a support ticket.'
      )
      .setColor(0x1ABC9C),

  website: () =>
    base()
      .setTitle('🌐 OGSware Website')
      .setDescription(
        '> Visit our official website for all products and information.\n\n' +
        '🔗 **[ogsware.com](https://ogsware.com)**\n\n' +
        '• Browse our products\n' +
        '• Manage your account\n' +
        '• View purchase history\n' +
        '• Access support'
      )
      .setColor(0x5865F2),

  guides: () =>
    base()
      .setTitle('📚 Guides & Tutorials')
      .setDescription(
        '> Find all our guides and tutorials below.\n\n' +
        '**Documentation:** [docs.ogsware.com](https://docs.ogsware.com)\n\n' +
        '**Video Guides:** [YouTube](https://youtube.com/@ogsware)\n\n' +
        'Can\'t find what you need? Open a support ticket!'
      )
      .setColor(0x9B59B6),

  status: () =>
    base()
      .setTitle('📡 Service Status')
      .setDescription(
        '> Check the current status of all OGSware services.\n\n' +
        '🟢 **Website** — Online\n' +
        '🟢 **API** — Online\n' +
        '🟢 **Discord Bot** — Online\n' +
        '🟢 **Support** — Online\n\n' +
        '**Status Page:** [status.ogsware.com](https://status.ogsware.com)'
      )
      .setColor(0x2ECC71),

  joinLog: (member) =>
    base()
      .setTitle('📥 Member Joined')
      .setColor(0xFAD800)
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 256 }))
      .addFields(
        { name: '👤 Username', value: `<@${member.id}> (${member.user.tag})`, inline: true },
        { name: '🆔 User ID', value: member.id, inline: true },
        { name: '📅 Account Created', value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>`, inline: true },
        { name: '📥 Joined Server', value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>`, inline: true },
        { name: '🏷️ Roles Restored', value: 'Checking...', inline: true }
      )
      .setFooter({ text: `Member #${member.guild.memberCount} • ${D.footerText}`, iconURL: D.footerIcon }),

  modLog: ({ action, target, moderator, reason, extra = '' }) =>
    base()
      .setTitle(`🔨 Moderation Action — ${action}`)
      .setColor(0xE74C3C)
      .addFields(
        { name: '👤 Target', value: `<@${target.id}> (${target.tag})`, inline: true },
        { name: '🛡️ Moderator', value: `<@${moderator.id}>`, inline: true },
        { name: '📝 Reason', value: reason || 'No reason provided', inline: false },
        ...(extra ? [{ name: 'ℹ️ Info', value: extra, inline: false }] : [])
      ),

  giveaway: ({ prize, description, winners, endsAt, host }) =>
    base()
      .setTitle('🎉 GIVEAWAY')
      .setColor(0xFAD800)
      .setDescription(
        `**${prize}**\n\n${description || ''}\n\n` +
        `React with 🎉 to enter!`
      )
      .addFields(
        { name: 'Winners', value: `${winners}`, inline: true },
        { name: 'Ends', value: `<t:${Math.floor(endsAt / 1000)}:R>`, inline: true },
        { name: 'Hosted by', value: `<@${host}>`, inline: true }
      ),

  giveawayEnded: ({ prize, winnerIds }) =>
    base()
      .setTitle('🎉 Giveaway Ended')
      .setColor(0xFAD800)
      .setDescription(`**${prize}**\n\n🏆 **Winner(s):** ${winnerIds.map(id => `<@${id}>`).join(', ') || 'No winners'}`),

  // ─── Vouch Embed (manual + SellAuth) ──────────────────────────────────────
  vouchEmbed: ({ userId, product, rating, review, source, thumbnailUrl, imageUrl }) => {
    const isAuto = source === 'sellauth';
    const customer = isAuto
      ? 'SellAuth Client'
      : (userId && userId !== 'unknown' ? `<@${userId}>` : 'SellAuth Client');
    const reviewText = (!review || review === 'No review text provided.')
      ? '7-Day Automatic Review'
      : review;
    const thumb = isAuto
      ? (config.sellAuth.logoUrl || 'https://media.discordapp.net/attachments/1490754874940325948/1490762334665314314/GIF.gif?ex=69e4655d&is=69e313dd&hm=eeb5bac2b9499bbed89bd8f947c6fd609c22bc4274469337ca96cbd98ba16e7d&=&width=900&height=900')
      : (thumbnailUrl || null);
    const embed = base()
      .setTitle('New Vouch Received 🎉')
      .setColor(0xFAD800)
      .addFields(
        { name: 'Customer', value: customer, inline: true },
        { name: 'Product', value: product || 'OGSware Product', inline: true },
        { name: 'Rating', value: '⭐'.repeat(Math.min(5, Math.max(1, parseInt(rating) || 5))), inline: true },
        { name: 'Review', value: reviewText, inline: false }
      );
    if (thumb) embed.setThumbnail(thumb);
    if (imageUrl) embed.setImage(imageUrl);
    return embed;
  },

  vouchDM: ({ product, rating, review, thumbnailUrl, imageUrl }) => {
    const embed = base()
      .setTitle('Vouch Submitted 🎉')
      .setColor(0xFAD800)
      .setDescription('Thank you for leaving a vouch! Here is a 10% coupon code: TFDB37JUG')
      .addFields(
        { name: 'Product', value: product || 'OGSware Product', inline: true },
        { name: 'Rating', value: '⭐'.repeat(Math.min(5, Math.max(1, parseInt(rating) || 5))), inline: true },
        { name: 'Review', value: review || 'No review text provided.', inline: false }
      );
    if (thumbnailUrl) embed.setThumbnail(thumbnailUrl);
    if (imageUrl) embed.setImage(imageUrl);
    return embed;
  },

  newUpload: ({ platform, title, url, thumbnailUrl, channelName }) =>
    base()
      .setTitle(`OGSWare Official Media - New Video Uploaded!`)
      .setColor(0xFAD800)
      .setDescription(`**[${title}](${url})**\n\nA new video has just been posted on **${channelName}**!`),

  sticky: (message) =>
    base()
      .setTitle('📌 Pinned Message')
      .setDescription(message)
      .setColor(0xFEE75C),
};

module.exports = embeds;
