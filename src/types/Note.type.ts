export default class Note {
  private id: number;
  private title: string;
  private text: string;
  private createdAt: number;
  private updatedAt: number;

  public getId(): number {
    return this.id;
  }

  public setId(id: number): void {
    this.id = id;
  }

  public getTitle(): string {
    return this.title;
  }

  public setTitle(title: string): void {
    this.title = title;
  }

  public getText(): string {
    return this.text;
  }

  public setText(text: string): void {
    this.text = text;
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
    title: string,
    text: string,
    createdAt: number,
    updatedAt: number
  ) {
    this.id = id;
    this.title = title;
    this.text = text;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
