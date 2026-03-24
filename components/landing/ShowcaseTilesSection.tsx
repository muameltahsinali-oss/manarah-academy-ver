"use client";

import { motion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { ArrowUpRight, BarChart3, LayoutDashboard, PlayCircle, ShieldCheck, Sparkles } from "lucide-react";

const tileMotion = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] as const },
};

function AnimatedGradientBackdrop({ variant = "primary" }: { variant?: "primary" | "accent" | "mix" }) {
  const base =
    variant === "primary"
      ? "from-primary/35 via-primary/10 to-transparent"
      : variant === "accent"
        ? "from-accent/35 via-accent/10 to-transparent"
        : "from-primary/30 via-accent/20 to-transparent";

  return (
    <motion.div
      aria-hidden
      className={`absolute inset-0 bg-gradient-to-tr ${base}`}
      style={{ backgroundSize: "160% 160%" }}
      animate={{ backgroundPosition: ["0% 0%", "100% 50%", "0% 0%"] }}
      transition={{ duration: 10, ease: "easeInOut", repeat: Infinity }}
    />
  );
}

function MiniChart() {
  return (
    <div className="relative w-full rounded-[4px] border border-border/60 bg-white p-4 overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-[4px] bg-accent/10 flex items-center justify-center">
            <BarChart3 className="w-4 h-4 text-accent" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-text/50">تحليلات</span>
            <span className="text-xs font-bold text-text">نشاط التعلم</span>
          </div>
        </div>
        <span className="text-[10px] font-mono text-text/40">آخر 7 أيام</span>
      </div>

      <div className="grid grid-cols-14 gap-1 items-end h-20">
        {Array.from({ length: 14 }).map((_, i) => {
          const h = [22, 34, 18, 42, 58, 36, 28, 64, 52, 40, 70, 44, 32, 60][i] ?? 30;
          return (
            <motion.div
              key={i}
              className="rounded-[2px] bg-primary/25"
              initial={{ height: 6, opacity: 0.6 }}
              animate={{ height: [6, h, Math.max(10, h - 10), h], opacity: [0.6, 1, 0.85, 1] }}
              transition={{ duration: 2.6, ease: "easeInOut", repeat: Infinity, delay: i * 0.05 }}
              style={{ width: "100%" }}
            />
          );
        })}
      </div>

      <div className="mt-4 flex items-center justify-between text-[10px] font-mono text-text/50">
        <span>معدل الإكمال</span>
        <span className="text-primary font-bold">+18%</span>
      </div>
    </div>
  );
}

