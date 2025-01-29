<?php

namespace Llapgoch\BreakFastBar\Block\Panel;

abstract class AbstractPanel extends \Magento\Framework\View\Element\Template
{
    protected $_itemBlock;
    protected $_itemContainer;
    protected $_title = 'Panel Title';
    protected $_buttonTitle = 'Toolbar Button';
    protected $_cssClassPrefix = 'devbar-panel-';
    protected $_cssClassSuffix = 'default';
    protected $_cssInitClasses = array(
        "js-breakfastbar-widget"
    );

    public function __construct(
        \Magento\Framework\View\Element\Template\Context $context,
        array $data = []
    ) {

        parent::__construct($context, $data);
    }

    public function getContent()
    {
        return $this->getChildHtml('content');
    }

    public function getTitle()
    {
        return __($this->_title);
    }



    public function getCssClass()
    {
        return $this->_cssClassPrefix . $this->_cssClassSuffix . " " . $this->getInitClassString();
    }

    public function setTitle($title)
    {
        $this->_title = $title;
    }

    public function getButtonTitle()
    {
        return __($this->_buttonTitle);
    }

    public function setButtonTitle($title)
    {
        $this->_buttonTitle = $title;
    }

    public function getItemContent($item)
    {
        $this->_itemBlock->setItem($item);
        return $this->_itemTemplate->toHtml();
    }

    protected function getInitClassString(): string
    {
        return implode(' ', $this->_cssInitClasses);
    }
}
