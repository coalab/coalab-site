/**
 * COALAB Contact Intake - Google Apps Script
 * 1) Google Sheet 생성 및 ID 입력
 * 2) 담당자 메일 입력
 * 3) initSheet() 수동 실행하여 헤더 작성/권한 승인
 * 4) 웹앱: 나로 실행, 액세스: 모든 사용자로 배포 후 /exec URL 사용
 */
const CONFIG = {
  spreadsheetId: 'PASTE_YOUR_GOOGLE_SHEET_ID',
  sheetName: '교육문의',
  notificationEmail: 'PASTE_YOUR_ADMIN_EMAIL',
  retentionMonths: 12,
};
const HEADERS = ['접수일시','접수번호','문의유형','교육분야','기관명','담당자','연락처','이메일','희망시기','교육대상·인원','문의내용','개인정보동의','처리상태','접수경로'];

function initSheet(){
  const book = SpreadsheetApp.openById(CONFIG.spreadsheetId);
  const sheet = book.getSheetByName(CONFIG.sheetName) || book.insertSheet(CONFIG.sheetName);
  if(sheet.getLastRow()===0){sheet.appendRow(HEADERS);sheet.setFrozenRows(1);sheet.getRange(1,1,1,HEADERS.length).setFontWeight('bold').setBackground('#dfeee5');}
  return sheet.getName();
}
function output(obj){return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);}
function clean(value,max){return String(value==null?'':value).trim().slice(0,max).replace(/[\u0000-\u001F\u007F]/g,' ');}
// Spreadsheet formula injection 방지
function safeCell(value,max){const s=clean(value,max);return /^[=+\-@\t\r]/.test(s)?"'"+s:s;}
function doPost(e){
  try{
    const d=JSON.parse(e.postData.contents||'{}');
    if(d.website) return output({ok:true}); // 허니팟
    const type=clean(d.type,60),course=clean(d.course,90),name=clean(d.name,40);
    const phone=clean(d.phone,40),email=clean(d.email,150),message=clean(d.message,4000);
    if(!type||!course||!name||(!phone&&!email)||message.length<5||d.consent!=='yes') return output({ok:false,message:'필수 입력 항목을 확인하세요.'});
    if(email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))return output({ok:false,message:'이메일 형식이 올바르지 않습니다.'});
    const lock=LockService.getScriptLock();lock.waitLock(15000);
    let id;
    try{
      const sheet=initSheet();id=Utilities.getUuid().slice(0,8).toUpperCase();
      sheet.appendRow([new Date(),id,safeCell(type,60),safeCell(course,90),safeCell(d.organization,100),safeCell(name,40),safeCell(phone,40),safeCell(email,150),safeCell(d.when,90),safeCell(d.students,90),safeCell(message,4000),'동의','신규',safeCell(d.source,100)]);
    }finally{lock.releaseLock();}
    // 메일 실패가 접수 실패로 오인되지 않도록 저장 후 알림을 별도 처리
    try{
      MailApp.sendEmail({to:CONFIG.notificationEmail,subject:'[코아랩 교육문의] '+type+' / '+id,
      body:'새 교육 문의가 접수되었습니다.\n접수번호: '+id+'\n문의 유형: '+type+'\n교육 분야: '+course+'\n기관명: '+clean(d.organization,100)+'\n담당자: '+name+'\n연락처: '+phone+'\n이메일: '+email+'\n희망 시기: '+clean(d.when,90)+'\n대상·인원: '+clean(d.students,90)+'\n\n문의 내용:\n'+message+'\n\n스프레드시트에서 처리상태를 관리하세요.'});
    }catch(mailError){console.error('메일 알림 오류: '+mailError);}
    return output({ok:true,id:id});
  }catch(err){console.error(err);return output({ok:false,message:'접수 처리 오류'});}
}
