# Food Delivery Frontend

Bu loyiha React va Redux-Toolkit yordamida yaratilgan ovqat yetkazib berish tizimining frontend qismi.

## Texnologiyalar

- React 18
- Redux Toolkit
- React Router 6
- Tailwind CSS
- Jest & React Testing Library
- Axios

## O'rnatish

1. Loyihani clone qiling:
```bash
git clone https://github.com/username/food-delivery-frontend.git
cd food-delivery-frontend
```

2. Kerakli paketlarni o'rnating:
```bash
npm install
```

3. Development serverini ishga tushiring:
```bash
npm start
```

## Arxitektura

Loyiha quyidagi strukturaga ega:

```
src/
├── components/          # Umumiy komponentlar
│   ├── common/         # Qayta ishlatiladigan komponentlar
│   └── layout/         # Layout komponentlari
├── pages/              # Sahifa komponentlari
├── store/              # Redux store
│   ├── slices/        # Redux slicelar
│   └── index.js       # Store konfiguratsiyasi
├── services/          # API servislari
├── utils/             # Yordamchi funksiyalar
└── tests/             # Test fayllari
```

## Asosiy Funksionallik

### Foydalanuvchilar uchun:

1. **Autentifikatsiya**
   - Ro'yxatdan o'tish
   - Tizimga kirish
   - Profilni tahrirlash

2. **Restoranlar**
   - Restoranlar ro'yxati
   - Restoran ma'lumotlari
   - Menu ko'rish

3. **Buyurtma berish**
   - Savatga qo'shish
   - Buyurtmani rasmiylashtirish
   - To'lov qilish

4. **Buyurtmalar tarixi**
   - Faol buyurtmalar
   - Buyurtmalar tarixi
   - Buyurtma holatini kuzatish

### Restoranlar uchun:

1. **Menu boshqaruvi**
   - Taomlar qo'shish/o'zgartirish
   - Narxlarni o'zgartirish
   - Kategoriyalar boshqaruvi

2. **Buyurtmalar boshqaruvi**
   - Yangi buyurtmalarni ko'rish
   - Buyurtma holatini o'zgartirish
   - Yetkazib beruvchiga biriktirish

### Yetkazib beruvchilar uchun:

1. **Buyurtmalar**
   - Faol buyurtmalarni ko'rish
   - Buyurtmani qabul qilish
   - Yetkazib berish holatini yangilash

## API Integratsiya

Backend bilan bog'lanish `services/api.js` faylida konfiguratsiya qilingan. Barcha API so'rovlari JWT token orqali autentifikatsiya qilinadi.

### Asosiy API endpointlar:

```javascript
// Auth
POST /api/auth/register
POST /api/auth/login
PUT /api/auth/profile

// Restaurants
GET /api/restaurants
GET /api/restaurants/:id
GET /api/restaurants/:id/menu

// Orders
POST /api/orders
GET /api/orders
GET /api/orders/:id
PUT /api/orders/:id/status
```

## Test qilish

Testlarni ishga tushirish:

```bash
npm test
```

Coverage reportini olish:

```bash
npm test -- --coverage
```

## Performance Optimizatsiya

1. **Code Splitting**
   - React.lazy() orqali dinamik import
   - Route-based code splitting

2. **Caching**
   - Redux-persist orqali state caching
   - API response caching

3. **Image Optimization**
   - Lazy loading
   - WebP format
   - Responsive images

## Security

1. **Authentication**
   - JWT token
   - Refresh token rotation
   - XSS himoyasi

2. **Data Protection**
   - HTTPS
   - Input validation
   - CORS

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

MIT 