<?php

namespace Llapgoch\BreakFastBar\Observer;

use Magento\Framework\Event\Observer;
use Magento\Framework\Event\ObserverInterface;
use Llapgoch\BreakFastBar\Model\ControllerClassCapture;

class CaptureControllerClass implements ObserverInterface
{
    protected $capture;

    public function __construct(ControllerClassCapture $capture)
    {
        $this->capture = $capture;
    }

    public function execute(Observer $observer): void
    {
        $this->capture->set(get_class($observer->getControllerAction()));
    }
}
