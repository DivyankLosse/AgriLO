import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const stats = [
    { label: 'Farmers guided', value: '50K+' },
    { label: 'Scans completed', value: '1.2M' },
    { label: 'Crop types covered', value: '50+' },
    { label: 'Insight accuracy', value: '98%' },
];

const features = [
    {
        icon: 'photo_camera',
        title: 'Instant crop diagnosis',
        description: 'Upload a plant image and get fast, easy-to-understand disease detection with treatment guidance.',
    },
    {
        icon: 'sensors',
        title: 'Live soil awareness',
        description: 'Track moisture, pH, temperature, and nutrient health in one calm, readable experience.',
    },
    {
        icon: 'forum',
        title: 'Guidance in your language',
        description: 'Get practical help for real farming problems with support that feels personal and direct.',
    },
];

const workflow = [
    {
        step: '01',
        title: 'Scan or measure',
        description: 'Take a crop photo or capture field readings from your soil sensors.',
    },
    {
        step: '02',
        title: 'Understand the problem',
        description: 'Agri-Lo organizes the signals and highlights what matters now.',
    },
    {
        step: '03',
        title: 'Act with confidence',
        description: 'Follow clear next steps for irrigation, treatment, and field planning.',
    },
];

const trustCards = [
    {
        title: 'Disease Detection',
        note: 'Leaf and root health analysis with treatment-ready recommendations.',
    },
    {
        title: 'Soil Reports',
        note: 'Readable field intelligence built from moisture, pH, NPK, and temperature.',
    },
    {
        title: 'Farmer Support',
        note: 'Friendly AI assistance for crop care, questions, and next-best actions.',
    },
];

