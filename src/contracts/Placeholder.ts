export abstract class Placeholder {
   protected abstract key: string;

   public abstract populate(data: any): void;
}
