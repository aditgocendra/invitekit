interface WhatsAppGuestInvitationProps {
  guestName: string;
  groomBrideName: string;
  link: string;
}

export const generateWhatsAppGuestInvitationMessage = ({
  guestName,
  groomBrideName,
  link,
}: WhatsAppGuestInvitationProps): string => {
  return `
*Assalamu’alaikum Wr. Wb. / Salam Sejahtera*

Tanpa mengurangi rasa hormat, melalui pesan ini kami ingin mengundang Bapak/Ibu/Saudara/i ${guestName} untuk hadir di acara pernikahan kami., 👋
Detail acara, lokasi, dan galeri foto bisa diakses melalui link undangan digital berikut:

🔗 *Undangan*  
${link}

Merupakan suatu kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.

Jika Anda butuh bantuan, jangan ragu untuk menghubungi kami.

Terima kasih,  
${groomBrideName}`.trim();
};
