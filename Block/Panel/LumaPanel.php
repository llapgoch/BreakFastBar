<?php

namespace Llapgoch\BreakFastBar\Block\Panel;

class LumaPanel extends AbstractPanel
{
    public function __construct(
        \Magento\Framework\View\Element\Template\Context $context,
        array $data = []
    ) {
        parent::__construct($context, $data);

        $this->_title = 'Luma JS';
        $this->_buttonTitle = 'Luma JS';
        $this->_cssClassSuffix = 'luma';
    }
}
