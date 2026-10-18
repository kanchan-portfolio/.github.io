import json
import os

categories = [
    {
        'id': 'cat-editorial',
        'code': '01',
        'title': 'Photoshoot • High-Fashion Editorial',
        'subtitle': 'Fashion & Editorial Styling',
        'desc': 'High-fashion portraiture, creative styling, and expressive character poses in contemporary studio aesthetic.',
        'items': [
            {'src': 'assets/slide_10_1.jpg', 'tag': 'Editorial', 'num': '01', 'title': 'High-Fashion Portrait I', 'type': 'photo'},
            {'src': 'assets/slide_10_2.jpg', 'tag': 'Editorial', 'num': '02', 'title': 'High-Fashion Portrait II', 'type': 'photo'},
            {'src': 'assets/slide_10_3.jpg', 'tag': 'Editorial', 'num': '03', 'title': 'High-Fashion Portrait III', 'type': 'photo'},
            {'src': 'assets/slide_10_4.jpg', 'tag': 'Editorial', 'num': '04', 'title': 'High-Fashion Portrait IV', 'type': 'photo'},
        ]
    },
    {
        'id': 'cat-studio',
        'code': '02',
        'title': 'Photoshoot • Studio Lighting Series',
        'subtitle': 'Studio Lighting & Form',
        'desc': 'Studio lighting setups, wide and intimate character framing, prop compositions, and expressive poses.',
        'items': [
            {'src': f'assets/slide_5_{i}.jpg', 'tag': 'Studio', 'num': f'{i:02d}', 'title': f'Studio Study {i:02d}', 'type': 'photo'}
            for i in range(1, 14)
        ]
    },
    {
        'id': 'cat-mood-styling',
        'code': '03',
        'title': 'Photoshoot • Mood & Styling Series',
        'subtitle': 'Atmospheric & Visual Narratives',
        'desc': 'Natural daylight styling, atmospheric textures, outdoor narratives, and editorial lookbooks.',
        'items': [
            {'src': f'assets/slide_6_{i}.jpg', 'tag': 'Mood', 'num': f'{i:02d}', 'title': f'Mood Framing {i:02d}', 'type': 'photo'}
            for i in range(1, 5)
        ] + [
            {'src': f'assets/slide_7_{i}.jpg', 'tag': 'Styling', 'num': f'{i:02d}', 'title': f'Styling Study {i:02d}', 'type': 'photo'}
            for i in range(1, 6)
        ]
    },
    {
        'id': 'cat-ambient-light',
        'code': '04',
        'title': 'Photoshoot • Ambient Light Series',
        'subtitle': 'Natural Shadows & Tonal Depth',
        'desc': 'Directional soft light, warm shadows, cinematic rim lighting, and organic mood portraits.',
        'items': [
            {'src': f'assets/slide_8_{i}.jpg', 'tag': 'Ambient', 'num': f'{i:02d}', 'title': f'Ambient Study {i:02d}', 'type': 'photo'}
            for i in range(1, 5)
        ] + [
            {'src': 'assets/slide_9_1.jpg', 'tag': 'Ambient', 'num': '01', 'title': 'Ambient Portrait I', 'type': 'photo'}
        ]
    },
    {
        'id': 'cat-character',
        'code': '05',
        'title': 'Photoshoot • Character Studies',
        'subtitle': 'Dramatic Wardrobe & Angles',
        'desc': 'Contemporary character exploration, dynamic camera angles, and editorial expressions.',
        'items': [
            {'src': f'assets/slide_11_{i}.jpg', 'tag': 'Character', 'num': f'{i:02d}', 'title': f'Character Study {i:02d}', 'type': 'photo'}
            for i in range(1, 6)
        ] + [
            {'src': f'assets/slide_12_{i}.jpg', 'tag': 'Character', 'num': f'{i:02d}', 'title': f'Character Expression {i:02d}', 'type': 'photo'}
            for i in range(1, 6)
        ]
    },
    {
        'id': 'cat-monochrome',
        'code': '06',
        'title': 'Photoshoot • Monochromes & Tone',
        'subtitle': 'Black & White Cinematography Stills',
        'desc': 'High-contrast black & white tones, silhouettes, structural shadow play, and intimate portraits.',
        'items': [
            {'src': f'assets/slide_13_{i}.jpg', 'tag': 'Monochrome', 'num': f'{i:02d}', 'title': f'Monochrome {i:02d}', 'type': 'photo'}
            for i in range(1, 6)
        ] + [
            {'src': f'assets/slide_14_{i}.jpg', 'tag': 'Monochrome', 'num': f'{i:02d}', 'title': f'Monochrome Study {i:02d}', 'type': 'photo'}
            for i in range(1, 4)
        ]
    },
    {
        'id': 'cat-limited-2030',
        'code': '07',
        'title': 'Editorial Collection • Limited Edition 2030',
        'subtitle': 'Futuristic Concept & Cover Production',
        'desc': 'Editorial concept artwork and official portfolio cover visual direction.',
        'items': [
            {'src': 'assets/slide_15_1.jpg', 'tag': 'Edition 2030', 'num': '01', 'title': 'Limited Edition 2030 Feature', 'type': 'photo'},
            {'src': 'assets/slide_1_1.jpg', 'tag': 'Cover Concept', 'num': '01', 'title': 'Cover Portfolio Visual Direction', 'type': 'photo'}
        ]
    },
    {
        'id': 'cat-songti',
        'code': '08',
        'title': 'Songti Cinematography Still Frames',
        'subtitle': 'Film Stills & Color Grading',
        'desc': 'Cinematography production stills, color graded frames, and narrative film cinematography.',
        'items': [
            {'src': f'assets/slide_7_{i}.jpg', 'tag': 'Songti Still', 'num': f'{i:02d}', 'title': f'Songti Cinematic Frame {i:02d}', 'type': 'photo'}
            for i in range(1, 6)
        ]
    },
    {
        'id': 'cat-kiff',
        'code': '09',
        'title': 'KIFF Celebrity Podcasts & Masterclasses',
        'subtitle': 'Video Editing & Broadcast Sound',
        'desc': '4K multi-cam editing, interview pacing, audio cleanup, and color mastering for film festival dialogues.',
        'items': [
            {'src': 'assets/yt_anupam_kher.jpg', 'tag': 'KIFF Ep 01', 'num': '01', 'title': 'Anupam Kher Unfiltered — Acting Masterclass', 'type': 'video', 'videoId': 'Sh0jTGE660o'},
            {'src': 'assets/yt_saurabh_shukla.jpg', 'tag': 'KIFF Ep 02', 'num': '02', 'title': 'Saurabh Shukla — Screenwriting & Satya', 'type': 'video', 'videoId': 'ojgap437XT8'},
            {'src': 'assets/yt_subhash_sehgal.jpg', 'tag': 'KIFF Ep 03', 'num': '03', 'title': 'Subhash Sehgal — Film Editing Masterclass', 'type': 'video', 'videoId': 'AWiazyKn8ak'},
            {'src': 'assets/yt_deepshikha_nagpal.jpg', 'tag': 'KIFF Ep 04', 'num': '04', 'title': 'Deepshikha Nagpal — Industry & Direction', 'type': 'video', 'videoId': 'hcNVkH6HhVk'},
        ]
    }
]

