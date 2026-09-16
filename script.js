const $ = (s) => document.querySelector(s);

const dateEl = $("#dateText");
if (dateEl) dateEl.textContent = new Intl.DateTimeFormat("hi-IN", { dateStyle: "full" }).format(new Date());

const ticker = $("#ticker");
const headlines = [
  "उत्तर प्रदेश की बड़ी खबरें अब एक ही मंच पर",
  "अयोध्या • काशी • मथुरा से धर्म और संस्कृति की अपडेट",
  "सरकार, विपक्ष और जनता — खबरों का पूरा संदर्भ"
];
let ti = 0;
setInterval(() => {
  ti = (ti + 1) % headlines.length;
  if (ticker) ticker.textContent = headlines[ti];
}, 3500);

const nav = $("#nav");
const menu = $("#menuBtn");
if (menu) menu.onclick = () => nav && nav.classList.toggle("open");

function esc(value) {
  return String(value ?? "").replace(/[&<>\"]/g, (m) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;"
  }[m]));
}

function normalizeImageUrl(value) {
  const v = String(value || "").trim();
  if (!v) return "";
  if (/^https?:\/\//i.test(v)) return v;
  const base = String(window.SUPABASE_URL || "").replace(/\/$/, "");
  if (!base) return v;
  return `${base}/storage/v1/object/public/news-images/${v.replace(/^\/+/, "")}`;
}

function imageMarkup(url, height) {
  if (!url) return `<div class="placeholder">📰</div>`;
  const safe = esc(url);
  return `<img loading="lazy" decoding="async" style="height:${height}px" src="${safe}" alt="" onerror="this.style.display='none';this.nextElementSibling.style.display='grid'"/><div class="placeholder" style="height:${height}px;display:none">📰</div>`;
}

async function loadNews() {
  try {
    if (!window.SUPABASE_URL || !window.SUPABASE_PUBLISHABLE_KEY) return;
    if (!window.supabase?.createClient) return;

    const client = window.supabase.createClient(
      window.SUPABASE_URL,
      window.SUPABASE_PUBLISHABLE_KEY
    );

    const { data, error } = await client
      .from("news")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false })
      .limit(12);

    if (error) {
      console.warn("Sanatan Samvad news feed:", error.message);
      return;
    }
    if (!data?.length) return;

    const grid = $("#newsGrid");
    if (!grid) return;

    grid.innerHTML = data.map((n, i) => {
      const imageUrl = normalizeImageUrl(n.image_url);
      return `<article class="news-card ${i === 0 ? "featured" : ""}">
        ${imageMarkup(imageUrl, i === 0 ? 230 : 170)}
        <div class="pad">
          <span>${esc(n.category || "उत्तर प्रदेश")}</span>
          <h3>${esc(n.title || "")}</h3>
          <p>${esc(n.excerpt || "")}</p>
        </div>
      </article>`;
    }).join("");
  } catch (e) {
    console.warn("Sanatan Samvad news feed not ready:", e);
  }
}

loadNews();
