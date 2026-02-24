"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  X,
  MapPin,
  Phone,
  Clock,
  ChefHat,
  Info,
  AlertCircle,
  UtensilsCrossed,
} from "lucide-react";

export default function AlmashriqMenu() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showInfo, setShowInfo] = useState(false);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const mainRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [prodRes, catRes] = await Promise.all([
          fetch("https://food-api-7a58.onrender.com/api/products"),
          fetch("https://food-api-7a58.onrender.com/api/categories"),
        ]);

        if (!prodRes.ok && !catRes.ok)
          throw new Error("Mahsulotlar va kategoriyalar yuklanmadi");
        if (!prodRes.ok) throw new Error("Mahsulotlar yuklanmadi");
        if (!catRes.ok) throw new Error("Kategoriyalar yuklanmadi");

        const prods = await prodRes.json();
        const cats = await catRes.json();

        setProducts(prods);
        setCategories(cats);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCategoryChange = (catId) => {
    setActiveCategory(catId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getLocalized = (field) => {
    if (!field) return "";
    if (typeof field === "string") return field;
    return field.uzb || field.uz || field.rus || "";
  };

  const filteredProducts =
    activeCategory === "all"
      ? products
      : products.filter((p) => {
          if (!p) return false;
          const pCat = p.category?._id || p.category;
          return pCat === activeCategory;
        });

  const searchedProducts = (searchQuery ? products : filteredProducts).filter(
    (product) => {
      if (!product) return false;
      if (!searchQuery) return true;
      const name = getLocalized(product.name).toLowerCase();
      const description = getLocalized(product.description).toLowerCase();
      const query = searchQuery.toLowerCase();
      return name.includes(query) || description.includes(query);
    },
  );

  const SkeletonCard = () => (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse">
      <div className="aspect-square bg-gray-200" />
      <div className="p-3">
        <div className="h-4 bg-gray-200 rounded mb-2 w-3/4" />
        <div className="h-3 bg-gray-200 rounded mb-1 w-full" />
        <div className="h-3 bg-gray-200 rounded mb-2 w-2/3" />
        <div className="h-5 bg-gray-200 rounded w-1/2" />
      </div>
    </div>
  );

  // CSS-ga asoslangan ishonchli rasm fallback
  const ProductImage = ({ src, alt, fallbackSize = "12" }) => {
    const [imgError, setImgError] = useState(false);
    return imgError || !src ? (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <ChefHat
          className={`w-${fallbackSize} h-${fallbackSize} text-gray-300`}
        />
      </div>
    ) : (
      <img
        src={src}
        alt={alt || ""}
        className="w-full h-full object-cover"
        loading="lazy"
        onError={() => setImgError(true)}
      />
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white sticky top-0 z-40 shadow-sm">
          <div className="px-4 py-3">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-red-600 p-2 rounded-xl">
                <ChefHat className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Almashriq</h1>
                <p className="text-xs text-gray-500">Namangan, Almashriq</p>
              </div>
            </div>
            <div className="h-10 bg-gray-100 rounded-xl mb-3 animate-pulse" />
            <div className="flex gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-9 w-24 bg-gray-100 rounded-lg animate-pulse flex-shrink-0"
                />
              ))}
            </div>
          </div>
        </header>
        <main className="px-4 py-4 max-w-2xl mx-auto">
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="bg-red-100 p-5 rounded-full inline-block mb-4">
            <AlertCircle className="w-12 h-12 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Xatolik yuz berdi
          </h2>
          <p className="text-gray-500 text-sm mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-600 text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-red-700 transition-all"
          >
            Qayta urinish
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white sticky top-0 z-40 shadow-sm">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="bg-red-600 p-2 rounded-xl">
                <ChefHat className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Almashriq</h1>
                <p className="text-xs text-gray-500">Namangan, Almashriq</p>
              </div>
            </div>

            <button
              onClick={() => setShowInfo(true)}
              className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all"
            >
              <Info className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Qidirish..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-2.5 pl-10 pr-10 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:border-red-500 outline-none transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full bg-gray-300 hover:bg-gray-400 transition-all"
              >
                <X className="w-3 h-3 text-white" />
              </button>
            )}
          </div>

          <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
            <div className="flex gap-2 pb-1">
              <button
                onClick={() => handleCategoryChange("all")}
                className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${
                  activeCategory === "all"
                    ? "bg-red-600 text-white shadow-md"
                    : "bg-white text-gray-700 border border-gray-200"
                }`}
              >
                Barchasi
              </button>
              {categories.map((cat) => (
                <button
                  key={cat._id}
                  onClick={() => handleCategoryChange(cat._id)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${
                    activeCategory === cat._id
                      ? "bg-red-600 text-white shadow-md"
                      : "bg-white text-gray-700 border border-gray-200"
                  }`}
                >
                  {getLocalized(cat.name)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <main ref={mainRef} className="px-4 py-4 pb-20 max-w-2xl mx-auto">
        {searchedProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="bg-gray-100 p-5 rounded-full mb-4">
              <UtensilsCrossed className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-700 mb-1">
              Hech narsa topilmadi
            </h3>
            <p className="text-sm text-gray-400">
              {searchQuery
                ? `"${searchQuery}" bo'yicha mahsulot yo'q`
                : "Bu kategoriyada mahsulot yo'q"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {searchedProducts.map((product) => (
              <div
                key={product._id}
                onClick={() => setSelectedProduct(product)}
                className="bg-white rounded-2xl overflow-hidden shadow-sm active:scale-95 transition-all cursor-pointer"
              >
                <div className="relative aspect-square bg-gray-100">
                  <ProductImage
                    src={product.image}
                    alt={getLocalized(product.name)}
                    fallbackSize="12"
                  />
                  <div className="absolute top-2 left-2 right-2 flex justify-between items-start">
                    {product.badge && (
                      <div className="bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-md">
                        {product.badge}
                      </div>
                    )}
                    {product.discount > 0 && (
                      <div className="bg-yellow-400 text-gray-900 text-[10px] font-bold px-2 py-1 rounded-md ml-auto">
                        -{product.discount}%
                      </div>
                    )}
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="font-semibold text-sm text-gray-900 mb-1 line-clamp-1">
                    {getLocalized(product.name)}
                  </h3>
                  <p className="text-xs text-gray-500 mb-2 line-clamp-2 h-8">
                    {getLocalized(product.description)}
                  </p>
                  <div className="text-base font-bold text-red-600">
                    {Math.round(
                      (product.price || 0) *
                        (1 - (product.discount || 0) / 100),
                    ).toLocaleString()}{" "}
                    so'm
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Info Modal — fon qoraligiga bossangiz yopiladi */}
      {showInfo && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={() => setShowInfo(false)}
        >
          <div
            className="bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-lg max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Restoran haqida
                </h2>
                <button
                  onClick={() => setShowInfo(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-5 h-5 text-gray-700" />
                </button>
              </div>

              <div className="flex items-center gap-3 mb-6">
                <div className="bg-red-600 p-4 rounded-2xl">
                  <ChefHat className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Almashriq</h3>
                  <p className="text-sm text-gray-500">1994 yildan beri</p>
                </div>
              </div>

              <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                Almashriq - eng mazali va yangi milliy taomlarni taqdim etamiz.
                1994 yildan beri Namangan aholisiga xizmat ko'rsatmoqdamiz.
              </p>

              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3">
                  <div className="bg-red-100 p-2 rounded-lg">
                    <MapPin className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm">
                      Manzil
                    </h4>
                    <p className="text-xs text-gray-600">Namangan, Almashriq</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-red-100 p-2 rounded-lg">
                    <Phone className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm">
                      Aloqa
                    </h4>
                    {/* Telefon raqami bosiladi */}
                    <a
                      href="tel:+998991234567"
                      className="text-xs text-red-600 font-semibold hover:underline"
                    >
                      +998 99 123 45 67
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-red-100 p-2 rounded-lg">
                    <Clock className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm">
                      Ish vaqti
                    </h4>
                    <p className="text-xs text-gray-600">
                      Dushanba - Yakshanba
                    </p>
                    <p className="text-xs font-bold text-red-600">
                      7:00 - 23:00
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Product Modal — fon qoraligiga bossangiz yopiladi, scroll bor */}
      {selectedProduct && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={() => setSelectedProduct(null)}
        >
          <div
            className="bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-lg max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-64 sm:h-80 flex-shrink-0">
              <ProductImage
                src={selectedProduct.image}
                alt={getLocalized(selectedProduct.name)}
                fallbackSize="20"
              />
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 bg-white/90 p-2 rounded-full"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-2">
                {getLocalized(selectedProduct.name)}
              </h2>
              <div className="flex items-center gap-3 mb-4">
                <p className="text-red-600 text-2xl font-bold">
                  {Math.round(
                    (selectedProduct.price || 0) *
                      (1 - (selectedProduct.discount || 0) / 100),
                  ).toLocaleString()}{" "}
                  so'm
                </p>
                {selectedProduct.discount > 0 && (
                  <p className="text-gray-400 text-sm line-through">
                    {selectedProduct.price.toLocaleString()} so'm
                  </p>
                )}
              </div>
              <p className="text-gray-600 text-sm bg-gray-50 p-4 rounded-xl leading-relaxed">
                {getLocalized(selectedProduct.description)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