total_frames = sum(len(c['items']) for c in categories)

html = f"""<!DOCTYPE html>
<html data-wf-domain="kanchan-portfolio.github.io" lang="en">
<head>
  <meta charset="utf-8"/>
  <title>Kanchan Choudhary — Work &amp; Full Exhibition (All Works)</title>
  <meta content="All works and categorized exhibition of Kanchan Choudhary. Uncropped high-resolution frames from High-Fashion Editorials, Studio Series, Monochromes, Songti stills, and KIFF celebrity podcasts." name="description"/>
  <meta content="Kanchan Choudhary — Work &amp; Full Exhibition" property="og:title"/>
  <meta content="All works and categorized exhibition of Kanchan Choudhary. Uncropped high-resolution frames from High-Fashion Editorials, Studio Series, Monochromes, Songti stills, and KIFF celebrity podcasts." property="og:description"/>
  <meta content="assets/slide_10_1.jpg" property="og:image"/>
  <meta content="width=device-width, initial-scale=1" name="viewport"/>

  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet">

  <!-- Stylesheets -->
  <link href="https://cdn.prod.website-files.com/6ab6692b52b5a2110575e141/css/felix-kern.webflow.shared.67c341a1a.css" rel="stylesheet" type="text/css"/>
  <link href="css/felix-kern.css" rel="stylesheet" type="text/css"/>

  <style>
    body {{
      -webkit-font-smoothing: antialiased;
      -moz-font-smoothing: antialiased;
      font-family: 'IBM Plex Mono', monospace !important;
      background-color: #f7f7f8;
      color: #000;
    }}

    .contact-link {{
      color: inherit;
      text-decoration: underline;
      transition: opacity 0.2s;
    }}
    .contact-link:hover {{
      opacity: 0.6;
    }}

    /* Sticky Category Jump Bar */
    .work-sticky-bar {{
      position: sticky;
      top: 0;
      background: rgba(247, 247, 248, 0.96);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      z-index: 90;
      border-bottom: 1px solid rgba(0, 0, 0, 0.12);
      padding: 12px 0;
      margin-bottom: 28px;
    }}

    .category-pills-scroll {{
      display: flex;
      gap: 8px;
      overflow-x: auto;
      white-space: nowrap;
      scrollbar-width: none;
      -ms-overflow-style: none;
      padding: 2px 4px;
    }}
    .category-pills-scroll::-webkit-scrollbar {{
      display: none;
    }}

    .cat-pill {{
      display: inline-block;
      padding: 7px 14px;
      font-family: 'IBM Plex Mono', monospace;
      font-size: 11px;
      color: #111;
      background: #fff;
      border: 1px solid #ccc;
      border-radius: 2px;
      text-decoration: none;
      transition: all 0.15s ease;
      cursor: pointer;
    }}
    .cat-pill:hover, .cat-pill.active {{
      background: #000;
      color: #fff;
      border-color: #000;
    }}

    /* Category Section Header */
    .category-section-block {{
      margin-bottom: 56px;
      scroll-margin-top: 80px;
    }}

    .category-section-header {{
      margin-bottom: 22px;
      padding-bottom: 12px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.15);
    }}

    .cat-meta-row {{
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 6px;
      flex-wrap: wrap;
      gap: 8px;
    }}

    .cat-title-row {{
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
    }}

    .cat-code-badge {{
      font-family: 'IBM Plex Mono', monospace;
      font-size: 11px;
      color: #666;
    }}

    .cat-heading {{
      font-family: 'IBM Plex Mono', monospace;
      font-size: 17px;
      font-weight: 500;
      margin: 0;
      color: #000;
    }}

    .cat-count-pill {{
      font-family: 'IBM Plex Mono', monospace;
      font-size: 11px;
      color: #555;
      border: 1px solid #bbb;
      background: #fff;
      padding: 2px 8px;
      border-radius: 2px;
    }}

    .cat-description-text {{
      font-family: 'IBM Plex Mono', monospace;
      font-size: 12px;
      color: #555;
      line-height: 1.5;
      margin-top: 4px;
    }}

    /* Grid collection layout */
    .grid-work-collection-list {{
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 28px 20px;
    }}

    @media screen and (max-width: 600px) {{
      .grid-work-collection-list {{
        grid-template-columns: 1fr;
      }}
    }}

    /* Friendly Photo Card - NEVER CROPPED */
    .photo-card-wrapper {{
      cursor: pointer;
      display: flex;
      flex-direction: column;
      text-decoration: none;
      color: inherit;
    }}

    .photo-friendly-container {{
      background-color: #0c0d12;
      border: 1px solid rgba(0, 0, 0, 0.14);
      border-radius: 3px;
      aspect-ratio: 3 / 4;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      padding: 10px;
      position: relative;
      box-sizing: border-box;
      transition: border-color 0.2s ease, box-shadow 0.2s ease;
    }}

    /* 16:9 for Video Cards */
    .photo-friendly-container.photo-video-container {{
      aspect-ratio: 16 / 9 !important;
    }}

    .photo-card-wrapper:hover .photo-friendly-container {{
      border-color: rgba(0, 0, 0, 0.5);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.16);
    }}

    .photo-friendly-container img {{
      max-width: 100%;
      max-height: 100%;
      width: auto;
      height: auto;
      object-fit: contain !important; /* CRITICAL: 100% full uncropped image */
      display: block;
      margin: auto;
      filter: drop-shadow(0 2px 8px rgba(0,0,0,0.55));
      transition: transform 0.25s ease;
    }}

    .photo-card-wrapper:hover .photo-friendly-container img {{
      transform: scale(1.025);
    }}

    .photo-zoom-hint {{
      position: absolute;
      bottom: 8px;
      right: 8px;
      background: rgba(0, 0, 0, 0.8);
      color: #fff;
      font-size: 10px;
      padding: 3px 7px;
      font-family: 'IBM Plex Mono', monospace;
      border-radius: 2px;
      pointer-events: none;
    }}

    .video-badge {{
      position: absolute;
      top: 8px;
      left: 8px;
      background: #e50914;
      color: #fff;
      font-size: 10px;
      font-weight: 600;
      padding: 3px 8px;
      font-family: 'IBM Plex Mono', monospace;
      border-radius: 2px;
      pointer-events: none;
    }}

    .photo-card-meta {{
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 2px 2px 2px;
      font-size: 11px;
      color: #444;
      font-family: 'IBM Plex Mono', monospace;
      border-top: 1px solid rgba(0, 0, 0, 0.08);
      margin-top: 6px;
    }}

    .meta-title {{
      flex-grow: 1;
      margin: 0 10px;
      color: #000;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }}

    .meta-badge {{
      color: #777;
    }}

    /* Lightbox modal responsive */
    @media screen and (max-width: 600px) {{
      #work-lightbox {{
        padding: 8px !important;
      }}
      #work-lightbox > div {{
        max-height: 98vh !important;
      }}
    }}
  </style>
</head>
<body>

  <!-- Navigation -->
  <nav class="menu">
    <div class="w-layout-blockcontainer container w-container">
      <div class="menu-content">
        <div class="menu-main">
          <a href="index.html" class="logo w-inline-block">
            <div class="body-font">Kanchan Choudhary</div>
          </a>
          <div class="menu-button plus" id="menu-toggle-btn">
            <div class="body-font">[+]</div>
            <div class="menu-button minus"><div class="body-font">[-]</div></div>
          </div>
        </div>
        <div class="menu-info" id="menu-info">
          <div class="menu-items-wrapper">
            <div class="menu-items">
              <a href="index.html" class="menu-item w-inline-block">
                <div class="menu-link"><div class="body-font">Home</div></div>
                <div class="menu-separator"><div class="body-font">,</div></div>
              </a>
              <a href="work.html" aria-current="page" class="menu-item w-inline-block w--current">
                <div class="menu-link"><div class="body-font">Work ({total_frames} Frames)</div></div>
                <div class="menu-separator"><div class="body-font">,</div></div>
              </a>
              <a href="#cat-editorial" class="menu-item w-inline-block filter-nav-direct" data-target="cat-editorial">
                <div class="menu-link"><div class="body-font">Editorial</div></div>
                <div class="menu-separator"><div class="body-font">,</div></div>
              </a>
              <a href="#cat-kiff" class="menu-item w-inline-block filter-nav-direct" data-target="cat-kiff">
                <div class="menu-link"><div class="body-font">KIFF Podcasts</div></div>
                <div class="menu-separator"><div class="body-font">,</div></div>
              </a>
              <a href="#cat-songti" class="menu-item w-inline-block filter-nav-direct" data-target="cat-songti">
                <div class="menu-link"><div class="body-font">Songti Stills</div></div>
              </a>
            </div>
            <a href="mailto:kanchanc0410@gmail.com" class="menu-item w-inline-block">
              <div class="menu-link"><div class="body-font">Contact</div></div>
            </a>
          </div>
        </div>
      </div>
    </div>
  </nav>

  <!-- Sticky Horizontal Category Selector Bar -->
  <section class="work-sticky-bar">
    <div class="w-layout-blockcontainer container w-container">
      <div class="category-pills-scroll">
        <button type="button" class="cat-pill active" data-target="all">All Photos ({total_frames})</button>
"""

