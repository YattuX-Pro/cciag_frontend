'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import { ArrowRight, Shield, CreditCard, Users, BarChart3, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { AuthActions } from './(auth)/utils';
import { urls } from '@/types/const';

export default function Home() {
  const router = useRouter();
  const {isAuthenticated} = AuthActions();

  const features = [
    {
      icon: CreditCard,
      title: 'Gestion des Cartes ID',
      description: 'Générez et gérez des cartes d\'identification sécurisées avec des capacités de suivi avancées.',
    },
    {
      icon: Shield,
      title: 'Sécurité Renforcée',
      description: 'Mesures de sécurité de pointe pour protéger les données et prévenir les accès non autorisés.',
    },
    {
      icon: BarChart3,
      title: 'Tableau de Bord Analytique',
      description: 'Outils complets d\'analyse et de reporting pour suivre les activités et les performances.',
    },
    {
      icon: Users,
      title: 'Accès Multi-utilisateurs',
      description: 'Contrôle d\'accès basé sur les rôles pour la collaboration d\'équipe avec historique détaillé.',
    },
  ];

  const testimonials = [
    {
      quote: "Cette plateforme a révolutionné notre gestion des cartes d'identification. Elle est efficace et sécurisée.",
      author: "Sarah Martin",
      role: "Directrice des Opérations",
      company: "TechCorp Solutions"
    },
    {
      quote: "Le tableau de bord analytique fournit des informations précieuses pour nos décisions commerciales.",
      author: "Michel Dubois",
      role: "Analyste Commercial",
      company: "Global ID Solutions"
    },
  ];
  return (
      <div className="min-h-screen relative overflow-hidden bg-gray-950">
        {/* Animated gradient background */}
        <div className="fixed inset-0 bg-gradient-to-br from-cyan-950 via-cyan-900 to-cyan-950 animate-gradient-slow" />
        
        {/* Decorative background elements */}
        <div className="fixed inset-0">
          <div className="absolute top-0 -left-4 w-96 h-96 bg-cyan-800/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
          <div className="absolute top-0 -right-4 w-96 h-96 bg-blue-800/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
          <div className="absolute -bottom-8 left-20 w-96 h-96 bg-cyan-700/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />
        </div>
  
        {/* Content */}
        <div className="relative z-10">
          {/* Hero Section */}
          <div className="relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
              <div className="text-center space-y-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Badge variant="outline" className="px-4 py-2 border-cyan-800/50 bg-cyan-950/50 backdrop-blur-sm text-cyan-100">
                    Système de Gestion de Cartes ID
                  </Badge>
                </motion.div>
                
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-4xl md:text-6xl font-bold tracking-tight text-white"
                >
                  Simplifiez Votre{' '}
                  <span className="bg-gradient-to-r from-cyan-400 to-cyan-200 bg-clip-text text-transparent">
                    Gestion d'Identité
                  </span>
                </motion.h1>
                
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="max-w-2xl mx-auto text-xl text-gray-300"
                >
                  Une plateforme complète pour la gestion des cartes d'identification, l'analyse et la sécurité.
                </motion.p>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="flex justify-center"
                >
                  <Button
                    size="lg"
                    className="text-lg bg-cyan-500 hover:bg-cyan-600 text-white transition-all duration-300"
                    onClick={() => router.push(isAuthenticated() ? urls.dashboard : urls.login)}
                  >
                    {isAuthenticated() ? 'Mon Pannel' : 'Connexion'} <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </motion.div>
              </div>
            </div>
          </div>
  
          {/* Features Section */}
          <div className="py-24 bg-gray-950/50 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center mb-16"
              >
                <h2 className="text-3xl font-bold text-white">Fonctionnalités Puissantes pour les Entreprises Modernes</h2>
                <p className="mt-4 text-lg text-gray-300">
                  Tout ce dont vous avez besoin pour gérer efficacement vos cartes d'identification
                </p>
              </motion.div>
  
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className="bg-gray-900/50 backdrop-blur-sm border-cyan-900/20 hover:bg-gray-800/50 transition-colors duration-300">
                      <div className="p-6">
                        <div className="w-12 h-12 rounded-lg bg-cyan-900/30 flex items-center justify-center mb-4">
                          <feature.icon className="h-6 w-6 text-cyan-400" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2 text-white">{feature.title}</h3>
                        <p className="text-gray-300">{feature.description}</p>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
  
          {/* Testimonials Section */}
          <div className="py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center mb-16"
              >
                <h2 className="text-3xl font-bold text-white">Approuvé par les Leaders de l'Industrie</h2>
                <p className="mt-4 text-lg text-gray-300">
                  Découvrez ce que nos clients disent de nous
                </p>
              </motion.div>
  
              <div className="grid md:grid-cols-2 gap-8">
                {testimonials.map((testimonial, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className="bg-gray-900/50 backdrop-blur-sm border-cyan-900/20 hover:bg-gray-800/50 transition-colors duration-300">
                      <div className="p-8">
                        <div className="flex items-center mb-6">
                          <CheckCircle2 className="h-5 w-5 text-cyan-400 mr-2" />
                          <p className="text-sm text-cyan-400 font-medium">Client Vérifié</p>
                        </div>
                        <blockquote className="text-lg mb-6 text-gray-200">{testimonial.quote}</blockquote>
                        <div>
                          <p className="font-semibold text-white">{testimonial.author}</p>
                          <p className="text-sm text-gray-400">{testimonial.role}</p>
                          <p className="text-sm text-gray-400">{testimonial.company}</p>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }