# 📚 Next.js App Router - Panduan Lengkap

## 🗂️ Struktur Folder = URL Structure

```
src/app/
├── page.js                    → "/"
├── about/
│   └── page.js               → "/about"
├── services/
│   └── page.js               → "/services"
├── products/
│   ├── page.js               → "/products"
│   └── [id]/
│       └── page.js           → "/products/123" (Dynamic Route)
└── blog/
    ├── page.js               → "/blog"
    └── [slug]/
        └── page.js           → "/blog/my-post" (Dynamic Route)
```

## 🎯 Routing Patterns

### 1. **Static Routes** (Halaman Tetap)
Buat folder → buat `page.js`

```
app/about/page.js  → /about
app/contact/page.js → /contact
```

### 2. **Dynamic Routes** (URL dengan Parameter)
Gunakan folder dengan bracket `[param]`

```
app/products/[id]/page.js  → /products/1, /products/2, dll
```

**Contoh penggunaan:**
```javascript
// app/products/[id]/page.js
export default function ProductPage({ params }) {
  return <div>Product ID: {params.id}</div>
}
```

### 3. **Catch-All Routes** (Multiple Segments)
Gunakan `[...slug]` untuk catch semua path

```
app/blog/[...slug]/page.js  → /blog/a, /blog/a/b, /blog/a/b/c
```

### 4. **Optional Catch-All**
Gunakan `[[...slug]]` dengan double bracket

```
app/shop/[[...slug]]/page.js  → /shop dan /shop/a/b/c
```

### 5. **Route Groups** (Organize tanpa URL)
Gunakan `(folder)` untuk grouping tanpa mempengaruhi URL

```
app/(marketing)/
  ├── about/page.js    → /about (bukan /marketing/about)
  └── contact/page.js  → /contact
```

### 6. **Parallel Routes** (Multiple Content)
Gunakan `@folder` untuk parallel rendering

```
app/@analytics/
app/@team/
app/layout.js  → Render kedua route secara parallel
```

## 📄 File Conventions

### `page.js` - Halaman yang di-render
```javascript
export default function Page() {
  return <div>Halaman</div>
}
```

### `layout.js` - Wrapper untuk halaman
```javascript
export default function Layout({ children }) {
  return (
    <div>
      <nav>Navigation</nav>
      {children}
      <footer>Footer</footer>
    </div>
  )
}
```

### `loading.js` - Loading UI
```javascript
export default function Loading() {
  return <div>Loading...</div>
}
```

### `error.js` - Error UI
```javascript
'use client'
export default function Error({ error, reset }) {
  return (
    <div>
      <h2>Error: {error.message}</h2>
      <button onClick={reset}>Try again</button>
    </div>
  )
}
```

### `not-found.js` - 404 Page
```javascript
export default function NotFound() {
  return <h1>Not Found</h1>
}
```

### `route.js` - API Route (Server/API Endpoint)
```javascript
export async function GET(request) {
  return Response.json({ data: 'Hello' })
}
```

## 🔗 Navigation

### Link Component (Client-side Navigation)
```javascript
import Link from 'next/link'

<Link href="/about">About</Link>
<Link href="/products/123">Product</Link>
```

### Programmatic Navigation
```javascript
'use client'
import { useRouter } from 'next/navigation'

export default function Button() {
  const router = useRouter()
  
  return (
    <button onClick={() => router.push('/about')}>
      Go to About
    </button>
  )
}
```

## 📊 Contoh Struktur Lengkap

```
src/app/
├── layout.js                 → Root layout
├── page.js                   → Homepage "/"
├── about/
│   └── page.js              → "/about"
├── services/
│   ├── layout.js            → Layout khusus services
│   ├── page.js              → "/services"
│   └── [id]/
│       └── page.js          → "/services/1"
├── blog/
│   ├── page.js              → "/blog"
│   └── [slug]/
│       └── page.js          → "/blog/my-post"
└── api/                     → API Routes
    └── users/
        └── route.js         → "/api/users"
```

## ⚡ Tips

1. **Setiap folder harus ada `page.js`** untuk menjadi route
2. **`layout.js` bersarang** - layout dalam folder membungkus halaman di dalamnya
3. **`page.js` unik** - hanya satu `page.js` per folder
4. **Gunakan 'use client'** jika perlu interaktivitas (hooks, events)
5. **Default Server Components** - tidak perlu 'use client' kecuali diperlukan

## 🚀 Quick Start

Untuk menambah halaman baru:
1. Buat folder di `src/app/`
2. Buat file `page.js` di dalam folder
3. URL otomatis tersedia!

Contoh:
```
mkdir -p src/app/team
echo "export default function Team() { return <div>Team Page</div> }" > src/app/team/page.js
```

Sekarang `/team` sudah bisa diakses! 🎉

