/**
 * tools-frontend overlay.js
 * Usage: node .claude/skills/tools-frontend/overlay.js "https://example.com"
 * 의존성: playwright (npm install playwright && npx playwright install chromium)
 */
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

let TARGET_URL = process.argv[2] || 'http://localhost:3000';
if (TARGET_URL.match(/^https:\/\/localhost/)) TARGET_URL = TARGET_URL.replace('https://', 'http://');

const OUTPUT_DIR = path.resolve(process.cwd(), 'temp/screenshots');
fs.mkdirSync(OUTPUT_DIR, { recursive: true });

let activePage = null;

// ── Professional design label function (injected into all pages) ─────────────
const GET_DESIGN_LABEL_FN = `
function getDesignLabel(el) {
  if (!el || el === document.body || el === document.documentElement) return null;
  const tag = el.tagName.toLowerCase();
  const role = el.getAttribute('role') || '';
  const ariaLabel = el.getAttribute('aria-label') || '';
  const title = el.getAttribute('title') || '';
  const text = (el.innerText || '').trim().replace(/\\s+/g,' ').slice(0, 40);
  const cls = (typeof el.className === 'string' ? el.className : '').toLowerCase();
  const id = (el.id || '').toLowerCase();

  let style, rect;
  try { style = window.getComputedStyle(el); rect = el.getBoundingClientRect(); }
  catch(e) { return '<b>' + tag.toUpperCase() + '</b>'; }

  const pos = style.position;
  const zIndex = parseInt(style.zIndex) || 0;
  const isFixed = pos === 'fixed';
  const isSticky = pos === 'sticky';
  const isAbsolute = pos === 'absolute';

  const vw = window.innerWidth, vh = window.innerHeight;
  const isTop    = rect.top < 90;
  const isBottom = rect.bottom > vh - 90;
  const isLeft   = rect.right < vw * 0.32;
  const isRight  = rect.left  > vw * 0.68;
  const isFullW  = rect.width > vw * 0.82;
  const isFullH  = rect.height > vh * 0.82;
  const isTall   = rect.height > vh * 0.35;
  const isSmall  = rect.width < 72 && rect.height < 72;

  const has = (patterns) => patterns.some(p => cls.includes(p) || id.includes(p));

  let term = null;

  // ── Overlay / Backdrop ──
  if (isFixed && isFullW && isFullH && (has(['modal','overlay','backdrop','mask','dim','lightbox']) || zIndex > 900))
    term = zIndex > 1000 ? '모달 레이어' : '오버레이 배경';

  // ── Modal / Dialog ──
  else if (tag === 'dialog' || role === 'dialog' || role === 'alertdialog'
        || has(['modal','dialog','popup','lightbox']))
    term = '모달 다이얼로그';

  // ── Drawer / Sheet ──
  else if (has(['drawer','sheet','offcanvas','side-panel','sidepanel','flyout']))
    term = isLeft ? '좌측 드로어' : isRight ? '우측 드로어' : '드로어';

  // ── Global Navbar (fixed/sticky top full-width) ──
  else if ((tag === 'nav' || tag === 'header' || role === 'navigation' || role === 'banner')
        && (isFixed || isSticky) && isTop && isFullW)
    term = '글로벌 내비게이션 바';

  // ── Sticky Header ──
  else if (isSticky && isTop && isFullW)
    term = '스티키 헤더';

  // ── Top Header (static) ──
  else if ((tag === 'header' || role === 'banner') && isTop && isFullW)
    term = '상단 헤더';

  // ── Sub Navigation / Tab Nav ──
  else if ((tag === 'nav' || role === 'navigation') && !isFullW)
    term = isTop ? '서브 내비게이션' : isLeft ? '사이드 내비게이션' : '내비게이션 메뉴';

  // ── Bottom Tab Bar ──
  else if ((isFixed || isSticky) && isBottom && isFullW)
    term = has(['tab']) ? '하단 탭 바' : '하단 고정 바';

  // ── Left Sidebar ──
  else if ((tag === 'aside' || role === 'complementary'
         || has(['sidebar','side-nav','sidenav','side-menu','left-panel'])) && isTall)
    term = '좌측 사이드 패널';

  // ── Fixed Left Panel ──
  else if (isFixed && isLeft && isTall && !isSmall)
    term = '고정 좌측 패널';

  // ── Fixed Right Panel ──
  else if (isFixed && isRight && isTall && !isSmall)
    term = has(['tool','toolbar']) ? '우측 툴 패널' : '고정 우측 패널';

  // ── Floating Action Button ──
  else if (isFixed && !isTop && isSmall && (tag === 'button' || role === 'button'))
    term = '플로팅 액션 버튼 (FAB)';

  // ── Tooltip ──
  else if (role === 'tooltip' || has(['tooltip','hint','popperjs']))
    term = '툴팁';

  // ── Popover ──
  else if (has(['popover','pop-over','popper','floating-ui']))
    term = '팝오버';

  // ── Dropdown Menu ──
  else if (role === 'menu' || role === 'listbox' || has(['dropdown','drop-down','menu-list','select-menu']))
    term = '드롭다운 메뉴';

  // ── Toast / Notification ──
  else if (role === 'alert' || role === 'status' || has(['toast','snackbar','notification','alert-message']))
    term = '토스트 알림';

  // ── Search Bar ──
  else if (role === 'search' || has(['search-bar','search-box','searchbar']))
    term = '검색 바';

  // ── Toolbar ──
  else if (role === 'toolbar' || has(['toolbar','tool-bar','action-bar','action-row']))
    term = '툴바';

  // ── Breadcrumb ──
  else if (has(['breadcrumb','bread-crumb']))
    term = '브레드크럼';

  // ── Tabs ──
  else if (role === 'tablist' || has(['tab-list','tabs-bar','tab-group']))
    term = '탭 내비게이션';
  else if (role === 'tab')
    term = '탭';
  else if (role === 'tabpanel')
    term = '탭 콘텐츠 패널';

  // ── Accordion ──
  else if (has(['accordion','collapse','expand','disclosure']))
    term = '아코디언';

  // ── Carousel / Slider ──
  else if (has(['carousel','slider','swiper','slideshow','splide']))
    term = '캐러셀 슬라이더';

  // ── Card ──
  else if (has(['card','tile','list-item','item-card','product-card']) && rect.width > 100 && rect.height > 80)
    term = '카드';

  // ── Hero Section ──
  else if ((tag === 'section' || tag === 'div') && isTop && isFullW && isTall
        && has(['hero','banner','jumbotron','intro','landing']))
    term = '히어로 섹션';

  // ── Stepper ──
  else if (has(['stepper','step-bar','wizard','progress-step','step-indicator']))
    term = '스텝퍼';

  // ── Pagination ──
  else if (has(['pagination','paging','page-nav']))
    term = '페이지네이션';

  // ── Table ──
  else if (tag === 'table' || has(['data-table','datagrid']))
    term = '데이터 테이블';

  // ── Form ──
  else if (tag === 'form')
    term = '입력 폼';

  // ── Footer ──
  else if (tag === 'footer' || role === 'contentinfo')
    term = '글로벌 푸터';

  // ── Main Content ──
  else if (tag === 'main' || role === 'main')
    term = '메인 콘텐츠 영역';

  // ── Article ──
  else if (tag === 'article')
    term = '아티클 콘텐츠';

  // ── Section ──
  else if (tag === 'section')
    term = '섹션';

  // ── Interactive fallback ──
  else if (tag === 'button' || role === 'button')
    term = '버튼';

  else if (tag === 'input') {
    const t = (el.getAttribute('type') || 'text');
    const map = { text:'텍스트 입력', email:'이메일 입력', password:'비밀번호 입력',
      search:'검색 입력', number:'숫자 입력', tel:'전화번호 입력',
      checkbox:'체크박스', radio:'라디오 버튼', file:'파일 업로드',
      range:'슬라이더', date:'날짜 선택', color:'색상 선택', submit:'제출 버튼' };
    term = map[t] || '입력 필드';
  }
  else if (tag === 'select') term = '선택 드롭다운';
  else if (tag === 'textarea') term = '텍스트 영역';
  else if (tag === 'a') term = '링크';
  else if (tag === 'img') term = '이미지';
  else if (tag === 'video') term = '비디오 플레이어';
  else if (tag === 'ul' || tag === 'ol') term = isTall ? '목록 컨테이너' : '목록';
  else if (tag === 'li') term = '목록 항목';
  else if (['h1','h2','h3','h4','h5','h6'].includes(tag)) term = '제목 (' + tag.toUpperCase() + ')';
  else if (tag === 'p') term = '단락 텍스트';
  else if (tag === 'label') term = '라벨';
  else if (tag === 'span' || tag === 'div') {
    if (isFullW && isTall) term = '콘텐츠 블록';
    else if (isFixed) term = '고정 UI 레이어';
    else term = '컨테이너';
  }
  else term = tag.toUpperCase();

  const name = ariaLabel || title || (text && text.length < 32 ? text : '');
  return name ? '<b>' + term + '</b> · ' + name : '<b>' + term + '</b>';
}
`;

