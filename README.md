# Prime HR — Employee Dashboard

**مصطفى حامد جسام**

لوحة احترافية لإدارة الموظفين مبنية بـ **Next.js 15** و **TypeScript** و **Tailwind CSS**.

> **موقع تقديمي:** لوحة العرض مفتوحة للجميع. تسجيل الدخول مطلوب فقط لإدارة الموظفين.

## المميزات

- **لوحة الموظفين** (`/`): عرض بطاقات، إحصائيات، رسم بياني، بحث وتصفية وترقيم صفحات
- **لوحة الإدارة** (`/admin`): إضافة، تعديل، وحذف الموظفين
- **تسجيل دخول محمي** مع حد لمحاولات الدخول
- **تحقق من البيانات** على الواجهة والسيرفر (Zod)
- **إشعارات نجاح/فشل** بعد العمليات
- **واجهة عربية RTL** مع خط Noto Sans Arabic
- **إمكانية وصول**: تسميات مرتبطة، تركيز في النوافذ، تخطي للمحتوى
- **صفحات خطأ وتحميل** مخصصة

## التشغيل المحلي

```bash
npm install
npm run dev
```

افتح [http://localhost:3000](http://localhost:3000)

| المسار | الوصف |
|--------|--------|
| `/` | لوحة عرض الموظفين (مفتوحة) |
| `/login` | تسجيل الدخول للإدارة |
| `/admin` | إدارة الموظفين (محمية) |

### متغيرات البيئة

انسخ `.env.example` إلى `.env.local`:

```env
AUTH_SECRET=مفتاح-سري-عشوائي-طويل
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```

| المتغير | الغرض |
|---------|--------|
| `ADMIN_USERNAME` / `ADMIN_PASSWORD` | بيانات دخول لوحة الإدارة |
| `AUTH_SECRET` | توقيع جلسة تسجيل الدخول (اختياري محلياً) |

## الاختبارات

```bash
npm test
```

## قاعدة البيانات (MongoDB)

المشروع يستخدم **MongoDB** لتخزين بيانات الموظفين.

### الإعداد لأول مرة

1. أنشئ قاعدة بيانات MongoDB:
   - **محلياً:** ثبّت [MongoDB Community](https://www.mongodb.com/try/download/community)
   - **أو سحابياً:** أنشئ cluster مجاني على [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

2. انسخ `.env.example` إلى `.env.local` وضع رابط الاتصال:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/employee_dashboard
```

3. عبّئ البيانات الأولية:

```bash
npm run db:seed
```

| الأمر | الوظيفة |
|-------|---------|
| `npm run db:seed` | تحميل الموظفين من `employees.json` إلى MongoDB |

البيانات الأولية موجودة في `src/data/employees.json`.

## النشر (Vercel)

1. ارفع المشروع إلى GitHub
2. اربطه بـ [Vercel](https://vercel.com)
3. أضف متغيرات البيئة في إعدادات المشروع:
   - `AUTH_SECRET` — سلسلة عشوائية طويلة
   - `ADMIN_USERNAME`
   - `ADMIN_PASSWORD`
4. انشر المشروع

**مهم على Windows / OneDrive:** لا تشغّل `npm run dev` و `npm run build` معاً.

```bash
# 1) أوقف السيرفر أولاً (Ctrl + C في التيرمنال)
# 2) إذا فشل البناء، احذف مجلد .next ثم أعد المحاولة
npm run build
npm start
```

للتطوير اليومي استخدم `npm run dev` فقط — لا تحتاج `npm start`.

## التقنيات

- Next.js App Router
- TypeScript
- Tailwind CSS
- Zod (التحقق)
- Vitest (الاختبارات)
- Lucide Icons