function MiniCheckoutMock() {
  return (
    <div className="relative w-full rounded-[4px] border border-border/60 bg-white p-4 overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-[4px] bg-primary/10 flex items-center justify-center">
            <ShieldCheck className="w-4 h-4 text-primary" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-text/50">الاشتراك</span>
            <span className="text-xs font-bold text-text">دفع آمن</span>
          </div>
        </div>
        <span className="text-[10px] font-mono text-text/40">SSL</span>
      </div>

      <div className="space-y-3">
        <div className="h-9 rounded-[4px] bg-background border border-border/60 flex items-center px-3 text-xs text-text/50">
          البريد الإلكتروني
        </div>
        <div className="h-9 rounded-[4px] bg-background border border-border/60 flex items-center px-3 text-xs text-text/50">
          وسيلة الدفع
        </div>
        <div className="flex items-center gap-2">
          <div className="flex-1 h-9 rounded-[4px] bg-background border border-border/60" />
          <div className="w-16 h-9 rounded-[4px] bg-background border border-border/60" />
        </div>
        <motion.div
          className="h-10 rounded-[4px] bg-primary text-white text-xs font-bold flex items-center justify-center"
          animate={{ boxShadow: ["0 0 0 rgba(0,0,0,0)", "0 10px 30px rgba(255,107,87,0.25)", "0 0 0 rgba(0,0,0,0)"] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        >
          ابدأ الآن
        </motion.div>
      </div>
    </div>
  );
}

function MiniPlayerMock() {
  return (
    <div className="relative w-full rounded-[4px] border border-border/60 bg-white overflow-hidden">
      <div className="relative aspect-[16/10] bg-black">
        <AnimatedGradientBackdrop variant="mix" />
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center"
            animate={{ scale: [1, 1.06, 1] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          >
            <PlayCircle className="w-8 h-8 text-primary" />
          </motion.div>
        </div>
        <div className="absolute top-3 left-3 flex gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="w-2 h-2 rounded-full bg-amber-400" />
          <span className="w-2 h-2 rounded-full bg-rose-400" />
        </div>
      </div>
      <div className="p-4 border-t border-border/70">
        <div className="flex items-center justify-between text-[10px] font-mono text-text/50 uppercase tracking-widest">
          <span>التقدم</span>
          <span className="text-primary font-bold">72%</span>
        </div>
        <div className="mt-2 h-1.5 rounded-full bg-border/60 overflow-hidden">
          <motion.div
            className="h-full bg-primary"
            initial={{ width: "20%" }}
            animate={{ width: ["20%", "72%", "20%"] }}
            transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </div>
    </div>
  );
}

function Tile({
  title,
  description,
  icon: Icon,
  variant,
  children,
}: {
  title: string;
  description: string;
  icon: any;
  variant: "primary" | "accent" | "mix";
  children: React.ReactNode;
}) {
  return (
    <motion.div
      {...tileMotion}
      className="group relative rounded-[4px] border border-border/80 bg-white overflow-hidden hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10 transition-all"
    >
      <div className="absolute inset-0">
        <AnimatedGradientBackdrop variant={variant} />
      </div>

      <div className="relative p-5 md:p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-[4px] bg-white/80 border border-border/60 flex items-center justify-center">
              <Icon className="w-5 h-5 text-primary" />
            </div>
            <div className="flex flex-col">
              <div className="text-sm font-bold text-text leading-tight">{title}</div>
              <div className="text-xs text-text/60 leading-relaxed mt-1 max-w-[32ch]">{description}</div>
            </div>
          </div>

          <div className="w-9 h-9 rounded-[4px] bg-white/80 border border-border/60 flex items-center justify-center text-text/40 group-hover:text-primary transition-colors">
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </div>

        {children}
      </div>
    </motion.div>
  );
}

export function ShowcaseTilesSection() {
  return (
    <Section spacing="xl" className="bg-background border-b border-border overflow-hidden">
      <Container>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <p className="text-[10px] font-mono font-bold text-primary uppercase tracking-widest mb-3">
              نظرة على المنتج
            </p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-text">
              تجربة تعلّم مبنية كمنتج.
            </h2>
          </div>
          <p className="text-sm text-text/60 max-w-xl leading-relaxed">
            بطاقات حيّة توضح كيف تتحول الدروس إلى تقدّم قابل للقياس: مشغّل، تحليلات، واشتراك آمن — كل شيء
            مصمم ليكون واضحاً وسريعاً.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
          <div className="lg:col-span-7">
            <Tile
              title="مشغّل الدروس + وضع التركيز"
              description="اعرض الدرس، تابع التقدّم، وتنقّل بين الوحدات بدون تشتيت."
              icon={PlayCircle}
              variant="mix"
            >
              <MiniPlayerMock />
            </Tile>
          </div>

          <div className="lg:col-span-5 grid grid-cols-1 gap-4 md:gap-6">
            <Tile
              title="تحليلات تقدّم قابلة للتنفيذ"
              description="مؤشرات أسبوعية تساعدك على الاستمرار ومعرفة ما تغيّر فعلاً."
              icon={BarChart3}
              variant="accent"
            >
              <MiniChart />
            </Tile>

            <Tile
              title="اشتراك ودفع آمن"
              description="إجراءات دفع واضحة، وبنية جاهزة للترقية إلى بوابات دفع كاملة."
              icon={ShieldCheck}
              variant="primary"
            >
              <MiniCheckoutMock />
            </Tile>
          </div>

          <div className="lg:col-span-4">
            <Tile
              title="لوحة الطالب"
              description="مسارات، شهادات، وأوسمة — من شاشة واحدة."
              icon={LayoutDashboard}
              variant="primary"
            >
              <div className="rounded-[4px] border border-border/60 bg-white p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-text/50">ملخص</span>
                  <span className="text-[10px] font-mono text-text/40">هذا الأسبوع</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: "ساعات", value: "6.5" },
                    { label: "وحدات", value: "3" },
                    { label: "شهادات", value: "1" },
                  ].map((k) => (
                    <div
                      key={k.label}
                      className="rounded-[4px] bg-background border border-border/60 p-3 text-center"
                    >
                      <div className="text-lg font-bold font-mono text-primary">{k.value}</div>
                      <div className="text-[10px] font-mono text-text/50 uppercase tracking-widest">{k.label}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-[4px] bg-accent/10 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-accent" />
                  </div>
                  <div className="text-xs text-text/70 font-medium">
                    شارة جديدة عند اكتمال وحدة رئيسية.
                  </div>
                </div>
              </div>
            </Tile>
          </div>

          <div className="lg:col-span-8">
            <Tile
              title="لوحة المدرّب"
              description="تابع الإكمال، الطلاب، والنتائج لكل دورة."
              icon={LayoutDashboard}
              variant="accent"
            >
              <div className="rounded-[4px] border border-border/60 bg-white p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-text/50">الدورات</span>
                  <span className="text-[10px] font-mono text-text/40">آخر 30 يوم</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { label: "طلاب", value: "1,248" },
                    { label: "إكمال", value: "68%" },
                    { label: "إيراد", value: "$3.2k" },
                  ].map((k, idx) => (
                    <motion.div
                      key={k.label}
                      className="rounded-[4px] bg-background border border-border/60 p-4"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.15 + idx * 0.08 }}
                    >
                      <div className="text-[10px] font-mono text-text/50 uppercase tracking-widest mb-1">{k.label}</div>
                      <div className="text-xl font-bold font-mono text-text">{k.value}</div>
                      <div className="mt-2 h-1.5 rounded-full bg-border/60 overflow-hidden">
                        <div className="h-full bg-accent" style={{ width: idx === 0 ? "80%" : idx === 1 ? "68%" : "55%" }} />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </Tile>
          </div>
        </div>
      </Container>
    </Section>
  );
}

