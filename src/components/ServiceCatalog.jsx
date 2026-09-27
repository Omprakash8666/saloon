import React, { useState, useMemo } from 'react';
import { useSalon } from '../context/SalonContext';
import { CATEGORIES } from '../data/salonData';
import {
  Clock,
  Sparkles,
  Search,
  Check,
  Plus,
  ArrowRight,
  Flame,
  CheckCircle2,
} from 'lucide-react';

export const ServiceCatalog = () => {
  const {
    services,
    bookingDraft,
    toggleServiceInDraft,
    openBookingModal,
  } = useSalon();

  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter services by category and search term
  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      const matchesCategory =
        activeCategory === 'all' || service.category === activeCategory;
      const matchesSearch =
        service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.categoryName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [services, activeCategory, searchQuery]);

  // Selected services in current draft
  const selectedServiceIds = useMemo(() => {
    return new Set(bookingDraft.selectedServices.map((s) => s.id));
  }, [bookingDraft.selectedServices]);

  const totalSelectedPrice = bookingDraft.selectedServices.reduce(
    (sum, s) => sum + s.price,
    0
  );
  const totalSelectedDuration = bookingDraft.selectedServices.reduce(
    (sum, s) => sum + s.duration,
    0
  );

  const formatDuration = (mins) => {
    const hours = Math.floor(mins / 60);
    const m = mins % 60;
    if (hours > 0 && m > 0) return `${hours}h ${m}m`;
    if (hours > 0) return `${hours}h`;
    return `${m} mins`;
  };

  return (
    <section id="services" className="py-24 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-xs uppercase tracking-widest font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curated Indian Treatment & Spa Menu</span>
          </div>
          <h2 className="font-serif-luxury text-3xl sm:text-5xl font-bold text-white tracking-tight mb-4">
            Indian Haircuts, Ayurvedic Spas & Grooming
          </h2>
          <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
            Select one or combine multiple rituals. All appointments include an initial Prakriti scalp
            consultation and complimentary saffron chai or cardamom kahwa service.
          </p>
        </div>

        {/* Matcher Quick Banner Callout */}
        <div className="mb-10 max-w-2xl mx-auto p-3.5 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#D4AF37] text-black flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-black" />
            </div>
            <div>
              <span className="text-xs font-bold text-white block">
                Unsure which ritual flatters your face shape & hair length?
              </span>
              <span className="text-[11px] text-gray-300">
                Take our 30-second visual quiz for instant personalized recommendations.
              </span>
            </div>
          </div>
          <a
            href="#matcher"
            className="px-4 py-1.5 rounded-xl bg-[#D4AF37] hover:bg-[#E5C378] text-black text-xs font-bold whitespace-nowrap transition-colors"
          >
            Take 30-Sec Quiz →
          </a>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10 pb-6 border-b border-white/10">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-[#D4AF37] text-black font-semibold shadow-md shadow-[#D4AF37]/20'
                      : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white border border-white/10'
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search treatments..."
              className="w-full pl-10 pr-4 py-2 rounded-full bg-[#14161E] border border-white/10 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37] transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Services Grid */}
        {filteredServices.length === 0 ? (
          <div className="text-center py-20 glass-panel rounded-3xl">
            <p className="text-gray-400 text-lg mb-4">No treatments match your search criteria.</p>
            <button
              onClick={() => {
                setActiveCategory('all');
                setSearchQuery('');
              }}
              className="px-6 py-2.5 rounded-full bg-white/10 text-sm text-white hover:bg-white/20 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredServices.map((service) => {
              const isSelected = selectedServiceIds.has(service.id);

              return (
                <div
                  key={service.id}
                  className={`group relative rounded-3xl overflow-hidden flex flex-col transition-all duration-300 ${
                    isSelected
                      ? 'bg-[#181B26] border-2 border-[#D4AF37] shadow-xl shadow-[#D4AF37]/15'
                      : 'glass-panel hover:border-white/20 hover:shadow-2xl'
                  }`}
                >
                  {/* Service Image */}
                  <div className="relative h-52 sm:h-56 w-full overflow-hidden bg-gray-900">
                    <img
                      src={service.image}
                      alt={service.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-95"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#12141A] via-transparent to-black/30" />

                    {/* Top Badges */}
                    <div className="absolute top-3.5 left-3.5 flex items-center gap-2">
                      <span className="text-[11px] uppercase tracking-wider font-semibold px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-gray-200 border border-white/10">
                        {service.categoryName}
                      </span>
                      {service.popular && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#D4AF37] text-black">
                          <Flame className="w-3 h-3 fill-black" />
                          <span>Signature</span>
                        </span>
                      )}
                    </div>

                    {/* Duration badge */}
                    <div className="absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/75 backdrop-blur-md text-xs text-gray-200 border border-white/10 font-medium">
                      <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>{service.duration} mins</span>
                    </div>
                  </div>

                  {/* Service Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <h3 className="font-serif-luxury text-xl font-bold text-white group-hover:text-[#D4AF37] transition-colors leading-tight">
                          {service.name}
                        </h3>
                        <span className="text-xl font-bold text-[#D4AF37] font-display whitespace-nowrap">
                          ₹{service.price.toLocaleString('en-IN')}
                        </span>
                      </div>

                      <p className="text-gray-400 text-xs sm:text-sm line-clamp-3 mb-4 leading-relaxed">
                        {service.description}
                      </p>

                      {/* Included perks checklist */}
                      <div className="space-y-1.5 mb-6 pt-3 border-t border-white/5">
                        {service.includes.map((perk, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-xs text-gray-300">
                            <Check className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                            <span>{perk}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Actions: Add to Booking & Quick Book */}
                    <div className="grid grid-cols-2 gap-2 pt-2">
                      <button
                        onClick={() => toggleServiceInDraft(service)}
                        className={`w-full py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]'
                            : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'
                        }`}
                      >
                        {isSelected ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Selected</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add to Booking</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => openBookingModal({ service, step: 2 })}
                        className="w-full py-2.5 px-3 rounded-xl text-xs font-bold bg-[#D4AF37] hover:bg-[#E5C378] text-black transition-all flex items-center justify-center gap-1 shadow-md shadow-[#D4AF37]/15 cursor-pointer"
                      >
                        <span>Book Slot</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Floating Cart Sticky Bar when at least 1 service is selected */}
        {selectedServiceIds.size > 0 && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 w-full max-w-2xl px-4 animate-in slide-in-from-bottom-6">
            <div className="glass-panel-gold p-4 rounded-2xl shadow-2xl flex items-center justify-between gap-4 border border-[#D4AF37]/40">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#D4AF37] text-black font-bold flex items-center justify-center text-sm shadow-md">
                  {selectedServiceIds.size}
                </div>
                <div>
                  <div className="text-sm font-bold text-white">
                    {selectedServiceIds.size} {selectedServiceIds.size === 1 ? 'Treatment' : 'Treatments'} Selected
                  </div>
                  <div className="text-xs text-[#D4AF37] flex items-center gap-2">
                    <span>₹{totalSelectedPrice.toLocaleString('en-IN')}</span>
                    <span>•</span>
                    <span>{formatDuration(totalSelectedDuration)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => openBookingModal({ step: 2 })}
                className="gold-shimmer-btn text-black font-bold text-xs sm:text-sm px-5 sm:px-6 py-2.5 rounded-xl flex items-center gap-2 shadow-lg cursor-pointer whitespace-nowrap"
              >
                <span>Select Stylist & Slot</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