// ── Overlay CSS ───────────────────────────────────────────────────────────────
const OVERLAY_CSS = `
#__tf_coord__ {
  position: fixed; top: 10px; left: 10px; z-index: 2147483647;
  background: rgba(0,0,0,0.82); color: #00ff88;
  font: 600 12px/1.4 'SF Mono','Fira Code',monospace;
  padding: 5px 10px; border-radius: 6px; pointer-events: none;
  border: 1px solid #00ff8844; min-width: 120px;
}
#__tf_coord__.bench { color: #ff9900; border-color: #ff990044; }
#__tf_tip__ {
  position: fixed; z-index: 2147483647;
  background: rgba(10,10,10,0.92); color: #fff;
  font: 500 11px/1.4 'SF Mono','Fira Code',monospace;
  padding: 4px 10px; border-radius: 5px; pointer-events: none; max-width: 280px;
  border: 1px solid #444; box-shadow: 0 2px 8px rgba(0,0,0,0.5);
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: none;
}
#__tf_tip__ b { color: #00ff88; }
#__tf_tip__.bench b { color: #ff9900; }
#__tf_highlight__ {
  position: fixed; z-index: 2147483646; pointer-events: none;
  border: 2px solid #00ff88; border-radius: 3px;
  background: rgba(0,255,136,0.06); display: none; transition: all 0.05s;
}
#__tf_highlight__.bench { border-color: #ff9900; background: rgba(255,153,0,0.06); }
#__tf_selection_overlay__ {
  position: fixed; top:0; left:0; right:0; bottom:0; z-index: 2147483645;
  cursor: crosshair; background: rgba(0,0,0,0.25); display: none;
}
#__tf_selection_box__ {
  position: absolute; border: 2px solid #00ff88;
  background: rgba(0,255,136,0.08); pointer-events: none; display: none;
}
#__tf_selection_label__ {
  position: absolute; bottom:-22px; left:0; font: 11px monospace; color: #00ff88;
  background: rgba(0,0,0,0.8); padding: 2px 6px; border-radius: 3px;
  white-space: nowrap; pointer-events: none;
}
/* Bench right-click selection */
#__tf_bench_sel__ {
  position: absolute; border: 2px solid #ff9900;
  background: rgba(255,153,0,0.1); pointer-events: none; display: none;
}
#__tf_bench_sel_lbl__ {
  position: absolute; bottom:-22px; left:0; font: 11px monospace; color: #ff9900;
  background: rgba(0,0,0,0.85); padding: 2px 6px; border-radius: 3px; white-space: nowrap;
}
/* Bench hint */
#__tf_bench_hint__ {
  position: fixed; bottom: 10px; left: 50%; transform: translateX(-50%);
  z-index: 2147483647; background: rgba(0,0,0,0.88); color: #ff9900;
  font: 500 11px monospace; padding: 5px 14px; border-radius: 16px;
  border: 1px solid #ff990055; pointer-events: none; white-space: nowrap;
}
/* Sidebar toggle */
#__tf_toggle__ {
  position: fixed; right:0; top:50%; transform:translateY(-50%); z-index:2147483647;
  background:#1a1a1a; color:#00ff88; border:1px solid #333; border-right:none;
  border-radius:6px 0 0 6px; width:22px; height:60px; cursor:pointer; font-size:11px;
  display:flex; align-items:center; justify-content:center;
  writing-mode:vertical-lr; letter-spacing:2px; font-family:monospace;
}
#__tf_toggle__:hover { background:#252525; }
/* Sidebar */
#__tf_sidebar__ {
  position:fixed; right:-340px; top:0; height:100vh; width:340px; z-index:2147483647;
  background:#0f0f0f; border-left:1px solid #2a2a2a;
  display:flex; flex-direction:column; overflow-y:auto;
  transition:right 0.25s cubic-bezier(.4,0,.2,1);
  font-family:'SF Mono','Fira Code',monospace;
}
#__tf_sidebar__.open { right:0; }
.__tf_sb_header__ {
  padding:14px 16px 10px; border-bottom:1px solid #1e1e1e;
  color:#00ff88; font-size:13px; font-weight:700;
  display:flex; align-items:center; justify-content:space-between; flex-shrink:0;
}
.__tf_close_btn__ { background:none; border:none; color:#555; cursor:pointer; font-size:16px; padding:0 4px; }
.__tf_close_btn__:hover { color:#fff; }
.__tf_section__ { padding:10px 12px; border-bottom:1px solid #1a1a1a; flex-shrink:0; }
.__tf_section_title__ { font-size:10px; color:#555; text-transform:uppercase; letter-spacing:.8px; margin-bottom:8px; }
.__tf_shot_btn__ {
  width:100%; padding:8px; background:#1a2e22; border:1px solid #00ff8833; border-radius:6px;
  color:#00ff88; font-family:monospace; font-size:12px; cursor:pointer; transition:background .15s;
}
.__tf_shot_btn__:hover { background:#1e3828; }
.__tf_shot_btn__.active { background:#2e1a1a; border-color:#ff444433; color:#ff8888; }
.__tf_shots_list__ { margin-top:8px; display:flex; flex-direction:column; gap:6px; max-height:200px; overflow-y:auto; }
.__tf_shot_item__ { position:relative; border-radius:4px; overflow:hidden; border:1px solid #2a2a2a; }
.__tf_shot_item__:hover { border-color:#00ff8844; }
.__tf_shot_item__:hover .__tf_shot_del__ { opacity:1; }
.__tf_shot_thumb__ { width:100%; display:block; }
.__tf_shot_name__ {
  position:absolute; bottom:0; left:0; right:0; background:rgba(0,0,0,.75);
  color:#888; font-size:9px; padding:2px 6px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;
}
.__tf_shot_del__ {
  position:absolute; top:4px; right:4px; width:20px; height:20px; border-radius:50%;
  background:rgba(200,40,40,.9); border:none; color:#fff; font-size:11px; font-weight:700;
  cursor:pointer; display:flex; align-items:center; justify-content:center;
  opacity:0; transition:opacity .15s; line-height:1; padding:0;
}
.__tf_shot_del__:hover { background:rgba(255,60,60,1); }
.__tf_chat_input__ {
  width:100%; background:#161616; border:1px solid #2a2a2a; border-radius:6px;
  color:#e0e0e0; padding:8px 10px; font-family:monospace; font-size:12px;
  resize:none; outline:none; height:80px; box-sizing:border-box;
}
.__tf_chat_input__:focus { border-color:#00ff8844; }
.__tf_drop_zone__ {
  border:1.5px dashed #333; border-radius:6px; padding:12px 8px; text-align:center;
  color:#444; font-size:11px; cursor:pointer; transition:border-color .15s, background .15s;
  min-height:56px; position:relative;
}
.__tf_drop_zone__.drag-over { border-color:#00ff88; background:#0d1e15; color:#00ff88; }
.__tf_drop_zone__ input[type=file] { position:absolute; inset:0; opacity:0; cursor:pointer; width:100%; }
.__tf_attach_list__ { margin-top:6px; display:flex; flex-direction:column; gap:5px; }
.__tf_send_row__ { margin-top:6px; display:flex; gap:6px; }
.__tf_chat_send__ {
  flex:1; padding:7px; background:#1a2e22; border:1px solid #00ff8833; border-radius:6px;
  color:#00ff88; font-family:monospace; font-size:12px; cursor:pointer;
}
.__tf_chat_send__:hover { background:#1e3828; }
.__tf_match_btn__ {
  padding:7px 12px; background:#1a1a2e; border:1px solid #6666ff33; border-radius:6px;
  color:#aaaaff; font-family:monospace; font-size:12px; cursor:pointer; white-space:nowrap;
}
.__tf_match_btn__:hover { background:#20203a; border-color:#6666ff88; color:#ccccff; }
.__tf_chat_log__ {
  flex:1; overflow-y:auto; padding:10px 12px; min-height:60px;
  display:flex; flex-direction:column; gap:6px;
}
.__tf_msg__ {
  background:#161616; border:1px solid #222; border-radius:5px; padding:6px 10px;
  font-size:11px; color:#ccc; line-height:1.4; word-break:break-all; flex-shrink:0;
}
.__tf_msg__ small { color:#444; display:block; font-size:9px; margin-bottom:2px; }
.__tf_msg_img__ { width:100%; border-radius:3px; margin-top:4px; display:block; }
/* Benchmark section */
.__tf_bench_input__ {
  width:100%; background:#161616; border:1px solid #2a2a2a; border-radius:6px;
  color:#e0e0e0; padding:7px 10px; font-family:monospace; font-size:12px;
  outline:none; box-sizing:border-box; margin-bottom:6px;
}
.__tf_bench_input__:focus { border-color:#ff990044; }
.__tf_bench_btn__ {
  width:100%; padding:8px; background:#2e1e00; border:1px solid #ff990033;
  border-radius:6px; color:#ff9900; font-family:monospace; font-size:12px;
  cursor:pointer; transition:background .15s;
}
.__tf_bench_btn__:hover { background:#3a2600; border-color:#ff990066; }
.__tf_bench_btn__:disabled { opacity:.4; cursor:not-allowed; }
/* Benchmark split panel */
#__tf_bench_panel__ {
  position:fixed; top:0; left:50%; right:0; bottom:0; z-index:2147483630;
  background:#0a0a0a; border-left:3px solid #ff9900;
  display:flex; flex-direction:column;
}
.__tf_bench_bar__ {
  height:36px; background:#1a1200; border-bottom:1px solid #ff990033;
  display:flex; align-items:center; padding:0 10px; gap:8px; flex-shrink:0;
}
.__tf_bench_bar_label__ {
  font:11px monospace; color:#ff9900; opacity:.7; flex-shrink:0;
}
.__tf_bench_bar_url__ {
  font:11px monospace; color:#ff9900; flex:1;
  overflow:hidden; text-overflow:ellipsis; white-space:nowrap;
}
.__tf_bench_close__ {
  background:none; border:none; color:#ff9900; cursor:pointer;
  font-size:14px; padding:0 4px; flex-shrink:0; opacity:.7;
}
.__tf_bench_close__:hover { opacity:1; }
.__tf_bench_iframe__ { width:100%; flex:1; border:none; }
.__tf_bench_loading__ {
  position:absolute; inset:36px 0 0 0; background:#0a0a0a;
  display:flex; align-items:center; justify-content:center;
  color:#ff9900; font:12px monospace; pointer-events:none;
}
/* Ref links */
.__tf_ref_links__ { display:flex; flex-direction:column; gap:5px; }
.__tf_ref_link__ {
  display:block; padding:7px 10px; background:#0d1f17; border:1px solid #00ff8822;
  border-radius:6px; color:#00ff88; font-size:12px; text-decoration:none;
  transition:background .15s, border-color .15s;
}
.__tf_ref_link__:hover { background:#1a3826; border-color:#00ff8866; }
`;

