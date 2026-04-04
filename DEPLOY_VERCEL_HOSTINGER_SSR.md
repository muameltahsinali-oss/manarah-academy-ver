# نشر المنصّة: Vercel (فرونت SSR) + Hostinger (باكند Laravel)

## عنوان الـ API (Hostinger) — مشروعك

| البند | القيمة |
|--------|--------|
| **نطاق الـ API** | `api.manarah-academy.com` |
| **Base URL للـ API** | `https://api.manarah-academy.com` |
| **مسار الـ API في الفرونت** | `https://api.manarah-academy.com/api` |

هذا الدليل يفترض:

- **الواجهة:** Next.js **بدون** تصدير ثابت (`output: "export"` مُزال) — تشغيل **SSR** على **Vercel**.
- **الـ API:** Laravel على **Hostinger** على **`https://api.manarah-academy.com`**.

---

## 1) ترتيب العمل

1. ارفع واضبط **الباكند** أولاً واختبره على HTTPS.
2. ثم اربط **Vercel** وحدّد متغيرات البيئة (خصوصاً `NEXT_PUBLIC_API_URL`).
3. ثم اربط **الدومين** للواجهة وحدّث `FRONTEND_URL` في Laravel.

---

## 2) الباكند (Laravel) على Hostinger

### 2.1 هيكل النطاقات (مُوصى به)

| الخدمة | مثال |
|--------|------|
| الواجهة | `https://manarah-academy.com` (Vercel) |
| الـ API | `https://api.manarah-academy.com` (Hostinger → مجلد `public` لـ Laravel) |

### 2.2 متغيرات `.env` (إنتاج)

راجع `backend/.env.example` واملأ على الأقل:

- `APP_ENV=production`
- `APP_DEBUG=false`
- `APP_KEY=` (من `php artisan key:generate`)
- `APP_URL=https://api.manarah-academy.com` — **يجب أن يطابق** عنوان الـ API العام على Hostinger.
- `FRONTEND_URL=https://manarah-academy.com` — أو **رابط Vercel المؤقت** (مثل `https://اسم-المشروع.vercel.app`) إلى أن تربط الدومين الرئيسي؛ يجب أن يطابق **بالضبط** أصل المتصفح عند فتح الموقع (بروتوكول + نطاق، بدون `/` زائدة في النهاية عادة).
- قاعدة البيانات: `DB_*`
- `SANCTUM_STATEFUL_DOMAINS=` نطاق الواجهة فقط، مثال: `manarah-academy.com,www.manarah-academy.com`
- `SESSION_DOMAIN=` حسب احتياج الكوكيز عبر الساب دومينات، غالباً `.manarah-academy.com`

### 2.3 CORS

في `backend/config/cors.php` الحقل:

`allowed_origins` يأخذ `FRONTEND_URL`.

تأكد أن قيمة `FRONTEND_URL` **بالضبط** مثل أصل المتصفح للواجهة (مثلاً `https://xxx.vercel.app` أو `https://yourdomain.com`).

### 2.4 خطوات على السيرفر

- `composer install --no-dev --optimize-autoloader`
- `php artisan migrate --force` (بعد نسخة احتياطية)
- `php artisan storage:link`
- صلاحيات `storage/` و `bootstrap/cache/`
- PHP **8.2+** والامتدادات المعتادة (openssl, pdo_mysql, mbstring, …)
- تفعيل **SSL** لنطاق الـ API

### 2.5 اختبار

من المتصفح أو Postman:

`GET https://api.manarah-academy.com/api/courses` (أو أي مسار عام) يجب أن يعيد JSON بدون خطأ.

---

## 3) الفرونت (Next.js SSR) على Vercel

### 3.1 إعداد المشروع في Vercel

- **Framework Preset:** Next.js
- **Root Directory:** اتركه فارغاً (هذا المستودع = Next.js في الجذر فقط).
- **Build Command:** `npm run build` (الافتراضي عادة كافٍ).
- **Output Directory:** **اتركه فارغاً / الافتراضي** — لا تستخدم `out` (ذلك كان لتصدير ثابت فقط).

مع **SSR**، Vercel يبني مشروع Next العادي ويُخرج إلى `.next` وليس مجلد `out/`.

### 3.2 متغيرات البيئة في Vercel

أضف في **Settings → Environment Variables** (لـ Production على الأقل):

| المتغير | القيمة لمشروعك |
|---------|----------------|
| `NEXT_PUBLIC_API_URL` | `https://api.manarah-academy.com/api` | يجب أن ينتهي بـ `/api` ليتوافق مع `lib/api.ts`. |
| `NEXT_PUBLIC_IMAGE_API_HOSTNAME` | `api.manarah-academy.com` | اختياري إذا أردت التصريح صراحة؛ الافتراضي في `next.config.ts` هو نفس المضيف. |

أعد نشر المشروع بعد حفظ المتغيرات لأن `NEXT_PUBLIC_*` تُدمج عند البناء.

### 3.3 الدومين المخصص

- من Vercel: أضف الدومين واتبع تعليمات DNS.
- حدّث **`FRONTEND_URL`** في Laravel ليطابق الدومين الجديد للواجهة.

### 3.4 الفرق عن التصدير الثابت

- **لا** ترفع مجلد `out/` إلى استضافة مشتركة للواجهة — الواجهة تُستضاف على Vercel بالكامل.
- لا حاجة لـ `output: "export"` في `next.config.ts` (مُزال في المشروع الحالي).

---

## 4) الصور و `next/image`

بعد التحويل لـ SSR، يمكن استخدام **تحسين الصور** الافتراضي في Vercel (تمت إزالة `unoptimized: true` من الإعداد).

تأكد أن `remotePatterns` في `next.config.ts` يشمل مضيف الـ API لمسار `/storage/**`.

---

## 5) المسارات الديناميكية

تمت إزالة `generateStaticParams` من مسارات مثل `/courses/[slug]` و `/learn/...` حتى تُولَّد **عند الطلب** (SSR) ولا يعتمد البناء على توفر الـ API لكل الـ slugs مسبقاً.

ملف `lib/static-export-paths.ts` بقي كمساعد اختياري (سكربتات، خريطة موقع) وليس شرطاً لبناء الصفحات.

---

## 6) قائمة تحقق سريعة قبل الإطلاق

- [ ] الـ API يعمل على HTTPS
- [ ] `FRONTEND_URL` في Laravel = أصل الواجهة الفعلي
- [ ] `NEXT_PUBLIC_API_URL` في Vercel = `https://api.manarah-academy.com/api`
- [ ] لا أخطاء CORS في وحدة تحكم المتصفح عند تسجيل الدخول أو طلبات الـ API
- [ ] `php artisan config:cache` بعد تعديل `.env` على السيرفر (إن استخدمتم الكاش)

---

## 7) مراجع داخل المستودع

- مثال متغيرات الواجهة: `.env.production.example`
- مثال باكند إنتاج: راجع مستودع الباكند / `backend/.env.example`

للاستفسارات عن Hostinger تحديداً (إصدار PHP، مسار `public`، قواعد البيانات)، راجع وثائق Hostinger لاستضافة Laravel الحالية لديك.
