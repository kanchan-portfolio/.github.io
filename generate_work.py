import json
import os

categories = [
    {
        'id': 'cat-editorial',
        'title': 'High-Fashion Editorial',
        'subtitle': 'Fashion & Editorial Styling',
        'desc': 'High-fashion portraiture, creative styling, and expressive character poses in contemporary studio aesthetic.',
        'items': [
            {'src': 'assets/slide_10_1.jpg', 'tag': 'Editorial', 'title': 'High-Fashion Editorial Portrait', 'type': 'photo'},
            {'src': 'assets/slide_10_2.jpg', 'tag': 'Editorial', 'title': 'Contemporary Haute Couture', 'type': 'photo'},
            {'src': 'assets/slide_10_3.jpg', 'tag': 'Editorial', 'title': 'Avant-Garde Silhouette', 'type': 'photo'},
            {'src': 'assets/slide_10_4.jpg', 'tag': 'Editorial', 'title': 'Editorial Form & Texture', 'type': 'photo'},
        ]
    },
    {
        'id': 'cat-studio',
        'title': 'Studio Lighting Series',
        'subtitle': 'Studio Lighting & Form',
        'desc': 'Studio lighting setups, wide and intimate character compositions, prop compositions, and expressive poses.',
        'items': [
            {'src': 'assets/slide_5_1.jpg', 'tag': 'Studio', 'title': 'Sculptural Rim Lighting', 'type': 'photo'},
            {'src': 'assets/slide_5_2.jpg', 'tag': 'Studio', 'title': 'Dramatic Chiaroscuro Form', 'type': 'photo'},
            {'src': 'assets/slide_5_3.jpg', 'tag': 'Studio', 'title': 'Soft Diffused Key Light', 'type': 'photo'},
            {'src': 'assets/slide_5_4.jpg', 'tag': 'Studio', 'title': 'Studio Shadow & Symmetry', 'type': 'photo'},
            {'src': 'assets/slide_5_5.jpg', 'tag': 'Studio', 'title': 'Intimate Contour Study', 'type': 'photo'},
            {'src': 'assets/slide_5_6.jpg', 'tag': 'Studio', 'title': 'Atmospheric Studio Portrait', 'type': 'photo'},
            {'src': 'assets/slide_5_7.jpg', 'tag': 'Studio', 'title': 'Directional High-Contrast Form', 'type': 'photo'},
            {'src': 'assets/slide_5_8.jpg', 'tag': 'Studio', 'title': 'Minimalist Posing Study', 'type': 'photo'},
            {'src': 'assets/slide_5_9.jpg', 'tag': 'Studio', 'title': 'Expressive Gestural Pose', 'type': 'photo'},
            {'src': 'assets/slide_5_10.jpg', 'tag': 'Studio', 'title': 'Low-Key Edge Illumination', 'type': 'photo'},
            {'src': 'assets/slide_5_11.jpg', 'tag': 'Studio', 'title': 'Cinematic Fill Lighting', 'type': 'photo'},
            {'src': 'assets/slide_5_12.jpg', 'tag': 'Studio', 'title': 'Studio Monochrome Contrast', 'type': 'photo'},
            {'src': 'assets/slide_5_13.jpg', 'tag': 'Studio', 'title': 'Balanced Ambient Composition', 'type': 'photo'},
        ]
    },
    {
        'id': 'cat-mood-styling',
        'title': 'Mood & Styling Series',
        'subtitle': 'Atmospheric & Visual Narratives',
        'desc': 'Natural daylight styling, atmospheric textures, outdoor narratives, and editorial lookbooks.',
        'items': [
            {'src': 'assets/slide_6_1.jpg', 'tag': 'Mood', 'title': 'Natural Daylight Mood', 'type': 'photo'},
            {'src': 'assets/slide_6_2.jpg', 'tag': 'Mood', 'title': 'Golden Hour Atmosphere', 'type': 'photo'},
            {'src': 'assets/slide_6_3.jpg', 'tag': 'Mood', 'title': 'Subtle Color Palette', 'type': 'photo'},
            {'src': 'assets/slide_6_4.jpg', 'tag': 'Mood', 'title': 'Earthy Tonal Harmony', 'type': 'photo'},
            {'src': 'assets/slide_7_1.jpg', 'tag': 'Styling', 'title': 'Contemporary Street Styling', 'type': 'photo'},
            {'src': 'assets/slide_7_2.jpg', 'tag': 'Styling', 'title': 'Urban Editorial Narrative', 'type': 'photo'},
            {'src': 'assets/slide_7_3.jpg', 'tag': 'Styling', 'title': 'Textured Fabric Expression', 'type': 'photo'},
            {'src': 'assets/slide_7_4.jpg', 'tag': 'Styling', 'title': 'Modern Wardrobe Direction', 'type': 'photo'},
            {'src': 'assets/slide_7_5.jpg', 'tag': 'Styling', 'title': 'Cinematic Natural Pose', 'type': 'photo'},
        ]
    },
    {
        'id': 'cat-ambient-light',
        'title': 'Ambient Light Series',
        'subtitle': 'Natural Shadows & Tonal Depth',
        'desc': 'Directional soft light, warm shadows, cinematic rim lighting, and organic mood portraits.',
        'items': [
            {'src': 'assets/slide_8_1.jpg', 'tag': 'Ambient', 'title': 'Organic Daylight Reflections', 'type': 'photo'},
            {'src': 'assets/slide_8_2.jpg', 'tag': 'Ambient', 'title': 'Warm Window Illumination', 'type': 'photo'},
            {'src': 'assets/slide_8_3.jpg', 'tag': 'Ambient', 'title': 'Muted Natural Shadows', 'type': 'photo'},
            {'src': 'assets/slide_8_4.jpg', 'tag': 'Ambient', 'title': 'Atmospheric Depth & Grain', 'type': 'photo'},
            {'src': 'assets/slide_9_1.jpg', 'tag': 'Ambient', 'title': 'Gentle Ambient Glow', 'type': 'photo'},
        ]
    },
    {
        'id': 'cat-character',
        'title': 'Character Studies',
        'subtitle': 'Dramatic Wardrobe & Angles',
        'desc': 'Contemporary character exploration, dynamic camera angles, and editorial expressions.',
        'items': [
            {'src': 'assets/slide_11_1.jpg', 'tag': 'Character', 'title': 'Intense Character Gaze', 'type': 'photo'},
            {'src': 'assets/slide_11_2.jpg', 'tag': 'Character', 'title': 'Dynamic Profile Perspective', 'type': 'photo'},
            {'src': 'assets/slide_11_3.jpg', 'tag': 'Character', 'title': 'Cinematic Character Presence', 'type': 'photo'},
            {'src': 'assets/slide_11_4.jpg', 'tag': 'Character', 'title': 'Subtle Emotional Nuance', 'type': 'photo'},
            {'src': 'assets/slide_11_5.jpg', 'tag': 'Character', 'title': 'Expressive Character Stance', 'type': 'photo'},
            {'src': 'assets/slide_12_1.jpg', 'tag': 'Character', 'title': 'Dramatic Facial Contours', 'type': 'photo'},
            {'src': 'assets/slide_12_2.jpg', 'tag': 'Character', 'title': 'Introspective Close-Up', 'type': 'photo'},
            {'src': 'assets/slide_12_3.jpg', 'tag': 'Character', 'title': 'Bold Cinematic Expression', 'type': 'photo'},
            {'src': 'assets/slide_12_4.jpg', 'tag': 'Character', 'title': 'Candid Performance Mood', 'type': 'photo'},
            {'src': 'assets/slide_12_5.jpg', 'tag': 'Character', 'title': 'Poised Editorial Attitude', 'type': 'photo'},
        ]
    },
    {
        'id': 'cat-monochrome',
        'title': 'Monochromes & Tone',
        'subtitle': 'Black & White Cinematography Stills',
        'desc': 'High-contrast black & white tones, silhouettes, structural shadow play, and intimate portraits.',
        'items': [
            {'src': 'assets/slide_13_1.jpg', 'tag': 'Monochrome', 'title': 'Deep Monochrome Contrast', 'type': 'photo'},
            {'src': 'assets/slide_13_2.jpg', 'tag': 'Monochrome', 'title': 'Monochrome Shadow Play', 'type': 'photo'},
            {'src': 'assets/slide_13_3.jpg', 'tag': 'Monochrome', 'title': 'High-Contrast Silhouette', 'type': 'photo'},
            {'src': 'assets/slide_13_4.jpg', 'tag': 'Monochrome', 'title': 'Silver Gelatin Tone', 'type': 'photo'},
            {'src': 'assets/slide_13_5.jpg', 'tag': 'Monochrome', 'title': 'Architectural Light & Shade', 'type': 'photo'},
            {'src': 'assets/slide_13_6.jpg', 'tag': 'Monochrome', 'title': 'Sculpted Monochromatic Form', 'type': 'photo'},
            {'src': 'assets/slide_14_1.jpg', 'tag': 'Monochrome', 'title': 'Minimalist Shadow Profile', 'type': 'photo'},
            {'src': 'assets/slide_14_2.jpg', 'tag': 'Monochrome', 'title': 'Noir Atmospheric Still', 'type': 'photo'},
            {'src': 'assets/slide_14_3.jpg', 'tag': 'Monochrome', 'title': 'Tonal Gradient Portrait', 'type': 'photo'},
            {'src': 'assets/slide_14_4.jpg', 'tag': 'Monochrome', 'title': 'Dynamic Light Refraction', 'type': 'photo'},
        ]
    },
    {
        'id': 'cat-limited-edition',
        'title': 'Editorial Concept Collection',
        'subtitle': 'Concept Direction & Cover Production',
        'desc': 'Editorial concept artwork and official portfolio cover visual direction.',
        'items': [
            {'src': 'assets/slide_15_1.jpg', 'tag': 'Concept', 'title': 'Futuristic Concept Artwork', 'type': 'photo'},
            {'src': 'assets/slide_1_1.jpg', 'tag': 'Cover', 'title': 'Portfolio Cover Visual Direction', 'type': 'photo'},
        ]
    },
    {
        'id': 'cat-songti',
        'title': 'Songti Cinematography Stills',
        'subtitle': 'Film Stills & Color Grading',
        'desc': 'Cinematography production stills, color graded imagery, and narrative film cinematography.',
        'items': [
            {'src': 'assets/slide_7_1.jpg', 'tag': 'Cinematography', 'title': 'Songti Film Production Still', 'type': 'photo'},
            {'src': 'assets/slide_7_2.jpg', 'tag': 'Cinematography', 'title': 'Songti Color Grade Framing', 'type': 'photo'},
            {'src': 'assets/slide_7_3.jpg', 'tag': 'Cinematography', 'title': 'Songti Narrative Scene Study', 'type': 'photo'},
            {'src': 'assets/slide_7_4.jpg', 'tag': 'Cinematography', 'title': 'Songti Cinematic Atmosphere', 'type': 'photo'},
            {'src': 'assets/slide_7_5.jpg', 'tag': 'Cinematography', 'title': 'Songti Director Visual Frame', 'type': 'photo'},
        ]
    },
    {
        'id': 'cat-kiff',
        'title': 'KIFF Celebrity Podcasts & Masterclasses',
        'subtitle': 'Video Editing & Broadcast Sound',
        'desc': '4K multi-cam editing, interview pacing, audio cleanup, and color mastering for film festival dialogues.',
        'items': [
            {'src': 'assets/yt_anupam_kher.jpg', 'tag': 'Masterclass', 'title': 'Anupam Kher Unfiltered — Acting Masterclass', 'type': 'video', 'videoId': 'Sh0jTGE660o'},
            {'src': 'assets/yt_saurabh_shukla.jpg', 'tag': 'Screenwriting', 'title': 'Saurabh Shukla — Screenwriting & Satya', 'type': 'video', 'videoId': 'ojgap437XT8'},
            {'src': 'assets/yt_subhash_sehgal.jpg', 'tag': 'Film Editing', 'title': 'Subhash Sehgal — Film Editing Masterclass', 'type': 'video', 'videoId': 'AWiazyKn8ak'},
            {'src': 'assets/yt_deepshikha_nagpal.jpg', 'tag': 'Direction', 'title': 'Deepshikha Nagpal — Industry & Direction', 'type': 'video', 'videoId': 'hcNVkH6HhVk'},
        ]
    }
]

html = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <title>Works Archive — Kanchan Choudhary®</title>
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover"/>
  <meta content="The complete works archive of Kanchan Choudhary. High-resolution uncropped photographs and 4K celebrity masterclasses across curated visual disciplines." name="description"/>
  <meta content="Works Archive — Kanchan Choudhary®" property="og:title"/>
  <meta content="The complete works archive of Kanchan Choudhary. High-resolution uncropped photographs and 4K celebrity masterclasses across curated visual disciplines." property="og:description"/>
  <meta content="assets/slide_10_1.jpg" property="og:image"/>

  <!-- Google Fonts: Plus Jakarta Sans & Newsreader -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,300;0,6..72,400;0,6..72,500;1,6..72,300;1,6..72,400&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">

  <!-- Shared Cosmos Theme Stylesheet -->
  <link rel="stylesheet" href="css/cosmos.css">

  <style>
    /* Work Page Specific Cosmos Styles */
    .work-hero-header {{
      text-align: center;
      padding: 130px 20px 50px 20px;
      max-width: 900px;
      margin: 0 auto;
    }}

    .work-page-title {{
      font-family: var(--font-serif);
      font-size: clamp(2.8rem, 6.5vw, 5.2rem);
      font-weight: 400;
      letter-spacing: -0.02em;
      line-height: 1.05;
      margin-bottom: 16px;
    }}

    .work-page-subtitle {{
      font-size: clamp(1rem, 1.8vw, 1.25rem);
      color: var(--text-secondary);
      max-width: 650px;
      margin: 0 auto;
      line-height: 1.6;
    }}

    /* Category Section Layout */
    .work-category-section {{
      max-width: 1280px;
      margin: 0 auto 90px auto;
      padding: 0 24px;
      scroll-margin-top: 100px;
    }}

    .category-section-header {{
      display: flex;
      flex-direction: column;
      border-bottom: 1px solid var(--card-border);
      padding-bottom: 18px;
      margin-bottom: 32px;
      gap: 8px;
    }}

    .cat-title-group {{
      display: flex;
      align-items: baseline;
      gap: 14px;
      flex-wrap: wrap;
    }}

    .cat-heading {{
      font-family: var(--font-serif);
      font-size: clamp(1.8rem, 3.4vw, 2.6rem);
      font-weight: 400;
      color: var(--text-primary);
      margin: 0;
      letter-spacing: -0.01em;
    }}

    .cat-desc-row {{
      width: 100%;
      font-size: 14px;
      color: var(--text-secondary);
      line-height: 1.6;
    }}

    /* Friendly Photo Cards Grid — 100% Full Uncropped View */
    .work-cards-grid {{
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 28px;
    }}

    @media (max-width: 768px) {{
      .work-cards-grid {{
        grid-template-columns: 1fr;
        gap: 20px;
      }}
      .work-category-section {{
        padding: 0 16px;
        margin-bottom: 60px;
      }}
    }}

    .photo-card-wrapper {{
      display: flex;
      flex-direction: column;
      border-radius: 16px;
      overflow: hidden;
      background: var(--card-bg-solid);
      border: 1px solid var(--card-border);
      box-shadow: var(--shadow-card);
      cursor: pointer;
      transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.25s, box-shadow 0.3s;
      text-decoration: none;
      color: inherit;
    }}

    .photo-card-wrapper:hover {{
      transform: translateY(-6px);
      border-color: var(--card-border-hover);
      box-shadow: 0 24px 60px rgba(0, 0, 0, 0.4);
    }}

    /* Friendly container — ALWAYS CONTAIN, NEVER CROP */
    .photo-friendly-container {{
      width: 100%;
      aspect-ratio: 3 / 4;
      background-color: #090a0f;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      overflow: hidden;
      padding: 14px;
      box-sizing: border-box;
    }}

    .photo-friendly-container.is-video {{
      aspect-ratio: 16 / 9;
    }}

    .photo-friendly-container img {{
      max-width: 100%;
      max-height: 100%;
      width: auto;
      height: auto;
      object-fit: contain !important; /* CRITICAL: 100% FULL UNCLIPPED IMAGE */
      display: block;
      margin: auto;
      filter: drop-shadow(0 4px 14px rgba(0,0,0,0.6));
      transition: transform 0.3s ease;
    }}

    .photo-card-wrapper:hover .photo-friendly-container img {{
      transform: scale(1.03);
    }}

    .photo-zoom-hint {{
      position: absolute;
      bottom: 12px;
      right: 12px;
      background: var(--badge-bg);
      color: var(--badge-text);
      font-size: 11px;
      font-weight: 600;
      padding: 3px 8px;
      border-radius: 6px;
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      pointer-events: none;
    }}

    .video-play-badge {{
      position: absolute;
      top: 12px;
      left: 12px;
      background: #e50914;
      color: #fff;
      font-size: 11px;
      font-weight: 600;
      padding: 4px 10px;
      border-radius: 6px;
      backdrop-filter: blur(8px);
      pointer-events: none;
    }}

    .photo-card-meta {{
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 14px 18px;
      border-top: 1px solid var(--card-border);
      font-size: 13px;
    }}

    .meta-tag-pill {{
      font-size: 11px;
      color: var(--text-muted);
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }}

    .meta-title {{
      color: var(--text-primary);
      font-weight: 500;
      margin: 0 10px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      flex-grow: 1;
    }}

    .meta-badge {{
      color: var(--text-secondary);
      font-size: 11px;
      font-weight: 500;
    }}
  </style>
