
(() => {
  "use strict";

  const $ = (s) => document.querySelector(s);

  const esc = (v = "") => String(v)
    .replace(/&/g,"&amp;").replace(/</g,"&lt;")
    .replace(/>/g,"&gt;").replace(/"/g,"&quot;")
    .replace(/'/g,"&#039;");

  function normalizeImageUrl(value){
    if(!value) return "";
    let u = String(value).trim();

    // [text](https://...)
    const md = u.match(/^\[[^\]]*\]\((https?:\/\/[^)\s]+)\)$/i);
    if(md) u = md[1];

    // <img src="...">
    const html = u.match(/<img[^>]+src=["']([^"']+)["']/i);
    if(html) u = html[1];

    // Remove accidental quotes/backticks and whitespace.
    u = u.replace(/^["'`]+|["'`]+$/g,"").trim();
    u = u.replace(/&amp;/g,"&");
    return u;
  }

  function imageBlock(url, alt, featured){
    const u = normalizeImageUrl(url);
    if(!u) return `<div class="placeholder">📰</div>`;
    return `
      <div class="news-image-wrap${featured ? "" : ""}">
        <img class="news-image"
             src="${esc(u)}"
             alt="${esc(alt)}"
             loading="lazy"
             decoding="async"
             referrerpolicy="no-referrer"
             onerror="this.style.display='none';this.parentElement.classList.add('image-failed')">
        <div class="image-fallback">📰</div>
      </div>`;
  }

  // Date
  const date = $("#dateText");
  if(date){
    date.textContent = new Intl.DateTimeFormat("hi-IN",{dateStyle:"full"}).format(new Date());
  }

  // Ticker
  const ticker = $("#ticker");
  const tickerItems = [
    "उत्तर प्रदेश की बड़ी खबरें अब एक ही मंच पर",
    "अयोध्या • काशी • मथुरा से धर्म और संस्कृति की अपडेट",
    "सरकार • विपक्ष • जनता — खबरों का पूरा संदर्भ",
    "सनातन संवाद — तथ्यों के साथ भारत और भारतीय संस्कृति की आवाज़"
  ];
  let t = 0;
  if(ticker){
    ticker.textContent = tickerItems[0];
    setInterval(() => {
      t = (t + 1) % tickerItems.length;
      ticker.textContent = tickerItems[t];
    }, 3500);
  }

  // Mobile menu
  const menu = $("#menuBtn"), nav = $("#nav");
  if(menu && nav){
    menu.addEventListener("click", () => nav.classList.toggle("open"));
    nav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => nav.classList.remove("open")));
  }

  async function loadNews(){
    const grid = $("#newsGrid");
    if(!grid) return;

    try{
      const url = window.SUPABASE_URL;
      const key = window.SUPABASE_PUBLISHABLE_KEY || window.SUPABASE_ANON_KEY;

      // Keep the existing live config untouched.
      if(!url || !key || !window.supabase?.createClient){
        console.log("Live news config is not available.");
        return;
      }

      const client = window.supabase.createClient(url,key);
      const {data,error} = await client
        .from("news")
        .select("id,category,title,excerpt,content,image_url,published,published_at,created_at")
        .eq("published",true)
        .order("published_at",{ascending:false,nullsFirst:false})
        .order("created_at",{ascending:false})
        .limit(12);

      if(error){
        console.error("Supabase news error:",error);
        return;
      }
      if(!data?.length) return;

      grid.innerHTML = data.map((n,i) => `
        <article class="news-card ${i===0 ? "featured" : ""}" data-news-id="${esc(n.id || "")}">
          ${imageBlock(n.image_url,n.title || "सनातन संवाद",i===0)}
          <div class="pad">
            <span>${esc(n.category || "उत्तर प्रदेश")}</span>
            <h3>${esc(n.title || "")}</h3>
            <p>${esc(n.excerpt || "")}</p>
          </div>
        </article>
      `).join("");

    }catch(err){
      console.error("News feed failed:",err);
    }
  }

  // Make external image links safe without changing the stored DB value.
  document.addEventListener("error",(e)=>{
    const img=e.target;
    if(img?.tagName==="IMG" && img.classList.contains("news-image")){
      img.style.display="none";
      img.parentElement?.classList.add("image-failed");
    }
  },true);

  loadNews();
})();
