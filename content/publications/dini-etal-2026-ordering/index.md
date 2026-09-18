---
title: 'On the Impact of Pretraining Data Ordering in Transformer Encoder- and Decoder-only Language Models'

# Authors
# If you created a profile for a user (e.g. the default `me` user), write the username (folder name) here
# and it will be replaced with their full name and linked to their profile.
authors:
  - me
  - Lucia Domenichelli
  - Dominique Brunato
  - Felice Dell’Orletta

date: '2026-03-24T00:00:00Z'

# Schedule page publish date (NOT publication's date).
# publishDate: '2026-09-24T00:00:00Z'

# Publication type.
# Accepts a single type but formatted as a YAML list (for Hugo requirements).
# Enter a publication type from the CSL standard.
publication_types: ['article-journal']

# Publication name and optional abbreviated publication name.
publication: "Knowledge-Based Systems, 342, 115850"
publication_short: "Knowledge-Based Systems"
venue_short: Knowledge-Based Systems

# NOTE: ScienceDirect blocks automated access, so this abstract was recovered from the
# (truncated) Google Scholar snippet. Please replace with the full text from the published PDF.
abstract: "Pretraining large language models typically relies on randomly ordered corpora, implicitly assuming that data order has limited impact on learning. However, curriculum learning suggests that the sequence of training examples can influence optimization and representation dynamics. In this work, we systematically examine pretraining data ordering as an independent design variable for transformer-based language models, analyzing how curriculum-inspired strategies affect learning trajectories, representations, and transfer performance. We pretrain encoder-only and decoder-only models under controlled conditions, varying only the ordering of training data according to readability-based complexity proxies and their inverted variants, alongside multiple random baselines. Beyond final accuracy, we adopt a multi-dimensional evaluation framework combining intrinsic metrics, linguistic probing across training stages [...]"

# # Summary. An optional shortened abstract.
# summary: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis posuere tellus ac convallis placerat. Proin tincidunt magna sed ex sollicitudin condimentum.

tags:
  - Curriculum Learning
  - Pretraining
  - Representations

# Display this page in the Featured widget?
featured: false

# Standard identifiers for auto-linking
hugoblox:
  ids:
    doi: 10.1016/j.knosys.2026.115850

# Custom links
links:
  - type: pdf
    url: https://doi.org/10.1016/j.knosys.2026.115850
# Featured image
# To use, add an image named `featured.jpg/png` to your page's folder.
# image:
#   caption: 'Image credit: [**Unsplash**](https://unsplash.com/photos/pLCdAaMFLTE)'
#   focal_point: ''
#   preview_only: false

# Associated Projects (optional).
#   Associate this publication with one or more of your projects.
#   Simply enter your project's folder or file name without extension.
#   E.g. `internal-project` references `content/project/internal-project/index.md`.
#   Otherwise, set `projects: []`.
# projects:
#   - example

# Slides (optional).
#   Associate this publication with Markdown slides.
#   Simply enter your slide deck's filename without extension.
#   E.g. `slides: "example"` references `content/slides/example/index.md`.
#   Otherwise, set `slides: ""`.
# slides: ""
---
