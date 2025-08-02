import EventBus from "../event-bus";

export class CycloneTextComponent {
  constructor(
    public readonly element: HTMLElement,
    private readonly initialText?: string
  ) {
    if (initialText) this.element.textContent = initialText;
  }

  public getElement(): HTMLElement {
    return this.element;
  }

  public resetText(): void {
    if (!this.initialText) return;
    this.element.textContent = this.initialText;
  }

  public updateText(newText: string): void {
    this.element.textContent = newText;
  }
}

export class CycloneReactiveText extends CycloneTextComponent {
  constructor(
    element: HTMLElement,
    private readonly eventBus: EventBus,
    private readonly rowName: string, // row on the bus ;)
    initialText?: string
  ) {
    super(element, initialText);
  }
  
  private updateTextWrapper = (newText: string) => {
    this.updateText(newText);
  };

  public init() {
    this.eventBus.on(this.rowName, this.updateTextWrapper);
  }
  
  public destroy() {
    this.eventBus.off(this.rowName, this.updateTextWrapper);
  }
}
