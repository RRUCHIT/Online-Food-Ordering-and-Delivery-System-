import { Link } from "react-router-dom";
import {
  UtensilsCrossed,
  Clock,
  ShoppingBag,
  Star,
  ArrowRight,
  MapPin,
  Sparkles,
  ShieldCheck,
  Smartphone,
  Users,
  Truck
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { motion, AnimatePresence } from "framer-motion";

export function LandingPage() {
  const features = [
    {
      icon: UtensilsCrossed,
      title: "Curated Menus",
      description: "Scroll restaurant menus that feel premium, not cluttered.",
    },
    {
      icon: Clock,
      title: "Fast Delivery",
      description: "Track live progress from kitchen to doorstep with ease.",
    },
    {
      icon: ShieldCheck,
      title: "Trusted Restaurants",
      description: "Verified partners, cleaner profiles, and better customer confidence.",
    },
    {
      icon: ShoppingBag,
      title: "One-Tap Reordering",
      description: "Come back later and keep your food flow moving without friction.",
    },
  ];

  const highlights = [
    "4.8 avg customer love",
    "Live order tracking",
    "Smooth checkout journey"
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fffaf7] to-[#fef4e8]">
      {/* Header */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 border-b border-white/50 bg-white/95 backdrop-blur-3xl supports-[backdrop-filter]:bg-white/90"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <motion.div 
              className="flex items-center gap-3"
              whileHover={{ scale: 1.02 }}
            >
              <motion.div 
                className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-400/20 to-orange-400/20 backdrop-blur-sm border border-rose-100/50 shadow-xl"
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <UtensilsCrossed className="w-7 h-7 text-rose-500 drop-shadow-sm" />
              </motion.div>
              <div className="hidden sm:block">
                <span className="block text-2xl font-black tracking-tight text-slate-900 drop-shadow-sm">FoodHub</span>
                <span className="block text-xs uppercase tracking-[0.28em] text-slate-400 font-medium">City food, styled better</span>
              </div>
              <span className="sm:hidden text-xl font-black text-slate-900">FH</span>
            </motion.div>

            <div className="flex items-center gap-2 sm:gap-3">
              <Link to="/login">
                <Button 
                  variant="ghost" 
                  className="rounded-full px-4 py-2 sm:px-5 text-sm backdrop-blur-sm bg-white/80 border border-slate-200/50 hover:bg-white/100 shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Login
                </Button>
              </Link>

              <Link to="/register">
                <Button 
                  className="group rounded-full bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white px-5 sm:px-6 py-2.5 shadow-2xl hover:shadow-3xl border-0 font-semibold text-sm"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Sign Up
                  <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-20 sm:pb-24 md:pb-28 lg:pb-32">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(225,29,72,0.12),transparent_50%),radial-gradient(circle_at_80%_80%,rgba(249,115,22,0.10),transparent_50%)] opacity-75" />
        
        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-8 lg:gap-12 items-center"
          >
            <motion.div variants={itemVariants} className="space-y-6 lg:space-y-8">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, x: -20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="inline-flex items-center gap-2 rounded-full border border-rose-100/70 bg-white/90 px-4 py-2.5 text-sm font-medium text-slate-700 shadow-xl backdrop-blur-sm hover:bg-white/100 transition-all duration-300"
              >
                <Sparkles className="w-4 h-4 text-rose-500" />
                <span>Smarter ordering, cleaner experience</span>
              </motion.div>

              <motion.h1 
                variants={itemVariants}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-slate-950 leading-[1.02] bg-gradient-to-r from-slate-950 to-slate-800 bg-clip-text"
              >
                Order food with a vibe that feels
                <span className="text-transparent bg-gradient-to-r from-rose-500 via-orange-500 to-rose-600 bg-clip-text"> modern, quick, and premium.</span>
              </motion.h1>

              <motion.p 
                variants={itemVariants}
                className="max-w-2xl text-base sm:text-lg md:text-xl text-slate-600 leading-8 font-medium"
              >
                Browse menus like a real food app, discover strong restaurant profiles,
                and move from craving to checkout without awkward friction.
              </motion.p>

              <motion.div 
                variants={itemVariants}
                className="flex flex-col sm:flex-row flex-wrap gap-3 mb-8"
              >
                {highlights.map((item, index) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="rounded-full bg-gradient-to-r from-white/90 to-white/70 px-5 py-3 text-sm font-semibold text-slate-800 shadow-xl border border-white/50 backdrop-blur-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex-1 sm:flex-none"
                    whileHover={{ scale: 1.05, y: -2 }}
                  >
                    {item}
                  </motion.div>
                ))}
              </motion.div>

              <motion.div 
                variants={itemVariants}
                className="flex flex-col sm:flex-row gap-3 sm:gap-4"
              >
                <Link to="/customer">
                  <Button
                    size="lg"
                    className="group rounded-full bg-gradient-to-r from-rose-500 via-rose-600 to-orange-500 hover:from-rose-600 hover:via-rose-700 hover:to-orange-600 text-white px-8 py-4 shadow-2xl hover:shadow-3xl font-semibold text-base border-0 flex-1 sm:flex-none"
                    whileHover={{ scale: 1.05, y: -3 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span>Browse Menu</span>
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                </Link>

                <Link to="/register">
                  <Button
                    size="lg"
                    variant="outline"
                    className="group rounded-full border-slate-200/70 bg-white/90 text-slate-900 hover:bg-white hover:border-slate-300/70 px-8 py-4 backdrop-blur-sm shadow-xl hover:shadow-2xl font-semibold text-base border-2 flex-1 sm:flex-none"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Create Account
                  </Button>
                </Link>
              </motion.div>
            </motion.div>

            {/* Hero Mockup */}
            <motion.div 
              variants={itemVariants}
              className="relative"
            >
              <motion.div
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [0, 1, -1, 0]
                }}
                transition={{ 
                  y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                  rotate: { duration: 6, repeat: Infinity, ease: "easeInOut" }
                }}
                className="relative rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 p-6 sm:p-8 shadow-2xl shadow-slate-900/30"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-rose-500/20 via-orange-400/20 to-rose-500/20 rounded-3xl blur-xl -z-10 animate-pulse" />
                <div className="rounded-2xl bg-gradient-to-br from-orange-50 via-rose-50 to-orange-50 p-5 sm:p-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-rose-400/20 to-orange-400/20 rounded-full blur-xl -translate-y-4 translate-x-4" />
                  
                  <div className="mb-5 flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-rose-400 font-bold mb-1.5">Tonight's picks</p>
                    </div>
                    <motion.div 
                      className="rounded-2xl bg-white/90 p-2.5 shadow-lg backdrop-blur-sm border border-white/50"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-rose-500" />
                    </motion.div>
                  </div>

                  <div className="space-y-4">
                    {[
                      { name: "Spice Garden", tag: "North Indian", time: "28 min", rating: "4.7" },
                      { name: "Urban Biryani", tag: "Biryani", time: "31 min", rating: "4.6" },
                      { name: "Crust & Coal", tag: "Pizza", time: "24 min", rating: "4.8" }
                    ].map((item, index) => (
                      <motion.div
                        key={item.name}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 + index * 0.1 }}
                        className={`rounded-2xl border border-white/50 bg-white/95 p-4 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group relative overflow-hidden ${index === 1 ? "translate-x-2 sm:translate-x-4" : ""}`}
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-rose-500/5 to-orange-500/5" />
                        <div className="relative flex items-start justify-between gap-3 sm:gap-4">
                          <div className="flex-1 min-w-0">
                            <h4 className="text-base sm:text-lg font-black text-slate-900 truncate group-hover:text-rose-600 transition-colors">{item.name}</h4>
                            <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium capitalize">{item.tag}</p>
                            <div className="flex items-center gap-2 sm:gap-3 mt-3 text-xs sm:text-sm text-slate-600">
                              <span className="font-semibold">{item.time}</span>
                              <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-emerald-400/20 to-emerald-500/20 px-3 py-1.5 text-emerald-700 font-semibold border border-emerald-200/50 shadow-sm">
                                <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current" />
                                {item.rating}
                              </span>
                            </div>
                          </div>
                          <motion.div 
                            className="h-14 w-14 sm:h-16 sm:w-16 rounded-2xl bg-gradient-to-br from-rose-400 via-orange-500 to-rose-500 shadow-2xl flex-shrink-0"
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            transition={{ type: "spring" }}
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 sm:py-24 lg:py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-white/50 to-transparent h-1/2" />
        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16 sm:mb-20"
          >
            <motion.p 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
              className="text-sm uppercase tracking-[0.3em] text-rose-400 mb-4 font-bold"
            >
              Why it feels better
            </motion.p>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-slate-950 bg-gradient-to-r from-slate-950 to-slate-800 bg-clip-text"
            >
              Built to feel sharper and easier.
            </motion.h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="group overflow-hidden rounded-3xl border-white/70 bg-white/95 shadow-2xl hover:shadow-3xl backdrop-blur-xl border border-white/50 h-full transition-all duration-500 hover:-translate-y-3 hover:scale-[1.02]">
                    <CardContent className="pt-8 pb-10 px-6 h-full flex flex-col justify-between">
                      <motion.div 
                        className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-rose-400/20 via-orange-400/20 to-rose-500/20 rounded-3xl flex items-center justify-center mb-6 mx-auto shadow-2xl group-hover:scale-110 transition-all duration-500 backdrop-blur-sm border border-white/50"
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                      >
                        <Icon className="w-8 h-8 sm:w-10 sm:h-10 text-rose-500 drop-shadow-lg" />
                      </motion.div>

                      <div className="text-center flex-1 flex flex-col justify-center">
                        <h3 className="text-xl sm:text-2xl font-black mb-4 text-slate-900 group-hover:text-rose-600 transition-colors duration-300">{feature.title}</h3>
                        <p className="text-slate-600 leading-7 font-medium text-sm sm:text-base">{feature.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-24 lg:py-32">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="container mx-auto px-4 sm:px-6 lg:px-8"
        >
                    <div className="rounded-3xl bg-gradient-to-r from-rose-500 via-orange-500 to-rose-600 text-white px-10 py-16 text-center shadow-2xl relative overflow-hidden">

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.15),transparent_60%)]" />

            <div className="relative max-w-3xl mx-auto">

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-6">
                Ready to explore amazing food?
              </h2>

              <p className="text-lg sm:text-xl text-white/90 mb-8">
                Join FoodHub today and start discovering the best restaurants around you.
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-4">

                <Link to="/register">
                  <Button
                    size="lg"
                    className="rounded-full bg-white text-rose-600 hover:bg-gray-100 px-8 py-4 font-semibold shadow-xl"
                  >
                    Create Account
                  </Button>
                </Link>

                <Link to="/customer">
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-full border-white text-white hover:bg-white hover:text-rose-600 px-8 py-4 font-semibold"
                  >
                    Browse Restaurants
                  </Button>
                </Link>

              </div>

            </div>

          </div>
        </motion.div>
      </section>


      {/* Footer */}

      <footer className="border-t border-slate-200 bg-white py-10 mt-16">

        <div className="container mx-auto px-4 sm:px-6 lg:px-8">

          <div className="flex flex-col md:flex-row items-center justify-between gap-6">

            <div className="flex items-center gap-3">
              <UtensilsCrossed className="w-6 h-6 text-rose-500" />
              <span className="font-bold text-slate-900">FoodHub</span>
            </div>

            <p className="text-sm text-slate-500 text-center md:text-left">
              © {new Date().getFullYear()} FoodHub. All rights reserved.<br></br>
              Made By:- Ruchit Solanki | Kavan Patel
            </p>

            <div className="flex gap-4 text-sm text-slate-600">
              <a href="#" className="hover:text-rose-500">Privacy</a>
              <a href="#" className="hover:text-rose-500">Terms</a>
              <a href="#" className="hover:text-rose-500">Support</a>
            </div>

          </div>

        </div>

      </footer>

    </div>
  );
}