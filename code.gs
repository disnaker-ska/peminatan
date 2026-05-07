function doPost(e) {
  // Buka Sheet yang aktif
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  try {
    // Parsing data JSON yang dikirim dari Frontend React
    var data = JSON.parse(e.postData.contents);
    
    // Menyiapkan array baris baru sesuai urutan Header
    var rowData = [
      data.id || new Date().getTime(),
      data.nama || "",
      data.nik || "",
      data.provinsi || "Jawa Tengah",
      data.kabupaten || "Surakarta",
      data.kecamatan || "",
      data.kelurahan || "",
      data.noWa || "",
      data.tglLahir || "",
      data.usia || "",
      data.jk || "",
      data.pendidikan || "",
      data.asalSekolah || "",
      data.jurusan || "",
      data.keahlian || "",
      data.pengalaman || "",
      data.pelatihan || "",
      data.tujuanPelatihan || "",
      data.alasanPelatihan || "",
      data.statusKerja || "",
      data.lokasiKerja || "",
      data.gaji || "",
      data.industri || "",
      data.saran || ""
    ];
    
    // Menambahkan baris ke dalam Spreadsheet
    sheet.appendRow(rowData);
    
    // Mengembalikan response sukses
    return ContentService.createTextOutput(JSON.stringify({"status": "success"}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({"status": "error", "message": error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = sheet.getDataRange().getValues();
  
  // Jika sheet kosong, kembalikan array kosong
  if (data.length <= 1) {
    return ContentService.createTextOutput(JSON.stringify([]))
      .setMimeType(ContentService.MimeType.JSON);
  }

  var headers = data[0];
  var result = [];

  // Looping dari baris kedua (index 1) karena baris pertama adalah header
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var obj = {};
    for (var j = 0; j < headers.length; j++) {
      if (headers[j]) { // Pastikan kolom ada namanya
        obj[headers[j]] = row[j];
      }
    }
    result.push(obj);
  }

  // Kembalikan data dalam format JSON ke aplikasi React
  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}