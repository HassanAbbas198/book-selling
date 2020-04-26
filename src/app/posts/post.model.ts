// creating a Post interface
export interface Post {
  id: string;
  title: string;
  content: string;
  price: number;
  imagePath: string;
  creatorId: string;
  creatorName: string | any;
  date: Date | any;
}
