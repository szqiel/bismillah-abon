"use client";

import { useState, useMemo } from "react";
import { useAdminStore } from "@/lib/adminStore";
import { GearItem } from "@/lib/data";
import { formatCompactCurrency } from "@/lib/formatters";

export default function InventoryManagementPage() {
  const {
    inventory,
    addGearItem,
    updateGearItem,
    deleteGearItem,
    duplicateGearItem,
    bulkToggleAvailability,
    bulkDeleteGearItems,
  } = useAdminStore();

  // Filters & View State
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua");
  const [availabilityFilter, setAvailabilityFilter] = useState<"all" | "available" | "unavailable">("all");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GearItem | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form Fields
  const [formData, setFormData] = useState({
    name: "",
    category: "Camera" as GearItem["category"],
    price12h: 150000,
    price24h: 250000,
    image: "",
    specs: "",
    description: "",
    available: true,
  });

  const categories = useMemo(() => {
    return ["Semua", ...Array.from(new Set(inventory.map((item) => item.category)))];
  }, [inventory]);

  const filteredInventory = useMemo(() => {
    return inventory.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCat = selectedCategory === "Semua" || item.category === selectedCategory;
      const matchesAvail =
        availabilityFilter === "all"
          ? true
          : availabilityFilter === "available"
          ? item.available
          : !item.available;
      return matchesSearch && matchesCat && matchesAvail;
    });
  }, [inventory, searchQuery, selectedCategory, availabilityFilter]);

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setFormData({
      name: "",
      category: "Camera",
      price12h: 150000,
      price24h: 250000,
      image: "https://www.bhphotovideo.com/images/images500x500/sony_ilme_fx6vk_fx6_digital_cinema_camera_1605606382_1600161.jpg",
      specs: "Full-Frame, 4K 120FPS",
      description: "Peralatan profesional terkalibrasi siap untuk produksi video dan foto.",
      available: true,
    });
    setIsFormOpen(true);
  };

  const handleOpenEditModal = (item: GearItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      category: item.category,
      price12h: item.price12h,
      price24h: item.price24h,
      image: item.image,
      specs: item.specs.join(", "),
      description: item.description,
      available: item.available,
    });
    setIsFormOpen(true);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    const specsArray = formData.specs
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    if (editingItem) {
      updateGearItem(editingItem.id, {
        name: formData.name,
        category: formData.category,
        price12h: Number(formData.price12h),
        price24h: Number(formData.price24h),
        image: formData.image,
        specs: specsArray,
        description: formData.description,
        available: formData.available,
      });
    } else {
      addGearItem({
        name: formData.name,
        category: formData.category,
        price12h: Number(formData.price12h),
        price24h: Number(formData.price24h),
        image: formData.image,
        specs: specsArray,
        description: formData.description,
        available: formData.available,
      });
    }
    setIsFormOpen(false);
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredInventory.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredInventory.map((i) => i.id));
    }
  };

  const toggleSelectId = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Add Action */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/30">
        <div>
          <h1 className="font-display-xl text-[24px] font-black text-on-surface uppercase tracking-tight">
            Equipment Inventory ({inventory.length})
          </h1>
          <p className="font-body-md text-[13px] text-on-surface-variant">
            Kelola unit kamera, penetapan tarif sewa 12 jam/24 jam, status ketersediaan, dan deskripsi katalog.
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="bg-primary text-on-primary font-category-label text-[13px] font-bold uppercase px-5 py-2.5 rounded-full hover:bg-primary/90 transition-all flex items-center gap-2 shadow-sm"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span>Add New Gear</span>
        </button>
      </div>

      {/* Filter & Control Bar */}
      <div className="bg-surface-container-low p-4 rounded-2xl border border-outline-variant/30 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Left Inputs */}
        <div className="flex flex-wrap items-center gap-3 flex-1">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[200px]">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-outline text-[20px]">
              search
            </span>
            <input
              type="text"
              placeholder="Cari nama peralatan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-surface-container-lowest border border-outline-variant/40 rounded-xl text-[14px] text-on-surface focus:outline-none focus:border-primary"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 bg-surface-container-lowest border border-outline-variant/40 rounded-xl text-[13px] font-category-label font-bold text-on-surface focus:outline-none focus:border-primary"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                Kategori: {cat}
              </option>
            ))}
          </select>

          {/* Availability Filter */}
          <select
            value={availabilityFilter}
            onChange={(e) => setAvailabilityFilter(e.target.value as "all" | "available" | "unavailable")}
            className="px-3 py-2 bg-surface-container-lowest border border-outline-variant/40 rounded-xl text-[13px] font-category-label font-bold text-on-surface focus:outline-none focus:border-primary"
          >
            <option value="all">Status: Semua</option>
            <option value="available">Status: Siap Sewa</option>
            <option value="unavailable">Status: Tidak Tersedia</option>
          </select>
        </div>

        {/* Right View Toggle */}
        <div className="flex items-center gap-1 bg-surface-container-lowest p-1 rounded-xl border border-outline-variant/30">
          <button
            onClick={() => setViewMode("table")}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === "table"
                ? "bg-primary text-on-primary font-bold"
                : "text-outline hover:text-on-surface"
            }`}
            title="Tampilan Tabel Rapat"
          >
            <span className="material-symbols-outlined text-[20px]">table_rows</span>
          </button>
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === "grid"
                ? "bg-primary text-on-primary font-bold"
                : "text-outline hover:text-on-surface"
            }`}
            title="Tampilan Kartu Grid"
          >
            <span className="material-symbols-outlined text-[20px]">grid_view</span>
          </button>
        </div>
      </div>

      {/* Bulk Action Controls Banner */}
      {selectedIds.length > 0 && (
        <div className="bg-primary/10 border border-primary/30 p-3 rounded-xl flex items-center justify-between">
          <span className="font-category-label font-bold text-[13px] text-primary">
            {selectedIds.length} item dipilih
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                bulkToggleAvailability(selectedIds, true);
                setSelectedIds([]);
              }}
              className="bg-surface-container text-on-surface font-category-label text-[12px] font-bold uppercase px-3 py-1.5 rounded-lg border border-outline-variant/40 hover:bg-surface-container-high"
            >
              Tandai Siap Sewa
            </button>
            <button
              onClick={() => {
                bulkToggleAvailability(selectedIds, false);
                setSelectedIds([]);
              }}
              className="bg-surface-container text-on-surface font-category-label text-[12px] font-bold uppercase px-3 py-1.5 rounded-lg border border-outline-variant/40 hover:bg-surface-container-high"
            >
              Tandai Tidak Tersedia
            </button>
            <button
              onClick={() => {
                bulkDeleteGearItems(selectedIds);
                setSelectedIds([]);
              }}
              className="bg-red-600 text-white font-category-label text-[12px] font-bold uppercase px-3 py-1.5 rounded-lg hover:bg-red-700"
            >
              Hapus Sekaligus
            </button>
          </div>
        </div>
      )}

      {/* Content Rendering: Table or Grid */}
      {filteredInventory.length === 0 ? (
        <div className="text-center py-16 bg-surface-container-lowest rounded-2xl border border-outline-variant/30 text-on-surface-variant font-body-md">
          Tidak ada peralatan yang sesuai dengan kriteria pencarian.
        </div>
      ) : viewMode === "table" ? (
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-outline-variant/30 text-outline font-category-label text-[11px] uppercase tracking-wider bg-surface-container-low/40">
                  <th className="py-3 px-4 w-10">
                    <input
                      type="checkbox"
                      checked={
                        selectedIds.length === filteredInventory.length &&
                        filteredInventory.length > 0
                      }
                      onChange={toggleSelectAll}
                      className="accent-primary rounded"
                    />
                  </th>
                  <th className="py-3 px-4">Nama Peralatan</th>
                  <th className="py-3 px-4">Kategori</th>
                  <th className="py-3 px-4">Tarif 12H</th>
                  <th className="py-3 px-4">Tarif 24H</th>
                  <th className="py-3 px-4">Status Sewa</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20 font-body-md text-[14px]">
                {filteredInventory.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-surface-container-low/50 transition-colors"
                  >
                    <td className="py-3.5 px-4">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(item.id)}
                        onChange={() => toggleSelectId(item.id)}
                        className="accent-primary rounded"
                      />
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-surface-container-lowest border border-outline-variant/30 p-1 flex items-center justify-center flex-shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-contain mix-blend-multiply"
                          />
                        </div>
                        <div>
                          <div className="font-category-label font-bold text-on-surface">
                            {item.name}
                          </div>
                          <div className="font-body-md text-[12px] text-on-surface-variant truncate max-w-xs">
                            {item.specs.join(" • ")}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-category-label text-[12px] uppercase font-bold text-outline">
                      {item.category}
                    </td>
                    <td className="py-3.5 px-4 font-price-chip text-primary font-bold">
                      {formatCompactCurrency(item.price12h)}
                    </td>
                    <td className="py-3.5 px-4 font-price-chip text-on-surface font-bold">
                      {formatCompactCurrency(item.price24h)}
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() =>
                          updateGearItem(item.id, { available: !item.available })
                        }
                        className={`px-2.5 py-1 rounded-full font-category-label text-[11px] font-bold uppercase border ${
                          item.available
                            ? "bg-primary/10 text-primary border-primary/20"
                            : "bg-surface-container text-outline border-outline-variant/30"
                        }`}
                      >
                        {item.available ? "Siap Sewa" : "Tidak Tersedia"}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-1">
                      <button
                        onClick={() => duplicateGearItem(item.id)}
                        title="Duplikat Item"
                        className="p-1.5 text-outline hover:text-on-surface rounded-lg hover:bg-surface-container"
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          content_copy
                        </span>
                      </button>
                      <button
                        onClick={() => handleOpenEditModal(item)}
                        title="Edit Item"
                        className="p-1.5 text-outline hover:text-primary rounded-lg hover:bg-surface-container"
                      >
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(item.id)}
                        title="Hapus Item"
                        className="p-1.5 text-outline hover:text-red-600 rounded-lg hover:bg-surface-container"
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
      ) : (
        /* Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredInventory.map((item) => (
            <div
              key={item.id}
              className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/30 flex flex-col justify-between relative group hover:border-primary/40 transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-category-label text-[11px] uppercase font-bold text-outline">
                  {item.category}
                </span>
                <button
                  onClick={() =>
                    updateGearItem(item.id, { available: !item.available })
                  }
                  className={`px-2 py-0.5 rounded-full font-category-label text-[10px] font-bold uppercase border ${
                    item.available
                      ? "bg-primary/10 text-primary border-primary/20"
                      : "bg-surface-container text-outline border-outline-variant/30"
                  }`}
                >
                  {item.available ? "Siap Sewa" : "Tidak Tersedia"}
                </button>
              </div>

              <div className="w-full h-36 bg-surface-container-lowest p-2 rounded-lg border border-outline-variant/20 mb-4 flex items-center justify-center">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-contain mix-blend-multiply"
                />
              </div>

              <h4 className="font-category-label font-bold text-[16px] text-on-surface mb-1 truncate">
                {item.name}
              </h4>
              <p className="font-body-md text-[12px] text-on-surface-variant mb-4 line-clamp-2">
                {item.specs.join(" • ")}
              </p>

              <div className="pt-3 border-t border-outline-variant/20 flex items-center justify-between">
                <div className="font-price-chip text-[14px] text-primary font-bold">
                  {formatCompactCurrency(item.price24h)} /24H
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => duplicateGearItem(item.id)}
                    className="p-1.5 text-outline hover:text-on-surface"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      content_copy
                    </span>
                  </button>
                  <button
                    onClick={() => handleOpenEditModal(item)}
                    className="p-1.5 text-outline hover:text-primary"
                  >
                    <span className="material-symbols-outlined text-[18px]">edit</span>
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(item.id)}
                    className="p-1.5 text-outline hover:text-red-600"
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl max-w-xl w-full p-6 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-4">
              <h3 className="font-display-xl text-[20px] font-black text-on-surface uppercase">
                {editingItem ? "Edit Data Peralatan" : "Tambah Peralatan Baru"}
              </h3>
              <button
                onClick={() => setIsFormOpen(false)}
                className="text-outline hover:text-on-surface"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="space-y-4 font-body-md text-[14px]">
              <div>
                <label className="block font-category-label font-bold text-[12px] text-on-surface uppercase mb-1">
                  Nama Alat / Unit
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Contoh: Sony FX3 Body Only"
                  className="w-full p-2.5 bg-surface-container-low border border-outline-variant/40 rounded-xl text-on-surface focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-category-label font-bold text-[12px] text-on-surface uppercase mb-1">
                    Kategori
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        category: e.target.value as GearItem["category"],
                      })
                    }
                    className="w-full p-2.5 bg-surface-container-low border border-outline-variant/40 rounded-xl text-on-surface focus:outline-none focus:border-primary font-category-label font-bold"
                  >
                    <option value="Camera">Camera</option>
                    <option value="Lens">Lens</option>
                    <option value="Lighting">Lighting</option>
                    <option value="Audio">Audio</option>
                    <option value="Support">Support</option>
                    <option value="Bundle">Bundle</option>
                  </select>
                </div>
                <div>
                  <label className="block font-category-label font-bold text-[12px] text-on-surface uppercase mb-1">
                    Tarif 12H (IDR)
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.price12h}
                    onChange={(e) => setFormData({ ...formData, price12h: Number(e.target.value) })}
                    className="w-full p-2.5 bg-surface-container-low border border-outline-variant/40 rounded-xl font-price-chip font-bold text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block font-category-label font-bold text-[12px] text-on-surface uppercase mb-1">
                    Tarif 24H (IDR)
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.price24h}
                    onChange={(e) => setFormData({ ...formData, price24h: Number(e.target.value) })}
                    className="w-full p-2.5 bg-surface-container-low border border-outline-variant/40 rounded-xl font-price-chip font-bold text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block font-category-label font-bold text-[12px] text-on-surface uppercase mb-1">
                  URL Gambar Produk
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    required
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="flex-1 p-2.5 bg-surface-container-low border border-outline-variant/40 rounded-xl text-on-surface focus:outline-none focus:border-primary text-[13px]"
                  />
                  <button
                    type="button"
                    disabled
                    title="Unggah berkas hanya simulasi pada versi demo ini"
                    className="px-3 py-2 bg-surface-container text-outline rounded-xl text-[12px] font-category-label font-bold border border-outline-variant/30 cursor-not-allowed opacity-60"
                  >
                    Unggah Berkas (Demo)
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-category-label font-bold text-[12px] text-on-surface uppercase mb-1">
                  Spesifikasi Singkat (Dipisahkan Koma)
                </label>
                <input
                  type="text"
                  value={formData.specs}
                  onChange={(e) => setFormData({ ...formData, specs: e.target.value })}
                  placeholder="Contoh: Cinema Line, Full-Frame, 4K 120FPS"
                  className="w-full p-2.5 bg-surface-container-low border border-outline-variant/40 rounded-xl text-on-surface focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block font-category-label font-bold text-[12px] text-on-surface uppercase mb-1">
                  Deskripsi Lengkap Unit
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Penjelasan ringkas kondisi alat dan peruntukan produksi..."
                  className="w-full p-2.5 bg-surface-container-low border border-outline-variant/40 rounded-xl text-on-surface focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="availCheck"
                  checked={formData.available}
                  onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                  className="accent-primary rounded w-4 h-4"
                />
                <label htmlFor="availCheck" className="font-category-label font-bold text-[13px] text-on-surface">
                  Unit Prima & Siap Disewakan Kepada Pelanggan
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant/20">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2.5 bg-surface-container text-on-surface font-category-label font-bold uppercase rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-primary text-on-primary font-category-label font-bold uppercase rounded-xl hover:bg-primary/90"
                >
                  {editingItem ? "Simpan Perubahan" : "Tambah Alat"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="font-display-xl text-[18px] font-black text-on-surface uppercase">
              Konfirmasi Hapus Peralatan
            </h3>
            <p className="font-body-md text-[14px] text-on-surface-variant">
              Apakah Anda yakin ingin menghapus unit peralatan ini dari inventaris? Tindakan ini akan memperbarui data lokal.
            </p>
            <div className="flex justify-end gap-3 pt-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 bg-surface-container text-on-surface font-category-label font-bold uppercase rounded-lg"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  deleteGearItem(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="px-4 py-2 bg-red-600 text-white font-category-label font-bold uppercase rounded-lg hover:bg-red-700"
              >
                Ya, Hapus Unit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
