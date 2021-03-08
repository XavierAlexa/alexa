/*
CREATE BY XavierAlexa
*/

const qrcode = require("qrcode-terminal");
const moment = require("moment");
const cheerio = require("cheerio");
const imageToBase64 = require('image-to-base64');
const get = require('got')
const fs = require("fs");
const fetch = require('node-fetch');
const urlencode = require("urlencode");
const axios = require("axios");
const speed = require('performance-now');
const menu = require('./lib/menu.js');
const readTextInImage = require('./lib/ocr.js');
const dl = require("./lib/downloadImage.js");
// sesiMasukBot
const
{
   WAConnection,
   MessageType,
   Presence,
   MessageOptions,
   Mimetype,
   WALocationMessage,
   WA_MESSAGE_STUB_TYPES,
   ReconnectMode,
   ProxyAgent,
   waChatKey,
} = require("@adiwajshing/baileys");
var jam = moment().format("HH:mm");

function foreach(arr, func)
{
   for (var i in arr)
   {
      func(i, arr[i]);
   }
}
const conn = new WAConnection()
conn.on('qr', qr =>
{
   qrcode.generate(qr,
   {
      small: true
   });
   console.log(`[ ${moment().format("HH:mm:ss")} ] Segera Scan Bot Sebelum 20 detik`);
});

conn.on('credentials-updated', () =>
{
 // simpan kredensial setiap kali diperbarui
   console.log(`credentials updated$`)
   const authInfo = conn.base64EncodedAuthInfo() // dapatkan semua info autentikasi yang kami perlukan untuk memulihkan sesi ini 
   fs.writeFileSync('./session.json', JSON.stringify(authInfo, null, '\t')) // simpan info ini ke file 
})
fs.existsSync('./session.json') && conn.loadAuthInfo('./session.json')
// batalkan komentar pada baris berikut untuk mem-proxy koneksi; beberapa proxy acak yang saya lepas  : https://proxyscrape.com/free-proxy-list
//conn.connectOptions.agent = ProxyAgent ('http://1.0.180.120:8080')
conn.connect();

conn.on('user-presence-update', json => console.log(`[ ${moment().format("HH:mm:ss")} ] => Alice Bot`))
conn.on('message-status-update', json =>
{
   const participant = json.participant ? ' (' + json.participant + ')' : '' // peserta ada ketika pesan berasal dari grup
   console.log(`[ ${moment().format("HH:mm:ss")} ] => Alice Bot`)
})

