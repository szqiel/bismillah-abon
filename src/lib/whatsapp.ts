import { CartItem } from "./store";

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

  // Since items might have different dates/durations, we'll summarize them in the list above.
  // But for the template, if there's only 1 item, we can make it cleaner.
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
🟢 Price List > https://bit.ly/PLAbonKameraSMG
🟢 Maps > https://bit.ly/Mapsabonkamera

Operational Hour : 05.30-23.30 WIB 

*Rek. BCA
a.n. Aji P.
8035067082

*Rek. BNI
a.n. Aji P. 
1997099905`;

  return `https://wa.me/6282222207157?text=${encodeURIComponent(msg)}`;
}
