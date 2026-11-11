const KEY='prairie-preludes-creator-studio-v2';
const SAFETY_KEY='prairie-preludes-creator-studio-v2-safety-copy';
const blank=()=>({uploads:[],snapshots:[],music:[],evidence:{},copies:[],reviews:[],plans:[],assets:[],series:[],photos:[],photoUsage:[],fieldSessions:[],weeklyRecaps:[],recapTitles:[],brandDefaults:{brandName:'Prairie Preludes',tagline:'A quieter kind of beautiful.',musicCredit:'Original violin music by Prairie Preludes',copyright:'© Prairie Preludes. All rights reserved.',hashtags:'#PrairiePreludes #AQuieterKindOfBeautiful #PeacefulMoments #OriginalViolinMusic',tiktokHashtags:''}});
function readStoredObject(key){
 try{const raw=localStorage.getItem(key);if(!raw)return null;const value=JSON.parse(raw);return value&&typeof value==='object'&&!Array.isArray(value)?value:null;}catch(e){return null}
}
function load(){
 try{
  const primary=readStoredObject(KEY);
  if(primary)return {...blank(),...primary};
  // Recover if the primary catalog key is missing or unreadable but the on-device safety copy remains.
  const safety=readStoredObject(SAFETY_KEY);
  if(safety){try{localStorage.setItem(KEY,JSON.stringify(safety))}catch(e){};return {...blank(),...safety};}
  // Migrate data from the first version if it exists in this browser.
  let old=JSON.parse(localStorage.getItem('prairie-preludes-creator-studio-v1')||'null');
  if(old){
   let uploads=[],snapshots=[];
   (old.videos||[]).forEach(v=>{
    let u={id:v.id||crypto.randomUUID(),title:v.title,publishDate:v.publishDate,genre:v.genre,url:v.url,platform:v.platform};
    uploads.push(u);
    snapshots.push({id:crypto.randomUUID(),videoId:u.id,window:v.window==='7'||v.window==='30'||v.window==='90'||v.window==='lifetime'?v.window:'24h',snapshotDate:v.snapshotDate||v.publishDate,views:v.views||0,likes:v.likes||0,comments:v.comments||0,shares:v.shares||0,watch:v.watch||0,followers:v.followers||0});
   });
   return {...blank(),uploads,snapshots,music:old.music||[],evidence:old.evidence||{},copies:old.copies||[],reviews:old.reviews||[]};
  }
  return blank();
 }catch(e){return blank()}
}
let db=load();
// Music Catalog IDs are distinct from the legacy optional registration-number field.
function newMusicInternalId(used){let candidate='';do{candidate='MUS-'+crypto.randomUUID().replace(/-/g,'').slice(0,8).toUpperCase();}while(used.has(candidate));used.add(candidate);return candidate;}
function ensureMusicInternalIds(records){const used=new Set();(Array.isArray(records)?records:[]).forEach(record=>{let id=String(record.internalId||'').trim();if(!id||used.has(id))id=newMusicInternalId(used);else used.add(id);record.internalId=id;});return records;}
const musicIdsBefore=JSON.stringify((Array.isArray(db.music)?db.music:[]).map(record=>String(record.internalId||'')));
db.music=ensureMusicInternalIds(Array.isArray(db.music)?db.music:[]);
const musicIdsMigrated=musicIdsBefore!==JSON.stringify(db.music.map(record=>String(record.internalId||'')));
// Older footage records remain compatible and default to normal recording speed.
db.assets=db.assets.map(a=>({...a,recordingSpeed:a.recordingSpeed||'1'}));
db.fieldSessions=Array.isArray(db.fieldSessions)?db.fieldSessions:[];db.weeklyRecaps=Array.isArray(db.weeklyRecaps)?db.weeklyRecaps:[];db.recapTitles=Array.isArray(db.recapTitles)?db.recapTitles:[];db.series=Array.isArray(db.series)?db.series.map(x=>({...x,status:x.status||'active',releases:Array.isArray(x.releases)?x.releases:[]})):[];db.plans=Array.isArray(db.plans)?db.plans.map(p=>({...p,seriesId:p.seriesId||''})):[];
db.brandDefaults={brandName:'Prairie Preludes',tagline:'A quieter kind of beautiful.',musicCredit:'Original violin music by Prairie Preludes',copyright:'© Prairie Preludes. All rights reserved.',hashtags:'#PrairiePreludes #AQuieterKindOfBeautiful #PeacefulMoments #OriginalViolinMusic',tiktokHashtags:'',...(db.brandDefaults||{})};
const PREPUBLISH_ITEMS=[
 'Confirm final video edit and framing',
 'Check audio levels and violin recording',
 'Confirm music is original and credited',
 'Review caption, description, and hashtags',
 'Choose thumbnail / cover image',
 'Verify platform format and export quality',
 'Check copyright evidence and source files',
 'Confirm title, links, and scheduled date'
];
function save(){
 const payload=JSON.stringify(db);
 // Keep a second on-device copy to recover from an accidental loss/corruption of the primary key.
 localStorage.setItem(KEY,payload);
 try{localStorage.setItem(SAFETY_KEY,payload)}catch(e){console.warn('Prairie Preludes safety copy could not be updated:',e)}
 render();
}
function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function val(id){return document.getElementById(id).value}
function num(id){return Number(val(id)||0)}
const SNAPSHOT_METRICS=['views','likes','comments','shares','saves','avgWatchSeconds','avgPercentViewed','completionRate','followers'];
function snapshotMetric(s,key){if(!s)return null;const na=Array.isArray(s.naMetrics)&&s.naMetrics.includes(key);if(na||s[key]===null||s[key]===undefined||s[key]==='')return null;const n=Number(s[key]);return Number.isFinite(n)?n:null;}
function metricSum(rows,key){const values=rows.map(s=>snapshotMetric(s,key)).filter(v=>v!==null);return values.length?values.reduce((a,b)=>a+b,0):null}
function engagementSum(rows){const values=rows.map(engagementValue).filter(v=>v!==null);return values.length?values.reduce((a,b)=>a+b,0):null}
function engagementAverage(rows){const values=rows.map(engagementValue).filter(v=>v!==null);return values.length?values.reduce((a,b)=>a+b,0)/values.length:null}
function metricAverage(rows,key){const values=rows.map(s=>snapshotMetric(s,key)).filter(v=>v!==null);return values.length?values.reduce((a,b)=>a+b,0)/values.length:null}
function engagementValue(s){const vals=['likes','comments','shares','saves'].map(k=>snapshotMetric(s,k));return vals.some(v=>v===null)?null:vals.reduce((a,b)=>a+b,0)}
function analyticsNumber(v,key){if(v===null||v===undefined)return 'N/A';return key&&['avgPercentViewed','completionRate'].includes(key)?Number(v).toFixed(1)+'%':key==='avgWatchSeconds'?Number(v).toFixed(1)+' sec':fmt(v)}
function denverDateString(d=new Date()){const parts=new Intl.DateTimeFormat('en-CA',{timeZone:'America/Denver',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(d);const p=Object.fromEntries(parts.map(x=>[x.type,x.value]));return `${p.year}-${p.month}-${p.day}`;}
function today(){return denverDateString()}
function fmt(n){return Number(n||0).toLocaleString()}
function table(headers,rows){if(!rows.length)return '<div class="empty">Nothing recorded yet.</div>';return '<table><thead><tr>'+headers.map(x=>'<th>'+x+'</th>').join('')+'</tr></thead><tbody>'+rows.join('')+'</tbody></table>'}
function openTab(tab){document.querySelectorAll('nav button').forEach(x=>x.classList.toggle('active',x.dataset.tab===tab));document.querySelectorAll('.nav-dropdown').forEach(d=>{d.open=false;});document.querySelectorAll('.panel').forEach(x=>x.classList.toggle('active',x.id===tab));window.scrollTo({top:0,behavior:'smooth'});}
document.querySelectorAll('nav button').forEach(b=>b.addEventListener('click',()=>openTab(b.dataset.tab)));
['uDate','sDate','mDate','cDate','pDate','aDate'].forEach(id=>{let el=document.getElementById(id);if(el)el.value=today()});
document.getElementById('monthSelect').value=today().slice(0,7);
['monthSelect','monthPlatform','monthWindow'].forEach(id=>document.getElementById(id).addEventListener('change',renderMonthly));
['compareWindow','compareMetric'].forEach(id=>document.getElementById(id).addEventListener('change',renderCrossPlatform));
document.getElementById('insightMetric')?.addEventListener('change',renderInsights);
document.getElementById('analyticsDetailVideo')?.addEventListener('change',renderAnalyticsVideoDetail);
['analyticsCompareWindow','analyticsFilterPlatform','analyticsFilterGenre','analyticsFilterVideo','analyticsTrendWindow','analyticsTrendPlatform','analyticsPlatformMetric','analyticsRetentionMetric','analyticsGenreMetric','analyticsTreatmentMetric','analyticsVideoMetric','analyticsVideoPlatform'].forEach(id=>document.getElementById(id)?.addEventListener('change',renderAnalytics));
['ytLongCategory','ytLongWindow'].forEach(id=>document.getElementById(id).addEventListener('change',renderYoutubeLongAnalytics));
document.getElementById('rYear').value=new Date().getFullYear();
const platforms=['YouTube Shorts','YouTube Long Format','Instagram','Facebook','TikTok'];
let editingUploadId=null;
function updateUploadCategoryUI(){
 const platform=val('uPlatform'),isLong=platform==='YouTube Long Format';
 document.getElementById('uLongCategoryRow').hidden=!isLong;
 document.getElementById('uWeeklyRecapField').hidden=!(isLong&&val('uContentCategory')==='weeklyRecap');
}
function updateWeeklyRecapSelect(selected=''){
 const el=document.getElementById('uWeeklyRecap');if(!el)return;el.innerHTML='<option value="">Choose a weekly recap…</option>'+db.weeklyRecaps.slice().sort((a,b)=>String(b.publishDate||'').localeCompare(String(a.publishDate||''))).map(r=>`<option value="${esc(r.id)}">${esc(r.fullTitle||recapFullTitle(r))}${r.publishDate?' · '+esc(r.publishDate):''}</option>`).join('');
 if([...el.options].some(o=>o.value===selected))el.value=selected;
}
function resetUploadForm(){editingUploadId=null;const f=document.getElementById('uploadForm');f.reset();document.getElementById('uDate').value=today();document.getElementById('uploadSaveBtn').textContent='Save video entry';document.getElementById('resetUpload').textContent='Clear form';updateWeeklyRecapSelect();updateUploadCategoryUI();}
function editUpload(id){const v=db.uploads.find(x=>x.id===id);if(!v)return;editingUploadId=id;document.getElementById('uTitle').value=v.title||'';document.getElementById('uDate').value=v.publishDate||'';document.getElementById('uGenre').value=v.genre||'Other';document.getElementById('uUrl').value=v.url||'';document.getElementById('uPlatform').value=v.platform||'YouTube Long Format';document.getElementById('uTime').value=v.uploadTime||'';document.getElementById('uContentCategory').value=v.contentCategory|| (v.weeklyRecapId?'weeklyRecap':(v.platform==='YouTube Long Format'?'standaloneLongForm':'standaloneLongForm'));updateWeeklyRecapSelect(v.weeklyRecapId||'');[...document.getElementById('uAssets').options].forEach(o=>o.selected=(v.assetIds||[]).includes(o.value));updateUploadCategoryUI();document.getElementById('uploadSaveBtn').textContent='Update video entry';document.getElementById('resetUpload').textContent='Cancel edit';openTab('uploads');document.getElementById('uploadForm').scrollIntoView({behavior:'smooth',block:'start'});}
function prepareRecapUpload(id){const r=db.weeklyRecaps.find(x=>x.id===id);if(!r)return;const existing=db.uploads.find(x=>x.platform==='YouTube Long Format'&&x.weeklyRecapId===id);if(existing){editUpload(existing.id);return;}resetUploadForm();document.getElementById('uTitle').value=r.fullTitle||recapFullTitle(r);document.getElementById('uDate').value=r.publishDate||today();document.getElementById('uPlatform').value='YouTube Long Format';document.getElementById('uUrl').value=r.youtubeUrl||'';document.getElementById('uContentCategory').value='weeklyRecap';updateWeeklyRecapSelect(id);document.getElementById('uWeeklyRecap').value=id;updateUploadCategoryUI();openTab('uploads');document.getElementById('uploadForm').scrollIntoView({behavior:'smooth',block:'start'});}
document.getElementById('uPlatform').addEventListener('change',updateUploadCategoryUI);
document.getElementById('uContentCategory').addEventListener('change',updateUploadCategoryUI);
document.getElementById('uploadForm').addEventListener('submit',e=>{
 e.preventDefault();
 const chosen=val('uPlatform'),shortPlatforms=['Instagram','Facebook','TikTok','YouTube Shorts'],targets=chosen==='All'?shortPlatforms:[chosen],uploadTime=val('uTime');
 if(targets.some(p=>shortPlatforms.includes(p))&&!uploadTime){alert('Please select an upload-time window for short-form platform analytics.');return;}
 const isLong=chosen==='YouTube Long Format',category=isLong?val('uContentCategory'):'other',recapId=(isLong&&category==='weeklyRecap')?val('uWeeklyRecap'):'';
 if(isLong&&category==='weeklyRecap'&&!recapId){alert('Please link this YouTube upload to its weekly recap.');return;}
 if(isLong&&category==='weeklyRecap'){const duplicate=db.uploads.find(v=>v.platform==='YouTube Long Format'&&v.weeklyRecapId===recapId&&v.id!==editingUploadId);if(duplicate){alert('This weekly recap already has a YouTube upload record. The existing record will be opened for editing.');editUpload(duplicate.id);return;}}
 if(rejectFuturePublishedDate(val('uDate'),'upload record'))return;
 const common={title:val('uTitle'),publishDate:val('uDate'),uploadTime,genre:val('uGenre'),url:val('uUrl'),assetIds:[...document.getElementById('uAssets').selectedOptions].map(o=>o.value)};
 if(editingUploadId){const old=db.uploads.find(v=>v.id===editingUploadId);if(!old){alert('The upload record could not be found.');resetUploadForm();return;}Object.assign(old,common,{platform:chosen,contentCategory:category,weeklyRecapId:recapId||''});}
 else targets.forEach(platform=>db.uploads.push({id:crypto.randomUUID(),...common,platform,contentCategory:platform==='YouTube Long Format'?category:'other',weeklyRecapId:platform==='YouTube Long Format'?recapId||'':''}));
 const recap=recapId?db.weeklyRecaps.find(r=>r.id===recapId):null;if(recap){recap.youtubeUrl=common.url||recap.youtubeUrl||'';recap.publishDate=common.publishDate||recap.publishDate||'';}
 resetUploadForm();save();
});
document.getElementById('resetUpload').onclick=resetUploadForm;
document.getElementById('snapshotFilter').onchange=renderSnapshots;
['timeAnalyticsWindow','timeAnalyticsPlatform'].forEach(id=>document.getElementById(id).addEventListener('change',renderTimeAnalytics));
let editingSnapshotId=null;
function setSnapshotNaState(id,checked){const input=document.getElementById(id);if(input)input.disabled=checked;}
function syncSnapshotNa(){SNAPSHOT_METRICS.forEach(key=>{const id={avgWatchSeconds:'sAvgWatch',avgPercentViewed:'sAvgPercentViewed',completionRate:'sCompletionRate',followers:'sFollowers'}[key]||'s'+key[0].toUpperCase()+key.slice(1);const na=document.getElementById(id+'Na');if(na)setSnapshotNaState(id,na.checked);});}
SNAPSHOT_METRICS.forEach(key=>{const id={avgWatchSeconds:'sAvgWatch',avgPercentViewed:'sAvgPercentViewed',completionRate:'sCompletionRate',followers:'sFollowers'}[key]||'s'+key[0].toUpperCase()+key.slice(1);const na=document.getElementById(id+'Na');if(na)na.addEventListener('change',()=>setSnapshotNaState(id,na.checked));});
function resetSnapshotForm(){editingSnapshotId=null;document.getElementById('snapshotForm').reset();document.getElementById('sDate').value=today();document.getElementById('sVideo').disabled=false;document.getElementById('sWindow').disabled=false;document.getElementById('saveSnapshotButton').textContent='Save snapshot';document.getElementById('cancelSnapshotEdit').hidden=true;SNAPSHOT_METRICS.forEach(key=>{const id={avgWatchSeconds:'sAvgWatch',avgPercentViewed:'sAvgPercentViewed',completionRate:'sCompletionRate',followers:'sFollowers'}[key]||'s'+key[0].toUpperCase()+key.slice(1);document.getElementById(id).value=0;document.getElementById(id).disabled=false;});syncSnapshotNa();document.getElementById('sCreativeTreatment').value='';}
document.getElementById('snapshotForm').addEventListener('submit',e=>{
 e.preventDefault();const existing=editingSnapshotId?db.snapshots.find(x=>x.id===editingSnapshotId):null;const uploadId=existing?existing.videoId:val('sVideo');const video=db.uploads.find(v=>v.id===uploadId);if(!video){alert('Please add a video entry first.');return}
 const naMetrics=[];const metrics={snapshotDate:val('sDate')||today(),creativeTreatment:val('sCreativeTreatment')||''};
 SNAPSHOT_METRICS.forEach(key=>{const id={avgWatchSeconds:'sAvgWatch',avgPercentViewed:'sAvgPercentViewed',completionRate:'sCompletionRate',followers:'sFollowers'}[key]||'s'+key[0].toUpperCase()+key.slice(1);const isNa=document.getElementById(id+'Na').checked;if(isNa){naMetrics.push(key);metrics[key]=null;}else metrics[key]=num(id);});metrics.naMetrics=naMetrics;
 if(existing)Object.assign(existing,metrics);else db.snapshots.push({id:crypto.randomUUID(),videoId:video.id,window:val('sWindow'),...metrics});
 resetSnapshotForm();save();
});
document.getElementById('resetSnapshot').onclick=resetSnapshotForm;
document.getElementById('cancelSnapshotEdit').onclick=resetSnapshotForm;
function editSnapshot(id){const s=db.snapshots.find(x=>x.id===id);if(!s)return;editingSnapshotId=s.id;updateVideoSelect();document.getElementById('sVideo').value=s.videoId;document.getElementById('sWindow').value=s.window;document.getElementById('sDate').value=s.snapshotDate||today();SNAPSHOT_METRICS.forEach(key=>{const inputId={avgWatchSeconds:'sAvgWatch',avgPercentViewed:'sAvgPercentViewed',completionRate:'sCompletionRate',followers:'sFollowers'}[key]||'s'+key[0].toUpperCase()+key.slice(1);const isNa=(s.naMetrics||[]).includes(key)||s[key]===null||s[key]===undefined;document.getElementById(inputId+'Na').checked=isNa;document.getElementById(inputId).value=s[key]??0;});document.getElementById('sCreativeTreatment').value=s.creativeTreatment||'';syncSnapshotNa();document.getElementById('sVideo').disabled=true;document.getElementById('sWindow').disabled=true;document.getElementById('saveSnapshotButton').textContent='Save changes';document.getElementById('cancelSnapshotEdit').hidden=false;openTab('snapshots');document.getElementById('sViews').focus();}
document.getElementById('musicForm').addEventListener('submit',e=>{e.preventDefault();const editId=val('mEditId');const existing=editId?db.music.find(x=>x.id===editId):null;const used=new Set(db.music.map(x=>String(x.internalId||'').trim()).filter(Boolean));const internalId=existing?.internalId||newMusicInternalId(used);const record={internalId,title:val('mTitle'),date:val('mDate'),status:val('mStatus'),type:val('mType'),release:val('mRelease'),code:val('mCode'),fileLocation:val('mFileLocation'),driveLink:val('mDriveLink'),videoId:val('mVideoId'),notes:val('mNotes')};if(existing)Object.assign(existing,record);else db.music.push({id:crypto.randomUUID(),...record});save();cancelMusicEdit();});
const checks=['Dated composition drafts or notation','Original DAW / recording project files','Dated raw audio and final master export','Dated video project and original footage','Publication URLs and screenshots','Work title, authorship, and collaborator records','Copyright registration application / certificate (if applicable)','License, permission, or distribution records (if applicable)'];
function updateWorkSelects(){['eWork','cWork'].forEach(id=>{let s=document.getElementById(id),old=s.value;s.innerHTML=db.music.length?db.music.map(m=>`<option value="${m.id}">${esc(m.title)}</option>`).join(''):'<option value="">Add a work first</option>';if([...s.options].some(o=>o.value===old))s.value=old});}
function updateVideoSelect(){let s=document.getElementById('sVideo'),old=s.value;s.innerHTML=db.uploads.length?db.uploads.map(v=>`<option value="${v.id}">${esc(v.title)} — ${esc(v.platform)}${v.platform==='YouTube Long Format'?' · '+((v.contentCategory==='weeklyRecap'||v.weeklyRecapId)?'Weekly recap':'Standalone long-form'):''}</option>`).join(''):'<option value="">Add a video first</option>';if([...s.options].some(o=>o.value===old))s.value=old}
document.getElementById('eWork').onchange=renderChecklist;
function renderChecklist(){let id=val('eWork'),item=db.evidence[id]||{checked:[],notes:''};document.getElementById('checklist').innerHTML=checks.map((c,i)=>`<label><input type="checkbox" data-check="${i}" ${item.checked.includes(i)?'checked':''}> <span>${esc(c)}</span></label>`).join('');document.getElementById('eNotes').value=item.notes||'';}
document.getElementById('evidenceForm').addEventListener('submit',e=>{e.preventDefault();let id=val('eWork');if(!id)return;db.evidence[id]={checked:[...document.querySelectorAll('[data-check]:checked')].map(x=>Number(x.dataset.check)),notes:val('eNotes')};save();alert('Evidence checklist saved.')});
document.getElementById('copyForm').addEventListener('submit',e=>{e.preventDefault();db.copies.push({id:crypto.randomUUID(),workId:val('cWork'),date:val('cDate'),platform:val('cPlatform'),status:val('cStatus'),url:val('cUrl'),evidence:val('cEvidence'),action:val('cAction')});save();e.target.reset();document.getElementById('cDate').value=today()});
document.getElementById('reviewForm').addEventListener('submit',e=>{e.preventDefault();db.reviews.push({id:crypto.randomUUID(),quarter:val('rQuarter'),year:val('rYear'),wins:val('rWins'),learn:val('rLearn'),next:val('rNext'),notes:val('rNotes'),saved:today()});save();e.target.reset();document.getElementById('rYear').value=new Date().getFullYear()});
let editingPlanId=null;
document.getElementById('planForm').addEventListener('submit',e=>{e.preventDefault();const platforms=[...document.getElementById('pPlatforms').selectedOptions].map(o=>o.value);const existing=editingPlanId?db.plans.find(p=>p.id===editingPlanId):null;if(val('pStatus')==='Published'&&rejectFuturePublishedDate(val('pDate'),'video project'))return;const record={...(existing||{}),id:existing?.id||crypto.randomUUID(),title:val('pTitle'),plannedDate:val('pDate'),status:val('pStatus'),genre:val('pGenre'),aspect:val('pAspect'),runtime:val('pRuntime').trim(),platforms,seriesId:val('pSeries')||'',fieldSessionId:val('pFieldSession')||'',musicId:val('pMusic'),assetId:val('pAsset'),caption:val('pCaption'),hashtags:val('pHashtags'),shotList:val('pShotList'),editingNotes:val('pEditNotes'),notes:val('pNotes'),created:existing?.created||today(),updated:today(),videoIds:existing?.videoIds||[],prePublishChecklist:PREPUBLISH_ITEMS.map((label,i)=>({label,done:!!existing?.prePublishChecklist?.find(x=>x.label===label)?.done}))};if(existing)Object.assign(existing,record);else db.plans.push(record);editingPlanId=null;document.getElementById('savePlanBtn').textContent='Save project';document.getElementById('resetPlan').textContent='Clear form';save();e.target.reset();document.getElementById('pDate').value=today();document.getElementById('pSeries').value='';[...document.getElementById('pPlatforms').options].forEach(o=>o.selected=true);const chooser=document.getElementById('planChooser');if(chooser)chooser.value='__new__'});
document.getElementById('resetPlan').onclick=()=>{editingPlanId=null;document.getElementById('planForm').reset();document.getElementById('pDate').value=today();document.getElementById('savePlanBtn').textContent='Save project';document.getElementById('resetPlan').textContent='Clear form';const chooser=document.getElementById('planChooser');if(chooser)chooser.value='__new__'};
document.getElementById('planChooser').addEventListener('change',e=>{const id=e.target.value;if(id==='__new__'){if(val('plannerContentType')==='photo')resetPhotoProjectForm();else document.getElementById('resetPlan').click();return}if(id){if(val('plannerContentType')==='photo')editPhotoProject(id);else editPlan(id)}});
document.getElementById('checklistProject').addEventListener('change',renderProjectChecklist);
document.getElementById('saveProjectChecklist').addEventListener('click',saveProjectChecklist);
document.getElementById('saveBrandDefaults').addEventListener('click',saveBrandDefaults);
document.getElementById('builderProject').addEventListener('change',renderUploadBuilder);
document.getElementById('builderExtra').addEventListener('input',renderUploadBuilder);
let editingAssetId=null;
function resetAssetForm(){editingAssetId=null;const f=document.getElementById('assetForm');f.reset();document.getElementById('aDate').value=today();document.getElementById('aSpeed').value='1';document.getElementById('assetEditNotice').hidden=true;document.getElementById('assetSaveButton').textContent='Save footage record';document.getElementById('cancelAssetEdit').hidden=true;}
document.getElementById('assetForm').addEventListener('submit',e=>{e.preventDefault();const fields={title:val('aTitle'),recordedDate:val('aDate'),format:val('aFormat'),location:val('aLocation'),weather:val('aWeather'),camera:val('aCamera'),filmingSetup:val('aFilmingSetup'),recordingSpeed:val('aSpeed')||'1',videoLength:val('aLength'),videoFilter:val('aFilter'),fileLocation:val('aFile'),notes:val('aNotes')};if(editingAssetId){const item=db.assets.find(a=>a.id===editingAssetId);if(!item){alert('That footage record could not be found.');resetAssetForm();return}Object.assign(item,fields,{updated:today()});}else{db.assets.push({id:crypto.randomUUID(),...fields,created:today()});}save();resetAssetForm();});
document.getElementById('cancelAssetEdit').addEventListener('click',resetAssetForm);
function editAsset(id){const a=db.assets.find(x=>x.id===id);if(!a)return;editingAssetId=id;[['aTitle','title'],['aDate','recordedDate'],['aFormat','format'],['aLocation','location'],['aWeather','weather'],['aCamera','camera'],['aFilmingSetup','filmingSetup'],['aSpeed','recordingSpeed'],['aLength','videoLength'],['aFilter','videoFilter'],['aFile','fileLocation'],['aNotes','notes']].forEach(([field,key])=>document.getElementById(field).value=a[key]||'');document.getElementById('assetEditNotice').hidden=false;document.getElementById('assetSaveButton').textContent='Update footage record';document.getElementById('cancelAssetEdit').hidden=false;document.getElementById('assetForm').scrollIntoView({behavior:'smooth',block:'start'});document.getElementById('aTitle').focus();}

function del(type,id){if(confirm('Delete this record?')){db[type]=db[type].filter(x=>x.id!==id);if(type==='assets'&&editingAssetId===id)resetAssetForm();save()}}
function renderUploads(){
 document.getElementById('uploadTable').innerHTML=table(['Video / platform','Content category','Published','Upload time','Genre','Associated footage','URL','Actions'],db.uploads.slice().reverse().map(v=>{const assets=(v.assetIds||[]).map(id=>db.assets.find(a=>a.id===id)).filter(Boolean),recap=db.weeklyRecaps.find(r=>r.id===v.weeklyRecapId),category=v.platform==='YouTube Long Format'?((v.contentCategory==='weeklyRecap'||v.weeklyRecapId)?'Weekly recap':'Standalone long-form'):'—';return `<tr><td><b>${esc(v.title)}</b><div class="sub">${esc(v.platform)}</div></td><td>${esc(category)}${recap?`<div class="sub">${esc(recap.fullTitle||recapFullTitle(recap))}</div>`:''}</td><td>${esc(v.publishDate)}</td><td>${esc(v.uploadTime||'Not recorded')}</td><td>${esc(v.genre)}</td><td>${assets.length?assets.map(a=>esc(a.title)).join('<br>'):'<span class="sub">No assets linked</span>'}</td><td>${v.url?`<a href="${esc(v.url)}" target="_blank" rel="noopener">Open video</a>`:'—'}</td><td><button class="secondary" onclick="editUpload('${v.id}')">Edit entry</button> <button class="secondary" onclick="editUploadAssets('${v.id}')">Edit footage links</button> <button class="secondary danger" onclick="del('uploads','${v.id}')">Delete</button></td></tr>`}));
}
function editUploadAssets(id){
 const v=db.uploads.find(x=>x.id===id);if(!v)return;
 if(!db.assets.length){alert('Add footage assets in the Video Catalog first.');return}
 const list=db.assets.map((a,i)=>`${i+1}. ${a.title} [${a.id.slice(0,8)}]`).join('\n');
 const current=(v.assetIds||[]).map(x=>db.assets.findIndex(a=>a.id===x)+1).filter(n=>n>0).join(', ');
 const answer=prompt(`Select footage numbers to associate with "${v.title}". Enter comma-separated numbers, or leave blank for none.\n\n${list}`,current);
 if(answer===null)return;
 const nums=answer.split(',').map(x=>Number(x.trim())).filter(n=>Number.isInteger(n)&&n>=1&&n<=db.assets.length);
 v.assetIds=[...new Set(nums)].map(n=>db.assets[n-1].id);save();
}
function renderTimeAnalytics(){
 const period=val('timeAnalyticsWindow'),platform=val('timeAnalyticsPlatform'),shortPlatforms=['Instagram','Facebook','TikTok','YouTube Shorts'];
 const eligible=db.uploads.filter(v=>v.uploadTime&&(!platform||v.platform===platform)&&(!platform?shortPlatforms.includes(v.platform):true)),rows=[];
 eligible.forEach(v=>{const snaps=db.snapshots.filter(s=>s.videoId===v.id&&s.window===period).sort((a,b)=>String(b.snapshotDate||'').localeCompare(String(a.snapshotDate||'')));if(snaps.length)rows.push({video:v,s:snaps[0]});});
 const groups={};rows.forEach(({video:v,s})=>{const g=groups[v.uploadTime]||(groups[v.uploadTime]={count:0,views:0,viewCount:0,engagement:0,engagementCount:0,avgWatchSeconds:0,watchCount:0,followers:0});g.count++;const views=snapshotMetric(s,'views');if(views!==null){g.views+=views;g.viewCount++;}const engagement=engagementValue(s);if(engagement!==null){g.engagement+=engagement;g.engagementCount++;}if(views!==null&&engagement!==null){g.rateViews+=views;g.rateEngagement+=engagement;g.rateCount++;}const watch=snapshotMetric(s,'avgWatchSeconds');if(watch!==null){g.avgWatchSeconds+=watch;g.watchCount++;}const followers=snapshotMetric(s,'followers');if(followers!==null)g.followers+=followers;});
 const sorted=Object.entries(groups).sort((a,b)=>a[0].localeCompare(b[0]));const best=sorted.filter(x=>x[1].viewCount).sort((a,b)=>(b[1].views/b[1].viewCount)-(a[1].views/a[1].viewCount))[0];
 document.getElementById('timeAnalyticsSummary').innerHTML=best?`<div class="notice">Strongest window in this sample: <b>${esc(best[0])}</b> · ${fmt(best[1].views/best[1].viewCount)} average views per available video · ${best[1].viewCount} with views recorded</div>`:'<div class="empty">No matching snapshots yet. Record a snapshot for videos with an upload-time window to see comparisons.</div>';
 document.getElementById('timeAnalyticsTable').innerHTML=table(['Upload time','Videos','Total views','Avg. views / video','Engagement rate','Avg. watch sec / video','Followers gained'],sorted.map(([k,g])=>`<tr><td><b>${esc(k)}</b></td><td>${g.count}</td><td>${fmt(g.views)}<div class="sub">${g.viewCount} available</div></td><td>${g.viewCount?fmt(g.views/g.viewCount):'N/A'}</td><td>${g.rateCount&&g.rateViews?((g.rateEngagement/g.rateViews)*100).toFixed(2)+'%':'N/A'}</td><td>${g.watchCount?fmt(g.avgWatchSeconds/g.watchCount):'N/A'}<div class="sub">${g.watchCount} available</div></td><td>${fmt(g.followers)}</td></tr>`));
}
function renderSnapshots(){
 let f=val('snapshotFilter')||'',list=db.snapshots.filter(s=>{let v=db.uploads.find(x=>x.id===s.videoId);return v&&(!f||v.platform===f)}).slice().reverse();
 const display=(s,k)=>snapshotMetric(s,k)===null?'N/A':analyticsNumber(snapshotMetric(s,k),k);
 document.getElementById('snapshotTable').innerHTML=table(['Video / platform','Treatment','Window','Snapshot date','Views','Engagement','Retention','Followers',''],list.map(s=>{let v=db.uploads.find(x=>x.id===s.videoId);const eng=engagementValue(s);return `<tr><td><b>${esc(v?.title||'Deleted video')}</b><div class="sub">${esc(v?.platform||'')}</div></td><td>${esc(s.creativeTreatment==='cleanVisual'?'Clean Visual':s.creativeTreatment==='quoteOverlay'?'Quote Overlay':'Not classified')}</td><td>${esc(s.window==='lifetime'?'Lifetime':s.window==='24h'?'24 hours':s.window+' days')}</td><td>${esc(s.snapshotDate)}</td><td>${display(s,'views')}</td><td>${eng===null?'N/A':fmt(eng)} actions<div class="sub">Likes ${display(s,'likes')} · Comments ${display(s,'comments')} · Shares ${display(s,'shares')} · Saves ${display(s,'saves')}</div></td><td>${display(s,'avgWatchSeconds')}<div class="sub">Viewed ${display(s,'avgPercentViewed')} · Completed ${display(s,'completionRate')}</div></td><td>${display(s,'followers')}</td><td><div class="actions"><button class="secondary" onclick="editSnapshot('${s.id}')">Edit</button><button class="secondary danger" onclick="del('snapshots','${s.id}')">Delete</button></div></td></tr>`;}));
}
function editMusic(id){const m=db.music.find(x=>x.id===id);if(!m)return;document.getElementById('mEditId').value=m.id;['Title','Date','Status','Type','Release','Code','FileLocation','DriveLink','VideoId','Notes'].forEach((suffix)=>{const key={Title:'title',Date:'date',Status:'status',Type:'type',Release:'release',Code:'code',FileLocation:'fileLocation',DriveLink:'driveLink',VideoId:'videoId',Notes:'notes'}[suffix];const el=document.getElementById('m'+suffix);if(el)el.value=m[key]||''});document.getElementById('musicSaveBtn').textContent='Save changes';document.getElementById('musicCancelBtn').style.display='inline-flex';document.getElementById('musicForm').scrollIntoView({behavior:'smooth',block:'start'});}
function cancelMusicEdit(){const f=document.getElementById('musicForm');f.reset();document.getElementById('mEditId').value='';document.getElementById('mDate').value=today();document.getElementById('musicSaveBtn').textContent='Save work';document.getElementById('musicCancelBtn').style.display='none';}
function renderMusic(){document.getElementById('musicTable').innerHTML=table(['Work','Type / status','Dates','File location / Google Drive','Internal ID / registration / notes',''],db.music.slice().reverse().map(m=>{const v=db.uploads.find(x=>x.id===m.videoId);const link=String(m.driveLink||'').trim();const safeLink=/^https:\/\//i.test(link)?`<a href="${esc(link)}" target="_blank" rel="noopener noreferrer">Open Google Drive file</a>`:'—';return `<tr><td><b>${esc(m.title)}</b></td><td>${esc(m.type)}<br><span class="sub">${esc(m.status)}</span></td><td>Created: ${esc(m.date||'—')}<br>Published: ${esc(m.release||'—')}</td><td>${esc(m.fileLocation||'—')}<div class="sub">${safeLink}</div><div class="sub">${esc(v?.title||'No video linked')}</div></td><td><strong>${esc(m.internalId||'—')}</strong><br><span class="sub">Registration: ${esc(m.code||'—')}</span><br><span class="sub">${esc(m.notes||'')}</span></td><td><button class="secondary" onclick="editMusic('${m.id}')">Edit</button> <button class="secondary danger" onclick="del('music','${m.id}')">Delete</button></td></tr>`}))}
function renderYoutubeLongAnalytics(){
 const category=val('ytLongCategory')||'all',windowChoice=val('ytLongWindow')||'7';const uploads=db.uploads.filter(v=>v.platform==='YouTube Long Format'&&(category==='all'||(v.contentCategory||(v.weeklyRecapId?'weeklyRecap':'standaloneLongForm'))===category));
 const rows=uploads.map(v=>{const snapshots=db.snapshots.filter(s=>s.videoId===v.id&&s.window===windowChoice).sort((a,b)=>String(b.snapshotDate||'').localeCompare(String(a.snapshotDate||'')));return {video:v,s:snapshots[0]||null};});
 const sum=k=>{const vals=rows.map(r=>snapshotMetric(r.s,k)).filter(x=>x!==null);return vals.length?vals.reduce((a,b)=>a+b,0):null},covered=rows.filter(r=>r.s).length;const engagementRows=rows.filter(r=>r.s&&engagementValue(r.s)!==null),watchRows=rows.filter(r=>r.s&&snapshotMetric(r.s,'avgWatchSeconds')!==null);
 document.getElementById('ytLongUploads').textContent=fmt(uploads.length);document.getElementById('ytLongViews').textContent=analyticsNumber(sum('views'),'views');document.getElementById('ytLongEngagement').textContent=engagementRows.length?fmt(engagementRows.reduce((n,r)=>n+engagementValue(r.s),0)):'N/A';document.getElementById('ytLongWatch').textContent=watchRows.length?fmt(watchRows.reduce((n,r)=>n+snapshotMetric(r.s,'avgWatchSeconds'),0)/watchRows.length):'N/A';document.getElementById('ytLongSubscribers').textContent=analyticsNumber(sum('followers'),'followers');
 document.getElementById('ytLongSnapshotCoverage').textContent=`${covered} of ${uploads.length} upload(s) have a ${windowChoice==='lifetime'?'lifetime':windowChoice+'-day'} snapshot. Engagement includes only snapshots with all four engagement metrics available. Combined totals include standalone long-form videos and weekly recaps when “All YouTube Long Format” is selected.`;
 const disp=(s,k)=>snapshotMetric(s,k)===null?'N/A':fmt(snapshotMetric(s,k));document.getElementById('ytLongAnalyticsTable').innerHTML=table(['Upload','Category','Published','Views','Likes','Comments','Shares','Saves','Avg watch sec','Avg viewed','Completion','Followers','Snapshot date'],rows.sort((a,b)=>String(b.video.publishDate||'').localeCompare(String(a.video.publishDate||''))).map(({video:v,s})=>{const recap=db.weeklyRecaps.find(r=>r.id===v.weeklyRecapId),label=(v.contentCategory==='weeklyRecap'||v.weeklyRecapId)?'Weekly recap':'Standalone long-form';return `<tr><td><b>${esc(v.title||'Untitled upload')}</b>${recap?`<div class="sub">${esc(recap.fullTitle||recapFullTitle(recap))}</div>`:''}${v.url?`<div class="sub"><a href="${esc(v.url)}" target="_blank" rel="noopener">Open YouTube video</a></div>`:''}</td><td>${label}</td><td>${esc(v.publishDate||'—')}</td><td>${s?disp(s,'views'):'—'}</td><td>${s?disp(s,'likes'):'—'}</td><td>${s?disp(s,'comments'):'—'}</td><td>${s?disp(s,'shares'):'—'}</td><td>${s?disp(s,'saves'):'—'}</td><td>${s?disp(s,'avgWatchSeconds'):'—'}</td><td>${s?disp(s,'avgPercentViewed'):'—'}</td><td>${s?disp(s,'completionRate'):'—'}</td><td>${s?disp(s,'followers'):'—'}</td><td>${esc(s?.snapshotDate||'No snapshot')}</td></tr>`;}));
}

function latestSnapshotByUpload(){
 const latest=new Map();
 db.snapshots.forEach(s=>{
  const old=latest.get(s.videoId);
  const stamp=String(s.snapshotDate||'');
  const oldStamp=String(old?.snapshotDate||'');
  if(!old||stamp>oldStamp||(stamp===oldStamp&&String(s.id||'')>String(old.id||'')))latest.set(s.videoId,s);
 });
 return latest;
}
function viewsToDateByUpload(){
 const latest=latestSnapshotByUpload(),rows=[];
 latest.forEach((snapshot,videoId)=>{
  const upload=db.uploads.find(v=>v.id===videoId);
  if(upload)rows.push({upload,snapshot,views:snapshotMetric(snapshot,'views')});
 });
 return rows;
}
function renderInsights(){
 const metric=val('insightMetric');const rows=viewsToDateByUpload().map(({upload:v,snapshot:s,views})=>{const engagement=engagementValue(s),followers=snapshotMetric(s,'followers');return {title:v.title||'Untitled video',platform:v.platform||'Unknown',contentCategory:v.contentCategory||(v.weeklyRecapId?'weeklyRecap':'standaloneLongForm'),date:v.publishDate||'',views,engagement,engagementRate:views!==null&&views>0&&engagement!==null?engagement/views*100:null,followerRate:views!==null&&views>0&&followers!==null?followers/views*1000:null,followers,avgWatchSeconds:snapshotMetric(s,'avgWatchSeconds'),avgPercentViewed:snapshotMetric(s,'avgPercentViewed'),completionRate:snapshotMetric(s,'completionRate'),saves:snapshotMetric(s,'saves'),snapshotDate:s.snapshotDate||'',checkpoint:s.window||''}}).filter(r=>r[metric]!==null).sort((a,b)=>b[metric]-a[metric]).slice(0,10);
 document.getElementById('insightsTable').innerHTML=table(['Video / platform','Publish date','Metric','Latest snapshot'],rows.map(r=>`<tr><td><b>${esc(r.title)}</b><div class="sub">${esc(r.platform)}${r.platform==='YouTube Long Format' ? ' · '+(r.contentCategory==='weeklyRecap'?'Weekly recap':'Standalone long-form') : ''}</div></td><td>${esc(r.date||'—')}</td><td>${analyticsNumber(r[metric],metric)+(metric==='engagement'?' actions':metric==='followers'?' followers':'')}</td><td>${esc(r.snapshotDate||'—')}<div class="sub">${esc(r.checkpoint==='24h'?'24 hours':r.checkpoint==='lifetime'?'Lifetime':r.checkpoint?r.checkpoint+' days':'')}</div></td></tr>`));
}
function updateLibrarySelects(){
 const options=(items,empty)=>`<option value="">${empty}</option>`+items.map(x=>`<option value="${esc(x.id)}">${esc(x.title)}</option>`).join('');
 const m=document.getElementById('pMusic'),a=document.getElementById('pAsset'),mv=document.getElementById('mVideoId'),ua=document.getElementById('uAssets');const fsSelect=document.getElementById('pFieldSession'),phFs=document.getElementById('phFieldSession');[fsSelect,phFs].forEach(el=>{if(!el)return;const prior=el.value;el.innerHTML='<option value="">No field session linked</option>'+db.fieldSessions.map(x=>`<option value="${esc(x.id)}">${esc(x.name)} · ${esc(x.date||'No date')}</option>`).join('');if([...el.options].some(o=>o.value===prior))el.value=prior;});
 const oldM=m.value,oldA=a.value,oldV=mv.value,oldUA=[...ua.selectedOptions].map(o=>o.value);
 m.innerHTML='<option value="">No music selected</option>'+db.music.map(x=>`<option value="${esc(x.id)}">${esc(x.title)}${String(x.type||'').trim().toLowerCase()==='original composition'?' (C)':''}</option>`).join('');a.innerHTML=options(db.assets,'No footage selected');mv.innerHTML=options(db.uploads,'No video linked');const ps=document.getElementById('pSeries');if(ps){const prior=ps.value;ps.innerHTML='<option value="">No series</option>'+db.series.map(x=>`<option value="${esc(x.id)}" ${x.status==='archived'?'disabled':''}>${esc(x.name)}${x.status==='archived'?' (Archived)':''}</option>`).join('');if([...ps.options].some(o=>o.value===prior))ps.value=prior;}
 ua.innerHTML=db.assets.map(x=>`<option value="${esc(x.id)}">${esc(x.title)}${x.recordedDate?' — '+esc(x.recordedDate):''}</option>`).join('');
 if([...m.options].some(o=>o.value===oldM))m.value=oldM;if([...a.options].some(o=>o.value===oldA))a.value=oldA;if([...mv.options].some(o=>o.value===oldV))mv.value=oldV;
 [...ua.options].forEach(o=>o.selected=oldUA.includes(o.value));
}
function renderPlanChooser(){
 const chooser=document.getElementById('planChooser');if(!chooser)return;
 const type=val('plannerContentType')||'video',prior=chooser.value;
 const unpublishedGroup=document.getElementById('unpublishedPlanOptions'),publishedGroup=document.getElementById('publishedPlanOptions');
 const items=db.plans.filter(p=>type==='photo'?p.contentType==='photo':p.contentType!=='photo').slice();
 const isPublished=p=>p.status==='Published'||p.status==='Entries created';
 const byTitle=(a,b)=>String(a.title||'Untitled plan').localeCompare(String(b.title||'Untitled plan'),undefined,{sensitivity:'base',numeric:true});
 const unpublished=items.filter(p=>!isPublished(p)).sort(byTitle),published=items.filter(isPublished).sort(byTitle);
 unpublishedGroup.innerHTML=unpublished.map(p=>`<option value="${esc(p.id)}">${esc(p.title||'Untitled plan')}</option>`).join('');
 publishedGroup.innerHTML=published.map(p=>`<option value="${esc(p.id)}">(P) ${esc(p.title||'Untitled plan')}</option>`).join('');
 chooser.value=(prior==='__new__'||items.some(p=>p.id===prior))?prior:'';
 document.getElementById('plannerVideoEditor').hidden=type!=='video';document.getElementById('plannerVideoTable').hidden=type!=='video';
 document.getElementById('plannerPhotoEditor').hidden=type!=='photo';document.getElementById('plannerPhotoTable').hidden=type!=='photo';
 if(type==='photo')renderPhotoPicker();
}
function renderPlans(){
 const stages=['Idea','Planned','In production','Ready to publish','Entries created','Published'];
 document.getElementById('planTable').innerHTML=table(['Project / stage','Planned date','Platforms / format','Creative links','Production notes','Actions'],db.plans.filter(p=>p.contentType!=='photo').slice().sort((a,b)=>(a.plannedDate||'9999').localeCompare(b.plannedDate||'9999')).map(p=>{
  const music=db.music.find(m=>m.id===p.musicId),asset=db.assets.find(a=>a.id===p.assetId),series=db.series.find(x=>x.id===p.seriesId);
  const stageControl=`<select aria-label="Update project stage" onchange="setPlanStatus('${p.id}',this.value)">${stages.map(st=>`<option ${st===p.status?'selected':''}>${st}</option>`).join('')}</select>`;
  const canPublish=!['Entries created','Published'].includes(p.status)&&p.platforms?.length;
  const checklist=[p.shotList,p.editingNotes,p.notes].filter(Boolean).join(' · ');
  return `<tr><td><b>${esc(p.title)}</b><div>${stageControl}</div><div class="sub">${esc(p.genre||'')}</div>${series?`<div class="sub"><span class="series-swatch" style="background:${esc(series.color||'#71866A')}"></span>${esc(series.name)}</div>`:'<div class="sub">No series</div>'}</td><td>${esc(p.plannedDate||'—')}</td><td>${esc((p.platforms||[]).join(', ')||'No platforms')}<div class="sub">${esc(p.aspect||'')}</div></td><td>${esc(music?.title||'No music linked')}<div class="sub">${esc(asset?.title||'No footage linked')}</div><div class="sub">Field session: ${esc(db.fieldSessions.find(fs=>fs.id===p.fieldSessionId)?.name||'—')}</div><div class="sub">${(p.videoIds||[]).length} linked upload(s)</div></td><td>${esc(p.caption||'')}<div class="sub">${esc(p.hashtags||'')} ${esc(checklist)}</div></td><td><button class="secondary" onclick="editPlan('${p.id}')">Edit</button> ${canPublish?`<button class="secondary" onclick="publishPlan('${p.id}')">Create upload records</button>`:''} <button class="secondary danger" onclick="del('plans','${p.id}')">Delete</button></td></tr>`;
 }));
}
function editPlan(id){const p=db.plans.find(x=>x.id===id&&x.contentType!=='photo');if(!p)return;editingPlanId=id;document.getElementById('plannerContentType').value='video';renderPlanChooser();const chooser=document.getElementById('planChooser');if(chooser)chooser.value=id;const fields={pTitle:p.title,pDate:p.plannedDate,pStatus:p.status,pRuntime:p.runtime||'',pGenre:p.genre,pAspect:p.aspect,pSeries:p.seriesId||'',pFieldSession:p.fieldSessionId||'',pMusic:p.musicId,pAsset:p.assetId,pCaption:p.caption,pHashtags:p.hashtags,pShotList:p.shotList,pEditNotes:p.editingNotes,pNotes:p.notes};Object.entries(fields).forEach(([k,v])=>{const el=document.getElementById(k);if(el&&v!==undefined)el.value=v||''});[...document.getElementById('pPlatforms').options].forEach(o=>o.selected=(p.platforms||[]).includes(o.value));document.getElementById('savePlanBtn').textContent='Update project';document.getElementById('resetPlan').textContent='Cancel editing';openTab('planner');document.getElementById('pTitle').focus();}

function setPlanStatus(id,status){const p=db.plans.find(x=>x.id===id);if(!p)return;if(status==='Published'&&rejectFuturePublishedDate(p.plannedDate,'project')){renderPlans();return;}p.status=status;save();}
function publishPlan(id){
 const p=db.plans.find(x=>x.id===id);if(!p)return;if(rejectFuturePublishedDate(p.plannedDate,'project'))return;if(p.contentType==='photo'){publishPhotoProject(id);return;}
 if(!p.platforms?.length){alert('Select at least one target platform before creating video entries.');return}
 if(!confirm('Create one video-tracking entry for each selected platform? This will not publish anything online.'))return;
 const videoIds=[];
 p.platforms.forEach(platform=>{let existing=db.uploads.find(v=>v.planId===p.id&&v.platform===platform);if(existing){videoIds.push(existing.id);return}const v={id:crypto.randomUUID(),title:p.title,publishDate:today(),genre:p.genre||'Other',url:'',platform,planId:p.id,musicId:p.musicId||'',assetId:p.assetId||''};db.uploads.push(v);videoIds.push(v.id)});
 p.videoIds=videoIds;p.status='Entries created';save();alert('Video-tracking entries created with today as the publication date. The app did not publish online. Add metric snapshots when available.');
}
function renderProjectTools(){
 const options='<option value="">Select a project</option>'+db.plans.map(p=>`<option value="${esc(p.id)}">${p.contentType==='photo'?'[Photo]':'[Video]'} ${esc(p.title)}</option>`).join('');
 ['checklistProject','builderProject'].forEach(id=>{const el=document.getElementById(id);if(!el)return;const prior=el.value;el.innerHTML=options;if(db.plans.some(p=>p.id===prior))el.value=prior;});
 const d=db.brandDefaults||{};
 [['brandName','brandName'],['brandTagline','tagline'],['brandCredit','musicCredit'],['brandCopyright','copyright'],['brandHashtags','hashtags'],['brandTikTokHashtags','tiktokHashtags']].forEach(([id,key])=>{const el=document.getElementById(id);if(el&&document.activeElement!==el)el.value=d[key]||''});
 renderProjectChecklist();renderUploadBuilder();
}
function renderProjectChecklist(){
 const id=document.getElementById('checklistProject')?.value, p=db.plans.find(x=>x.id===id), host=document.getElementById('projectChecklist');
 if(!p){host.innerHTML='<div class="empty">Select a project to view its checklist.</div>';return}
 const defaults=p.contentType==='photo'?PHOTO_PREPUBLISH_ITEMS:PREPUBLISH_ITEMS;const items=Array.isArray(p.prePublishChecklist)?p.prePublishChecklist:defaults.map(label=>({label,done:false}));
 host.innerHTML=items.map((item,i)=>`<label class="check-item"><input type="checkbox" data-check-index="${i}" ${item.done?'checked':''}><span>${esc(item.label)}</span></label>`).join('');
}
function saveProjectChecklist(){
 const id=document.getElementById('checklistProject').value,p=db.plans.find(x=>x.id===id);if(!p){alert('Select a project first.');return}
 const defaults=p.contentType==='photo'?PHOTO_PREPUBLISH_ITEMS:PREPUBLISH_ITEMS;const prior=Array.isArray(p.prePublishChecklist)?p.prePublishChecklist:defaults.map(label=>({label,done:false}));
 p.prePublishChecklist=prior.map((item,i)=>({...item,done:!!document.querySelector(`[data-check-index="${i}"]`)?.checked}));
 save();document.getElementById('checklistProject').value=id;renderProjectChecklist();
}
function saveBrandDefaults(){
 db.brandDefaults={brandName:val('brandName').trim()||'Prairie Preludes',tagline:val('brandTagline').trim()||'A quieter kind of beautiful.',musicCredit:val('brandCredit').trim(),copyright:val('brandCopyright').trim(),hashtags:val('brandHashtags').trim(),tiktokHashtags:val('brandTikTokHashtags').trim()};
 save();document.getElementById('brandSaveMsg').textContent='Brand defaults saved on this device.';
}
function platformCopy(p,platform,extra){
 const d=db.brandDefaults||{}, music=p.contentType==='photo'?null:db.music.find(m=>m.id===p.musicId);
 const scene=[p.genre,extra].filter(Boolean).join(' · ');
 const title=p.title||'Prairie Preludes';
 const signature='A quieter kind of beautiful.';
 const tagline=(d.tagline||signature).trim();
 const isPhoto=p.contentType==='photo'; const description=[p.caption||'',scene?`Scene: ${scene}`:'',signature,tagline.toLowerCase()===signature.toLowerCase()?'':tagline,music?`Music: ${music.title}`:'',isPhoto?'':(d.musicCredit||''),d.copyright||''].filter(Boolean).join('\n\n');
 const tags=[p.hashtags||'',d.hashtags||'',...(platform==='TikTok'?[d.tiktokHashtags||'']:[])].filter(Boolean).join(' ').replace(/\s+/g,' ').trim();
 if(platform==='YouTube')return `${title}\n\n${description}\n\n${tags}`;
 if(platform==='Instagram')return `${description}\n\n${tags}`;
 return `${title}\n\n${description}\n\n${tags}`;
}
function renderUploadBuilder(){
 const id=document.getElementById('builderProject')?.value,p=db.plans.find(x=>x.id===id),host=document.getElementById('uploadBuilderOutput');
 const extraField=document.getElementById('builderExtra')?.closest('.field');if(extraField)extraField.hidden=!!p&&p.contentType==='photo';
 if(!p){host.innerHTML='<div class="empty">Select a saved project to generate upload copy.</div>';return}
 const extra=p.contentType==='photo'?'':(val('builderExtra')||'');
 const attached=p.contentType==='photo'?(p.photoIds||[]).map(pid=>db.photos.find(ph=>ph.id===pid)).filter(Boolean):[];
 const previews=attached.length?`<div class="card"><b>Project photos (${attached.length})</b><div class="row" style="flex-wrap:wrap">${attached.map(ph=>ph.imageData?`<img class="photo-thumb" style="width:120px;height:90px" src="${ph.imageData}" alt="${esc(ph.title)}">`:`<span>${esc(ph.title)}</span>`).join('')}</div></div>`:'';
 host.innerHTML=previews+['Instagram','YouTube','TikTok'].map(platform=>`<div class="copy-panel"><h4>${platform}</h4><textarea id="copy-${platform.toLowerCase()}" readonly>${esc(platformCopy(p,platform,extra))}</textarea><div class="actions"><button class="secondary" type="button" onclick="copyUploadText('${platform.toLowerCase()}')">Copy ${platform} copy</button></div></div>`).join('')+(p.contentType==='photo'?`<div class="notice">After you publish this project manually, record the photo/platform usage here. Duplicate photo/platform combinations require an explicit confirmation.</div><div class="actions"><button class="primary" type="button" onclick="publishPhotoProject('${p.id}')">Record published photo usage</button></div>`:'');
}
async function copyUploadText(platform){
 const el=document.getElementById('copy-'+platform);if(!el)return;
 try{await navigator.clipboard.writeText(el.value);alert(platform.charAt(0).toUpperCase()+platform.slice(1)+' upload copy copied.')}
 catch(e){el.focus();el.select();try{document.execCommand('copy');alert('Upload copy copied.')}catch(err){alert('Select the text and copy it manually.')}}
}
function renderAssets(){
 const usage=a=>db.uploads.filter(v=>(v.assetIds||[]).includes(a.id));
 document.getElementById('assetTable').innerHTML=table(['Asset / recorded','Capture details','Length / filter','Usage','Original file location','Notes','Actions'],db.assets.slice().reverse().map(a=>{const uses=usage(a);const dates=uses.map(v=>v.publishDate).filter(Boolean).sort();const last=dates[dates.length-1];const first=dates[0];const edits=new Set(uses.map(v=>`${v.title}|${v.publishDate}`)).size;return `<tr><td><b>${esc(a.title)}</b><div class="sub">${esc(a.recordedDate||'—')} · ID ${esc(a.id.slice(0,8))}</div></td><td>${esc(a.camera||'—')}<div class="sub">Setup: ${esc(a.filmingSetup||'—')} · Speed: ${esc(a.recordingSpeed==='time-lapse'?'Time-lapse':(a.recordingSpeed||'1')+'×')}</div><div class="sub">${esc(a.format||'')} · ${esc(a.weather||'')}</div><div class="sub">${esc(a.location||'')}</div></td><td>${esc(a.videoLength||'—')}<div class="sub">Filter: ${esc(a.videoFilter||'—')}</div></td><td><b>${edits}</b> unique ${edits===1?'video edit':'video edits'}<div class="sub">${uses.length} platform ${uses.length===1?'entry':'entries'}</div><div class="sub">First: ${esc(first||'—')} · Last: ${esc(last||'—')}</div>${uses.length?`<details><summary>View uploads (${uses.length})</summary>${uses.map(v=>`<div class="sub">${esc(v.title)} · ${esc(v.platform)} · ${esc(v.publishDate||'—')}${v.url?` · <a href="${esc(v.url)}" target="_blank" rel="noopener">Open</a>`:''}</div>`).join('')}</details>`:'<div class="sub">Not used yet</div>'}</td><td>${esc(a.fileLocation||'—')}</td><td>${esc(a.notes||'')}</td><td><button class="secondary" onclick="editAsset('${a.id}')">Edit</button> <button class="secondary danger" onclick="del('assets','${a.id}')">Delete</button></td></tr>`}))
}
function renderCopies(){document.getElementById('copyTable').innerHTML=table(['Found','Work / platform','Status','Suspected URL & notes',''],db.copies.slice().reverse().map(c=>{let m=db.music.find(x=>x.id===c.workId);return `<tr><td>${esc(c.date)}</td><td>${esc(m?.title||'Unlinked work')}<br>${esc(c.platform)}</td><td>${esc(c.status)}</td><td><a href="${esc(c.url)}" target="_blank" rel="noopener">Open suspected copy</a><div class="sub">${esc(c.evidence)} ${esc(c.action)}</div></td><td><button class="secondary danger" onclick="del('copies','${c.id}')">Delete</button></td></tr>`}))}
function renderReviews(){document.getElementById('reviewTable').innerHTML=table(['Quarter','What worked','Learnings','Next steps',''],db.reviews.slice().reverse().map(r=>`<tr><td><b>${esc(r.quarter)} ${esc(r.year)}</b><div class="sub">${esc(r.saved)}</div></td><td>${esc(r.wins)}</td><td>${esc(r.learn)}</td><td>${esc(r.next)}<div class="sub">${esc(r.notes)}</div></td><td><button class="secondary danger" onclick="del('reviews','${r.id}')">Delete</button></td></tr>`))}
function renderChart(el,items){const valid=items.filter(x=>x.value!==null&&x.value!==undefined&&Number.isFinite(Number(x.value)));let max=Math.max(1,...valid.map(x=>Number(x.value)));el.innerHTML=items.length?items.map(x=>`<div class="barrow"><span>${esc(x.label)}</span><div class="bar"><i style="width:${x.value===null||x.value===undefined?0:Math.max(0,Number(x.value))/max*100}%"></i></div><b>${x.value===null||x.value===undefined?'N/A':fmt(x.value)}</b></div>`).join(''):'<div class="empty">Add snapshots to see analytics.</div>'}
function renderMonthly(){
 const month=val('monthSelect'), platform=val('monthPlatform'), windowChoice=val('monthWindow');
 const list=db.snapshots.filter(s=>{
  const v=db.uploads.find(x=>x.id===s.videoId);
  return v && (s.snapshotDate||'').slice(0,7)===month && (!platform||v.platform===platform) && (windowChoice==='all'||s.window===windowChoice);
 });
 const sum=k=>metricSum(list,k);
 document.getElementById('monthCount').textContent=fmt(list.length);
 document.getElementById('monthViews').textContent=analyticsNumber(sum('views'),'views');
 document.getElementById('monthLikes').textContent=analyticsNumber(sum('likes'),'likes');
 document.getElementById('monthComments').textContent=analyticsNumber(sum('comments'),'comments');
 const platforms=['YouTube Shorts','YouTube Long Format','Instagram','Facebook','TikTok'];
 const byPlatform=platforms.map(p=>{const vals=list.filter(s=>db.uploads.find(v=>v.id===s.videoId)?.platform===p).map(s=>snapshotMetric(s,'views')).filter(x=>x!==null);return {label:p,value:vals.length?vals.reduce((a,b)=>a+b,0):null};});
 const genres=[...new Set(list.map(s=>db.uploads.find(v=>v.id===s.videoId)?.genre||'Other'))].map(g=>{const vals=list.filter(s=>(db.uploads.find(v=>v.id===s.videoId)?.genre||'Other')===g).map(s=>snapshotMetric(s,'views')).filter(x=>x!==null);return {label:g,value:vals.length?vals.reduce((a,b)=>a+b,0):null};});
 renderChart(document.getElementById('monthPlatformChart'),byPlatform);
 renderChart(document.getElementById('monthGenreChart'),genres);
 renderChart(document.getElementById('monthEngagementChart'),platforms.map(p=>{const vals=list.filter(s=>db.uploads.find(v=>v.id===s.videoId)?.platform===p).map(engagementValue).filter(x=>x!==null);return {label:p,value:vals.length?vals.reduce((a,b)=>a+b,0):null};}));
 renderChart(document.getElementById('monthWindowChart'),['24h','7','30','90','lifetime'].map(w=>({label:w==='24h'?'24 hours':w==='lifetime'?'Lifetime':w+' days',value:list.filter(s=>s.window===w).length})));
 document.getElementById('monthSnapshotTable').innerHTML=table(['Date','Video / platform','Genre','Window','Treatment','Views','Likes','Comments','Shares','Saves','Avg watch','Avg viewed','Completion','Followers'],list.slice().sort((a,b)=>(b.snapshotDate||'').localeCompare(a.snapshotDate||'')).map(s=>{let v=db.uploads.find(x=>x.id===s.videoId)||{},d=k=>snapshotMetric(s,k)===null?'N/A':analyticsNumber(snapshotMetric(s,k),k);return `<tr><td>${esc(s.snapshotDate)}</td><td><b>${esc(v.title||'Deleted video')}</b><div class="sub">${esc(v.platform||'')}</div></td><td>${esc(v.genre||'')}</td><td>${esc(s.window==='24h'?'24 hours':s.window==='lifetime'?'Lifetime':s.window+' days')}</td><td>${esc(s.creativeTreatment==='cleanVisual'?'Clean Visual':s.creativeTreatment==='quoteOverlay'?'Quote Overlay':'Not classified')}</td><td>${d('views')}</td><td>${d('likes')}</td><td>${d('comments')}</td><td>${d('shares')}</td><td>${d('saves')}</td><td>${d('avgWatchSeconds')}</td><td>${d('avgPercentViewed')}</td><td>${d('completionRate')}</td><td>${d('followers')}</td></tr>`}));
 const groups={};
 list.forEach(s=>{let v=db.uploads.find(x=>x.id===s.videoId)||{},key=s.videoId+'|'+s.window;groups[key]??={title:v.title||'Deleted video',platform:v.platform||'',genre:v.genre||'',window:s.window,views:0,likes:0,comments:0,shares:0,viewsN:0,likesN:0,commentsN:0,sharesN:0,count:0};['views','likes','comments','shares'].forEach(k=>{const x=snapshotMetric(s,k);if(x!==null){groups[key][k]+=x;groups[key][k+'N']++;}});groups[key].count++});
 document.getElementById('monthVideoTable').innerHTML=table(['Video','Platform','Window','Snapshots','Views','Likes','Comments','Shares'],Object.values(groups).sort((a,b)=>b.views-a.views).map(g=>`<tr><td><b>${esc(g.title)}</b><div class="sub">${esc(g.genre)}</div></td><td>${esc(g.platform)}</td><td>${esc(g.window==='24h'?'24 hours':g.window==='lifetime'?'Lifetime':g.window+' days')}</td><td>${fmt(g.count)}</td><td>${g.viewsN?fmt(g.views):'N/A'}</td><td>${g.likesN?fmt(g.likes):'N/A'}</td><td>${g.commentsN?fmt(g.comments):'N/A'}</td><td>${g.sharesN?fmt(g.shares):'N/A'}</td></tr>`));
}

function renderCrossPlatform(){
 const platforms=['YouTube Shorts','YouTube Long Format','Instagram','Facebook','TikTok'];
 const windowChoice=val('compareWindow'), metric=val('compareMetric');
 const norm=x=>String(x||'').trim().toLocaleLowerCase().replace(/\s+/g,' ');
 const groups={};
 db.uploads.forEach(v=>{
  const key=norm(v.title)+'|'+String(v.publishDate||'');
  if(!v.title) return;
  groups[key]??={title:v.title,publishDate:v.publishDate||'',genre:v.genre||'Other',entries:{}};
  groups[key].entries[v.platform]=v;
 });
 const getLatest=(videoId)=>{
  const snapshots=db.snapshots.filter(x=>x.videoId===videoId&&x.window===windowChoice)
   .sort((a,b)=>String(b.snapshotDate||'').localeCompare(String(a.snapshotDate||'')));
  return snapshots[0]||null;
 };
 const rows=Object.values(groups).map(g=>{
  const data={};
  platforms.forEach(p=>{const v=g.entries[p];data[p]=v?getLatest(v.id):null;});
  const available=platforms.filter(p=>data[p]);
  return {...g,data,available};
 }).filter(g=>g.available.length>0).sort((a,b)=>a.title.localeCompare(b.title));
 const metricValue=s=>!s?null:metric==='engagement'?engagementValue(s):metric==='followersGained'?snapshotMetric(s,'followers'):snapshotMetric(s,metric);
 const totals=platforms.map(p=>{const values=rows.map(g=>metricValue(g.data[p])).filter(x=>x!==null);return {label:p,value:values.length?values.reduce((a,b)=>a+b,0):null};});
 const totalSnapshots=rows.reduce((n,g)=>n+g.available.length,0);
 const matched=rows.filter(g=>g.available.length>=2).length;
 const leader=totals.filter(x=>x.value!==null).slice().sort((a,b)=>b.value-a.value)[0];
 document.getElementById('compareMatched').textContent=fmt(matched);
 document.getElementById('compareEntries').textContent=fmt(rows.reduce((n,g)=>n+platforms.filter(p=>g.entries[p]).length,0));
 document.getElementById('compareLeader').textContent=leader&&leader.value>0?leader.label:'—';
 document.getElementById('compareSnapshots').textContent=fmt(totalSnapshots);
 renderChart(document.getElementById('compareChart'),totals);
 const metricLabel=metric==='engagement'?'Engagement':metric==='avgWatchSeconds'?'Average watch seconds':metric==='followersGained'?'Followers gained':'Views';
 document.getElementById('compareTable').innerHTML=table(['Video / publish date','Genre',...platforms.map(p=>p+' '+metricLabel)],rows.map(g=>{
  const cells=platforms.map(p=>`<td>${g.data[p]?(metricValue(g.data[p])===null?'N/A':fmt(metricValue(g.data[p])))+'<div class="sub">Snapshot: '+esc(g.data[p].snapshotDate||'date n/a')+'</div>': '—'}</td>`).join('');
  return `<tr><td><b>${esc(g.title)}</b><div class="sub">${esc(g.publishDate||'No publish date')} · ${g.available.length} platform${g.available.length===1?'':'s'} with data</div></td><td>${esc(g.genre)}</td>${cells}</tr>`;
 }));
}

function renderFootageUsage(){
 const norm=x=>String(x||'').trim().toLocaleLowerCase().replace(/\s+/g,' ');
 const linked=a=>db.uploads.filter(v=>(v.assetIds||[]).includes(a.id));
 const uniqueEdits=vs=>new Set(vs.map(v=>norm(v.title)+'|'+String(v.publishDate||''))).size;
 const all=db.assets.map(a=>{const uses=linked(a),dates=uses.map(v=>v.publishDate).filter(Boolean).sort();return {asset:a,uses,edits:uniqueEdits(uses),first:dates[0]||'',last:dates[dates.length-1]||''};});
 document.getElementById('fuTotal').textContent=fmt(all.length);
 document.getElementById('fuReused').textContent=fmt(all.filter(x=>x.edits>1).length);
 document.getElementById('fuEdits').textContent=fmt(new Set(db.uploads.filter(v=>(v.assetIds||[]).length).map(v=>norm(v.title)+'|'+String(v.publishDate||''))).size);
 document.getElementById('fuEntries').textContent=fmt(db.uploads.filter(v=>(v.assetIds||[]).length).length);
 const q=norm(document.getElementById('fuSearch')?.value),f=document.getElementById('fuFilter')?.value||'all',sort=document.getElementById('fuSort')?.value||'usage';
 let rows=all.filter(x=>{const a=x.asset,hay=norm([a.title,a.location,a.notes,a.weather].join(' '));return (!q||hay.includes(q))&&(f==='all'||(f==='used'&&x.edits>0)||(f==='reused'&&x.edits>1)||(f==='unused'&&x.edits===0));});
 rows.sort((a,b)=>sort==='title'?a.asset.title.localeCompare(b.asset.title):sort==='recent'?b.last.localeCompare(a.last):sort==='oldest'?(a.last||'9999').localeCompare(b.last||'9999'):b.edits-a.edits||b.uses.length-a.uses.length);
 document.getElementById('footageUsageTable').innerHTML=table(['Footage asset','Unique edits','Platform entries','First used','Last used','Associated uploads'],rows.map(x=>{const history=x.uses.slice().sort((a,b)=>String(b.publishDate||'').localeCompare(String(a.publishDate||''))).map(v=>`<div class="sub">${esc(v.title||'Untitled video')} · ${esc(v.platform||'Platform n/a')} · ${esc(v.publishDate||'Date n/a')}${v.url?' · <a href="'+esc(v.url)+'" target="_blank" rel="noopener">Open</a>':''}</div>`).join('')||'<span class="sub">Not used yet</span>';return `<tr><td><b>${esc(x.asset.title||'Untitled asset')}</b><div class="sub">${esc(x.asset.location||'')}</div></td><td>${fmt(x.edits)}</td><td>${fmt(x.uses.length)}</td><td>${esc(x.first||'—')}</td><td>${esc(x.last||'—')}</td><td>${history}</td></tr>`;}));
}
['fuSearch','fuFilter','fuSort'].forEach(id=>{const el=document.getElementById(id);if(el)el.addEventListener(id==='fuSearch'?'input':'change',renderFootageUsage)});


let calendarMonth=new Date(new Date().getFullYear(),new Date().getMonth(),1);
let calendarSelectedDate=localDateString(new Date());
function localDateString(d){return denverDateString(d);}
function isFuturePublishDate(date){return !!date&&date>localDateString(new Date());}
function rejectFuturePublishedDate(date,kind='project'){if(isFuturePublishDate(date)){alert(`A ${kind} cannot be marked as published on a future date. Choose today or an earlier date, or keep it in a pre-publication stage.`);return true;}return false;}
function preparednessWeight(status){return status==='Ready to publish'?2:1;}
function renderCalendarPreparedness(){const host=document.getElementById('calendarPreparedness');if(!host)return;const start=new Date();start.setHours(12,0,0,0);const days=[];let points=0;for(let i=0;i<14;i++){const d=new Date(start);d.setDate(start.getDate()+i);const date=localDateString(d);const projects=db.plans.filter(x=>x.plannedDate===date&&x.status!=='Published').map(x=>x.status||'Idea');const recaps=db.weeklyRecaps.filter(x=>x.publishDate===date&&x.status!=='Published').map(x=>x.status==='Ready to publish'?'Ready to publish':(x.status==='Assembling'?'In production':'Planning'));const stages=[...projects,...recaps];const dayScore=stages.length?Math.min(...stages.map(preparednessWeight)):0;points+=dayScore;days.push({date,dayScore});}const percent=Math.round(points/28*100);const color=percent<50?'#D65B58':percent<75?'#D88932':percent<90?'#D6B943':'#4F906D';const label=percent<50?'Needs attention':percent<75?'Building readiness':percent<90?'Nearly ready':'Well prepared';host.innerHTML=`<div class="calendar-preparedness-head"><div><div class="calendar-preparedness-title">Two-week preparedness</div><div class="calendar-preparedness-note">A rolling 14-day view of upcoming content readiness</div></div><div class="calendar-preparedness-percent" style="color:${color}">${percent}%</div></div><div class="calendar-preparedness-track" role="progressbar" aria-label="Two-week preparedness" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${percent}"><div class="calendar-preparedness-fill" style="width:${percent}%;background:${color}"></div></div><div class="calendar-preparedness-note">${label}</div>`;}
function plansOnDate(date){return db.plans.filter(p=>p.plannedDate===date).sort((a,b)=>String(a.title||'').localeCompare(String(b.title||'')));}
function calendarStatusClass(status){
 if(status==='In production'||status==='Assembling')return 'production';
 if(status==='Ready to publish')return 'ready';
 if(status==='Published'||status==='Entries created')return 'published';
 return 'idea';
}
function hexTint(hex,alpha=0.14){const h=String(hex||'#71866A').replace('#','');if(!/^[0-9a-f]{6}$/i.test(h))return 'rgba(120,134,107,.14)';const n=parseInt(h,16),r=(n>>16)&255,g=(n>>8)&255,b=n&255;return `rgba(${r},${g},${b},${alpha})`;}
function seriesReleaseMap(){const map=new Map(),t=localToday(),gridEnd=dateStr(addDays(new Date(calendarMonth.getFullYear(),calendarMonth.getMonth(),1),41));db.series.forEach(series=>getSeriesReleaseDates(series,gridEnd).forEach(date=>{if(!map.has(date))map.set(date,[]);map.get(date).push({series,overdue:date<t&&!db.plans.some(p=>p.plannedDate===date&&p.seriesId===series.id)})}));return map;}
function calendarMarkup(compact=false){
 const y=calendarMonth.getFullYear(),m=calendarMonth.getMonth(),first=new Date(y,m,1),start=new Date(y,m,1-first.getDay()),weekdays=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],releaseMap=seriesReleaseMap();
 let out='<div class="calendar-grid">'+weekdays.map(w=>`<div class="calendar-weekday">${w}</div>`).join('');
 for(let i=0;i<42;i++){const d=new Date(start);d.setDate(start.getDate()+i);const date=localDateString(d),items=plansOnDate(date),outside=d.getMonth()!==m,rels=releaseMap.get(date)||[],visibleRels=rels.filter(r=>r.series.status!=='archived'),tintRels=visibleRels.length?visibleRels:rels,activeRel=tintRels[0],overdue=rels.some(r=>r.overdue),seriesBackground=tintRels.length>1?`linear-gradient(135deg, ${tintRels.map((r,i)=>`${hexTint(r.series.color||'#71866A')} ${i/tintRels.length*100}% ${(i+1)/tintRels.length*100}%`).join(', ')})`:activeRel?hexTint(activeRel.series.color||'#71866A'):'',style=activeRel?`--series-color:${esc(activeRel.series.color||'#71866A')};--series-tint:${seriesBackground}`:'';
 const classes=['calendar-day',outside?'outside':'',date===localDateString(new Date())?'today':'',date===calendarSelectedDate?'selected':'',activeRel?'series-day':'',overdue?'overdue':''].filter(Boolean).join(' ');
 const dots=items.slice(0,compact?3:8).map(p=>{const ser=db.series.find(x=>x.id===p.seriesId),seriesColor=ser?(ser.color||'#71866A'):'#A49B8D',shape=p.contentType==='photo'?'photo-dot':'',stage=calendarStatusClass(p.status);return `<span class="calendar-dot split-dot ${shape} ${stage}" style="--series-color:${esc(seriesColor)}" title="${esc((p.contentType==='photo'?'Photo: ':'Video: ')+(p.title||'Untitled')+' · '+(ser?.name||'No series')+' · '+(p.status||'Idea'))}"></span>`}).join('');
 const recaps=db.weeklyRecaps.filter(r=>r.publishDate===date),sessions=db.fieldSessions.filter(x=>x.date===date);const sessionDots=sessions.map(x=>`<span class="calendar-dot session-dot" title="${esc('Field session: '+x.name)}"></span>`).join('');const recapDots=recaps.map(r=>`<span class="calendar-dot recap-dot split-dot ${calendarStatusClass(r.status==='Assembling'?'In production':r.status)}" style="--series-color:#57475F" title="${esc('Weekly recap: '+(r.fullTitle||r.subtitle)+' · '+(r.status||'Planning'))}"></span>`).join('');const itemCount=items.length+recaps.length+sessions.length;
 out+=`<button type="button" class="${classes}" style="${style}" onclick="selectCalendarDate('${date}',${compact?'true':'false'})"><span class="day-number">${d.getDate()}</span>${itemCount?`<span class="calendar-dots">${dots}${recapDots}${sessionDots}</span>`:''}</button>`;
 }return out+'</div>';
}
function renderCalendarDetail(){
 const hosts=[document.getElementById('calendarDetail'),document.getElementById('plannerCalendarDetail')].filter(Boolean);if(!hosts.length)return;
 const items=plansOnDate(calendarSelectedDate),recaps=db.weeklyRecaps.filter(r=>r.publishDate===calendarSelectedDate),sessions=db.fieldSessions.filter(x=>x.date===calendarSelectedDate),series=[...(seriesReleaseMap().get(calendarSelectedDate)||[])].filter((entry,i,all)=>all.findIndex(x=>x.series.id===entry.series.id)===i);
 const detail=`<h3>${new Date(calendarSelectedDate+'T12:00:00').toLocaleDateString(undefined,{weekday:'long',month:'long',day:'numeric',year:'numeric'})}</h3>`+
 ((items.length||recaps.length||sessions.length||series.length)?series.map(entry=>`<div class="calendar-detail-item"><div><strong>${esc(entry.series.name)}</strong><div class="sub">Series release${entry.overdue?' · overdue':''} · ${esc(entry.series.status||'Active')}</div></div><button class="secondary" onclick="editSeries('${entry.series.id}')">Open series</button></div>`).join('')+items.map(p=>`<div class="calendar-detail-item"><div><strong>${esc(p.title||'Untitled project')}</strong><div class="sub">${p.contentType==='photo'?'Photo project':'Video project'} · ${esc(p.status||'Idea')} · ${(p.platforms||[]).length} target platform(s)</div></div><button class="secondary" onclick="${p.contentType==='photo'?'editPhotoProject':'editPlan'}('${p.id}')">Open project</button></div>`).join('')+recaps.map(r=>`<div class="calendar-detail-item"><div><strong>◆ ${esc(r.fullTitle||('This Week on the Plains: '+r.subtitle))}</strong><div class="sub">Weekly recap · ${esc(r.status||'Planning')}</div></div><button class="secondary" onclick="editRecap('${r.id}')">Open recap</button></div>`).join('')+sessions.map(x=>`<div class="calendar-detail-item"><div><strong>☼ ${esc(x.name)}</strong><div class="sub">Field session · ${esc(x.status||'Planned')} · ${esc(x.location||'')}</div></div><button class="secondary" onclick="editFieldSession('${x.id}')">Open session</button></div>`).join(''):'<p class="sub">No content is planned for this date. This is an open date you could fill if it fits your schedule.</p>');
 hosts.forEach(host=>host.innerHTML=detail);
}
function renderPublishingCalendar(){
 const y=calendarMonth.getFullYear(),m=calendarMonth.getMonth();
 const monthPlans=db.plans.filter(p=>p.plannedDate&&p.plannedDate.slice(0,7)===`${y}-${String(m+1).padStart(2,'0')}`);
 const monthRecaps=db.weeklyRecaps.filter(r=>r.publishDate&&r.publishDate.slice(0,7)===`${y}-${String(m+1).padStart(2,'0')}`),monthSessions=db.fieldSessions.filter(x=>x.date&&x.date.slice(0,7)===`${y}-${String(m+1).padStart(2,'0')}`);const covered=new Set([...monthPlans.map(p=>p.plannedDate),...monthRecaps.map(r=>r.publishDate),...monthSessions.map(x=>x.date)]).size;
 const totalDays=new Date(y,m+1,0).getDate();
 const planner=document.getElementById('plannerCalendar');
 if(planner)planner.innerHTML=`<div class="calendar-toolbar"><button class="secondary" onclick="changeCalendarMonth(-1)">‹</button><strong>${calendarMonth.toLocaleDateString(undefined,{month:'long',year:'numeric'})}</strong><button class="secondary" onclick="changeCalendarMonth(1)">›</button></div>${calendarMarkup(false)}`;
 const full=document.getElementById('fullCalendar');
 if(full)full.innerHTML=calendarMarkup(false);
 const title=document.getElementById('calendarMonthTitle');if(title)title.textContent=calendarMonth.toLocaleDateString(undefined,{month:'long',year:'numeric'});
 renderCalendarDetail();renderCalendarPreparedness();
 const summary=`<div class="schedule-stat"><strong>${covered}</strong><span class="sub">Days with plans</span></div><div class="schedule-stat"><strong>${totalDays-covered}</strong><span class="sub">Open dates</span></div><div class="schedule-stat"><strong>${monthPlans.length+monthRecaps.length+monthSessions.length}</strong><span class="sub">Planned items &amp; sessions</span></div>`;
 const cc=document.getElementById('ccScheduleSummary');if(cc)cc.innerHTML=summary;
 const next=document.getElementById('ccScheduleNext');if(next){const future=[...db.plans.filter(p=>p.plannedDate>=localDateString(new Date())).map(p=>({date:p.plannedDate,label:(p.contentType==='photo'?'Photo':'Video')+' project',title:p.title})),...db.weeklyRecaps.filter(r=>r.publishDate>=localDateString(new Date())).map(r=>({date:r.publishDate,label:'Weekly recap',title:r.fullTitle||recapFullTitle(r)})),...db.fieldSessions.filter(x=>x.date>=localDateString(new Date())).map(x=>({date:x.date,label:'Field session',title:x.name}))].sort((a,b)=>a.date.localeCompare(b.date));next.textContent=future.length?`Next planned ${future[0].label.toLowerCase()}: ${future[0].date} — ${future[0].title}`:'No upcoming planned content or field sessions yet.';}
}
function selectCalendarDate(date,compact=false){calendarSelectedDate=date;renderPublishingCalendar();}
function changeCalendarMonth(delta){calendarMonth=new Date(calendarMonth.getFullYear(),calendarMonth.getMonth()+delta,1);renderPublishingCalendar();}
function goCalendarToday(){const now=new Date();calendarMonth=new Date(now.getFullYear(),now.getMonth(),1);calendarSelectedDate=localDateString(now);renderPublishingCalendar();}

function snapshotDueItems(){
 const todayStr=localToday(),days=[['24h',1],['7',7],['30',30],['90',90]],items=[];
 db.uploads.forEach(v=>{
  if(!v.publishDate)return;
  const published=dateObj(v.publishDate);if(!published)return;
  days.forEach(([window,n])=>{
   const due=dateStr(addDays(published,n));
   const recorded=db.snapshots.some(s=>s.videoId===v.id&&s.window===window);
   if(!recorded&&due<=todayStr)items.push({video:v,window,due,overdue:due<todayStr});
  });
 });
 return items.sort((a,b)=>a.due.localeCompare(b.due)||a.video.title.localeCompare(b.video.title)||a.window.localeCompare(b.window));
}
function startSnapshotEntry(videoId,window){
 updateVideoSelect();
 const videoSelect=document.getElementById('sVideo'),windowSelect=document.getElementById('sWindow');
 videoSelect.value=videoId;windowSelect.value=window;document.getElementById('sDate').value=today();
 openTab('snapshots');document.getElementById('sViews').focus();
}
function renderSnapshotsDue(){
 const host=document.getElementById('ccSnapshotsDue');if(!host)return;
 const items=snapshotDueItems();
 host.innerHTML=items.length?`<div class="snapshot-due-scroll"><table class="snapshot-due-table"><thead><tr><th>Add snapshot</th><th>Video title</th><th>Platform</th><th>Checkpoint</th><th>Published date</th></tr></thead><tbody>${items.map(x=>`<tr><td><button class="primary" onclick="startSnapshotEntry('${x.video.id}','${x.window}')">Add Snapshot</button></td><td><b>${esc(x.video.title)}</b></td><td>${esc(x.video.platform)}</td><td class="${x.overdue?'snapshot-overdue':''}">${esc(x.window==='24h'?'24 hours':x.window+' days')}${x.overdue?' <span class="snapshot-overdue-label">OVERDUE</span>':''}</td><td>${esc(x.video.publishDate)}</td></tr>`).join('')}</tbody></table></div>`:'<div class="empty">No snapshots due today.</div>';
}
function renderCommandCenter(){
 const active=db.plans.filter(p=>!['Published','Entries created'].includes(p.status));
 const todayStr=localToday(),end=new Date();end.setDate(end.getDate()+14);const endStr=localDateString(end);
 const upcoming=db.plans.filter(p=>p.plannedDate&&p.plannedDate>=todayStr&&p.plannedDate<=endStr&&!['Published','Entries created'].includes(p.status)).sort((a,b)=>a.plannedDate.localeCompare(b.plannedDate));
 const used=new Set(db.uploads.flatMap(v=>v.assetIds||[]));db.uploads.forEach(v=>{if(v.assetId)used.add(v.assetId)});db.plans.forEach(p=>{if(p.assetId&&p.videoIds?.length)used.add(p.assetId)});
 document.getElementById('ccActive').textContent=fmt(active.length);document.getElementById('ccUpcoming').textContent=fmt(upcoming.length);document.getElementById('ccUnused').textContent=fmt(db.assets.filter(a=>!used.has(a.id)).length);document.getElementById('ccPublished').textContent=fmt(db.uploads.length);
 const stages=['Idea','Planned','In production','Ready to publish','Entries created','Published'];document.getElementById('ccPipeline').innerHTML=stages.map(st=>{const n=db.plans.filter(p=>p.status===st).length;return `<div class="row" style="justify-content:space-between;align-items:center"><span>${esc(st)}</span><strong>${fmt(n)}</strong></div>`}).join('');
 document.getElementById('ccNext').innerHTML=upcoming.length?upcoming.slice(0,5).map(p=>`<div class="command-item"><strong>${esc(p.title)}</strong><small>${esc(p.plannedDate)} · ${esc(p.status||'Idea')} · ${(p.platforms||[]).length} platform(s)</small><div><button class="secondary" onclick="${p.contentType==='photo'?'editPhotoProject':'editPlan'}('${p.id}')">Open project</button></div></div>`).join(''):'<div class="empty">No planned deadlines in the next 14 days. Add or schedule a project to see it here.</div>';
 const attention=[];db.plans.filter(p=>!['Published','Entries created'].includes(p.status)).forEach(p=>{if(!(p.assetId||(p.assetIds||[]).length))attention.push({title:p.title,detail:'No footage asset linked',id:p.id});if(!(p.platforms||[]).length)attention.push({title:p.title,detail:'No target platforms selected',id:p.id});if(p.plannedDate&&p.plannedDate<todayStr)attention.push({title:p.title,detail:'Planned date has passed',id:p.id})});
 document.getElementById('ccAttention').innerHTML=attention.length?attention.slice(0,8).map(a=>`<div class="command-item"><strong>${esc(a.title)}</strong><small>${esc(a.detail)}</small><div><button class="secondary" onclick="editPlan('${a.id}')">Review project</button></div></div>`).join(''):'<div class="notice">No obvious project gaps detected. This check uses the project fields currently recorded in the app.</div>';
 renderSnapshotsDue();renderUpcomingReadiness();const fieldHost=document.getElementById('ccFieldSessions');if(fieldHost){const sessions=db.fieldSessions.filter(x=>x.date&&x.date>=todayStr&&x.date<=endStr&&x.status!=='Archived').sort((a,b)=>a.date.localeCompare(b.date));fieldHost.innerHTML=sessions.length?sessions.slice(0,6).map(x=>`<div class="command-item"><strong>☼ ${esc(x.name)}</strong><small>${esc(x.date)} ${esc(x.time||'')} · ${esc(x.location||'')} · ${esc(x.status||'Planned')}</small><div><button class="secondary" onclick="editFieldSession('${x.id}')">Open session</button></div></div>`).join(''):'<div class="empty">No field sessions scheduled in the next 14 days.</div>';}const recapHost=document.getElementById('ccRecapReadiness');if(recapHost){const upcomingRecaps=db.weeklyRecaps.filter(r=>r.status!=='Published').sort((a,b)=>String(a.publishDate||'9999').localeCompare(String(b.publishDate||'9999')));recapHost.innerHTML=upcomingRecaps.length?upcomingRecaps.slice(0,6).map(r=>`<div class="command-item"><strong>◆ ${esc(r.fullTitle||recapFullTitle(r))}</strong><small>${esc(r.publishDate||'Unscheduled')} · ${esc(r.status||'Planning')} · ${(r.projectIds||[]).length} included projects</small><div><button class="secondary" onclick="editRecap('${r.id}')">Open recap</button></div></div>`).join(''):'<div class="empty">No weekly recaps planned yet.</div>';}renderSeriesCommandCenter();
}

const PHOTO_PREPUBLISH_ITEMS=[
 'Confirm selected photograph(s) and crop / orientation',
 'Review project caption and unique hashtags',
 'Confirm target platforms and platform-specific formatting',
 'Verify original photo and copyright record are saved',
 'Check image quality, accessibility text, and cover presentation',
 'Confirm publishing date and final post details'
];
let pendingPhotoImage='';
function photoImageFromFile(file){
 return new Promise((resolve,reject)=>{
  const reader=new FileReader();
  reader.onerror=()=>reject(new Error('Could not read that image.'));
  reader.onload=()=>{
   const img=new Image();
   img.onerror=()=>reject(new Error('That image could not be opened.'));
   img.onload=()=>{
    const max=1400,scale=Math.min(1,max/Math.max(img.width,img.height));
    const canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(img.width*scale));canvas.height=Math.max(1,Math.round(img.height*scale));
    const ctx=canvas.getContext('2d');ctx.drawImage(img,0,0,canvas.width,canvas.height);
    resolve(canvas.toDataURL('image/jpeg',0.76));
   };
   img.src=reader.result;
  };
  reader.readAsDataURL(file);
 });
}
document.getElementById('phImage').addEventListener('change',async e=>{
 const file=e.target.files?.[0];if(!file)return;
 try{pendingPhotoImage=await photoImageFromFile(file);document.getElementById('photoImagePreview').innerHTML=`<img class="photo-thumb" style="width:180px;height:130px" src="${pendingPhotoImage}" alt="Selected photo preview">`;}
 catch(err){alert(err.message);e.target.value='';}
});
function resetPhotoForm(){
 document.getElementById('photoForm').reset();document.getElementById('photoEditId').value='';pendingPhotoImage='';
 document.getElementById('phCreator').value='Prairie Preludes';document.getElementById('phDate').value=today();
 document.getElementById('photoImagePreview').innerHTML='';document.getElementById('photoSaveBtn').textContent='Save photo record';document.getElementById('photoCancelEdit').hidden=true;
}
document.getElementById('photoForm').addEventListener('submit',e=>{
 e.preventDefault();const id=val('photoEditId'),old=db.photos.find(x=>x.id===id);
 const image=pendingPhotoImage||old?.imageData||'';
 if(!image){alert('Please attach the original photograph.');return;}
 const record={id:old?.id||crypto.randomUUID(),title:val('phTitle').trim(),capturedDate:val('phDate'),category:val('phCategory'),location:val('phLocation').trim(),fieldSessionId:val('phFieldSession')||'',intendedUse:val('phIntendedUse'),creator:val('phCreator').trim(),copyrightStatus:val('phCopyright'),imageData:image,description:val('phDescription'),notes:val('phNotes'),created:old?.created||today(),updated:today()};
 if(old)Object.assign(old,record);else db.photos.push(record);
 save();resetPhotoForm();
});
document.getElementById('photoCancelEdit').addEventListener('click',resetPhotoForm);
function editPhoto(id){
 const p=db.photos.find(x=>x.id===id);if(!p)return;
 document.getElementById('photoEditId').value=p.id;
 const map={phTitle:p.title,phDate:p.capturedDate,phCategory:p.category,phLocation:p.location,phFieldSession:p.fieldSessionId||'',phIntendedUse:p.intendedUse||'General creative library',phCreator:p.creator,phCopyright:p.copyrightStatus,phDescription:p.description,phNotes:p.notes};
 Object.entries(map).forEach(([k,v])=>{const el=document.getElementById(k);if(el)el.value=v||''});
 pendingPhotoImage=p.imageData||'';document.getElementById('photoImagePreview').innerHTML=p.imageData?`<img class="photo-thumb" style="width:180px;height:130px" src="${p.imageData}" alt="${esc(p.title)}">`:'';
 document.getElementById('photoSaveBtn').textContent='Update photo record';document.getElementById('photoCancelEdit').hidden=false;
 document.getElementById('photoForm').scrollIntoView({behavior:'smooth',block:'start'});
}
function photoUsageFor(photoId){return db.photoUsage.filter(u=>u.photoId===photoId);}
let photoProjectSelection=new Set();
function renderPhotoPicker(){
 const picker=document.getElementById('photoProjectPicker');if(!picker)return;
 document.querySelectorAll('[name="ppPhoto"]:checked').forEach(x=>photoProjectSelection.add(x.value));
 const selected=photoProjectSelection;
 const search=(document.getElementById('ppPhotoSearch')?.value||'').trim().toLowerCase();
 const matches=db.photos.filter(ph=>[ph.title,ph.category,ph.location,ph.capturedDate,ph.description].join(' ').toLowerCase().includes(search));
 picker.innerHTML=matches.length?matches.map(ph=>`<label class="check-item"><input type="checkbox" name="ppPhoto" value="${esc(ph.id)}" ${selected.has(ph.id)?'checked':''}><span>${ph.imageData?`<img class="photo-thumb" style="display:inline-block;vertical-align:middle;margin-right:7px" src="${ph.imageData}" alt="">`:''}<b>${esc(ph.title)}</b><span class="sub"> · ${esc(ph.capturedDate||'No capture date')} · ${esc(ph.category||'')}</span></span></label>`).join(''):(db.photos.length?'<span class="empty">No catalog photos match that search.</span>':'<span class="empty">Add photographs to the catalog first.</span>');
 const count=selected.size,summary=document.getElementById('ppPhotoSummary');if(summary)summary.textContent=count?`${count} photo${count===1?'':'s'} selected — click to change`:'Choose catalog photos…';
}
function renderPhotoStudio(){
 const catalog=document.getElementById('photoCatalogTable');if(!catalog)return;
 catalog.innerHTML=table(['Photograph / copyright record','Capture details','Platform usage','Source notes','Actions'],db.photos.slice().sort((a,b)=>String(b.capturedDate||'').localeCompare(String(a.capturedDate||''))).map(ph=>{
  const uses=photoUsageFor(ph.id),unique=[...new Set(uses.map(u=>u.platform))];
  return `<tr><td><div class="row" style="align-items:center;gap:9px">${ph.imageData?`<img class="photo-thumb" src="${ph.imageData}" alt="${esc(ph.title)}">`:''}<div><b>${esc(ph.title)}</b><div class="sub">ID ${esc(ph.id.slice(0,8))} · ${esc(ph.copyrightStatus||'')}</div><div class="sub">${esc(ph.creator||'')}</div></div></div></td><td>${esc(ph.capturedDate||'—')}<div class="sub">${esc(ph.category||'')}</div><div class="sub">${esc(ph.location||'')}<div class="sub">Use: ${esc(ph.intendedUse||'General creative library')}</div><div class="sub">Session: ${esc(db.fieldSessions.find(fs=>fs.id===ph.fieldSessionId)?.name||'—')}</div></div></td><td><b>${uses.length}</b> publication record(s)<div class="sub">${uses.map(u=>`${esc(u.platform)} · ${esc(u.publishDate||'date not recorded')} · ${esc(u.projectTitle||'Photo project')}`).join('<br>')||'Not published'}</div></td><td>${esc(ph.notes||ph.description||'—')}</td><td><button class="secondary" onclick="editPhoto('${ph.id}')">Edit</button> <button class="secondary danger" onclick="deletePhoto('${ph.id}')">Delete</button></td></tr>`;
 }));
 renderPhotoPicker();
 const stages=['Idea','Planned','Ready to publish','Published'];
 document.getElementById('photoProjectTable').innerHTML=table(['Photo project / stage','Planned date','Photos','Platforms','Publishing history','Actions'],db.plans.filter(p=>p.contentType==='photo').sort((a,b)=>(a.plannedDate||'9999').localeCompare(b.plannedDate||'9999')).map(p=>{
  const photos=(p.photoIds||[]).map(id=>db.photos.find(ph=>ph.id===id)).filter(Boolean);
  const uses=db.photoUsage.filter(u=>u.projectId===p.id);
  return `<tr><td><b>${esc(p.title)}</b><div class="sub">${esc(p.status||'Idea')}</div></td><td>${esc(p.plannedDate||'—')}</td><td>${photos.map(ph=>esc(ph.title)).join('<br>')||'No photos selected'}</td><td>${esc((p.platforms||[]).join(', '))}</td><td>${uses.length} platform/photo use(s)<div class="sub">${[...new Set(uses.map(u=>u.platform))].map(esc).join(', ')||'Not published'}</div></td><td><button class="secondary" onclick="editPhotoProject('${p.id}')">Edit</button> <button class="secondary" onclick="publishPhotoProject('${p.id}')">Record publishing</button> <button class="secondary danger" onclick="deletePhotoProject('${p.id}')">Delete</button></td></tr>`;
 }));
}
function deletePhoto(id){
 if(db.plans.some(p=>p.contentType==='photo'&&(p.photoIds||[]).includes(id))){alert('This photograph is attached to a photo project. Remove it from that project before deleting its catalog record.');return;}
 if(!confirm('Delete this photo and its catalog record?'))return;
 db.photos=db.photos.filter(p=>p.id!==id);db.photoUsage=db.photoUsage.filter(u=>u.photoId!==id);save();
}
function resetPhotoProjectForm(){
 const f=document.getElementById('photoProjectForm');f.reset();document.getElementById('photoProjectEditId').value='';photoProjectSelection.clear();
 document.getElementById('ppDate').value=today();document.getElementById('photoProjectSaveBtn').textContent='Save photo project';document.getElementById('ppPhotoSearch').value='';renderPhotoPicker();
 [...document.getElementById('ppPlatforms').options].forEach(o=>o.selected=true);
}
document.getElementById('photoProjectForm').addEventListener('submit',e=>{
 e.preventDefault();const id=val('photoProjectEditId'),old=db.plans.find(p=>p.id===id&&p.contentType==='photo');if(val('ppStage')==='Published'&&rejectFuturePublishedDate(val('ppDate'),'photo project'))return;
 document.querySelectorAll('[name="ppPhoto"]:checked').forEach(x=>photoProjectSelection.add(x.value));const photoIds=[...photoProjectSelection];
 if(!photoIds.length){alert('Select at least one photograph from the catalog.');return;}
 const platforms=[...document.getElementById('ppPlatforms').selectedOptions].map(o=>o.value);
 const conflicts=[];
 db.plans.filter(q=>q.contentType==='photo'&&q.id!==old?.id).forEach(q=>{
  const shared=photoIds.filter(pid=>(q.photoIds||[]).includes(pid));
  const sharedPlatforms=platforms.filter(platform=>(q.platforms||[]).includes(platform));
  shared.forEach(pid=>sharedPlatforms.forEach(platform=>{const ph=db.photos.find(x=>x.id===pid);conflicts.push(`${ph?.title||'Photo'} — ${platform} (project: ${q.title})`)}));
 });
 photoIds.forEach(pid=>platforms.forEach(platform=>{if(db.photoUsage.some(u=>u.photoId===pid&&u.platform===platform&&u.projectId!==old?.id)){const ph=db.photos.find(x=>x.id===pid);conflicts.push(`${ph?.title||'Photo'} — ${platform} (previously published)`);}}));
 if(conflicts.length&&!confirm('Potential duplicate photo/platform scheduling detected:\n\n'+[...new Set(conflicts)].join('\n')+'\n\nSave anyway? Confirm only if this is intentional reuse.'))return;
 const record={...(old||{}),id:old?.id||crypto.randomUUID(),contentType:'photo',title:val('ppTitle').trim(),plannedDate:val('ppDate'),status:val('ppStage'),photoIds,platforms,caption:val('ppCaption'),hashtags:val('ppHashtags'),notes:val('ppNotes'),created:old?.created||today(),updated:today(),videoIds:old?.videoIds||[],prePublishChecklist:Array.isArray(old?.prePublishChecklist)?old.prePublishChecklist:PHOTO_PREPUBLISH_ITEMS.map(label=>({label,done:false}))};
 if(old)Object.assign(old,record);else db.plans.push(record);
 save();resetPhotoProjectForm();document.getElementById('plannerContentType').value='photo';renderPlanChooser();
});
document.getElementById('photoProjectReset').addEventListener('click',resetPhotoProjectForm);
document.getElementById('ppPhotoSearch').addEventListener('input',renderPhotoPicker);
document.getElementById('photoProjectPicker').addEventListener('change',e=>{const input=e.target;if(input&&input.matches('input[name="ppPhoto"]')){if(input.checked)photoProjectSelection.add(input.value);else photoProjectSelection.delete(input.value);}renderPhotoPicker();});
document.getElementById('plannerContentType').addEventListener('change',()=>{renderPlanChooser();document.getElementById('planChooser').value='';if(val('plannerContentType')==='photo')resetPhotoProjectForm();else document.getElementById('resetPlan').click()});
function editPhotoProject(id){
 const p=db.plans.find(x=>x.id===id&&x.contentType==='photo');if(!p)return;
 document.getElementById('photoProjectEditId').value=p.id;
 const fields={ppTitle:p.title,ppDate:p.plannedDate,ppStage:p.status,ppCaption:p.caption,ppHashtags:p.hashtags,ppNotes:p.notes};
 Object.entries(fields).forEach(([k,v])=>{const el=document.getElementById(k);if(el)el.value=v||''});
 document.getElementById('plannerContentType').value='photo';renderPlanChooser();document.getElementById('planChooser').value=p.id;
 [...document.getElementById('ppPlatforms').options].forEach(o=>o.selected=(p.platforms||[]).includes(o.value));
 document.querySelectorAll('[name=\"ppPhoto\"]').forEach(el=>el.checked=false);photoProjectSelection=new Set(p.photoIds||[]);document.getElementById('ppPhotoSearch').value='';renderPhotoPicker();
 document.getElementById('photoProjectSaveBtn').textContent='Update photo project';
 openTab('planner');document.getElementById('photoProjectForm').scrollIntoView({behavior:'smooth',block:'start'});
}
function deletePhotoProject(id){
 if(!confirm('Delete this photo project? Catalog photos and their copyright records will remain. Publishing history will also remain in the photo records.'))return;
 db.plans=db.plans.filter(p=>p.id!==id);db.photoUsage=db.photoUsage.map(u=>u.projectId===id?{...u,projectId:null,projectTitle:u.projectTitle||'Deleted photo project'}:u);save();
}
function publishPhotoProject(id){
 const p=db.plans.find(x=>x.id===id&&x.contentType==='photo');if(!p)return;if(rejectFuturePublishedDate(p.plannedDate,'photo project'))return;
 const photos=(p.photoIds||[]).map(pid=>db.photos.find(ph=>ph.id===pid)).filter(Boolean);
 if(!photos.length){alert('This project has no catalog photos. Edit the project and select at least one photo.');return;}
 if(!p.platforms?.length){alert('Select at least one target platform before recording publication.');return;}
 const duplicates=[];
 photos.forEach(ph=>(p.platforms||[]).forEach(platform=>{if(db.photoUsage.some(u=>u.photoId===ph.id&&u.platform===platform))duplicates.push(`${ph.title} — ${platform}`)}));
 let proceed=true;
 if(duplicates.length)proceed=confirm('Some selected photo/platform combinations have already been used:\n\n'+duplicates.join('\n')+'\n\nContinue only if this is an intentional reuse?');
 if(!proceed)return;
 let added=0;
 photos.forEach(ph=>(p.platforms||[]).forEach(platform=>{
  const previous=db.photoUsage.some(u=>u.photoId===ph.id&&u.platform===platform);
  if(previous&&!duplicates.length)return;
  db.photoUsage.push({id:crypto.randomUUID(),photoId:ph.id,projectId:p.id,projectTitle:p.title,platform,publishDate:today()});added++;
 }));
 p.status='Published';p.lastPublished=today();p.updated=today();save();
 alert(`${added} photo/platform publication record(s) added. This app does not publish online.`);
}

function latestSnapshotsForAnalytics(){const by=new Map();db.snapshots.forEach(s=>{const k=s.videoId+'|'+s.window;const old=by.get(k);if(!old||String(s.snapshotDate||'')>String(old.snapshotDate||''))by.set(k,s)});return [...by.values()];}
function analyticsFilterMatches(v){const platform=val('analyticsFilterPlatform')||'',genre=val('analyticsFilterGenre')||'',video=val('analyticsFilterVideo')||'';return (!platform||v.platform===platform)&&(!genre||(v.genre||'Other')===genre)&&(!video||v.id===video);}
function updateAnalyticsFilterOptions(){const g=document.getElementById('analyticsFilterGenre'),v=document.getElementById('analyticsFilterVideo'),d=document.getElementById('analyticsDetailVideo');if(!g||!v||!d)return;const gv=g.value,vv=v.value,dv=d.value,genres=[...new Set(db.uploads.map(x=>x.genre||'Other'))].sort(),uploads=db.uploads.slice().sort((a,b)=>String(a.title).localeCompare(String(b.title)));g.innerHTML='<option value="">All genres</option>'+genres.map(x=>`<option value="${esc(x)}">${esc(x)}</option>`).join('');v.innerHTML='<option value="">All videos</option>'+uploads.map(x=>`<option value="${esc(x.id)}">${esc(x.title||'Untitled')} — ${esc(x.platform)}</option>`).join('');d.innerHTML='<option value="">Choose a video…</option>'+uploads.map(x=>`<option value="${esc(x.id)}">${esc(x.title||'Untitled')} — ${esc(x.platform)}</option>`).join('');if([...g.options].some(o=>o.value===gv))g.value=gv;if([...v.options].some(o=>o.value===vv))v.value=vv;if([...d.options].some(o=>o.value===dv))d.value=dv;}
function latestSnapshotRows(){const checkpoint=val('analyticsCompareWindow')||'24h',by=new Map();db.snapshots.filter(s=>s.window===checkpoint).forEach(s=>{const old=by.get(s.videoId);if(!old||String(s.snapshotDate||'')>String(old.snapshotDate||''))by.set(s.videoId,s)});return [...by.values()].map(s=>({s,v:db.uploads.find(v=>v.id===s.videoId)})).filter(x=>x.v&&analyticsFilterMatches(x.v));}
function renderAnalyticsVideoDetail(){const id=val('analyticsDetailVideo'),host=document.getElementById('analyticsVideoDetail');if(!host)return;if(!id){host.innerHTML='<div class="analytics-empty">Choose a video to see its snapshot history.</div>';return;}const rows=db.snapshots.filter(s=>s.videoId===id).sort((a,b)=>String(a.snapshotDate||'').localeCompare(String(b.snapshotDate||''))||String(a.window||'').localeCompare(String(b.window||'')));const disp=(s,k)=>snapshotMetric(s,k)===null?'N/A':analyticsNumber(snapshotMetric(s,k),k);host.innerHTML=table(['Snapshot date','Checkpoint','Treatment','Views','Likes','Comments','Shares','Saves','Avg watch','Avg viewed','Completion','Followers'],rows.map(s=>`<tr><td>${esc(s.snapshotDate||'—')}</td><td>${esc(s.window==='24h'?'24 hours':s.window==='lifetime'?'Lifetime':(s.window||'')+' days')}</td><td>${esc(s.creativeTreatment==='cleanVisual'?'Clean Visual':s.creativeTreatment==='quoteOverlay'?'Quote Overlay':'Not classified')}</td><td>${disp(s,'views')}</td><td>${disp(s,'likes')}</td><td>${disp(s,'comments')}</td><td>${disp(s,'shares')}</td><td>${disp(s,'saves')}</td><td>${disp(s,'avgWatchSeconds')}</td><td>${disp(s,'avgPercentViewed')}</td><td>${disp(s,'completionRate')}</td><td>${disp(s,'followers')}</td></tr>`));}

function drawAnalyticsBars(id,items,key){const host=document.getElementById(id);if(!host)return;const valid=items.filter(x=>x.value!==null&&Number.isFinite(Number(x.value)));if(!valid.length){host.innerHTML='<div class="analytics-empty">No applicable snapshot data yet.</div>';return;}const max=Math.max(1,...valid.map(x=>Number(x.value)));host.innerHTML='<div class="analytics-bars">'+valid.map(x=>`<div class="analytics-bar-row"><span>${esc(x.label)}</span><div class="analytics-bar-track"><div class="analytics-bar-fill" style="width:${Math.max(0,Number(x.value))/max*100}%"></div></div><b>${analyticsNumber(x.value,key)}</b></div>`).join('')+'</div>';}
function drawAnalyticsLine(id,items){const host=document.getElementById(id);if(!host)return;if(items.length<2){host.innerHTML='<div class="analytics-empty">Record snapshots on at least two dates to see a trend.</div>';return;}const vals=items.map(x=>x.value),max=Math.max(1,...vals),min=Math.min(0,...vals),w=600,h=150,p=28,points=items.map((x,i)=>`${p+i*(w-2*p)/(items.length-1)},${h-p-(x.value-min)/(max-min||1)*(h-2*p)}`).join(' ');const areaPoints=`${p},${h-p} ${points} ${w-p},${h-p}`;host.innerHTML=`<svg class="analytics-line" viewBox="0 0 ${w} ${h}" role="img" aria-label="Views over time"><line x1="${p}" y1="${h-p}" x2="${w-p}" y2="${h-p}" stroke="currentColor" opacity=".25"/><polygon class="analytics-area" points="${areaPoints}"/><polyline points="${points}"/>${items.map((x,i)=>{const xx=p+i*(w-2*p)/(items.length-1),yy=h-p-(x.value-min)/(max-min||1)*(h-2*p);return `<circle cx="${xx}" cy="${yy}" r="3"><title>${esc(x.label)}: ${fmt(x.value)} views</title></circle>`}).join('')}<text x="${p}" y="${h-5}">${esc(items[0].label)}</text><text x="${w-p}" y="${h-5}" text-anchor="end">${esc(items[items.length-1].label)}</text></svg>`;}
function selectedMetricValue(s,key){if(key==='engagement')return engagementValue(s);return snapshotMetric(s,key);}
function renderAnalytics(){
 if(!document.getElementById('analyticsTrendChart'))return;
 updateAnalyticsFilterOptions();
 const checkpoint=val('analyticsCompareWindow')||'24h';
 const trendWindow=val('analyticsTrendWindow')||'30',trendPlatform=val('analyticsTrendPlatform')||'';let trend=latestSnapshotsForAnalytics().filter(s=>{const v=db.uploads.find(x=>x.id===s.videoId);return s.window===trendWindow&&v&&(!trendPlatform||v.platform===trendPlatform)&&analyticsFilterMatches(v)});const byDate={};trend.forEach(s=>{const d=s.snapshotDate||'Undated';(byDate[d]??=[]).push(s)});const trendItems=Object.keys(byDate).sort().map(d=>({label:d.slice(5),value:metricSum(byDate[d],'views')})).filter(x=>x.value!==null);drawAnalyticsLine('analyticsTrendChart',trendItems);document.getElementById('analyticsTrendCoverage').textContent=`${trend.length} video/platform snapshot(s) · ${trendWindow==='24h'?'24-hour':trendWindow==='lifetime'?'lifetime':trendWindow+'-day'} checkpoint · ${trendPlatform||'All platforms'}`;
 const latest=latestSnapshotRows(),platforms=['YouTube Shorts','YouTube Long Format','Instagram','Facebook','TikTok'],toDate=viewsToDateByUpload().filter(x=>analyticsFilterMatches(x.upload));
 const platformMetric=val('analyticsPlatformMetric')||'views';const platformItems=platforms.map(p=>{if(platformMetric==='views'){const vals=toDate.filter(x=>x.upload.platform===p).map(x=>x.views).filter(x=>x!==null);return {label:`${p} (n=${vals.length})`,value:vals.length?vals.reduce((a,b)=>a+b,0):null};}const rows=latest.filter(x=>x.v.platform===p).map(x=>x.s);const available=rows.filter(s=>selectedMetricValue(s,platformMetric)!==null).length;const value=platformMetric==='engagement'?engagementSum(rows):['avgWatchSeconds','avgPercentViewed','completionRate'].includes(platformMetric)?metricAverage(rows,platformMetric):metricSum(rows,platformMetric);return {label:`${p} (n=${available})`,value};});drawAnalyticsBars('analyticsPlatformChart',platformItems,platformMetric);document.getElementById('analyticsPlatformCoverage').textContent=platformMetric==='views'?'Views to date use each upload’s latest available snapshot. Other metrics use the selected checkpoint.':'Latest snapshot at '+checkpoint+' per video/platform; N/A values excluded. Average metrics use available entries only.';
 const ret=val('analyticsRetentionMetric')||'avgWatchSeconds';const retItems=platforms.map(p=>{const rows=latest.filter(x=>x.v.platform===p).map(x=>x.s),n=rows.filter(s=>snapshotMetric(s,ret)!==null).length;return {label:`${p} (n=${n})`,value:metricAverage(rows,ret)};});drawAnalyticsBars('analyticsRetentionChart',retItems,ret);document.getElementById('analyticsRetentionCoverage').textContent=`Average uses only videos with a recorded value; N/A and unrecorded values are excluded. Checkpoint: ${checkpoint}.`;
 const genre=val('analyticsGenreMetric')||'views',genres=[...new Set([...latest.map(x=>x.v.genre||'Other'),...toDate.map(x=>x.upload.genre||'Other')])];const genreItems=genres.map(g=>{if(genre==='views'){const vals=toDate.filter(x=>(x.upload.genre||'Other')===g).map(x=>x.views).filter(x=>x!==null);return {label:`${g} (n=${vals.length})`,value:vals.length?vals.reduce((a,b)=>a+b,0):null};}const rows=latest.filter(x=>(x.v.genre||'Other')===g).map(x=>x.s);const n=rows.filter(s=>selectedMetricValue(s,genre)!==null).length;return {label:`${g} (n=${n})`,value:['avgWatchSeconds','avgPercentViewed','completionRate'].includes(genre)?metricAverage(rows,genre):genre==='engagement'?engagementSum(rows):metricSum(rows,genre)};});drawAnalyticsBars('analyticsGenreChart',genreItems,genre);document.getElementById('analyticsGenreCoverage').textContent=genre==='views'?'Views to date use each video’s latest available snapshot. Other metrics use the selected checkpoint.':'Checkpoint: '+checkpoint+'. Average metrics use available values only; totals omit unavailable entries.';
 const treatment=val('analyticsTreatmentMetric')||'views';const treatmentItems=['cleanVisual','quoteOverlay'].map(t=>{const rows=latest.filter(x=>x.s.creativeTreatment===t).map(x=>x.s);const value=['avgWatchSeconds','avgPercentViewed','completionRate'].includes(treatment)?metricAverage(rows,treatment):treatment==='engagement'?engagementAverage(rows):metricAverage(rows,treatment);return {label:t==='cleanVisual'?'Clean Visual':'Quote Overlay',value,count:rows.length};});drawAnalyticsBars('analyticsTreatmentChart',treatmentItems,treatment);document.getElementById('analyticsTreatmentCoverage').textContent=treatmentItems.map(x=>`${x.label}: ${x.count} video(s)`).join(' · ')+` · Average per video · Checkpoint: ${checkpoint}. Only classified videos are included.`;
 const engItems=['likes','comments','shares','saves'].map(k=>{const rows=latest.map(x=>x.s),n=rows.filter(s=>snapshotMetric(s,k)!==null).length;return {label:`${k[0].toUpperCase()+k.slice(1)} (n=${n})`,value:metricSum(rows,k)};});drawAnalyticsBars('analyticsEngagementChart',engItems);document.getElementById('analyticsEngagementCoverage').textContent=`Latest snapshot at ${checkpoint} per video; available values are summed separately for each action type.`;
 const videoMetric=val('analyticsVideoMetric')||'views',videoPlatform=val('analyticsVideoPlatform')||'';let videoRows;if(videoMetric==='views'){videoRows=toDate.filter(x=>!videoPlatform||x.upload.platform===videoPlatform).map(x=>({label:(x.upload.title||'Untitled')+' · '+x.upload.platform,value:x.views})).filter(x=>x.value!==null);}else{videoRows=latest.filter(x=>!videoPlatform||x.v.platform===videoPlatform).map(x=>({label:(x.v.title||'Untitled')+' · '+x.v.platform,value:selectedMetricValue(x.s,videoMetric)})).filter(x=>x.value!==null);}videoRows.sort((a,b)=>b.value-a.value);videoRows=videoRows.slice(0,10);drawAnalyticsBars('analyticsVideoChart',videoRows,videoMetric);document.getElementById('analyticsVideoCoverage').textContent=`Top ${videoRows.length} videos by ${videoMetric} · ${videoPlatform||'All platforms'} · ${videoMetric==='views'?'Latest available snapshot':'Checkpoint: '+checkpoint} · N/A values excluded.`;
 renderAnalyticsVideoDetail();
}
function render(){
 renderCommandCenter();renderPublishingCalendar();renderFieldSessions();renderRecaps();renderSeriesManager();renderCrossPlatform();renderInsights();renderAnalytics();renderYoutubeLongAnalytics();renderPlans();renderPlanChooser();renderAssets();renderFootageUsage();updateLibrarySelects();renderBackupStatus();
 document.getElementById('ovVideos').textContent=new Set(db.uploads.map(v=>v.title+'|'+v.platform)).size;
 const toDateRows=viewsToDateByUpload();
 document.getElementById('ovViews').textContent=fmt(toDateRows.reduce((sum,row)=>sum+(row.views===null?0:row.views),0));
 document.getElementById('ovMusic').textContent=db.music.length;document.getElementById('ovCopies').textContent=db.copies.length;
 updateVideoSelect();renderUploads();renderSnapshots();renderTimeAnalytics();renderMonthly();renderMusic();renderCopies();renderReviews();updateWorkSelects();renderChecklist();renderProjectTools();renderPhotoStudio();
}
document.getElementById('exportBtn').onclick=()=>{const stamp=new Date().toISOString();localStorage.setItem('prairie-preludes-last-backup',stamp);download('prairie-preludes-backup-2.3.04-'+today()+'.json',JSON.stringify({app:'Prairie Preludes Creator Studio',version:'2.3.04',exportedAt:stamp,data:db},null,2),'application/json');renderBackupStatus()};
document.getElementById('exportCsv').onclick=()=>{let rows=[['title','platform','publishDate','genre','url','window','snapshotDate','creativeTreatment','views','likes','comments','shares','saves','averageWatchTimeSeconds','averagePercentageViewed','completionRate','followersGained','naMetrics'],...db.snapshots.map(s=>{let v=db.uploads.find(x=>x.id===s.videoId)||{};return [v.title,v.platform,v.publishDate,v.genre,v.url,s.window,s.snapshotDate,s.creativeTreatment,...SNAPSHOT_METRICS.map(k=>snapshotMetric(s,k)),(s.naMetrics||[]).join(';')]})];download('prairie-preludes-metrics-2.3.04-'+today()+'.csv',rows.map(r=>r.map(x=>'"'+String(x??'').replace(/"/g,'""')+'"').join(',')).join('\r\n'),'text/csv')};
function download(name,data,type){let a=document.createElement('a'),u=URL.createObjectURL(new Blob([data],{type}));a.href=u;a.download=name;a.click();URL.revokeObjectURL(u);document.getElementById('backupMsg').textContent='Export started: '+name}
function normalizeIncoming(x){let incoming=x?.data||x;if(incoming.videos&&!incoming.uploads){let uploads=[],snapshots=[];incoming.videos.forEach(v=>{let u={id:v.id||crypto.randomUUID(),title:v.title,publishDate:v.publishDate,genre:v.genre,url:v.url,platform:v.platform};uploads.push(u);snapshots.push({id:crypto.randomUUID(),videoId:u.id,window:v.window||'24h',snapshotDate:v.snapshotDate||v.publishDate,views:v.views||0,likes:v.likes||0,comments:v.comments||0,shares:v.shares||0,watch:v.watch||0,followers:v.followers||0})});incoming={...incoming,uploads,snapshots}}const normalized={...blank(),...incoming,uploads:Array.isArray(incoming.uploads)?incoming.uploads:[],snapshots:Array.isArray(incoming.snapshots)?incoming.snapshots:[],music:Array.isArray(incoming.music)?incoming.music:[],copies:Array.isArray(incoming.copies)?incoming.copies:[],reviews:Array.isArray(incoming.reviews)?incoming.reviews:[],plans:Array.isArray(incoming.plans)?incoming.plans.map(p=>({...p,seriesId:p.seriesId||''})):[],series:Array.isArray(incoming.series)?incoming.series:[],photos:Array.isArray(incoming.photos)?incoming.photos:[],photoUsage:Array.isArray(incoming.photoUsage)?incoming.photoUsage:[],fieldSessions:Array.isArray(incoming.fieldSessions)?incoming.fieldSessions:[],weeklyRecaps:Array.isArray(incoming.weeklyRecaps)?incoming.weeklyRecaps:[],recapTitles:Array.isArray(incoming.recapTitles)?incoming.recapTitles:[],assets:Array.isArray(incoming.assets)?incoming.assets.map(a=>({...a,recordingSpeed:a.recordingSpeed||'1'})):[],evidence:incoming.evidence&&typeof incoming.evidence==='object'?incoming.evidence:{}};normalized.music=ensureMusicInternalIds(normalized.music);return normalized;}
function mergeRecords(current,incoming){const out={...current};['uploads','snapshots','music','copies','reviews','plans','assets','series','photos','photoUsage','fieldSessions','weeklyRecaps','recapTitles'].forEach(k=>{const seen=new Set((out[k]||[]).map(x=>x.id));(incoming[k]||[]).forEach(item=>{if(!seen.has(item.id)){out[k].push(item);seen.add(item.id)}})});out.music=ensureMusicInternalIds(out.music);out.evidence={...incoming.evidence,...current.evidence};return out}
document.getElementById('importFile').onchange=async e=>{
 const f=e.target.files[0];if(!f)return;
 try{
  const x=JSON.parse(await f.text());
  if(!x||typeof x!=='object'||(!x.data&&!x.uploads&&!x.videos)||!((x.data||x).music))throw Error('Invalid backup');
  const incoming=normalizeIncoming(x);
  const counts=['uploads','snapshots','music','assets','plans','series','photos','photoUsage','fieldSessions','weeklyRecaps','recapTitles','copies','reviews'].map(k=>`${k}: ${(incoming[k]||[]).length}`).join('\n');
  const mode=prompt(`Backup preview\n${counts}\n\nType MERGE to add records with new IDs, or REPLACE to replace local data. Cancel to leave everything unchanged.`);
  if(mode===null){}
  else if(mode.trim().toUpperCase()==='MERGE'){db=mergeRecords(db,incoming);save();document.getElementById('backupMsg').textContent='Backup merged. Existing records with matching IDs were kept.'}
  else if(mode.trim().toUpperCase()==='REPLACE'){
   if(confirm('Replace all current local data with this backup? This cannot be undone unless you exported a backup first.')){db=incoming;save();document.getElementById('backupMsg').textContent='Backup restored.'}
  }else alert('No changes made. Type MERGE or REPLACE exactly to continue.');
 }catch(err){alert('Could not import this file. Please select a valid Creator Studio JSON backup.')}
 e.target.value='';
};
function renderBackupStatus(){
 const stamp=localStorage.getItem('prairie-preludes-last-backup');
 const counts=`Current records — footage: ${(db.assets||[]).length}, projects: ${(db.plans||[]).length}, uploads: ${(db.uploads||[]).length}, music: ${(db.music||[]).length}, field sessions: ${(db.fieldSessions||[]).length}, weekly recaps: ${(db.weeklyRecaps||[]).length}. `;
 const external=stamp?'Last JSON export recorded here: '+new Date(stamp).toLocaleString()+'. ':'No JSON export has been recorded on this browser yet. ';
 document.getElementById('backupStatus').textContent=counts+external+'Download a JSON backup after important changes and keep it in Downloads or another location outside this app.';
}
document.getElementById('clearBtn').onclick=()=>{if(confirm('Permanently clear all Creator Studio data from this browser? Export a backup first if needed.')){db=blank();save();document.getElementById('backupMsg').textContent='All local data cleared.'}};

function localToday(){return denverDateString(new Date());}
function dateObj(s){const [y,m,d]=String(s||'').split('-').map(Number);return y&&m&&d?new Date(y,m-1,d):null;}
function dateStr(d){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;}
function addDays(d,n){const x=new Date(d.getFullYear(),d.getMonth(),d.getDate());x.setDate(x.getDate()+n);return x;}
function recurrenceDates(series,through){const start=dateObj(series.startDate),requestedEnd=dateObj(through),configuredEnd=dateObj(series.endDate),end=configuredEnd&&requestedEnd&&configuredEnd<requestedEnd?configuredEnd:requestedEnd;if(!start||!end||end<start)return [];const out=[];let cursor=new Date(start),guard=0;while(cursor<=end&&guard++<1500){out.push(dateStr(cursor));if(series.frequency==='daily')cursor=addDays(cursor,1);else if(series.frequency==='biweekly')cursor=addDays(cursor,14);else if(series.frequency==='monthly'){const day=start.getDate(),nextMonth=cursor.getMonth()+1,year=cursor.getFullYear()+Math.floor(nextMonth/12),month=nextMonth%12,last=new Date(year,month+1,0).getDate();cursor=new Date(year,month,Math.min(day,last));}else cursor=addDays(cursor,7);}return out;}
function materializeSeriesHistory(series,until=localToday()){if(!series)return;series.releases=Array.isArray(series.releases)?series.releases:[];const seen=new Set(series.releases.map(r=>r.date));recurrenceDates(series,until).filter(d=>d<=until).forEach(date=>{if(!seen.has(date)){series.releases.push({id:crypto.randomUUID(),date,recordedAt:localToday()});seen.add(date);}});}
function getSeriesReleaseDates(series,throughOverride){if(!series)return [];series.releases=Array.isArray(series.releases)?series.releases:[];const dates=new Set(series.releases.map(r=>r.date).filter(Boolean));if(series.status!=='paused'&&series.status!=='archived'){const horizon=throughOverride?dateObj(throughOverride):addDays(dateObj(localToday()),70);const end=dateStr(horizon);recurrenceDates(series,end).forEach(d=>dates.add(d));}return [...dates].sort();}
function seriesPlans(series){return db.plans.filter(p=>p.seriesId===series.id);}
const SERIES_COLOR_PALETTE=[
 {name:'Prairie Sage',hex:'#71866A'},
 {name:'Harvest Bark',hex:'#806044'},
 {name:'Golden Wheat',hex:'#C2A052'},
 {name:'Weathered Saddle',hex:'#A47C62'},
 {name:'Prairie Clay',hex:'#BD7057'},
 {name:'Prairie Berry',hex:'#925568'},
 {name:'Dusty Rose',hex:'#B58A88'},
 {name:'Heather Plum',hex:'#765879'},
 {name:'Open Sky',hex:'#66869B'},
 {name:'Blue Horizon',hex:'#405F85'}
];
function renderSeriesColorPalette(selected){const host=document.getElementById('seriesColorPalette');if(!host)return;const current=(selected||document.getElementById('seriesColor').value||'#71866A').toLowerCase();host.innerHTML=SERIES_COLOR_PALETTE.map(c=>`<button type="button" class="series-color-choice" style="background:${c.hex}" data-color="${c.hex}" aria-label="${c.name}" title="${c.name}" aria-pressed="${current===c.hex.toLowerCase()?'true':'false'}" onclick="chooseSeriesColor('${c.hex}')"></button>`).join('');const match=SERIES_COLOR_PALETTE.find(c=>c.hex.toLowerCase()===current);const preview=document.getElementById('seriesColorPreview'),name=document.getElementById('seriesColorName');if(preview)preview.style.background=current;if(name)name.textContent=match?match.name:'Existing custom color';}
function chooseSeriesColor(color){document.getElementById('seriesColor').value=color;renderSeriesColorPalette(color);}
function editSeries(id){const x=db.series.find(s=>s.id===id);if(!x)return;document.getElementById('seriesEditId').value=x.id;document.getElementById('seriesName').value=x.name||'';document.getElementById('seriesColor').value=x.color||'#71866A';renderSeriesColorPalette(x.color||'#71866A');document.getElementById('seriesStart').value=x.startDate||'';document.getElementById('seriesFrequency').value=x.frequency||'weekly';document.getElementById('seriesEnd').value=x.endDate||'';document.getElementById('seriesDescription').value=x.description||'';document.getElementById('seriesSave').textContent='Update series';openTab('series');}
function resetSeriesForm(){document.getElementById('seriesForm').reset();document.getElementById('seriesEditId').value='';document.getElementById('seriesColor').value='#71866A';renderSeriesColorPalette('#71866A');document.getElementById('seriesStart').value=localToday();document.getElementById('seriesSave').textContent='Save series';}
function setSeriesState(id,state){const x=db.series.find(s=>s.id===id);if(!x)return;materializeSeriesHistory(x,localToday());if(state==='paused'){x.status='paused';x.pausedAt=localToday();}else if(state==='active'){x.status='active';x.startDate=recurrenceDates({...x,status:'active',startDate:x.startDate,endDate:''},dateStr(addDays(dateObj(localToday()),40))).find(d=>d>localToday())||dateStr(addDays(dateObj(localToday()),7));delete x.pausedAt;}else if(state==='archived'){x.status='archived';x.archivedAt=localToday();}x.updated=localToday();save();}
function renderSeriesManager(){const host=document.getElementById('seriesTable');if(!host)return;const rows=db.series.slice().sort((a,b)=>String(a.name).localeCompare(String(b.name))).map(x=>{const dates=getSeriesReleaseDates(x),next=dates.find(d=>d>=localToday()),past=dates.filter(d=>d<localToday()).length;const status=x.status||'active';return `<tr><td><b><span class="series-swatch" style="background:${esc(x.color||'#71866A')}"></span>${esc(x.name)}</b><div class="sub">${esc(x.description||'')}</div></td><td>${esc(x.frequency||'weekly')}<div class="sub">From ${esc(x.startDate||'—')}${x.endDate?' · Through '+esc(x.endDate):''}</div></td><td>${esc(status)}</td><td>${esc(next||'No future releases')}<div class="sub">${past} historical release record(s)</div></td><td><button class="secondary" onclick="editSeries('${x.id}')">Edit</button> ${status==='paused'?`<button class="secondary" onclick="setSeriesState('${x.id}','active')">Resume</button>`:status==='active'?`<button class="secondary" onclick="setSeriesState('${x.id}','paused')">Pause</button>`:''} ${status!=='archived'?`<button class="secondary danger" onclick="setSeriesState('${x.id}','archived')">Archive</button>`:''}</td></tr>`;});host.innerHTML=table(['Series','Schedule','Status','Next release','Actions'],rows);const overview=document.getElementById('seriesReleaseOverview');if(overview){const all=db.series.flatMap(x=>getSeriesReleaseDates(x).filter(date=>date>=localToday()).map(date=>({x,date}))).sort((a,b)=>a.date.localeCompare(b.date)).slice(0,20);overview.innerHTML=all.length?table(['Release date','Series','Coverage'],all.map(({x,date})=>{const planned=seriesPlans(x).some(p=>p.plannedDate===date);return `<tr><td>${esc(date)}</td><td><span class="series-swatch" style="background:${esc(x.color||'#71866A')}"></span>${esc(x.name)}</td><td>${planned?'<span class="readiness-status ready">Video planned</span>':date<localToday()?'<span class="readiness-status missing">Overdue</span>':'<span class="readiness-status missing">Needs planning</span>'}</td></tr>`;})):'<div class="empty">Create a series to see its recurring release dates here.</div>';}}
function renderSeriesCommandCenter(){const summary=document.getElementById('ccSeriesSummary'),host=document.getElementById('ccSeriesUpcoming');if(!summary||!host)return;const t=localToday(),end=dateStr(addDays(dateObj(t),6)),all=db.series.filter(x=>x.status==='active').flatMap(x=>getSeriesReleaseDates(x).map(date=>({series:x,date,plan:db.plans.find(p=>p.seriesId===x.id&&p.plannedDate===date)})));const overdue=all.filter(x=>x.date<t&&!x.plan),soon=all.filter(x=>x.date>=t&&x.date<=end),unplanned=soon.filter(x=>!x.plan),covered=soon.filter(x=>x.plan);summary.innerHTML=`<div class="schedule-stat"><strong>${db.series.filter(x=>x.status==='active').length}</strong><span class="sub">Active series</span></div><div class="schedule-stat"><strong>${soon.length}</strong><span class="sub">Upcoming releases</span></div><div class="schedule-stat"><strong>${covered.length}</strong><span class="sub">Videos planned</span></div><div class="schedule-stat"><strong>${unplanned.length}</strong><span class="sub">Need planning</span></div><div class="schedule-stat"><strong>${overdue.length}</strong><span class="sub">Overdue releases</span></div>`;const items=[...overdue.map(x=>({...x,flag:'Overdue'})),...soon.map(x=>({...x,flag:x.plan?'Video planned':'Needs planning'}))].sort((a,b)=>a.date.localeCompare(b.date));host.innerHTML=items.length?items.slice(0,12).map(x=>`<div class="command-item"><strong><span class="series-swatch" style="background:${esc(x.series.color||'#71866A')}"></span>${esc(x.series.name)} · ${esc(x.flag)}</strong><small>${esc(x.date)} · ${x.plan?esc(x.plan.title):'No video assigned'}</small>${x.plan?`<div><button class="secondary" onclick="editPlan('${x.plan.id}')">Open project</button></div>`:''}</div>`).join(''):'<div class="notice">No series releases are overdue or scheduled in the next seven days.</div>';}
function renderUpcomingReadiness(){
 const start=localToday(),end=dateStr(addDays(dateObj(start),14));
 const inWindow=p=>p.plannedDate&&p.plannedDate>=start&&p.plannedDate<=end&&p.status!=='Published';
 const videoHost=document.getElementById('ccReadiness'),videoSummary=document.getElementById('ccReadinessSummary');
 const photoHost=document.getElementById('ccPhotoReadiness'),photoSummary=document.getElementById('ccPhotoReadinessSummary');
 if(videoHost&&videoSummary){
  const plans=db.plans.filter(p=>p.contentType!=='photo'&&inWindow(p)).sort((a,b)=>a.plannedDate.localeCompare(b.plannedDate)||String(a.title).localeCompare(String(b.title)));
  const rows=plans.map(p=>{
   const audio=!!(p.musicId&&db.music.some(m=>m.id===p.musicId));
   const video=!!((p.assetId&&db.assets.some(a=>a.id===p.assetId))||(p.assetIds||[]).some(id=>db.assets.some(a=>a.id===id)));
   const caption=!!String(p.caption||'').trim();
   return {p,audio,video,caption};
  });
  const ready=rows.filter(x=>x.audio&&x.video&&x.caption).length;
  videoSummary.innerHTML=`<div class="schedule-stat"><strong>${rows.length}</strong><span class="sub">Planned videos</span></div><div class="schedule-stat"><strong>${ready}</strong><span class="sub">Fully assigned</span></div><div class="schedule-stat"><strong>${rows.length-ready}</strong><span class="sub">Need attention</span></div>`;
  videoHost.innerHTML=rows.length?`<div class="readiness-scroll">${rows.map(({p,audio,video,caption})=>`<div class="readiness-strip video-readiness"><div class="readiness-cell project-name"><strong>${esc(p.title||'Untitled video')}</strong></div><div class="readiness-cell"><span class="sub">Date</span><br>${esc(p.plannedDate)}</div><div class="readiness-cell"><span class="sub">Audio</span><br><span class="readiness-status ${audio?'ready':'missing'}">${audio?'Assigned':'Missing'}</span></div><div class="readiness-cell"><span class="sub">Video</span><br><span class="readiness-status ${video?'ready':'missing'}">${video?'Assigned':'Missing'}</span></div><div class="readiness-cell caption-cell"><span class="sub">Caption</span><br><span class="readiness-status ${caption?'ready':'missing'}">${caption?'Assigned':'Missing'}</span></div><button class="secondary readiness-open" onclick="editPlan('${p.id}')">Open project ↗</button></div>`).join('')}</div>`:'<div class="empty">No videos are planned in the next 14 days.</div>';
 }
 if(photoHost&&photoSummary){
  const plans=db.plans.filter(p=>p.contentType==='photo'&&inWindow(p)).sort((a,b)=>a.plannedDate.localeCompare(b.plannedDate)||String(a.title).localeCompare(String(b.title)));
  const rows=plans.map(p=>{
   const photo=Array.isArray(p.photoIds)&&p.photoIds.some(id=>db.photos.some(ph=>ph.id===id));
   const caption=!!String(p.caption||'').trim();
   return {p,photo,caption};
  });
  const ready=rows.filter(x=>x.photo&&x.caption).length;
  photoSummary.innerHTML=`<div class="schedule-stat"><strong>${rows.length}</strong><span class="sub">Planned photos</span></div><div class="schedule-stat"><strong>${ready}</strong><span class="sub">Fully assigned</span></div><div class="schedule-stat"><strong>${rows.length-ready}</strong><span class="sub">Need attention</span></div>`;
  photoHost.innerHTML=rows.length?`<div class="readiness-scroll">${rows.map(({p,photo,caption})=>`<div class="readiness-strip photo-readiness"><div class="readiness-cell project-name"><strong>${esc(p.title||'Untitled photo')}</strong></div><div class="readiness-cell"><span class="sub">Date</span><br>${esc(p.plannedDate)}</div><div class="readiness-cell"><span class="sub">Photo</span><br><span class="readiness-status ${photo?'ready':'missing'}">${photo?'Assigned':'Missing'}</span></div><div class="readiness-cell caption-cell"><span class="sub">Caption</span><br><span class="readiness-status ${caption?'ready':'missing'}">${caption?'Assigned':'Missing'}</span></div><button class="secondary readiness-open" onclick="editPhotoProject('${p.id}')">Open project ↗</button></div>`).join('')}</div>`:'<div class="empty">No photos are planned in the next 14 days.</div>';
 }
}
document.getElementById('seriesForm').addEventListener('submit',e=>{e.preventDefault();const id=val('seriesEditId'),existing=db.series.find(x=>x.id===id),start=val('seriesStart'),end=val('seriesEnd');if(end&&end<start){alert('The end date must be on or after the start date.');return;}if(existing)materializeSeriesHistory(existing,localToday());const record={...(existing||{}),id:existing?.id||crypto.randomUUID(),name:val('seriesName').trim(),color:val('seriesColor')||'#71866A',startDate:start,frequency:val('seriesFrequency'),endDate:end,description:val('seriesDescription'),status:existing?.status||'active',releases:existing?.releases||[],created:existing?.created||localToday(),updated:localToday()};if(existing)Object.assign(existing,record);else db.series.push(record);document.getElementById('seriesFormMessage').textContent='Series saved. Existing historical release records are preserved.';resetSeriesForm();save();});
document.getElementById('seriesReset').addEventListener('click',resetSeriesForm);


// 2.3.00 — Field sessions and Weekly Recap production
let recapSequenceDraft=[];let recapTransitionsDraft={};
function resetFieldSession(){document.getElementById('fieldSessionForm').reset();document.getElementById('fsId').value='';document.getElementById('fsSunrise').addEventListener('input',updateGoldenHourFields);document.getElementById('fsSunset').addEventListener('input',updateGoldenHourFields);document.getElementById('fsSunrise').addEventListener('change',updateGoldenHourFields);document.getElementById('fsSunset').addEventListener('change',updateGoldenHourFields);document.getElementById('fsDate').value=today();document.getElementById('fsSave').textContent='Save field session';updateGoldenHourFields();}
function renderFieldSessions(){const host=document.getElementById('fieldSessionTable');if(!host)return;host.innerHTML=table(['Session','Date / time','Location & conditions','Capture plan','Related creative work','Status / actions'],db.fieldSessions.slice().sort((a,b)=>String(b.date||'').localeCompare(String(a.date||''))).map(x=>`<tr><td><strong>${esc(x.name)}</strong><div class="sub">${esc(x.subjects||'')}</div></td><td>${esc(x.date||'—')} ${esc(x.time||'')}</td><td>${esc(x.location||'—')}<div class="sub">${esc(x.conditions||'')} · ${esc(x.light||'')}</div><div class="sub">Sunrise ${esc(x.sunrise||'—')} · Sunset ${esc(x.sunset||'—')} · Golden hour AM ${esc(x.goldenHourAm||goldenHourWindows(x.sunrise,x.sunset).am||'—')} · PM ${esc(x.goldenHourPm||goldenHourWindows(x.sunrise,x.sunset).pm||'—')}</div></td><td>${esc(x.shotList||'—')}<div class="sub">Equipment: ${esc(x.equipment||'—')}</div></td><td>${db.plans.filter(p=>p.fieldSessionId===x.id).map(p=>'Video: '+esc(p.title)).concat(db.photos.filter(ph=>ph.fieldSessionId===x.id).map(ph=>'Photo: '+esc(ph.title))).join('<br>')||'—'}</td><td>${esc(x.status||'Planned')}<div class="actions"><button class="secondary" onclick="editFieldSession('${x.id}')">Edit</button><button class="secondary danger" onclick="deleteFieldSession('${x.id}')">Delete</button></div></td></tr>`));}
function editFieldSession(id){const x=db.fieldSessions.find(z=>z.id===id);if(!x)return;const fields={fsId:x.id,fsName:x.name,fsDate:x.date,fsTime:x.time,fsSunrise:x.sunrise,fsSunset:x.sunset,fsGoldenAm:x.goldenHourAm||goldenHourWindows(x.sunrise,x.sunset).am,fsGoldenPm:x.goldenHourPm||goldenHourWindows(x.sunrise,x.sunset).pm,fsLocation:x.location,fsConditions:x.conditions,fsLight:x.light,fsSubjects:x.subjects,fsEquipment:x.equipment,fsShotList:x.shotList,fsStatus:x.status,fsNotes:x.notes};Object.entries(fields).forEach(([k,v])=>{const el=document.getElementById(k);if(el)el.value=v||''});updateGoldenHourFields();document.getElementById('fsSave').textContent='Update field session';document.getElementById('fieldSessionForm').scrollIntoView({behavior:'smooth'});}
function deleteFieldSession(id){if(!confirm('Delete this field session? Linked projects and photos will remain; their session link will be cleared.'))return;db.fieldSessions=db.fieldSessions.filter(x=>x.id!==id);db.plans.forEach(x=>{if(x.fieldSessionId===id)x.fieldSessionId=''});db.photos.forEach(x=>{if(x.fieldSessionId===id)x.fieldSessionId=''});save();}
document.getElementById('fieldSessionForm').addEventListener('submit',e=>{e.preventDefault();const id=val('fsId'),old=db.fieldSessions.find(x=>x.id===id),r={...(old||{}),id:old?.id||crypto.randomUUID(),name:val('fsName').trim(),date:val('fsDate'),time:val('fsTime'),sunrise:val('fsSunrise'),sunset:val('fsSunset'),goldenHourAm:goldenHourWindows(val('fsSunrise'),val('fsSunset')).am,goldenHourPm:goldenHourWindows(val('fsSunrise'),val('fsSunset')).pm,location:val('fsLocation').trim(),conditions:val('fsConditions'),light:val('fsLight'),subjects:val('fsSubjects'),equipment:val('fsEquipment'),shotList:val('fsShotList'),status:val('fsStatus'),notes:val('fsNotes'),updated:today(),created:old?.created||today()};if(old)Object.assign(old,r);else db.fieldSessions.push(r);resetFieldSession();save();});
function recapFullTitle(r){return 'This Week on the Plains: '+String(r.subtitle||'').trim();}
function recapEligibleProjects(){return db.plans.filter(p=>p.contentType!=='photo'&&((p.platforms||[]).some(x=>['YouTube Shorts','Instagram','TikTok'].includes(x))||p.aspect==='Vertical 9:16')).sort((a,b)=>String(a.title||'').localeCompare(String(b.title||'')));}
function parseProjectRuntime(value){const parts=String(value||'').trim().split(':').map(Number);if(parts.length===2&&parts.every(Number.isFinite)&&parts[0]>=0&&parts[1]>=0&&parts[1]<60)return parts[0]*60+parts[1];if(parts.length===3&&parts.every(Number.isFinite)&&parts[0]>=0&&parts[1]>=0&&parts[1]<60&&parts[2]>=0&&parts[2]<60)return parts[0]*3600+parts[1]*60+parts[2];return null;}
function formatRuntime(seconds){seconds=Math.max(0,Math.round(seconds||0));const h=Math.floor(seconds/3600),m=Math.floor((seconds%3600)/60),sec=seconds%60;return h?`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`:`${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;}
function updateRecapEstimatedRuntime(){const chosen=recapSequenceDraft.map(id=>db.plans.find(p=>p.id===id)).filter(Boolean),durations=chosen.map(p=>parseProjectRuntime(p.runtime)),known=durations.filter(x=>x!==null),total=known.reduce((a,b)=>a+b,0),value=document.getElementById('recapEstimatedRuntime'),coverage=document.getElementById('recapRuntimeCoverage');if(value)value.textContent=formatRuntime(total);if(coverage)coverage.textContent=!chosen.length?'Select projects and enter a finished video runtime for each project to calculate the estimate.':`${known.length} of ${chosen.length} selected project(s) have a finished runtime. ${chosen.length-known.length?`${chosen.length-known.length} project(s) still need a runtime, so the estimate is partial.`:'All selected project runtimes are included.'} Transitions and any intro/outro are not included.`;}
function timeFromMinutes(total){total=((total%1440)+1440)%1440;return `${String(Math.floor(total/60)).padStart(2,'0')}:${String(total%60).padStart(2,'0')}`;}
function goldenHourWindows(sunrise,sunset){const valid=/^(?:[01]\d|2[0-3]):[0-5]\d$/;return {am:valid.test(sunrise||'')?`${sunrise}–${timeFromMinutes(Number(sunrise.slice(0,2))*60+Number(sunrise.slice(3))+60)}`:'',pm:valid.test(sunset||'')?`${timeFromMinutes(Number(sunset.slice(0,2))*60+Number(sunset.slice(3))-60)}–${sunset}`:''};}
function updateGoldenHourFields(){const w=goldenHourWindows(val('fsSunrise'),val('fsSunset'));const am=document.getElementById('fsGoldenAm'),pm=document.getElementById('fsGoldenPm');if(am)am.value=w.am;if(pm)pm.value=w.pm;}
function renderRecapProjectOptions(selected=[]){const el=document.getElementById('recapProjectPicker');if(!el)return;const q=(document.getElementById('recapProjectSearch')?.value||'').trim().toLowerCase(),plans=recapEligibleProjects().filter(p=>!q||String(p.title||'').toLowerCase().includes(q));el.innerHTML=plans.length?plans.map(p=>`<label class="check-item"><input type="checkbox" name="recapProject" value="${esc(p.id)}" ${selected.includes(p.id)?'checked':''}><span><b>${esc(p.title||'Untitled')}</b><span class="sub"> · ${esc(p.plannedDate||'Unscheduled')} · ${esc(p.aspect||'Short-form')}</span></span></label>`).join(''):'<div class="empty">No matching short-form projects. Create or update a short-form project first.</div>';const count=selected.length,summary=document.getElementById('recapProjectSummary');if(summary)summary.textContent=count?`${count} project${count===1?'':'s'} selected — click to change`:'Choose short-form projects…';updateRecapEstimatedRuntime();}
function syncRecapSequenceFromSelect(){const visible=[...document.querySelectorAll('input[name="recapProject"]')].map(o=>o.value),selected=[...document.querySelectorAll('input[name="recapProject"]:checked')].map(o=>o.value),hidden=recapSequenceDraft.filter(id=>!visible.includes(id)),previous=recapSequenceDraft.filter(id=>selected.includes(id));recapSequenceDraft=[...hidden,...previous,...selected.filter(id=>!previous.includes(id))];renderRecapSequence();}
function renderRecapSequence(){const host=document.getElementById('recapSequence');if(!host)return;host.innerHTML=recapSequenceDraft.length?recapSequenceDraft.map((id,i)=>{const p=db.plans.find(x=>x.id===id);return `<div class="recap-sequence-item"><strong>${i+1}. ${esc(p?.title||'Missing project reference')}</strong><button type="button" class="secondary" onclick="moveRecapProject(${i},-1)" ${i===0?'disabled':''}>↑</button><button type="button" class="secondary" onclick="moveRecapProject(${i},1)" ${i===recapSequenceDraft.length-1?'disabled':''}>↓</button><button type="button" class="secondary danger" onclick="removeRecapProject('${id}')">Remove</button></div>`}).join(''):'<div class="empty">Select the short-form projects included in this recap.</div>';renderRecapTransitions();updateRecapEstimatedRuntime();}
function renderRecapTransitions(){const host=document.getElementById('recapTransitionControls');if(!host)return;const pairs=[];for(let i=0;i<recapSequenceDraft.length-1;i++){const a=db.plans.find(p=>p.id===recapSequenceDraft[i]),b=db.plans.find(p=>p.id===recapSequenceDraft[i+1]),key=recapSequenceDraft[i]+'|'+recapSequenceDraft[i+1];if(!recapTransitionsDraft[key])recapTransitionsDraft[key]='Straight cut';pairs.push(`<div class="recap-sequence-item"><strong>${esc(a?.title||'Project')} → ${esc(b?.title||'Project')}</strong><select aria-label="Transition between projects" onchange="setRecapTransition('${key}',this.value)">${['Straight cut','Cross-dissolve','Fade to black'].map(v=>`<option ${recapTransitionsDraft[key]===v?'selected':''}>${v}</option>`).join('')}</select></div>`);}host.innerHTML=pairs.join('')||'<div class="empty">Add at least two projects to set transitions between them.</div>'; }
function setRecapTransition(key,value){recapTransitionsDraft[key]=value;}
function moveRecapProject(i,delta){const j=i+delta;if(j<0||j>=recapSequenceDraft.length)return;[recapSequenceDraft[i],recapSequenceDraft[j]]=[recapSequenceDraft[j],recapSequenceDraft[i]];renderRecapSequence();}
function removeRecapProject(id){recapSequenceDraft=recapSequenceDraft.filter(x=>x!==id);renderRecapProjectOptions(recapSequenceDraft);renderRecapSequence();}
function resetRecapForm(){document.getElementById('recapForm').reset();document.getElementById('recapId').value='';document.getElementById('recapWeekStart').value=today();document.getElementById('recapWeekEnd').value=today();document.getElementById('recapRuntime').value='10';document.getElementById('recapSave').textContent='Save weekly recap';recapSequenceDraft=[];recapTransitionsDraft={};renderRecapProjectOptions();renderRecapSequence();}
function editRecap(id){const r=db.weeklyRecaps.find(x=>x.id===id);if(!r)return;document.getElementById('recapId').value=r.id;const fields={recapSubtitle:r.subtitle,recapWeekStart:r.weekStart,recapWeekEnd:r.weekEnd,recapDate:r.publishDate,recapStatus:r.status,recapRuntime:r.targetRuntime,recapActualRuntime:r.actualRuntime,recapTransitions:r.transitions,recapTheme:r.theme,recapUrl:r.youtubeUrl};Object.entries(fields).forEach(([k,v])=>{const el=document.getElementById(k);if(el)el.value=v??''});recapSequenceDraft=(r.projectIds||[]).filter(id=>db.plans.some(p=>p.id===id));recapTransitionsDraft={...(r.transitionPairs||{})};renderRecapProjectOptions(recapSequenceDraft);renderRecapSequence();document.getElementById('recapSave').textContent='Update weekly recap';openTab('recaps');document.getElementById('recapForm').scrollIntoView({behavior:'smooth'});}
function deleteRecap(id){if(!confirm('Delete this weekly recap record? Its included video projects will not be deleted.'))return;const old=db.weeklyRecaps.find(x=>x.id===id);db.weeklyRecaps=db.weeklyRecaps.filter(x=>x.id!==id);const title=db.recapTitles.find(x=>x.recapId===id);if(title){title.status='Available';delete title.recapId;}save();}
function renderRecaps(){const t=document.getElementById('recapTable');if(!t)return;t.innerHTML=table(['Weekly collection','Week / publication','Included projects','Production','YouTube analytics','Actions'],db.weeklyRecaps.slice().sort((a,b)=>String(b.publishDate||'').localeCompare(String(a.publishDate||''))).map(r=>{const upload=db.uploads.find(v=>v.platform==='YouTube Long Format'&&v.weeklyRecapId===r.id);return `<tr><td><strong>◆ ${esc(r.fullTitle||recapFullTitle(r))}</strong><div class="sub">${esc(r.theme||'')}</div></td><td>${esc(r.weekStart||'—')} – ${esc(r.weekEnd||'—')}<div class="sub">Publish: ${esc(r.publishDate||'Unscheduled')}</div></td><td>${(r.projectIds||[]).map(id=>esc(db.plans.find(p=>p.id===id)?.title||'Missing project')).join('<br>')||'None selected'}<div class="sub">${(r.projectIds||[]).length} project(s)</div></td><td>${esc(r.status||'Planning')}<div class="sub">Target ${esc(r.targetRuntime||10)} min · Estimated ${esc(formatRuntime((r.projectIds||[]).map(id=>db.plans.find(p=>p.id===id)).filter(Boolean).map(p=>parseProjectRuntime(p.runtime)).filter(x=>x!==null).reduce((a,b)=>a+b,0)))} · Actual ${esc(r.actualRuntime||'—')} min · ${Object.keys(r.transitionPairs||{}).length} transition(s)</div></td><td>${upload?`<strong>Upload linked</strong><div class="sub">${esc(upload.publishDate||'Date not set')}</div><div class="sub">${db.snapshots.filter(s=>s.videoId===upload.id).length} snapshot(s)</div>`:'<span class="sub">No upload record yet</span>'}</td><td><div class="actions"><button class="secondary" onclick="editRecap('${r.id}')">Edit</button><button class="secondary" onclick="prepareRecapUpload('${r.id}')">${upload?'Open YouTube upload':'Prepare YouTube upload'}</button>${r.youtubeUrl?`<a href="${esc(r.youtubeUrl)}" target="_blank" rel="noopener">YouTube ↗</a>`:''}<button class="secondary danger" onclick="deleteRecap('${r.id}')">Delete</button></div></td></tr>`}));
 const th=document.getElementById('recapTitleTable');if(th)th.innerHTML=table(['Subtitle','Theme / mood','Status','Actions'],db.recapTitles.slice().sort((a,b)=>a.subtitle.localeCompare(b.subtitle)).map(x=>`<tr><td>${esc(x.subtitle)}</td><td>${esc(x.theme||'—')}</td><td><select onchange="setRecapTitleStatus('${x.id}',this.value)">${['Available','Reserved','Used'].map(st=>`<option ${x.status===st?'selected':''}>${st}</option>`).join('')}</select></td><td><button class="secondary danger" onclick="deleteRecapTitle('${x.id}')">Delete</button></td></tr>`));
 renderRecapProjectOptions(recapSequenceDraft);updateWeeklyRecapSelect(val('uWeeklyRecap')||'');
}
function setRecapTitleStatus(id,status){const x=db.recapTitles.find(t=>t.id===id);if(x){x.status=status;save();}}
function deleteRecapTitle(id){db.recapTitles=db.recapTitles.filter(x=>x.id!==id);save();}
document.getElementById('recapProjectPicker').addEventListener('change',e=>{if(e.target&&e.target.matches('input[name="recapProject"]'))syncRecapSequenceFromSelect();});document.getElementById('recapProjectSearch').addEventListener('input',()=>renderRecapProjectOptions(recapSequenceDraft));
document.getElementById('recapForm').addEventListener('submit',e=>{e.preventDefault();const id=val('recapId'),old=db.weeklyRecaps.find(x=>x.id===id),subtitle=val('recapSubtitle').trim();if(val('recapStatus')==='Published'&&rejectFuturePublishedDate(val('recapDate'),'weekly recap'))return;if(!recapSequenceDraft.length){alert('Select at least one existing short-form video project.');return;}const duplicate=db.weeklyRecaps.find(x=>x.id!==id&&String(x.subtitle||'').toLowerCase()===subtitle.toLowerCase());if(duplicate&&!confirm('This subtitle has already been used by another recap. Use it again?'))return;if(old&&String(old.subtitle||'').toLowerCase()!==subtitle.toLowerCase()){const priorTitle=db.recapTitles.find(x=>x.recapId===old.id);if(priorTitle){priorTitle.status='Available';delete priorTitle.recapId;}}const r={...(old||{}),id:old?.id||crypto.randomUUID(),seriesName:'This Week on the Plains',subtitle,fullTitle:'This Week on the Plains: '+subtitle,weekStart:val('recapWeekStart'),weekEnd:val('recapWeekEnd'),publishDate:val('recapDate'),status:val('recapStatus'),targetRuntime:Number(val('recapRuntime')||10),actualRuntime:Number(val('recapActualRuntime')||0)||null,estimatedRuntimeSeconds:recapSequenceDraft.map(id=>db.plans.find(p=>p.id===id)).filter(Boolean).map(p=>parseProjectRuntime(p.runtime)).filter(x=>x!==null).reduce((a,b)=>a+b,0),projectIds:recapSequenceDraft.slice(),transitionPairs:{...recapTransitionsDraft},transitions:val('recapTransitions'),theme:val('recapTheme'),youtubeUrl:val('recapUrl'),updated:today(),created:old?.created||today()};if(old)Object.assign(old,r);else db.weeklyRecaps.push(r);const linkedUpload=db.uploads.find(v=>v.platform==='YouTube Long Format'&&v.weeklyRecapId===r.id);if(linkedUpload){linkedUpload.title=r.fullTitle;linkedUpload.publishDate=r.publishDate||linkedUpload.publishDate;linkedUpload.url=r.youtubeUrl||linkedUpload.url;}let title=db.recapTitles.find(x=>x.subtitle.toLowerCase()===subtitle.toLowerCase());if(title){title.status=r.status==='Published'?'Used':'Reserved';title.recapId=r.id;}else db.recapTitles.push({id:crypto.randomUUID(),subtitle,theme:r.theme,status:r.status==='Published'?'Used':'Reserved',recapId:r.id});resetRecapForm();save();});
document.getElementById('recapTitleForm').addEventListener('submit',e=>{e.preventDefault();const subtitle=val('rtTitle').trim();if(db.recapTitles.some(x=>x.subtitle.toLowerCase()===subtitle.toLowerCase())){alert('That subtitle is already in the title catalog.');return;}db.recapTitles.push({id:crypto.randomUUID(),subtitle,theme:val('rtTheme'),status:val('rtStatus')});e.target.reset();save();});

document.getElementById('fsSunrise').addEventListener('input',updateGoldenHourFields);document.getElementById('fsSunset').addEventListener('input',updateGoldenHourFields);document.getElementById('fsSunrise').addEventListener('change',updateGoldenHourFields);document.getElementById('fsSunset').addEventListener('change',updateGoldenHourFields);document.getElementById('fsDate').value=today();document.getElementById('recapWeekStart').value=today();document.getElementById('recapWeekEnd').value=today();renderSeriesColorPalette(document.getElementById('seriesColor').value);
render();
if(musicIdsMigrated){const migratedPayload=JSON.stringify(db);try{localStorage.setItem(KEY,migratedPayload);localStorage.setItem(SAFETY_KEY,migratedPayload);}catch(err){console.warn('Music Catalog ID migration could not be persisted immediately:',err);}}
