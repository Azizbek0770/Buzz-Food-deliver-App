import os
import logging
from prometheus_client import Counter, Histogram
from sentry_sdk import capture_exception, capture_message, set_tag
from sentry_sdk.integrations.django import DjangoIntegration
from time import time

# Prometheus metrics
REQUEST_COUNT = Counter(
    'request_count_total',
    'Total request count by path and method',
    ['path', 'method']
)

REQUEST_LATENCY = Histogram(
    'request_latency_seconds',
    'Request latency by path and method',
    ['path', 'method']
)

DB_QUERY_LATENCY = Histogram(
    'db_query_latency_seconds',
    'Database query latency',
    ['query_type']
)

CACHE_HIT = Counter(
    'cache_hit_total',
    'Cache hit count by key pattern',
    ['pattern']
)

CACHE_MISS = Counter(
    'cache_miss_total',
    'Cache miss count by key pattern',
    ['pattern']
)

# Custom logger
logger = logging.getLogger('monitoring')

class MonitoringService:
    @staticmethod
    def track_request(path, method, duration):
        REQUEST_COUNT.labels(path=path, method=method).inc()
        REQUEST_LATENCY.labels(path=path, method=method).observe(duration)
        
        if duration > 1.0:  # Log slow requests
            logger.warning(f'Slow request: {method} {path} took {duration:.2f}s')
            capture_message(
                f'Slow request detected',
                level='warning',
                extras={
                    'path': path,
                    'method': method,
                    'duration': duration
                }
            )

    @staticmethod
    def track_db_query(query_type, duration):
        DB_QUERY_LATENCY.labels(query_type=query_type).observe(duration)
        
        if duration > 0.5:  # Log slow queries
            logger.warning(f'Slow DB query: {query_type} took {duration:.2f}s')

    @staticmethod
    def track_cache(key, hit):
        pattern = key.split(':')[0]
        if hit:
            CACHE_HIT.labels(pattern=pattern).inc()
        else:
            CACHE_MISS.labels(pattern=pattern).inc()

    @staticmethod
    def track_error(error, context=None):
        logger.error(f'Error occurred: {str(error)}', exc_info=error)
        
        if context:
            for key, value in context.items():
                set_tag(key, value)
        
        capture_exception(error)

    @staticmethod
    def track_business_event(event_type, data):
        logger.info(f'Business event: {event_type}', extra={'data': data})
        capture_message(
            f'Business event: {event_type}',
            level='info',
            extras=data
        )

class MetricsMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        import time
        start_time = time.time()
        
        response = self.get_response(request)
        
        duration = time.time() - start_time
        MonitoringService.track_request(
            path=request.path,
            method=request.method,
            duration=duration
        )
        
        return response

class DatabaseMetricsMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        from django.db import connection
        
        queries_before = len(connection.queries)
        start_time = time.time()
        
        response = self.get_response(request)
        
        duration = time.time() - start_time
        queries_after = len(connection.queries)
        
        if queries_after > queries_before:
            query_count = queries_after - queries_before
            query_time = duration / query_count
            MonitoringService.track_db_query('query', query_time)
        
        return response 