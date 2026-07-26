import { CartItem } from "./store";
import { siteConfig } from "@/config/site";

export interface CustomerData {
  nama: string;
  instagram: string;
  telepon: string;
  alamat: string;
  jamAmbil: string;
}

export function generateWhatsAppMessage(customerData: CustomerData, items: CartItem[]) {
  // Format items
  let alatList = "";
  items.forEach((item) => {
    alatList += `- ${item.gear.name} (${item.quantity} unit) | ${item.startDate} s/d ${item.endDate} (${item.days} Hari)\n`;
  });

  const isSingleItem = items.length === 1;
  const summaryTglAmbil = isSingleItem ? `${items[0].startDate} s/d ${items[0].endDate}` : "Sesuai rincian alat di atas";
  const summaryDurasi = isSingleItem ? `${items[0].days} Hari` : "Sesuai rincian alat di atas";

  const msg = `Hi Kak, mau booking ✨
Nama : ${customerData.nama}
Instagram : ${customerData.instagram}
No.Tlp / No. WA : ${customerData.telepon}
Alamat : ${customerData.alamat}
Alat : 
${alatList}
Tgl ambil : ${summaryTglAmbil}
Jam ambil : ${customerData.jamAmbil}
Durasi Sewa : ${summaryDurasi}

🔴 *Kirim Foto (KTP/SIM) asli*
🔴 DP booking *50%* Wajib kirim bukti transfer ✨
🔴 *Pembayaran kami Cashless*
🔴 Jaminan : KTP + STNK Pajak
🟢 Price List > ${siteConfig.links.priceListUrl}
🟢 Maps > ${siteConfig.links.googleMaps}

Operational Hour : ${siteConfig.hours}

*Rek. BCA
a.n. ${siteConfig.paymentInfo.bcaHolder}
${siteConfig.paymentInfo.bcaAccount}

*Rek. BNI
a.n. ${siteConfig.paymentInfo.bniHolder}
${siteConfig.paymentInfo.bniAccount}`;

  return `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(msg)}`;
}
