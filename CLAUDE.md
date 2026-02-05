# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Module Overview

**Llapgoch_BreakFastBar** is a frontend developer toolbar for Magento 2 that displays blocks, containers, and layout handles on the current page. It works with both traditional Luma/Blank themes (via RequireJS) and Hyva themes (loading jQuery from CDN). This is a dev-only tool — not for production.

## Commands

From `httpdocs/`:

```bash
bin/magento module:enable Llapgoch_BreakFastBar
bin/magento module:disable Llapgoch_BreakFastBar
bin/magento setup:upgrade          # After enabling/disabling
bin/magento cache:flush            # After layout/template changes
```

No build step, no tests, no compilation needed. Static assets are served directly.

## Architecture

### How Block Marking Works

The core mechanism injects HTML comments around every block and container on the page:

1. **`Block/View/AbstractBlock/Plugin.php`** — An `afterToHtml` plugin on `Magento\Framework\View\Element\AbstractBlock` wraps every block's output with `<!-- {name}-start-viewer {marker} -->` / `<!-- {name}-end-viewer {marker} -->` comments.
2. **`Model/View/Layout.php`** — A preference override of `Magento\Framework\View\Layout` that wraps container output with the same comment pattern via `_renderContainer()`. Note: this uses a class preference (not interface preference) because preferencing `LayoutInterface` breaks handle loading.
3. **`Helper/Data.php`** — Centralizes the comment-wrapping logic. Maintains a list of forbidden block names (the toolbar's own blocks) to avoid infinite recursion. Also prevents wrapping during AJAX requests.

### Frontend JS Architecture

All JS uses jQuery widgets (not Alpine.js). Four scripts loaded via `<link>` tags in `view/base/layout/default.xml`:

- **`toolbar.init.js`** — jQuery loader. Detects RequireJS (`window.require`) for Luma or loads jQuery/jQuery UI from CDN for Hyva. Exports to `window.llapgochjQueryLoader.$` and dispatches `llapgoch-jquery-loaded` event.
- **`toolbar.controller.js`** — `$.widget('llapgoch.breakfastbarcontroller')` — Main visibility toggle. Persists open/closed state to `localStorage` key `breakfastbar-visible`.
- **`toolbar.widget.js`** — `$.widget('llapgoch.breakfastbar')` — Panel open/close, tree item expand/collapse with height animation.
- **`toolbar.blockviewer.widget.js`** — `$.widget('llapgoch.breakfastbarblockviewer')` — Block highlighting. Finds HTML comment markers in the DOM, calculates bounding boxes of content between markers, creates a purple overlay div positioned over the block, and scrolls to it.

#### JS Loading Chain

Scripts are included via `<link>` (not `<script>`) in layout XML so Hyva processes them as plain script includes, bypassing RequireJS. The loading sequence:

1. `toolbar.init.js` runs first. If `window.require` exists (Luma), it uses RequireJS to get Magento's jQuery. If not (Hyva), it dynamically injects `<script>` tags for jQuery 3.6.0 and jQuery UI 1.14.1 from CDN, then calls `jQuery.noConflict()` to avoid global conflicts. Either path stores the reference on `window.llapgochjQueryLoader.$` and fires a `llapgoch-jquery-loaded` CustomEvent.
2. Each widget file wraps its code in an IIFE with an `init($)` function. On load, it checks `window.llapgochjQueryLoader.loaded` — if false, it listens for the `llapgoch-jquery-loaded` event; if true, it calls `init()` immediately. This makes load order between files irrelevant.
3. Each widget auto-initializes on `$(document).ready()` targeting its CSS class selector (`.js-breakfastbar-controller`, `.js-breakfastbar-widget`).

### Layout Structure

`view/base/layout/default.xml` adds a `llapgoch.breakfastbar` container to every page with:
- Background overlay block
- Logo/toggle button (SVG)
- **BlockPanel** — Tree view of all blocks with metadata (template, class, CMS block/page ID). Highlight button per block.
- **HandlePanel** — List of layout handles applied to the current page.

### Block Panels

`Block/Panel/AbstractPanel.php` is the base class. Subclasses:
- **`BlockPanel`** — Builds the block tree from layout structure data. `buildCompleteElementStructure()` creates the tree; `buildHtmlStructure()` recursively renders it using `Listing/Item` and `Listing/Container` child blocks. `getBlockExtras()` extracts template name, block class, CMS block/page IDs.
- **`HandlePanel`** — Simple panel; delegates to `Handle/Content` block which calls `$layout->getUpdate()->getHandles()`.

### DI Configuration (`etc/di.xml`)

- `Item` and `Container` blocks are **non-shared** (new instance per request) — required because they're reused in the recursive tree building.
- Plugin on `AbstractBlock::toHtml()` for block comment injection.
- Layout class preference for container comment injection.

### CSS

Single stylesheet `view/base/web/css/breakfastbar.css`. Toolbar is fixed at page bottom, z-index 1000. Panels slide up with CSS transforms. Block depth levels use `.level_X` classes (10-110) with gradient blue backgrounds.

## Key Data Attributes

- `data-layout-name` on block list items — block name with dots converted to dashes (used by blockviewer widget to match DOM comments).

## Important Gotchas

- The toolbar excludes its own blocks from comment wrapping to prevent infinite recursion (see `FORBIDDEN_BLOCKS` in `Helper/Data.php`).
- `Model/View/Layout.php` uses a **Proxy** for the Helper injection to avoid circular dependency during layout construction.
- JS files are loaded via `<link>` tags (not `<script>`) in layout XML — this is intentional for Hyva compatibility.
- The module uses `view/base/` (not `view/frontend/`) so templates apply to both frontend and adminhtml areas.
