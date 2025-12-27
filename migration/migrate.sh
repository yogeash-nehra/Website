#!/bin/bash

BASE_URL="https://wgholdings.co.nz/blog"

wget \
  --mirror \
  --convert-links \
  --adjust-extension \
  --page-requisites \
  --no-parent \
  --directory-prefix=html \
  $BASE_URL

mkdir -p mdx

find html/wgholdings.co.nz/blog -name "*.html" | while read file; do
  filename=$(basename "$file" .html)

  pandoc "$file" \
    -f html \
    -t markdown+raw_html \
    --wrap=none \
    --extract-media=mdx/media \
    -o "mdx/$filename.mdx"
done
