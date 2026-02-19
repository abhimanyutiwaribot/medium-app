export type ThemeKey =
  | "grainy-paper"
  | "grainy-dark"
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
    color: "#601111ef" 
  },
  "grainy-dark": {
    name: "Grainy Paper Dark",
    url: "https://res.cloudinary.com/di1gffhk5/image/upload/v1768726068/theme-grainy-paper-with-some-dark-texture_t3zf1h.jpg",
    overlay: "dark",
    color: "#080101ff" 
  },
  "dark-stone": {
    name: "Grainy Darkstone Desk",
    url: "https://res.cloudinary.com/di1gffhk5/image/upload/v1768726063/theme-grainy-dark-stone-desk-texture_hjx9aw.jpg",
    overlay: "dark",
    color: "#e2fff5ff" 
  },
  "light-blue": {
    name: "Grainy Light Blue",
    url: "https://res.cloudinary.com/di1gffhk5/image/upload/v1771428682/Light_Colored_Backgrounds_t6sba3.jpg",
    overlay: "dark",
    color: "#ffffffed"
  },
  "blackgray-two": {
    name: "Grainy Black Gray 2",
    url: "https://res.cloudinary.com/di1gffhk5/image/upload/v1768725328/theme-grainy-blackgray-2_zyoos4.jpg",
    overlay: "dark",
    color: "#ffffffff"
  },
  "blackgray-normal": {
    name: "Grainy Black Gray Normal",
    url: "https://res.cloudinary.com/di1gffhk5/image/upload/v1768725309/theme-grainy-blackgray-normal_gwfhkr.jpg",
    overlay: "dark",
    color: "#ffffffff"
  },
  "dark": {
    name: "Grainy Dark",
    url: "https://res.cloudinary.com/di1gffhk5/image/upload/v1768725288/theme-grainy-dark_iesuhk.jpg",
    overlay: "dark",
    color: "#c0acacff"
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
    url: "https://res.cloudinary.com/di1gffhk5/image/upload/v1768724216/theme-grainy-blue_igtzhc.jpg",
    overlay: "dark",
    color: "#eeeeeeff"
  }
};
