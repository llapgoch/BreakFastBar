<?php

namespace Llapgoch\BreakFastBar\Block\Panel\Request;

class Content extends \Magento\Framework\View\Element\Template
{
    protected $request;
    protected $storeManager;
    protected $appState;
    protected $controllerClassCapture;

    public function __construct(
        \Magento\Framework\View\Element\Template\Context $context,
        \Magento\Framework\App\Request\Http $request,
        \Magento\Store\Model\StoreManagerInterface $storeManager,
        \Magento\Framework\App\State $appState,
        \Llapgoch\BreakFastBar\Model\ControllerClassCapture $controllerClassCapture,
        array $data = []
    ) {
        $this->request = $request;
        $this->storeManager = $storeManager;
        $this->appState = $appState;
        $this->controllerClassCapture = $controllerClassCapture;
        parent::__construct($context, $data);
    }

    public function getRequestInfo(): array
    {
        $store = $this->storeManager->getStore();

        return [
            'Module' => $this->request->getModuleName(),
            'Controller' => $this->request->getControllerName(),
            'Action' => $this->request->getActionName(),
            'Full Action Name' => $this->request->getFullActionName(),
            'Controller Class' => $this->controllerClassCapture->get(),
            'Route Name' => $this->request->getRouteName(),
            'Front Name' => $this->request->getFrontName(),
            'Path Info' => $this->request->getPathInfo(),
            'Area' => $this->appState->getAreaCode(),
            'Store Code' => $store->getCode(),
            'Store ID' => $store->getId(),
            'Store Name' => $store->getName(),
        ];
    }
}