</head>
<body>

  <!-- =========================================================================
       FLOATING TOP NAVIGATION PILL (Exact: Home, Works, Get in touch)
       ========================================================================= -->
  <div class="cosmos-nav-wrapper">
    <nav class="cosmos-nav">
      <a href="index.html" class="nav-brand">KANCHAN<span style="font-size:0.7em; vertical-align:super;">®</span></a>
      <div class="nav-links">
        <a href="index.html" class="nav-link">Home</a>
        <a href="work.html" class="nav-link active">Works</a>
      </div>
      <a href="mailto:kanchanc0410@gmail.com" class="nav-cta-btn">Get in touch</a>
    </nav>
  </div>


  <!-- =========================================================================
       BOTTOM FLOATING CONTROLS: Dark | Light Switch
       ========================================================================= -->
  <div class="bottom-controls-left">
    <div class="theme-pill-switch">
      <button type="button" class="theme-btn active" id="theme-btn-dark" aria-label="Dark Mode">
        <svg viewBox="0 0 24 24" fill="currentColor" width="12" height="12"><path d="M21.64 13a1 1 0 0 0-1.05-.14 8.05 8.05 0 0 1-3.37.73A8.15 8.15 0 0 1 9.08 5.49a8.59 8.59 0 0 1 .25-2A1 1 0 0 0 8 2.36a10.14 10.14 0 1 0 14 11.69 1 1 0 0 0-.36-1.05z"/></svg>
        Dark
      </button>
      <button type="button" class="theme-btn" id="theme-btn-light" aria-label="Light Mode">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12" height="12"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
        Light
      </button>
    </div>
  </div>


  <!-- =========================================================================
       HERO HEADER FOR WORKS PAGE
       ========================================================================= -->
  <header class="work-hero-header">
    <h1 class="work-page-title">The Complete Archive</h1>
    <p class="work-page-subtitle">
      Uncropped photographs and 4K celebrity masterclasses across curated visual disciplines.
    </p>
  </header>


  <!-- =========================================================================
       MAIN WORK COLLECTIONS (100% Uncropped Photo Cards)
       ========================================================================= -->
  <main id="works-container">
