export type ThemeKey =
  | "grainy-paper"
  | "grainy-gradient"
  | "dark-stone"
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
  | "light-blue"

export const THEMES: Record<
  ThemeKey,
  {
    name: string;
    url: string;
    overlay: "light" | "dark";
    color?: string;
  }
> = {
  "grainy-paper": {
    name: "Grainy Paper",
    url: "https://res.cloudinary.com/di1gffhk5/image/upload/v1768726067/theme-grainy-paper_wany8s.jpg",
    overlay: "light",
    color: "#000000ff" 
  },
  "grainy-gradient": {
    name: "Grainy Gradient",
    url: "https://res.cloudinary.com/di1gffhk5/image/upload/theme-gradient-background-with-grain-texture_lbc0vx.jpg",
    overlay: "dark",
    color: "#c0c0c0ff" 
  },
  "dark-stone": {
    name: "Grainy Darkstone Desk",
    url: "https://res.cloudinary.com/di1gffhk5/image/upload/v1768726063/theme-grainy-dark-stone-desk-texture_hjx9aw.jpg",
    overlay: "dark",
    color: "rgba(163, 223, 202, 1)" 
  },
  "light-blue": {
    name: "Grainy Light Blue",
    url: "https://res.cloudinary.com/di1gffhk5/image/upload/v1771428682/Light_Colored_Backgrounds_t6sba3.jpg",
    overlay: "dark",
    color: "#c0e6e8ed"
  },
  "blackgray-two": {
    name: "Grainy Black Gray 2",
    url: "https://res.cloudinary.com/di1gffhk5/image/upload/v1768725328/theme-grainy-blackgray-2_zyoos4.jpg",
    overlay: "dark",
    color: "#faf9cbff"
  },
  "blackgray-normal": {
    name: "Grainy Black Gray Normal",
    url: "https://res.cloudinary.com/di1gffhk5/image/upload/v1768725309/theme-grainy-blackgray-normal_gwfhkr.jpg",
    overlay: "dark",
    color: "#a1a3a5ff"
  },
  "dark": {
    name: "Grainy Dark",
    url: "https://res.cloudinary.com/di1gffhk5/image/upload/v1768725288/theme-grainy-dark_iesuhk.jpg",
    overlay: "dark",
    color: "#d2adadff"
  },
  "dark-lavander": {
    name: "Grainy Dark Lavander",
    url: "https://res.cloudinary.com/di1gffhk5/image/upload/v1768725273/theme-grainy-dark-lavander_p6fc5a.jpg",
    overlay: "dark",
    color: "#db6eecff"
  },
  "dark-ocean": {
    name: "Grainy Dark Ocean",
    url: "https://res.cloudinary.com/di1gffhk5/image/upload/v1768725260/theme-grainy-dark-ocean_zqummn.jpg",
    overlay: "dark",
    color: "#cdfaf7ff"
  },
  "film-dust-scratches": {
    name: "Grainy Film Dust Scratches",
    url: "https://res.cloudinary.com/di1gffhk5/image/upload/v1768725212/theme-grainy-film-dust-scratches_ey4ql1.jpg",
    overlay: "dark",
    color: "#ffffffff"
  },
  "ocean": {
    name: "Grainy Ocean",
    url: "https://res.cloudinary.com/di1gffhk5/image/upload/v1768725197/theme-grainy-ocean_znqoth.jpg",
    overlay: "dark",
    color: "#fffafaff"
  },
  "orange-black": {
    name: "Grainy Orange Black",
    url: "https://res.cloudinary.com/di1gffhk5/image/upload/v1768725151/theme-grainy-orange-black_ou0yhc.jpg",
    overlay: "dark",
    color: "#fff3e0"
  },
  "red": {
    name: "Grainy Red",
    url: "https://res.cloudinary.com/di1gffhk5/image/upload/v1768724306/theme-grainy-red_iu7ebt.jpg",
    overlay: "dark",
    color: "#ffebee"
  },
  "blue": {
    name: "Grainy Blue",
    url: "https://res.cloudinary.com/di1gffhk5/image/upload/396e313a-268d-4a01-add2-d5d0b139efcb_iaispk.jpg",
    overlay: "dark",
    color: "#d3e8f0ff"
  }
};
