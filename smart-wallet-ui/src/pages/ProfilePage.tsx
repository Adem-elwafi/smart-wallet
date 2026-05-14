import React, { useEffect, useState } from 'react';
import axios from 'axios';
import api from '../api/axiosConfig';
import type { Profile, UpdateProfileRequest } from '../api/types';

import {
  User,
  Mail,
  Camera,
  Loader2,
  CheckCircle,
  ShieldCheck,
  LogOut,
  Trash2,
  Globe,
  AlertCircle,
  Pencil,
  Lock,
  Bell,
  CreditCard,
  Settings,
  Sparkles,
  BadgeCheck,
} from 'lucide-react';

function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);

  const [formData, setFormData] = useState<UpdateProfileRequest>({
    email: '',
    fullName: '',
    avatarUrl: '',
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Chargement profil
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setError(null);

        const response = await api.get<Profile>('/v1/profile/me');

        setProfile(response.data);

        setFormData({
          email: response.data.email || '',
          fullName: response.data.fullName || '',
          avatarUrl: response.data.avatarUrl || '',
        });
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          setError(
            typeof err.response?.data === 'string'
              ? err.response.data
              : 'Impossible de charger le profil.'
          );
        } else {
          setError('Une erreur inattendue est survenue.');
        }
      } finally {
        setLoading(false);
      }
    };

    void loadProfile();
  }, []);

  // Gestion input
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Submit
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setSubmitting(true);
    setError(null);

    try {
      const response = await api.put<Profile>(
        '/v1/profile/me',
        formData
      );

      setProfile(response.data);

      setSuccess(true);

      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(
          typeof err.response?.data === 'string'
            ? err.response.data
            : 'Échec de la mise à jour.'
        );
      } else {
        setError(
          'Une erreur est survenue lors de l’enregistrement.'
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Loading Screen
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600" />

          <p className="text-sm font-semibold text-slate-500">
            Chargement de votre profil...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-8">

        {/* HEADER PREMIUM */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 p-8 text-white shadow-2xl">

          <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-white/10 blur-3xl"></div>

          <div className="relative flex flex-col items-center gap-6 md:flex-row">

            {/* Avatar */}
            <div className="relative">
              {formData.avatarUrl ? (
                <img
                  src={formData.avatarUrl}
                  alt="avatar"
                  className="h-28 w-28 rounded-full border-4 border-white/20 object-cover shadow-xl"
                />
              ) : (
                <div className="flex h-28 w-28 items-center justify-center rounded-full bg-white/10 text-4xl font-bold backdrop-blur-lg">
                  {formData.fullName?.charAt(0) ||
                    profile?.username?.charAt(0) ||
                    'U'}
                </div>
              )}

              <button className="absolute bottom-1 right-1 rounded-full bg-white p-2 text-slate-700 shadow-lg transition hover:scale-110 hover:text-blue-600">
                <Camera size={16} />
              </button>
            </div>

            {/* Infos */}
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center gap-2 md:justify-start">
                <h1 className="text-3xl font-extrabold">
                  {profile?.fullName || profile?.username}
                </h1>

                <BadgeCheck
                  size={24}
                  className="text-cyan-300"
                />
              </div>

              <p className="mt-2 text-slate-300">
                @{profile?.username}
              </p>

              <div className="mt-4 flex flex-wrap justify-center gap-3 md:justify-start">

                <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm backdrop-blur-lg">
                  <ShieldCheck size={16} />
                  Compte Vérifié
                </div>

                <div className="flex items-center gap-2 rounded-full bg-cyan-400/20 px-4 py-2 text-sm text-cyan-200">
                  <Sparkles size={16} />
                  SmartWallet Premium
                </div>
              </div>
            </div>
          </div>
        </div>

      

        {/* GRID */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">

          {/* SIDEBAR */}
          <div className="lg:col-span-1">

            <nav className="flex flex-col gap-2 rounded-3xl border border-slate-100 bg-white p-3 shadow-sm">

              <button className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 font-semibold text-white shadow-lg transition hover:scale-[1.02]">
                <User size={18} />
                Informations Générales
              </button>

              <button className="flex items-center gap-3 rounded-2xl px-4 py-3 font-medium text-slate-600 transition hover:bg-slate-100">
                <ShieldCheck size={18} />
                Sécurité
              </button>

              <button className="flex items-center gap-3 rounded-2xl px-4 py-3 font-medium text-slate-600 transition hover:bg-slate-100">
                <Bell size={18} />
                Notifications
              </button>

              <button className="flex items-center gap-3 rounded-2xl px-4 py-3 font-medium text-slate-600 transition hover:bg-slate-100">
                <Settings size={18} />
                Préférences
              </button>

              <div className="my-2 border-t border-slate-200"></div>

              <button className="flex items-center gap-3 rounded-2xl px-4 py-3 font-medium text-rose-600 transition hover:bg-rose-50">
                <LogOut size={18} />
                Déconnexion
              </button>
            </nav>
          </div>

          {/* CONTENT */}
          <div className="space-y-6 lg:col-span-2">

            {/* PROFILE SETTINGS */}
            <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm md:p-8">

              <div className="mb-8 flex items-center gap-3">
                <div className="rounded-xl bg-blue-100 p-3 text-blue-600">
                  <User />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Paramètres du profil
                  </h2>

                  <p className="text-sm text-slate-500">
                    Gérez vos informations personnelles
                  </p>
                </div>
              </div>

              {/* ERROR */}
              {error && (
                <div className="mb-6 flex items-center gap-3 rounded-2xl border border-rose-100 bg-rose-50 p-4 text-sm text-rose-600">
                  <AlertCircle size={18} />

                  <p>
                    <span className="font-bold">
                      Attention :
                    </span>{' '}
                    {error}
                  </p>
                </div>
              )}

              {/* FORM */}
              <form
                onSubmit={onSubmit}
                className="space-y-6"
              >

                {/* Full Name */}
                <div className="space-y-2">
                  <label className="ml-1 text-xs font-bold uppercase tracking-widest text-slate-600">
                    Nom complet
                  </label>

                  <div className="relative">
                    <User
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                      size={18}
                    />

                    <input
                      name="fullName"
                      type="text"
                      value={formData.fullName}
                      onChange={onChange}
                      placeholder="Ex: Adem Elwafi"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm font-medium text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="ml-1 text-xs font-bold uppercase tracking-widest text-slate-600">
                    Adresse Email
                  </label>

                  <div className="relative">
                    <Mail
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                      size={18}
                    />

                    <input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={onChange}
                      required
                      placeholder="nom@exemple.com"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm font-medium text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                    />
                  </div>
                </div>

                {/* Avatar URL */}
                <div className="space-y-2">
                  <label className="ml-1 text-xs font-bold uppercase tracking-widest text-slate-600">
                    Photo de profil
                  </label>

                  <div className="relative">
                    <Globe
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                      size={18}
                    />

                    <input
                      name="avatarUrl"
                      type="text"
                      value={formData.avatarUrl}
                      onChange={onChange}
                      placeholder="https://image.com/photo.jpg"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm font-medium text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                    />
                  </div>
                </div>

                {/* BUTTON */}
                <div className="flex items-center gap-4 pt-4">

                  <button
                    type="submit"
                    disabled={submitting}
                    className="group flex min-w-[220px] items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-slate-900 to-blue-900 px-6 py-3 text-sm font-bold text-white shadow-xl transition-all hover:scale-[1.02] hover:shadow-2xl disabled:opacity-70"
                  >
                    {submitting ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <>
                        <Pencil
                          size={18}
                          className="transition group-hover:rotate-12"
                        />

                        Enregistrer les modifications
                      </>
                    )}
                  </button>

                  {success && (
                    <div className="flex items-center gap-2 rounded-xl bg-green-50 px-4 py-3 text-sm font-bold text-green-600 animate-in fade-in slide-in-from-left-5">
                      <CheckCircle size={18} />
                      Mise à jour réussie
                    </div>
                  )}
                </div>
              </form>
            </section>

            {/* DANGER ZONE */}
            <section className="rounded-3xl border border-rose-100 bg-white p-6 shadow-sm md:p-8">

              <div className="flex items-start gap-4">

                <div className="rounded-2xl bg-rose-50 p-4 text-rose-600">
                  <Trash2 size={24} />
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Supprimer le compte
                  </h3>

                  <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-500">
                    Cette action est irréversible.
                    Toutes vos données personnelles,
                    transactions et informations seront
                    définitivement supprimées.
                  </p>

                  <button className="mt-5 rounded-xl border border-rose-200 bg-rose-50 px-5 py-3 text-sm font-bold text-rose-600 transition hover:bg-rose-100">
                    Supprimer définitivement mon compte
                  </button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;