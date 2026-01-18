export type ThemeKey =
  | "grainy-paper"
  | "grainy-dark"
  | "dark-stone"
  | "black-gray"
  | "blackgray-two"
  | "blackgray-normal"
  | "dark"
  | "dark-lavander"
  | "dark-ocean"
  | "film-dust-scratches"
  | "ocean"
  | "orange-black"
  | "red"
  | "blue"

export const THEMES: Record<
  ThemeKey,
  {
    name: string;
    url: string;
    overlay: "light" | "dark";
    textColor: "dark" | "light";
  }
> = {
  "grainy-paper": {
    name: "Grainy Paper",
    url: "https://res.cloudinary.com/di1gffhk5/image/upload/v1768726067/theme-grainy-paper_wany8s.jpg",
    overlay: "dark",
    textColor: "light"
  },
  "grainy-dark": {
    name: "Grainy Paper Dark",
    url: "https://res.cloudinary.com/di1gffhk5/image/upload/v1768726068/theme-grainy-paper-with-some-dark-texture_t3zf1h.jpg",
    overlay: "dark",
    textColor: "light"
  },
  "dark-stone": {
    name: "Grainy Darkstone Desk",
    url: "https://res.cloudinary.com/di1gffhk5/image/upload/v1768726063/theme-grainy-dark-stone-desk-texture_hjx9aw.jpg",
    overlay: "dark",
    textColor: "light"
  },
  "black-gray": {
    name: "Grainy Black Gray",
    url: "https://res.cloudinary.com/di1gffhk5/image/upload/v1768725329/theme-grainy-black-gray_ezdk4x.jpg",
    overlay: "dark",
    textColor: "light"
  },
  "blackgray-two": {
    name: "Grainy Black Gray 2",
    url: "https://res.cloudinary.com/di1gffhk5/image/upload/v1768725328/theme-grainy-blackgray-2_zyoos4.jpg",
    overlay: "dark",
    textColor: "light"
  },
  "blackgray-normal": {
    name: "Grainy Black Gray Normal",
    url: "https://res.cloudinary.com/di1gffhk5/image/upload/v1768725309/theme-grainy-blackgray-normal_gwfhkr.jpg",
    overlay: "dark",
    textColor: "light"
  },
  "dark": {
    name: "Grainy Dark",
    url: "https://res.cloudinary.com/di1gffhk5/image/upload/v1768725288/theme-grainy-dark_iesuhk.jpg",
    overlay: "dark",
    textColor: "light"
  },
  "dark-lavander": {
    name: "Grainy Dark Lavander",
    url: "https://res.cloudinary.com/di1gffhk5/image/upload/v1768725273/theme-grainy-dark-lavander_p6fc5a.jpg",
    overlay: "dark",
    textColor: "light"
  },
  "dark-ocean": {
    name: "Grainy Dark Ocean",
    url: "https://res.cloudinary.com/di1gffhk5/image/upload/v1768725260/theme-grainy-dark-ocean_zqummn.jpg",
    overlay: "dark",
    textColor: "light"

  },
  "film-dust-scratches": {
    name: "Grainy Film Dust Scratches",
    url: "https://res.cloudinary.com/di1gffhk5/image/upload/v1768725212/theme-grainy-film-dust-scratches_ey4ql1.jpg",
    overlay: "dark",
    textColor: "light"
  },
  "ocean": {
    name: "Grainy Ocean",
    url: "https://res.cloudinary.com/di1gffhk5/image/upload/v1768725197/theme-grainy-ocean_znqoth.jpg",
    overlay: "dark",
    textColor: "light"
  },
  "orange-black": {
    name: "Grainy Orange Black",
    url: "https://res.cloudinary.com/di1gffhk5/image/upload/v1768725151/theme-grainy-orange-black_ou0yhc.jpg",
    overlay: "dark",
    textColor:"light"
  },
  "red": {
    name: "Grainy Red",
    url: "https://res.cloudinary.com/di1gffhk5/image/upload/v1768724306/theme-grainy-red_iu7ebt.jpg",
    overlay: "dark",
    textColor:"light"
  },
  "blue": {
    name: "Grainy Blue",
    url: "https://res.cloudinary.com/di1gffhk5/image/upload/v1768724216/theme-grainy-blue_igtzhc.jpg",
    overlay: "dark",
    textColor: "light"
  }
};
