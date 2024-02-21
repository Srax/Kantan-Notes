export default class RichNote {
  private id: number;
  private content: string;
  private css: string;
  private createdAt: number;
  private updatedAt: number;

  public getId(): number {
    return this.id;
  }

  public setId(id: number): void {
    this.id = id;
  }

  public getContent(): string {
    return this.content;
  }

  public setContent(Content: string): void {
    this.content = Content;
  }

  public getCss(): string {
    return this.css;
  }

  public setCss(css: string): void {
    this.css = css;
  }

  public getCreatedAt(): number {
    return this.createdAt;
  }

  public setCreatedAt(createdAt: number): void {
    this.createdAt = createdAt;
  }

  public getUpdatedAt(): number {
    return this.updatedAt;
  }

  public setUpdatedAt(updatedAt: number): void {
    this.updatedAt = updatedAt;
  }

  constructor(
    id: number,
    content: string,
    css: string,
    createdAt: number,
    updatedAt: number
  ) {
    this.id = id;
    this.content = content;
    this.css = css;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
