#!/usr/bin/env python
import os
import sys
from pathlib import Path

def main():
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Django topilmadi. Django o'rnatilganligiga ishonch hosil qiling."
        ) from exc
    execute_from_command_line(sys.argv)

if __name__ == '__main__':
    main() 