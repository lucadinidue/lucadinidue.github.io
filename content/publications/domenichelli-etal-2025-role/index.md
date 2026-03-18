---
title: 'The Role of Eye-Tracking Data in Encoder-Based Models: An In-depth Linguistic Analysis'

# Authors
# If you created a profile for a user (e.g. the default `me` user), write the username (folder name) here
# and it will be replaced with their full name and linked to their profile.
authors:
  - Lucia Domenichelli
  - me
  - Dominique Brunato
  - Felice Dell’Orletta

date: '2025-09-24T00:00:00Z'

# Schedule page publish date (NOT publication's date).
publishDate: '2025-09-24T00:00:00Z'

# Publication type.
# Accepts a single type but formatted as a YAML list (for Hugo requirements).
# Enter a publication type from the CSL standard.
publication_types: ['paper-conference']

# Publication name and optional abbreviated publication name.
publication: In *Proceedings of the Eleventh Italian Conference on Computational Linguistics* (CLiC-it 2025)
publication_short: In *CLiC-it 2025*
venue_short: CLiC-it 2025

abstract: This paper falls within ongoing research aimed at enhancing the human interpretability of neural language models by incorporating physiological data. Specifically, we leverage eye-tracking data collected during reading to explore how such information can guide model behavior. We train a multilingual encoder model to predict eye-tracking features from the Multilingual Eye-tracking Corpus (MECO) and analyze the resulting shifts in model attention patterns, focusing on how attention redistributes across linguistically informed categories such as part of speech, word position, word length, and distance from the syntactic head after fine-tuning. Moreover, we test how this attention shift impacts the representation of the interested words in the embedding space. The study covers both Italian and English, enabling a cross-linguistic perspective on attention and representation shifts in multilingual encoders grounded in human reading behavior.

# # Summary. An optional shortened abstract.
# summary: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis posuere tellus ac convallis placerat. Proin tincidunt magna sed ex sollicitudin condimentum.

tags:
  - Eye-tracking
  - Attention
  - Representations

# Display this page in the Featured widget?
featured: false

# Standard identifiers for auto-linking
# hugoblox:
#   ids:
#     doi: 10.5555/123456

# Custom links
links:
  - type: pdf
    url: https://aclanthology.org/2025.clicit-1.41.pdf
  - type: code
    url: https://github.com/lucadinidue/eye_tracking_representations_shift
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
