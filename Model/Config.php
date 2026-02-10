<?php

namespace Llapgoch\BreakFastBar\Model;

use Magento\Framework\App\Config\ScopeConfigInterface;
use Magento\Store\Model\ScopeInterface;

class Config
{
    private const XML_PATH_SHOW_TOOLBAR = 'llapgoch_breakfastbar/general/show_toolbar';

    private ScopeConfigInterface $scopeConfig;

    public function __construct(ScopeConfigInterface $scopeConfig)
    {
        $this->scopeConfig = $scopeConfig;
    }

    public function isToolbarVisible(): bool
    {
        return $this->scopeConfig->isSetFlag(
            self::XML_PATH_SHOW_TOOLBAR,
            ScopeInterface::SCOPE_STORE
        );
    }
}
