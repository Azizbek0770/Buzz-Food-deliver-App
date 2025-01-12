# Buzz Restaurant

Online restoran buyurtma tizimi

## Texnologiyalar

### Frontend
- React.js
- Redux
- React Router
- Axios
- Material UI
- Jest/React Testing Library

### Backend
- Django
- Django REST Framework
- PostgreSQL
- Redis
- Celery
- Swagger/OpenAPI

## O'rnatish

1. Repositoryni clone qiling:
```bash
git clone https://github.com/yourusername/buzz-restaurant.git
cd buzz-restaurant
```

2. Backend uchun virtual environment yarating va dependencylarni o'rnating:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows
pip install -r requirements.txt
```

3. Frontend dependencylarini o'rnating:
```bash
cd frontend
npm install
```

4. Environment fayllarini sozlang:
```bash
# backend/.env
DEBUG=True
SECRET_KEY=your-secret-key
DATABASE_URL=postgresql://user:password@localhost:5432/buzz
REDIS_URL=redis://localhost:6379/0
SENTRY_DSN=your-sentry-dsn

# frontend/.env
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_SENTRY_DSN=your-sentry-dsn
```

5. Databaseni migrate qiling:
```bash
cd backend
python manage.py migrate
```

## Ishga tushirish

1. Backend serverni ishga tushiring:
```bash
cd backend
python manage.py runserver
```

2. Frontend development serverni ishga tushiring:
```bash
cd frontend
npm start
```

## Testlarni ishga tushirish

### Backend testlar:
```bash
cd backend
python manage.py test
```

### Frontend testlar:
```bash
cd frontend
npm test
```

## API Dokumentatsiya

API dokumentatsiyasini ko'rish uchun:
- Swagger UI: http://localhost:8000/swagger/
- ReDoc: http://localhost:8000/redoc/

## Monitoring

Loyihada quyidagi monitoring instrumentlari ishlatilgan:
- Sentry.io - Xatolarni kuzatish
- Prometheus - Metrikalarni yig'ish
- Grafana - Vizualizatsiya

## Deployment

Production muhitiga deploy qilish uchun qo'llanma:
1. Production environment variablelarini sozlang
2. Static fayllarni yig'ing
3. Database migratsiyalarini bajaring
4. Xavfsizlik sozlamalarini tekshiring
5. SSL sertifikatini o'rnating

## Litsenziya

MIT 