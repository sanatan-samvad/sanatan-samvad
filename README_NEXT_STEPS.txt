सनातन संवाद — LIVE NEWS PORTAL

अब package में ये काम पूरे हैं:
✓ Public news website
✓ Supabase database connection
✓ Admin email/password login
✓ News create / edit / delete
✓ Published या Draft status
✓ Direct mobile photo upload to Supabase Storage
✓ Public article popup with full story + photo
✓ Search + category filter
✓ Public page auto-refreshes every 30 seconds
✓ Free GitHub Pages hosting ready

आपको सिर्फ account-side setup करना है:

1) SUPABASE
- Supabase में अपना project खोलें.
- Authentication > Users में अपना admin email/password user बनाएं.
- उस user की UUID copy करें.
- supabase_setup.sql में हर जगह YOUR_ADMIN_USER_UUID को उसी UUID से replace करें.
- पूरा SQL Editor में Run करें.
- Project URL और Publishable key लें.
- config.js में:
  window.SUPABASE_URL = "...";
  window.SUPABASE_PUBLISHABLE_KEY = "...";
- Secret/service_role key कभी config.js में न डालें.

2) GITHUB PAGES — FREE
- GitHub पर नया PUBLIC repository बनाएं.
- इस folder की सारी files root में upload करें.
- Settings > Pages > Deploy from branch > main / root चुनें.
- कुछ समय बाद आपका free github.io URL बन जाएगा.

3) ADMIN
- आपकी site: https://USERNAME.github.io/REPOSITORY/
- Admin: https://USERNAME.github.io/REPOSITORY/admin.html
- Mobile से login करें → headline → पूरी खबर → photo → Published → Save.

महत्वपूर्ण:
- GitHub Pages static HTML/CSS/JS host करता है; database/auth Supabase संभालता है.
- Browser में केवल Supabase Publishable key रखें. Secret/service_role key browser में नहीं डालनी है.
