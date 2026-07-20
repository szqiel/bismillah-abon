export interface GearItem {
  id: string;
  name: string;
  category: "Camera" | "Lens" | "Lighting" | "Audio" | "Support";
  price12h: number;
  price24h: number;
  image: string;
  specs: string[];
  description: string;
  available: boolean;
}

export const inventory: GearItem[] = [
  {
    id: "sony-fx6",
    name: "Sony FX6",
    category: "Camera",
    price12h: 400000,
    price24h: 600000,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBdaKUtpAPxKY0Qav2aDdbwoet57IjiTCoyi6m3zlq4BC4EHgf7o6ocSnhI40_XV2pOaKYADX0CUBOOOht1BT3wOq5C0tuqqkIkQwY5-oSyVIlK_6LaNwtjfq2UraaIJV4146PadRZge93QEeZXW--jpAxglTrAJGhqMGrIG4NiHdZ5P9ToK7Ge_lO0ovqrYWyDznkB0-CRPmaGxQHp7h3gIUJdIEbWJ3brtGrrcR228NYAIt5qtXk8",
    specs: ["Full-Frame", "4K 120p 10-bit"],
    description: "Professional cinema line camera with built-in ND filters.",
    available: true,
  },
  {
    id: "red-komodo",
    name: "RED Komodo 6K",
    category: "Camera",
    price12h: 550000,
    price24h: 800000,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCQlYJafOktfF4msLqdXCYpZoT7Jm29nuoL2Bbip55fXbSZlQipvnLQ1AEIhGX8GcDK9Hyv866JERWKV8suzOjCJkO46Ftv1FZ90lDGi_9yr6fxRmvwzubegsPAfYDgA38hwyVcW1GfBTztI6opCnmG9WmeUnbUFx-hC2y7zmYv9wCVXhtu6hgwaYU39421RKItLECIE7zd9Ph7flBIIf2izhrmkspxDZmKMyvPpSVuGm72eYeqV0YW",
    specs: ["6K Global Shutter", "REDCODE RAW"],
    description: "Compact cinema camera capable of stunning RED raw footage.",
    available: true,
  },
  {
    id: "arri-alexa",
    name: "ARRI Alexa Mini",
    category: "Camera",
    price12h: 1000000,
    price24h: 1500000,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDLDh1yv3wLXBOrkea_og-DjlVCoLSFt8JpM0vPasQL7vNYSPA8y18IZZKvRabxALP-VmnE558ZFm_t54D9ljDZoy0iAe3Z0cmcl_LsQ-NM3R1ic7nmtp85_p7hIWv0n4900DKyfBKmkgybNkY_5ekAUp51ykB7MIFj9h5zEx1XTAwD4JEhIndnrkFx0bLhKIkk6K8fQs1XxcRja4xUGR5m7nFxkOYbHhgBmz-HOHBkx0U0aLECLbs9",
    specs: ["4.5K ARRIRAW", "ProRes 4444 XQ"],
    description: "The industry standard for high-end cinematic productions.",
    available: true,
  },
  {
    id: "sony-a7iv",
    name: "Sony A7 IV",
    category: "Camera",
    price12h: 200000,
    price24h: 300000,
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=800&auto=format&fit=crop",
    specs: ["33MP Full-Frame", "4K 60p 10-bit"],
    description: "Versatile hybrid camera perfect for both photo and video.",
    available: true,
  },
  {
    id: "lens-sigma-24-70",
    name: "Sigma 24-70mm f/2.8 DG DN Art",
    category: "Lens",
    price12h: 100000,
    price24h: 150000,
    image: "https://images.unsplash.com/photo-1616423640778-28d1b53229bd?q=80&w=800&auto=format&fit=crop",
    specs: ["Sony E-Mount", "f/2.8 Constant"],
    description: "The ultimate standard zoom lens for Sony E-mount.",
    available: true,
  },
  {
    id: "light-godox-ad200",
    name: "Godox AD200 Pro",
    category: "Lighting",
    price12h: 50000,
    price24h: 75000,
    image: "https://images.unsplash.com/photo-1596700508534-7a544f128e93?q=80&w=800&auto=format&fit=crop",
    specs: ["200Ws", "TTL/HSS"],
    description: "Compact and powerful pocket flash.",
    available: true,
  }
];
