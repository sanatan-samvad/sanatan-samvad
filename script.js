const $=s=>document.querySelector(s);
const dateEl=$("#dateText"); if(dateEl) dateEl.textContent=new Intl.DateTimeFormat("hi-IN",{dateStyle:"full"}).format(new Date());

const ticker=$("#ticker");
const headlines=["उत्तर प्रदेश की बड़ी खबरें अब एक ही मंच पर","अयोध्या • काशी • मथुरा से धर्म और संस्कृति की अपडेट","सरकार, विपक्ष और जनता — खबरों का पूरा संदर्भ"];
let ti=0; setInterval(()=>{ti=(ti+1)%headlines.length;if(ticker)ticker.textContent=headlines[ti]},3500);

const nav=$("#nav"); const menu=$("#menuBtn");
if(menu) menu.onclick=()=>nav.classList.toggle("open");

async function loadNews(){
  // Supabase config is kept in config.js. If it is configured, published news
  // will replace the demo cards below.
  try{
    if(!window.SUPABASE_URL || !window.SUPABASE_PUBLISHABLE_KEY) return;
    if(!window.supabase) return;
    const client=window.supabase.createClient(window.SUPABASE_URL,window.SUPABASE_PUBLISHABLE_KEY);
    const {data,error}=await client.from("news").select("*").eq("published",true).order("created_at",{ascending:false}).limit(12);
    if(error||!data?.length) return;
    const grid=$("#newsGrid"); if(!grid)return;
    grid.innerHTML=data.map((n,i)=>`<article class="news-card ${i===0?"featured":""}">
      ${n.image_url?`<img style="width:100%;height:${i===0?210:170}px;object-fit:cover" src="${n.image_url}" alt="">`:`<div class="placeholder">📰</div>`}
      <div class="pad"><span>${n.category||"उत्तर प्रदेश"}</span><h3>${n.title||""}</h3><p>${n.excerpt||""}</p></div>
    </article>`).join("");
  }catch(e){console.log("News feed not configured yet",e)}
}
loadNews();