// ── Main overlay JS (injected into the current app page) ─────────────────────
const OVERLAY_JS = `
(function() {
  if (document.getElementById('__tf_coord__')) return;
  ${GET_DESIGN_LABEL_FN}

  const coord = document.createElement('div'); coord.id='__tf_coord__'; coord.textContent='x: 0,  y: 0';
  const tip   = document.createElement('div'); tip.id='__tf_tip__';
  const hl    = document.createElement('div'); hl.id='__tf_highlight__';
  const selOv = document.createElement('div'); selOv.id='__tf_selection_overlay__';
  const selBox= document.createElement('div'); selBox.id='__tf_selection_box__';
  const selLbl= document.createElement('div'); selLbl.id='__tf_selection_label__';
  selBox.appendChild(selLbl); selOv.appendChild(selBox);
  const toggle= document.createElement('div'); toggle.id='__tf_toggle__'; toggle.textContent='TOOLS';

  const sidebar=document.createElement('div'); sidebar.id='__tf_sidebar__';
  sidebar.innerHTML=\`
    <div class="__tf_sb_header__"><span>⚡ TOOLS</span><button class="__tf_close_btn__" id="__tf_close__">✕</button></div>
    <div class="__tf_section__">
      <div class="__tf_section_title__">Screenshot — 드래그로 영역 선택</div>
      <button class="__tf_shot_btn__" id="__tf_take_shot__">📷 영역 선택 스크린샷</button>
      <div class="__tf_shots_list__" id="__tf_shots_list__"></div>
    </div>
    <div class="__tf_section__">
      <div class="__tf_section_title__">이미지 첨부 — 드래그 또는 클릭</div>
      <div class="__tf_drop_zone__" id="__tf_drop_zone__">
        <input type="file" id="__tf_file_input__" accept="image/*" multiple>
        🖼 이미지를 여기에 드래그하거나 클릭하여 선택
      </div>
      <div class="__tf_attach_list__" id="__tf_attach_list__"></div>
    </div>
    <div class="__tf_section__">
      <div class="__tf_section_title__">메모 / Claude에게 전달</div>
      <textarea class="__tf_chat_input__" id="__tf_chat_input__" placeholder="Claude에게 메모...&#10;예: (120,340) 부근에 저장 버튼 만들어줘&#10;Ctrl+Enter로 전송"></textarea>
      <div class="__tf_send_row__">
        <button class="__tf_chat_send__" id="__tf_chat_send__">전송</button>
        <button class="__tf_match_btn__" id="__tf_match_btn__">✦ 일치</button>
      </div>
      <div class="__tf_send_row__" style="margin-top:6px;">
        <button class="__tf_chat_send__" id="__tf_memo_save__" style="background:#1a2e22;border-color:#00ff8844;color:#00cc66;flex:1;">📝 메모저장</button>
      </div>
    </div>
    <div class="__tf_chat_log__" id="__tf_chat_log__"></div>
    <div class="__tf_section__">
      <div class="__tf_section_title__">벤치마크 — 우측 분할 창</div>
      <input class="__tf_bench_input__" id="__tf_bench_url__" type="url" placeholder="https://example.com">
      <button class="__tf_bench_btn__" id="__tf_bench_open__">⊞ 새 창으로 열기</button>
    </div>
    <div class="__tf_section__">
      <div class="__tf_section_title__">레퍼런스 링크</div>
      <div class="__tf_ref_links__">
        <a class="__tf_ref_link__" href="https://ui.shadcn.com/docs" target="_blank">shadcn/ui Docs</a>
        <a class="__tf_ref_link__" href="https://component.gallery/components/" target="_blank">Component Gallery</a>
      </div>
    </div>
  \`;

  document.body.append(coord, tip, hl, selOv, toggle, sidebar);

  // ── Sidebar toggle ──
  toggle.addEventListener('click', () => sidebar.classList.toggle('open'));
  document.getElementById('__tf_close__').addEventListener('click', () => sidebar.classList.remove('open'));

  // ── Screenshot: drag selection ──
  let shotActive=false;
  document.getElementById('__tf_take_shot__').addEventListener('click', () => {
    if(shotActive) return; shotActive=true;
    sidebar.classList.remove('open');
    const btn=document.getElementById('__tf_take_shot__');
    btn.textContent='✕ ESC로 취소 — 드래그하여 선택'; btn.classList.add('active');
    selOv.style.display='block';
    let sx,sy,dragging=false;
    function onDown(e){e.preventDefault();sx=e.clientX;sy=e.clientY;dragging=true;selBox.style.cssText=\`position:absolute;border:2px solid #00ff88;background:rgba(0,255,136,0.08);pointer-events:none;left:\${sx}px;top:\${sy}px;width:0;height:0;display:block;\`;}
    function onMove(e){if(!dragging)return;const x=Math.min(e.clientX,sx),y=Math.min(e.clientY,sy),w=Math.abs(e.clientX-sx),h=Math.abs(e.clientY-sy);selBox.style.left=x+'px';selBox.style.top=y+'px';selBox.style.width=w+'px';selBox.style.height=h+'px';selLbl.textContent=w+' × '+h;}
    async function onUp(e){if(!dragging)return;dragging=false;const x=Math.min(e.clientX,sx),y=Math.min(e.clientY,sy),w=Math.abs(e.clientX-sx),h=Math.abs(e.clientY-sy);cleanup();if(w<10||h<10){addMsg('[스크린샷 취소] 너무 작은 영역');return;}addMsg(\`[스크린샷] (\${Math.round(x)},\${Math.round(y)}) \${Math.round(w)}×\${Math.round(h)}\`);try{const dpr=window.devicePixelRatio||1;const r=await window.__tfScreenshot__({x:Math.round(x*dpr),y:Math.round(y*dpr),width:Math.round(w*dpr),height:Math.round(h*dpr)});if(r&&r.base64){sidebar.classList.add('open');const list=document.getElementById('__tf_shots_list__');const item=document.createElement('div');item.className='__tf_shot_item__';const img=document.createElement('img');img.className='__tf_shot_thumb__';img.src='data:image/png;base64,'+r.base64;const lbl=document.createElement('div');lbl.className='__tf_shot_name__';lbl.textContent=r.filename;const del=document.createElement('button');del.className='__tf_shot_del__';del.textContent='✕';del.addEventListener('click',async(e)=>{e.stopPropagation();await window.__tfDeleteShot__(r.filename);item.remove();addMsg(\`[삭제] \${r.filename}\`);});item.append(img,lbl,del);list.prepend(item);addMsg(\`[완료] \${r.filename}\`);}}catch(err){addMsg('[오류] '+err.message);}}
    function onKey(e){if(e.key==='Escape')cleanup();}
    function cleanup(){shotActive=false;selOv.style.display='none';selBox.style.display='none';dragging=false;const b=document.getElementById('__tf_take_shot__');if(b){b.textContent='📷 영역 선택 스크린샷';b.classList.remove('active');}selOv.removeEventListener('mousedown',onDown);selOv.removeEventListener('mousemove',onMove);selOv.removeEventListener('mouseup',onUp);document.removeEventListener('keydown',onKey);}
    selOv.addEventListener('mousedown',onDown);selOv.addEventListener('mousemove',onMove);selOv.addEventListener('mouseup',onUp);document.addEventListener('keydown',onKey);
  });

  // ── Attachments ──
  const attachedImages=[];
  function addAttachItem(filename,base64,filepath){attachedImages.push({filename,base64,path:filepath});const list=document.getElementById('__tf_attach_list__');const item=document.createElement('div');item.className='__tf_shot_item__';const img=document.createElement('img');img.className='__tf_shot_thumb__';img.src='data:image/png;base64,'+base64;const lbl=document.createElement('div');lbl.className='__tf_shot_name__';lbl.textContent=filename;const del=document.createElement('button');del.className='__tf_shot_del__';del.textContent='✕';del.addEventListener('click',async(e)=>{e.stopPropagation();const idx=attachedImages.findIndex(a=>a.filename===filename);if(idx>-1)attachedImages.splice(idx,1);await window.__tfDeleteShot__(filename);item.remove();addMsg(\`[첨부 제거] \${filename}\`);});item.append(img,lbl,del);list.appendChild(item);}
  const dropZone=document.getElementById('__tf_drop_zone__');
  const fileInput=document.getElementById('__tf_file_input__');
  async function processImageFile(file){return new Promise(resolve=>{const reader=new FileReader();reader.onload=async(e)=>{const base64=e.target.result.split(',')[1];const filename='attach_'+Date.now()+'_'+file.name.replace(/[^a-zA-Z0-9._-]/g,'_');const r=await window.__tfSaveImage__({filename,base64});if(r&&r.ok){addAttachItem(r.filename,base64,r.path);addMsg(\`[첨부] \${r.filename}\`);}resolve();};reader.readAsDataURL(file);});}
  dropZone.addEventListener('dragover',e=>{e.preventDefault();dropZone.classList.add('drag-over');});
  dropZone.addEventListener('dragleave',()=>dropZone.classList.remove('drag-over'));
  dropZone.addEventListener('drop',async e=>{e.preventDefault();dropZone.classList.remove('drag-over');for(const f of Array.from(e.dataTransfer.files))if(f.type.startsWith('image/'))await processImageFile(f);});
  fileInput.addEventListener('change',async()=>{for(const f of Array.from(fileInput.files))await processImageFile(f);fileInput.value='';});

  // ── Chat ──
  function addMsg(text){const log=document.getElementById('__tf_chat_log__');const div=document.createElement('div');div.className='__tf_msg__';div.innerHTML='<small>'+new Date().toLocaleTimeString()+'</small>'+text;log.appendChild(div);log.scrollTop=log.scrollHeight;}
  function collectShotPaths(){return Array.from(document.querySelectorAll('#__tf_shots_list__ .__tf_shot_name__')).map(el=>el.textContent).filter(Boolean);}
  function sendMsg(){const input=document.getElementById('__tf_chat_input__');const msg=input.value.trim();const shots=collectShotPaths();const attaches=attachedImages.map(a=>a.filename);if(!msg&&shots.length===0&&attaches.length===0)return;const payload={message:msg,screenshots:shots,attachments:attaches};addMsg(msg||'(이미지 전송)');input.value='';window.__tfChat__&&window.__tfChat__(JSON.stringify(payload));}
  document.getElementById('__tf_chat_send__').addEventListener('click',sendMsg);
  document.getElementById('__tf_chat_input__').addEventListener('keydown',e=>{if(e.ctrlKey&&e.key==='Enter')sendMsg();});
  function saveMemo(){const input=document.getElementById('__tf_chat_input__');const msg=input.value.trim();if(!msg){addMsg('[메모저장] 내용이 없습니다');return;}window.__tfSaveMemo__&&window.__tfSaveMemo__(msg).then(r=>{if(r&&r.ok){addMsg('[📝 메모저장] design.md에 저장됨');input.value='';}else{addMsg('[메모저장 오류]');}});}
  document.getElementById('__tf_memo_save__').addEventListener('click',saveMemo);
  document.getElementById('__tf_match_btn__').addEventListener('click',async()=>{const shots=collectShotPaths();const attaches=attachedImages.map(a=>a.filename);if(!shots.length&&!attaches.length){addMsg('[일치] 스크린샷/이미지 필요');return;}const input=document.getElementById('__tf_chat_input__');const note=input.value.trim();const payload={type:'MATCH_DESIGN',message:note||'디자인을 완전히 일치시켜주세요',screenshots:shots,attachments:attaches,url:window.location.href};addMsg(\`[✦ 일치] 스크린샷\${shots.length}개+첨부\${attaches.length}개\`);input.value='';window.__tfChat__&&window.__tfChat__(JSON.stringify(payload));});

  // ── Benchmark split view (true 50/50 window split) ──
  document.getElementById('__tf_bench_open__').addEventListener('click', async() => {
    const url=document.getElementById('__tf_bench_url__').value.trim();
    if(!url){addMsg('[벤치마크] URL을 입력해주세요');return;}
    const btn=document.getElementById('__tf_bench_open__');
    btn.disabled=true; btn.textContent='⏳ 분할 창 열기 중...';
    addMsg(\`[벤치마크] \${url} — 분할 창 생성 중...\`);
    try {
      await window.__tfOpenBenchmark__(url, window.location.href);
    } catch(e) { addMsg('[벤치마크 오류] '+e.message); btn.disabled=false; btn.textContent='⊞ 우측 분할 열기'; }
  });

  // ── Mouse tracking ──
  let lastEl=null;
  document.addEventListener('mousemove',e=>{
    coord.textContent='x: '+e.clientX+',  y: '+e.clientY;
    const oIds=['__tf_coord__','__tf_tip__','__tf_highlight__','__tf_toggle__','__tf_sidebar__'];
    let el=document.elementFromPoint(e.clientX,e.clientY);
    if(!el||oIds.some(id=>el.closest&&el.closest('#'+id))){tip.style.display='none';hl.style.display='none';return;}
    const meaningfulTags=['button','a','nav','header','footer','input','select','textarea','form','section','article','aside','dialog','main','label','img','video','table','ul','ol'];
    let target=el;
    for(let i=0;i<6;i++){if(!target.parentElement)break;if(meaningfulTags.includes(target.tagName.toLowerCase()))break;if(target.getAttribute('role')||target.getAttribute('aria-label'))break;if(target===document.body)break;target=target.parentElement;}
    if(target===lastEl)return;lastEl=target;
    const label=getDesignLabel(target);
    if(label){tip.innerHTML=label;tip.style.display='block';tip.style.left=Math.min(e.clientX+14,window.innerWidth-300)+'px';tip.style.top=(e.clientY-36)+'px';const rect=target.getBoundingClientRect();hl.style.cssText+=\`;display:block;left:\${rect.left}px;top:\${rect.top}px;width:\${rect.width}px;height:\${rect.height}px;\`;}
    else{tip.style.display='none';hl.style.display='none';}
  },{passive:true});
  document.addEventListener('mouseleave',()=>{tip.style.display='none';hl.style.display='none';});
  console.log('[tools-frontend] overlay injected');
})();
`;

