# ─────────────────────────────────────────────────────────────
# Stage: Single-stage build (static site — no compilation step)
# Base : Ubuntu 22.04 LTS + Apache 2.4
# ─────────────────────────────────────────────────────────────
FROM ubuntu:22.04

# ── Image Metadata ───────────────────────────────────────────
LABEL author="varun"
LABEL email="varun@srtechops.com"
LABEL version="1.0"
LABEL description="DevOps Portfolio — static site served by Apache2 on Ubuntu 22.04"

# ── Suppress debconf / apt interactive prompts ────────────────
ENV DEBIAN_FRONTEND=noninteractive
ENV APACHE_LOG_DIR=/var/log/apache2

# ── Install Apache2 ───────────────────────────────────────────
# --no-install-recommends keeps the image lean
# Clean apt lists immediately after install to reduce layer size
RUN apt-get update && \
    apt-get install -y --no-install-recommends apache2 && \
    rm -rf /var/lib/apt/lists/*

# ── Deploy Portfolio Files ────────────────────────────────────
# Remove Apache's default placeholder page first
RUN rm -f /var/www/html/index.html

# Copy all portfolio source files into the Apache document root
COPY . /var/www/html/

# ── Networking ───────────────────────────────────────────────
EXPOSE 80

# ── Startup Command ──────────────────────────────────────────
# Run Apache in foreground so the container stays alive
CMD ["apachectl", "-D", "FOREGROUND"]