"use client";

import { motion } from "framer-motion";
import { Webhook, Check, Zap, Shield, GitBranch, Clock } from "lucide-react";

export function WebhookProxyDetails() {
  const features = [
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Process webhooks in milliseconds with optimized routing"
    },
    {
      icon: Shield,
      title: "Secure & Reliable",
      description: "Enterprise-grade security with automatic retry mechanisms"
    },
    {
      icon: GitBranch,
      title: "Flexible Routing",
      description: "Route webhooks to multiple endpoints with custom rules"
    },
    {
      icon: Clock,
      title: "Real-time Monitoring",
      description: "Track all webhook events with detailed logs and analytics"
    }
  ];

  const useCases = [
    "Receive webhooks from third-party services",
    "Transform and forward webhook payloads",
    "Test webhook integrations locally",
    "Monitor and debug webhook delivery",
    "Queue and retry failed webhooks"
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <motion.div
          initial={false}
          whileHover={{ scale: 1.05, rotate: 5 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="inline-flex p-6 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-3xl border border-indigo-500/30"
        >
          <Webhook className="w-16 h-16 text-indigo-400" />
        </motion.div>
        <h2 className="text-4xl font-bold text-discord-text-normal">
          Webhook Proxy
        </h2>
        <p className="text-lg text-discord-text-muted max-w-2xl mx-auto">
          A powerful webhook management system that receives, processes, and forwards webhooks with advanced routing and monitoring capabilities.
        </p>
      </div>

      {/* Features Grid */}
      <div>
        <h3 className="text-2xl font-semibold text-discord-text-normal mb-4">
          Key Features
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={false}
              whileHover={{ scale: 1.02, borderColor: "rgba(99, 102, 241, 0.5)" }}
              transition={{ duration: 0.2 }}
              className="p-4 bg-discord-darker rounded-xl border border-discord-dark hover:border-indigo-500/50 transition-all group"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 bg-indigo-500/10 rounded-lg group-hover:bg-indigo-500/20 transition-all">
                  <feature.icon className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-discord-text-normal mb-1">
                    {feature.title}
                  </h4>
                  <p className="text-sm text-discord-text-muted">
                    {feature.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Use Cases */}
      <div>
        <h3 className="text-2xl font-semibold text-discord-text-normal mb-4">
          What You Can Do
        </h3>
        <div className="space-y-3">
          {useCases.map((useCase, index) => (
            <motion.div
              key={index}
              initial={false}
              whileHover={{ x: 4 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-3 p-3 bg-discord-darker rounded-lg border border-discord-dark"
            >
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                <Check className="w-4 h-4 text-green-400" />
              </div>
              <span className="text-discord-text-normal">{useCase}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="p-6 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-xl border border-indigo-500/30">
        <p className="text-center text-discord-text-normal">
          Ready to streamline your webhook workflows?
          <br />
          <span className="text-sm text-discord-text-muted">
            Click next to configure your Webhook Proxy project
          </span>
        </p>
      </div>
    </div>
  );
}