// ── Benchmark iframe overlay JS ───────────────────────────────────────────────
const BENCH_OVERLAY_JS = `
(function() {
  if (document.getElementById('__tf_coord__')) return;
  ${GET_DESIGN_LABEL_FN}

  const coord=document.createElement('div'); coord.id='__tf_coord__'; coord.className='bench';
  coord.textContent='x: 0,  y: 0';
  const tip=document.createElement('div'); tip.id='__tf_tip__'; tip.className='bench';
  const hl=document.createElement('div'); hl.id='__tf_highlight__'; hl.className='bench';
  // Right-click selection box (appended to body, position:absolute)
  const benchSel=document.createElement('div'); benchSel.id='__tf_bench_sel__';
  const benchSelLbl=document.createElement('div'); benchSelLbl.id='__tf_bench_sel_lbl__';
  benchSel.appendChild(benchSelLbl);
  const hint=document.createElement('div'); hint.id='__tf_bench_hint__';
  hint.textContent='우클릭 + 드래그 → 영역 분석 → 메모 자동 입력';
  document.body.append(coord,tip,hl,benchSel,hint);

  // ── Hover tooltip ──
  let lastEl=null;
  document.addEventListener('mousemove',e=>{
    coord.textContent='x: '+e.clientX+',  y: '+e.clientY;
    if(rcDragging)return;
    const oIds=['__tf_coord__','__tf_tip__','__tf_highlight__','__tf_bench_sel__','__tf_bench_hint__'];
    let el=document.elementFromPoint(e.clientX,e.clientY);
    if(!el||oIds.some(id=>el.closest&&el.closest('#'+id))){tip.style.display='none';hl.style.display='none';return;}
    const meaningfulTags=['button','a','nav','header','footer','input','select','textarea','form','section','article','aside','dialog','main','label','img','video','table','ul','ol'];
    let target=el;
    for(let i=0;i<6;i++){if(!target.parentElement||target===document.body)break;if(meaningfulTags.includes(target.tagName.toLowerCase()))break;if(target.getAttribute('role')||target.getAttribute('aria-label'))break;target=target.parentElement;}
    if(target===lastEl)return;lastEl=target;
    const label=getDesignLabel(target);
    if(label){tip.innerHTML=label;tip.style.display='block';tip.style.left=Math.min(e.clientX+14,window.innerWidth-300)+'px';tip.style.top=(e.clientY-36)+'px';const rect=target.getBoundingClientRect();hl.style.cssText+=\`;display:block;left:\${rect.left}px;top:\${rect.top}px;width:\${rect.width}px;height:\${rect.height}px;\`;}
    else{tip.style.display='none';hl.style.display='none';}
  },{passive:true});

  // ── Right-click drag analyze ──
  let rcDragging=false, rcSx, rcSy;
  document.addEventListener('mousedown',e=>{
    if(e.button!==2)return; e.preventDefault();
    rcDragging=true; rcSx=e.clientX; rcSy=e.clientY;
    tip.style.display='none'; hl.style.display='none';
    benchSel.style.cssText='position:fixed;border:2px solid #ff9900;background:rgba(255,153,0,0.10);pointer-events:none;display:block;left:'+rcSx+'px;top:'+rcSy+'px;width:0;height:0;z-index:2147483644;';
  });
  document.addEventListener('mousemove',e=>{
    if(!rcDragging)return;
    const x=Math.min(e.clientX,rcSx),y=Math.min(e.clientY,rcSy),w=Math.abs(e.clientX-rcSx),h=Math.abs(e.clientY-rcSy);
    benchSel.style.left=x+'px';benchSel.style.top=y+'px';benchSel.style.width=w+'px';benchSel.style.height=h+'px';
    benchSelLbl.textContent=Math.round(w)+' × '+Math.round(h)+' | 분석 준비';
  });
  document.addEventListener('mouseup',async e=>{
    if(!rcDragging||e.button!==2)return; rcDragging=false;
    const x=Math.min(e.clientX,rcSx),y=Math.min(e.clientY,rcSy),w=Math.abs(e.clientX-rcSx),h=Math.abs(e.clientY-rcSy);
    benchSel.style.display='none';
    if(w<10||h<10)return;
    hint.textContent='⏳ 분석 중...';
    const desc=analyzeRegion(x,y,w,h);
    await window.__tfDescribe__(desc);
    hint.textContent='✓ 분석 완료 — 왼쪽 메모창 확인';
    setTimeout(()=>{hint.textContent='우클릭 + 드래그 → 영역 분석 → 메모 자동 입력';},3000);
  });
  document.addEventListener('contextmenu',e=>e.preventDefault());

  // ── Region analyzer ──
  function analyzeRegion(rx,ry,rw,rh) {
    const seen=new Set(), elInfos=[], colorSet=new Set();
    const step=Math.max(6,Math.min(rw,rh)/14);
    for(let px=rx+2;px<rx+rw;px+=step)for(let py=ry+2;py<ry+rh;py+=step){
      const el=document.elementFromPoint(px,py);
      if(el&&!seen.has(el)&&!el.id.startsWith('__tf_')){seen.add(el);elInfos.push(el);}
    }
    const dedup=new Set(); const infos=[];
    for(const el of elInfos){
      const tag=el.tagName.toLowerCase();
      const text=(el.innerText||'').trim().replace(/\\s+/g,' ').slice(0,80);
      const cls=(typeof el.className==='string'?el.className:'').toLowerCase();
      const key=tag+'|'+cls.slice(0,25)+'|'+text.slice(0,18);
      if(dedup.has(key))continue; dedup.add(key);
      const rect=el.getBoundingClientRect();
      let style;
      try{style=window.getComputedStyle(el);}catch(e){continue;}
      const bg=style.backgroundColor, color=style.color;
      if(bg&&bg!=='rgba(0, 0, 0, 0)'&&bg!=='transparent')colorSet.add(bg);
      if(color)colorSet.add(color);
      infos.push({tag,text,cls,id:(el.id||''),role:(el.getAttribute('role')||''),ariaLabel:(el.getAttribute('aria-label')||''),rect,fontSize:style.fontSize,fontWeight:style.fontWeight,borderRadius:style.borderRadius,padding:style.padding,display:style.display,flexDir:style.flexDirection,gap:style.gap,bg,color,position:style.position});
    }
    const url=window.location.href;
    const lines=[\`## 벤치마크 영역 분석\`,\`사이트: \${url}\`,\`선택 영역: \${Math.round(rw)}×\${Math.round(rh)}px  위치: (\${Math.round(rx)}, \${Math.round(ry)})\`,\`\`];
    // Design label for top-level container
    const topEl=document.elementFromPoint(rx+rw/2,ry+rh/2);
    if(topEl){const lbl=getDesignLabel(topEl);if(lbl)lines.push(\`### 선택 영역 구성 요소\\n- \${lbl.replace(/<[^>]+>/g,'')}\`,\`\`);}
    // Structure
    const structural=['header','nav','main','section','article','aside','footer','form','ul','ol','table'];
    const containers=infos.filter(e=>structural.includes(e.tag));
    if(containers.length){lines.push('### 레이아웃 구조');for(const e of containers.slice(0,5)){let s=\`- \${e.tag}\`;if(e.cls)s+=\`.\${e.cls.split(' ')[0]}\`;if(e.id)s+=\`#\${e.id}\`;s+=\` (\${Math.round(e.rect.width)}×\${Math.round(e.rect.height)}px)\`;if(e.display==='flex')s+=\` flex\${e.flexDir&&e.flexDir!=='row'?' '+e.flexDir:''}\${e.gap&&e.gap!=='normal'?' gap:'+e.gap:''}\`;if(e.display==='grid')s+=' grid';lines.push(s);}lines.push('');}
    // Interactive
    const interactive=infos.filter(e=>['button','a','input','select','textarea'].includes(e.tag));
    if(interactive.length){lines.push('### 인터랙티브 요소');for(const e of interactive.slice(0,8)){let s=\`- \${e.tag}\${e.cls?' .'+e.cls.split(' ')[0]:''}\`;if(e.text)s+=\` "\${e.text.slice(0,40)}"\`;if(e.ariaLabel)s+=\` [aria: \${e.ariaLabel}]\`;s+=\` — \${Math.round(e.rect.width)}×\${Math.round(e.rect.height)}px\`;if(e.bg&&e.bg!=='rgba(0, 0, 0, 0)')s+=\` bg:\${e.bg}\`;if(e.color)s+=\` 글자:\${e.color}\`;if(e.borderRadius&&e.borderRadius!=='0px')s+=\` 모서리:\${e.borderRadius}\`;if(e.padding&&e.padding!=='0px')s+=\` 패딩:\${e.padding}\`;lines.push(s);}lines.push('');}
    // Typography
    const textEls=infos.filter(e=>['h1','h2','h3','h4','h5','h6','p','span','label','a'].includes(e.tag)&&e.text);
    if(textEls.length){lines.push('### 텍스트 & 타이포그래피');for(const e of textEls.slice(0,8)){let s=\`- \${e.tag}: "\${e.text.slice(0,60)}"\`;s+=\` — \${e.fontSize}\`;if(parseInt(e.fontWeight)>=600)s+=\` bold(\${e.fontWeight})\`;if(e.color)s+=\` 색상:\${e.color}\`;lines.push(s);}lines.push('');}
    // Colors
    const colors=Array.from(colorSet).slice(0,8);
    if(colors.length){lines.push('### 색상 팔레트');colors.forEach(c=>lines.push(\`- \${c}\`));lines.push('');}
    // Hints
    lines.push('### 구현 힌트');
    if(infos.some(e=>e.display==='flex'))lines.push('- Flexbox 레이아웃');
    if(infos.some(e=>e.display==='grid'))lines.push('- CSS Grid 레이아웃');
    if(infos.some(e=>e.borderRadius&&e.borderRadius!=='0px'&&e.borderRadius!=='0px 0px 0px 0px'))lines.push('- 둥근 모서리(border-radius) 적용됨');
    const btnCnt=interactive.filter(e=>e.tag==='button').length;
    if(btnCnt)lines.push(\`- 버튼 \${btnCnt}개 → shadcn/ui Button 참고\`);
    const inputCnt=interactive.filter(e=>e.tag==='input').length;
    if(inputCnt)lines.push(\`- 입력 필드 \${inputCnt}개 → shadcn/ui Input 참고\`);
    if(infos.some(e=>e.position==='fixed'||e.position==='sticky'))lines.push('- 고정/스티키 포지션 요소 포함');
    return lines.join('\\n');
  }

  console.log('[tools-frontend] bench overlay injected');
})();
`;