for c in categories:
    clean_name = c["title"].split("•")[1].strip() if "•" in c["title"] else c["title"]
    html += f'        <button type="button" class="cat-pill" data-target="{c["id"]}">[{c["code"]}] {clean_name} ({len(c["items"])})</button>\n'

html += f"""      </div>
    </div>
  </section>

  <!-- Main Work Gallery Layout -->
  <section class="works">
    <div class="w-layout-blockcontainer container grow w-container">
      <div class="works-content">

        <!-- Left Column: The Divided Categories & Photo Cards -->
        <div class="grid-work-blocks w-dyn-list" id="works-container">
"""

for c in categories:
    html += f"""
          <!-- Category Section: {c['title']} -->
          <div class="category-section-block" id="{c['id']}" data-category="{c['id']}">
            <div class="category-section-header">
              <div class="cat-meta-row">
                <div class="cat-title-row">
                  <span class="cat-code-badge">[{c['code']} / 09]</span>
                  <h2 class="cat-heading">{c['title']}</h2>
                </div>
                <span class="cat-count-pill">{len(c['items'])} Frames</span>
              </div>
              <div class="cat-description-text">{c['desc']}</div>
            </div>

            <div class="grid-work-collection-list w-dyn-items">
"""
    for item in c['items']:
        is_video = item.get('type') == 'video'
        video_id = item.get('videoId', '')
        badge_html = '<div class="video-badge">&#9658; 4K VIDEO</div>' if is_video else '<div class="photo-zoom-hint">[+] VIEW FULL</div>'
        meta_tag = '[4K Video]' if is_video else '[Full Frame]'
        container_class = 'photo-friendly-container photo-video-container' if is_video else 'photo-friendly-container'

        html += f"""              <div role="listitem" class="w-dyn-item">
                <div class="photo-card-wrapper" data-src="{item['src']}" data-title="{item['title']}" data-cat="{c['title']}" data-video-id="{video_id}">
                  <div class="{container_class}">
                    <img src="{item['src']}" alt="{item['title']}" loading="eager" decoding="async"/>
                    {badge_html}
                  </div>
                  <div class="photo-card-meta">
                    <span class="meta-date">{item['tag']}</span>
                    <span class="meta-title">{item['title']}</span>
                    <span class="meta-badge">{meta_tag}</span>
                  </div>
                </div>
              </div>
"""

    html += """            </div>
          </div>
"""