"""

for c in categories:
    html += f"""
    <!-- Category Section: {c['title']} -->
    <section class="work-category-section" id="{c['id']}" data-category="{c['id']}">
      <div class="category-section-header">
        <div class="cat-title-group">
          <h2 class="cat-heading">{c['title']}</h2>
        </div>
        <div class="cat-desc-row">{c['desc']}</div>
      </div>

      <div class="work-cards-grid">
"""
    for item in c['items']:
        is_video = item.get('type') == 'video'
        video_id = item.get('videoId', '')
        badge_html = '<div class="video-play-badge">&#9658; 4K VIDEO</div>' if is_video else '<div class="photo-zoom-hint">[+] VIEW FULL</div>'
        meta_tag = '[4K Video]' if is_video else '[High-Res]'
        container_class = 'photo-friendly-container is-video' if is_video else 'photo-friendly-container'

        html += f"""        <div class="photo-card-wrapper" data-src="{item['src']}" data-title="{item['title']}" data-cat="{c['title']}" data-video-id="{video_id}">
          <div class="{container_class}">
            <img src="{item['src']}" alt="{item['title']}" loading="lazy" decoding="async"/>
            {badge_html}
          </div>
          <div class="photo-card-meta">
            <span class="meta-tag-pill">{item['tag']}</span>
            <span class="meta-title">{item['title']}</span>
            <span class="meta-badge">{meta_tag}</span>
          </div>
        </div>
