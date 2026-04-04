# نشر الواجهة (Next.js)

## الوضع الحالي: SSR على Vercel

المشروع يُبنى كـ **Next.js عادي** (بدون `output: "export"`). الاستضافة الموصى بها للواجهة: **Vercel** مع بناء افتراضي (مجلد `.next`، وليس `out/`).

**دليل النشر الكامل (Vercel + Hostinger للباكند):** [`DEPLOY_VERCEL_HOSTINGER_SSR.md`](./DEPLOY_VERCEL_HOSTINGER_SSR.md)

## متغيرات البيئة

```bash
cp .env.production.example .env.production
```

- `NEXT_PUBLIC_API_URL` — عنوان Laravel API، مثل `https://api.example.com/api`

## بناء محلي

```bash
npm ci
npm run build
npm run start
```

---

## نشر ثابت سابق (`out/`)

إذا احتجت لاحقاً **تصدير HTML ثابت** لاستضافة مشتركة، أعد تفعيل `output: "export"` في `next.config.ts` وأعد إضافة `generateStaticParams` حيث يلزم — هذا غير مطلوب لـ Vercel SSR.