// ── Main ──────────────────────────────────────────────────────────────────────
(async () => {
  const browser = await chromium.launch({
    headless: false,
    args: ['--window-size=1440,900', '--ignore-certificate-errors']
  });

  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });

  // ── Screenshot ──
  await context.exposeFunction('__tfScreenshot__', async ({ x, y, width, height }) => {
    try {
      const filename = `shot_${Date.now()}.png`;
      const filepath = path.join(OUTPUT_DIR, filename);
      await activePage.evaluate(() => {
        ['__tf_coord__','__tf_tip__','__tf_highlight__','__tf_toggle__','__tf_sidebar__','__tf_bench_panel__'].forEach(id => {
          const el = document.getElementById(id); if (el) el.style.visibility = 'hidden';
        });
      });
      await activePage.screenshot({ path: filepath, clip: { x, y, width, height } });
      await activePage.evaluate(() => {
        ['__tf_coord__','__tf_tip__','__tf_highlight__','__tf_toggle__','__tf_sidebar__','__tf_bench_panel__'].forEach(id => {
          const el = document.getElementById(id); if (el) el.style.visibility = '';
        });
      });
      const base64 = fs.readFileSync(filepath).toString('base64');
      console.log(`[screenshot] ${x},${y} ${width}x${height} → ${filepath}`);
      return { filename, base64, path: filepath };
    } catch (e) { console.error('[screenshot error]', e.message); return { error: e.message }; }
  });

  await context.exposeFunction('__tfSaveImage__', ({ filename, base64 }) => {
    try {
      const filepath = path.join(OUTPUT_DIR, filename);
      fs.writeFileSync(filepath, Buffer.from(base64, 'base64'));
      return { ok: true, filename, path: filepath };
    } catch (e) { return { ok: false, error: e.message }; }
  });

  await context.exposeFunction('__tfDeleteShot__', (filename) => {
    try {
      const filepath = path.join(OUTPUT_DIR, filename);
      if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
    } catch (e) {}
  });

  await context.exposeFunction('__tfChat__', (message) => {
    const logPath = path.join(OUTPUT_DIR, 'chat.log');
    fs.appendFileSync(logPath, `[${new Date().toISOString()}] ${message}\n`);
    console.log(`[chat] ${message}`);
  });

  await context.exposeFunction('__tfSaveMemo__', (message) => {
    try {
      const designPath = path.join(OUTPUT_DIR, 'design.md');
      const now = new Date();
      const timestamp = now.toISOString().replace('T', ' ').slice(0, 19);
      const url = activePage.url ? activePage.url() : '';
      const entry = `\n## [${timestamp}] ${url}\n\n${message}\n\n---\n`;
      fs.appendFileSync(designPath, entry, 'utf8');
      console.log(`[memo] saved to design.md`);
      return { ok: true };
    } catch (e) {
      console.error('[memo error]', e.message);
      return { ok: false };
    }
  });

  // ── Benchmark: write bench analysis to main page memo ──
  await context.exposeFunction('__tfDescribe__', async (description) => {
    try {
      await activePage.evaluate((text) => {
        const textarea = document.getElementById('__tf_chat_input__');
        if (textarea) {
          textarea.value = textarea.value ? textarea.value + '\n\n' + text : text;
          textarea.focus();
          textarea.style.borderColor = '#ff9900';
          setTimeout(() => { textarea.style.borderColor = ''; }, 800);
          const sidebar = document.getElementById('__tf_sidebar__');
          if (sidebar) sidebar.classList.add('open');
          const log = document.getElementById('__tf_chat_log__');
          if (log) {
            const div = document.createElement('div'); div.className = '__tf_msg__';
            div.innerHTML = '<small>' + new Date().toLocaleTimeString() + '</small>[벤치마크 분석] 메모에 삽입됨';
            log.appendChild(div); log.scrollTop = log.scrollHeight;
          }
        }
      }, description);
      console.log('[describe] written to main page memo');
    } catch (e) { console.error('[describe error]', e.message); }
  });

  // ── Open benchmark in a new browser window ──
  let benchPage = null;
  await context.exposeFunction('__tfOpenBenchmark__', async (benchUrl) => {
    try {
      if (benchPage && !benchPage.isClosed()) {
        await benchPage.goto(benchUrl, { waitUntil: 'domcontentloaded', timeout: 15000 });
      } else {
        benchPage = await context.newPage();
        await benchPage.goto(benchUrl, { waitUntil: 'networkidle', timeout: 30000 });
      }
      await benchPage.waitForTimeout(500);
      await benchPage.addStyleTag({ content: OVERLAY_CSS });
      await benchPage.evaluate(BENCH_OVERLAY_JS);
      console.log(`[bench] opened: ${benchUrl}`);
      return { ok: true };
    } catch (e) {
      console.error('[bench error]', e.message);
      throw e;
    }
  });

  activePage = await context.newPage();

  activePage.on('framenavigated', async (frame) => {
    if (frame !== activePage.mainFrame()) return;
    try {
      await activePage.waitForLoadState('networkidle');
      await activePage.waitForTimeout(300);
      await activePage.addStyleTag({ content: OVERLAY_CSS });
      await activePage.evaluate(OVERLAY_JS);
    } catch (_) {}
  });

  console.log(`\n[tools-frontend] Opening: ${TARGET_URL}`);
  await activePage.goto(TARGET_URL, { waitUntil: 'networkidle', timeout: 30000 });
  await activePage.waitForTimeout(500);

  try {
    await activePage.addStyleTag({ content: OVERLAY_CSS });
    await activePage.evaluate(OVERLAY_JS);
  } catch (e) { console.warn('[warn] inject failed:', e.message); }

  console.log('[tools-frontend] ready');
  console.log('  · 요소 호버: 전문 디자인 용어 툴팁 (모달/내비게이션바/히어로 등)');
  console.log('  · TOOLS → 벤치마크 URL → ⊞ 우측 분할 열기');
  console.log('  · 벤치마크 창: 우클릭+드래그 → 영역 분석 → 메모 자동 입력');
  console.log('  · 저장 경로: ' + OUTPUT_DIR);
})();
