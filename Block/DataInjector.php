<?php

namespace Llapgoch\BreakFastBar\Block;

use Llapgoch\BreakFastBar\Model\Config;
use Llapgoch\BreakFastBar\Model\ControllerClassCapture;
use Magento\Framework\App\Request\Http;
use Magento\Framework\App\State;
use Magento\Framework\View\Element\Template;
use Magento\Framework\View\Layout;
use Magento\Store\Model\StoreManagerInterface;

class DataInjector extends Template
{
    public function __construct(
        Template\Context $context,
        protected Layout $layout,
        protected Http $request,
        protected StoreManagerInterface $storeManager,
        protected State $appState,
        protected ControllerClassCapture $controllerClassCapture,
        protected Config $config,
        array $data = []
    ) {
        parent::__construct($context, $data);
    }

    public function isToolbarVisible(): bool
    {
        return $this->config->isToolbarVisible();
    }

    public function getJsonData(): string
    {
        $data = [
            'blocks' => $this->getBlockTree(),
            'handles' => $this->getHandles(),
            'request' => $this->getRequestInfo(),
        ];

        return json_encode($data, JSON_HEX_TAG | JSON_HEX_AMP);
    }

    protected function getBlockTree(): array
    {
        $elements = $this->layout->getStructure()->exportElements();
        return $this->buildCompleteElementStructure($elements);
    }

    protected function buildCompleteElementStructure(array $elements): array
    {
        $structure = [];

        foreach ($elements as $name => $element) {
            if (isset($element['parent'])) {
                continue;
            }
            $this->buildElementStructure($elements, $name, $structure);
        }

        return $structure;
    }

    protected function buildElementStructure(array $elements, string $name, array &$structure): void
    {
        if (!isset($elements[$name])) {
            return;
        }

        $element = $elements[$name];
        $structure[$name] = $element;
        unset($structure[$name]['children']);

        // Add extras from the actual block instance
        $block = $this->layout->getBlock($name);
        if ($block) {
            if ($block instanceof \Magento\Cms\Block\Block) {
                $structure[$name]['id'] = $block->getBlockId();
            }
            if ($block instanceof \Magento\Cms\Block\Page) {
                $structure[$name]['page-id'] = $block->getPage()->getIdentifier();
            }
            if ($block instanceof \Magento\Framework\View\Element\Template) {
                $structure[$name]['template'] = $block->getTemplate();
            }
            $structure[$name]['block-type'] = $block->getType();
        }

        if (isset($element['children']) && $element['children']) {
            $structure[$name]['children'] = [];
            foreach ($element['children'] as $childName => $child) {
                $this->buildElementStructure($elements, $childName, $structure[$name]['children']);
            }
        }
    }

    protected function getHandles(): array
    {
        return $this->layout->getUpdate()->getHandles();
    }

    protected function getRequestInfo(): array
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
