import heroImage from "../assets/barber-club-hero.png";

export type CutPhoto = {
  src: string;
  title: string;
  description: string;
};

export const cutPhotos: CutPhoto[] = [
  {
    src: heroImage,
    title: "Degradê baixo alinhado",
    description: "Acabamento marcado e transição suave."
  },
  {
    src: heroImage,
    title: "Social com risca",
    description: "Corte polido com finalização clássica."
  },
  {
    src: heroImage,
    title: "Freestyle infantil",
    description: "Desenho personalizado com acabamento limpo."
  },
  {
    src: heroImage,
    title: "Mid fade texturizado",
    description: "Volume natural e lateral bem encaixada."
  }
];