html += f"""
          <!-- Bottom Navigation Back to Home matching Felix Kern view all line -->
          <div class="button-wrapper" style="margin-top: 40px; margin-bottom: 20px;">
            <a href="index.html" class="button w-inline-block">
              <div class="body-font">&larr; Return to Homepage &amp; Selected Works</div>
              <div class="button-line"></div>
            </a>
          </div>

        </div>

        <!-- Right Column: Sticky Categories & Bio Index -->
        <div class="works-info">
          <div class="progress-blocks">
            <div class="blocks">

              <div class="items-blocks">
                <h1 class="label-font opacity">Exhibition Index</h1>
                <div class="items works-items">
                  <a href="#all" class="body-font filter-cat-link active" data-target="all">All Categories ({total_frames} Frames)</a>
                  <a href="index.html" class="body-font">&larr; Selected Works Table</a>
                </div>
              </div>

              <div class="items-blocks">
                <div class="label-font opacity">Categories (9)</div>
                <div class="items works-items second">
"""

for c in categories:
    short_title = c['title'].replace('Photoshoot • ', '').replace('&amp;', '&')
    html += f'                  <a href="#{c["id"]}" class="body-font filter-cat-link" data-target="{c["id"]}">[{c["code"]}] {short_title} ({len(c["items"])})</a>\n'