conn.on('message-new', async(m) =>
{
   const messageContent = m.message
   const text = m.message.conversation
   let id = m.key.remoteJid
   const messageType = Object.keys(messageContent)[0] // pesan akan selalu berisi satu kunci yang menandakan jenis pesan apa
   let imageMessage = m.message.imageMessage;
   console.log(`[ ${moment().format("HH:mm:ss")} ] => Nomor: [ ${id.split("@s.whatsapp.net")[0]} ] => ${text}`);
   // Groups

if (text.includes(".buatgrup"))
   {
var nama = text.split(".buatgrup")[1].split("-nomor")[0];
var nom = text.split("-nomor")[1];
var numArray = nom.split(",");
for ( var i = 0; i < numArray.length; i++ ) {
    numArray[i] = numArray[i] +"@s.whatsapp.net";
}
var str = numArray.join("");
console.log(str)
const group = await conn.groupCreate (nama, str)
console.log ("created group with id: " + group.gid)
conn.sendMessage(group.gid, "halo semua", MessageType.extendedText) // katakan hello untuk semua orang yang online di grup

}
// Pemanggil Bot
if(text.includes(".cek")){
var num = text.replace(/.cek/ , "")
var idn = num.replace("0","+62");

console.log(id);
const gg = idn+'@s.whatsapp.net'

const exists = await conn.isOnWhatsApp (gg)
console.log(exists);
conn.sendMessage(id ,`${gg} ${exists ? " tersedia " : " tidak tersedia"} on WhatsApp`, MessageType.text)
}

//chat Bot

else if (text == 'Assalamualaikum'){
conn.sendMessage(id, 'waalaikumsalam' ,MessageType.text);
}
else if (text == 'Halo'){
conn.sendMessage(id, 'Halo Juga' ,MessageType.text);
}
else if (text == 'Nama kamu siapa'){
conn.sendMessage(id, 'nama aku alice' ,MessageType.text);
}
else if (text =='Owner Kamu siapa'){
conn.sendMessage(id, 'XavierAlexa, Dia owner sekaligus author aku' ,MessageType.text);
}
else if (text == 'P'){
conn.sendMessage(id, 'Ya?, Ketik .menu untuk melihat fitur Alice' ,MessageType.text);
}
else if (text == 'Ppk'){
conn.sendMessage(id, 'bah ngentot' ,MessageType.text);
}
else if (text == 'Asu'){
conn.sendMessage(id, 'Lu Asw' ,MessageType.text);
}

//Fitur Bot

  //Info convid
if (text.includes(".corona"))
   {
const get = require('got')
    const body = await get.post('https://api.kawalcorona.com/indonesia', {
    }).json();
    var positif = (body[0]['positif']);
    var sembuh  = (body[0]['sembuh']);
    var meninggal = (body[0]['meninggal']);
    var dirawat = (body[0]['dirawat']);
    console.log(body[0]['name'])
    conn.sendMessage(id,`📌DATA WABAH COVID-19 TERBARU DI INDONESIA\n\n*Positif* = ${positif} \n*Sembuh* = ${sembuh} \n*Meninggal* = ${meninggal}\n*Dirawat* = ${dirawat}\n\n*Stay safe dan selalu gunakan masker saat berpergian*`, MessageType.text, { quoted: m } );
}

  //How gay
if (text.includes(".seberapagay")){
const teks = text.replace(/.seberapagay /, "")
axios.get(`https://arugaz.herokuapp.com/api/howgay`).then((res) => {
    let hasil = `*Gay Detected*\n*Persentase* : ${res.data.persen}%\n${res.data.desc}`;
    conn.sendMessage(id, hasil ,MessageType.text, { quoted: m } );
})
}
if (text.includes(".spamcall")){
const teks = text.replace(/.spamcall /, "")
axios.get(`https://arugaz.herokuapp.com/api/spamcall?no=${teks}`).then((res) => {
	conn.sendMessage(id, '[WAIT] Proses...❗', MessageType.text)
    let hasil = ` *INFO SPAM CALL* \n\n _${res.data.logs}_`;
    conn.sendMessage(id, hasil ,MessageType.text);
})
}
if (text.includes(".spamsms")){
const teks = text.replace(/.spamsms /, "")
axios.get(`https://arugaz.herokuapp.com/api/spamsms?no=${teks}&jum=20`).then((res) => {
	conn.sendMessage(id, '[WAIT] Proses...❗', MessageType.text)
    let hasil = ` *INFO SPAM SMS 20 PESAN* \n\n _${res.data.logs}_`;
    conn.sendMessage(id, hasil ,MessageType.text);
})
}
if (text.includes(".quotes")){
const teks = text.replace(/.quotes /, "")
axios.get(`https://arugaz.herokuapp.com/api/randomquotes`).then((res) => {
conn.sendMessage(id, '[WAIT] Searching...❗', MessageType.text)
    let hasil = ` *Nih Quotes Kak :)*\n\n *Author* : _${res.data.author}_ \n\n *Quotes* : _${res.data.quotes}_ `;
    conn.sendMessage(id, hasil ,MessageType.text);
})
}
if (text.includes(".fakta")){
const teks = text.replace(/.fakta /, "")
axios.get(`https://raw.githubusercontent.com/ArugaZ/grabbed-results/main/random/faktaunix.txt${teks}`).then((res) => {
    let hasil = `fakta tersedia\n👇👇👇👇👇👇👇👇👇\n\nJudul: ${res.data.title}\n\fakta Tersedia: ${res.data.filesize}\n\nLink: ${res.data.result}`;
    conn.sendMessage(id, hasil ,MessageType.text);
})
}
if (text.includes(".wiki")){
const teks = text.replace(/.wiki /, "")
axios.get(`https://arugaz.herokuapp.com/api/wiki?q=${teks}`).then((res) => {
	conn.sendMessage(id, '[WAIT] Searching...❗', MessageType.text)
    let hasil = `ðŸ“Menurut Wikipedia:\n\n${res.data.result}`;
    conn.sendMessage(id, hasil ,MessageType.text);
})
}
 //Brainly
if (text.includes('.brainly')){
const teks = text.replace(/.brainly /, "")
axios.get(`https://api.vhtear.com/branly?query=${teks}&apikey=${apivhtear}`).then((res) => {
 let hasil = `${res.data.result.data}`;
    conn.sendMessage(id, hasil ,MessageType.text, { quoted: m } );
})
}
//kbbi
if (text.includes(".kbbi")){
const teks = text.replace(/.kbbi /, "")
axios.get(`https://mhankbarbars.herokuapp.com/api/kbbi?query=${teks}&apiKey=${apibarbar}`).then((res) => {
    let hasil = `*Hasil* :\n${res.data.result}`;
    conn.sendMessage(id, hasil ,MessageType.text, { quoted: m } );
})
}
//infotanggal
if (text.includes(".tanggal")){
const teks = text.replace(/.tanggal /, "")
axios.get(`https://api.haipbis.xyz/harinasional?tanggal=${teks}`).then((res) => {
    let hasil = `*Tanggal* : ${res.data.tanggal}\n*Keterangan* : ${res.data.keterangan}`;
    conn.sendMessage(id, hasil ,MessageType.text, { quoted: m } );
})
}
//roastink
if (text.includes(". roastink")){
const teks = text.replace(/.roastink /, "")
axios.get(`https://arugaz.herokuapp.com/api/cersex2`).then((res) => {
conn.sendMessage(id, '[WAIT] cok...❗', MessageType.text)
    let hasil = ` *Nih cersex Kak :)*\n\n _${res.data.result}_ `;
    conn.sendMessage(id, hasil ,MessageType.text);
})
}
//Lirik lagu
if (text.includes(".lirik")){
	const teks = text.split(".lirik")[1]
	axios.get(`http://scrap.terhambar.com/lirik?word=${teks}`).then ((res) => {
	     conn.sendMessage(id, '[ WAIT ] Searching lirik⏳ silakan tunggu', MessageType.text, { quoted: m } )
	 	let hasil = `lirik ${teks} \n\n\n ${res.data.result.lirik}`
	conn.sendMessage(id, hasil, MessageType.text, { quoted: m } )
	})
}
//cuaca
if (text.includes(".cuaca")){
   	const cuaca = text.replace(/.cuaca /, "")
   axios.get(`https://mhankbarbars.herokuapp.com/api/cuaca?q=${cuaca}&apiKey=${apibarbar}`).then ((res) =>{
         conn.sendMessage(id, '[ WAIT ] Menampilkan cuaca⏳ silahkan tunggu', MessageType.text, { quoted: m } )
        let hasil = `*Tempat* : ${cuaca}\n*Angin* : ${res.data.result.angin}\n*Cuaca* : ${res.data.result.cuaca}\n*Deskripsi* : ${res.data.result.desk}\n*Kelembaban* : ${res.data.result.kelembapan}\n*Suhu* : ${res.data.result.suhu}\n*Udara* : ${res.data.result.udara}`
        conn.sendMessage(id, hasil, MessageType.text, { quoted: m } )
    })
}
//infotv
if (text.includes(".infotv")){
const teks = text.replace(/.infotv /, "")
axios.get(`https://mhankbarbars.herokuapp.com/api/jdtv?ch=${teks}&apiKey=${apibarbar}`).then((res) => {
    conn.sendMessage(id, '[ WAIT ] Menampilkan jadwal tv⏳ silahkan tunggu', MessageType.text, { quoted: m } )
    let hasil = `${res.data.result}`;
    conn.sendMessage(id, hasil ,MessageType.text, { quoted: m } );
})
}
//ping
if (text.includes(".ping")){
const teks = text.replace(/.ping /, "")
axios.get(`https://api.banghasan.com/domain/nping/${teks}`).then((res) => {
    let hasil = `*query : ${res.data.query}*\n\nhasil : ${res.data.hasil}`;
    conn.sendMessage(id, hasil ,MessageType.text);
  })
 }
