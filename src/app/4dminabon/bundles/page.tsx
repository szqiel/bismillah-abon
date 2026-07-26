"use client";

import { useState, useMemo } from "react";
import { useAdminStore } from "@/lib/adminStore";
import { GearItem } from "@/lib/data";
import { formatCurrency, formatCompactCurrency } from "@/lib/formatters";

export default function BundleManagementPage() {
  const { inventory, addGearItem, updateGearItem, deleteGearItem } = useAdminStore();

  const bundles = useMemo(
    () => inventory.filter((item) => item.category === "Bundle"),
    [inventory]
  );

  const individualItems = useMemo(
    () => inventory.filter((item) => item.category !== "Bundle"),
    [inventory]
  );

  // Modal State
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [editingBundle, setEditingBundle] = useState<GearItem | null>(null);

  // Composer Form State
  const [bundleName, setBundleName] = useState("");
  const [selectedComponentIds, setSelectedComponentIds] = useState<string[]>([]);
  const [customPrice12h, setCustomPrice12h] = useState<number>(300000);
  const [customPrice24h, setCustomPrice24h] = useState<number>(500000);
  const [bundleDescription, setBundleDescription] = useState("");
  const [bundleImage, setBundleImage] = useState(
    "https://www.bhphotovideo.com/images/images500x500/sony_ilme_fx6vk_fx6_digital_cinema_camera_1605606382_1600161.jpg"
  );

  // Calculate sum of selected component prices
  const sum24hPrice = useMemo(() => {
    return selectedComponentIds.reduce((sum, id) => {
      const item = individualItems.find((i) => i.id === id);
      return sum + (item ? item.price24h : 0);
    }, 0);
  }, [selectedComponentIds, individualItems]);

  const discountPercent = useMemo(() => {
    if (sum24hPrice === 0 || customPrice24h >= sum24hPrice) return 0;
    return Math.round(((sum24hPrice - customPrice24h) / sum24hPrice) * 100);
  }, [sum24hPrice, customPrice24h]);

  const handleOpenComposer = (bundle?: GearItem) => {
    if (bundle) {
      setEditingBundle(bundle);
      setBundleName(bundle.name);
      setCustomPrice12h(bundle.price12h);
      setCustomPrice24h(bundle.price24h);
      setBundleDescription(bundle.description);
      setBundleImage(bundle.image);

      // Match selected components from specs
      const matched = individualItems
        .filter((item) => bundle.specs.some((s) => s.toLowerCase().includes(item.name.toLowerCase())))
        .map((item) => item.id);
      setSelectedComponentIds(matched);
    } else {
      setEditingBundle(null);
      setBundleName("Paket Hemat Shooting Siap Pakai");
      setSelectedComponentIds([individualItems[0]?.id || "", individualItems[1]?.id || ""].filter(Boolean));
      setCustomPrice12h(450000);
      setCustomPrice24h(750000);
      setBundleDescription("Paket komplit peralatan produksi video dan audio terkalibrasi.");
      setBundleImage(
        "https://www.bhphotovideo.com/images/images500x500/sony_ilme_fx6vk_fx6_digital_cinema_camera_1605606382_1600161.jpg"
      );
    }
    setIsComposerOpen(true);
  };

  const handleToggleComponent = (id: string) => {
    setSelectedComponentIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSaveBundle = (e: React.FormEvent) => {
    e.preventDefault();

    // Auto-generate specs from selected component names
    const componentNames = selectedComponentIds.map((id) => {
      const item = individualItems.find((i) => i.id === id);
      return item ? item.name : "";
    }).filter(Boolean);

    const specs = componentNames.length > 0 ? componentNames : ["Paket Komplit Siap Tempur"];

    if (editingBundle) {
      updateGearItem(editingBundle.id, {
        name: bundleName,
        category: "Bundle",
        price12h: Number(customPrice12h),
        price24h: Number(customPrice24h),
        image: bundleImage,
        specs,
        description: bundleDescription,
        available: true,
      });
    } else {
      addGearItem({
        name: bundleName,
        category: "Bundle",
        price12h: Number(customPrice12h),
        price24h: Number(customPrice24h),
        image: bundleImage,
        specs,
        description: bundleDescription,
        available: true,
      });
    }
    setIsComposerOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/30">
        <div>
          <h1 className="font-display-xl text-[24px] font-black text-on-surface uppercase tracking-tight">
            Bundle Management ({bundles.length})
          </h1>
          <p className="font-body-md text-[13px] text-on-surface-variant">
            Susun paket bundling hemat gabungan kamera, lensa, dan lighting dengan kalkulasi hemat otomatis.
          </p>
        </div>
        <button
          onClick={() => handleOpenComposer()}
          className="bg-primary text-on-primary font-category-label text-[13px] font-bold uppercase px-5 py-2.5 rounded-full hover:bg-primary/90 transition-all flex items-center gap-2 shadow-sm"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span>Create New Bundle</span>
        </button>
      </div>

      {/* Bundles Table */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-outline-variant/30 text-outline font-category-label text-[11px] uppercase tracking-wider bg-surface-container-low/40">
                <th className="py-3.5 px-6">Nama Paket Bundling</th>
                <th className="py-3.5 px-6">Daftar Peralatan Termasuk</th>
                <th className="py-3.5 px-6">Tarif 12H</th>
                <th className="py-3.5 px-6">Tarif 24H</th>
                <th className="py-3.5 px-6 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20 font-body-md text-[14px]">
              {bundles.map((bundle) => (
                <tr key={bundle.id} className="hover:bg-surface-container-low/50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-surface-container-lowest border border-outline-variant/30 p-1 flex items-center justify-center flex-shrink-0">
                        <img
                          src={bundle.image}
                          alt={bundle.name}
                          className="w-full h-full object-contain mix-blend-multiply"
                        />
                      </div>
                      <div>
                        <div className="font-category-label font-bold text-on-surface">
                          {bundle.name}
                        </div>
                        <span className="inline-block bg-primary/10 text-primary font-price-chip text-[11px] font-bold px-2 py-0.5 rounded-full uppercase">
                          Paket Bundling
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-6">
                    <div className="flex flex-wrap gap-1.5 max-w-md">
                      {bundle.specs.map((spec, i) => (
                        <span
                          key={i}
                          className="bg-surface-container text-on-surface border border-outline-variant/40 font-category-label text-[11px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-[14px] text-primary">
                            check_circle
                          </span>
                          {spec}
                        </span>
                      ))}
                    </div>
                  </td>

                  <td className="py-4 px-6 font-price-chip text-primary font-bold">
                    {formatCompactCurrency(bundle.price12h)}
                  </td>
                  <td className="py-4 px-6 font-price-chip text-on-surface font-bold">
                    {formatCompactCurrency(bundle.price24h)}
                  </td>

                  <td className="py-4 px-6 text-right space-x-2">
                    <button
                      onClick={() => handleOpenComposer(bundle)}
                      className="px-3 py-1.5 bg-surface-container hover:bg-surface-container-high text-on-surface font-category-label text-[12px] font-bold uppercase rounded-lg border border-outline-variant/30"
                    >
                      Edit Bundle
                    </button>
                    <button
                      onClick={() => deleteGearItem(bundle.id)}
                      className="p-1.5 text-outline hover:text-red-600 rounded-lg"
                      title="Hapus Paket"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bundle Composer Modal */}
      {isComposerOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl max-w-2xl w-full p-6 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-4">
              <div>
                <h3 className="font-display-xl text-[20px] font-black text-on-surface uppercase">
                  {editingBundle ? "Edit Paket Bundling" : "Susun Paket Bundling Baru"}
                </h3>
                <p className="font-body-md text-[13px] text-on-surface-variant">
                  Pilih unit komponen untuk menghitung perbandingan harga satuan vs harga paket diskon.
                </p>
              </div>
              <button
                onClick={() => setIsComposerOpen(false)}
                className="text-outline hover:text-on-surface"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveBundle} className="space-y-5 font-body-md text-[14px]">
              <div>
                <label className="block font-category-label font-bold text-[12px] text-on-surface uppercase mb-1">
                  Nama Paket Bundling
                </label>
                <input
                  type="text"
                  required
                  value={bundleName}
                  onChange={(e) => setBundleName(e.target.value)}
                  placeholder="Contoh: Paket Sony A7 IV + Lensa 24-70mm GM"
                  className="w-full p-2.5 bg-surface-container-low border border-outline-variant/40 rounded-xl text-on-surface focus:outline-none focus:border-primary font-category-label font-bold"
                />
              </div>

              {/* Component Picker List */}
              <div>
                <label className="block font-category-label font-bold text-[12px] text-on-surface uppercase mb-2">
                  Pilih Komponen Peralatan Termasuk ({selectedComponentIds.length} Dipilih)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2 bg-surface-container-low rounded-xl border border-outline-variant/40">
                  {individualItems.map((item) => {
                    const isSelected = selectedComponentIds.includes(item.id);
                    return (
                      <div
                        key={item.id}
                        onClick={() => handleToggleComponent(item.id)}
                        className={`p-2.5 rounded-lg border flex items-center justify-between cursor-pointer transition-all ${
                          isSelected
                            ? "bg-primary/10 border-primary text-on-surface"
                            : "bg-surface-container-lowest border-outline-variant/30 text-on-surface-variant hover:border-outline-variant"
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {}}
                            className="accent-primary rounded"
                          />
                          <span className="font-category-label font-bold text-[13px] truncate">
                            {item.name}
                          </span>
                        </div>
                        <span className="font-price-chip text-[12px] font-bold text-primary flex-shrink-0">
                          {formatCompactCurrency(item.price24h)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Live Discount Calculator Box */}
              <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/40 space-y-3">
                <div className="flex items-center justify-between font-category-label text-[13px]">
                  <span className="text-on-surface-variant uppercase font-bold">
                    Total Harga Sewa Satuan (24H):
                  </span>
                  <span className="font-price-chip font-bold text-on-surface text-[15px]">
                    {formatCurrency(sum24hPrice)}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-outline-variant/30">
                  <div>
                    <label className="block font-category-label font-bold text-[11px] text-on-surface uppercase mb-1">
                      Set Tarif Paket 12H (IDR)
                    </label>
                    <input
                      type="number"
                      required
                      value={customPrice12h}
                      onChange={(e) => setCustomPrice12h(Number(e.target.value))}
                      className="w-full p-2 bg-surface-container-lowest border border-outline-variant/40 rounded-lg font-price-chip font-bold text-primary"
                    />
                  </div>
                  <div>
                    <label className="block font-category-label font-bold text-[11px] text-on-surface uppercase mb-1">
                      Set Tarif Paket 24H (IDR)
                    </label>
                    <input
                      type="number"
                      required
                      value={customPrice24h}
                      onChange={(e) => setCustomPrice24h(Number(e.target.value))}
                      className="w-full p-2 bg-surface-container-lowest border border-outline-variant/40 rounded-lg font-price-chip font-bold text-primary"
                    />
                  </div>
                </div>

                {discountPercent > 0 && (
                  <div className="flex items-center justify-between text-primary font-category-label font-bold text-[13px] pt-1">
                    <span>Hemat Diskon Pelanggan:</span>
                    <span className="bg-primary text-on-primary font-price-chip text-[12px] px-2 py-0.5 rounded-full">
                      HEMAT {discountPercent}%
                    </span>
                  </div>
                )}
              </div>

              <div>
                <label className="block font-category-label font-bold text-[12px] text-on-surface uppercase mb-1">
                  URL Gambar Cover Paket
                </label>
                <input
                  type="url"
                  required
                  value={bundleImage}
                  onChange={(e) => setBundleImage(e.target.value)}
                  className="w-full p-2.5 bg-surface-container-low border border-outline-variant/40 rounded-xl text-on-surface text-[13px]"
                />
              </div>

              <div>
                <label className="block font-category-label font-bold text-[12px] text-on-surface uppercase mb-1">
                  Deskripsi Singkat Paket
                </label>
                <textarea
                  rows={2}
                  value={bundleDescription}
                  onChange={(e) => setBundleDescription(e.target.value)}
                  placeholder="Keterangan peruntukan syuting paket bundling ini..."
                  className="w-full p-2.5 bg-surface-container-low border border-outline-variant/40 rounded-xl text-on-surface"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant/20">
                <button
                  type="button"
                  onClick={() => setIsComposerOpen(false)}
                  className="px-4 py-2.5 bg-surface-container text-on-surface font-category-label font-bold uppercase rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-primary text-on-primary font-category-label font-bold uppercase rounded-xl hover:bg-primary/90"
                >
                  {editingBundle ? "Simpan Paket" : "Buat Paket Bundling"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
