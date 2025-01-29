<?php

namespace Llapgoch\BreakFastBar\Block\Panel\Listing;

class Container extends \Magento\Framework\View\Element\Template
{
    public function _construct()
    {
        $this->setTemplate('toolbar/block/list/container.phtml');
    }
}