const LandingPage = () => {
    const { language, changeLanguage } = useLanguage();

    return (
        <div className="min-h-screen overflow-hidden bg-[#f5efe2] text-slate-950">
            <div className="relative">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(22,163,74,0.16),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(245,158,11,0.16),_transparent_28%),linear-gradient(180deg,_#efe7d6_0%,_#f8f5ee_42%,_#fffdf9_100%)]" />
                <div className="absolute left-[-8rem] top-24 h-72 w-72 rounded-full bg-emerald-200/40 blur-3xl" />
                <div className="absolute right-[-6rem] top-16 h-64 w-64 rounded-full bg-amber-200/40 blur-3xl" />

                <header className="relative z-10">
                    <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 md:px-8">
                        <Link to="/" className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-lime-300 shadow-[0_16px_35px_rgba(15,23,42,0.18)]">
                                <span className="material-symbols-outlined text-[28px]">spa</span>
                            </div>
                            <div>
                                <p className="text-xs font-black uppercase tracking-[0.34em] text-emerald-700">Agri-Lo</p>
                                <p className="text-sm text-slate-600">Smart farming companion</p>
                            </div>
                        </Link>

                        <div className="hidden items-center gap-3 md:flex">
                            <select
                                aria-label="Language Selector"
                                value={language}
                                onChange={(event) => changeLanguage(event.target.value)}
                                className="rounded-full border border-slate-900/10 bg-white/80 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm outline-none backdrop-blur transition hover:border-emerald-500"
                            >
                                <option value="en">English</option>
                                <option value="hi">Hindi</option>
                                <option value="mr">Marathi</option>
                            </select>
                            <Link
                                to="/auth"
                                className="rounded-full border border-slate-950/10 bg-white/90 px-4 py-2.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:border-amber-500"
                            >
                                Sign In
                            </Link>
                            <Link
                                to="/auth"
                                className="rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_18px_35px_rgba(5,150,105,0.28)] transition hover:-translate-y-0.5 hover:bg-emerald-700"
                            >
                                Get Started
                            </Link>
                        </div>
                    </div>
                </header>

                <main className="relative z-10">
                    <section className="mx-auto grid max-w-7xl gap-10 px-4 pb-12 pt-8 md:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:pb-18 lg:pt-12">
                        <div className="space-y-8">
                            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-900/10 bg-white/75 px-4 py-2 text-sm font-semibold text-emerald-800 shadow-sm backdrop-blur">
                                <span className="material-symbols-outlined text-[18px]">eco</span>
                                Better crop decisions, without the guesswork
                            </div>

                            <div className="space-y-5">
                                <h1 className="max-w-3xl text-5xl font-black leading-[0.93] tracking-[-0.05em] text-slate-950 md:text-6xl xl:text-7xl">
                                    Farming intelligence that feels clear, calm, and instantly useful.
                                </h1>
                                <p className="max-w-2xl text-lg leading-8 text-slate-600 md:text-xl">
                                    Detect crop disease, understand soil health, and get practical guidance in one beautifully simple experience built around real field decisions.
                                </p>
                            </div>

                            <div className="flex flex-col gap-3 sm:flex-row">
                                <Link
                                    to="/auth"
                                    className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-6 py-4 text-base font-bold text-white shadow-[0_22px_40px_rgba(15,23,42,0.24)] transition hover:-translate-y-0.5 hover:bg-emerald-700"
                                >
                                    Start your farming journey
                                    <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                                </Link>
                                <Link
                                    to="/auth"
                                    className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-950/10 bg-white px-6 py-4 text-base font-bold text-slate-800 shadow-[0_18px_35px_rgba(15,23,42,0.08)] transition hover:-translate-y-0.5 hover:border-amber-500 hover:text-amber-700"
                                >
                                    Sign in to continue
                                    <span className="material-symbols-outlined text-[20px]">login</span>
                                </Link>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-4">
                                {stats.map((stat) => (
                                    <div key={stat.label} className="rounded-[1.5rem] border border-white/70 bg-white/80 p-4 shadow-[0_18px_40px_rgba(15,23,42,0.07)] backdrop-blur">
                                        <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-500">{stat.label}</p>
                                        <p className="mt-2 text-3xl font-black tracking-[-0.04em] text-slate-950">{stat.value}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="relative">
                            <div className="absolute -left-8 top-8 hidden h-44 w-44 rounded-full bg-emerald-300/30 blur-3xl lg:block" />
                            <div className="absolute -right-8 bottom-8 hidden h-44 w-44 rounded-full bg-amber-300/30 blur-3xl lg:block" />

                            <div className="relative overflow-hidden rounded-[2.25rem] border border-slate-950/10 bg-slate-950 p-5 text-white shadow-[0_30px_80px_rgba(15,23,42,0.28)]">
                                <div className="absolute inset-0 bg-[linear-gradient(140deg,_rgba(16,185,129,0.18),_transparent_35%,_rgba(245,158,11,0.16)_100%)]" />
                                <div className="relative space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-xs font-bold uppercase tracking-[0.3em] text-lime-300">Today in your field</p>
                                            <h2 className="mt-2 text-2xl font-bold">Healthy growth outlook</h2>
                                        </div>
                                        <div className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-lime-200">
                                            Stable
                                        </div>
                                    </div>

                                    <div className="grid gap-4 rounded-[1.7rem] bg-white/8 p-4 md:grid-cols-[1.08fr_0.92fr]">
                                        <div className="min-h-[340px] rounded-[1.5rem] border border-white/10 bg-[url('https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center">
                                            <div className="flex h-full flex-col justify-between bg-[linear-gradient(180deg,_rgba(15,23,42,0.04),_rgba(15,23,42,0.72))] p-5">
                                                <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.28em] text-white/75">
                                                    <span>Morning summary</span>
                                                    <span>Tomato plot</span>
                                                </div>
                                                <div className="rounded-[1.4rem] bg-white/12 p-4 backdrop-blur">
                                                    <p className="text-xs uppercase tracking-[0.28em] text-lime-200">Field status</p>
                                                    <p className="mt-2 text-2xl font-bold">Crops look balanced and active</p>
                                                    <p className="mt-2 text-sm leading-6 text-white/75">
                                                        Moisture, plant condition, and nutrient readings suggest a steady growth cycle with no urgent disease signals.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="rounded-[1.4rem] bg-white px-5 py-4 text-slate-950">
                                                <p className="text-xs font-bold uppercase tracking-[0.28em] text-emerald-700">Field indicators</p>
                                                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                                                    <div className="rounded-2xl bg-emerald-50 p-3">
                                                        <p className="text-slate-500">Moisture</p>
                                                        <p className="mt-1 text-2xl font-black">68%</p>
                                                    </div>
                                                    <div className="rounded-2xl bg-amber-50 p-3">
                                                        <p className="text-slate-500">pH</p>
                                                        <p className="mt-1 text-2xl font-black">6.7</p>
                                                    </div>
                                                    <div className="rounded-2xl bg-lime-50 p-3">
                                                        <p className="text-slate-500">Nitrogen</p>
                                                        <p className="mt-1 text-2xl font-black">112</p>
                                                    </div>
                                                    <div className="rounded-2xl bg-sky-50 p-3">
                                                        <p className="text-slate-500">Temp</p>
                                                        <p className="mt-1 text-2xl font-black">27C</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="rounded-[1.4rem] border border-white/10 bg-white/8 p-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-lime-300 text-slate-950">
                                                        <span className="material-symbols-outlined">psychology</span>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-bold uppercase tracking-[0.28em] text-white/60">Suggested next step</p>
                                                        <p className="text-lg font-bold">Maintain irrigation rhythm</p>
                                                    </div>
                                                </div>
                                                <p className="mt-4 text-sm leading-7 text-white/75">
                                                    Continue routine scanning this week and keep soil moisture steady to preserve healthy root activity.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="mx-auto max-w-7xl px-4 py-10 md:px-8">
                        <div className="grid gap-5 md:grid-cols-3">
                            {features.map((feature) => (
                                <div
                                    key={feature.title}
                                    className="rounded-[1.9rem] border border-slate-950/8 bg-white/85 p-7 shadow-[0_22px_45px_rgba(15,23,42,0.08)] backdrop-blur transition hover:-translate-y-1 hover:shadow-[0_28px_55px_rgba(15,23,42,0.12)]"
                                >
                                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-950 text-lime-300">
                                        <span className="material-symbols-outlined text-[26px]">{feature.icon}</span>
                                    </div>
                                    <h3 className="mt-5 text-2xl font-bold tracking-[-0.03em] text-slate-950">{feature.title}</h3>
                                    <p className="mt-3 text-base leading-7 text-slate-600">{feature.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="mx-auto max-w-7xl px-4 py-12 md:px-8">
                        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
                            <div className="space-y-5">
                                <p className="text-sm font-black uppercase tracking-[0.32em] text-emerald-700">How Agri-Lo helps</p>
                                <h2 className="max-w-xl text-4xl font-black tracking-[-0.04em] text-slate-950 md:text-5xl">
                                    Everything important is visible at a glance, without feeling overwhelming.
                                </h2>
                                <p className="max-w-xl text-lg leading-8 text-slate-600">
                                    The experience is designed to reduce stress for the farmer. It brings together crop scans, soil condition, and support in a way that feels focused instead of noisy.
                                </p>
                            </div>

                            <div className="grid gap-4 md:grid-cols-3">
                                {trustCards.map((card) => (
                                    <div key={card.title} className="rounded-[1.8rem] bg-[#fffaf0] p-6 ring-1 ring-slate-900/6">
                                        <p className="text-sm font-black uppercase tracking-[0.24em] text-amber-700">{card.title}</p>
                                        <p className="mt-4 text-base leading-7 text-slate-600">{card.note}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    <section className="mx-auto max-w-7xl px-4 py-6 md:px-8">
                        <div className="rounded-[2.4rem] bg-slate-950 px-6 py-10 text-white shadow-[0_30px_80px_rgba(15,23,42,0.24)] md:px-10">
                            <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
                                <div className="space-y-4">
                                    <p className="text-sm font-black uppercase tracking-[0.32em] text-lime-300">A simple rhythm</p>
                                    <h2 className="text-4xl font-black tracking-[-0.04em]">From uncertainty to action in three steps.</h2>
                                    <p className="text-base leading-8 text-white/72">
                                        The product stays useful because every screen is designed to move the farmer toward a clear next choice.
                                    </p>
                                </div>

                                <div className="grid gap-4 md:grid-cols-3">
                                    {workflow.map((item) => (
                                        <div key={item.step} className="rounded-[1.6rem] border border-white/10 bg-white/8 p-5 backdrop-blur">
                                            <p className="text-sm font-black tracking-[0.26em] text-amber-300">{item.step}</p>
                                            <h3 className="mt-4 text-xl font-bold">{item.title}</h3>
                                            <p className="mt-3 text-sm leading-7 text-white/72">{item.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
                        <div className="overflow-hidden rounded-[2.5rem] border border-slate-950/8 bg-[linear-gradient(135deg,_#1f2937_0%,_#14532d_55%,_#16301f_100%)] px-6 py-12 text-white shadow-[0_28px_70px_rgba(15,23,42,0.20)] md:px-10">
                            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
                                <div className="space-y-4">
                                    <p className="text-sm font-black uppercase tracking-[0.32em] text-lime-300">Ready when you are</p>
                                    <h2 className="max-w-3xl text-4xl font-black tracking-[-0.04em] md:text-5xl">
                                        Give your farm a decision system that feels modern, reliable, and easy to return to every day.
                                    </h2>
                                    <p className="max-w-2xl text-lg leading-8 text-white/72">
                                        Agri-Lo helps you notice problems earlier, understand field conditions faster, and move with more confidence.
                                    </p>
                                </div>

                                <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                                    <Link
                                        to="/auth"
                                        className="inline-flex items-center justify-center gap-2 rounded-full bg-lime-300 px-6 py-4 text-base font-bold text-slate-950 transition hover:-translate-y-0.5 hover:bg-lime-200"
                                    >
                                        Create your account
                                        <span className="material-symbols-outlined text-[20px]">north_east</span>
                                    </Link>
                                    <Link
                                        to="/auth"
                                        className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/8 px-6 py-4 text-base font-bold text-white transition hover:-translate-y-0.5 hover:bg-white/14"
                                    >
                                        Sign in
                                        <span className="material-symbols-outlined text-[20px]">login</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>

                <footer className="border-t border-slate-950/8 bg-white/80 backdrop-blur">
                    <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 md:flex-row md:items-center md:justify-between md:px-8">
                        <div>
                            <p className="text-sm font-black uppercase tracking-[0.28em] text-slate-900">Agri-Lo</p>
                            <p className="mt-1 text-sm text-slate-600">Crop care, soil awareness, and farmer-first guidance in one place.</p>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <Link to="/auth" className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700">
                                Get Started
                            </Link>
                            <Link to="/auth" className="rounded-full border border-slate-950/10 bg-white px-4 py-2 text-sm font-semibold text-slate-800 transition hover:border-amber-500">
                                Sign In
                            </Link>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default LandingPage;
