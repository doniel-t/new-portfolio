"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Loader2, CheckCircle, AlertCircle } from "lucide-react";

type FormStatus = "idle" | "loading" | "success" | "error";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send message");
      }

      setStatus("success");
      setFormData({ name: "", email: "", message: "" });
      
      // Reset to idle after 5 seconds
      setTimeout(() => setStatus("idle"), 5000);
    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Something went wrong");
      
      // Reset to idle after 5 seconds
      setTimeout(() => setStatus("idle"), 5000);
    }
  };

  const inputClasses =
    "w-full bg-white/[0.03] border border-white/10 rounded-sm px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 focus:bg-white/[0.05] transition-all duration-300 font-mono text-sm";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Name Input */}
      <div className="relative group">
        {/* Corner accents */}
        <div className="absolute -top-px -left-px w-2 h-2 border-t border-l border-white/20 group-focus-within:border-white/40 transition-colors" />
        <div className="absolute -top-px -right-px w-2 h-2 border-t border-r border-white/20 group-focus-within:border-white/40 transition-colors" />
        <div className="absolute -bottom-px -left-px w-2 h-2 border-b border-l border-white/20 group-focus-within:border-white/40 transition-colors" />
        <div className="absolute -bottom-px -right-px w-2 h-2 border-b border-r border-white/20 group-focus-within:border-white/40 transition-colors" />
        
        <input
          type="text"
          placeholder="NAME"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          disabled={status === "loading"}
          className={inputClasses}
        />
      </div>

      {/* Email Input */}
      <div className="relative group">
        <div className="absolute -top-px -left-px w-2 h-2 border-t border-l border-white/20 group-focus-within:border-white/40 transition-colors" />
        <div className="absolute -top-px -right-px w-2 h-2 border-t border-r border-white/20 group-focus-within:border-white/40 transition-colors" />
        <div className="absolute -bottom-px -left-px w-2 h-2 border-b border-l border-white/20 group-focus-within:border-white/40 transition-colors" />
        <div className="absolute -bottom-px -right-px w-2 h-2 border-b border-r border-white/20 group-focus-within:border-white/40 transition-colors" />
        
        <input
          type="email"
          placeholder="EMAIL"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
          disabled={status === "loading"}
          className={inputClasses}
        />
      </div>

      {/* Message Textarea */}
      <div className="relative group">
        <div className="absolute -top-px -left-px w-2 h-2 border-t border-l border-white/20 group-focus-within:border-white/40 transition-colors" />
        <div className="absolute -top-px -right-px w-2 h-2 border-t border-r border-white/20 group-focus-within:border-white/40 transition-colors" />
        <div className="absolute -bottom-px -left-px w-2 h-2 border-b border-l border-white/20 group-focus-within:border-white/40 transition-colors" />
        <div className="absolute -bottom-px -right-px w-2 h-2 border-b border-r border-white/20 group-focus-within:border-white/40 transition-colors" />
        
        <textarea
          placeholder="MESSAGE"
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          required
          disabled={status === "loading"}
          rows={5}
          className={`${inputClasses} resize-none`}
        />
      </div>

      {/* Submit Button */}
      <motion.button
        type="submit"
        disabled={status === "loading" || status === "success"}
        className="relative w-full py-4 px-6 bg-white/[0.05] border border-white/20 text-white font-mono text-sm uppercase tracking-widest overflow-hidden group disabled:cursor-not-allowed"
        whileHover={status === "idle" ? { scale: 1.01 } : {}}
        whileTap={status === "idle" ? { scale: 0.99 } : {}}
      >
        {/* Animated background fill on hover */}
        <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
        
        {/* Corner accents */}
        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-white/30 group-hover:border-white/60 transition-colors" />
        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-white/30 group-hover:border-white/60 transition-colors" />
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-white/30 group-hover:border-white/60 transition-colors" />
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-white/30 group-hover:border-white/60 transition-colors" />
        
        {/* Button content */}
        <span className="relative flex items-center justify-center gap-3">
          <AnimatePresence mode="wait">
            {status === "idle" && (
              <motion.span
                key="idle"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-3"
              >
                <Send size={16} />
                Send Message
              </motion.span>
            )}
            {status === "loading" && (
              <motion.span
                key="loading"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-3"
              >
                <Loader2 size={16} className="animate-spin" />
                Sending...
              </motion.span>
            )}
            {status === "success" && (
              <motion.span
                key="success"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-3 text-green-400"
              >
                <CheckCircle size={16} />
                Message Sent!
              </motion.span>
            )}
            {status === "error" && (
              <motion.span
                key="error"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-3 text-red-400"
              >
                <AlertCircle size={16} />
                {errorMessage || "Failed to send"}
              </motion.span>
            )}
          </AnimatePresence>
        </span>
      </motion.button>
    </form>
  );
}
