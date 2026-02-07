<?php

namespace Llapgoch\BreakFastBar\Block\Panel;

class RequestPanel extends AbstractPanel
{
    public function __construct(
        \Magento\Framework\View\Element\Template\Context $context,
        array $data = []
    ) {
        parent::__construct($context, $data);

        $this->_title = 'Request';
        $this->_buttonTitle = 'Request';
        $this->_cssClassSuffix = 'request';
    }
}