html += f"""                </div>
              </div>

              <div class="items-blocks">
                <div class="label-font opacity">Display Philosophy</div>
                <div class="items works-items">
                  <div class="body-font">100% Uncropped Full-Frame</div>
                  <div class="body-font">Natural Aspect Ratios</div>
                  <div class="body-font">Click any card to examine high-res</div>
                </div>
              </div>

              <div class="items-blocks">
                <div class="label-font opacity">Kanchan Choudhary</div>
                <div class="items works-items">
                  <div class="body-font">Video Editor &amp; Cinematographer</div>
                  <div class="body-font"><a href="mailto:kanchanc0410@gmail.com" class="contact-link">kanchanc0410@gmail.com</a></div>
                  <div class="body-font"><a href="tel:7977667004" class="contact-link">+91 7977667004</a></div>
                </div>
              </div>

            </div>
          </div>

          <!-- Sticky Sidebar Footer -->
          <div class="footer-wrapper">
            <footer class="footer">
              <div class="w-layout-blockcontainer container footer-container w-container">
                <div class="footer-content">
                  <div class="footer-item-wrapper">
                    <div class="body-font">&copy; 2026 Kanchan Choudhary</div>
                  </div>
                  <div class="availability">
                    <div class="indicator-wrapper"><div class="indicator"></div></div>
                    <div class="body-font">Available for work</div>
                  </div>
                </div>
              </div>
            </footer>
          </div>

        </div>

      </div>
    </div>
  </section>

  <!-- Fullscreen Lightbox Modal with Next / Prev Navigation -->
  <div id="work-lightbox" style="display:none; position:fixed; top:0; left:0; width:100vw; height:100vh; background:rgba(0,0,0,0.96); z-index:999999; align-items:center; justify-content:center; padding:1.5rem; box-sizing:border-box;">
    <div style="position:relative; width:100%; max-width:1100px; max-height:94vh; background:#000; border:1px solid #333; display:flex; flex-direction:column; box-shadow:0 20px 60px rgba(0,0,0,0.8);">
      
      <!-- Lightbox Header -->
      <div style="display:flex; justify-content:space-between; align-items:center; padding:12px 18px; border-bottom:1px solid #222; background:#08090d;">
        <div style="display:flex; align-items:center; gap:12px;">
          <span id="work-lightbox-counter" style="color:#888; font-size:12px; font-family:'IBM Plex Mono', monospace;">[1 / {total_frames}]</span>
          <span id="work-lightbox-title" style="color:#fff; font-size:13px; font-family:'IBM Plex Mono', monospace; font-weight:500;">Photograph</span>
        </div>
        <button id="work-close-lightbox" style="background:none; border:none; color:#fff; font-family:'IBM Plex Mono', monospace; font-size:14px; cursor:pointer; padding:4px 8px;">[CLOSE &times;]</button>
      </div>

      <!-- Lightbox Body -->
      <div id="work-lightbox-body" style="position:relative; width:100%; flex-grow:1; display:flex; align-items:center; justify-content:center; overflow:hidden; background:#000; padding:12px; box-sizing:border-box;">
        <img id="work-lightbox-img" src="" alt="" style="max-width:100%; max-height:76vh; object-fit:contain; display:block; filter:drop-shadow(0 4px 18px rgba(0,0,0,0.7));">
        <div id="work-lightbox-video" style="display:none; width:100%; max-width:960px; background:#000;"></div>
      </div>

      <!-- Lightbox Navigation Footer -->
      <div style="display:flex; justify-content:space-between; align-items:center; padding:10px 18px; border-top:1px solid #222; background:#08090d;">
        <button id="work-lightbox-prev" style="background:none; border:1px solid #444; color:#fff; font-family:'IBM Plex Mono', monospace; font-size:12px; padding:5px 14px; cursor:pointer;">&larr; PREV</button>
        <span id="work-lightbox-category" style="color:#aaa; font-size:11px; font-family:'IBM Plex Mono', monospace;">Category</span>
        <button id="work-lightbox-next" style="background:none; border:1px solid #444; color:#fff; font-family:'IBM Plex Mono', monospace; font-size:12px; padding:5px 14px; cursor:pointer;">NEXT &rarr;</button>
      </div>

    </div>
  </div>

  <!-- Interactive Scripts -->
  <script>
    document.addEventListener('DOMContentLoaded', () => {{
      // Legacy hash mapping for backwards compatibility
      const aliasMap = {{
        'cat-slide-10': 'cat-editorial',
        'cat-slide-5': 'cat-studio',
        'cat-slides-6-7': 'cat-mood-styling',
        'cat-slides-8-9': 'cat-ambient-light',
        'cat-slides-11-12': 'cat-character',
        'cat-slides-13-14': 'cat-monochrome',
        'cat-slide-15': 'cat-limited-2030',
        'cat-slide-21': 'cat-songti'
      }};

      // 1. Mobile Menu Toggle
      const menuBtn = document.getElementById('menu-toggle-btn');
      const menuInfo = document.getElementById('menu-info');
      let menuOpen = false;
      if (menuBtn && menuInfo) {{
        menuBtn.addEventListener('click', () => {{
          menuOpen = !menuOpen;
          menuInfo.style.display = menuOpen ? 'block' : '';
          menuBtn.querySelector('.body-font').textContent = menuOpen ? '[-]' : '[+]';
        }});
      }}

      // 2. Category Jump & Filter
      const catPills = document.querySelectorAll('.cat-pill');
      const sidebarLinks = document.querySelectorAll('.filter-cat-link');
      const navDirectLinks = document.querySelectorAll('.filter-nav-direct');
      const categorySections = document.querySelectorAll('.category-section-block');
      const allCards = Array.from(document.querySelectorAll('.photo-card-wrapper'));

      function getActiveCards() {{
        const visible = allCards.filter(c => {{
          const sec = c.closest('.category-section-block');
          return !sec || sec.style.display !== 'none';
        }});
        return visible.length > 0 ? visible : allCards;
      }}

      function resolveTarget(rawId) {{
        return aliasMap[rawId] || rawId;
      }}

      function filterCategory(rawTargetId, updateUrl = true) {{
        const targetId = resolveTarget(rawTargetId);

        // Update active states on pills and sidebar links
        catPills.forEach(p => {{
          if (p.getAttribute('data-target') === targetId) p.classList.add('active');
          else p.classList.remove('active');
        }});
        sidebarLinks.forEach(l => {{
          if (l.getAttribute('data-target') === targetId) l.classList.add('active');
          else l.classList.remove('active');
        }});

        if (targetId === 'all') {{
          categorySections.forEach(sec => sec.style.display = 'block');
          window.scrollTo({{ top: 0, behavior: 'smooth' }});
          if (updateUrl && window.location.hash) {{
            history.replaceState(null, '', window.location.pathname);
          }}
        }} else {{
          categorySections.forEach(sec => {{
            if (sec.id === targetId) {{
              sec.style.display = 'block';
            }} else {{
              sec.style.display = 'none';
            }}
          }});
          const targetEl = document.getElementById(targetId);
          if (targetEl) {{
            targetEl.scrollIntoView({{ behavior: 'smooth', block: 'start' }});
          }}
          if (updateUrl) {{
            history.replaceState(null, '', '#' + targetId);
          }}
        }}
      }}

      catPills.forEach(p => {{
        p.addEventListener('click', (e) => {{
          e.preventDefault();
          const target = p.getAttribute('data-target');
          filterCategory(target);
        }});
      }});

      sidebarLinks.forEach(l => {{
        l.addEventListener('click', (e) => {{
          e.preventDefault();
          const target = l.getAttribute('data-target');
          filterCategory(target);
        }});
      }});

      navDirectLinks.forEach(nl => {{
        nl.addEventListener('click', (e) => {{
          e.preventDefault();
          const target = nl.getAttribute('data-target');
          filterCategory(target);
          if (menuOpen && menuInfo) {{
            menuOpen = false;
            menuInfo.style.display = '';
            if (menuBtn) menuBtn.querySelector('.body-font').textContent = '[+]';
          }}
        }});
      }});

      // Auto-filter if URL contains category hash
      if (window.location.hash) {{
        const initialTarget = resolveTarget(window.location.hash.substring(1));
        if (initialTarget && document.getElementById(initialTarget)) {{
          filterCategory(initialTarget, false);
        }}
      }}

      window.addEventListener('hashchange', () => {{
        const rawHash = window.location.hash.substring(1);
        const hash = resolveTarget(rawHash);
        if (hash && document.getElementById(hash)) {{
          filterCategory(hash, false);
        }} else if (!hash) {{
          filterCategory('all', false);
        }}
      }});

      // 3. Fullscreen Lightbox with Next / Previous & Keyboard Support
      const lightbox = document.getElementById('work-lightbox');
      const lightboxImg = document.getElementById('work-lightbox-img');
      const lightboxVideo = document.getElementById('work-lightbox-video');
      const lightboxTitle = document.getElementById('work-lightbox-title');
      const lightboxCounter = document.getElementById('work-lightbox-counter');
      const lightboxCategory = document.getElementById('work-lightbox-category');
      const closeBtn = document.getElementById('work-close-lightbox');
      const prevBtn = document.getElementById('work-lightbox-prev');
      const nextBtn = document.getElementById('work-lightbox-next');

      let currentCard = null;

      function showCard(card) {{
        if (!card) return;
        currentCard = card;
        const activeCards = getActiveCards();
        const activeIndex = activeCards.indexOf(card);
        const total = activeCards.length;

        const src = card.getAttribute('data-src');
        const title = card.getAttribute('data-title') || 'Photograph';
        const cat = card.getAttribute('data-cat') || '';
        const videoId = card.getAttribute('data-video-id');

        lightboxCounter.textContent = `[${{activeIndex + 1}} / ${{total}}]`;
        lightboxTitle.textContent = title;
        lightboxCategory.textContent = cat;

        if (videoId) {{
          lightboxImg.style.display = 'none';
          lightboxVideo.style.display = 'block';
          lightboxVideo.innerHTML = `
            <div style="position:relative; width:100%; aspect-ratio:16/9; background:#000;">
              <iframe src="https://www.youtube.com/embed/${{videoId}}?autoplay=1&rel=0&enablejsapi=1" 
                title="YouTube video player"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                referrerpolicy="strict-origin-when-cross-origin"
                allowfullscreen 
                style="width:100%; height:100%; border:0; display:block;">
              </iframe>
            </div>
            <div style="padding:10px 14px; background:#111; display:flex; justify-content:space-between; align-items:center; border-top:1px solid #222; flex-wrap:wrap; gap:8px;">
              <span style="color:#aaa; font-size:11px; font-family:'IBM Plex Mono', monospace;">KIFF 4K Broadcast Masterclass</span>
              <a href="https://www.youtube.com/watch?v=${{videoId}}" target="_blank" rel="noopener noreferrer" style="color:#fff; text-decoration:underline; font-size:11px; font-family:'IBM Plex Mono', monospace;">[Watch Directly on YouTube &rarr;]</a>
            </div>
          `;
        }} else {{
          lightboxVideo.style.display = 'none';
          lightboxVideo.innerHTML = '';
          lightboxImg.style.display = 'block';
          lightboxImg.src = src;
          lightboxImg.alt = title;
        }}
      }}

      function stepCard(dir) {{
        const activeCards = getActiveCards();
        let idx = activeCards.indexOf(currentCard);
        if (idx === -1) idx = 0;
        idx = (idx + dir + activeCards.length) % activeCards.length;
        showCard(activeCards[idx]);
      }}

      allCards.forEach(card => {{
        card.addEventListener('click', () => {{
          showCard(card);
          lightbox.style.display = 'flex';
          document.body.style.overflow = 'hidden';
        }});
      }});

      function closeLightbox() {{
        lightbox.style.display = 'none';
        lightboxVideo.innerHTML = '';
        document.body.style.overflow = 'auto';
      }}

      if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
      if (prevBtn) prevBtn.addEventListener('click', () => stepCard(-1));
      if (nextBtn) nextBtn.addEventListener('click', () => stepCard(1));

      if (lightbox) {{
        lightbox.addEventListener('click', (e) => {{
          if (e.target === lightbox || e.target.id === 'work-lightbox-body') closeLightbox();
        }});
      }}

      document.addEventListener('keydown', (e) => {{
        if (lightbox && lightbox.style.display === 'flex') {{
          if (e.key === 'Escape') closeLightbox();
          if (e.key === 'ArrowLeft') stepCard(-1);
          if (e.key === 'ArrowRight') stepCard(1);
        }}
      }});
    }});
  </script>
</body>
</html>
"""

with open('work.html', 'w', encoding='utf-8') as f:
    f.write(html)

print(f"Successfully generated work.html with {total_frames} items without any Slide text!")