"""

    html += """      </div>
    </section>
"""

html += f"""
    <!-- Return to Home Action Button -->
    <div style="text-align: center; margin: 60px 0 100px 0;">
      <a href="index.html" class="craft-pill" style="padding: 14px 34px; font-weight: 600; font-size: 14px;">
        &larr; Return to Universe Home
      </a>
    </div>

  </main>


  <!-- =========================================================================
       GIANT FOOTER (Matching Homepage)
       ========================================================================= -->
  <footer class="cosmos-footer">
    <div class="footer-top-grid">

      <!-- Col 1: Quote -->
      <div>
        <p class="footer-quote">
          ✦ Kanchan Choudhary is the visual storyteller you've been searching for.
        </p>
      </div>

      <!-- Col 2: Navigation -->
      <div>
        <div class="footer-col-title">Exhibition</div>
        <div class="footer-links-list">
          <a href="index.html">Universe Home</a>
          <a href="work.html">The Complete Archive</a>
          <a href="work.html#cat-editorial">High-Fashion</a>
          <a href="work.html#cat-kiff">KIFF Podcasts</a>
        </div>
      </div>

      <!-- Col 3: Disciplines -->
      <div>
        <div class="footer-col-title">Disciplines</div>
        <div class="footer-links-list">
          <a href="work.html#cat-studio">Studio Lighting</a>
          <a href="work.html#cat-monochrome">Monochromes</a>
          <a href="work.html#cat-songti">Cinematography Stills</a>
          <a href="work.html#cat-limited-edition">Editorial Concept</a>
        </div>
      </div>

      <!-- Col 4: Contact -->
      <div>
        <div class="footer-col-title">Direct Inquiries</div>
        <div class="footer-links-list">
          <a href="mailto:kanchanc0410@gmail.com">kanchanc0410@gmail.com</a>
          <a href="tel:7977667004">+91 7977667004</a>
          <a href="https://www.youtube.com/watch?v=Sh0jTGE660o" target="_blank" rel="noopener">YouTube Masterclasses</a>
        </div>
      </div>

    </div>

    <!-- Giant Viewport Outline Typography -->
    <div class="giant-footer-brand">
      <span class="giant-footer-text">KANCHAN CHOUDHARY®</span>
    </div>

    <!-- Bottom Bar -->
    <div class="footer-bottom-bar">
      <div>&copy; 2026 Kanchan Choudhary. All rights reserved.</div>
      <div class="footer-availability">
        <span class="status-dot"></span>
        <span>Available for international commissions</span>
      </div>
      <div>Designed by 4-11 Studio</div>
    </div>
  </footer>


  <!-- =========================================================================
       FULLSCREEN LIGHTBOX MODAL & 4K VIDEO LIGHTBOX
       ========================================================================= -->
  <div id="cosmos-lightbox">
    <div class="lightbox-dialog">

      <div class="lightbox-header">
        <div class="lightbox-meta">
          <span class="lightbox-title" id="lightbox-title">Photograph Exhibition</span>
        </div>
        <button type="button" class="lightbox-close-btn" id="lightbox-close">Close &times;</button>
      </div>

      <div class="lightbox-body" id="lightbox-body">
        <img src="" alt="" class="lightbox-img" id="lightbox-img"/>
        <div class="lightbox-video-container" id="lightbox-video" style="display:none;"></div>
      </div>

      <div class="lightbox-footer">
        <button type="button" class="lightbox-nav-btn" id="lb-prev">&larr; Previous</button>
        <span style="font-size:12px; color:var(--text-muted); letter-spacing: 0.05em; text-transform: uppercase;">Kanchan Choudhary Archive</span>
        <button type="button" class="lightbox-nav-btn" id="lb-next">Next &rarr;</button>
      </div>

    </div>
  </div>


  <!-- =========================================================================
       INTERACTIVE SCRIPTS (Theme Switcher & Lightbox)
       ========================================================================= -->
  <script>
    document.addEventListener('DOMContentLoaded', () => {{
      // 1. Theme Switcher Sync with localStorage
      const darkBtn = document.getElementById('theme-btn-dark');
      const lightBtn = document.getElementById('theme-btn-light');

      function setTheme(theme) {{
        if (theme === 'light') {{
          document.body.classList.add('light-theme');
          if (lightBtn) lightBtn.classList.add('active');
          if (darkBtn) darkBtn.classList.remove('active');
          localStorage.setItem('cosmos-theme', 'light');
        }} else {{
          document.body.classList.remove('light-theme');
          if (darkBtn) darkBtn.classList.add('active');
          if (lightBtn) lightBtn.classList.remove('active');
          localStorage.setItem('cosmos-theme', 'dark');
        }}
      }}

      const savedTheme = localStorage.getItem('cosmos-theme') || 'dark';
      setTheme(savedTheme);

      if (darkBtn) darkBtn.addEventListener('click', () => setTheme('dark'));
      if (lightBtn) lightBtn.addEventListener('click', () => setTheme('light'));

      // 2. Fullscreen Lightbox & 4K Video Player
      const lightbox = document.getElementById('cosmos-lightbox');
      const lightboxImg = document.getElementById('lightbox-img');
      const lightboxVideo = document.getElementById('lightbox-video');
      const lightboxTitle = document.getElementById('lightbox-title');
      const closeBtn = document.getElementById('lightbox-close');
      const lbPrev = document.getElementById('lb-prev');
      const lbNext = document.getElementById('lb-next');

      const allCards = Array.from(document.querySelectorAll('.photo-card-wrapper'));
      let currentIndex = 0;

      function openCard(card) {{
        if (!card || !lightbox) return;
        currentIndex = allCards.indexOf(card);
        const src = card.getAttribute('data-src');
        const title = card.getAttribute('data-title') || 'Photograph';
        const videoId = card.getAttribute('data-video-id');

        if (lightboxTitle) lightboxTitle.textContent = title;

        if (videoId) {{
          if (lightboxImg) lightboxImg.style.display = 'none';
          if (lightboxVideo) {{
            lightboxVideo.style.display = 'block';
            lightboxVideo.innerHTML = `
              <iframe src="https://www.youtube.com/embed/${{videoId}}?autoplay=1&rel=0&enablejsapi=1" 
                title="4K Video Player"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen 
                style="width:100%; height:100%; border-radius:10px; border:0;">
              </iframe>
            `;
          }}
        }} else {{
          if (lightboxVideo) {{
            lightboxVideo.style.display = 'none';
            lightboxVideo.innerHTML = '';
          }}
          if (lightboxImg) {{
            lightboxImg.style.display = 'block';
            lightboxImg.src = src;
            lightboxImg.alt = title;
          }}
        }}

        lightbox.style.display = 'flex';
        document.body.style.overflow = 'hidden';
      }}

      function closeLightbox() {{
        if (!lightbox) return;
        lightbox.style.display = 'none';
        if (lightboxVideo) lightboxVideo.innerHTML = '';
        document.body.style.overflow = '';
      }}

      allCards.forEach(card => {{
        card.addEventListener('click', (e) => {{
          e.preventDefault();
          openCard(card);
        }});
      }});

      if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
      if (lbPrev) {{
        lbPrev.addEventListener('click', () => {{
          currentIndex = (currentIndex - 1 + allCards.length) % allCards.length;
          openCard(allCards[currentIndex]);
        }});
      }}
      if (lbNext) {{
        lbNext.addEventListener('click', () => {{
          currentIndex = (currentIndex + 1) % allCards.length;
          openCard(allCards[currentIndex]);
        }});
      }}

      if (lightbox) {{
        lightbox.addEventListener('click', (e) => {{
          if (e.target === lightbox) closeLightbox();
        }});
      }}

      document.addEventListener('keydown', (e) => {{
        if (lightbox && lightbox.style.display === 'flex') {{
          if (e.key === 'Escape') closeLightbox();
          if (e.key === 'ArrowLeft' && lbPrev) lbPrev.click();
          if (e.key === 'ArrowRight' && lbNext) lbNext.click();
        }}
      }});
    }});
  </script>
</body>
</html>
"""

with open('work.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("Successfully generated work.html with professional titles and zero number counts!")
