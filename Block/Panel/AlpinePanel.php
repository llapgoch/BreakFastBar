<?php

namespace Llapgoch\BreakFastBar\Block\Panel;

class AlpinePanel extends AbstractPanel
{
    public function __construct(
        \Magento\Framework\View\Element\Template\Context $context,
        array $data = []
    ) {
        parent::__construct($context, $data);

        $this->_title = 'Alpine';
        $this->_buttonTitle = 'Alpine';
        $this->_cssClassSuffix = 'alpine';
    }
}
