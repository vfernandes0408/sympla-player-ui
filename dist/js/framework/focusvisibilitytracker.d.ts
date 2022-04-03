export declare class FocusVisibilityTracker {
    private bitmovinUiPrefix;
    private readonly eventHandlerMap;
    private lastInteractionWasKeyboard;
    constructor(bitmovinUiPrefix: string);
    private onKeyDown;
    private onMouseOrPointerOrTouch;
    private onFocus;
    private onBlur;
    private registerEventListeners;
    private unregisterEventListeners;
    release(): void;
}
