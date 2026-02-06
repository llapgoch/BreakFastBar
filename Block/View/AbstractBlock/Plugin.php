<?php
namespace Llapgoch\BreakFastBar\Block\View\AbstractBlock;

class Plugin{
    protected $_helper;

    public function __construct(\Llapgoch\BreakFastBar\Helper\Data $helper){
        $this->_helper = $helper;
    }

    public function afterToHtml($subject, $result){
        // UI Component blocks output JSON/KnockoutJS config where HTML comments render visibly
        if ($subject instanceof \Magento\Framework\View\Element\UiComponentInterface) {
            return $result;
        }

        // Skip blocks whose output is purely script tags or raw JSON
        $trimmed = trim((string) $result);
        if ($this->_isNonHtmlContent($trimmed)) {
            return $result;
        }

        $blockName = $subject->getNameInLayout();

        return $this->_helper->wrapContent($blockName, $result);
    }

    protected function _isNonHtmlContent($content)
    {
        if ($content === '') {
            return false;
        }

        // Plain text with no HTML tags — can end up in titles, JS strings, KnockoutJS bindings etc.
        if (!preg_match('/<[a-z\/!][\s\S]*>/i', $content)) {
            return true;
        }

        // Content that is purely a script tag
        if (preg_match('/^<script[\s>].*<\/script>$/s', $content)) {
            return true;
        }

        // Content that looks like raw JSON
        if (preg_match('/^\s*[\{\[]/', $content) && json_decode($content) !== null) {
            return true;
        }

        return false;
    }
}