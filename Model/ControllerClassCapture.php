<?php

namespace Llapgoch\BreakFastBar\Model;

class ControllerClassCapture
{
    protected $controllerClass = '';

    public function set(string $className): void
    {
        $this->controllerClass = $className;
    }

    public function get(): string
    {
        return $this->controllerClass;
    }
}
