import User from "./user.model";

export default class Post {
  constructor(
    public id: string = "",
    public title: string = "",
    public content: string = "",
    public createdAt: Date = new Date(),
    public user?: User
  ) {}

  public get truncatedContent(): string {
    return this.content.length > 128
      ? `${this.content.substring(0, 125)}...`
      : this.content;
  }
}
