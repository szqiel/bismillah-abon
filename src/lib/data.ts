export interface GearItem {
  id: string;
  name: string;
  category: "Camera" | "Lens" | "Lighting" | "Audio" | "Support" | "Bundle";
  price12h: number;
  price24h: number;
  image: string;
  specs: string[];
  description: string;
  details?: string[];
  available: boolean;
}

export const inventory: GearItem[] = [
  // --- INDIVIDUAL CAMERAS ---
  {
    id: "sony-fx6",
    name: "Sony FX6",
    category: "Camera",
    price12h: 940000,
    price24h: 950000,
    image: "https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/sony_ilme_fx6vk_fx6_digital_cinema_camera_1605606382_1600161.jpg", 
    specs: ["Cinema Line", "Full-Frame"],
    description: "Professional cinema line camera built for high-end video production.",
    available: true,
  },
  {
    id: "sony-fx3",
    name: "Sony FX3",
    category: "Camera",
    price12h: 540000,
    price24h: 550000,
    image: "https://static.bhphoto.com/images/images2500x2500/1746547141_1894322.jpg",
    specs: ["Cinema Line", "Full-Frame"],
    description: "Compact cinema camera with outstanding low-light capabilities.",
    available: true,
  },
  {
    id: "sony-a7iv",
    name: "Sony A7 IV",
    category: "Camera",
    price12h: 340000,
    price24h: 350000,
    image: "https://static.bhphoto.com/images/images2500x2500/1634812545_1667800.jpg",
    specs: ["Full-Frame", "Hybrid Photo/Video"],
    description: "The ultimate hybrid camera for both professional photography and videography.",
    available: true,
  },
  {
    id: "canon-eos-r",
    name: "Canon EOS R",
    category: "Camera",
    price12h: 240000,
    price24h: 250000,
    image: "https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/canon_3075c002_eos_r_mirrorless_camera_1536120359_1433710.jpg",
    specs: ["Full-Frame", "Mirrorless"],
    description: "Canon's first full-frame mirrorless camera featuring incredible color science.",
    available: true,
  },
  {
    id: "fujifilm-xt4",
    name: "Fujifilm X-T4",
    category: "Camera",
    price12h: 215000,
    price24h: 225000,
    image: "https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/fujifilm_16652855_x_t4_mirrorless_camera_black_1638380818_1548388.jpg",
    specs: ["APS-C", "IBIS"],
    description: "Flagship APS-C mirrorless with in-body stabilization and stunning film simulations.",
    available: true,
  },

  // --- INDIVIDUAL LENSES ---
  {
    id: "sony-2470-gm",
    name: "Sony 24-70mm GM F2.8 Mark I",
    category: "Lens",
    price12h: 225000,
    price24h: 230000,
    image: "https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/sony_sel2470gm2_fe_24_70mm_f_2_8_gm_1651055728_1702384.jpg",
    specs: ["Sony FE Mount", "G Master Series"],
    description: "Top-tier standard zoom lens delivering edge-to-edge sharpness.",
    available: true,
  },
  {
    id: "sigma-2470-dg-dn",
    name: "Sigma 24-70mm F2.8 DG DN",
    category: "Lens",
    price12h: 170000,
    price24h: 175000,
    image: "https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/sigma_578965_24_70mm_f_2_8_dg_dn_1573004770_1516303.jpg",
    specs: ["Sony FE Mount", "Art Series"],
    description: "A highly versatile and sharp standard zoom from the acclaimed Sigma Art lineup.",
    available: true,
  },

  // --- LIGHTING ---
  {
    id: "godox-ad200-pro",
    name: "Godox AD200 PRO",
    category: "Lighting",
    price12h: 110000,
    price24h: 120000,
    image: "https://admin.focusnusantara.com/media/catalog/product/cache/417d5822b01094047ca5b50bfdc0690a/h/o/hot39134-godox-ad200pro-ii-ttl-pocket-flash-web_d1.jpg",
    specs: ["Flash Studio", "200Ws"],
    description: "Compact, powerful, and versatile pocket flash for location and studio shoots.",
    available: true,
  },
  {
    id: "nanlite-fs300b",
    name: "Nanlite FS 300B",
    category: "Lighting",
    price12h: 130000,
    price24h: 140000,
    image: "https://admin.focusnusantara.com/media/catalog/product/cache/417d5822b01094047ca5b50bfdc0690a/s/a/sac36846_nanlite_fs-300b_bicolor_led_spotlight_-web_d1_1_1.png",
    specs: ["Continuous Light", "Bi-Color"],
    description: "Powerful continuous lighting setup. Includes 1 unit lighting, 1 unit stand, and 1 unit softbox.",
    available: true,
  },

  // --- AUDIO ---
  {
    id: "rode-ntg4-plus",
    name: "Rode NTG 4 PLUS",
    category: "Audio",
    price12h: 80000,
    price24h: 90000,
    image: "https://static.bhphoto.com/images/multiple_images/images2500x2500/1533212132_IMG_1039406.jpg",
    specs: ["Shotgun Mic", "Internal Battery"],
    description: "Professional shotgun microphone designed for broadcast and film audio capture.",
    available: true,
  },

  // --- SUPPORT ---
  {
    id: "dji-rs4",
    name: "DJI RS4",
    category: "Support",
    price12h: 240000,
    price24h: 250000,
    image: "https://static.bhphoto.com/images/multiple_images/images2500x2500/1767697514_IMG_2212578.jpg",
    specs: ["Gimbal", "3-Axis Stabilizer"],
    description: "Advanced camera stabilizer for smooth and cinematic camera movements.",
    available: true,
  },

  // --- BUNDLES ---
  {
    id: "bundle-a7iii-sigma2470",
    name: "Sony A7 III + Sigma 24-70mm F2.8",
    category: "Bundle",
    price12h: 320000,
    price24h: 330000,
    image: "https://static.bhphoto.com/images/multiple_images/images2000x2000/1769428300_IMG_2663305.jpg",
    specs: ["A7 Series", "Sigma Art Lens"],
    description: "Bundling package: Sony A7 III paired with a versatile Sigma 24-70mm DG DN lens.",
    available: true,
  },
  {
    id: "bundle-a7iv-sigma2470",
    name: "Sony A7 IV + Sigma 24-70mm F2.8",
    category: "Bundle",
    price12h: 465000,
    price24h: 475000,
    image: "https://static.bhphoto.com/images/multiple_images/images2500x2500/1634813219_IMG_1627574.jpg",
    specs: ["A7 Series", "Sigma Art Lens"],
    description: "Bundling package: The mighty hybrid Sony A7 IV with the Sigma 24-70mm DG DN.",
    available: true,
  },
  {
    id: "bundle-eosr-sigma2470",
    name: "Canon EOS R + Sigma 24-70mm F2.8",
    category: "Bundle",
    price12h: 340000,
    price24h: 350000,
    image: "https://static.bhphoto.com/images/multiple_images/images1000x1000/1536120910_IMG_1061043.jpg",
    specs: ["Canon Full-Frame", "Sigma Art Lens"],
    description: "Bundling package: Canon EOS R bundled with the reliable Sigma 24-70mm F2.8.",
    available: true,
  },
  {
    id: "bundle-eosrp-sigma35",
    name: "Canon EOS RP + Sigma 35mm F1.4",
    category: "Bundle",
    price12h: 225000,
    price24h: 235000,
    image: "https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/canon_3380c132_eos_rp_mirrorless_camera_1603796831_1558260.jpg",
    specs: ["Canon Full-Frame", "Sigma Prime Lens"],
    description: "Bundling package: Lightweight Canon EOS RP paired with the sharp Sigma 35mm F1.4.",
    available: true,
  },
  {
    id: "bundle-a6400-sigma2470",
    name: "Sony A6400 + Sigma 24-70mm F2.8",
    category: "Bundle",
    price12h: 265000,
    price24h: 275000,
    image: "https://static.bhphoto.com/images/images2500x2500/1737107255_1875024.jpg",
    specs: ["Sony APS-C", "Sigma Art Lens"],
    description: "Bundling package: Powerful APS-C Sony A6400 coupled with the Sigma 24-70mm F2.8.",
    available: true,
  }
];